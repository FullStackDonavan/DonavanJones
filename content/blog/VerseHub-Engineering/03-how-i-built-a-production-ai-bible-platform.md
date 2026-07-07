---
title: "How I Built a Production AI Bible Platform"
description: "The end-to-end story of building VerseHub — from a scripture content application to a full AI-powered study and community platform."
date: 2026-07-08
lastUpdated: "2026-07-08"
category: "versehub-engineering"
tags:
  - versehub-engineering
  - case-study
draft: true
slug: how-i-built-a-production-ai-bible-platform
author: Donavan Jones
---

# How I Built a Production AI Bible Platform

This is the full story, start to finish — how VerseHub went from a scripture content delivery application to a production platform combining AI study tools, real-time community, and media processing, and the order the pieces actually got built in.

*Part of the [VerseHub Engineering series](/categories/versehub-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every VerseHub engineering deep-dive in this series."
destinationUrl: "/categories/versehub-engineering"
---
::

## Starting Point: Content, Not AI

VerseHub began as a straightforward content-delivery application — scripture text served from PostgreSQL, no AI involved. Getting the content model, search, and basic reading experience right first meant the foundation was solid before any AI complexity was layered on top of it — a sequencing choice that mattered more than it might seem, since a shaky content layer would have made every AI feature built on top of it shakier too.

## Adding Semantic Search Before Adding AI Generation

The next layer wasn't an AI chatbot — it was semantic search over the scripture corpus via Weaviate, letting users find passages by meaning rather than exact keyword match. This is retrieval infrastructure, not generation, and building it first meant the eventual RAG-based AI study features had a working retrieval layer to build on rather than needing to solve retrieval and generation simultaneously.

## Layering In the AI Study Domain

With retrieval working, the AI study domain (covered in depth [elsewhere in this series](/blog/versehub-engineering/how-i-added-agentic-ai-to-versehub)) added generation on top: grounded answers to study questions, with the hybrid Llama/OpenAI routing keeping cost reasonable for the high-volume common case while preserving quality for harder questions.

## Real-Time Community, Built Separately

Community features — live discussion, group study sessions — were built as their own domain over WebSocket for synchronous updates and WebRTC for livestreaming, deliberately kept independent of the AI domain. A user's AI study session and a live group discussion don't share a code path, which meant each could be developed and scaled on its own timeline.

## Media Processing, Added Last

Media upload and processing (audio, video study content, processed through BullMQ-queued FFmpeg transcoding into MinIO storage) was the last major domain added — it had the least urgency of the core features and benefited from having the storage and queueing patterns already proven out by the other domains first.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See the complete architecture this build process produced."
destinationUrl: "/systems/versehub-engineering"
---
::

## What the Sequencing Got Right

Building content, then retrieval, then generation, then real-time features, then media — in that order — meant each layer had a stable foundation to build on rather than several complex systems being developed simultaneously with unclear boundaries between them. The domain-driven architecture covered in the [architecture overview](/blog/versehub-engineering/versehub-architecture) is as much a product of this build order as it is a deliberate upfront design.

::CtaCardRow
  :::CtaTryApp
  ---
  buttonText: "Try VerseHub"
  supportingCopy: "See the finished platform this build process produced."
  destinationUrl: "https://versehub.app/"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Scaling VerseHub with Local AI Infrastructure"
  supportingCopy: "How the platform runs and scales today."
  destinationUrl: "/blog/versehub-engineering/scaling-versehub-with-local-ai-infrastructure"
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
  - label: "Retrieval-Augmented Generation — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation"
    type: "wikipedia"
    description: "The retrieval-then-generation pattern that shaped the build sequencing described above."
---
::

---

*[← Back to VerseHub Engineering](/categories/versehub-engineering)*
