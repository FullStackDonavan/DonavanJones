---
title: "RTX 3090 Optimization for LLMs"
description: "Practical tuning for running LLM inference on an RTX 3090 — quantization choices, context window tradeoffs, and squeezing out throughput."
date: 2026-03-18
lastUpdated: "2026-06-09"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - rtx-3090
draft: true
slug: rtx-3090-optimization-for-llms
author: Donavan Jones
---

# RTX 3090 Optimization for LLMs

The RTX 3090's 24GB of VRAM is generous for a consumer card, but LLM inference will use every bit of it if you let it. Getting good throughput and a usable context window at the same time takes some deliberate tuning — this is what actually moved the needle.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering).*

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

The KV cache scales with context length, and it's easy to underestimate how much headroom that requires — a 34B model at 4-bit quantization leaves comfortable room for a large context window; the same VRAM budget with a 70B model at the same quantization leaves much less, forcing a real tradeoff between model size and how much context it can hold in a single request.

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

## What Didn't Help as Much as Expected

Overclocking the card itself produced a smaller throughput gain than the quantization and context-window tuning above, at the cost of higher power draw and temperatures — not a good trade for a card meant to run reliably for long sessions. The software-level tuning consistently mattered more than hardware-level tuning for this specific workload.

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
  supportingCopy: "Sharing this same GPU across multiple modalities."
  destinationUrl: "/blog/ai-homelab-engineering/local-image-speech-llms-one-stack"
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

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
