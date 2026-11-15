---
title: "How I Added Agentic AI to My SaaS Application (VerseHub)"
description: "How I added agentic AI to VerseHub, a live SaaS app: a separate AI domain, new endpoints instead of refactors, grounded RAG answers, and constant verification."
date: 2026-07-30
lastUpdated: "2026-11-14"
category: "versehub-engineering"
tags:
  - versehub-engineering
  - agentic-ai
draft: false
slug: how-i-added-agentic-ai-to-versehub
author: Donavan Jones
excerptImage: /img/blog/versehub-engineering/02-how-i-added-agentic-ai-to-versehub.jpg
---

# How I Added Agentic AI to My SaaS Application (VerseHub)

I added agentic AI to VerseHub by putting it in its own domain with new endpoints, shipping one narrow grounded feature first, and verifying output at every stage, so existing features never depended on the AI layer. VerseHub existed as a working scripture-study application before any AI features shipped, and adding AI to an app already serving real users is a different problem than building AI-first: the bar for "doesn't break what already works" is much higher.

*Part of the [VerseHub Engineering series](/categories/versehub-engineering). For the project overview, see the [VerseHub project page](/projects/versehub).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every VerseHub engineering deep-dive in this series."
destinationUrl: "/categories/versehub-engineering"
---
::

## Starting With a Boundary, Not a Feature

The first decision wasn't which AI feature to ship — it was where the AI layer would live in the codebase. A new domain, with its own service boundary, its own data access patterns, and no direct coupling to the existing content-delivery or community domains. This meant the AI layer could be built, tested, and even rolled back entirely without touching the code paths that already worked for existing users.

## Shipping the Narrowest Useful Version First

The first agentic AI feature wasn't a general-purpose assistant — it was a single, narrow capability: retrieval-augmented answers to direct scripture questions, grounded in actual text via Weaviate search rather than the model's unverified recall. Narrow scope meant a smaller verification surface (covered in [Verification Pipeline for AI Outputs](/blog/versehub-engineering/06-verification-pipeline-for-ai-outputs)) and a feature simple enough to evaluate clearly before expanding it.

## Routing AI Requests Without Touching Existing Endpoints

Rather than modifying existing request handlers to add AI behavior inline, new endpoints were added specifically for AI-powered features, calling into the new AI domain's services. Existing functionality kept working through its original, unmodified code path — the AI layer was additive, not a refactor of what already existed.

```
Existing: GET /api/scripture/:reference        → PostgreSQL (unchanged)
New:      POST /api/study/ask                  → AI domain → Jetson llama3.2:3b draft + Temporal refine (Weaviate)
```

## Expanding Gradually, With Verification at Every Stage

Each subsequent AI feature — deeper study tools, the Debate Arena, voice (Kokoro TTS and Whisper STT on a dedicated Jetson, with a round trip of about 0.85 s), the [Redis-backed memory and cache layer](/blog/versehub-engineering/05-redis-memory-layer-design) — shipped behind the same verification discipline established for the first feature. Expanding scope didn't mean relaxing the bar; it meant applying the same grounding and verification pattern to each new capability before it reached users.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how the AI layer fits into VerseHub's full production architecture."
destinationUrl: "/projects/versehub"
---
::

## What This Approach Cost

Building a clean domain boundary and a verification pipeline before shipping the first feature took longer than wiring AI output directly into an existing endpoint would have. That upfront cost is the reason the AI layer could expand steadily afterward without accumulating the kind of tangled, hard-to-verify AI integration that becomes a liability once real users depend on the output being trustworthy. If you're weighing the same move, [Single Agent vs Multi-Agent Systems](/blog/agentic-ai-systems/01-single-agent-vs-multi-agent-systems) is a good place to decide how much "agent" you actually need.

::CtaCardRow
  :::CtaTryApp
  ---
  buttonText: "Try VerseHub"
  supportingCopy: "See the AI study features this approach produced."
  destinationUrl: "https://versehub.app/"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: AI Pipeline Design"
  supportingCopy: "The internal design of the AI domain itself."
  destinationUrl: "/blog/versehub-engineering/04-ai-pipeline-design"
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
  - label: "Strangler Fig Pattern — Martin Fowler"
    url: "https://martinfowler.com/bliki/StranglerFigApplication.html"
    type: "external"
    description: "The incremental-migration pattern this additive, boundary-first approach to adding AI is closely related to."
---
::

## Related reading

- [VerseHub Architecture](/blog/versehub-engineering/01-versehub-architecture) — previous in the series: the five domains.
- [How I Built a Production AI Bible Platform](/blog/versehub-engineering/03-how-i-built-a-production-ai-bible-platform) — next: the full build order.
- [VerseHub project page](/projects/versehub) — overview and architecture diagram.
- [AI Pipelines for Bible Study](/blog/ai-engineering/15-ai-pipelines-for-bible-study) — the AI-engineering view of the same features.

---

*[← Back to VerseHub Engineering](/categories/versehub-engineering)*
