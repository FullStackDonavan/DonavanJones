---
title: "RTX 3090 + Jetson Orin: A Hybrid AI Architecture"
description: "Why I pair one RTX 3090 workstation with three Jetson Orin Nano Supers: how work is routed between tiers, real speeds, and what I'd change in this hybrid setup."
date: 2026-08-06
lastUpdated: "2026-11-14"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - rtx-3090
  - jetson-orin
draft: false
slug: rtx-3090-jetson-orin-hybrid-architecture
author: Donavan Jones
excerptImage: /img/blog/ai-homelab-engineering/03-rtx-3090-jetson-orin-hybrid-architecture.jpg
---

# RTX 3090 + Jetson Orin: A Hybrid AI Architecture

A hybrid RTX 3090 + Jetson Orin architecture works because no single GPU class is right for every workload: the 3090's 24 GB handles the big model, embeddings, and training, while three low-power Jetson Orin Nano Supers serve small always-on models. Instead of picking one, my homelab runs both and routes work deliberately by workload type. This is the reasoning behind that split, made explicit.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering). For the full system map, see the [AI homelab architecture hub](/systems/ai-homelab).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI homelab deep-dive in this series."
destinationUrl: "/categories/ai-homelab-engineering"
---
::

## The Case for Each Tier Alone

**RTX 3090 only** would mean running a power-hungry desktop GPU 24/7 for tasks that don't need its throughput — a pinned 3B model answering quick questions, speech, always-on services. That's paying peak-tier power draw for average-tier work.

**Jetson Orin only** would cap the largest model at whatever fits in 8 GB of shared memory. I tried: a 9B drafter on a Jetson barely fit and ran at ~3 tok/s. The same board runs llama3.2:3b at 20.8 tok/s, which is great for drafts and useless for heavy coding-agent sessions where waiting on a slow response breaks flow.

## The Routing Logic

```
Task classification:
├── Large model, coding agent / verifier (Ornith-1.0-35B) → RTX 3090
├── Sentence embeddings for RAG (all-MiniLM-L6-v2)        → RTX 3090
├── LoRA training for small models                        → RTX 3090
├── Fast first-draft answers (llama3.2:3b)                → Jetson gpu-worker-3
├── Speech: Kokoro TTS + Whisper STT                      → Jetson gpu-worker-2
└── Image generation + small-model experiments            → Jetson gpu-worker-1
```

The 3090 isn't a k3s node — it's a Windows workstation on the LAN, and services reach it at a fixed Ollama or embedder endpoint. The Jetsons are k3s workers, and their services are pinned with node labels so each workload lands on the board built for it:

```yaml
nodeSelector:
  kubernetes.io/hostname: gpu-worker-3   # the llm board
```

VerseHub is the clearest example of both tiers working together: a Jetson streams a fast draft at ~21 tok/s, then a [Temporal workflow](/blog/versehub-engineering/07-temporal-workflows-in-production) on the Pi workers retrieves evidence, generates a refined answer, and [verifies the citations](/blog/agentic-ai-systems/11-verification-agents-in-production) against what was retrieved.

## Power and Utilization Tradeoffs

The Jetson tier is designed to run continuously, since its power profile makes that the efficient choice. The 3090 runs in bursts — a coding session, an embedding batch, a training run — and Ornith-1.0-35B alone takes 21.2 GB of its 24 GB, so it isn't a place to stack extra always-on services.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See the full hybrid architecture diagram."
destinationUrl: "/systems/ai-homelab"
---
::

## What I'd Reconsider

A mid-tier GPU (a 12-16 GB class card) between the two extremes would be tempting — some workloads that fit awkwardly on an 8 GB Jetson would run comfortably there without tying up the 3090. What I'm actually doing instead is rebuilding the 3090 machine into a dedicated headless Linux training box (Ryzen 9 5900XT, 64 GB RAM) for fine-tuning small models that are sized to run well on the Jetsons. Same one 3090, more deliberate job.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Raspberry Pi AI Cluster Blueprint"
  supportingCopy: "Get the full architecture blueprint for a hybrid AI cluster ($39)."
  destinationUrl: "/products/raspberry-pi-ai-cluster-blueprint"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Kubernetes for AI Developers"
  supportingCopy: "How k3s ties the Jetson tier together."
  destinationUrl: "/blog/ai-homelab-engineering/04-kubernetes-for-ai-developers-k3s"
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
  - label: "Node Affinity — Kubernetes Documentation"
    url: "https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/"
    type: "external"
    description: "Official documentation for the node-selection mechanisms used to pin workloads to the right board."
  - label: "Heterogeneous Computing — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Heterogeneous_computing"
    type: "wikipedia"
    description: "Background on systems that combine different processor types for different workload profiles, the general pattern this hybrid architecture follows."
---
::

## Related reading

- [Using Three Jetson Orin Nano Supers as an AI Cluster](/blog/ai-homelab-engineering/02-three-jetson-orin-nano-supers-as-ai-cluster) — previous in the series: the Jetson tier in depth.
- [Kubernetes for AI Developers: Deploying Local Models with k3s](/blog/ai-homelab-engineering/04-kubernetes-for-ai-developers-k3s) — next: the orchestration layer.
- [AI Homelab architecture hub](/systems/ai-homelab) — the interactive system diagram.
- [When Should You Buy a GPU Instead of Paying API Fees?](/blog/ai-cost-optimization/05-when-to-buy-a-gpu-instead-of-api-fees) — the cost side of owning the 3090 tier.

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
