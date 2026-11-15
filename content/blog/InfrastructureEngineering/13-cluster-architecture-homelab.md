---
title: "Cluster Architecture (Homelab)"
description: "Deep dive into the architecture of my homelab Kubernetes cluster — control plane design, worker node layout, networking, and storage topology explained."
date: 2025-10-26
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - kubernetes
  - architecture
draft: false
cluster: "infrastructure-engineering"
slug: cluster-architecture-homelab
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/13-cluster-architecture-homelab.jpg
---

# Cluster Architecture (Homelab)

My homelab cluster is a seven-node K3s cluster. One Raspberry Pi (pi-node1) runs the control plane, three Raspberry Pi workers run services and data stores, and three Jetson Orin Nano Super 8GB boards serve as GPU workers for image generation, speech, and a small always-on LLM. A separate RTX 3090 workstation outside the cluster runs the large models. Gitea Actions deploys to it on every push to main, and Prometheus, Grafana, and Loki watch all of it.

My homelab cluster is the foundation behind nearly everything I build — from AI services and theological search systems to livestreaming infrastructure and my Bible platform. The environment is designed around low-cost, scalable hardware using Kubernetes, allowing me to experiment with distributed systems, CI/CD pipelines, self-hosted tooling, vector search, AI agents, and cloud-native development practices from home.

The rack combines ARM nodes, self-hosted services, storage, networking, and GPU-assisted AI workloads into a single ecosystem that I can continuously expand and refine over time.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For how every node and service fits together, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

How my homelab Kubernetes cluster is architected.

## Overview

The cluster is built primarily around lightweight Kubernetes (K3s) running on multiple nodes. The goal is to maintain a modular infrastructure that supports:

- Self-hosted applications
- AI microservices
- Development environments
- CI/CD pipelines
- Streaming infrastructure
- Databases and caching
- Vector search and retrieval systems
- Experimental AI agents

The setup is designed to mimic production-style infrastructure while remaining affordable and power efficient.

## Core Infrastructure

### Kubernetes Distribution

I use K3s because it is lightweight, simple to manage, and works well on ARM-based hardware while still supporting production-like workflows.

Key benefits:

- Low resource overhead
- Fast deployments
- Simple cluster management
- ARM compatibility
- Easy scaling

## Hardware Layout

The rack currently consists of seven cluster nodes and one separate GPU development machine.

| Node | Hardware | Role |
|------|----------|------|
| pi-node1 | Raspberry Pi | K3s server (v1.34.x); Prometheus, Grafana, Gitea via NodePort |
| pi-worker-1, -3 | Raspberry Pi | Services, background workers |
| pi-worker-2 | Raspberry Pi | Services + Redis |
| gpu-worker-1 | Jetson Orin Nano Super 8GB | Image generation (Dreamer SD) + small-model shelf in Ollama |
| gpu-worker-2 | Jetson Orin Nano Super 8GB | Speech: Kokoro TTS + whisper.cpp STT |
| gpu-worker-3 | Jetson Orin Nano Super 8GB | LLM: llama3.2:3b pinned in memory |

### Cluster Nodes

The Kubernetes nodes handle:

- API services
- Databases
- Internal tooling
- Web applications
- Background workers
- CI/CD runners
- AI orchestration services

### GPU Development Machine

Outside the cluster, I run larger AI models on a dedicated Windows machine with a single RTX 3090 (24 GB).

This system is used for:

- Running large local LLMs (Ornith-1.0-35B in Ollama, about 64 tok/s using 21.2 GB of VRAM)
- Embedding generation (the all-MiniLM-L6-v2 embedder for VerseHub, in Docker)
- LoRA training
- Agent workflows
- Model testing

GPU work inside the cluster happens on the Jetsons. The 3090 box is being rebuilt (November 2026) into a headless Linux training machine for fine-tuning small models that then run on those Jetsons. How the two GPU tiers divide the work is in [RTX 3090 + Jetson Orin: a hybrid AI architecture](/blog/ai-homelab-engineering/03-rtx-3090-jetson-orin-hybrid-architecture).

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

## Networking

The cluster uses internal networking for service-to-service communication while exposing selected applications through ingress controllers and reverse proxies.

Typical traffic flow:

```text
Internet
   ↓
Reverse Proxy / Ingress
   ↓
Kubernetes Services
   ↓
Pods / Microservices
```

## Storage

Persistent workloads use mounted storage volumes for:

- Databases
- User uploads
- Media
- Vector indexes
- Application data
- Logs

Assets such as videos, game files, and uploaded media are stored externally on Amazon S3, while MinIO provides S3-compatible object storage inside the cluster, including a bucket for training datasets.

## Databases

The stack currently uses multiple storage layers depending on workload type.

### PostgreSQL

Primary relational database used for:

- User accounts
- App data
- Content systems
- Metadata
- Authentication

### Redis

Used for:

- Caching
- Queues
- Session storage
- Temporary state
- High-speed lookups

### Vector Storage

Vector search runs on Weaviate in the cluster and is used for retrieval systems and AI workflows involving:

- Theology datasets
- Semantic search
- AI memory systems
- Embeddings
- Knowledge retrieval

## AI Infrastructure

AI services are a major part of the architecture.

### Current AI Workloads

The infrastructure supports:

- Local LLM inference
- AI agents
- Embedding pipelines
- Retrieval systems
- Tool-using agents
- Conversational systems
- Bible-focused AI tools

### Bible Logic

One of the core systems connected to the infrastructure is BibleLogic, the AI assistant in [VerseHub](/projects/versehub). A fast draft comes from llama3.2:3b on a Jetson (about 21 tok/s), then a Temporal `ScholarWorkflow` running on the Pi workers retrieves evidence from Weaviate, scores it, generates a refined answer, and verifies citations against the retrieved evidence. The orchestration side is covered in [Temporal workflows in production](/blog/versehub-engineering/07-temporal-workflows-in-production).

The broader goal is building infrastructure capable of supporting persistent AI systems with memory, retrieval, tools, and orchestration.

## CI/CD

Source control and deployment pipelines are self-hosted.

### Gitea

Gitea is used for:

- Git repositories
- Source management
- Internal development
- Deployment workflows

### CI Runners

CI runners automate:

- Builds
- Deployments
- Container publishing
- Infrastructure updates
- Kubernetes rollouts

This allows code pushed to repositories to automatically deploy into the cluster. CI runs on self-hosted Gitea Actions: images are built with `docker buildx --platform linux/arm64` and imported on each node with `k3s ctr images import`, so there's no registry pull at deploy time.

## Application Hosting

The cluster hosts multiple types of applications including:

- APIs
- Web frontends
- AI services
- Streaming services
- Internal dashboards
- Background workers
- Experimental tooling

Applications are containerized and deployed through Kubernetes manifests and automated pipelines.

## Goals of the Architecture

The main goals of the homelab are:

- Learn production infrastructure
- Build scalable systems
- Self-host applications
- Develop AI tooling
- Practice DevOps workflows
- Experiment with distributed systems
- Create a flexible R&D environment

## Future Expansion

Planned improvements include:

- More cluster nodes
- A dedicated Linux training box (the rebuilt 3090 machine) feeding fine-tuned small models to the Jetsons
- Tracing on top of the existing Prometheus, Grafana, and Loki stack
- Dedicated storage systems
- High availability services
- Expanded AI orchestration
- More automation
- Edge AI workloads
- Multi-cluster experimentation

::CtaContactWork
---
buttonText: "Let's Talk About Your Cluster Architecture"
supportingCopy: "Designing a homelab cluster that mirrors production systems? Let's talk through the architecture."
destinationUrl: "/hire-me"
---
::

## Conclusion

This homelab has become more than just a place to host applications — it functions as an active research and engineering environment where I can develop real-world skills across infrastructure, AI engineering, Kubernetes, distributed systems, and backend development.

By combining self-hosted services, GPU-powered AI workloads, and automated deployment pipelines into a unified rack setup, the cluster gives me the flexibility to rapidly prototype ideas while learning how modern production systems are designed and operated at scale.

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
  buttonText: "Read: Cluster Topology"
  supportingCopy: "Continue with \"Cluster Topology\" for a closer look at how nodes and roles are laid out across this architecture."
  destinationUrl: "/blog/infrastructureengineering/14-cluster-topology"
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
  - label: "Kubernetes — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes"
    type: "wikipedia"
    description: "According to this overview, Kubernetes provides container orchestration across clusters of nodes — the platform at the center of the homelab architecture coordinating all services and workloads."
  - label: "Distributed Computing — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Distributed_computing"
    type: "wikipedia"
    description: "Overview of distributed computing — the paradigm the homelab cluster implements by spreading workloads across Raspberry Pi nodes and a dedicated GPU development machine."
  - label: "Continuous Integration and Delivery — Wikipedia"
    url: "https://en.wikipedia.org/wiki/CI/CD"
    type: "wikipedia"
    description: "According to this overview, CI/CD automates building, testing, and deploying software — the Gitea runner pipeline described as a core layer of the homelab architecture."
  - label: "GPU Computing — Wikipedia"
    url: "https://en.wikipedia.org/wiki/General-purpose_computing_on_graphics_processing_units"
    type: "wikipedia"
    description: "Overview of GPU computing — the capability the RTX 3090 development machine adds to the architecture for local AI inference, embedding generation, and model experimentation."
---
::

---

## Related reading

- [ARM64 Considerations](/blog/infrastructureengineering/12-arm64-considerations) — previous in the series
- [Cluster Topology](/blog/infrastructureengineering/14-cluster-topology) — next in the series
- [Infrastructure systems overview](/systems/infrastructure) — the hub page for the whole rack: nodes, services, and how they connect
- [My Homelab Architecture for Agentic AI Development](/blog/ai-homelab-engineering/01-my-homelab-architecture-for-agentic-ai) — the same cluster viewed as an agentic AI platform
- [Scaling VerseHub with Local AI Infrastructure](/blog/versehub-engineering/09-scaling-versehub-with-local-ai-infrastructure) — how VerseHub uses this infrastructure

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*