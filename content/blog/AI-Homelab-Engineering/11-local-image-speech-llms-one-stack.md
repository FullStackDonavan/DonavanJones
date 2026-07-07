---
title: "Local Image Generation, Speech, and LLMs in One Stack"
description: "Running text, image, and speech models on shared local infrastructure — scheduling, VRAM sharing, and pipeline integration."
date: 2026-03-25
lastUpdated: "2026-06-09"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - multimodal
draft: true
slug: local-image-speech-llms-one-stack
author: Donavan Jones
---

# Local Image Generation, Speech, and LLMs in One Stack

Text, image generation, and speech models have different resource profiles and different usage patterns, and running all three on shared hardware without one starving the others took more coordination than just installing all three and hoping for the best.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI homelab deep-dive in this series."
destinationUrl: "/categories/ai-homelab-engineering"
---
::

## The Three Workload Profiles

**LLM inference (text)** — the most latency-sensitive, especially for the interactive coding agent covered elsewhere on this site. Wants priority access to the RTX 3090 during active sessions.

**Image generation (Stable Diffusion class models)** — bursty and VRAM-hungry during generation, but tolerant of queueing — a few extra seconds waiting for an image rarely matters the way a slow coding response does.

**Speech (Whisper for transcription, a local TTS model for synthesis)** — comparatively lightweight, runs comfortably on the Jetson tier rather than needing the 3090 at all.

## Scheduling Priority

```
Priority order on the RTX 3090:
1. Interactive LLM sessions (coding agent) — always preempts
2. Image generation — queued, runs when the 3090 isn't serving an interactive session
3. (Speech runs on Jetson tier — doesn't compete for 3090 time at all)
```

This is enforced the same way as the general workload-priority pattern covered in [Kubernetes for AI Workloads](/blog/ai-homelab-engineering/kubernetes-for-ai-workloads) — a Kubernetes `PriorityClass` on the interactive workload, with image generation jobs submitted at a lower priority so they yield when the higher-priority workload needs the GPU.

## A Simple Pipeline Combining All Three

A voice-driven interface — user speaks a request, it's transcribed, an LLM processes it and may generate a supporting image, then a response is synthesized back to speech — touches all three model types in one request flow:

```
Audio input → Whisper (Jetson) → text
Text → LLM (RTX 3090) → response + optional image prompt
Image prompt → Stable Diffusion (RTX 3090, queued) → image
Response text → TTS (Jetson) → audio output
```

Splitting this across hardware tiers by workload type — rather than running the whole pipeline on one GPU — keeps the latency-sensitive middle step (LLM reasoning) from waiting behind image generation or speech processing that doesn't need the same GPU at all.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how multimodal workloads fit into the full AI homelab."
destinationUrl: "/systems/ai-homelab"
---
::

## Where This Gets Genuinely Hard

Model-swapping overhead is the recurring cost across all of this — switching the 3090 from serving an LLM to serving an image generation model and back has a real load-time penalty each direction. Keeping the LLM resident and treating image generation as the workload that pays the swap cost (rather than the other way around) is the practical compromise, since interactive LLM latency matters more here than image generation latency.

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
  supportingCopy: "The lighter-weight tier handling speech and background work."
  destinationUrl: "/blog/ai-homelab-engineering/jetson-orin-tutorials"
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

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
