---
title: "Pod Layouts"
description: "How I lay out pods in my K3s homelab: a quiet control plane, Pi workers for apps and data, Jetson GPU workers for inference, and node affinity rules."
date: 2025-12-12
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - kubernetes
  - pods
draft: false
slug: pod-layouts
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/29-pod-layouts.jpg
---

# Pod Layouts

## Introduction

My pod layout is simple: keep the control plane quiet, spread stateless app pods across the Raspberry Pi workers, pin stateful data pods to known nodes, and send GPU inference only to the Jetson worker whose role matches. In a 7-node K3s cluster with no cloud autoscaling behind it, intentional placement is what keeps constrained ARM nodes, a lightweight control plane, and an external RTX 3090 workstation working together.

This setup forces me to think differently about architecture: instead of scaling vertically with cloud instances, I design around node specialization, workload isolation, and predictable scheduling behavior. Pod layout becomes the backbone of system reliability, performance, and maintainability in my cluster.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For the full architecture, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

---

## Understanding Pod Layouts in My Cluster

Pod layouts refer to how workloads are organized, scheduled, and distributed across nodes in a Kubernetes cluster. In my setup, this is shaped heavily by the physical constraints of my rack environment and the mixed hardware roles.

## 1. Control Plane vs Worker Distribution

My cluster is built using K3s on Raspberry Pi nodes, which handle most of the orchestration. The control plane remains lightweight, while worker nodes handle application workloads.

Typical layout:

- Control Plane Node:
  - Manages scheduling, API server, and cluster state
  - Kept free from heavy workloads

- Worker Nodes (Raspberry Pi):
  - Run application pods
  - Handle lightweight services like APIs, dashboards, and automation tools
  - Optimized for ARM-compatible containers
- GPU Worker Nodes (three Jetson Orin Nano Supers):
  - One role each: image generation, speech (Kokoro TTS + Whisper STT), or LLM (llama3.2:3b)
  - Only one ~4–5 GB model fits in 8 GB of unified memory, so each gets exactly one heavy pod

This separation ensures stability even when workload demand increases.

---

## 2. Workload Categorization Strategy

Instead of randomly deploying pods, I organize them by function:

### Infrastructure Pods
These run core services for the cluster itself:
- DNS resolution (CoreDNS)
- Ingress controllers
- Metrics and monitoring tools

### Application Pods
These are services tied to my Bible app ecosystem:
- API services
- Authentication systems
- Social features (posts, feeds, reactions)
- Devotional content services

### Data Layer Pods
These require more care due to persistence:
- PostgreSQL databases
- Redis caching (Redis runs on pi-worker-2)
- MinIO object storage
- Weaviate for vector search

In my rack, I prioritize data consistency by pinning these pods to more stable nodes and using persistent volumes.

---

## 3. Node Affinity and Scheduling Rules

Since my cluster runs on limited hardware, I use scheduling rules to control where pods land.

Examples of scheduling strategy:

- Lightweight services → distributed across all Pi nodes
- Stateful workloads → pinned to specific reliable nodes
- Experimental services → isolated node groups
- GPU inference → pinned by node label to the matching Jetson GPU worker inside the cluster
- Embeddings and very large models → offloaded to my external RTX 3090 machine (outside the cluster)

This hybrid approach keeps the cluster responsive even under load.

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

## 4. External Compute Integration (Rack + GPU Machine)

One of the most important parts of my setup is that not everything runs inside Kubernetes.

My external development machine (with an RTX 3090) runs the workloads that don't fit on a Jetson: the sentence embedder for VerseHub retrieval and larger models like Ornith-1.0-35B in Ollama. The cluster communicates with it through APIs. The full split is described in [RTX 3090 + Jetson Orin: A Hybrid AI Architecture](/blog/ai-homelab-engineering/03-rtx-3090-jetson-orin-hybrid-architecture).

This creates a layout like:

- Kubernetes cluster → handles app logic and orchestration
- Jetson GPU workers → handle small-model inference, speech, and image generation in-cluster
- External GPU machine → handles embeddings and large-model inference
- Communication layer → REST/gRPC between cluster and GPU host

This separation prevents the Raspberry Pi nodes from being overwhelmed while still allowing AI features in my applications.

---

## 5. Deployment Strategy (GitOps Style Thinking)

My deployment workflow is evolving toward a Git-driven model using Gitea and CI runners in the rack.

Typical flow:

1. Code pushed to `main` in Gitea
2. A Gitea Actions runner builds the image with `docker buildx --platform linux/arm64`
3. The image is imported on each node with `k3s ctr images import` (deployments use `imagePullPolicy: Never`)
4. Pods update using rolling updates

For apps that are better off outside Kubernetes, [Deploying an App on the Rack](/blog/infrastructureengineering/45-deploying-an-app-on-the-rack) covers the SSH + systemd variant of the same Gitea Actions pipeline.

This ensures that pod layouts remain consistent and reproducible instead of being manually adjusted.

---

## 6. Failure Handling and Resilience

Because my cluster is running on homelab hardware, failure is expected, not theoretical.

To handle this:

- Pods are designed to restart automatically
- Stateless services are preferred where possible
- Replicas are used for critical services
- Node failures are tolerated without cluster collapse

The pod layout is intentionally designed to assume hardware will eventually fail.

::CtaContactWork
---
buttonText: "Let's Talk About Your Pod Scheduling"
supportingCopy: "Designing affinity rules and workload placement for your own cluster? Let's talk through the strategy."
destinationUrl: "/hire-me"
---
::

---

## Conclusion

Pod layout design in my Kubernetes cluster is less about abstract theory and more about adapting to real physical constraints inside my rack. Running K3s on Raspberry Pi nodes forces a disciplined approach to scheduling, resource management, and service separation.

By combining:

- ARM-based worker nodes
- A lightweight control plane
- External GPU compute for AI workloads
- Git-based deployment pipelines

I’ve built a hybrid system that behaves like a small-scale cloud, but remains fully under my control.

As the cluster evolves, pod layout will continue to be one of the most important factors in scaling services like my Bible app, AI systems, and future microservices architecture.

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
  buttonText: "Read: Power Consumption Tradeoffs"
  supportingCopy: "Continue with \"Power Consumption Tradeoffs\" to see how these workload placement decisions affect the rack's power draw."
  destinationUrl: "/blog/infrastructureengineering/30-power-consumption-tradeoffs"
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
    description: "According to this overview, Kubernetes schedules pods across nodes based on resource requests, affinity rules, and taints — the mechanisms that implement the pod layout strategy described in this article."
  - label: "Scheduling (Computing) — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Scheduling_(computing)"
    type: "wikipedia"
    description: "Overview of scheduling — the process Kubernetes uses to match pods to nodes, informed by resource availability, node selectors, and affinity rules that control where stateful and stateless workloads land."
  - label: "Separation of Concerns — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Separation_of_concerns"
    type: "wikipedia"
    description: "According to this overview, separation of concerns reduces coupling by giving each system component a single clear responsibility — the design principle behind separating stateful database pods from stateless API pods across cluster nodes."
  - label: "Container (Virtualization) — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Containerization_(computing)"
    type: "wikipedia"
    description: "Overview of containerization — the packaging model that makes pod layout decisions meaningful, since containers encapsulate resource requirements that the scheduler must fit within node capacity."
---
::

---

## Related reading

- [Physical Organization](/blog/infrastructureengineering/28-physical-organization) — previous in the series: where the nodes physically sit.
- [Power Consumption Tradeoffs](/blog/infrastructureengineering/30-power-consumption-tradeoffs) — next in the series.
- [Infrastructure systems overview](/systems/infrastructure) — the hub for the full cluster architecture.
- [Running Multiple Local Models Without Melting Your GPU](/blog/ai-homelab-engineering/09-running-multiple-local-models-without-melting-gpu) — why GPU pods get one model per board.

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*