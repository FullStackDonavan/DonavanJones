---
title: "Pod Layouts"
description: "How I lay out pods and deployments across my Kubernetes cluster — affinity rules, namespace separation, resource limits, and workload placement strategy."
date: 2025-12-12
lastUpdated: "2026-06-09"
category: "infrastructure-engineering"
tags:
  - kubernetes
  - pods
draft: false
slug: pod-layouts
author: Donavan Jones
---

# Pod Layouts

## Introduction

In my homelab Kubernetes environment, running on a Raspberry Pi-based K3s cluster inside my rack, pod layout is one of the most important design decisions. Since I’m not working with cloud-managed infrastructure, I have to be intentional about how workloads are distributed across constrained ARM nodes, a lightweight control plane, and external compute resources like my development machine with a GPU.

This setup forces me to think differently about architecture: instead of scaling vertically with cloud instances, I design around node specialization, workload isolation, and predictable scheduling behavior. Pod layout becomes the backbone of system reliability, performance, and maintainability in my cluster.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

---

# Understanding Pod Layouts in My Cluster

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
- MySQL or PostgreSQL databases
- Redis caching layers
- Vector or search services

In my rack, I prioritize data consistency by pinning these pods to more stable nodes and using persistent volumes.

---

## 3. Node Affinity and Scheduling Rules

Since my cluster runs on limited hardware, I use scheduling rules to control where pods land.

Examples of scheduling strategy:

- Lightweight services → distributed across all Pi nodes
- Stateful workloads → pinned to specific reliable nodes
- Experimental services → isolated node groups
- GPU-related workloads → offloaded to my external dev machine (Docker-based model server outside the cluster)

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

My external development machine (with an RTX 3090) runs AI workloads in Docker containers. The cluster communicates with it through APIs.

This creates a layout like:

- Kubernetes cluster → handles app logic and orchestration
- External GPU machine → handles inference, model execution, AI services
- Communication layer → REST/gRPC between cluster and GPU host

This separation prevents the Raspberry Pi nodes from being overwhelmed while still allowing AI features in my applications.

---

## 5. Deployment Strategy (GitOps Style Thinking)

My deployment workflow is evolving toward a Git-driven model using Gitea and CI runners in the rack.

Typical flow:

1. Code pushed to repository
2. CI pipeline builds container images
3. Images are deployed to K3s cluster
4. Pods update using rolling updates

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

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*