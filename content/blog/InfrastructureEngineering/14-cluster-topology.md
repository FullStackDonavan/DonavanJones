---
title: "Cluster Topology"
description: "How I designed the cluster topology for my homelab Kubernetes setup — node placement, workload zones, networking boundaries, and failure domains."
date: 2025-10-28
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - cluster
  - kubernetes
draft: false
slug: cluster-topology
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/14-cluster-topology.jpg
---

# Cluster Topology

A good cluster topology starts with understanding what you are optimizing for: reliability, simplicity, performance, or cost. In a homelab rack, that usually means balancing lightweight ARM nodes with more powerful systems for storage, databases, AI workloads, and development. The goal is not just to make the cluster work, but to make it scalable, maintainable, and resilient as more services are added over time.

My current topology has three tiers. A single Raspberry Pi control plane plus three Pi workers run infrastructure, self-hosted tooling, databases, and application services. Three Jetson Orin Nano Super boards join the same K3s cluster as GPU workers, each dedicated to one job: image generation, speech, or a small always-on LLM. The largest models run outside the cluster on one RTX 3090 workstation. Keeping those tiers separate keeps the rack stable while still giving me GPU inference both inside and outside Kubernetes.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For how every node and service fits together, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

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

- K3s cluster running core infrastructure (pi-node1 control plane, pi-worker-1 to -3)
- Jetson GPU workers inside the cluster (gpu-worker-1 to -3)
- Gitea for source control
- CI/CD runners connected to deployments
- PostgreSQL, Redis, Weaviate, and MinIO services
- AI microservices
- Self-hosted applications
- External RTX 3090 machine for large-model workloads
- S3-backed storage for application assets
- Docker-based AI containers outside the cluster

The [node roles](/blog/infrastructureengineering/27-node-roles) post goes through what each machine is responsible for.

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

In larger environments, dedicated control plane nodes improve stability. In smaller homelabs, combining control plane and worker functionality is often acceptable to reduce hardware requirements. Mine is a middle ground: pi-node1 is the single K3s server, and besides the control plane it hosts Prometheus, Grafana, and Gitea. The tradeoffs are in [control plane taints](/blog/infrastructureengineering/16-control-plane-taints).

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

My topology separates these responsibilities so the cluster remains efficient instead of forcing every workload onto the same hardware class. One caveat: "ARM means no AI" is outdated. The Jetson Orin boards are ARM64 with CUDA GPUs, and gpu-worker-3 serves llama3.2:3b at about 20.8 tok/s, entirely on the GPU. The only x86 machine in my setup is the RTX 3090 workstation.

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

My setup currently uses S3-backed storage for uploaded assets while keeping databases (PostgreSQL, Redis, Weaviate) and MinIO object storage inside the cluster. This reduces local storage pressure and simplifies scaling application services.

Future improvements may include:

- Distributed storage
- Dedicated NAS integration
- Replicated persistent volumes
- Backup nodes

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

My setup splits GPU work two ways. Small models run inside the cluster on the three Jetson GPU workers, one job per board, because each has 8 GB of unified memory (about 7.4 GiB usable) and fits only one ~4–5 GB model at a time. Large models like Ornith-1.0-35B run outside the cluster on the RTX 3090 machine, in Ollama.

This approach provides several benefits:

- Prevents cluster instability
- Simplifies GPU management
- Allows faster iteration
- Keeps inference isolated
- Reduces orchestration complexity

Loading, unloading, and benchmarking models on each Jetson goes through [Kingdom Tools](/projects/kingdom-tools), my internal platform for this cluster.

## Future Expansion

A topology should be designed with growth in mind.

Possible future additions include:

- More GPU nodes
- High availability control planes
- Distributed storage layers
- Separate staging environments
- Edge nodes
- AI orchestration services
- Monitoring clusters
- Backup automation
- Multi-site replication

The important part is designing the foundation early so expansion does not require rebuilding the entire environment.

::CtaContactWork
---
buttonText: "Let's Talk About Your Cluster Topology"
supportingCopy: "Designing workload separation and failure domains for your own cluster? Let's talk through the architecture."
destinationUrl: "/hire-me"
---
::

## Conclusion

Cluster topology is less about building the biggest rack possible and more about creating clear separation between workloads, responsibilities, and resource usage. A small but well-designed cluster is often far more useful than a large cluster with poor organization.

For my homelab, the focus is on building a practical infrastructure platform that supports Kubernetes, AI engineering, CI/CD, self-hosting, and application development without becoming overly complicated too early. By separating lightweight cluster services from heavier GPU workloads and designing around modular growth, the rack can continue evolving into a more production-like environment over time.

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
  buttonText: "Read: Consumer Hardware Usage"
  supportingCopy: "Continue with \"Consumer Hardware Usage\" to see how off-the-shelf hardware choices shape this topology in practice."
  destinationUrl: "/blog/infrastructureengineering/15-consumer-hardware-usage"
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
  - label: "Network Topology — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Network_topology"
    type: "wikipedia"
    description: "According to this overview, network topology describes the arrangement of nodes and links in a network — the design principle applied to separating control plane, worker, and GPU nodes in the homelab cluster."
  - label: "Kubernetes — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes"
    type: "wikipedia"
    description: "Overview of Kubernetes node types and scheduling — understanding the platform's scheduling model clarifies why topology decisions (which workloads land on which nodes) directly affect performance and stability."
  - label: "High Availability — Wikipedia"
    url: "https://en.wikipedia.org/wiki/High_availability"
    type: "wikipedia"
    description: "According to this overview, high availability minimizes downtime by eliminating single points of failure — the topology principle motivating control plane isolation and modular growth planning."
  - label: "ARM Architecture Family — Wikipedia"
    url: "https://en.wikipedia.org/wiki/ARM_architecture_family"
    type: "wikipedia"
    description: "Overview of ARM architecture — the hardware platform of the Raspberry Pi worker nodes, whose power and compute constraints directly inform the topology decisions described in this article."
---
::

---

## Related reading

- [Cluster Architecture (Homelab)](/blog/infrastructureengineering/13-cluster-architecture-homelab) — previous in the series
- [Consumer Hardware Usage](/blog/infrastructureengineering/15-consumer-hardware-usage) — next in the series
- [Network Topology](/blog/infrastructureengineering/24-network-topology) — the network side of the same layout
- [Infrastructure systems overview](/systems/infrastructure) — the hub page for the whole rack: nodes, services, and how they connect
- [RTX 3090 + Jetson Orin: A Hybrid AI Architecture](/blog/ai-homelab-engineering/03-rtx-3090-jetson-orin-hybrid-architecture) — how the 3090 and Jetsons split AI work

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*

