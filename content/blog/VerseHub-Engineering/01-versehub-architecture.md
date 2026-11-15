---
title: "VerseHub Architecture"
description: "VerseHub architecture: a Nuxt 3 Bible app with Weaviate RAG, a Jetson llama3.2:3b fast draft, a Temporal refine workflow, Redis, MinIO, and live community."
date: 2026-07-18
lastUpdated: "2026-11-14"
category: "versehub-engineering"
tags:
  - versehub-engineering
  - architecture
draft: false
slug: versehub-architecture
author: Donavan Jones
excerptImage: /img/blog/versehub-engineering/01-versehub-architecture.jpg
---

# VerseHub Architecture

[VerseHub](https://versehub.app/) is a Nuxt 3 Bible study platform split into five independently scalable domains: scripture content delivery, RAG-backed AI study, real-time community, async media processing, and an AI orchestration layer. Its AI answers come in two passes: a fast draft from `llama3.2:3b` on a Jetson Orin Nano Super, then a refine pass that retrieves evidence from Weaviate and verifies citations inside a Temporal workflow. This is the map connecting them.

*Part of the [VerseHub Engineering series](/categories/versehub-engineering). For the project overview and live diagram, see the [VerseHub project page](/projects/versehub).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every VerseHub engineering deep-dive in this series."
destinationUrl: "/categories/versehub-engineering"
---
::

## The Five Domains

```
┌───────────────────────────────────────────────────────────┐
│                   Nuxt 3 / Nitro Server                    │
├────────────┬────────────┬────────────┬──────────┬──────────┤
│  Content   │  AI Study  │ Real-Time  │  Media   │ AI Model │
│  Delivery  │  (RAG)     │ Community  │Processing│ Routing  │
│(PostgreSQL)│ (Weaviate) │(WebSocket/ │ (BullMQ +│(Jetson + │
│            │            │  WebRTC)   │ FFmpeg)  │ Temporal)│
├────────────┴────────────┴────────────┴──────────┴──────────┤
│   Redis (sessions, rate limiting, pub/sub, LLM cache)       │
├───────────────────────────────────────────────────────────┤
│                  MinIO (object storage)                     │
└───────────────────────────────────────────────────────────┘
```

Each domain owns its own data access and scaling surface without being tightly coupled to the others — the media processing pipeline can scale independently of the real-time community layer, and neither depends on the AI routing layer being available to function for their own core responsibilities.

## Request Flow

```
1. HTTP request → Nitro server (Nuxt 3's server engine)
2. Scripture query → PostgreSQL, or semantic query → Weaviate vector retrieval
3. AI queries → fast draft from llama3.2:3b on a Jetson (~21 tok/s) → Temporal ScholarWorkflow refine pass (retrieve → score → generate → verify) on the Pi workers
4. Media uploads → BullMQ job queue → FFmpeg transcoding worker → MinIO object storage
5. Live events → WebSocket broadcast; livestreams → WebRTC peer connections
6. Session state, rate limiting, cross-instance pub/sub, LLM response cache → Redis
7. Voice → Kokoro TTS + whisper.cpp STT on a dedicated Jetson
```

## Why Domain-Driven, Not Monolithic

Each domain boundary owns its data access and service logic. The AI study domain doesn't reach directly into the community domain's tables, and the media processing domain doesn't know anything about how the AI routing layer makes its decisions. This isolation is what lets each domain be worked on, scaled, and reasoned about independently — a change to the AI routing logic doesn't risk breaking real-time community features, because there's no code path connecting them beyond well-defined interfaces.

## The AI Layer Specifically

AI answers (BibleLogic, in the app) are split into two passes. First, a fast draft from `llama3.2:3b`, which stays pinned in memory on one of my [three Jetson Orin Nano Supers](/blog/ai-homelab-engineering/02-three-jetson-orin-nano-supers-as-ai-cluster) and generates at about 21 tok/s, so the user sees something quickly. Second, a refine pass that runs as a Temporal `ScholarWorkflow` on the Raspberry Pi workers: retrieve evidence from Weaviate (verse and Church Fathers collections, embedded with all-MiniLM-L6-v2 on my RTX 3090), score it, generate a grounded answer, and verify every citation against the retrieved evidence. It's the same local-first cost logic covered in the [AI Cost Optimization series](/categories/ai-cost-optimization), applied to a real production application rather than a single developer's workflow. The retrieval side is covered in depth in [Retrieval Systems for Theology](/blog/ai-engineering/09-retrieval-systems-for-theology).

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See the interactive architecture diagram for VerseHub's production system."
destinationUrl: "/projects/versehub"
---
::

## What the Rest of This Series Covers

Each domain and cross-cutting concern gets its own deep dive: how agentic AI was added to this architecture after the fact, the AI pipeline's internal design, the memory layer backing ongoing study context, the verification pipeline that grounds AI output, Temporal-based workflow orchestration for the more complex agentic flows, and how the whole platform scales on self-hosted infrastructure.

::CtaCardRow
  :::CtaTryApp
  ---
  buttonText: "Try VerseHub"
  supportingCopy: "See this architecture running in production."
  destinationUrl: "https://versehub.app/"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: How I Added Agentic AI to My SaaS Application"
  supportingCopy: "How the AI layer was integrated into this existing architecture."
  destinationUrl: "/blog/versehub-engineering/02-how-i-added-agentic-ai-to-versehub"
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
  - label: "Nuxt 3 — Official Documentation"
    url: "https://nuxt.com/docs"
    type: "external"
    description: "Official documentation for the framework VerseHub's server and frontend are built on."
  - label: "Domain-Driven Design — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Domain-driven_design"
    type: "wikipedia"
    description: "Background on the domain-boundary architectural approach used throughout VerseHub."
---
::

## Related reading

- [How I Added Agentic AI to My SaaS Application (VerseHub)](/blog/versehub-engineering/02-how-i-added-agentic-ai-to-versehub) — next in the series: how the AI layer was added safely.
- [VerseHub project page](/projects/versehub) — the overview and interactive architecture diagram.
- [Temporal Workflows in Production](/blog/versehub-engineering/07-temporal-workflows-in-production) — the refine pass in detail.
- [My Homelab Architecture for Agentic AI Development](/blog/ai-homelab-engineering/01-my-homelab-architecture-for-agentic-ai) — the cluster VerseHub's AI runs on.

---

*[← Back to VerseHub Engineering](/categories/versehub-engineering)*
