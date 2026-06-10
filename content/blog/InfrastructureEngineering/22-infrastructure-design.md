---
title: "Infrastructure Design"
description: "Core principles for designing robust self-hosted infrastructure — separation of concerns, redundancy planning, and lessons from building a production homelab."
date: 2025-11-17
lastUpdated: "2026-06-09"
category: "infrastructure-engineering"
tags:
  - design
  - homelab
draft: false
slug: infrastructure-design
author: Donavan Jones
---

# Infrastructure Design

## Introduction

Infrastructure design is not just about servers, clusters, or networking—it’s about building systems that can evolve without breaking under pressure. In my case, I approach infrastructure as a living system that supports both software development and real-world deployment needs: AI workloads, web applications, CI/CD pipelines, and experimental services.

My current setup reflects this philosophy. I run a homelab rack powered by a K3s Kubernetes cluster on multiple nodes, combined with a separate development machine running an RTX 3090 for local model execution and experimentation. I also use Gitea as the central Git system, paired with self-hosted CI runners that act as the glue between code and deployment. This separation of concerns—compute, orchestration, and development—lets me iterate quickly without sacrificing stability.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

---

## Core Principles

### 1. Separation of Concerns
Each part of the system has a defined role:
- Kubernetes (K3s) handles orchestration and service deployment
- The 3090 development machine handles AI workloads and local inference
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

This removes manual deployment friction and enforces consistency.

### 4. Hybrid Compute Model
Not everything belongs in Kubernetes. My RTX 3090 machine runs:
- AI model training
- Inference services inside Docker containers
- Experimental workloads that don’t need orchestration overhead

Kubernetes handles stable services; the GPU box handles heavy computation.

---

## Current Homelab Architecture

At a high level, my infrastructure looks like this:

- **K3s Cluster (Rack Nodes)**
  - Runs production-like services
  - Hosts APIs, backend services, and supporting infrastructure
  - Handles service discovery and networking

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

---

*Explore more articles in the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

---

## Design Philosophy

The goal of this infrastructure is not maximum scale—it’s maximum learning velocity with production-grade patterns.

I prioritize:
- Observability over complexity
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

---

## Conclusion

This infrastructure is designed to behave like a small production cloud, but fully controlled in a homelab environment. The combination of a K3s cluster, a GPU-powered development machine, and a CI/CD-driven workflow creates a system where experimentation and production engineering coexist.

The real value is not in the hardware itself, but in the workflow it enables: rapid iteration, safe deployment, and the ability to treat infrastructure as code rather than manual setup. As the system grows, the goal remains the same—keep it modular, automated, and close to real-world production standards while still flexible enough for experimentation.

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

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*