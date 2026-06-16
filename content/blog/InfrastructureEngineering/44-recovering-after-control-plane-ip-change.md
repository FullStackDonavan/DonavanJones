---
title: "Recovering a K3s Cluster After a Control Plane IP Change"
description: "What breaks when your K3s control plane gets a new IP address — and the exact steps to reconnect worker nodes, fix pending pods, and restore persistent storage services."
date: 2026-07-14
lastUpdated: "2026-07-14"
category: "infrastructure-engineering"
tags:
  - k3s
  - kubernetes
  - raspberry-pi
  - arm64
  - troubleshooting
  - networking
draft: true
cluster: "infrastructure-engineering"
slug: recovering-after-control-plane-ip-change
author: Donavan Jones
---

IP addresses change. DHCP leases expire, routers get rebooted, reservations get lost. When that happens to your K3s control plane, the cluster keeps running — but worker nodes can no longer register heartbeats, pods stuck on dead nodes stay stuck, and PVCs bound to local storage on unreachable nodes leave deployments Pending indefinitely. This article documents exactly what broke when my control plane IP changed from `192.168.1.229` to `192.168.1.219`, and how each piece was recovered.

# Recovering a K3s Cluster After a Control Plane IP Change

A practical recovery guide for when your K3s control plane gets a new IP — node reconnection, pending pod resolution, and PVC recovery.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

---

## The Cluster Before

Five nodes across three roles:

| Node | Role | IP | Status at time of incident |
|---|---|---|---|
| pi-node1 | control-plane | 192.168.1.219 (new) | Ready, SchedulingDisabled |
| pi-worker-3 | worker | 192.168.1.250 | Ready |
| charlie-desktop | worker | 192.168.1.145 | Ready |
| raspberrypi | worker | 192.168.1.55 | NotReady |
| pi-node-redis | worker | 192.168.1.104 | NotReady |

The control plane node (`pi-node1`) changed IP from `192.168.1.229` to `192.168.1.219`. The two NotReady nodes (`raspberrypi` and `pi-node-redis`) still had the old IP hardcoded in their k3s agent configuration. Because they couldn't reach the control plane, they went NotReady — and any pod that had been running on them was stuck in Terminating with no node to terminate it.

---

## What Broke

Immediately after the IP change, three categories of failure appeared:

**1. Worker nodes NotReady** — `raspberrypi` and `pi-node-redis` could not reach the API server and stopped reporting heartbeats. Kubernetes marked them NotReady after the default 40-second timeout.

**2. Pods stuck in Terminating** — Pods that had been running on the now-NotReady nodes were left in `Terminating` indefinitely. Kubernetes will not force-delete them automatically; they hang until the node comes back or you force-delete them.

**3. Replacement pods stuck Pending** — When the scheduler tried to reschedule workloads off the dead nodes, some replacement pods couldn't start because:
- Their PVC was already bound to `local-path` storage on a NotReady node (local-path volumes are node-local and cannot migrate)
- Their deployment had a `nodeSelector` pinning them to a specific hostname that was no longer available

---

## Reconnecting the Worker Nodes

The k3s agent stores the control plane URL in an environment file loaded by systemd. On each NotReady worker, the fix is:

```bash
# Find where the URL is stored
sudo cat /etc/systemd/system/k3s-agent.service.env
```

Output shows the old IP:

```
K3S_TOKEN='K10f471449e268db547ac56a1b5a76fc0dffc87edda5eea671a389d0c7be8e9ab19::server:4b8a56b97d38152daa0b624e37adac09'
K3S_URL='https://192.168.1.229:6443'
```

Update it and restart the agent:

```bash
sudo sed -i "s|https://192.168.1.229:6443|https://192.168.1.219:6443|" \
  /etc/systemd/system/k3s-agent.service.env

sudo systemctl daemon-reload
sudo systemctl restart k3s-agent
sudo systemctl status k3s-agent
```

If the config file does not exist at `/etc/rancher/k3s/config.yaml` (it did not in my setup), check the systemd service directly:

```bash
sudo systemctl cat k3s-agent | grep -i server
sudo cat /etc/systemd/system/k3s-agent.service
```

Run the same update on every NotReady worker. From the control plane you can do both at once:

```bash
for NODE in 192.168.1.55 192.168.1.104; do
  ssh donavan@$NODE \
    "sudo sed -i 's|https://192.168.1.229:6443|https://192.168.1.219:6443|' \
    /etc/systemd/system/k3s-agent.service.env && \
    sudo systemctl daemon-reload && \
    sudo systemctl restart k3s-agent"
done
```

Within 30–60 seconds, the nodes appear Ready:

```bash
kubectl get nodes -w
```

---

## Clearing Stuck Terminating Pods

Once nodes are back, most Terminating pods resolve on their own. Any that do not can be force-deleted:

```bash
kubectl delete pod <pod-name> -n <namespace> --force --grace-period=0
```

The `--force --grace-period=0` bypasses the normal termination handshake. Kubernetes removes the object from etcd immediately without waiting for the node to confirm the container stopped. Only use this when the node is genuinely unreachable or the pod has been Terminating for more than a few minutes.

---

## Fixing Pending Pods

### minio — nodeSelector pointed to a dead node

The minio deployment had its `nodeSelector` hardcoded to `kubernetes.io/hostname: raspberrypi`. When that node went NotReady, every new minio pod landed in Pending because the scheduler could not place it anywhere else.

Fix in `services/minio/minio.yaml`:

```yaml
# before
nodeSelector:
  kubernetes.io/hostname: raspberrypi

# after
nodeSelector:
  kubernetes.io/hostname: pi-worker-3
```

Also add `storageClassName: local-path` to `minio-pvc.yaml` if it is missing — without it the PVC may not bind correctly on k3s:

```yaml
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100Gi
  storageClassName: local-path
```

Since the original PVC was bound to storage on the now-migrated `raspberrypi` node, delete the old PVC (data was inaccessible anyway) and let local-path provision a fresh one:

```bash
kubectl delete pvc minio-pvc -n minio
kubectl apply -f services/minio/minio-pvc.yaml
kubectl apply -f services/minio/minio.yaml
```

### postgres — corrupted WAL from interrupted initialization

The postgres deployment uses `nodeSelector: kubernetes.io/arch: arm64`. That selector is broad enough that the scheduler placed the new pod on `pi-worker-3`, but the PVC came up with a corrupted data directory. The log told the story:

```
LOG:  record with incorrect prev-link 609D9000/1002F00 at 0/1C71498
LOG:  invalid checkpoint record
PANIC:  could not locate a valid checkpoint record
```

This happened because a previous pod had begun initializing the database directory on the new PVC, was interrupted mid-init (the deployment was re-applied before init completed), and left the WAL in an unrecoverable state. Since the PVC was brand new with no real data, the fix is to wipe it and let postgres reinitialize cleanly:

```bash
# Scale down so nothing holds the PVC
kubectl scale deployment postgres-db -n postgres --replicas=0

# Delete the corrupt PVC
kubectl delete pvc postgres-pvc -n postgres

# Wait ~10 seconds for local-path to clean up the directory
kubectl apply -f ~/postgres-pvc.yaml
kubectl scale deployment postgres-db -n postgres --replicas=1
```

A clean init produces:

```
PostgreSQL init process complete; ready for start up.
LOG:  database system is ready to accept connections
```

The nodeSelector was also tightened from `kubernetes.io/arch: arm64` to `kubernetes.io/hostname: pi-worker-3` in `services/PostgreSQL/postgres.yaml`. A broad arch selector works for scheduling flexibility, but when using `local-path` storage, pinning to a specific node is safer — it prevents the PVC from ever being created on a node that later disappears.

### redis — recovered automatically once nodes rejoined

The redis pods in both the `default` and `redis` namespaces were Pending because they had been scheduled to `pi-node-redis`. Once that node reconnected to the control plane (after the `K3S_URL` update), the scheduler could reach the node again and the pods transitioned to Running without any manifest changes.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how this fits into the production infrastructure it was built for."
destinationUrl: "/systems/infrastructure"
---
::

---

## Key Lessons

**`local-path` storage is node-local.** A PVC backed by `local-path` binds to one specific node the moment it is first provisioned. If that node goes NotReady, every pod that depends on the PVC is stuck. Use a `nodeSelector` that matches the intended storage node, or plan for the fact that PVC data does not survive node loss with this provisioner.

**Hardcoded hostnames in `nodeSelector` are fragile.** `kubernetes.io/hostname: raspberrypi` is fine while `raspberrypi` is healthy, but it creates a hard dependency. For workloads that can tolerate data loss on failure, use `kubernetes.io/arch: arm64` or a custom label that multiple nodes satisfy. For workloads that cannot tolerate data loss, accepting the hard dependency is reasonable — just document it.

**Force-deleting pods on NotReady nodes is safe.** Kubernetes will not remove the pod object from etcd while the node is unreachable, because it cannot confirm the container stopped. Force-deletion just removes the object. The actual container on the node cleans itself up when the node comes back and the agent reconnects.

**Check `k3s-agent.service.env`, not `/etc/rancher/k3s/config.yaml`.** When k3s is installed via the install script without a config file, the token and server URL end up in the systemd environment file, not in the YAML config. The config file may not exist at all.

---

## Verifying Recovery

```bash
# All nodes Ready
kubectl get nodes -o wide

# No Pending or Terminating pods in key namespaces
kubectl get pods -A | grep -v Running | grep -v Completed

# Confirm postgres is accepting connections
kubectl exec -n postgres deploy/postgres-db -- pg_isready

# Confirm minio console is reachable
curl -s -o /dev/null -w "%{http_code}" http://192.168.1.219:30901
```

::CtaContactWork
---
buttonText: "Let's Talk About Your Cluster's Recovery Plan"
supportingCopy: "Want a second pair of eyes on how your cluster handles node or network failures? Let's talk through the failure modes."
destinationUrl: "/hire-me"
---
::

---

## Conclusion

A control plane IP change is a low-drama event if you know where to look. The k3s agent URL lives in a systemd environment file, updating it takes one `sed` and a service restart, and nodes rejoin within a minute. The harder part is the downstream cascade: stuck pods, orphaned PVCs, and hardcoded node selectors that were fine until the cluster had fewer healthy nodes. Fixing those is mostly manifest hygiene — and the incident is a useful prompt to audit which deployments have single-node dependencies you haven't thought about.

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
  buttonText: "Read: Deploying an App on the Rack"
  supportingCopy: "Continue with \"Deploying an App on the Rack\" to see how a real application gets shipped onto this same recovered cluster."
  destinationUrl: "/blog/infrastructureengineering/45-deploying-an-app-on-the-rack"
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
  - label: "K3s — Wikipedia"
    url: "https://en.wikipedia.org/wiki/K3s"
    type: "wikipedia"
    description: "Overview of K3s as a lightweight Kubernetes distribution — the orchestration layer whose agent configuration and token-based join mechanism are central to the node reconnection steps in this article."
  - label: "Kubernetes — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes"
    type: "wikipedia"
    description: "Overview of Kubernetes architecture — understanding control plane vs. worker node separation explains why an IP change on the control plane disconnects all agents and leaves pod scheduling blocked."
  - label: "Persistent volume — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Persistent_storage"
    type: "wikipedia"
    description: "Overview of persistent storage concepts — the node-local nature of the local-path provisioner used in this cluster is the root cause of PVCs becoming unschedulable when a node goes NotReady."
  - label: "ARM architecture — Wikipedia"
    url: "https://en.wikipedia.org/wiki/ARM_architecture_family"
    type: "wikipedia"
    description: "Overview of ARM processor architecture — the hardware platform used by the Raspberry Pi nodes in this cluster, which determines image compatibility and nodeSelector strategy for workloads."
---
::

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*
