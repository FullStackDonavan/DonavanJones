---
title: "Running Ornith-1.0-35B Locally with Ollama: A Complete Guide"
description: "A practical walkthrough of running Ornith-1.0-35B locally with Ollama — model selection, quantization, and configuration for coding workloads."
date: 2026-07-12
lastUpdated: "2026-07-09"
category: "local-vibe-coding"
tags:
  - local-vibe-coding
  - ollama
  - ornith
draft: true
slug: running-ornith-locally-with-ollama
author: Donavan Jones
---

# Running Ornith-1.0-35B Locally with Ollama: A Complete Guide

Ornith-1.0-35B is the model I settled on after cycling through most of the popular locally-runnable options — it's instruction-tuned, handles tool-calling formats cleanly, and quantizes down to a size that fits comfortably on a single consumer GPU without losing enough quality to matter for day-to-day coding work. In my setup it's the coding agent itself: it reads the relevant files, plans the change, edits, runs tests, and reviews its own diff before anything reaches me. A smaller Ornith-9B runs separately, on the Jetson tier, handling background tasks that don't need that much capacity. This is the setup guide I wish I'd had.

*Part of the [Local Vibe Coding series](/categories/local-vibe-coding).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every local vibe coding deep-dive in this series."
destinationUrl: "/categories/local-vibe-coding"
---
::

## Installing Ollama

Ollama installs as a single binary with a background service that manages model downloads, quantization variants, and serves an OpenAI-compatible API on `localhost:11434`.

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama serve
```

On a machine with an NVIDIA GPU, Ollama auto-detects CUDA and offloads as many layers as VRAM allows. Check GPU utilization is actually being used with `ollama ps` after loading a model — a model silently falling back to CPU inference is the single most common setup mistake, and it's not always obvious from the output alone.

## Pulling Ornith-1.0-35B

```bash
ollama pull hf.co/deepreinforce-ai/Ornith-1.0-35B:Q4_K_M
```

The `Q4_K_M` suffix is the quantization level — 4-bit with a mixed precision scheme that keeps quality loss modest. On a 24GB card, the model at this quantization fits with room left for context. For smaller GPUs, a heavier quantization trades some quality for a noticeably smaller footprint.

| Quantization | VRAM needed (approx.) | Good for |
|---|---|---|
| Q3_K_M | ~16GB | Smaller GPUs, quick lookups, simple completions |
| Q4_K_M | ~20GB | Balanced quality/speed for most coding tasks |
| Q5_K_M | ~24GB | Best local quality for complex refactors and explanation |

## Pairing With a Utility Model

Ornith-1.0-35B on the 3090 is the coding agent, not one half of a pair — but it isn't the only model running. The rest of this series also runs a smaller Ornith-9B on a Jetson node, for background work that doesn't need the 35B's capacity:

```bash
ollama pull hf.co/deepreinforce-ai/Ornith-9B:Q4_K_M
```

At Q4_K_M, the 9B variant is roughly 5.6GB — small enough to stay resident on Jetson-class VRAM alongside the embedding model. It handles documentation generation, commit summaries, and log analysis as OpenClaw's utility model, entirely separate from the coding loop. My first version of this setup had the split reversed — 9B drafting, 35B reviewing — and moved the 35B into the driver's seat once it became clear a verifier-only role was wasting most of what a 35B model can actually do. That's covered in full in the [OpenClaw build article](/blog/local-vibe-coding/openclaw-from-scratch).

## Configuring for Tool Calling

The reason Ornith-1.0-35B works well as the backbone of a coding agent rather than just a chatbot is that it was trained on structured function-calling formats. A minimal tool-calling request against the local API looks like:

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "hf.co/deepreinforce-ai/Ornith-1.0-35B:Q4_K_M",
  "messages": [{"role": "user", "content": "List the files in ./src"}],
  "tools": [{
    "type": "function",
    "function": {
      "name": "list_files",
      "description": "List files in a directory",
      "parameters": {"type": "object", "properties": {"path": {"type": "string"}}}
    }
  }]
}'
```

The response includes a structured tool-call block rather than a description of what it would do in prose — the distinction that makes agent loops reliable instead of requiring brittle text parsing.

## Context Window and Performance Tuning

Ollama's default context window is conservative. For coding work where you're passing in multiple files, raise it explicitly:

```bash
ollama run hf.co/deepreinforce-ai/Ornith-1.0-35B:Q4_K_M --ctx-size 32768
```

Larger context costs VRAM linearly, so this is a direct tradeoff against quantization level — on a 24GB card, running Q5_K_M at a large context window may require dropping to Q4_K_M or lower. I settled on Q4_K_M at a 32K context window as the practical balance for most real coding sessions.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how this model tier fits into the full local AI homelab."
destinationUrl: "/systems/local-vibe-coding"
---
::

## Where It Falls Short

Ornith-1.0-35B is not a frontier model, and it's honest about that in its own self-review more often than it's wrong outright — it flags uncertainty on the kind of task it can't fully reason through rather than confidently shipping a bad diff, most of the time. It's excellent at the 80% of coding work that's pattern-following — CRUD endpoints, test scaffolding, refactors with a clear shape — and noticeably weaker at holding a large, unfamiliar system in working memory across a multi-file change. That's exactly the class of task the router hands to Claude Code's external Principal Architect role rather than trusting to the local coding agent.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The AI Starter Kit"
  supportingCopy: "Get the Self-Hosted AI Starter Kit — Ollama setup, RAG architecture diagrams, and FastAPI examples ($29)."
  destinationUrl: "/products/self-hosted-ai-starter-kit"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Best Local Models for Coding"
  supportingCopy: "See how Ornith-1.0-35B compares against the other locally-runnable options."
  destinationUrl: "/blog/local-vibe-coding/best-local-models-for-coding"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get new local AI breakdowns delivered before they're public."
  ---
  :::
::

## Further Reading

::AuthoritativeLinks
---
title: "Authoritative Sources"
links:
  - label: "Ollama API Documentation"
    url: "https://ollama.com"
    type: "external"
    description: "Official reference for the Ollama runtime and its OpenAI-compatible API."
  - label: "Model Quantization — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Quantization_(signal_processing)"
    type: "wikipedia"
    description: "Background on the quantization schemes referenced above (q4_K_M and similar)."
---
::

---

*[← Back to Local Vibe Coding](/categories/local-vibe-coding)*
