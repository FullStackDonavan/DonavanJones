---
title: "Separation of Workloads"
description: "How I separate workloads in my homelab Kubernetes cluster using namespaces, taints, and node affinity to improve reliability and resource isolation."
date: 2026-01-10
category: "infrastructure-engineering"
tags:
  - workloads
  - homelab
draft: false
slug: separation-of-workloads
author: Donavan Jones
---

# Separation of Workloads

## Introduction

In a homelab environment, especially one built around a mixed setup like a Raspberry Pi-based K3s cluster combined with a separate development machine running Docker containers and GPU workloads (RTX 3090), workload separation is what keeps everything stable and scalable. Without clear boundaries, services start competing for CPU, memory, storage, and network resources, which leads to unpredictable behavior and harder debugging.

My setup is intentionally split across multiple layers: lightweight services run in a K3s Kubernetes cluster on Raspberry Pis, while heavier compute workloads like AI models, embeddings, and local inference run on a dedicated development machine with a GPU. On top of that, tools like Gitea and CI runners act as the glue between code, deployment, and infrastructure automation. This separation allows me to iterate quickly without breaking production-like services running in the cluster.

---

## Core Principle: Right Workload, Right Environment

The main idea behind my architecture is simple: every workload should live where it makes the most sense.

- Lightweight services → K3s cluster (Raspberry Pi nodes)
- CI/CD pipelines → Gitea runners (inside cluster or dedicated nodes)
- GPU-heavy workloads → RTX 3090 development machine
- Persistent infrastructure services → Dedicated Kubernetes namespaces or nodes

This prevents overloading any single part of the system and ensures that failures are isolated instead of cascading.

---

## Kubernetes Cluster: The Control Plane for Services

My K3s cluster acts as the backbone of the homelab. It is where I deploy most always-on services such as:

- API services (FastAPI microservices)
- Bible app backend components
- Gitea instance (self-hosted Git platform)
- CI runners for automated deployments
- Lightweight databases or cache layers when appropriate

Each service is isolated using namespaces and resource limits. This ensures that one service cannot silently consume all available resources on a Pi node.

I also use node labeling and scheduling rules to control where workloads land. For example, database workloads are pinned to nodes with better storage performance, while stateless services can float across the cluster.

---

## GPU Development Machine: Heavy Compute Layer

My separate development machine with an RTX 3090 is intentionally kept outside the cluster. It runs:

- AI model inference and experimentation
- Dockerized services for testing before production deployment
- Embedding generation pipelines
- Local fine-tuning and data processing tasks

This separation is important because GPU workloads are unpredictable and resource-intensive. Keeping them off the cluster prevents latency spikes and instability for user-facing services.

Instead of trying to force Kubernetes to manage everything, I treat this machine as a specialized compute node that integrates through APIs, queues, or CI pipelines.

---

## CI/CD and Gitea: The Glue Layer

Gitea is the central coordination point in my workflow. It connects development to infrastructure:

- Code is pushed to repositories in Gitea
- CI runners inside the cluster pick up jobs
- Deployment manifests are applied to K3s
- Docker builds or model updates are triggered on the GPU machine when needed

This creates a clean separation between writing code and deploying systems. I don’t manually SSH into nodes to deploy services; everything flows through pipelines.

This is also where infrastructure-as-code becomes powerful. My cluster state is reproducible through manifests, Helm charts, and deployment scripts.

---

## Networking and Service Boundaries

To keep everything clean and secure, I separate communication paths:

- Cluster services communicate over internal Kubernetes networking
- GPU machine exposes only controlled APIs (no direct cluster dependency)
- External traffic is routed through ingress controllers in K3s
- Sensitive services are isolated behind private namespaces or network policies

This prevents accidental cross-talk between experimental workloads and production-like services.

---

## Data Separation Strategy

Data is treated as a first-class boundary:

- Persistent volumes in Kubernetes for service state
- External storage or database services for shared data
- Local NVMe or SSD storage on the GPU machine for fast compute tasks
- Backups and snapshots handled independently from runtime workloads

This ensures that compute and storage failures are decoupled.

---

## Why This Architecture Works

The biggest advantage of this separation strategy is predictability. Each layer has a defined purpose:

- Cluster = stability and service hosting
- GPU machine = raw compute power
- CI/CD = automation and reproducibility
- Networking = controlled communication layer

When something breaks, I immediately know where to look. If a service is slow, it's likely cluster resource pressure. If AI tasks lag, it's the GPU machine. If deployment fails, it's CI/CD.

---

## Conclusion

Separating workloads in a homelab is not just about organization—it is about control, scalability, and resilience. By isolating Kubernetes services on a Raspberry Pi cluster and offloading heavy computation to a dedicated RTX 3090 machine, I can balance experimentation with reliability.

Over time, this architecture also makes it easier to scale horizontally. New services can be added to the cluster without touching compute workloads, and new AI experiments can run on the GPU machine without risking production uptime.

The result is a system that behaves like a small-scale production environment, but still remains flexible enough for rapid development and learning.