---
title: "Running Multiple Local Models Without Melting Your GPU"
description: "How to run multiple local models on limited GPU memory: one model per board, swapping vs pinning, Jetson page-cache OOMs, power limits, and request queues."
date: 2026-10-15
lastUpdated: "2026-11-14"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - gpu
draft: false
slug: running-multiple-local-models-without-melting-gpu
author: Donavan Jones
excerptImage: /img/blog/ai-homelab-engineering/09-running-multiple-local-models-without-melting-gpu.jpg
---

# Running Multiple Local Models Without Melting Your GPU

To run multiple local models without melting your GPU, solve memory first: decide which model stays resident, which ones swap, and which ones get their own hardware — then cap concurrency and power. In my homelab that means one model per 8 GB Jetson, llama3.2:3b pinned permanently on one board, and the RTX 3090 reserved for Ornith-1.0-35B. "Melting" is only slightly hyperbolic; uncoordinated concurrent load causes thermal throttling and out-of-memory crashes long before it causes anything dramatic.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering). For the full system map, see the [AI homelab architecture hub](/systems/ai-homelab).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI homelab deep-dive in this series."
destinationUrl: "/categories/ai-homelab-engineering"
---
::

## The Memory Problem First

Multiple models loaded simultaneously compete for a fixed pool of memory. Two 15 GB models don't fit on a 24 GB card at the same time, regardless of how the request scheduling works — this is the hard constraint that has to be solved before thermal or throughput concerns even come into play. On my 3090, Ornith-1.0-35B alone takes 21.2 GB; on a Jetson Orin Nano Super, only one ~4-5 GB model fits in the ~7.4 GiB of usable unified memory.

**Model swapping** — loading and unloading models on demand, accepting a load-time cost per switch — works when concurrent usage is low. Ollama handles this automatically by default, evicting the least-recently-used model when a new one is requested and memory is tight. My gpu-worker-1 Jetson works this way: a shelf of small models plus the Dreamer image service, one big model or service at a time.

**Pinning** — keeping one model resident permanently, sacrificing flexibility for consistent latency (no cold-load penalty on the next request). gpu-worker-3 keeps llama3.2:3b pinned in memory so VerseHub's draft answers never wait on a load.

**Separate hardware** — when two workloads both need to stay resident, give them separate boards. That's why speech (Kokoro + Whisper) has its own Jetson instead of sharing with the LLM. The [model loading strategies](/blog/backendengineering/16-model-loading-strategies) post covers the service-side version of this choice.

## The Jetson Trap: "Available" Memory That Isn't

This is the one that actually bit me. On a Jetson, the CUDA allocator can't reclaim page cache, so a model load can OOM even when `free -h` says plenty of memory is "available." Swapping models with nothing but `ollama run` eventually fails for no obvious reason. The reliable sequence is:

```bash
ollama stop <old-model>
sync; echo 3 | sudo tee /proc/sys/vm/drop_caches
ollama run <new-model>
```

These days I load, unload, and benchmark models on each Jetson from the Devices page of [Kingdom Tools](/projects/kingdom-tools), my internal platform, rather than by hand over SSH.

## Thermal and Power Management

Sustained multi-request load on a desktop card benefits from explicit power-limiting rather than letting the GPU run at its rated maximum indefinitely:

```bash
nvidia-smi -pl 300  # cap power draw below the card's rated max
```

This trades a modest amount of peak throughput for meaningfully lower sustained temperatures and power draw — worthwhile for a card running long training or batch jobs rather than short interactive bursts. (Jetsons have their own power modes via `nvpmodel`; mine run in MAXN_SUPER.)

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

Two things. First, the page-cache OOMs above, which looked like random load failures until I stopped trusting `free -h`. Second, VerseHub originally kicked off three Temporal workflows per question; moving the small helper calls to a direct quick-LLM endpoint, instead of giving each its own workflow, cut the extra load on the model nodes. In both cases the fix wasn't more hardware — it was being deliberate about what's loaded where and how many requests reach it at once, alongside the scheduling patterns in [Kubernetes for AI Workloads](/blog/ai-homelab-engineering/05-kubernetes-for-ai-workloads).

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
  destinationUrl: "/blog/ai-homelab-engineering/10-rtx-3090-optimization-for-llms"
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

::JetsonLeaderboardCard
---
metric: tok_s
blurb: "How fast each model actually generates on one 8 GB board, so you can plan what to keep loaded."
---
::

## Related reading

- [Jetson Orin Nano LLM leaderboard](/jetson-leaderboard) — measured speed, accuracy, tool calling and coding for every model I run on the Jetsons
- [Raspberry Pi AI Cluster Setup](/blog/ai-homelab-engineering/08-raspberry-pi-ai-cluster-setup) — previous in the series: the non-GPU half of the cluster.
- [RTX 3090 Optimization for LLMs](/blog/ai-homelab-engineering/10-rtx-3090-optimization-for-llms) — next: squeezing the big card.
- [AI Homelab architecture hub](/systems/ai-homelab) — the interactive system diagram.
- [Temporal Workflows in Production](/blog/versehub-engineering/07-temporal-workflows-in-production) — the workflow fixes behind the VerseHub contention story.

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
