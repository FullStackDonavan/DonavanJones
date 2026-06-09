---
title: "Persistent Volumes"
description: "How persistent volumes and persistent volume claims work in a K3s homelab — storage classes, binding, and real workload data persistence strategies."
date: 2025-10-16
category: "infrastructure-engineering"
tags:
  - storage
  - kubernetes
draft: false
slug: persistent-volumes
author: Donavan Jones
---

# Persistent Volumes

## Introduction

In a distributed Kubernetes environment, pods are ephemeral by design. That means any data written inside a container is lost when the pod is restarted, rescheduled, or replaced. For a homelab setup like my Raspberry Pi–based K3s cluster inside my rack, this becomes a critical issue when running stateful workloads such as databases, Gitea, monitoring tools, or AI services that rely on cached data and persistent storage.

To solve this, I use Persistent Volumes (PVs) and Persistent Volume Claims (PVCs) to decouple storage from pod lifecycles. This allows my workloads to survive node restarts, upgrades, and redeployments without data loss, which is especially important in a low-power ARM64 cluster where nodes may occasionally cycle due to updates or testing.

In my rack setup, storage is distributed across mounted external drives connected to Raspberry Pi nodes, with K3s handling orchestration and binding storage dynamically where needed.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

---

## Persistent Volume Architecture in My Cluster

My cluster uses a hybrid storage model:

- Each Raspberry Pi node in the rack has:
  - A mounted SSD or high-endurance SD card
  - A dedicated mount path such as `/mnt/storage` or `/mnt/ssd`
- K3s manages workloads across nodes
- Local storage is exposed via Persistent Volumes using `hostPath` or a lightweight provisioner

For more stable workloads (like databases), I prefer pinning storage to specific nodes with labels such as:

```bash
kubectl label node pi-node-1 storage=fast-ssd
```

This ensures workloads with heavy I/O don’t land on weaker nodes.

## Example Persistent Volume (HostPath)
For simple homelab workloads, I often use hostPath volumes:

```bash
apiVersion: v1
kind: PersistentVolume
metadata:
  name: gitea-pv
spec:
  capacity:
    storage: 20Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: manual
  hostPath:
    path: /mnt/storage/gitea
```

This works well in my rack because each node has a known directory structure that is backed by physical storage.

## Persistent Volume Claim
Applications request storage through PVCs rather than directly referencing nodes:

```bash
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: gitea-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: manual
  resources:
    requests:
      storage: 20Gi
```
K3s binds this claim to an available PV that matches the request.

## Storage Strategy for My Homelab Rack
Because my cluster is ARM64-based and runs on Raspberry Pi nodes, I avoid overly complex distributed storage systems unless necessary. Instead, I use a tiered approach:

### 1. Local SSD-backed storage (Primary)

Used for:

- Databases (PostgreSQL, MySQL)
- Gitea repositories
- CI/CD runners
- Stateful AI services
### 2. Shared network storage (Optional layer)

Used for:

- Backups
- Media files
- Cross-node accessible artifacts
### 3. Ephemeral storage

Used for:

- Temporary containers
- Build pipelines
- Stateless microservices

This keeps the system lightweight while still giving me reliability where it matters.

---

*Explore more articles in the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

---

## K3s Considerations on ARM64 Nodes

Running Kubernetes on Raspberry Pi hardware introduces some constraints:

- SD cards are unreliable for heavy write workloads → SSD preferred
- Node failures are more common than in enterprise hardware
- Storage performance varies per node
- Scheduling must be intentional for stateful workloads

To handle this, I often combine:

- Node affinity rules
- Storage class separation
- Explicit volume binding
- Backup scripts running through cron jobs or CI pipelines (via Gitea runners in my cluster)

## Backup and Recovery Strategy

Persistent volumes are only part of the solution. In my rack, I treat backups as a first-class system:

- Nightly backups of /mnt/storage
- Database dumps for PostgreSQL services
- Gitea repository mirroring
- Snapshot-style folder duplication to another node or external drive

This ensures that even if a Raspberry Pi fails completely, the system can be rebuilt quickly.

## Conclusion

Persistent volumes are the foundation that turns a Kubernetes homelab from a stateless experiment into a reliable infrastructure platform. In my Raspberry Pi–based rack, PVs allow me to run real workloads like Gitea, databases, and CI pipelines without worrying about node restarts or redeployments wiping data.

By combining local SSD-backed storage, careful node scheduling, and a simple but effective backup strategy, I can maintain a lightweight yet resilient storage layer that fits the constraints of ARM64 hardware while still behaving like production-grade infrastructure.

As the cluster grows, this storage layer becomes the backbone for everything else—CI/CD, AI services, and future distributed applications.

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*
