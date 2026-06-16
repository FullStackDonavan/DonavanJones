---
title: "Loki and Promtail on a Pi K3s Cluster"
description: "Deploying Loki for log aggregation and Promtail as a DaemonSet on an ARM64 Raspberry Pi k3s cluster — including the troubleshooting steps needed to get pod log collection working."
date: 2026-07-03
lastUpdated: "2026-07-03"
category: "infrastructure-engineering"
tags:
  - loki
  - promtail
  - kubernetes
  - logging
  - arm64
  - raspberry-pi
  - k3s
draft: true
cluster: "infrastructure-engineering"
slug: loki-promtail-on-pi-cluster
author: Donavan Jones
---

Loki handles log aggregation the same way Prometheus handles metrics — it ingests, indexes, and stores log streams from across the cluster so they can be queried in Grafana. Promtail is the collection agent: a DaemonSet that runs on every node, reads pod log files from the host filesystem, and ships them to Loki. This article covers the deployment and the non-obvious troubleshooting required to get Promtail collecting logs on k3s.

# Loki and Promtail on a Pi K3s Cluster

Cluster-wide log aggregation on ARM64 using Loki for storage and Promtail as a node-level collection DaemonSet.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

---

## Architecture

```
Pod stdout/stderr
      │
      ▼
/var/log/pods/<ns>_<pod>_<uid>/<container>/<n>.log   (written by containerd on each node)
      │
      ▼
Promtail (DaemonSet — one pod per node, mounts /var/log/pods from host)
      │
      ▼
Loki (Deployment — stores log chunks on a PVC)
      │
      ▼
Grafana (queries Loki via LogQL)
```

Promtail reads log files directly from the host filesystem rather than using the Docker socket or a sidecar, which is the correct approach for containerd-based clusters like k3s.

---

## Prerequisites

- K3s cluster with ARM64 nodes
- `local-path` storage provisioner
- Grafana deployed (see [Grafana on a Pi K3s Cluster](/blog/infrastructure-engineering/grafana-on-pi-cluster))

---

## Loki Configuration

Loki runs in single-binary mode with filesystem storage — appropriate for a homelab cluster where a single replica is acceptable. The config is stored in a ConfigMap and mounted at `/etc/loki/loki.yaml`.

Key settings:

```yaml
auth_enabled: false

common:
  storage:
    filesystem:
      chunks_directory: /loki/chunks
      rules_directory: /loki/rules
  replication_factor: 1
  ring:
    kvstore:
      store: inmemory

limits_config:
  retention_period: 168h    # 7 days

compactor:
  retention_enabled: true
  delete_request_store: filesystem
```

`auth_enabled: false` removes the tenant header requirement — correct for a single-tenant homelab setup. The 7-day retention keeps storage bounded on the 20 Gi PVC.

---

## Loki Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: loki
  namespace: loki
spec:
  replicas: 1
  template:
    spec:
      nodeSelector:
        kubernetes.io/arch: arm64
      securityContext:
        fsGroup: 10001
        runAsUser: 10001
        runAsNonRoot: true
      containers:
        - name: loki
          image: grafana/loki:latest
          args:
            - -config.file=/etc/loki/loki.yaml
          ports:
            - name: http
              containerPort: 3100
```

Loki's official image includes an ARM64 variant. It runs as uid 10001.

---

## Promtail RBAC

Promtail discovers pod metadata from the Kubernetes API to enrich log labels. It needs read access to pods, nodes, and services:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: promtail
rules:
  - apiGroups: [""]
    resources: [nodes, services, pods]
    verbs: [get, list, watch]
```

---

## Promtail DaemonSet

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: promtail
  namespace: loki
spec:
  template:
    spec:
      nodeSelector:
        kubernetes.io/arch: arm64
      tolerations:
        - key: node-role.kubernetes.io/control-plane
          operator: Exists
          effect: NoSchedule
      containers:
        - name: promtail
          image: grafana/promtail:latest
          securityContext:
            privileged: true
            runAsUser: 0
          volumeMounts:
            - name: varlog
              mountPath: /var/log
              readOnly: true
            - name: pods
              mountPath: /var/log/pods
              readOnly: true
      volumes:
        - name: varlog
          hostPath:
            path: /var/log
        - name: varlibdockercontainers
          hostPath:
            path: /var/log/pods
```

Two things matter here that aren't obvious:

**Toleration for the control plane.** Without it, the DaemonSet won't schedule on the control plane node, leaving it without log collection.

**`privileged: true` and `runAsUser: 0`.** On this k3s setup, `/var/log/pods/` is owned by root and requires elevated access. Without these, Promtail starts but reports "Unable to find any logs to tail" even though the volume is mounted correctly.

---

## Promtail Scrape Configuration

The first config attempt used Kubernetes SD (`kubernetes_sd_configs`) to discover pods and build log file paths using the pod UID:

```yaml
# This did NOT work on k3s
- replacement: /var/log/pods/*$1/*.log
  separator: /
  source_labels: [__meta_kubernetes_pod_uid, __meta_kubernetes_pod_container_name]
  target_label: __path__
```

The intent was correct — k3s stores logs at:
```
/var/log/pods/<namespace>_<pod-name>_<uid>/<container>/<n>.log
```

But the glob pattern `*<uid>/<container>/*.log` failed to resolve in Promtail 3.x. The fix is to skip the kubernetes SD file path approach entirely and use a static glob that matches the actual three-level directory structure directly:

```yaml
scrape_configs:
  - job_name: kubernetes-pods
    static_configs:
      - targets: ['localhost']
        labels:
          job: kubernetes-pods
          __path__: /var/log/pods/*/*/*.log
    pipeline_stages:
      - cri: {}
      - regex:
          expression: '/var/log/pods/(?P<namespace>[^_]+)_(?P<pod>[^_]+)_[^/]+/(?P<container>[^/]+)/[^/]+$'
          source: filename
      - labels:
          namespace:
          pod:
          container:
```

`/var/log/pods/*/*/*.log` matches the three-level structure (`namespace_pod_uid/container/n.log`) without needing to know the UID in advance. The `regex` pipeline stage then extracts `namespace`, `pod`, and `container` from the file path and attaches them as Loki labels, giving the same searchability as the kubernetes SD approach.

---

## Deploying

```bash
kubectl apply -f /home/donavan/Loki/namespace.yaml
kubectl apply -f /home/donavan/Loki/
```

Check status:

```bash
kubectl get pods -n loki -o wide
kubectl logs -n loki daemonset/promtail
```

A healthy deployment shows Loki `1/1` and all Promtail pods (one per node) `1/1`.

---

## Querying Logs in Grafana

In Grafana → Explore → Loki:

```logql
# All logs from a namespace
{namespace="kube-system"}

# Errors across all pods
{job="kubernetes-pods"} |= "error"

# Logs from a specific service
{pod=~"scholar.*"}

# Filter by container
{container="loki"}

# Combine filters
{namespace="loki"} |~ "(?i)error|warn"
```

---

## Conclusion

Loki and Promtail on k3s works well once two issues are resolved: the control plane toleration so every node gets a Promtail pod, and the `privileged: true` security context so Promtail can actually read from `/var/log/pods/`. The static glob scrape config is simpler and more reliable than the kubernetes SD path-building approach for this version of Promtail on k3s.

With all three components running — Prometheus, Loki, and Grafana — the cluster has full observability: metrics and logs from every pod on every node queryable from a single Grafana instance.

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "Grafana Loki — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Grafana#Loki"
    type: "wikipedia"
    description: "Overview of Grafana Loki as a log aggregation system — the log storage backend deployed on the Raspberry Pi K3s cluster described in this article."
  - label: "Kubernetes DaemonSet"
    url: "https://en.wikipedia.org/wiki/Kubernetes"
    type: "wikipedia"
    description: "Overview of Kubernetes as a container orchestration platform — the system that manages the Promtail DaemonSet scheduling one log collection pod per cluster node."
  - label: "ARM architecture — Wikipedia"
    url: "https://en.wikipedia.org/wiki/ARM_architecture_family"
    type: "wikipedia"
    description: "Overview of the ARM processor architecture — the ARM64 hardware platform on which both Loki and Promtail run as multi-arch container images on Raspberry Pi nodes."
---
::

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*
