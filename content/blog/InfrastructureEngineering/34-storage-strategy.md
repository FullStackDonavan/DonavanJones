---
title: "Storage Strategy"
description: "My storage strategy for homelab Kubernetes workloads — local volumes for performance, NFS for shared access, and Longhorn for distributed replication."
date: 2026-01-12
category: "infrastructure-engineering"
tags:
  - storage
  - strategy
draft: false
slug: storage-strategy
author: Donavan Jones
---

# Storage Strategy

## Introduction

In a homelab environment built around a Raspberry Pi-based K3s cluster and a dedicated development machine with a powerful GPU node, storage becomes one of the most critical design decisions. Unlike traditional cloud environments where storage is abstracted, a self-hosted rack demands intentional planning around persistence, redundancy, performance, and scalability.

My goal is to create a storage strategy that supports multiple workloads: Kubernetes deployments, CI/CD pipelines with Gitea runners, AI workloads running in Docker containers, and long-term data storage for applications like my Bible app, logs, and user-generated content. This system needs to stay flexible enough to evolve as I expand the rack while remaining simple enough to debug and maintain.

---

## Core Principles

Before choosing any storage solution, I built the system around a few guiding principles:

- **Simplicity first** – fewer moving parts means fewer failure points in a homelab
- **Separation of concerns** – compute nodes should not be tightly coupled to storage logic
- **Resilience over raw performance** – stability matters more than peak speed for most workloads
- **Portability** – workloads should be able to move between nodes or environments
- **Incremental scalability** – storage should grow with the rack, not require redesigns

---

## Physical Storage Layout (Rack Design Context)

My rack setup includes a mix of:

- Raspberry Pi nodes running a K3s cluster (worker + control plane)
- A dedicated development machine with GPU (RTX 3090)
- External storage devices attached via USB and network shares
- Docker-based model containers running outside the cluster (for now)

Because of this hybrid setup, storage is not centralized in a single SAN/NAS appliance. Instead, it is distributed across multiple layers:

1. **Local NVMe / SSD on the dev machine**
   - High-speed workloads (AI models, embeddings, local caching)
   - Temporary datasets for training and inference

2. **K3s node storage (SD/SSD depending on node)**
   - Lightweight workloads
   - Ephemeral container storage
   - Small services and configs

3. **Network storage layer (NAS-style approach)**
   - Shared persistent volumes
   - Media, backups, application data (Bible app uploads, logs, artifacts)

---

## Kubernetes Storage Strategy (K3s)

Within the K3s cluster, I treat storage in two categories:

### 1. Ephemeral Storage

Used for:
- Stateless microservices
- CI/CD runners (Gitea pipelines)
- Temporary processing jobs

This relies on:
- Node-local storage
- Container ephemeral filesystem
- Automatic pod rescheduling without persistence guarantees

This keeps the cluster lightweight and avoids unnecessary storage complexity on Pi nodes.

---

### 2. Persistent Storage

Used for:
- Database workloads (PostgreSQL, Redis persistence where needed)
- User uploads (profile images, media content)
- Application state (Bible app features like journals, notes, achievements)

For persistence, I lean toward:
- Network File System (NFS)-style shares or NAS-mounted volumes
- Kubernetes Persistent Volumes (PVs) and Persistent Volume Claims (PVCs)
- Backup snapshots stored off-node

This abstraction allows pods to be rescheduled without data loss, which is critical for cluster reliability.

---

## Development Machine as a Storage Accelerator

My GPU-enabled dev machine acts as a “performance tier” in the storage hierarchy.

It handles:
- AI model weights and inference caching
- Docker volumes for heavy computation containers
- Temporary datasets for training or embedding generation
- Fast read/write workloads that would bottleneck Pi nodes

This prevents the Kubernetes cluster from being overloaded with workloads it was not designed to handle.

---

## Backup Strategy

A key part of this system is redundancy.

My approach includes:

- **Local backups**: periodic snapshots of critical volumes
- **Off-node backups**: copies stored outside the cluster (external drives or NAS)
- **Application-level backups**: database dumps for PostgreSQL and structured exports for app data
- **Git-based backup for configs**: infrastructure-as-code stored in Gitea

The guiding idea is simple:
> If a node dies, nothing important should be lost.

---

## Data Flow in My System

A typical flow looks like this:

1. User uploads content (Bible app, profile data, etc.)
2. Request hits Kubernetes service
3. Data is written to a persistent volume (NAS/NFS layer)
4. Metadata is stored in PostgreSQL running in the cluster
5. Heavy processing (if needed) is offloaded to the GPU dev machine
6. Results are cached locally or persisted depending on use case

This hybrid flow keeps latency low while maintaining durability.

---

## Scalability Path

As the rack grows, the storage strategy evolves toward:

- Dedicated NAS appliance (TrueNAS or similar)
- Migration of persistent volumes from ad-hoc shares to structured storage classes
- Potential Ceph or distributed storage layer if cluster expands beyond homelab scale
- Separation of “hot”, “warm”, and “cold” storage tiers

This ensures I don’t need to redesign the system as complexity increases.

---

## Conclusion

This storage strategy is designed around the reality of a hybrid homelab: lightweight Kubernetes nodes, a powerful GPU development machine, and distributed storage rather than enterprise SAN hardware. By separating ephemeral and persistent workloads, leveraging network-based storage for shared data, and using the dev machine as a performance tier, the system stays both flexible and resilient.

The end goal is not just storage that works today, but a foundation that can scale with my infrastructure—from a Raspberry Pi cluster into a full multi-node AI and application platform powering my Bible app, CI/CD pipelines, and future services.

---