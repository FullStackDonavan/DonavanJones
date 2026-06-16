---
title: "Rack Overview"
description: "Full overview of my homelab server rack — the nodes, networking gear, storage devices, power setup, and how everything fits together physically."
date: 2025-12-22
lastUpdated: "2026-06-09"
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
---

# Rack Overview

## Introduction

My homelab rack is the foundation of my entire infrastructure ecosystem. It is designed not just for experimentation, but as a production-grade learning environment where I build, deploy, and test real systems. The goal is to combine Kubernetes orchestration, CI/CD automation, and AI workloads into a unified environment that mirrors real-world engineering stacks at scale.

At the core of this setup is a Raspberry Pi-based K3s Kubernetes cluster, which handles container orchestration and service deployment. Supporting this is a dedicated development machine equipped with an RTX 3090 GPU running AI models in Docker containers. Together, these systems form a hybrid edge-and-local compute architecture that allows me to develop, test, and deploy seamlessly across environments.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

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

- **Compute Layer (Kubernetes Cluster)**
- **Development & AI Layer (GPU Workstation)**
- **CI/CD & Source Control Layer (Gitea + Runners)**

Each layer plays a specific role in the overall system design.

---

## Kubernetes Cluster (Raspberry Pi K3s)

The heart of the rack is a lightweight Kubernetes cluster built using K3s running on multiple Raspberry Pi nodes.

Key responsibilities:
- Running containerized applications
- Hosting microservices for my Bible app ecosystem
- Managing deployments via manifests and Helm charts
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
3. Container images are built and stored
4. Deployment manifests are applied to the cluster

This setup acts as the “glue” between development and production, allowing fast iteration without losing control of deployment stability.

---

## AI Development Machine (RTX 3090 Workstation)

Outside the cluster, I maintain a dedicated development machine equipped with an RTX 3090 GPU.

This machine runs:
- Dockerized AI models
- Experimental inference pipelines
- Local testing environments for AI agents
- Model prototyping before production deployment

Rather than overloading the Kubernetes cluster with GPU workloads, I offload heavy AI computation to this system. This creates a clear separation between infrastructure services and compute-heavy ML tasks.

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
- Adding GPU nodes directly into the cluster
- Improving observability (Prometheus + Grafana dashboards)
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

By integrating Kubernetes, Gitea, and a dedicated GPU workstation, the system allows me to move from idea to deployment quickly while still maintaining control over scalability and reliability. As it continues to evolve, the rack will serve as the backbone for increasingly complex applications, especially in AI, backend systems, and interactive platform development.

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

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*