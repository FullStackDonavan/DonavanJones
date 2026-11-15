---
title: "Redis Memory Layer Design"
description: "How VerseHub uses Redis for sessions, rate limiting, an LLM response cache, and cross-instance pub/sub, plus where the memory boundary with PostgreSQL sits."
date: 2026-09-10
lastUpdated: "2026-11-14"
category: "versehub-engineering"
tags:
  - versehub-engineering
  - redis
draft: false
slug: redis-memory-layer-design
author: Donavan Jones
excerptImage: /img/blog/versehub-engineering/05-redis-memory-layer-design.jpg
---

# Redis Memory Layer Design

VerseHub uses Redis for anything that's fast, shared, and disposable: session data, rate limiting, an LLM response cache, and cross-instance pub/sub. All of it needs low latency and visibility across every application instance, and none of it needs long-term durability — that belongs in PostgreSQL. In my cluster, Redis runs on one of the Raspberry Pi workers (pi-worker-2).

*Part of the [VerseHub Engineering series](/categories/versehub-engineering). For the project overview, see the [VerseHub project page](/projects/versehub).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every VerseHub engineering deep-dive in this series."
destinationUrl: "/categories/versehub-engineering"
---
::

## What Lives in Redis

**Session state** — authentication tokens, active study session context, and short-lived user state that needs to be readable from any application instance handling a given user's request, not just the instance that created it.

**Rate limiting** — per-user and per-endpoint request counters, using Redis's atomic increment operations to enforce limits accurately even under concurrent requests across multiple instances.

**LLM response cache** — repeated AI questions are answered from Redis instead of re-running the model, which takes load off the Jetson that serves the fast draft and off the refine workflow.

**Cross-instance pub/sub** — real-time community features (covered in the [architecture overview](/blog/versehub-engineering/01-versehub-architecture)) need WebSocket messages to reach connected clients regardless of which application instance they're connected to; Redis pub/sub is the coordination layer that makes a message published on one instance visible to subscribers connected through another.

Pub/sub also carries streamed AI output, and that's where I hit the most memorable Redis bug: replaying a stream interleaved text from overlapping messages every 18 characters, so answers came out as two sentences shuffled together. It's fixed, and the lesson stuck: test stream replay with concurrent messages, not just one clean stream. [Streaming](/blog/backendengineering/06-streaming) covers the general pattern.

## Why Not PostgreSQL for This

PostgreSQL handles VerseHub's durable, relational data well, but it's the wrong tool for state that's read and written on nearly every request and doesn't need to survive a restart in the same way user accounts or scripture content does. Using Redis for this high-frequency, ephemeral layer keeps the relational database's load profile focused on what it's actually good at.

## Rate Limiting Implementation

```python
def check_rate_limit(user_id, endpoint, limit=100, window_seconds=60):
    key = f"ratelimit:{user_id}:{endpoint}"
    current = redis_client.incr(key)
    if current == 1:
        redis_client.expire(key, window_seconds)
    return current <= limit
```

The `expire` call only fires on the first increment within a window, which gives a simple fixed-window limit without needing a separate cleanup process to expire stale counters. (A true sliding window needs a sorted set or two overlapping counters; for VerseHub's traffic, fixed windows are good enough.)

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how this memory layer fits into VerseHub's full architecture."
destinationUrl: "/projects/versehub"
---
::

## Memory Boundaries: What Doesn't Belong Here

Long-term study history, user preferences meant to persist indefinitely, and anything that needs to be queryable in complex ways (joins, aggregations across users) belongs in PostgreSQL, not Redis. The distinction drawn throughout VerseHub's design is the same one covered in the general [Agentic AI Systems memory architecture](/blog/agentic-ai-systems/04-agent-memory-architectures) article — fast, ephemeral, session-scoped state in Redis; durable, structured, long-term state in a relational store.

::CtaCardRow
  :::CtaTryApp
  ---
  buttonText: "Try VerseHub"
  supportingCopy: "See this memory layer running in production."
  destinationUrl: "https://versehub.app/"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Temporal Workflows in Production"
  supportingCopy: "The durable orchestration layer for VerseHub's more complex agentic flows."
  destinationUrl: "/blog/versehub-engineering/07-temporal-workflows-in-production"
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
  - label: "Redis — Official Documentation"
    url: "https://redis.io/docs/latest/"
    type: "external"
    description: "Official documentation for the in-memory data store used throughout VerseHub's session and coordination layer."
  - label: "Publish–Subscribe Pattern — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern"
    type: "wikipedia"
    description: "Background on the pub/sub pattern used for cross-instance real-time message delivery."
---
::

## Related reading

- [AI Pipeline Design](/blog/versehub-engineering/04-ai-pipeline-design) — previous in the series: the AI stages this cache sits in front of.
- [Verification Pipeline for AI Outputs](/blog/versehub-engineering/06-verification-pipeline-for-ai-outputs) — next: checking AI output before users see it.
- [VerseHub project page](/projects/versehub) — overview and architecture diagram.
- [Storing AI Memory with Redis and Vector Databases](/blog/agentic-ai-systems/05-storing-ai-memory-with-redis-and-vector-databases) — the general Redis-plus-vectors pattern.

---

*[← Back to VerseHub Engineering](/categories/versehub-engineering)*
