---
title: "Storage Strategy"
description: "My storage strategy for a K3s homelab: ephemeral node storage, persistent volumes, MinIO object storage, Weaviate vectors, and an RTX 3090 box as the fast tier."
date: 2026-01-12
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - storage
  - strategy
draft: false
slug: storage-strategy
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/34-storage-strategy.jpg
---

# Storage Strategy

## Introduction

My homelab storage strategy splits data by how it behaves: stateless pods use ephemeral node storage, databases and app state use Kubernetes persistent volumes, files and datasets go to MinIO object storage, vectors live in Weaviate, and the RTX 3090 machine's local SSD is the fast tier for model weights and training data. Backups live off-node, and configuration lives in Git. In a homelab built around a 7-node K3s cluster and a dedicated GPU workstation, storage is one of the most critical design decisions. Unlike traditional cloud environments where storage is abstracted, a self-hosted rack demands intentional planning around persistence, redundancy, performance, and scalability.

My goal is to create a storage strategy that supports multiple workloads: Kubernetes deployments, CI/CD pipelines with Gitea runners, AI workloads running in Docker containers, and long-term data storage for applications like my Bible app, logs, and user-generated content. This system needs to stay flexible enough to evolve as I expand the rack while remaining simple enough to debug and maintain.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For the full architecture, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

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
- Three Jetson Orin Nano Super GPU workers, each booted from NVMe
- A dedicated development machine with GPU (RTX 3090)
- External storage devices attached via USB and network shares
- Model weights on each Jetson's NVMe for in-cluster inference, plus larger models on the 3090 machine

Because of this hybrid setup, storage is not centralized in a single SAN/NAS appliance. Instead, it is distributed across multiple layers:

1. **Local NVMe / SSD on the dev machine**
   - High-speed workloads (AI models, embeddings, local caching)
   - Temporary datasets for training and inference

2. **K3s node storage (SD/SSD on the Pis, NVMe on the Jetsons)**
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
- Object storage in MinIO, including a bucket for training datasets
- Vector data in Weaviate (the VerseHub verses and Church Fathers collections)
- User uploads (profile images, media content)
- Application state (Bible app features like journals, notes, achievements)

For persistence, I lean toward:
- Network File System (NFS)-style shares or NAS-mounted volumes
- Kubernetes Persistent Volumes (PVs) and Persistent Volume Claims (PVCs)
- Backup snapshots stored off-node

This abstraction allows pods to be rescheduled without data loss, which is critical for cluster reliability. The hands-on setup is in [Persistent Volumes](/blog/infrastructureengineering/09-persistent-volumes), and why MinIO became the object layer is in [MinIO and Distributed AI Storage](/blog/ai-homelab-engineering/07-minio-and-distributed-ai-storage).

---

## Development Machine as a Storage Accelerator

My GPU-enabled dev machine acts as a “performance tier” in the storage hierarchy.

It handles:
- AI model weights and inference caching
- Docker volumes for heavy computation containers
- Temporary datasets for training or embedding generation
- Fast read/write workloads that would bottleneck Pi nodes

This prevents the Kubernetes cluster from being overloaded with workloads it was not designed to handle.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how this fits into the production infrastructure it was built for."
destinationUrl: "/systems/infrastructure"
---
::

---

*Explore more articles in the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

---

## Backup Strategy

A key part of this system is redundancy.

My approach includes:

- **Local backups**: periodic snapshots of critical volumes
- **Off-node backups**: copies stored outside the cluster (external drives or NAS)
- **Application-level backups**: database dumps for PostgreSQL and structured exports for app data
- **Git-based backup for configs**: infrastructure-as-code stored in [self-hosted Gitea](/blog/infrastructureengineering/40-why-self-hosted-git)

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

::CtaContactWork
---
buttonText: "Let's Talk About Your Storage Strategy"
supportingCopy: "Planning persistent storage and backups for your own homelab cluster? Let's talk through the tiers."
destinationUrl: "/hire-me"
---
::

---

## Conclusion

This storage strategy is designed around the reality of a hybrid homelab: lightweight Kubernetes nodes, a powerful GPU development machine, and distributed storage rather than enterprise SAN hardware. By separating ephemeral and persistent workloads, leveraging network-based storage for shared data, and using the dev machine as a performance tier, the system stays both flexible and resilient.

The end goal is not just storage that works today, but a foundation that can scale with my infrastructure—from a Raspberry Pi cluster into a full multi-node AI and application platform powering my Bible app, CI/CD pipelines, and future services.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Pi Cluster Blueprint"
  supportingCopy: "Get the Raspberry Pi AI Cluster Blueprint — hardware list, network diagram, node roles, folder structures, Kubernetes manifests, and a troubleshooting checklist ($19)."
  destinationUrl: "/products/raspberry-pi-ai-cluster-blueprint"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Systems Thinking"
  supportingCopy: "Continue with \"Systems Thinking\" to see the broader mental model behind decisions like this storage strategy."
  destinationUrl: "/blog/infrastructureengineering/35-systems-thinking"
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
  - label: "Network-Attached Storage — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Network-attached_storage"
    type: "wikipedia"
    description: "According to this overview, NAS provides centralized file storage accessible over a network — the future storage tier planned for the homelab as the cluster grows beyond local-disk-per-node storage."
  - label: "Network File System — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Network_File_System"
    type: "wikipedia"
    description: "Overview of NFS — the network storage protocol used for shared persistent volumes accessible across multiple cluster nodes, enabling cross-node data access without a full distributed storage system."
  - label: "Kubernetes — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes"
    type: "wikipedia"
    description: "According to this overview, Kubernetes separates pod lifecycle from storage through PersistentVolumes — the abstraction that makes the ephemeral/persistent workload split possible without changing application code."
  - label: "Backup — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Backup"
    type: "wikipedia"
    description: "Overview of backup strategies — the data protection layer described as a first-class system concern, with nightly snapshots, database dumps, and off-node copies ensuring recovery when homelab hardware fails."
---
::

---

## Related reading

- [Separation of Workloads](/blog/infrastructureengineering/33-separation-of-workloads) — previous in the series.
- [Systems Thinking](/blog/infrastructureengineering/35-systems-thinking) — next in the series.
- [Infrastructure systems overview](/systems/infrastructure) — the hub for the full cluster architecture.
- [MinIO Storage Strategy](/blog/versehub-engineering/08-minio-storage-strategy) — how VerseHub uses the object storage layer.

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*