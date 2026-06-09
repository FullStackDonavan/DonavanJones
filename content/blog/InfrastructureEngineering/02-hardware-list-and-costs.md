---
title: "Hardware List and Costs"
description: "Full hardware list and cost breakdown for my ARM64 homelab Kubernetes cluster — Raspberry Pis, switches, storage, and rack components included."
date: 2025-09-13
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

## Conclusion

This homelab setup is designed as a scalable, self-hosted infrastructure for both software engineering and AI experimentation. The combination of a Kubernetes-based Raspberry Pi cluster and a dedicated GPU machine allows me to separate workloads efficiently—light services run continuously in the cluster, while compute-heavy AI tasks are offloaded to the RTX 3090 system.

Over time, this architecture will evolve into a more production-like environment, supporting CI/CD pipelines, AI agent systems, and the backend infrastructure for my Bible app ecosystem. The goal is not just infrastructure for development, but a fully autonomous system that can build, deploy, and scale services with minimal external dependencies.

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*
