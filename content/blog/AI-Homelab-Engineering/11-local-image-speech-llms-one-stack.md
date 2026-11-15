---
title: "Local Image Generation, Speech, and LLMs in One Stack"
description: "Running local image generation, speech (Kokoro + Whisper), and LLMs in one homelab stack by giving each its own Jetson board, with the RTX 3090 for big models."
date: 2026-10-29
lastUpdated: "2026-11-14"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - multimodal
draft: false
slug: local-image-speech-llms-one-stack
author: Donavan Jones
excerptImage: /img/blog/ai-homelab-engineering/11-local-image-speech-llms-one-stack.jpg
---

# Local Image Generation, Speech, and LLMs in One Stack

You can run local image generation, speech, and LLMs in one stack without them starving each other — the trick is to stop sharing. In my homelab each modality gets its own Jetson Orin Nano Super (image generation, speech, and a pinned 3B LLM), and the RTX 3090 handles the one model too big for any of them. Getting there took more coordination than installing all three on one GPU and hoping for the best.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering). For the full system map, see the [AI homelab architecture hub](/systems/ai-homelab).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI homelab deep-dive in this series."
destinationUrl: "/categories/ai-homelab-engineering"
---
::

## The Three Workload Profiles

**LLM inference (text)** — the most latency-sensitive. For live features like VerseHub's draft answers, llama3.2:3b stays pinned on gpu-worker-3 (20.8 tok/s measured). For the coding agent covered elsewhere on this site, Ornith-1.0-35B runs on the RTX 3090.

**Image generation (Stable Diffusion class models)** — bursty and memory-hungry during generation, but tolerant of queueing — a few extra seconds waiting for an image rarely matters the way a slow text response does. It runs as the Dreamer service on gpu-worker-1.

**Speech (Whisper for transcription, Kokoro for synthesis)** — comparatively lightweight. Kokoro-82M TTS and whisper.cpp `small.en` (CUDA) share gpu-worker-2, with no LLM on that board, and a Kokoro→Whisper round trip measured 0.85 s.

## Placement Instead of Priority

```
gpu-worker-1 (Jetson)  image-gen  Dreamer SD  ⇄  small-model shelf (one at a time)
gpu-worker-2 (Jetson)  speech     Kokoro TTS + whisper.cpp STT
gpu-worker-3 (Jetson)  llm        llama3.2:3b, pinned permanently
RTX 3090 workstation   big model  Ornith-1.0-35B (21.2 GB VRAM)
```

On an 8 GB Jetson with unified memory, only one ~4-5 GB model or service fits at a time, so priority scheduling on a shared board doesn't help much — the lower-priority model still has to be evicted and reloaded. Pinning each always-needed workload to its own board with a k3s node selector removes the contention entirely. The general scheduling patterns are in [Kubernetes for AI Workloads](/blog/ai-homelab-engineering/05-kubernetes-for-ai-workloads).

## A Simple Pipeline Combining All Three

A voice-driven interface — user speaks a request, it's transcribed, an LLM processes it and may generate a supporting image, then a response is synthesized back to speech — touches all three model types in one request flow:

```
Audio input   → Whisper (gpu-worker-2)       → text
Text          → LLM (gpu-worker-3)           → response + optional image prompt
Image prompt  → Stable Diffusion (gpu-worker-1, queued) → image
Response text → Kokoro TTS (gpu-worker-2)    → audio output
```

Splitting this across boards by workload type — rather than running the whole pipeline on one GPU — keeps the latency-sensitive middle step (LLM reasoning) from waiting behind image generation or speech processing. VerseHub's voice features use the same speech board; the design side is in [voice narration pipelines](/blog/ai-engineering/22-voice-narration-pipelines).

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how multimodal workloads fit into the full AI homelab."
destinationUrl: "/systems/ai-homelab"
---
::

## Where This Gets Genuinely Hard

Model-swapping overhead is the recurring cost. gpu-worker-1 switches between the Dreamer image service and the small-model shelf, and every switch pays a load-time penalty in each direction. Worse, on a Jetson the CUDA allocator can't reclaim page cache, so a swap can OOM even when `free -h` says memory is available — the old model has to be stopped and caches dropped (`sync; echo 3 > /proc/sys/vm/drop_caches`) before the next one loads. Keeping the LLM and speech boards fixed, and letting the image board be the one that pays the swap cost, is the practical compromise.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Raspberry Pi AI Cluster Blueprint"
  supportingCopy: "Get the full multimodal pipeline architecture and hardware layout ($39)."
  destinationUrl: "/products/raspberry-pi-ai-cluster-blueprint"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Jetson Orin Tutorials"
  supportingCopy: "Setting up the boards that run speech, images, and the small LLM."
  destinationUrl: "/blog/ai-homelab-engineering/12-jetson-orin-tutorials"
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
  - label: "Whisper — OpenAI Research"
    url: "https://openai.com/index/whisper/"
    type: "external"
    description: "The speech recognition model used for the transcription step in this pipeline."
  - label: "Stable Diffusion — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Stable_Diffusion"
    type: "wikipedia"
    description: "Background on the image generation model class referenced throughout this article."
---
::

## Related reading

- [RTX 3090 Optimization for LLMs](/blog/ai-homelab-engineering/10-rtx-3090-optimization-for-llms) — previous in the series: tuning the big-model tier.
- [Jetson Orin Tutorials](/blog/ai-homelab-engineering/12-jetson-orin-tutorials) — next: bringing a Jetson from bare metal to cluster node.
- [AI Homelab architecture hub](/systems/ai-homelab) — the interactive system diagram.
- [Using Three Jetson Orin Nano Supers as an AI Cluster](/blog/ai-homelab-engineering/02-three-jetson-orin-nano-supers-as-ai-cluster) — the role-per-board design in detail.

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
