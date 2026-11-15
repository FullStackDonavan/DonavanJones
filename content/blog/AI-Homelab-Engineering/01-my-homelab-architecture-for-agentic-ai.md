---
title: "My Homelab Architecture for Agentic AI Development"
description: "My AI homelab architecture: a 7-node k3s cluster of Raspberry Pis and three Jetson Orin Nano Supers, plus one RTX 3090 workstation for big models."
date: 2026-07-09
lastUpdated: "2026-11-14"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - architecture
draft: false
slug: my-homelab-architecture-for-agentic-ai
author: Donavan Jones
excerptImage: /img/blog/ai-homelab-engineering/01-my-homelab-architecture-for-agentic-ai.jpg
---

# My Homelab Architecture for Agentic AI Development

My AI homelab is a seven-node k3s cluster — four Raspberry Pis (one control plane, three workers) and three Jetson Orin Nano Super 8GB boards, each dedicated to a single role — plus one RTX 3090 workstation that sits beside the cluster for the models that don't fit on a Jetson. This post is the map for the rest of the series; every other AI homelab article here refers back to it.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering). For the interactive system map, see the [AI homelab architecture hub](/systems/ai-homelab).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI homelab deep-dive in this series."
destinationUrl: "/categories/ai-homelab-engineering"
---
::

## The Cluster at a Glance

```
k3s cluster (7 nodes, all ARM64)
├── pi-node1 ........ control plane · Prometheus, Grafana, Gitea
├── pi-worker-1..3 .. Redis, Temporal workers, batch Jobs
├── gpu-worker-1 .... Jetson Orin Nano Super 8GB · image-gen (Dreamer SD + small-model shelf)
├── gpu-worker-2 .... Jetson Orin Nano Super 8GB · speech (Kokoro TTS + whisper.cpp STT)
├── gpu-worker-3 .... Jetson Orin Nano Super 8GB · llm (llama3.2:3b pinned in memory)
└── data layer ...... PostgreSQL · MinIO · Redis · Weaviate

RTX 3090 workstation (24 GB, outside k3s)
└── Ornith-1.0-35B in Ollama · all-MiniLM-L6-v2 embedder · LoRA trainer
```

Seven ARM64 nodes under one Kubernetes control plane, backed by an in-cluster data layer, with a single x86 workstation reached over the LAN for the heavy work. The Jetsons aren't a pool that workloads float across — each board has one job, because an 8 GB board with unified CPU/GPU memory only fits one ~4-5 GB model at a time.

## The Core Decision: Two Hardware Tiers, Not One

The single biggest architectural decision is running two very different classes of hardware instead of standardizing on one. The Jetson Orin Nano Super boards are low-power, always-on, and handle the small models behind live features: llama3.2:3b on gpu-worker-3 generates at a measured 20.8 tok/s, fast enough for the draft answers in [VerseHub](/projects/versehub). The RTX 3090 is the heavy-lifting tier: it runs Ornith-1.0-35B (21.2 GB of VRAM, ~64 tok/s), the sentence embedder, and LoRA training — the coding agent covered in the [Local Vibe Coding series](/categories/local-vibe-coding) lives there.

This split exists because a single hardware tier forces a bad tradeoff: size for the biggest workload and you're running an expensive, power-hungry GPU 24/7 for tasks that don't need it; size for the average workload and the biggest tasks are slow or impossible. I learned the second half the hard way when a 9B drafter on a Jetson barely fit and crawled at ~3 tok/s — that story is in [the biggest mistakes I made building this homelab](/blog/ai-homelab-engineering/15-biggest-mistakes-building-ai-homelab).

## Why Kubernetes at All

For seven small boards, Kubernetes might look like overkill compared to a handful of shell scripts. In practice, the value shows up immediately: automatic restart on crash, node labels that pin each workload to the board built for it, and one deployment model for Pis and GPU-equipped Jetsons alike. Images are built with `docker buildx --platform linux/arm64`, imported on each node with `k3s ctr images import`, and deployed by self-hosted Gitea Actions on every push to main. The physical side of the cluster is covered in the [homelab cluster architecture](/blog/infrastructureengineering/13-cluster-architecture-homelab) post.

## The Storage and State Layer

MinIO provides S3-compatible object storage (including a bucket for training datasets), Weaviate holds vectors for retrieval, Redis handles fast session state and an LLM response cache, and PostgreSQL holds anything relational and long-lived. My internal platform, [Kingdom Tools](/projects/kingdom-tools), provisions Postgres, MinIO, Redis, and Weaviate resources per service so nothing gets set up by hand.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See the interactive architecture diagram for this homelab."
destinationUrl: "/systems/ai-homelab"
---
::

## What's Covered in the Rest of This Series

Each layer of this diagram gets its own article: the Jetson cluster specifically, the RTX 3090/Jetson hybrid reasoning in more depth, k3s deployment mechanics, networking, MinIO configuration, and — the parts most homelab writeups skip — the security posture, a worked power-cost estimate, and the mistakes made building all of this the first time through.

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
  destinationUrl: "/blog/ai-homelab-engineering/02-three-jetson-orin-nano-supers-as-ai-cluster"
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
    description: "Documentation for the S3-compatible object storage used for datasets and artifacts."
---
::

## Related reading

- [Using Three Jetson Orin Nano Supers as an AI Cluster](/blog/ai-homelab-engineering/02-three-jetson-orin-nano-supers-as-ai-cluster) — next in the series: what each Jetson actually runs.
- [AI Homelab architecture hub](/systems/ai-homelab) — the interactive diagram of everything above.
- [Scaling VerseHub with Local AI Infrastructure](/blog/versehub-engineering/09-scaling-versehub-with-local-ai-infrastructure) — the production app this cluster serves.
- [Running Ornith-1.0-35B Locally with Ollama](/blog/local-vibe-coding/02-running-ornith-locally-with-ollama) — what the RTX 3090 tier does all day.

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
