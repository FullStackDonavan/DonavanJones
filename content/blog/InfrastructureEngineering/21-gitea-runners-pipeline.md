---
title: "Gitea Runners Pipeline"
description: "How CI/CD pipeline execution works using Gitea runners inside my homelab Kubernetes cluster — job routing, runner registration, and pipeline design."
date: 2025-11-15
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - gitea
  - ci-cd
draft: false
cluster: "infrastructure-engineering"
slug: gitea-runners-pipeline
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/21-gitea-runners-pipeline.jpg
---

# Gitea Runners Pipeline

My CI/CD pipeline runs on self-hosted Gitea Actions: a push to `main` triggers a runner, which builds an ARM64 image with `docker buildx --platform linux/arm64`, imports it onto the cluster nodes with `k3s ctr images import`, and rolls out the Deployment. Pods use `imagePullPolicy: Never`, so there's no registry pull at deploy time. Nothing leaves my network.

## Introduction

This document explains how my CI/CD pipeline is structured using Gitea runners inside my homelab environment. The goal is to create a fully self-hosted development workflow where code can be pushed, built, tested, and deployed automatically without relying on external CI services.

My setup is built around a Kubernetes (K3s) cluster with seven ARM64 nodes: four Raspberry Pis and three Jetson Orin Nano Super GPU workers. In addition, I use a separate development machine with an RTX 3090 for local AI workloads and testing before deployment. Gitea acts as the central source control system, while runners handle automation tasks across the cluster.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For how every node and service fits together, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

---

## Pipeline Overview

My CI/CD pipeline is designed to be lightweight, distributed, and reproducible across my homelab.

### 1. Code Push
- Developers (me or automated agents) push code to a Gitea repository.
- Branch-based workflows are used (main, dev, feature branches).

### 2. Gitea Trigger
- A push to `main` triggers a Gitea Actions workflow defined in the repository.
- The job is picked up by a Gitea runner registered in the cluster.

### 3. Runner Execution (K3s Cluster)
- Runners are deployed as pods inside my Kubernetes (K3s) cluster.
- Tasks executed include:
  - Dependency installation
  - Unit tests
  - Linting
  - Build steps (Docker images or binaries)
- Every node in the cluster is ARM64, so images are built natively for `linux/arm64` with `docker buildx` — no cross-architecture emulation in the deploy path (see [ARM64 considerations](/blog/infrastructureengineering/12-arm64-considerations)).

### 4. Artifact Build & Distribution
- Successful builds generate Docker images.
- Instead of pushing to a registry, the image is exported and imported directly into each node's containerd with `k3s ctr images import`.
- Deployments set `imagePullPolicy: Never`, so pods always use the locally imported image.

### 5. Deployment Stage
- If tests pass, the pipeline triggers a deployment step.
- Kubernetes manifests are applied automatically.
- Services are rolled out using rolling updates to avoid downtime.

A full walkthrough of this path for one service is in [deploying an app on the rack](/blog/infrastructureengineering/45-deploying-an-app-on-the-rack).

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

### 6. Observability
- Logs from runners are collected by Promtail and stored in Loki for debugging.
- Cluster monitoring is handled through Prometheus and Grafana dashboards.
- Failed builds are traced back through Gitea logs and CI output.

---

## Architecture Notes

This system is designed to act as the “glue” of my infrastructure:

- **Gitea** → Source of truth for all code and automation triggers (installed as in [installing Gitea in Kubernetes](/blog/infrastructureengineering/23-installing-gitea-in-kubernetes))
- **K3s Cluster** → Execution layer for builds and deployments  
- **Raspberry Pi Nodes** → Lightweight distributed CI workers  
- **Jetson GPU Workers** → Deployment targets for GPU services (image generation, speech, LLM)  
- **x86 Machine (Dev / RTX 3090 box)** → Heavy compute + local AI experimentation, outside the cluster  
- **Node-local image store** → Images imported per node with `k3s ctr`, no registry in the loop  

[Kingdom Tools](/projects/kingdom-tools), my internal platform, uses the same pipeline: its starter stacks create a Gitea repo for a new service so it deploys this way from the first push.

This setup allows me to iterate quickly while keeping everything fully self-hosted and portable.

::CtaContactWork
---
buttonText: "Let's Talk About Your CI/CD Pipeline"
supportingCopy: "Building a self-hosted CI/CD pipeline with Gitea or similar tooling? Let's talk through the design."
destinationUrl: "/hire-me"
---
::

---

## Conclusion

This Gitea runner pipeline turns my homelab into a full production-style DevOps environment. Instead of relying on external CI/CD platforms, everything runs inside my own infrastructure, giving me full control over build processes, deployment logic, and compute distribution.

It also creates a strong foundation for future expansion, such as AI-driven CI agents, automated testing pipelines, and multi-service deployment systems across the cluster. As the system evolves, Gitea continues to act as the central orchestration layer that connects development, automation, and deployment into one unified workflow.

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
  buttonText: "Read: Infrastructure Design"
  supportingCopy: "Continue with \"Infrastructure Design\" to see the bigger architectural picture this pipeline deploys into."
  destinationUrl: "/blog/infrastructureengineering/22-infrastructure-design"
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
  - label: "CI/CD — Wikipedia"
    url: "https://en.wikipedia.org/wiki/CI/CD"
    type: "wikipedia"
    description: "According to this overview, CI/CD automates building, testing, and deploying software — the workflow the Gitea runner pipeline implements inside the homelab cluster."
  - label: "Gitea — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Gitea"
    type: "wikipedia"
    description: "Overview of Gitea as a self-hosted Git service — the source control platform acting as the central orchestration layer that triggers builds, deployments, and infrastructure updates across the cluster."
  - label: "DevOps — Wikipedia"
    url: "https://en.wikipedia.org/wiki/DevOps"
    type: "wikipedia"
    description: "According to this overview, DevOps integrates development and operations through automation — the practice the Gitea runner pipeline embodies, turning code commits into automated cluster deployments."
  - label: "Continuous Delivery — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Continuous_delivery"
    type: "wikipedia"
    description: "Overview of continuous delivery — the pipeline model where software is always in a deployable state, enabling the push-to-deploy workflow described for Kubernetes workloads in this article."
---
::

---

## Related reading

- [Future Expansion Plans](/blog/infrastructureengineering/20-future-expansion-plans) — previous in the series
- [Infrastructure Design](/blog/infrastructureengineering/22-infrastructure-design) — next in the series
- [Kubernetes for AI Developers: Deploying Local Models with k3s](/blog/ai-homelab-engineering/04-kubernetes-for-ai-developers-k3s) — the same deploy flow applied to model services
- [Why Self-Hosted Git](/blog/infrastructureengineering/40-why-self-hosted-git) — why I host Git myself in the first place
- [Infrastructure systems overview](/systems/infrastructure) — the hub page for the whole rack: nodes, services, and how they connect

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*