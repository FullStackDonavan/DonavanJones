---
title: "Future Expansion Plans"
description: "My plans for expanding my homelab infrastructure — additional nodes, GPU workloads, expanded storage, and the next phase of the Kubernetes cluster."
date: 2025-11-12
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - homelab
  - expansion
draft: false
slug: future-expansion-plans
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/20-future-expansion-plans.jpg
---

# Future Expansion Plans

My expansion plan for the homelab has three phases. Short term is reliability: stable CI/CD, secrets management, and observability. Mid term is better use of GPU compute: smarter model scheduling and fine-tuned small models. Long term is a fully self-hosted AI and application platform with redundancy, so no single device can take down core services. Since I first wrote this, some items have already shipped. I've noted which ones below.

## Introduction

My homelab has evolved from a simple learning environment into a distributed infrastructure that now supports real workloads, including Kubernetes-based deployments, AI services, and the backend systems powering my Bible application, [VerseHub](/projects/versehub). With a Raspberry Pi-based K3s cluster forming the core compute layer, three Jetson Orin GPU workers in the cluster, a separate development machine with an RTX 3090 handling large-model workloads, and services like Gitea and CI runners already integrated, the next phase is about stability, scalability, and tighter automation between all components.

## Current Architecture Overview

Right now (updated November 2026), my setup is split into a few key layers:

- A seven-node K3s cluster: four Raspberry Pis (one control plane, three workers) as lightweight production compute
- Three Jetson Orin Nano Super 8GB boards in the same cluster as GPU workers (image generation, speech, and an always-on llama3.2:3b)
- A dedicated development machine with a single RTX 3090 running large models like Ornith-1.0-35B
- A Gitea instance hosted within the cluster for source control, with Gitea Actions deploying on every push to main
- Services for my Bible app including API backend, social features, and AI integration (BibleLogic)
- Supporting infrastructure: PostgreSQL, Redis, Weaviate for vectors, and MinIO for object storage
- Prometheus, Grafana, and Loki for metrics, dashboards, and logs

This separation allows me to iterate quickly while still maintaining a production-like environment in the cluster.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For how every node and service fits together, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

## Short-Term Expansion Plans

In the near term, I want to improve reliability and automation:

- Fully stabilize CI/CD pipelines between Gitea and the K3s cluster (done: push to main now deploys via Gitea Actions — see the [Gitea runners pipeline](/blog/infrastructureengineering/21-gitea-runners-pipeline))
- Improve secret management across services (likely via sealed secrets or external vault system)
- Add better observability (metrics, logs, and tracing) across all services (metrics and logs done with Prometheus, Grafana, and Loki; tracing still to come)
- Optimize resource allocation on the Raspberry Pi nodes to prevent bottlenecks
- Improve deployment consistency for AI microservices and Bible Logic integrations

## Mid-Term Goals

The next stage is scaling functionality and compute efficiency:

- Add GPU compute to the cluster (done differently than planned: three Jetson Orin boards joined as GPU workers, while the RTX 3090 stays outside the cluster and is being rebuilt into a headless Linux training box for fine-tuning small models for the Jetsons)
- Expand AI microservices architecture (retrieval systems, theological search, agent memory systems)
- Improve vector database performance for semantic search in Bible/Quran comparison tools
- Introduce workload scheduling between local cluster and GPU machine depending on task type (partly done: [Kingdom Tools](/projects/kingdom-tools) can load, unload, and benchmark models on each Jetson)
- Begin separating services into more independent, scalable microservices

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

## Long-Term Vision

Long term, this system becomes a fully self-hosted AI and application platform:

- A hybrid edge + GPU cluster where local Pi nodes handle routing and APIs, while GPU systems handle inference and training
- Fully automated CI/CD pipeline from code commit to deployment with minimal manual intervention
- A persistent AI agent layer that powers Bible Logic, study tools, debates, and user interactions
- A scalable marketplace for games, books, and media integrated directly into the infrastructure
- Multi-node redundancy so that no single device failure brings down core services

::CtaContactWork
---
buttonText: "Let's Talk About Your Roadmap"
supportingCopy: "Planning the next phase of your own homelab or cluster? Let's talk through where to scale next."
destinationUrl: "/hire-me"
---
::

## Conclusion

The goal of my homelab is no longer just experimentation—it is becoming a production-grade ecosystem that supports real users, real applications, and real AI workloads. By combining lightweight Kubernetes on Raspberry Pi hardware, Jetson GPU workers, and a powerful GPU-backed development machine and a growing CI/CD and AI tooling stack, I am building a system that can evolve with my Bible app, AI agents, and future projects. The focus now is refinement: making everything more automated, resilient, and scalable while keeping full control of the stack.

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
  buttonText: "Read: Gitea Runners Pipeline"
  supportingCopy: "Continue with \"Gitea Runners Pipeline\" to see the CI/CD automation this roadmap is built around."
  destinationUrl: "/blog/infrastructureengineering/21-gitea-runners-pipeline"
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

## Related reading

- [DNS and Service Discovery](/blog/infrastructureengineering/19-dns-and-service-discovery) — previous in the series
- [Gitea Runners Pipeline](/blog/infrastructureengineering/21-gitea-runners-pipeline) — next in the series
- [Infrastructure systems overview](/systems/infrastructure) — the hub page for the whole rack: nodes, services, and how they connect
- [Scaling VerseHub with Local AI Infrastructure](/blog/versehub-engineering/09-scaling-versehub-with-local-ai-infrastructure) — the app this roadmap mostly serves
- [Complete Guide: Building a Production-Ready Local AI Development Platform](/blog/ai-homelab-engineering/16-complete-guide-production-ready-local-ai-platform) — the end-state platform this roadmap is heading toward

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*
