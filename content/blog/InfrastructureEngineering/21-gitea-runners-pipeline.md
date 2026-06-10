---
title: "Gitea Runners Pipeline"
description: "How CI/CD pipeline execution works using Gitea runners inside my homelab Kubernetes cluster — job routing, runner registration, and pipeline design."
date: 2025-11-15
lastUpdated: "2026-06-09"
category: "infrastructure-engineering"
tags:
  - gitea
  - ci-cd
draft: false
cluster: "infrastructure-engineering"
slug: gitea-runners-pipeline
author: Donavan Jones
---

# Gitea Runners Pipeline

## Introduction

This document explains how my CI/CD pipeline is structured using Gitea runners inside my homelab environment. The goal is to create a fully self-hosted development workflow where code can be pushed, built, tested, and deployed automatically without relying on external CI services.

My setup is built around a Kubernetes (K3s) cluster running on a small rack of machines, including Raspberry Pi nodes and a dedicated x86 machine used for heavier workloads. In addition, I use a separate development machine with an RTX 3090 for local AI workloads and testing before deployment. Gitea acts as the central source control system, while runners handle automation tasks across the cluster.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

---

## Pipeline Overview

My CI/CD pipeline is designed to be lightweight, distributed, and reproducible across my homelab.

### 1. Code Push
- Developers (me or automated agents) push code to a Gitea repository.
- Branch-based workflows are used (main, dev, feature branches).

### 2. Gitea Trigger
- A webhook triggers the CI pipeline when a push event occurs.
- The event is picked up by a Gitea runner registered in the cluster.

### 3. Runner Execution (K3s Cluster)
- Runners are deployed as pods inside my Kubernetes (K3s) cluster.
- Tasks executed include:
  - Dependency installation
  - Unit tests
  - Linting
  - Build steps (Docker images or binaries)
- Lightweight workloads run on Raspberry Pi nodes.
- Heavier builds are scheduled on x86 nodes for performance efficiency.

### 4. Artifact Build & Storage
- Successful builds generate Docker images or packaged artifacts.
- Images are pushed to a private container registry inside the cluster.
- Version tags follow commit SHA or semantic versioning.

### 5. Deployment Stage
- If tests pass, the pipeline triggers a deployment step.
- Kubernetes manifests or Helm charts are applied automatically.
- Services are rolled out using rolling updates to avoid downtime.

---

*Explore more articles in the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

---

### 6. Observability
- Logs from runners are collected and stored for debugging.
- Cluster monitoring is handled through internal tooling and dashboards.
- Failed builds are traced back through Gitea logs and CI output.

---

## Architecture Notes

This system is designed to act as the “glue” of my infrastructure:

- **Gitea** → Source of truth for all code and automation triggers  
- **K3s Cluster** → Execution layer for builds and deployments  
- **Raspberry Pi Nodes** → Lightweight distributed CI workers  
- **x86 Machine (Dev / RTX 3090 box)** → Heavy compute + local AI experimentation  
- **Container Registry** → Stores versioned builds for deployment  

This setup allows me to iterate quickly while keeping everything fully self-hosted and portable.

---

## Conclusion

This Gitea runner pipeline turns my homelab into a full production-style DevOps environment. Instead of relying on external CI/CD platforms, everything runs inside my own infrastructure, giving me full control over build processes, deployment logic, and compute distribution.

It also creates a strong foundation for future expansion, such as AI-driven CI agents, automated testing pipelines, and multi-service deployment systems across the cluster. As the system evolves, Gitea continues to act as the central orchestration layer that connects development, automation, and deployment into one unified workflow.

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

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*