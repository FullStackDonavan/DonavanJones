---
title: "My Homelab Architecture for Agentic AI Development"
description: "A complete architecture overview of a production-oriented AI homelab — hybrid GPU tiers, k3s orchestration, and the reasoning behind every major decision."
date: 2026-01-14
lastUpdated: "2026-06-09"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - architecture
draft: true
slug: my-homelab-architecture-for-agentic-ai
author: Donavan Jones
---

# My Homelab Architecture for Agentic AI Development

This is the map for the rest of this series — the full architecture, at a glance, before the individual pieces get their own deep dives. Every AI homelab article on this site references back to this one.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI homelab deep-dive in this series."
destinationUrl: "/categories/ai-homelab-engineering"
---
::

## The Cluster at a Glance

```
┌──────────────────────────────────────────────────────────┐
│                    k3s control plane                      │
├──────────────┬──────────────┬──────────────┬──────────────┤
│  Jetson Orin │  Jetson Orin │  Jetson Orin │   RTX 3090   │
│  Nano Super  │  Nano Super  │  Nano Super  │  (desktop)   │
│   (worker)   │   (worker)   │   (worker)   │   (worker)   │
├──────────────┴──────────────┴──────────────┴──────────────┤
│         MinIO (model + artifact storage, distributed)     │
├─────────────────────────────────────────────────────────────┤
│      Redis (session/agent state) · PostgreSQL (metadata)   │
└──────────────────────────────────────────────────────────┘
```

Four inference-capable nodes under one Kubernetes control plane, backed by distributed object storage and a shared state layer. Every node is a k3s worker; workloads get scheduled to whichever node fits the resource profile, rather than each machine running its own disconnected setup.

## The Core Decision: Two Hardware Tiers, Not One

The single biggest architectural decision is running two very different classes of hardware instead of standardizing on one. The Jetson Orin Nano Super nodes are low-power, always-on, and handle embeddings, smaller models, and background agent tasks. The RTX 3090 is the heavy-lifting tier for the largest models and the most latency-sensitive interactive work (the coding agent covered in the [Local Vibe Coding series](/categories/local-vibe-coding)).

This split exists because a single hardware tier forces a bad tradeoff: size for the biggest workload and you're running an expensive, power-hungry GPU 24/7 for tasks that don't need it; size for the average workload and the biggest tasks are slow or impossible.

## Why Kubernetes at All

For four machines, Kubernetes might look like overkill compared to a handful of shell scripts. In practice, the value shows up immediately: workload scheduling based on actual resource availability, automatic restart on crash, and a consistent deployment model across genuinely different hardware (ARM64 Jetson boards and an x86 desktop) that would otherwise need separate tooling.

## The Storage and State Layer

MinIO provides S3-compatible object storage for models, embeddings, and generated artifacts, distributed across the cluster rather than living on a single node's disk — a node failure doesn't take the model cache with it. Redis handles fast-access session and agent state; PostgreSQL holds anything relational and long-lived (metadata, structured records).

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See the interactive architecture diagram for this homelab."
destinationUrl: "/systems/ai-homelab"
---
::

## What's Covered in the Rest of This Series

Each layer of this diagram gets its own article: the Jetson cluster specifically, the RTX 3090/Jetson hybrid reasoning in more depth, k3s deployment mechanics, networking, MinIO configuration, and — the parts most homelab writeups skip — the actual security posture, the real monthly power bill, and the mistakes made building all of this the first time through.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Raspberry Pi AI Cluster Blueprint"
  supportingCopy: "Get the full build blueprint — architecture diagrams, k3s configs, and hardware list ($39)."
  destinationUrl: "/products/raspberry-pi-ai-cluster-blueprint"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Using Three Jetson Orin Nano Supers as an AI Cluster"
  supportingCopy: "The always-on tier of this architecture, in depth."
  destinationUrl: "/blog/ai-homelab-engineering/three-jetson-orin-nano-supers-as-ai-cluster"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get new homelab breakdowns delivered before they're public."
  ---
  :::
::

## Further Reading

::AuthoritativeLinks
---
title: "Authoritative Sources"
links:
  - label: "k3s — Official Documentation"
    url: "https://docs.k3s.io/"
    type: "external"
    description: "Official documentation for the lightweight Kubernetes distribution running this cluster's control plane."
  - label: "NVIDIA Jetson Orin — Developer Site"
    url: "https://developer.nvidia.com/embedded/jetson-orin"
    type: "external"
    description: "Official specs for the Jetson Orin platform used in the always-on inference tier."
  - label: "MinIO — Official Documentation"
    url: "https://min.io/docs/minio/linux/index.html"
    type: "external"
    description: "Documentation for the S3-compatible object storage used for distributed model and artifact storage."
---
::

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
