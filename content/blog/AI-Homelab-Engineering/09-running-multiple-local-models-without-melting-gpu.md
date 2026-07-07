---
title: "Running Multiple Local Models Without Melting Your GPU"
description: "Practical patterns for running several models concurrently on shared GPU hardware without VRAM contention or thermal problems."
date: 2026-03-11
lastUpdated: "2026-06-09"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - gpu
draft: true
slug: running-multiple-local-models-without-melting-gpu
author: Donavan Jones
---

# Running Multiple Local Models Without Melting Your GPU

"Melting" is only slightly hyperbolic — a GPU sustained at full load for hours, serving multiple concurrent model requests without any coordination, runs hot enough that thermal throttling (and, over a long enough timeline, accelerated wear) becomes a real concern, not just a performance question.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI homelab deep-dive in this series."
destinationUrl: "/categories/ai-homelab-engineering"
---
::

## The VRAM Problem First

Multiple models loaded simultaneously compete for a fixed pool of VRAM. Two 15GB models don't fit on a 24GB card at the same time, regardless of how the request scheduling works — this is the hard constraint that has to be solved before thermal or throughput concerns even come into play.

**Model swapping** — loading and unloading models on demand, accepting a load-time cost per switch — works when concurrent usage is low. Ollama handles this automatically by default, evicting the least-recently-used model when a new one is requested and VRAM is tight.

**Fixed allocation** — reserving a portion of VRAM for each model that needs to stay resident, sacrificing flexibility for consistent latency (no cold-load penalty on the next request).

The right choice depends on usage pattern: for the coding-agent workload in this homelab, fixed allocation for the primary coding model plus swap-on-demand for everything else is the balance that worked out.

## Thermal and Power Management

Sustained multi-request load benefits from explicit power-limiting rather than letting the GPU run at its rated maximum indefinitely:

```bash
nvidia-smi -pl 300  # cap power draw below the card's rated max
```

This trades a modest amount of peak throughput for meaningfully lower sustained temperatures and power draw — worthwhile for a card running continuously rather than in short bursts, which is closer to how this homelab actually uses it.

## Request Queuing to Prevent Contention

Rather than letting every incoming request hit the model server simultaneously, a request queue with a concurrency limit prevents the GPU from being asked to serve more simultaneous generations than it can handle without severe per-request slowdown:

```python
import asyncio
semaphore = asyncio.Semaphore(2)  # max 2 concurrent generations

async def generate(prompt):
    async with semaphore:
        return await model_client.generate(prompt)
```

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how GPU workload management fits into the full AI homelab."
destinationUrl: "/systems/ai-homelab"
---
::

## What Actually Broke Before I Fixed This

Early on, an unthrottled background embedding job running concurrently with an interactive coding session caused the interactive session's response times to degrade badly enough to be genuinely disruptive — the fix wasn't more hardware, it was the priority-based scheduling and concurrency limiting covered here and in the [Kubernetes for AI Workloads](/blog/ai-homelab-engineering/kubernetes-for-ai-workloads) article.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Raspberry Pi AI Cluster Blueprint"
  supportingCopy: "Get the full GPU scheduling and thermal management configuration ($39)."
  destinationUrl: "/products/raspberry-pi-ai-cluster-blueprint"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: RTX 3090 Optimization for LLMs"
  supportingCopy: "Tuning the heaviest GPU tier specifically for LLM inference."
  destinationUrl: "/blog/ai-homelab-engineering/rtx-3090-optimization-for-llms"
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
  - label: "nvidia-smi — Official Documentation"
    url: "https://developer.nvidia.com/system-management-interface"
    type: "external"
    description: "The NVIDIA management interface used for power-limiting and monitoring GPU load."
  - label: "Thermal Throttling — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Dynamic_frequency_scaling"
    type: "wikipedia"
    description: "Background on the thermal-driven performance reduction this power-limiting approach avoids."
---
::

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
