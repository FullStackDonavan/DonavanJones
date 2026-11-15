---
title: "Infrastructure Design"
description: "Core principles for designing robust self-hosted infrastructure — separation of concerns, redundancy planning, and lessons from building a production homelab."
date: 2025-11-17
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - design
  - homelab
draft: false
slug: infrastructure-design
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/22-infrastructure-design.jpg
---

# Infrastructure Design

Good self-hosted infrastructure design comes down to a few principles: give every component one clear job, make deployment automatic so nothing depends on manual steps, put each workload on the cheapest hardware that can run it, and make the system observable before it gets complicated. Those are the rules my homelab follows, from the Pi control plane to the Jetson GPU workers.

## Introduction

Infrastructure design is not just about servers, clusters, or networking—it’s about building systems that can evolve without breaking under pressure. In my case, I approach infrastructure as a living system that supports both software development and real-world deployment needs: AI workloads, web applications, CI/CD pipelines, and experimental services.

My current setup reflects this philosophy. I run a homelab rack powered by a seven-node K3s Kubernetes cluster (four Raspberry Pis and three Jetson Orin GPU workers), combined with a separate development machine running an RTX 3090 for large-model execution and experimentation. I also use Gitea as the central Git system, paired with self-hosted CI runners that act as the glue between code and deployment. This separation of concerns—compute, orchestration, and development—lets me iterate quickly without sacrificing stability.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For how every node and service fits together, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

---

## Core Principles

### 1. Separation of Concerns
Each part of the system has a defined role:
- Kubernetes (K3s) handles orchestration and service deployment
- The Jetson GPU workers handle in-cluster inference, one job per board (image generation, speech, a small LLM)
- The 3090 development machine handles large models, embeddings, and training
- CI runners handle builds, tests, and deployment automation
- Gitea acts as the source of truth for all code and pipelines

This prevents the system from becoming tightly coupled or fragile.

### 2. Edge-First Homelab Architecture
My rack is designed as a small-scale production environment. Instead of treating it as a toy lab, I treat it like a distributed edge cluster. Services deployed to K3s behave as if they are in production, which helps surface real issues early.

### 3. CI/CD as the Glue Layer
Gitea combined with self-hosted runners is what connects everything. When I push code:
- Pipelines build containers
- Tests run automatically
- Deployments are pushed into the K3s cluster

This removes manual deployment friction and enforces consistency. The details are in the [Gitea runners pipeline](/blog/infrastructureengineering/21-gitea-runners-pipeline) post.

### 4. Hybrid Compute Model
Not everything belongs in Kubernetes. My RTX 3090 machine runs:
- AI model training (LoRA)
- Large-model inference, like Ornith-1.0-35B in Ollama, plus the embedding service in Docker
- Experimental workloads that don’t need orchestration overhead

Kubernetes handles stable services and small-model inference on the Jetsons; the GPU box handles heavy computation. How those two GPU tiers cooperate is in [RTX 3090 + Jetson Orin: a hybrid AI architecture](/blog/ai-homelab-engineering/03-rtx-3090-jetson-orin-hybrid-architecture).

---

## Current Homelab Architecture

At a high level, my infrastructure looks like this:

- **K3s Cluster (Rack Nodes)**
  - Runs production-like services
  - Hosts APIs, backend services, and supporting infrastructure
  - Handles service discovery and networking

- **Jetson GPU Workers (in the K3s cluster)**
  - gpu-worker-1: image generation and a shelf of small models
  - gpu-worker-2: speech (Kokoro TTS + Whisper STT)
  - gpu-worker-3: llama3.2:3b, always loaded

- **Development Machine (RTX 3090)**
  - Docker-based AI services
  - Model experimentation and testing
  - Local inference endpoints

- **Gitea Server**
  - Central repository for all projects
  - Triggers CI/CD pipelines
  - Stores infrastructure-as-code

- **CI/CD Runners**
  - Build and deploy containers
  - Push artifacts into the cluster
  - Automate infrastructure updates

This setup allows me to simulate real-world distributed systems while still maintaining full control locally.

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

## Design Philosophy

The goal of this infrastructure is not maximum scale—it’s maximum learning velocity with production-grade patterns.

I prioritize:
- Observability over complexity (Prometheus, Grafana, and Loki cover every node — see [monitoring and troubleshooting](/blog/infrastructureengineering/10-monitoring-and-troubleshooting))
- Reproducibility over manual configuration
- Automation over direct intervention
- Modular services over monoliths

Every new service I add must fit into this model or it gets redesigned.

---

## Scalability Strategy

Instead of scaling vertically, I scale horizontally through:
- Adding new nodes to the K3s cluster
- Splitting services into microservices when necessary
- Offloading heavy compute to dedicated machines
- Using CI/CD to ensure deployment consistency

This allows the system to grow organically without requiring a full redesign.

::CtaContactWork
---
buttonText: "Let's Talk About Your Infrastructure Design"
supportingCopy: "Designing a homelab or self-hosted platform around production-grade principles? Let's talk through the approach."
destinationUrl: "/hire-me"
---
::

---

## Conclusion

This infrastructure is designed to behave like a small production cloud, but fully controlled in a homelab environment. The combination of a K3s cluster, a GPU-powered development machine, and a CI/CD-driven workflow creates a system where experimentation and production engineering coexist.

The real value is not in the hardware itself, but in the workflow it enables: rapid iteration, safe deployment, and the ability to treat infrastructure as code rather than manual setup. As the system grows, the goal remains the same—keep it modular, automated, and close to real-world production standards while still flexible enough for experimentation.

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
  buttonText: "Read: Installing Gitea in Kubernetes"
  supportingCopy: "Continue with \"Installing Gitea in Kubernetes\" to see the CI/CD glue layer deployed inside this design."
  destinationUrl: "/blog/infrastructureengineering/23-installing-gitea-in-kubernetes"
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
  - label: "Infrastructure as Code — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Infrastructure_as_code"
    type: "wikipedia"
    description: "According to this overview, infrastructure as code manages infrastructure through machine-readable configuration files — the practice of storing Kubernetes manifests and CI/CD definitions in Gitea repositories."
  - label: "Microservices — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Microservices"
    type: "wikipedia"
    description: "Overview of microservices architecture — the design pattern the homelab infrastructure is built around, with each application component deployed as an independent containerized service."
  - label: "DevOps — Wikipedia"
    url: "https://en.wikipedia.org/wiki/DevOps"
    type: "wikipedia"
    description: "According to this overview, DevOps bridges development and operations through shared tooling and automation — the philosophy behind designing for observability, reproducibility, and automation-first deployments."
  - label: "Kubernetes — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes"
    type: "wikipedia"
    description: "Overview of Kubernetes as an infrastructure platform — the orchestration layer that makes the modular, microservices-based design possible by handling scheduling, health checks, and service discovery automatically."
---
::

---

## Related reading

- [Gitea Runners Pipeline](/blog/infrastructureengineering/21-gitea-runners-pipeline) — previous in the series
- [Installing Gitea in Kubernetes](/blog/infrastructureengineering/23-installing-gitea-in-kubernetes) — next in the series
- [Systems Thinking](/blog/infrastructureengineering/35-systems-thinking) — the systems-thinking approach behind these principles
- [Infrastructure systems overview](/systems/infrastructure) — the hub page for the whole rack: nodes, services, and how they connect
- [Kingdom Tools](/projects/kingdom-tools) — the internal control plane I built to provision services and manage models across this cluster

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*