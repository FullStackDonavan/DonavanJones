---
title: "Storage Setup"
description: "How to configure persistent storage for a Raspberry Pi Kubernetes cluster using local volumes, NFS mounts, and Longhorn distributed storage."
date: 2025-10-10
category: "infrastructure-engineering"
tags:
  - storage
  - kubernetes
draft: false
cluster: "infrastructure-engineering"
slug: storage-setup
author: Donavan Jones
---

# Storage Setup

## Introduction

In a homelab environment like my Raspberry Pi–based K3s Kubernetes cluster, storage is one of the most important foundations to get right early. Unlike cloud environments where persistent volumes are abstracted and managed automatically, bare-metal clusters require intentional design decisions around persistence, reliability, and performance.

In my rack setup—which includes multiple Raspberry Pi nodes running K3s alongside other services in Docker on my development machine—storage has to remain simple, lightweight, and resilient. I don’t have enterprise SAN hardware, so the goal is to build a system that is easy to maintain, survives node restarts, and integrates cleanly with Kubernetes workloads like my Bible app backend, CI/CD pipelines using Gitea runners, and AI services running in containers.

This setup focuses on balancing simplicity and practicality while leaving room for scaling later.

---

## Storage Goals

Before choosing a solution, I defined a few core goals:

- Persistent data must survive pod restarts and node reboots  
- Minimal overhead for Raspberry Pi hardware  
- Easy backup and restore strategy  
- Works well with K3s without complex external dependencies  
- Flexible enough to support databases, file uploads, and application state  

Given my stack (FastAPI services, PostgreSQL, Redis, and app media storage), storage needs to support both structured and unstructured data.

---

## Storage Architecture Overview

My current homelab storage architecture is split into three layers:

### 1. Local Node Storage (Primary Layer)

Each Raspberry Pi node uses its own local storage (SD card or SSD depending on node role). This is used for:

- Kubernetes system data
- Container runtime storage
- Ephemeral workloads
- Temporary caching

This layer is fast and simple but not reliable for critical persistence on its own.

---

### 2. Persistent Volume Layer (K3s Local Path Provisioner)

For Kubernetes-native persistence, I use K3s’s built-in local path provisioner.

This allows me to create PersistentVolumeClaims (PVCs) that map directly to directories on the node filesystem.

Example use cases:

- PostgreSQL database storage
- Redis persistence (if enabled)
- Application uploads (user images, media, documents)
- Gitea repositories and CI artifacts

Typical path on nodes:

```bash
/var/lib/rancher/k3s/storage
```


This approach keeps everything lightweight and avoids needing external storage systems like NFS or Ceph.

---

### 3. External/Off-Cluster Storage (Development Machine Integration)

In my broader rack setup, my development machine (with an RTX 3090 and Docker-based model containers) acts as an auxiliary compute and storage companion.

I occasionally mount shared storage between:

- Dev machine Docker volumes  
- Kubernetes workloads (via sync or backup jobs)  
- Model artifacts and datasets for AI pipelines  

This is not tightly coupled to Kubernetes, but it supports my workflow for AI experimentation and training data.

---

## Persistent Data Strategy

For production-like stability inside the cluster, I separate workloads by persistence needs:

### Stateless workloads
- API services (FastAPI, Node.js backends)
- Frontend apps
- Workers and schedulers

These can be freely rescheduled across nodes.

### Stateful workloads
- PostgreSQL (primary database for apps like my Bible platform)
- Gitea (repositories and CI/CD metadata)
- Redis (if persistence is enabled)
- File storage services

These are pinned to persistent volumes using node-affinity where needed.

---

## Backup Strategy

Because local-path storage is not inherently redundant, backups are essential.

My backup approach includes:

- Nightly cron-based volume snapshots (simple rsync-based approach)
- Git-based backups for code (via Gitea)
- Database dumps for PostgreSQL
- Manual sync to external storage on my dev machine
- Long-term optional cloud backup (future expansion)

Example PostgreSQL backup flow:

```bash
kubectl exec postgres-pod -- pg_dumpall > backup.sql
```

## Storage for the Bible App Ecosystem

A large part of this setup is designed around my Bible app infrastructure.

Storage is used for:

- User avatars and cover images (stored in S3 or local dev fallback)
- Uploaded media content
- Devotional content and blog assets
- Game marketplace assets (JavaScript games stored in S3)
- Video ad assets and streaming metadata

The system is designed so that Kubernetes handles orchestration, while storage is abstracted depending on environment (local vs production-ready S3).

## Scaling Considerations

As the cluster grows beyond Raspberry Pi nodes, I may introduce:

- NFS server on a dedicated node or mini-NAS
- Longhorn for distributed block storage
- MinIO for S3-compatible object storage
- Ceph (only if the cluster becomes significantly larger)

For now, simplicity wins. K3s + local-path provisioner keeps everything understandable and debuggable.

## Operational Notes

A few key lessons from running this setup:

- SD cards are not reliable long-term for heavy write workloads (SSDs are preferred)
- PVC cleanup must be monitored to avoid orphaned storage usage
- Database workloads should always be pinned and not freely rescheduled
- Backups matter more than redundancy at small scale
- Simplicity beats overengineering in early homelab stages

## Conclusion

This storage setup is intentionally lightweight, reflecting the constraints and goals of a Raspberry Pi–based K3s homelab. Instead of introducing heavy distributed storage systems too early, the focus is on clarity, maintainability, and integration with real workloads like my Bible app, CI/CD pipelines, and AI services running across my rack.

As the system evolves, this foundation allows me to layer in more advanced storage solutions without needing to redesign everything from scratch. For now, local-path storage combined with disciplined backups provides a stable and practical base for development and experimentation.