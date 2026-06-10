---
title: "Cluster Architecture (Homelab)"
description: "Deep dive into the architecture of my homelab Kubernetes cluster — control plane design, worker node layout, networking, and storage topology explained."
date: 2025-10-26
lastUpdated: "2026-06-09"
category: "infrastructure-engineering"
tags:
  - kubernetes
  - architecture
draft: false
cluster: "infrastructure-engineering"
slug: cluster-architecture-homelab
author: Donavan Jones
---

# Cluster Architecture (Homelab)

My homelab cluster is the foundation behind nearly everything I build — from AI services and theological search systems to livestreaming infrastructure and my Bible platform. The environment is designed around low-cost, scalable hardware using Kubernetes, allowing me to experiment with distributed systems, CI/CD pipelines, self-hosted tooling, vector search, AI agents, and cloud-native development practices from home.

The rack combines ARM nodes, self-hosted services, storage, networking, and GPU-assisted AI workloads into a single ecosystem that I can continuously expand and refine over time.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

How my homelab Kubernetes cluster is architected.

## Overview

The cluster is built primarily around lightweight Kubernetes (K3s) running on multiple nodes. The goal is to maintain a modular infrastructure that supports:

- Self-hosted applications
- AI microservices
- Development environments
- CI/CD pipelines
- Streaming infrastructure
- Databases and caching
- Vector search and retrieval systems
- Experimental AI agents

The setup is designed to mimic production-style infrastructure while remaining affordable and power efficient.

## Core Infrastructure

### Kubernetes Distribution

I use K3s because it is lightweight, simple to manage, and works well on ARM-based hardware while still supporting production-like workflows.

Key benefits:

- Low resource overhead
- Fast deployments
- Simple cluster management
- ARM compatibility
- Easy scaling

## Hardware Layout

The rack currently consists of multiple low-power nodes running cluster workloads along with a separate GPU development machine.

### Cluster Nodes

The Kubernetes nodes handle:

- API services
- Databases
- Internal tooling
- Web applications
- Background workers
- CI/CD runners
- AI orchestration services

### GPU Development Machine

Outside the cluster, I run local AI models inside Docker containers on a dedicated development machine with an RTX 3090.

This system is used for:

- Running local LLMs
- Embedding generation
- AI experimentation
- Agent workflows
- Model testing
- Retrieval pipelines

Long term, the plan is to integrate the GPU machine more tightly into the cluster for shared orchestration and scheduling.

---

*Explore more articles in the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

---

## Networking

The cluster uses internal networking for service-to-service communication while exposing selected applications through ingress controllers and reverse proxies.

Typical traffic flow:

```text
Internet
   ↓
Reverse Proxy / Ingress
   ↓
Kubernetes Services
   ↓
Pods / Microservices
```

## Storage

Persistent workloads use mounted storage volumes for:

- Databases
- User uploads
- Media
- Vector indexes
- Application data
- Logs

Assets such as videos, game files, and uploaded media are stored externally on Amazon S3.

## Databases

The stack currently uses multiple storage layers depending on workload type.

### PostgreSQL

Primary relational database used for:

- User accounts
- App data
- Content systems
- Metadata
- Authentication

### Redis

Used for:

- Caching
- Queues
- Session storage
- Temporary state
- High-speed lookups

### Vector Storage

Vector search infrastructure is used for retrieval systems and AI workflows involving:

- Theology datasets
- Semantic search
- AI memory systems
- Embeddings
- Knowledge retrieval

## AI Infrastructure

AI services are a major part of the architecture.

### Current AI Workloads

The infrastructure supports:

- Local LLM inference
- AI agents
- Embedding pipelines
- Retrieval systems
- Tool-using agents
- Conversational systems
- Bible-focused AI tools

### Bible Logic

One of the core systems connected to the infrastructure is Bible Logic, an AI assistant integrated into my Bible platform.

The broader goal is building infrastructure capable of supporting persistent AI systems with memory, retrieval, tools, and orchestration.

## CI/CD

Source control and deployment pipelines are self-hosted.

### Gitea

Gitea is used for:

- Git repositories
- Source management
- Internal development
- Deployment workflows

### CI Runners

CI runners automate:

- Builds
- Deployments
- Container publishing
- Infrastructure updates
- Kubernetes rollouts

This allows code pushed to repositories to automatically deploy into the cluster.

## Application Hosting

The cluster hosts multiple types of applications including:

- APIs
- Web frontends
- AI services
- Streaming services
- Internal dashboards
- Background workers
- Experimental tooling

Applications are containerized and deployed through Kubernetes manifests and automated pipelines.

## Goals of the Architecture

The main goals of the homelab are:

- Learn production infrastructure
- Build scalable systems
- Self-host applications
- Develop AI tooling
- Practice DevOps workflows
- Experiment with distributed systems
- Create a flexible R&D environment

## Future Expansion

Planned improvements include:

- More cluster nodes
- GPU integration into Kubernetes
- Improved observability
- Dedicated storage systems
- High availability services
- Expanded AI orchestration
- More automation
- Edge AI workloads
- Multi-cluster experimentation

## Conclusion

This homelab has become more than just a place to host applications — it functions as an active research and engineering environment where I can develop real-world skills across infrastructure, AI engineering, Kubernetes, distributed systems, and backend development.

By combining self-hosted services, GPU-powered AI workloads, and automated deployment pipelines into a unified rack setup, the cluster gives me the flexibility to rapidly prototype ideas while learning how modern production systems are designed and operated at scale.

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "Kubernetes — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes"
    type: "wikipedia"
    description: "According to this overview, Kubernetes provides container orchestration across clusters of nodes — the platform at the center of the homelab architecture coordinating all services and workloads."
  - label: "Distributed Computing — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Distributed_computing"
    type: "wikipedia"
    description: "Overview of distributed computing — the paradigm the homelab cluster implements by spreading workloads across Raspberry Pi nodes and a dedicated GPU development machine."
  - label: "Continuous Integration and Delivery — Wikipedia"
    url: "https://en.wikipedia.org/wiki/CI/CD"
    type: "wikipedia"
    description: "According to this overview, CI/CD automates building, testing, and deploying software — the Gitea runner pipeline described as a core layer of the homelab architecture."
  - label: "GPU Computing — Wikipedia"
    url: "https://en.wikipedia.org/wiki/General-purpose_computing_on_graphics_processing_units"
    type: "wikipedia"
    description: "Overview of GPU computing — the capability the RTX 3090 development machine adds to the architecture for local AI inference, embedding generation, and model experimentation."
---
::

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*