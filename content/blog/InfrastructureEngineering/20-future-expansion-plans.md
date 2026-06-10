---
title: "Future Expansion Plans"
description: "My plans for expanding my homelab infrastructure — additional nodes, GPU workloads, expanded storage, and the next phase of the Kubernetes cluster."
date: 2025-11-12
lastUpdated: "2026-06-09"
category: "infrastructure-engineering"
tags:
  - homelab
  - expansion
draft: false
slug: future-expansion-plans
author: Donavan Jones
---

# Future Expansion Plans

## Introduction

My homelab has evolved from a simple learning environment into a distributed infrastructure that now supports real workloads, including Kubernetes-based deployments, AI services, and the backend systems powering my Bible application. With a Raspberry Pi-based K3s cluster forming the core compute layer, a separate development machine equipped with an RTX 3090 handling model workloads, and services like Gitea and CI runners already integrated, the next phase is about stability, scalability, and tighter automation between all components.

## Current Architecture Overview

Right now, my setup is split into a few key layers:

- A K3s cluster running on Raspberry Pi nodes acting as lightweight production compute
- A dedicated development machine running Docker containers for AI models (including GPU workloads on an RTX 3090)
- A Gitea instance hosted within the cluster for source control and internal repositories
- CI/CD runners connected to the cluster for automated deployments
- Services for my Bible app including API backend, social features, and AI integration (Bible Logic)
- Supporting infrastructure such as PostgreSQL, Redis caching, and vector search systems

This separation allows me to iterate quickly while still maintaining a production-like environment in the cluster.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

## Short-Term Expansion Plans

In the near term, I want to improve reliability and automation:

- Fully stabilize CI/CD pipelines between Gitea and the K3s cluster
- Improve secret management across services (likely via sealed secrets or external vault system)
- Add better observability (metrics, logs, and tracing) across all services
- Optimize resource allocation on the Raspberry Pi nodes to prevent bottlenecks
- Improve deployment consistency for AI microservices and Bible Logic integrations

## Mid-Term Goals

The next stage is scaling functionality and compute efficiency:

- Integrate the RTX 3090 machine more directly into the cluster as a hybrid compute node for AI workloads
- Expand AI microservices architecture (retrieval systems, theological search, agent memory systems)
- Improve vector database performance for semantic search in Bible/Quran comparison tools
- Introduce workload scheduling between local cluster and GPU machine depending on task type
- Begin separating services into more independent, scalable microservices

---

*Explore more articles in the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

---

## Long-Term Vision

Long term, this system becomes a fully self-hosted AI and application platform:

- A hybrid edge + GPU cluster where local Pi nodes handle routing and APIs, while GPU systems handle inference and training
- Fully automated CI/CD pipeline from code commit to deployment with minimal manual intervention
- A persistent AI agent layer that powers Bible Logic, study tools, debates, and user interactions
- A scalable marketplace for games, books, and media integrated directly into the infrastructure
- Multi-node redundancy so that no single device failure brings down core services

## Conclusion

The goal of my homelab is no longer just experimentation—it is becoming a production-grade ecosystem that supports real users, real applications, and real AI workloads. By combining lightweight Kubernetes on Raspberry Pi hardware with a powerful GPU-backed development machine and a growing CI/CD and AI tooling stack, I am building a system that can evolve with my Bible app, AI agents, and future projects. The focus now is refinement: making everything more automated, resilient, and scalable while keeping full control of the stack.

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "High Availability — Wikipedia"
    url: "https://en.wikipedia.org/wiki/High_availability"
    type: "wikipedia"
    description: "According to this overview, high availability minimizes service disruption through redundancy and failover — the design goal driving plans for multi-node control planes and replicated services in the expanded cluster."
  - label: "Kubernetes — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes"
    type: "wikipedia"
    description: "Overview of Kubernetes scalability — understanding how the platform handles cluster growth informs the planned additions of GPU nodes, distributed storage, and expanded service mesh capabilities."
  - label: "GPU Computing — Wikipedia"
    url: "https://en.wikipedia.org/wiki/General-purpose_computing_on_graphics_processing_units"
    type: "wikipedia"
    description: "According to this overview, GPU computing enables parallel processing for AI workloads — the capability planned for direct Kubernetes cluster integration, moving AI inference from a Docker-only node into the orchestrated stack."
  - label: "Distributed Computing — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Distributed_computing"
    type: "wikipedia"
    description: "Overview of distributed computing — the architectural paradigm the expanded homelab is moving toward, with multi-node redundancy, distributed storage, and horizontally scaled services replacing the current single-control-plane design."
---
::

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*
