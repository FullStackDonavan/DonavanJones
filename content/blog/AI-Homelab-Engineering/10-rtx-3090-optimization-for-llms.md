---
title: "RTX 3090 Optimization for LLMs"
description: "RTX 3090 optimization for LLMs: picking quantization, budgeting 24 GB of VRAM between weights and KV cache, flash attention, and batching, with real numbers."
date: 2026-10-23
lastUpdated: "2026-11-14"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - rtx-3090
draft: false
slug: rtx-3090-optimization-for-llms
author: Donavan Jones
excerptImage: /img/blog/ai-homelab-engineering/10-rtx-3090-optimization-for-llms.jpg
---

# RTX 3090 Optimization for LLMs

Optimizing an RTX 3090 for LLMs is mostly a VRAM budgeting exercise: choose a 4-bit quantization, leave enough of the 24 GB for the KV cache your context needs, and use memory-efficient attention where the runtime supports it. On my 3090, Ornith-1.0-35B (a mixture-of-experts model, ~3B active parameters) at Q4_K_M uses 21.2 GB of VRAM and generates at about 64 tok/s in Ollama. This is what actually moves the needle.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering). For the full system map, see the [AI homelab architecture hub](/systems/ai-homelab).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI homelab deep-dive in this series."
destinationUrl: "/categories/ai-homelab-engineering"
---
::

## Quantization Level Is the First Lever

Model size, context window, and quantization level all draw from the same 24GB pool. A 4-bit quantization (`q4_K_M`) versus an 8-bit one roughly halves the model's VRAM footprint, at a real but usually acceptable quality cost for most coding and general tasks. Going lower than 4-bit starts showing quality degradation that's noticeable rather than marginal — 4-bit is the practical floor for work where output quality matters.

## Context Window vs Model Size Tradeoff

```
VRAM budget ≈ model_size(quantized) + kv_cache(context_length × batch_size)
```

The KV cache scales with context length, and it's easy to underestimate how much headroom that requires. A ~35B model at 4-bit is about the ceiling for a single 24 GB card: Ornith-1.0-35B at Q4_K_M leaves me roughly 3 GB for context and overhead, so long-context requests are where it runs out first. A 70B model at the same quantization needs around 40 GB for weights alone and doesn't fit on one 3090 at all without offloading layers to system RAM — at which point throughput collapses.

## Flash Attention and Memory-Efficient Serving

Modern inference runtimes (including recent Ollama versions) support memory-efficient attention implementations that reduce the KV cache's growth rate relative to context length — enabling this where supported buys meaningfully larger usable context windows at the same VRAM budget, effectively getting more out of the same card without a hardware change.

## Batching for Throughput

For workloads serving multiple concurrent requests (rather than a single interactive session), continuous batching — grouping requests together at the inference-engine level rather than processing them one at a time — improves aggregate throughput substantially, though it adds a small amount of per-request latency. This tradeoff favors batching for background/bulk workloads and disfavors it for the single, latency-sensitive interactive coding session.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how this optimization work fits into the full AI homelab architecture."
destinationUrl: "/systems/ai-homelab"
---
::

## Model Architecture Matters as Much as Size

Ornith-1.0-35B runs at ~64 tok/s on this card because it's a mixture-of-experts model: about 35B parameters total, but only ~3B active per token. A dense model of the same size and quantization would be far slower. When picking a model for a single 24 GB card, active parameters predict speed better than headline size. The full setup is in [running Ornith-1.0-35B locally with Ollama](/blog/local-vibe-coding/02-running-ornith-locally-with-ollama).

## What Doesn't Help as Much as Expected

Overclocking generally buys a smaller throughput gain than quantization and context-window tuning, at the cost of higher power draw and temperatures — not a good trade for a card meant to run reliably for long sessions. Software-level tuning usually matters more than hardware-level tuning for LLM inference.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Raspberry Pi AI Cluster Blueprint"
  supportingCopy: "Get the full hardware and tuning configuration for this homelab ($39)."
  destinationUrl: "/products/raspberry-pi-ai-cluster-blueprint"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Local Image Generation, Speech, and LLMs in One Stack"
  supportingCopy: "Spreading text, image, and speech models across the cluster."
  destinationUrl: "/blog/ai-homelab-engineering/11-local-image-speech-llms-one-stack"
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
  - label: "FlashAttention: Fast and Memory-Efficient Exact Attention"
    url: "https://doi.org/10.48550/arXiv.2205.14135"
    type: "doi"
    description: "The memory-efficient attention algorithm referenced above for extending usable context windows."
  - label: "KV Cache — Hugging Face Documentation"
    url: "https://huggingface.co/docs/transformers/en/kv_cache"
    type: "external"
    description: "Explanation of the key-value cache mechanism whose memory footprint scales with context length."
---
::

## Related reading

- [Running Multiple Local Models Without Melting Your GPU](/blog/ai-homelab-engineering/09-running-multiple-local-models-without-melting-gpu) — previous in the series: memory and contention across models.
- [Local Image Generation, Speech, and LLMs in One Stack](/blog/ai-homelab-engineering/11-local-image-speech-llms-one-stack) — next: splitting modalities across hardware.
- [AI Homelab architecture hub](/systems/ai-homelab) — the interactive system diagram.
- [Hardware ROI for AI Development](/blog/ai-cost-optimization/04-hardware-roi-for-ai-development) — whether a 3090 pays for itself.

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
