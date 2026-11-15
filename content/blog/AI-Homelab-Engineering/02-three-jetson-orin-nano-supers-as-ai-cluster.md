---
title: "Using Three Jetson Orin Nano Supers as an AI Cluster"
description: "How three Jetson Orin Nano Super 8GB boards run image generation, speech, and a pinned 3B LLM as k3s workers — role per board, measured speeds, real limits."
date: 2026-07-23
lastUpdated: "2026-11-14"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - jetson-orin
draft: false
slug: three-jetson-orin-nano-supers-as-ai-cluster
author: Donavan Jones
excerptImage: /img/blog/ai-homelab-engineering/02-three-jetson-orin-nano-supers-as-ai-cluster.jpg
---

# Using Three Jetson Orin Nano Supers as an AI Cluster

Three Jetson Orin Nano Super 8GB boards work well as an AI cluster if you give each one a single job instead of treating them as a pool. In my homelab they're k3s workers with fixed roles — one for image generation, one for speech, one for a pinned 3B LLM — and that's the tier that stays on all the time. This is what they're actually good for, and where they hit a wall.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering). For the full system map, see the [AI homelab architecture hub](/systems/ai-homelab).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI homelab deep-dive in this series."
destinationUrl: "/categories/ai-homelab-engineering"
---
::

## Why Three, Not One

Each board has 8 GB of unified memory shared by the CPU and GPU, with about 7.4 GiB actually usable. That's room for one ~4-5 GB model or service at a time — not two. So three boards isn't horizontal scaling of one workload; it's three workloads that would otherwise fight over the same memory, each given a board of its own:

| Node | Role | What runs there |
|---|---|---|
| gpu-worker-1 | `image-gen` | Dreamer (Stable Diffusion service) plus an Ollama shelf of small models (~42 sweep-tested) — one big model or service at a time |
| gpu-worker-2 | `speech` | Kokoro-82M TTS + whisper.cpp `small.en` STT on CUDA — no LLM |
| gpu-worker-3 | `llm` | Ollama with llama3.2:3b pinned in memory permanently |

All three boot from NVMe, run headless on JetPack 6.x (L4T R36.4), and stay in the MAXN_SUPER power mode.

## What Runs Well Here

**Small LLMs (3B class).** llama3.2:3b on gpu-worker-3 measures 20.8 tok/s generation, roughly 483 tok/s prompt processing, a 5.1 s load, and runs 100% on the GPU. That's fast enough to stream the first-draft answers in [VerseHub](/blog/versehub-engineering/09-scaling-versehub-with-local-ai-infrastructure), with a slower verify pass running afterwards.

**Speech.** Kokoro and Whisper are tiny next to an LLM, and a Kokoro→Whisper round trip measured 0.85 s on gpu-worker-2, which is quick enough for VerseHub's voice features (more on speech design in [voice narration pipelines](/blog/ai-engineering/22-voice-narration-pipelines)).

**Swappable experiments.** gpu-worker-1 is where the small-model shelf lives; I load, unload, and benchmark models on each board from the Devices page in [Kingdom Tools](/projects/kingdom-tools). See the [Jetson leaderboard](/jetson-leaderboard) for how small models compare on this hardware.

## What Doesn't

Anything much bigger than a 4-5 GB quantized model. I ran Ornith-1.0-9B on a Jetson as a drafter: it barely fit at about 5.3 GB with a 4K context ceiling and delivered roughly 3 tok/s end to end, so I retired it. Large model inference (30B+ classes) belongs on the RTX 3090 — no amount of adding boards substitutes for a single GPU with more memory when a task genuinely needs a larger model.

There's also a Jetson-specific trap: the CUDA allocator can't reclaim page cache, so a model can OOM even when `free -h` says memory is "available." The fix is to stop the old model and run `sync; echo 3 > /proc/sys/vm/drop_caches` before loading the next one.

## Cluster Setup

Each board runs NVIDIA's JetPack (Ubuntu-based, with CUDA) and joins the k3s cluster as a worker node:

```bash
curl -sfL https://get.k3s.io | K3S_URL=https://<control-plane-ip>:6443 \
  K3S_TOKEN=<node-token> sh -
```

Workloads land on the right board through node labels and selectors, so the speech service can never be scheduled onto the LLM board. If you want the scheduler to treat each board's GPU as a countable resource as well, NVIDIA's device plugin for Kubernetes exposes it like CPU or memory:

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

Three Jetson Orin Nano Supers do not add up to one large GPU — 3 × 8 GB is three separate memory pools, not 24 GB. Anyone expecting to run a 70B model by spreading it across three of these boards is going to be disappointed; that's not the class of problem this tier solves.

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
  destinationUrl: "/blog/ai-homelab-engineering/03-rtx-3090-jetson-orin-hybrid-architecture"
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
    description: "The mechanism for exposing a Jetson's GPU as a schedulable Kubernetes resource."
---
::

::JetsonLeaderboardCard
---
metric: all
---
::

## Related reading

- [My Homelab Architecture for Agentic AI Development](/blog/ai-homelab-engineering/01-my-homelab-architecture-for-agentic-ai) — previous in the series: the full cluster map.
- [RTX 3090 + Jetson Orin: A Hybrid AI Architecture](/blog/ai-homelab-engineering/03-rtx-3090-jetson-orin-hybrid-architecture) — next: how this tier pairs with the 3090.
- [AI Homelab architecture hub](/systems/ai-homelab) — the interactive diagram of the whole system.
- [From 34% to 98%: Teaching a 0.6B Model to Run My Homelab](/blog/ai-engineering/25-tiny-tool-calling-model-34-to-98) — what tiny models can do when the hardware forces you small.

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
