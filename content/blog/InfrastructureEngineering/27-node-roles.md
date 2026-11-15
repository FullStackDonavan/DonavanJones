---
title: "Node Roles"
description: "Kubernetes node roles in my 7-node K3s homelab: a Pi control plane, three Pi workers, and three Jetson GPU workers split into image-gen, speech, and LLM roles."
date: 2025-12-02
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - kubernetes
  - nodes
draft: false
slug: node-roles
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/27-node-roles.jpg
---

# Node Roles

## Introduction

Node roles decide which machines run the Kubernetes control plane, which run general workloads, and which are reserved for specialized jobs like GPU inference. In my 7-node K3s homelab, one Raspberry Pi (pi-node1) is the control plane, three Pis are general workers, and three Jetson Orin Nano Super boards are GPU workers with one fixed role each. That separation is what keeps the cluster stable and easy to reason about.

| Node | Hardware | Role |
| --- | --- | --- |
| pi-node1 | Raspberry Pi | K3s server (control plane); hosts Prometheus, Grafana, Gitea |
| pi-worker-1, pi-worker-3 | Raspberry Pi | General workers |
| pi-worker-2 | Raspberry Pi | General worker; also runs Redis |
| gpu-worker-1 | Jetson Orin Nano Super 8GB | `image-gen`: Stable Diffusion service + a shelf of small Ollama models |
| gpu-worker-2 | Jetson Orin Nano Super 8GB | `speech`: Kokoro TTS + whisper.cpp STT |
| gpu-worker-3 (hostname `charlie-desktop`, headless) | Jetson Orin Nano Super 8GB | `llm`: llama3.2:3b pinned in memory |

This structure becomes especially important in a homelab setting where hardware is limited and efficiency matters. By clearly defining node roles, I can ensure that critical services like the Kubernetes API server remain stable on dedicated nodes, while worker nodes handle more dynamic workloads such as my Bible app services, CI/CD pipelines from Gitea, and supporting microservices running across the cluster.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For the full architecture, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

---

## Control Plane Nodes

Control plane nodes are the brain of the cluster. In my K3s setup, these nodes run the core Kubernetes components responsible for scheduling, cluster state, and API management.

Key responsibilities include:
- Managing the Kubernetes API server
- Scheduling workloads across worker nodes
- Maintaining cluster state via etcd (or K3s embedded datastore)
- Handling cluster-level decisions and orchestration

In a small Raspberry Pi rack like mine, control plane stability is critical. I run a single server node, pi-node1, and keep heavy workloads off it (the mechanics are in [control plane taints](/blog/infrastructureengineering/16-control-plane-taints)) to prevent resource contention. This ensures that even when CI/CD pipelines or AI services spike CPU usage elsewhere in the cluster, the control plane remains responsive.

---

## Worker Nodes

Worker nodes are where most of the action happens. These nodes run the actual application workloads deployed into the cluster.

In my homelab rack, worker nodes handle:
- Docker containers for my Bible app services
- AI microservices and inference workloads
- Gitea runners for CI/CD builds
- API services and backend microservices
- Batch jobs like the [corpus crawler](/blog/infrastructureengineering/47-running-the-corpus-crawler-on-the-rack), which runs as a Kubernetes Job

Because every node is ARM64 (Pis and Jetsons alike), images are built for `linux/arm64` and workload efficiency is important. I often tune resource limits and requests carefully so multiple services can coexist without starving the node.

Worker nodes are also the most scalable part of the system—adding a new Raspberry Pi to the rack immediately increases compute capacity without changing cluster architecture.

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

## Specialized / Supporting Nodes

In a more advanced homelab setup like mine, not every node is purely control plane or worker. Some nodes take on specialized roles depending on needs.

These can include:
- **Storage-focused nodes** for persistent volumes and database workloads
- **CI/CD runner nodes** dedicated to builds and deployments via Gitea
- **Observability nodes** running logging, metrics, and monitoring stacks
- **AI service nodes** — in my cluster, the three Jetsons. Each has 8 GB of unified memory, so only one ~4–5 GB model fits per board; giving each Jetson a single role (image-gen, speech, or LLM) avoids out-of-memory thrash. More on that in [using three Jetson Orin Nano Supers as an AI cluster](/blog/ai-homelab-engineering/02-three-jetson-orin-nano-supers-as-ai-cluster).

This separation helps prevent “noisy neighbor” problems where one workload could impact everything else in the cluster. It also makes debugging and scaling much more predictable.

---

## How This Fits My Rack Architecture

Inside my Raspberry Pi rack, node roles are physically and logically distributed. Instead of treating the rack as a single compute block, it functions like a small cloud system.

- Control plane nodes sit in stable, always-on positions
- Worker nodes scale horizontally as I add or repurpose Pis
- CI/CD and service nodes integrate directly with my Gitea-based deployment pipeline
- Storage and stateful workloads are isolated to reduce risk
- GPU workers carry role labels, so inference pods only land on the Jetson with the matching role

This design is what allows my homelab to support a mix of infrastructure, AI engineering, and application development without collapsing under complexity.

::CtaContactWork
---
buttonText: "Let's Talk About Your Node Layout"
supportingCopy: "Deciding how to split control plane, worker, and specialized roles on your own cluster? Let's talk through the design."
destinationUrl: "/hire-me"
---
::

---

## Conclusion

Node roles are the foundation that make a Kubernetes cluster understandable and maintainable, especially in a constrained homelab environment. In my Raspberry Pi rack, this separation transforms a collection of small devices into a structured, cloud-like system where each node has a purpose.

By clearly defining control plane, worker, and specialized nodes, I can scale individual parts of the system independently, improve reliability, and keep workloads isolated. As the cluster grows—whether through new services, AI workloads, or CI/CD expansion—these roles ensure the architecture remains clean, predictable, and easy to evolve.

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
  buttonText: "Read: Physical Organization"
  supportingCopy: "Continue with \"Physical Organization\" to see how these node roles map onto the physical layout of the rack."
  destinationUrl: "/blog/infrastructureengineering/28-physical-organization"
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
  - label: "Kubernetes — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes"
    type: "wikipedia"
    description: "According to this overview, Kubernetes assigns distinct responsibilities to control plane and worker nodes — the node role separation described in this article for organizing the homelab Raspberry Pi cluster."
  - label: "ARM Architecture Family — Wikipedia"
    url: "https://en.wikipedia.org/wiki/ARM_architecture_family"
    type: "wikipedia"
    description: "Overview of ARM architecture — the instruction set used by Raspberry Pi worker and control plane nodes, whose power-efficiency advantages make them suitable for infrastructure roles that run continuously."
  - label: "Separation of Concerns — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Separation_of_concerns"
    type: "wikipedia"
    description: "According to this overview, separation of concerns reduces coupling by giving each part of a system a well-defined responsibility — the design principle underlying node role assignment in the homelab cluster."
  - label: "Container Orchestration — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes#Architecture"
    type: "wikipedia"
    description: "Overview of container orchestration architecture — the scheduling and health management system that uses node roles (control plane vs. worker) to distribute Kubernetes components and workloads correctly."
---
::

---

## Related reading

- [Networking (Skill)](/blog/infrastructureengineering/26-networking-skill) — previous in the series.
- [Physical Organization](/blog/infrastructureengineering/28-physical-organization) — next in the series: where these nodes physically sit.
- [Infrastructure systems overview](/systems/infrastructure) — the hub for the full cluster architecture.
- [RTX 3090 + Jetson Orin: A Hybrid AI Architecture](/blog/ai-homelab-engineering/03-rtx-3090-jetson-orin-hybrid-architecture) — how the GPU workers and the 3090 split AI work.

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*