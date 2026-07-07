---
title: "VerseHub Architecture"
description: "The full system architecture behind VerseHub — a production SaaS spanning content delivery, RAG-backed AI, real-time community, and media processing."
date: 2026-06-24
lastUpdated: "2026-06-24"
category: "versehub-engineering"
tags:
  - versehub-engineering
  - architecture
draft: true
slug: versehub-architecture
author: Donavan Jones
---

# VerseHub Architecture

VerseHub is engineered across five independently scalable domains: scripture content delivery, RAG-backed AI study, real-time community interaction, async media processing, and a hybrid AI orchestration layer. This is the map connecting them.

*Part of the [VerseHub Engineering series](/categories/versehub-engineering).*

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
│(PostgreSQL)│ (Weaviate) │(WebSocket/ │ (BullMQ +│ (Llama / │
│            │            │  WebRTC)   │ FFmpeg)  │  OpenAI) │
├────────────┴────────────┴────────────┴──────────┴──────────┤
│         Redis (sessions, rate limiting, pub/sub)            │
├───────────────────────────────────────────────────────────┤
│                  MinIO (object storage)                     │
└───────────────────────────────────────────────────────────┘
```

Each domain owns its own data access and scaling surface without being tightly coupled to the others — the media processing pipeline can scale independently of the real-time community layer, and neither depends on the AI routing layer being available to function for their own core responsibilities.

## Request Flow

```
1. HTTP request → Nitro server (Nuxt 3's server engine)
2. Scripture query → PostgreSQL, or semantic query → Weaviate vector retrieval
3. AI queries → custom prompt orchestration → Llama 3.2 8B (primary) → OpenAI API (fallback)
4. Media uploads → BullMQ job queue → FFmpeg transcoding worker → MinIO object storage
5. Live events → WebSocket broadcast; livestreams → WebRTC peer connections
6. Session state, rate limiting, cross-instance pub/sub → Redis
```

## Why Domain-Driven, Not Monolithic

Each domain boundary owns its data access and service logic. The AI study domain doesn't reach directly into the community domain's tables, and the media processing domain doesn't know anything about how the AI routing layer makes its decisions. This isolation is what lets each domain be worked on, scaled, and reasoned about independently — a change to the AI routing logic doesn't risk breaking real-time community features, because there's no code path connecting them beyond well-defined interfaces.

## The AI Routing Layer Specifically

Standard AI queries route to a locally-hosted Llama 3.2 8B model by default; complex or low-confidence cases escalate to the OpenAI API. This is the same hybrid cost/quality routing philosophy covered in the [AI Cost Optimization series](/categories/ai-cost-optimization), applied here to a real production application serving real users rather than a single developer's workflow.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See the interactive architecture diagram for VerseHub's production system."
destinationUrl: "/systems/versehub-engineering"
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
  destinationUrl: "/blog/versehub-engineering/how-i-added-agentic-ai-to-versehub"
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

---

*[← Back to VerseHub Engineering](/categories/versehub-engineering)*
