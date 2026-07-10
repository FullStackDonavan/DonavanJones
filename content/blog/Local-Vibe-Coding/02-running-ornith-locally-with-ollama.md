---
title: "Running Ornith-1.0-35B Locally with Ollama: A Complete Guide"
description: "A practical walkthrough of running Ornith-1.0-35B locally with Ollama — model selection, quantization, and configuration for coding workloads."
date: 2026-01-19
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

Ornith-1.0-35B is the model I settled on after cycling through most of the popular locally-runnable options — it's instruction-tuned, handles tool-calling formats cleanly, and quantizes down to a size that fits comfortably on a single consumer GPU without losing enough quality to matter for day-to-day coding work. In my setup it doesn't write the first draft of anything — a smaller Ornith-9B does that on the Jetson tier — its job is reviewing that draft before it reaches me. This is the setup guide I wish I'd had.

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

## Pairing With a Draft Model

Running Ornith-1.0-35B alone as a chat-and-generate model works, but the setup covered in the rest of this series pairs it with Ornith-9B running on a Jetson node:

```bash
ollama pull hf.co/deepreinforce-ai/Ornith-9B:Q4_K_M
```

At Q4_K_M, the 9B variant is roughly 5.6GB — small enough to stay resident on Jetson-class VRAM alongside the embedding model, and fast enough that a first-pass draft doesn't feel like a wait. The 35B never writes a draft in this setup; it only reviews what the 9B already wrote, as OpenClaw's `verify-code` skill. That split is covered in full in the [OpenClaw build article](/blog/local-vibe-coding/openclaw-from-scratch).

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

Ornith-1.0-35B is not a frontier model, and as a verifier that matters just as much as it would as a generator — it can only catch what it's capable of recognizing as wrong. It's excellent at the 80% of coding work that's pattern-following — CRUD endpoints, test scaffolding, refactors with a clear shape — and noticeably weaker at catching the kind of subtle, single-bug-in-a-large-system error that benefits most from a larger reasoning model. That's exactly the class of task the router hands to Claude Code's Principal Engineer Mode rather than trusting to the local draft/verify pair.

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
