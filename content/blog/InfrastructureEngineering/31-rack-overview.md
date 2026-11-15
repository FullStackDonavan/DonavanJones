---
title: "Rack Overview"
description: "Overview of my homelab rack: a 7-node K3s cluster of Raspberry Pis and Jetson Orin Nanos, Gitea CI/CD, and an RTX 3090 workstation, and how they fit together."
date: 2025-12-22
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - homelab
  - rack
  - kubernetes
  - gitea
  - ci-cd
  - ai
draft: false
slug: rack-overview
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/31-rack-overview.jpg
---

# Rack Overview

## Introduction

My homelab rack is a 7-node K3s cluster — four Raspberry Pis (one control plane, three workers) and three Jetson Orin Nano Super GPU workers — plus self-hosted Gitea CI/CD, with a single RTX 3090 workstation alongside it for heavy AI work. It is the foundation of my entire infrastructure ecosystem, designed not just for experimentation, but as a production-grade learning environment where I build, deploy, and test real systems. The goal is to combine Kubernetes orchestration, CI/CD automation, and AI workloads into a unified environment that mirrors real-world engineering stacks at scale.

The Raspberry Pis handle orchestration and service deployment, the Jetsons handle always-on inference (a small LLM, speech, and image generation), and the RTX 3090 machine runs embeddings, LoRA training, and larger models. Together, these systems form a hybrid edge-and-local compute architecture that allows me to develop, test, and deploy seamlessly across environments.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For the full architecture, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

---

## Rack Architecture Overview

The rack is organized into three main layers:

- **Compute Layer (K3s cluster: Pi workers + Jetson GPU workers)**
- **Development & AI Layer (GPU Workstation)**
- **CI/CD & Source Control Layer (Gitea + Runners)**

Each layer plays a specific role in the overall system design.

---

## Kubernetes Cluster (Raspberry Pi K3s)

The heart of the rack is a lightweight Kubernetes cluster built using K3s. The control plane (pi-node1) and three workers are Raspberry Pis; three Jetson Orin Nano Super boards join as GPU workers with fixed roles (image-gen, speech, LLM). The full breakdown is in [Node Roles](/blog/infrastructureengineering/27-node-roles).

Key responsibilities:
- Running containerized applications
- Hosting microservices for my Bible app ecosystem
- Managing deployments via Kubernetes manifests
- Providing a sandbox for infrastructure testing

What makes this setup powerful is its simplicity and flexibility. K3s reduces overhead while still providing a fully functional Kubernetes experience. This allows me to simulate production deployments without requiring expensive infrastructure.

---

## CI/CD System (Gitea + Runners)

My Git and deployment pipeline is built around a self-hosted Gitea instance running inside the cluster.

Key features:
- Source control for all infrastructure and application code
- Automated CI/CD pipelines using self-hosted runners
- Deployment automation directly into the Kubernetes cluster

Workflow:
1. Push code to Gitea repository
2. CI pipeline triggers build via runner
3. ARM64 images are built with `docker buildx` and imported onto the nodes with `k3s ctr images import`
4. Deployment manifests are applied to the cluster

For apps that run on bare metal instead of in the cluster, [Deploying an App on the Rack](/blog/infrastructureengineering/45-deploying-an-app-on-the-rack) walks through the SSH + systemd version of the pipeline.

This setup acts as the “glue” between development and production, allowing fast iteration without losing control of deployment stability.

---

## AI Development Machine (RTX 3090 Workstation)

Outside the cluster, I maintain a dedicated development machine equipped with an RTX 3090 GPU.

This machine runs:
- The all-MiniLM-L6-v2 sentence embedder (in Docker) for VerseHub retrieval
- Ornith-1.0-35B in Ollama (~21 GB of VRAM, ~64 tok/s) and LoRA training jobs
- Local testing environments for AI agents
- Model prototyping before production deployment

The Jetsons handle small always-on models in-cluster; anything that needs more than 8 GB of memory gets offloaded to this system. This creates a clear separation between infrastructure services and compute-heavy ML tasks.

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

## Application Ecosystem

Built on top of this rack is a growing ecosystem of applications, including:

- Bible study and comparison tools
- Devotional and journaling systems
- Social features (posts, reactions, debates)
- Game marketplace and interactive learning tools
- Ad system with creatives and bidding mechanics
- Livestreaming infrastructure using WebRTC and AWS IVS

All of these services are designed to be modular and deployed independently through Kubernetes.

---

## Networking & Deployment Flow

The system follows a simple but powerful flow:

- Development happens locally or on the GPU machine
- Code is pushed to Gitea
- CI/CD pipelines build and test artifacts
- Kubernetes handles deployment and scaling
- Services communicate internally within the cluster network

This architecture ensures repeatability, scalability, and isolation between services.

---

## Future Expansion

Planned improvements to the rack include:

- Expanding the Kubernetes cluster with additional nodes
- Deepening observability (Prometheus, Grafana, and Loki already run in-cluster — see [Grafana on a Pi K3s cluster](/blog/infrastructureengineering/42-grafana-on-pi-cluster))
- Introducing service mesh for advanced traffic control
- Expanding AI inference services into cluster-native deployments

::CtaContactWork
---
buttonText: "Let's Talk About Your Rack Build"
supportingCopy: "Designing a homelab rack that mirrors real infrastructure patterns? Let's talk through the architecture."
destinationUrl: "/hire-me"
---
::

---

## Conclusion

This homelab rack is more than just a collection of hardware—it is a full engineering platform. It combines distributed systems, CI/CD automation, and AI development into a unified environment that mirrors real-world infrastructure.

By integrating Kubernetes, Jetson GPU workers, Gitea, and a dedicated GPU workstation, the system allows me to move from idea to deployment quickly while still maintaining control over scalability and reliability. As it continues to evolve, the rack will serve as the backbone for increasingly complex applications, especially in AI, backend systems, and interactive platform development.

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
  buttonText: "Read: Real Deployed Workloads"
  supportingCopy: "Continue with \"Real Deployed Workloads\" to see what's actually running on this rack day to day."
  destinationUrl: "/blog/infrastructureengineering/32-real-deployed-workloads"
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
  - label: "Server Rack — Wikipedia"
    url: "https://en.wikipedia.org/wiki/19-inch_rack"
    type: "wikipedia"
    description: "According to this overview, server racks provide standardized mounting for computing and networking hardware — the physical framework that organizes the homelab's Raspberry Pi cluster, switch, and development machine."
  - label: "Raspberry Pi — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Raspberry_Pi"
    type: "wikipedia"
    description: "Overview of Raspberry Pi as a single-board computer — the ARM64 hardware forming the K3s cluster nodes that handle lightweight orchestration, CI/CD, and infrastructure services in the rack."
  - label: "Kubernetes — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes"
    type: "wikipedia"
    description: "According to this overview, Kubernetes orchestrates containerized workloads across nodes — the software stack that turns the physical rack of Pi nodes into a functional distributed compute platform."
  - label: "Graphics Processing Unit — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Graphics_processing_unit"
    type: "wikipedia"
    description: "Overview of GPU hardware — the RTX 3090 development machine attached to the rack provides AI inference capability that the ARM nodes cannot, creating the hybrid compute architecture described in this overview."
---
::

---

## Related reading

- [Power Consumption Tradeoffs](/blog/infrastructureengineering/30-power-consumption-tradeoffs) — previous in the series.
- [Real Deployed Workloads](/blog/infrastructureengineering/32-real-deployed-workloads) — next in the series: what actually runs on the rack.
- [Infrastructure systems overview](/systems/infrastructure) — the hub for the full cluster architecture.
- [Using Three Jetson Orin Nano Supers as an AI Cluster](/blog/ai-homelab-engineering/02-three-jetson-orin-nano-supers-as-ai-cluster) — a deep dive on the GPU worker layer.
- [System overview](/system-overview) — the whole platform on one page.

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*