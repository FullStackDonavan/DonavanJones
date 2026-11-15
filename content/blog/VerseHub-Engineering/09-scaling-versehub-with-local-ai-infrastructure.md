---
title: "Scaling VerseHub with Local AI Infrastructure"
description: "How VerseHub scales AI on local infrastructure: a Jetson fast draft, Temporal refine workers on Pis, a Redis LLM cache, and a cost curve that stays flat."
date: 2026-10-20
lastUpdated: "2026-11-14"
category: "versehub-engineering"
tags:
  - versehub-engineering
  - scaling
draft: false
slug: scaling-versehub-with-local-ai-infrastructure
author: Donavan Jones
excerptImage: /img/blog/versehub-engineering/09-scaling-versehub-with-local-ai-infrastructure.jpg
---

# Scaling VerseHub with Local AI Infrastructure

VerseHub scales its AI features by running inference on hardware I own instead of a metered API, so more usage costs electricity and capacity tuning rather than a proportional API bill. Its local-first AI layer (covered in the [architecture overview](/blog/versehub-engineering/01-versehub-architecture)) isn't just a cost optimization — it's the reason the platform can grow AI usage without every additional user multiplying hosted spend.

*Part of the [VerseHub Engineering series](/categories/versehub-engineering). For the project overview, see the [VerseHub project page](/projects/versehub).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every VerseHub engineering deep-dive in this series."
destinationUrl: "/categories/versehub-engineering"
---
::

## The Scaling Problem With Hosted-Only

If every AI study request routed to a hosted API, VerseHub's AI infrastructure cost would scale roughly linearly with usage — more users and more engagement directly means more API spend, with no ceiling. That's a viable model for many applications, but for a platform whose value proposition depends on AI features being freely and heavily used rather than metered, it puts a hard ceiling on how much AI usage is sustainable.

## Local Inference as the Scaling Lever

Study questions run through the two-pass [AI pipeline](/blog/versehub-engineering/04-ai-pipeline-design): a fast draft from `llama3.2:3b`, pinned on a Jetson Orin Nano Super at about 21 tok/s, and a Temporal refine pass on the Raspberry Pi workers that retrieves from Weaviate and verifies citations. All of it runs on infrastructure covered throughout the [AI Homelab Engineering series](/systems/ai-homelab), so usage scales with hardware capacity and utilization tuning, not with per-request billing.

```
Hosted-only cost curve:  cost ∝ total requests
Local-first cost curve:  cost ≈ fixed hardware + electricity (until capacity runs out)
```

The local-first curve is flatter — past the point where hardware is already provisioned, growing request volume adds close to marginal electricity cost rather than a proportional API bill, which is the same economic logic covered in the [AI Cost Optimization series](/categories/ai-cost-optimization), applied here at platform scale rather than individual developer scale.

## Getting More Out of the Same Hardware

Local capacity is finite — an 8GB Jetson holds one ~4-5GB model at a time — so scaling has mostly meant doing less wasted work:

- **Keep the draft model pinned.** `llama3.2:3b` stays loaded permanently, so no request ever pays a model load. On these boards that matters doubly: the CUDA allocator can't reclaim page cache, so a model can fail to load even when `free -h` says memory is available. Not swapping models on the request path avoids that entirely.
- **Cache repeated answers.** A [Redis LLM response cache](/blog/versehub-engineering/05-redis-memory-layer-design) answers repeat questions without touching a model.
- **Don't start workflows you don't need.** Helper calls used to spawn their own Temporal workflows — three per question. Moving them to a direct quick-LLM endpoint cut that to one refine workflow per question.
- **Let the refine pass queue.** Because the user already has the fast draft, the refine pass can wait in Temporal during a spike instead of failing; the experience degrades to "the refined answer arrives a bit later," not "the request errored."

[Running Multiple Local Models Without Melting Your GPU](/blog/ai-homelab-engineering/09-running-multiple-local-models-without-melting-gpu) goes deeper on the memory side.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See the complete infrastructure this scaling strategy runs on."
destinationUrl: "/projects/versehub"
---
::

## The Honest Tradeoff

This scaling strategy requires actually operating inference infrastructure — the same operational overhead covered honestly throughout the AI Homelab Engineering series, including its own [retrospective on what went wrong](/blog/ai-homelab-engineering/15-biggest-mistakes-building-ai-homelab) building it. That overhead is a real cost, paid in engineering time rather than API spend, and it's worth being clear-eyed about: this scaling model works because the operational cost of running local infrastructure is one I'm equipped to pay, with Prometheus, Grafana, and Loki watching the cluster. It wouldn't be the right choice for every team building a similar platform.

::CtaCardRow
  :::CtaTryApp
  ---
  buttonText: "Try VerseHub"
  supportingCopy: "See this scaling strategy running in production."
  destinationUrl: "https://versehub.app/"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: VerseHub Architecture"
  supportingCopy: "Back to where this series started — the full system overview."
  destinationUrl: "/blog/versehub-engineering/01-versehub-architecture"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get new VerseHub engineering breakdowns delivered before they're public."
  ---
  :::
::

## Further Reading

::AuthoritativeLinks
---
title: "Authoritative Sources"
links:
  - label: "Horizontal Scaling — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Scalability"
    type: "wikipedia"
    description: "Background on scaling strategies applicable to the hybrid local/hosted approach described here."
---
::

## Related reading

- [MinIO Storage Strategy](/blog/versehub-engineering/08-minio-storage-strategy) — previous in the series: the storage layer.
- [VerseHub Architecture](/blog/versehub-engineering/01-versehub-architecture) — back to the start: the full system map.
- [VerseHub project page](/projects/versehub) — overview and architecture diagram.
- [Using Three Jetson Orin Nano Supers as an AI Cluster](/blog/ai-homelab-engineering/02-three-jetson-orin-nano-supers-as-ai-cluster) — the hardware the fast draft runs on.
- [Running Everything Locally](/blog/ai-cost-optimization/06-running-everything-locally) — the cost case for local-first.

---

*[← Back to VerseHub Engineering](/categories/versehub-engineering)*
