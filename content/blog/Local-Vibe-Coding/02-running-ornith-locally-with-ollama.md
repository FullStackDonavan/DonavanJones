---
title: "Running Ornith-1.0-35B Locally with Ollama: A Complete Guide"
description: "How I run Ornith-1.0-35B locally with Ollama on one RTX 3090: Q4_K_M quantization, 21.2GB VRAM, ~64 tok/s, context sizing, and JSON-in-content tool calls."
date: 2026-07-15
lastUpdated: "2026-11-14"
category: "local-vibe-coding"
tags:
  - local-vibe-coding
  - ollama
  - ornith
draft: false
slug: running-ornith-locally-with-ollama
author: Donavan Jones
excerptImage: /img/blog/local-vibe-coding/02-running-ornith-locally-with-ollama.jpg
---

# Running Ornith-1.0-35B Locally with Ollama: A Complete Guide

To run Ornith-1.0-35B locally, install Ollama, pull the Q4_K_M GGUF build, and give it a 24GB GPU: on my single RTX 3090 it uses about 21.2GB of VRAM and generates around 64 tok/s. It's a mixture-of-experts model (~35B total parameters, ~3B active per token), which is why it's that fast on one consumer card. In my setup it's the coding agent itself: it reads the relevant files, plans the change, edits, runs tests, and reviews its own diff before anything reaches me. This is the setup guide I wish I'd had, including the one thing that tripped me up: Ollama doesn't expose native tool calling for it.

*Part of the [Local Vibe Coding series](/categories/local-vibe-coding). See the [Local Vibe Coding hub](/systems/local-vibe-coding) for how the whole system fits together.*

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
| Q4_K_M | ~21GB (21.2GB measured on my 3090) | Balanced quality/speed for most coding tasks |
| Q5_K_M | ~24GB | Higher quality, but too tight on a 24GB card once you add context |

## What Happened to Ornith-1.0-9B

My first version of this setup paired the 35B with Ornith-1.0-9B running on a Jetson Orin Nano Super: the 9B drafted, the 35B on the 3090 verified. On paper that's a sensible draft→verify split. In practice the 9B barely fit on the Jetson's 8GB of unified memory (≈5.3GB loaded, with a 4K context ceiling) and ran at roughly 3 tok/s end to end, so the "fast" drafter was the bottleneck. I retired it and moved the 35B into the driver's seat. That's covered in full in the [OpenClaw build article](/blog/local-vibe-coding/05-openclaw-from-scratch).

The Jetsons still do useful always-on work — `llama3.2:3b` pinned on one board at about 21 tok/s, speech on another — but a 9B model with real context is simply too tight for an 8GB board. If you want the details of why, [Running Multiple Local Models Without Melting Your GPU](/blog/ai-homelab-engineering/09-running-multiple-local-models-without-melting-gpu) covers the memory side.

## Configuring for Tool Calling

Here's the catch: Ollama reports Ornith-1.0-35B without native `tools` capability (check with `ollama show`), so passing a `tools` array to `/api/chat` doesn't work the way it does for models with a tool-aware template. Instead, I describe the tools in the system prompt and ask for a strict JSON object in the message content, then parse it in the agent layer:

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "hf.co/deepreinforce-ai/Ornith-1.0-35B:Q4_K_M",
  "format": "json",
  "stream": false,
  "messages": [
    {"role": "system", "content": "You can call tools. Available: list_files(path). Reply ONLY with JSON: {\"tool\": name, \"args\": {...}} or {\"answer\": text}."},
    {"role": "user", "content": "List the files in ./src"}
  ]
}'
```

The response comes back as a JSON object in `message.content` rather than prose, which the agent loop validates, executes, and feeds back as the next message. It's slightly more code than native tool calls, but it's predictable, and it works the same way with any model regardless of its template. The broader pattern is covered in [Tool Calling](/blog/ai-engineering/03-tool-calling).

## Context Window and Performance Tuning

Ollama's default context window is conservative. For coding work where you're passing in multiple files, raise it explicitly, either per request with `"options": {"num_ctx": 32768}` or inside an interactive session:

```bash
ollama run hf.co/deepreinforce-ai/Ornith-1.0-35B:Q4_K_M
>>> /set parameter num_ctx 32768
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
  destinationUrl: "/blog/local-vibe-coding/03-best-local-models-for-coding"
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

## Related reading

- [Vibe Coding Locally: My Complete 2026 Setup](/blog/local-vibe-coding/01-vibe-coding-locally-2026-setup) — previous in the series: the full hardware split.
- [Best Local Models for Coding](/blog/local-vibe-coding/03-best-local-models-for-coding) — next: how Ornith compares with other local options.
- [Local Vibe Coding hub](/systems/local-vibe-coding) — the whole system on one page.
- [RTX 3090 Optimization for LLMs](/blog/ai-homelab-engineering/10-rtx-3090-optimization-for-llms) — squeezing more out of the same card.

---

*[← Back to Local Vibe Coding](/categories/local-vibe-coding)*
