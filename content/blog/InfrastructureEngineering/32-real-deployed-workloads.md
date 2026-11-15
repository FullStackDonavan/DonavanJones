---
title: "Real Deployed Workloads"
description: "The real workloads in my K3s homelab: Gitea CI/CD, FastAPI services, Temporal workers, Weaviate, PostgreSQL, MinIO, Redis, and Jetson + RTX 3090 inference."
date: 2026-01-02
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - workloads
  - homelab
draft: false
slug: real-deployed-workloads
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/32-real-deployed-workloads.jpg
---

# Real Deployed Workloads

## Introduction

The workloads actually running on my homelab are self-hosted Gitea with CI runners, FastAPI services (including VerseHub's backend and my Kingdom Tools platform), Temporal workers, a data layer of PostgreSQL, Redis, MinIO and Weaviate, and AI inference split between three Jetson Orin Nano Supers and one RTX 3090. It all runs on a 7-node K3s cluster (four Raspberry Pis plus the three Jetsons), with the 3090 workstation alongside for anything that needs more than 8 GB of memory.

The goal of this environment is to simulate production-grade infrastructure at home—covering CI/CD pipelines, distributed services, AI inference workloads, and persistent storage systems. This setup also integrates Gitea for source control and self-hosted automation pipelines using Kubernetes runners.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For the full architecture, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

---

## Cluster Overview

My homelab rack is composed of:

- A Raspberry Pi K3s control plane (pi-node1) and three Pi worker nodes
- Three Jetson Orin Nano Super 8GB GPU worker nodes (image-gen, speech, LLM)
- A dedicated development machine with RTX 3090 GPU (AI + model inference)
- Gitea self-hosted Git platform
- CI/CD runners deployed inside Kubernetes
- External storage for persistent workloads and backups

This architecture allows me to separate concerns:
- Kubernetes handles orchestration and service reliability
- The GPU machine handles compute-heavy AI inference
- CI/CD pipelines automate deployment from code push to cluster

---

## Real Deployed Workloads

## 1. Gitea Self-Hosted Git Platform

I run a fully self-hosted Git service using Gitea inside my Kubernetes cluster.

**Purpose:**
- Source control for all projects
- Hosting private repositories for infrastructure, AI pipelines, and app development
- Integration point for CI/CD workflows

**Why it matters:**
This replaces GitHub for internal workflows and allows full control over deployment automation.

---

## 2. CI/CD Automation System (Gitea Runners)

I use self-hosted Gitea Actions runners to automate deployments — a push to `main` deploys. The details are in [Gitea Runners Pipeline](/blog/infrastructureengineering/21-gitea-runners-pipeline).

**Flow:**
1. Push code to repository
2. Trigger CI pipeline
3. Build ARM64 Docker images with `docker buildx`
4. Import the image on each node (`k3s ctr images import`) and roll the deployment

**Use cases:**
- FastAPI backend deployments
- AI service updates
- Infrastructure changes (YAML manifests)

This is essentially the glue between development and production inside my homelab.

---

## 3. FastAPI Microservices Layer

Several backend services run as containerized FastAPI applications.

**Examples:**
- Authentication service
- Bible app APIs (core logic layer)
- AI routing service (decides when to call local GPU models vs API models)
- [Kingdom Tools](/projects/kingdom-tools), my internal platform (FastAPI + vanilla JS) for cluster views, provisioning Postgres/MinIO/Redis/Weaviate per service, and loading or benchmarking models on each Jetson

**Why FastAPI:**
- Lightweight and fast
- Easy integration with Kubernetes
- Works well with async workloads

---

## 4. AI Inference Layer (Jetson GPU Workers + RTX 3090)

Inference is split by size. The three Jetsons run always-on small models inside the cluster, one role per board:

| Node | Role | Measured |
| --- | --- | --- |
| gpu-worker-1 | Stable Diffusion service + a shelf of small Ollama models | one model/service at a time |
| gpu-worker-2 | Kokoro-82M TTS + whisper.cpp STT | 0.85 s Kokoro→Whisper round trip |
| gpu-worker-3 | llama3.2:3b pinned in memory | 20.8 tok/s generation, 100% on GPU |

My RTX 3090 machine, outside the cluster, handles what won't fit in 8 GB of unified memory.

**Capabilities:**
- Larger-model inference (Ornith-1.0-35B in Ollama, ~64 tok/s)
- Embedding generation for semantic search (all-MiniLM-L6-v2 in Docker)
- LoRA fine-tuning of small models for the Jetsons

**Integration:**
Kubernetes services call the Jetsons for routine inference and route requests to the 3090 machine when more GPU memory is required. The full split is in [RTX 3090 + Jetson Orin: A Hybrid AI Architecture](/blog/ai-homelab-engineering/03-rtx-3090-jetson-orin-hybrid-architecture).

This effectively turns the homelab into a small distributed AI system.

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

## 5. Vector Search + Retrieval Systems

I run retrieval systems for semantic search across theological and study content.

**Stack includes:**
- Weaviate vector database (verses and Church Fathers collections)
- Ingestion pipelines, including a corpus crawler that runs as a Kubernetes Job
- API layer for query retrieval

**Use case:**
Powering AI-assisted Bible study features in [VerseHub](/projects/versehub): a fast draft from llama3.2:3b on a Jetson, then a Temporal `ScholarWorkflow` on the Pi workers that retrieves, scores, generates, and verifies citations against the retrieved evidence.

---

## 6. Database Layer (PostgreSQL + Supporting Services)

A centralized database layer supports most applications: PostgreSQL for relational data, Redis (on pi-worker-2) for caching including an LLM response cache, and MinIO for object storage.

**Responsibilities:**
- User accounts and authentication data
- Posts, debates, and community content
- AI metadata and logs

This is deployed in a persistent Kubernetes volume setup with backup strategies tied to CI/CD workflows.

---

## 7. Media and Content Services

I also run supporting services for user-generated content:

- Image uploads (stored in MinIO, S3-compatible object storage)
- Video handling for livestream and recorded content
- Ad creative storage system for in-app monetization

These services support the social and media features of the Bible app ecosystem. Voice is already in production: Kokoro TTS and Whisper STT on gpu-worker-2 (see [Voice Narration Pipelines](/blog/ai-engineering/22-voice-narration-pipelines)).

---

## 8. Experimental Services

This is where I test new systems before production deployment:

- WebRTC peer-to-peer debate system
- Livestream routing through AWS IVS
- Game marketplace backend logic

These workloads often move into production once stabilized.

---

## System Design Philosophy

This entire infrastructure is designed around three principles:

**1. Separation of compute**
- Kubernetes = orchestration + lightweight services
- Jetson GPU workers = always-on small-model inference
- RTX 3090 machine = large models, embeddings, training

**2. Self-host everything possible**
- Git (Gitea)
- CI/CD runners
- APIs and backend services
- Data pipelines

**3. Production simulation at home**
The system mirrors real-world cloud architecture:
- microservices
- container orchestration
- CI/CD automation
- distributed compute routing

::CtaContactWork
---
buttonText: "Let's Talk About Your Deployed Workloads"
supportingCopy: "Running real production-style workloads on your own homelab cluster? Let's talk through what you're hosting."
destinationUrl: "/hire-me"
---
::

---

## Conclusion

This homelab is not just a collection of services—it’s a full production-style infrastructure environment running locally. The combination of a Raspberry Pi K3s cluster, three Jetson GPU workers, an RTX 3090 node, and self-hosted CI/CD pipelines creates a system capable of supporting real applications at scale.

As the system evolves, the focus is shifting toward tighter AI integration, improved workload routing, and more autonomous deployment pipelines. The end goal is a fully self-sustaining infrastructure where development, deployment, and AI inference all operate seamlessly across the cluster and GPU nodes.

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
  buttonText: "Read: Separation of Workloads"
  supportingCopy: "Continue with \"Separation of Workloads\" to see the design rules behind how these services are split across compute."
  destinationUrl: "/blog/infrastructureengineering/33-separation-of-workloads"
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
    description: "According to this overview, Kubernetes orchestrates containerized applications across clusters — the platform managing all deployed workloads described in this article, from APIs to databases to CI/CD pipelines."
  - label: "Microservices — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Microservices"
    type: "wikipedia"
    description: "Overview of microservices architecture — the pattern used to structure deployed workloads as independent containerized services communicating through APIs rather than a single monolithic application."
  - label: "Docker (Software) — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Docker_(software)"
    type: "wikipedia"
    description: "According to this overview, Docker packages applications into portable containers — the deployment unit used for AI inference workloads on the GPU machine and services deployed through Kubernetes manifests."
  - label: "Vector Database — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Vector_database"
    type: "wikipedia"
    description: "Overview of vector databases — the semantic search infrastructure deployed as a real workload for the Bible app's AI retrieval system, running alongside PostgreSQL and Redis in the cluster."
---
::

---

## Related reading

- [Rack Overview](/blog/infrastructureengineering/31-rack-overview) — previous in the series: the hardware these workloads run on.
- [Separation of Workloads](/blog/infrastructureengineering/33-separation-of-workloads) — next in the series: why each workload lives where it does.
- [Infrastructure systems overview](/systems/infrastructure) — the hub for the full cluster architecture.
- [Temporal Workflows in Production](/blog/versehub-engineering/07-temporal-workflows-in-production) — how the VerseHub workflows on these workers behave in practice.

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*