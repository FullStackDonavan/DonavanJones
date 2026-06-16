---
title: "Prometheus on a Pi K3s Cluster"
description: "How to deploy Prometheus as a Kubernetes pod on an ARM64 Raspberry Pi k3s cluster — RBAC, scrape config, persistent storage, and cluster-wide metrics collection."
date: 2026-06-13
lastUpdated: "2026-06-13"
category: "infrastructure-engineering"
tags:
  - prometheus
  - kubernetes
  - monitoring
  - arm64
  - raspberry-pi
  - k3s
draft: false
cluster: "infrastructure-engineering"
slug: prometheus-on-pi-cluster
author: Donavan Jones
---

This article covers deploying Prometheus as a pod inside a K3s cluster running on Raspberry Pi ARM64 nodes. Rather than running Prometheus as a bare binary on the host, embedding it in Kubernetes keeps it managed by the same orchestration layer as everything else — automatic restarts, persistent storage via PVCs, and scrape targets discovered directly from the cluster's own API.

# Prometheus on a Pi K3s Cluster

Cluster-wide metrics collection using Prometheus deployed as a native Kubernetes workload on ARM64.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

---

## Why Run Prometheus Inside Kubernetes

Running Prometheus as a host binary works, but it creates a two-tier system where the monitoring tool sits outside the thing it monitors. Running it as a pod means:

- RBAC controls what it can scrape
- PVCs handle retention across pod restarts
- ConfigMaps version the scrape config alongside the rest of the manifests
- The same `kubectl` workflow manages it as any other workload

The `prom/prometheus` image is multi-arch and includes an `linux/arm64` variant, so no special handling is needed for the Pi hardware.

---

## Prerequisites

- K3s cluster with ARM64 nodes
- `local-path` storage provisioner (ships with K3s by default — verify with `kubectl get storageclass`)
- `kubectl` configured to reach the cluster

---

## Namespace

```bash
kubectl apply -f namespace.yaml
```

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: prometheus
```

---

## RBAC

Prometheus needs `get`, `list`, and `watch` on nodes, pods, endpoints, and services to perform Kubernetes service discovery. Without this, it can only scrape static targets.

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: prometheus
  namespace: prometheus
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: prometheus
rules:
  - apiGroups: [""]
    resources: [nodes, nodes/proxy, nodes/metrics, services, endpoints, pods]
    verbs: [get, list, watch]
  - nonResourceURLs: ["/metrics", "/metrics/cadvisor"]
    verbs: [get]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: prometheus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: prometheus
subjects:
  - kind: ServiceAccount
    name: prometheus
    namespace: prometheus
```

---

## Scrape Configuration

The ConfigMap holds `prometheus.yml`. On a Pi cluster, I set `scrape_interval: 30s` to keep CPU and memory usage modest.

Key scrape jobs:

| Job | What it scrapes |
|---|---|
| `prometheus` | Prometheus itself on `localhost:9090` |
| `kubernetes-apiservers` | K3s API server |
| `kubernetes-nodes` | Kubelet metrics on each node |
| `kubernetes-cadvisor` | Container CPU/memory via `/metrics/cadvisor` |
| `kubernetes-pods` | Any pod with annotation `prometheus.io/scrape: "true"` |

The kubelet and cAdvisor jobs use HTTPS with the pod's service account bearer token — the cluster CA and token are automatically mounted at the standard paths inside the container.

---

## Persistent Storage

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: prometheus-pvc
  namespace: prometheus
spec:
  accessModes: [ReadWriteOnce]
  resources:
    requests:
      storage: 10Gi
  storageClassName: local-path
```

10 Gi is sufficient for 15-day retention across a small cluster. The `local-path` provisioner backs this with a directory on whichever node the pod lands on.

---

## Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
  namespace: prometheus
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      nodeSelector:
        kubernetes.io/arch: arm64
      serviceAccountName: prometheus
      securityContext:
        fsGroup: 65534
        runAsUser: 65534
        runAsNonRoot: true
      containers:
        - name: prometheus
          image: prom/prometheus:latest
          args:
            - --config.file=/etc/prometheus/prometheus.yml
            - --storage.tsdb.path=/prometheus
            - --storage.tsdb.retention.time=15d
            - --web.enable-lifecycle
          ports:
            - containerPort: 9090
```

`nodeSelector: kubernetes.io/arch: arm64` ensures the pod only schedules on ARM64 nodes. The `nobody` user (65534) satisfies the non-root requirement for the official image.

`--web.enable-lifecycle` exposes `/-/reload` so the scrape config can be reloaded without restarting the pod:

```bash
curl -X POST http://192.168.1.219:30909/-/reload
```

---

## Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: prometheus
  namespace: prometheus
spec:
  type: NodePort
  selector:
    app: prometheus
  ports:
    - port: 9090
      targetPort: 9090
      nodePort: 30909
```

UI accessible at `http://<node-ip>:30909`.

---

## Deploying

```bash
kubectl apply -f namespace.yaml
kubectl apply -f prometheus-rbac.yaml
kubectl apply -f prometheus-configmap.yaml
kubectl apply -f prometheus-pvc.yaml
kubectl apply -f prometheus.yaml
kubectl apply -f prometheus-service.yaml
```

The namespace must exist before anything else — apply it separately first, then apply the directory.

---

## Verifying Scrape Targets

Navigate to `http://192.168.1.219:30909/targets`. Every configured scrape job appears here with its state (`UP` or `DOWN`).

Running `up` in the query UI returns one row per scrape target:

```
up{instance="localhost:9090", job="prometheus"}                    1
up{instance="192.168.1.219:6443", job="kubernetes-apiservers"}    1
up{instance="pi-node1", job="kubernetes-nodes"}                   1
up{instance="pi-worker-3", job="kubernetes-cadvisor"}             1
```

A value of `0` means the target is unreachable. In my cluster, two nodes (`raspberrypi` and `pi-node-redis`) showed `0` — both had dropped off the cluster, which Prometheus surfaced immediately.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how this fits into the production infrastructure it was built for."
destinationUrl: "/systems/infrastructure"
---
::

---

## Useful Queries

```promql
# Pod count per namespace
count by (namespace) (kube_pod_info)

# Container restarts in the last hour
increase(kube_pod_container_status_restarts_total[1h])

# Pods not in Running state
kube_pod_status_phase{phase!="Running"}
```

Node-level CPU and memory queries require `node_exporter` running on each Pi:

```bash
sudo apt install prometheus-node-exporter -y
```

::CtaContactWork
---
buttonText: "Let's Talk About Your Cluster's Observability"
supportingCopy: "Setting up monitoring for your own Kubernetes cluster? Let's talk through the scrape config and RBAC."
destinationUrl: "/hire-me"
---
::

---

## Conclusion

Prometheus running as a K3s pod gives full cluster visibility with minimal operational overhead. The RBAC setup lets it auto-discover every node and pod without manual target configuration. On ARM64 Pi hardware, the resource footprint at 30-second scrape intervals is well within what a single Pi node can sustain alongside other workloads.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Pi Cluster Blueprint"
  supportingCopy: "Get the Raspberry Pi AI Cluster Blueprint — hardware list, network diagram, node roles, folder structures, Kubernetes manifests, and a troubleshooting checklist ($19)."
  destinationUrl: "/products/raspberry-pi-ai-cluster-blueprint"
  price: "$19"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Grafana on a Pi K3s Cluster"
  supportingCopy: "Continue with \"Grafana on a Pi K3s Cluster\" to turn these Prometheus metrics into dashboards."
  destinationUrl: "/blog/infrastructureengineering/42-grafana-on-pi-cluster"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get new infrastructure engineering breakdowns delivered before they're public."
  ---
  :::
::

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "Prometheus — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Prometheus_(software)"
    type: "wikipedia"
    description: "Overview of Prometheus as an open-source monitoring and alerting toolkit — the metrics collection system deployed across the Raspberry Pi K3s cluster described in this article."
  - label: "Kubernetes — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes"
    type: "wikipedia"
    description: "Overview of Kubernetes as a container orchestration system — the platform on which Prometheus is deployed and from which it discovers scrape targets via the API server."
  - label: "ARM architecture — Wikipedia"
    url: "https://en.wikipedia.org/wiki/ARM_architecture_family"
    type: "wikipedia"
    description: "Overview of the ARM processor architecture — the hardware platform (ARM64) on which the Raspberry Pi nodes run and that determines image compatibility for container workloads."
---
::

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*
