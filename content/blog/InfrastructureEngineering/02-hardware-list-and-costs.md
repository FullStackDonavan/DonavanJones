---
title: "Hardware List and Costs"
description: "Full hardware list and cost breakdown for my ARM64 homelab Kubernetes cluster — Raspberry Pis, switches, storage, and rack components included."
date: 2025-09-13
lastUpdated: "2026-06-09"
category: "infrastructure-engineering"
tags:
  - hardware
  - homelab
draft: false
slug: hardware-list-and-costs
author: Donavan Jones
---

# Hardware List and Costs

## Introduction

This document breaks down the hardware powering my homelab Kubernetes cluster, including both the edge compute nodes and my development machine setup. The goal of this infrastructure is to support a distributed system that can handle AI workloads, CI/CD pipelines, container orchestration with k3s, and experimental services for my Bible app ecosystem.

My setup is intentionally hybrid: lightweight Raspberry Pi nodes form the backbone of the Kubernetes cluster, while a dedicated RTX 3090 machine handles heavier AI workloads and model inference in Docker containers. On top of this, I run supporting services like Gitea for source control and CI runners for automated deployments, creating a fully self-hosted development environment.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

---

## Compute Nodes (Kubernetes Cluster)

These are the primary nodes running k3s in my homelab rack:

- Raspberry Pi 5 16gb nodes (k3s workers + control plane)
  - Role: Container orchestration, lightweight services, API workloads
  - OS: Linux (lightweight server distro)
  - Cluster: k3s (lightweight Kubernetes distribution)
  - Purpose: Always-on services, APIs, small microservices, and system tooling

> These nodes form the backbone of the distributed system and handle most production-like workloads in the cluster.

---

## Development & AI Compute Machine

- RTX 3090 Desktop Machine
  - Role: AI model inference, training experiments, Docker-based model hosting
  - Usage: Runs heavier workloads that are not suitable for ARM-based Pi nodes
  - Includes:
    - Local LLM containers
    - Embedding services
    - Experimental AI agents (memory + tool use)
    - Build/testing environment for AI pipelines

> This machine acts as the “heavy compute layer” of the system, complementing the Kubernetes cluster.

---

## CI/CD & DevOps Layer

- Gitea Server (self-hosted in cluster)
  - Role: Git hosting, version control, and automation triggers
  - Integrated with CI runners deployed in the cluster

- CI Runners
  - Role: Build, test, and deploy pipelines
  - Runs:
    - Docker image builds
    - Kubernetes deployment updates
    - Automated testing for services

> This layer acts as the glue between development and production deployment across the homelab.

---

## Networking & Infrastructure

- Home router / LAN backbone
  - Provides internal cluster connectivity
  - Handles ingress/egress traffic routing

- Kubernetes networking (k3s built-in)
  - Service discovery between microservices
  - Internal DNS resolution for services

- Optional expansion:
  - Load balancer (software-based or hardware upgrade planned)
  - Reverse proxy layer for external traffic routing

---

## Storage Layer

- Local NVMe/SSD storage on Pi nodes (light workloads)
- Local NVMe/SSD storage on RTX 3090 machine
- Shared storage strategy (planned/expanding):
  - Distributed storage for persistent workloads
  - Backup system for critical application data

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

## Estimated Cost Breakdown

| Component | Description | Estimated Cost |
|----------|-------------|----------------|
| Raspberry Pi Cluster Nodes | K3s workers/control plane | $245 - $340 |
| RTX 3090 Desktop | AI compute machine | $3000 - $4500 |
| Networking Equipment | Router, switches, cabling | $100 - $200 |
| Storage Devices | SSDs/NVMe drives | $650 - $800 |
| Power & Cooling | PSU, cooling, rack power | $130 - $150 |
| Miscellaneous | Cases, mounts, accessories | $200 - $250 |

> Note: Costs vary depending on sourcing (new vs used hardware), storage capacity, GPU pricing, and networking equipment quality.

---

::CtaContactWork
---
buttonText: "Let's Talk About Your Hardware Setup"
supportingCopy: "Planning the hardware for your own homelab cluster? Let's talk through the architecture and cost tradeoffs."
destinationUrl: "/hire-me"
---
::

## Conclusion

This homelab setup is designed as a scalable, self-hosted infrastructure for both software engineering and AI experimentation. The combination of a Kubernetes-based Raspberry Pi cluster and a dedicated GPU machine allows me to separate workloads efficiently—light services run continuously in the cluster, while compute-heavy AI tasks are offloaded to the RTX 3090 system.

Over time, this architecture will evolve into a more production-like environment, supporting CI/CD pipelines, AI agent systems, and the backend infrastructure for my Bible app ecosystem. The goal is not just infrastructure for development, but a fully autonomous system that can build, deploy, and scale services with minimal external dependencies.

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
  buttonText: "Read: Flashing Raspberry Pi OS"
  supportingCopy: "Continue with \"Flashing Raspberry Pi OS\" to start preparing the nodes this hardware list describes."
  destinationUrl: "/blog/infrastructureengineering/03-flashing-raspberry-pi-os"
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
  - label: "Raspberry Pi — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Raspberry_Pi"
    type: "wikipedia"
    description: "According to this overview, Raspberry Pi is a low-cost single-board computer — the primary cluster node hardware used across the homelab rack described in this article."
  - label: "Single-Board Computer — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Single-board_computer"
    type: "wikipedia"
    description: "Overview of single-board computers — the hardware category that makes distributed ARM64 clusters affordable compared to enterprise server equipment."
  - label: "Graphics Processing Unit — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Graphics_processing_unit"
    type: "wikipedia"
    description: "According to this overview, GPUs provide massively parallel compute — the role of the RTX 3090 development machine in the rack's AI inference and experimentation layer."
  - label: "Server Rack — Wikipedia"
    url: "https://en.wikipedia.org/wiki/19-inch_rack"
    type: "wikipedia"
    description: "Overview of server rack standards — the physical organization format used to mount and manage cluster nodes, networking equipment, and power systems in the homelab."
---
::

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*
