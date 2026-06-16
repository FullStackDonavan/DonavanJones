---
title: "Grafana on a Pi K3s Cluster"
description: "Deploying Grafana as a Kubernetes pod on an ARM64 Raspberry Pi k3s cluster with auto-provisioned Prometheus and Loki datasources."
date: 2026-06-29
lastUpdated: "2026-06-29"
category: "infrastructure-engineering"
tags:
  - grafana
  - kubernetes
  - monitoring
  - dashboards
  - arm64
  - raspberry-pi
  - k3s
draft: true
cluster: "infrastructure-engineering"
slug: grafana-on-pi-cluster
author: Donavan Jones
---

Grafana sits at the front of the observability stack — it connects to Prometheus for metrics and Loki for logs, giving a single UI to query and visualize everything happening across the cluster. This article covers deploying it as a Kubernetes pod on the Pi cluster with datasources provisioned automatically on first boot.

# Grafana on a Pi K3s Cluster

Unified metrics and log dashboards for the Pi K3s cluster, deployed as a native Kubernetes workload on ARM64.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

---

## Prerequisites

- Prometheus running in the `prometheus` namespace (see [Prometheus on a Pi K3s Cluster](/blog/infrastructure-engineering/prometheus-on-pi-cluster))
- Loki running in the `loki` namespace (optional but recommended — see [Loki on a Pi K3s Cluster](/blog/infrastructure-engineering/loki-on-pi-cluster))
- `local-path` storage provisioner available

---

## Namespace

```bash
kubectl apply -f namespace.yaml
kubectl apply -f grafana/
```

The namespace must be applied before the other manifests since `kubectl apply -f <dir>` sends all files simultaneously and the namespace won't exist yet when the other resources hit the API.

---

## Credentials

Grafana's admin credentials are stored in a Secret and injected as environment variables:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: grafana-auth
  namespace: grafana
type: Opaque
stringData:
  GF_SECURITY_ADMIN_USER: admin
  GF_SECURITY_ADMIN_PASSWORD: changeme
```

Change `changeme` before exposing this outside the local network.

---

## Auto-Provisioning Datasources

The most useful Grafana feature for a self-managed cluster is datasource provisioning — Grafana reads YAML files from `/etc/grafana/provisioning/datasources/` at startup and registers datasources automatically. No manual setup in the UI.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-datasources
  namespace: grafana
data:
  datasources.yaml: |
    apiVersion: 1
    datasources:
      - name: Prometheus
        type: prometheus
        uid: prometheus
        url: http://prometheus.prometheus.svc.cluster.local:9090
        access: proxy
        isDefault: true
        jsonData:
          timeInterval: 30s
      - name: Loki
        type: loki
        uid: loki
        url: http://loki.loki.svc.cluster.local:3100
        access: proxy
```

Both URLs use in-cluster DNS (`svc.cluster.local`) so Grafana reaches Prometheus and Loki without going through NodePorts. The `timeInterval: 30s` on Prometheus matches the scrape interval configured in `prometheus.yml`.

This ConfigMap is mounted at `/etc/grafana/provisioning/datasources` in the pod.

---

## Persistent Storage

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: grafana-pvc
  namespace: grafana
spec:
  accessModes: [ReadWriteOnce]
  resources:
    requests:
      storage: 2Gi
  storageClassName: local-path
```

2 Gi is enough for dashboards, user preferences, and the SQLite database Grafana uses internally.

---

## Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  namespace: grafana
spec:
  replicas: 1
  selector:
    matchLabels:
      app: grafana
  template:
    metadata:
      labels:
        app: grafana
    spec:
      nodeSelector:
        kubernetes.io/arch: arm64
      securityContext:
        fsGroup: 472
        runAsUser: 472
        runAsNonRoot: true
      containers:
        - name: grafana
          image: grafana/grafana:latest
          ports:
            - containerPort: 3000
          envFrom:
            - secretRef:
                name: grafana-auth
          volumeMounts:
            - name: data
              mountPath: /var/lib/grafana
            - name: datasources
              mountPath: /etc/grafana/provisioning/datasources
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: grafana-pvc
        - name: datasources
          configMap:
            name: grafana-datasources
```

Grafana runs as uid 472 (the `grafana` user in the official image). `fsGroup: 472` ensures the PVC is writable by that user without running as root.

---

## Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: grafana
  namespace: grafana
spec:
  type: NodePort
  selector:
    app: grafana
  ports:
    - port: 3000
      targetPort: 3000
      nodePort: 30300
```

UI accessible at `http://<node-ip>:30300`.

---

## Verifying

```bash
kubectl get pods -n grafana -o wide
kubectl logs -n grafana deploy/grafana
```

The pod starts as `0/1` while Grafana initializes its SQLite database and reads the provisioning directory — it becomes `1/1` within about 30 seconds.

Once ready, navigate to `http://192.168.1.219:30300`. Log in with the credentials from the Secret. Both Prometheus and Loki will appear under **Connections → Data sources** without any manual configuration.

---

## Querying

**Prometheus (PromQL) — Explore → Prometheus:**

```promql
# All scrape targets and their up/down state
up

# Pod count per namespace
count by (namespace) (kube_pod_info)

# Container restarts in the last hour
increase(kube_pod_container_status_restarts_total[1h])
```

**Loki (LogQL) — Explore → Loki:**

```logql
# All logs from a namespace
{namespace="kube-system"}

# Errors across the whole cluster
{job="kubernetes-pods"} |= "error"

# Logs from a specific service
{pod=~"scholar.*"}
```

---

## Updating Datasources

If you add a datasource later (for example, adding Loki after Grafana is already running), update the ConfigMap and restart the deployment:

```bash
kubectl apply -f grafana-datasource-configmap.yaml
kubectl rollout restart deployment/grafana -n grafana
```

---

## Conclusion

Grafana on K3s with provisioned datasources means the full observability UI is ready the moment the pod starts — no clicking through setup wizards. Combined with Prometheus for metrics and Loki for logs, it gives a complete picture of cluster health from a single browser tab.

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "Grafana — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Grafana"
    type: "wikipedia"
    description: "Overview of Grafana as an open-source analytics and monitoring platform — the visualization layer connecting Prometheus metrics and Loki logs described in this article."
  - label: "Prometheus (software) — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Prometheus_(software)"
    type: "wikipedia"
    description: "Overview of Prometheus as a metrics collection system — the primary datasource provisioned into Grafana for cluster-wide monitoring on the Raspberry Pi K3s cluster."
  - label: "Kubernetes — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes"
    type: "wikipedia"
    description: "Overview of Kubernetes as a container orchestration system — the platform on which Grafana is deployed and from which it surfaces metrics and logs through its datasource integrations."
---
::

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*
