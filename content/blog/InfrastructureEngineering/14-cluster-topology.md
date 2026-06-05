---
title: "Cluster Topology"
description: "Designing cluster topology for homelab and Kubernetes."
date: 2025-10-28
category: "infrastructure-engineering"
tags:
  - cluster
  - kubernetes
draft: false
slug: cluster-topology
author: Donavan Jones
---

# Cluster Topology

A good cluster topology starts with understanding what you are optimizing for: reliability, simplicity, performance, or cost. In a homelab rack, that usually means balancing lightweight ARM nodes with more powerful systems for storage, databases, AI workloads, and development. The goal is not just to make the cluster work, but to make it scalable, maintainable, and resilient as more services are added over time.

My current setup focuses on separating workloads across different systems while still keeping everything connected through Kubernetes and containerized services. The cluster handles infrastructure, deployments, self-hosted tooling, databases, and application services, while heavier AI models currently run on a separate development machine with an RTX 3090. This separation allows the rack to stay stable while still giving access to high-performance inference and development workflows.

## Why Topology Matters

Cluster topology affects almost everything:

- High availability
- Network traffic
- Storage performance
- Deployment reliability
- Resource allocation
- Scaling strategy
- Recovery during failures

Even in a homelab, bad topology decisions can create bottlenecks quickly. A single overloaded node or poorly planned storage layer can impact the entire environment.

A good topology keeps workloads organized and predictable.

## My Rack Approach

The rack is designed around a lightweight but expandable K3s environment. Smaller nodes handle orchestration and distributed services, while heavier compute systems are delegated to separate machines when necessary.

The overall architecture currently looks something like this:

- K3s cluster running core infrastructure
- Gitea for source control
- CI/CD runners connected to deployments
- PostgreSQL and Redis services
- AI microservices
- Self-hosted applications
- External GPU development machine for model workloads
- S3-backed storage for application assets
- Docker-based AI containers outside the cluster

This setup keeps the Kubernetes cluster responsive while allowing AI experimentation without exhausting cluster resources.

## Control Plane vs Worker Nodes

One of the first topology decisions is separating control plane responsibilities from worker workloads.

### Control Plane Responsibilities

The control plane manages:

- Scheduling
- Cluster state
- API operations
- Networking coordination
- Deployment orchestration

In larger environments, dedicated control plane nodes improve stability. In smaller homelabs, combining control plane and worker functionality is often acceptable to reduce hardware requirements.

### Worker Nodes

Worker nodes handle application workloads such as:

- APIs
- Databases
- Frontend services
- Background jobs
- Monitoring stacks
- CI/CD runners

Separating workloads across workers prevents a single service from consuming all available resources.

## ARM Nodes vs x86 Systems

Mixed architecture clusters are becoming increasingly common in homelabs.

### ARM Advantages

ARM systems like Raspberry Pis offer:

- Low power consumption
- Quiet operation
- Small footprint
- Affordable scaling

They work well for:

- DNS
- Reverse proxies
- Lightweight APIs
- Monitoring
- Automation services
- Git servers

### x86 Advantages

More powerful x86 systems are better suited for:

- Databases
- AI inference
- Large containers
- Video processing
- Build pipelines
- GPU acceleration

My topology separates these responsibilities so the cluster remains efficient instead of forcing every workload onto the same hardware class.

## Network Segmentation

Network layout is just as important as node layout.

A simple topology may include:

- Management network
- Storage traffic
- Public ingress traffic
- Internal service communication

As clusters grow, separating traffic types improves performance and troubleshooting.

For example:

- Ingress traffic can terminate at a reverse proxy
- Internal services communicate privately
- Storage replication stays isolated
- Monitoring traffic avoids interfering with production workloads

Even basic VLAN separation can make a major difference in larger homelab racks.

## Storage Design

Storage becomes one of the hardest parts of Kubernetes topology.

Stateless services are easy to move between nodes, but persistent workloads introduce complexity.

Examples include:

- PostgreSQL
- Redis persistence
- Media storage
- User uploads
- AI embeddings
- Vector databases

My setup currently uses S3-backed storage for uploaded assets while keeping databases closer to the cluster itself. This reduces local storage pressure and simplifies scaling application services.

Future improvements may include:

- Distributed storage
- Dedicated NAS integration
- Replicated persistent volumes
- Backup nodes
- Object storage inside the cluster

## CI/CD Integration

Topology also affects deployment workflows.

Using Gitea with CI runners inside or alongside the cluster creates a tighter development pipeline:

1. Push code to Gitea
2. Runner builds containers
3. Images are deployed automatically
4. Kubernetes updates workloads

This creates a self-hosted development ecosystem that mirrors larger production environments while remaining manageable in a homelab.

The cluster effectively becomes both the infrastructure platform and the deployment target.

## AI Workloads and GPU Separation

AI workloads introduce unique topology challenges.

Large models can consume:

- VRAM
- CPU resources
- RAM
- Storage bandwidth
- Network throughput

Instead of forcing these workloads directly into the cluster immediately, my current setup uses a separate RTX 3090 development machine running Docker containers for models and experimentation.

This approach provides several benefits:

- Prevents cluster instability
- Simplifies GPU management
- Allows faster iteration
- Keeps inference isolated
- Reduces orchestration complexity

Later, GPU nodes can be added directly into the Kubernetes cluster if needed.

## Future Expansion

A topology should be designed with growth in mind.

Possible future additions include:

- Dedicated GPU nodes
- High availability control planes
- Distributed storage layers
- Separate staging environments
- Edge nodes
- AI orchestration services
- Monitoring clusters
- Backup automation
- Multi-site replication

The important part is designing the foundation early so expansion does not require rebuilding the entire environment.

# Conclusion

Cluster topology is less about building the biggest rack possible and more about creating clear separation between workloads, responsibilities, and resource usage. A small but well-designed cluster is often far more useful than a large cluster with poor organization.

For my homelab, the focus is on building a practical infrastructure platform that supports Kubernetes, AI engineering, CI/CD, self-hosting, and application development without becoming overly complicated too early. By separating lightweight cluster services from heavier GPU workloads and designing around modular growth, the rack can continue evolving into a more production-like environment over time.

