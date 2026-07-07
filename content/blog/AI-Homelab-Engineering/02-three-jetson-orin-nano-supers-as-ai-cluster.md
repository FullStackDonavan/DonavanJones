---
title: "Using Three Jetson Orin Nano Supers as an AI Cluster"
description: "How three Jetson Orin Nano Super boards form the always-on inference tier of a home AI cluster — setup, workload split, and real limits."
date: 2026-01-21
lastUpdated: "2026-06-09"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - jetson-orin
draft: true
slug: three-jetson-orin-nano-supers-as-ai-cluster
author: Donavan Jones
---

# Using Three Jetson Orin Nano Supers as an AI Cluster

Three Jetson Orin Nano Super boards, each with a CUDA-capable GPU and a fraction of the power draw of a desktop GPU, form the tier of this homelab that's on all the time. This is what they're actually good for, and where they hit a wall.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI homelab deep-dive in this series."
destinationUrl: "/categories/ai-homelab-engineering"
---
::

## Why Three, Not One

A single Jetson Orin Nano Super is a capable little inference box on its own. Three of them, joined as k3s workers, gives horizontal scaling for embarrassingly parallel workloads — embedding generation across a large document set, running the same small model against many independent requests — without any one board becoming a bottleneck the way a single node would under sustained concurrent load.

## What Runs Well Here

**Embedding generation.** Converting text into vectors for retrieval systems is exactly the kind of workload that benefits from parallelizing across nodes — independent units of work, no shared state between them, and each Jetson handles the compute comfortably.

**Small-to-mid LLMs (7-8B class).** Quantized 7-8B models run at genuinely usable speed on a single Jetson Orin Nano Super — not fast enough for the heaviest coding work, but entirely adequate for quick lookups, classification, and background agent tasks.

**Always-on services.** Anything that needs to be available continuously — a lightweight API serving cached responses, a background monitoring agent — belongs on this tier rather than the power-hungry desktop GPU, which idles hot by comparison.

## What Doesn't

Large model inference (30B+ parameter classes) and anything latency-critical for interactive use doesn't fit here — VRAM and raw compute are real constraints, and no amount of horizontal scaling across three boards substitutes for a single GPU with more memory when a task genuinely needs to load a larger model.

## Cluster Setup

Each board runs Ubuntu with NVIDIA's JetPack SDK for CUDA support, joined to the k3s cluster as a worker node:

```bash
curl -sfL https://get.k3s.io | K3S_URL=https://<control-plane-ip>:6443 \
  K3S_TOKEN=<node-token> sh -
```

NVIDIA's device plugin for Kubernetes exposes each board's GPU as a schedulable resource, so workload manifests can request GPU access the same way they'd request CPU or memory:

```yaml
resources:
  limits:
    nvidia.com/gpu: 1
```

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how this tier fits into the full hybrid AI homelab architecture."
destinationUrl: "/systems/ai-homelab"
---
::

## The Honest Limitation

Three Jetson Orin Nano Supers do not add up to one large GPU — this is horizontal scaling for parallel workloads, not a substitute for VRAM. Anyone expecting to run a 70B model by spreading it across three of these boards is going to be disappointed; that's not the class of problem this tier solves.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Raspberry Pi AI Cluster Blueprint"
  supportingCopy: "Get the full build blueprint for a multi-node AI cluster ($39)."
  destinationUrl: "/products/raspberry-pi-ai-cluster-blueprint"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: RTX 3090 + Jetson Orin: A Hybrid AI Architecture"
  supportingCopy: "How this tier pairs with the heavier GPU tier."
  destinationUrl: "/blog/ai-homelab-engineering/rtx-3090-jetson-orin-hybrid-architecture"
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
  - label: "NVIDIA JetPack SDK — Official Documentation"
    url: "https://developer.nvidia.com/embedded/jetpack"
    type: "external"
    description: "The SDK providing CUDA and ML library support for Jetson boards."
  - label: "Kubernetes Device Plugins — Official Documentation"
    url: "https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/"
    type: "external"
    description: "The mechanism used to expose each Jetson's GPU as a schedulable Kubernetes resource."
---
::

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
