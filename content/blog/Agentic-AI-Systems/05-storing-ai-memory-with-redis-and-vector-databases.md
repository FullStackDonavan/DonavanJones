---
title: "Storing AI Memory with Redis and Vector Databases"
description: "A concrete implementation for agent memory storage — Redis for fast session state, a vector database for semantic long-term recall."
date: 2026-05-11
lastUpdated: "2026-06-09"
category: "agentic-ai-systems"
tags:
  - agentic-ai-systems
  - redis
  - vector-databases
draft: true
slug: storing-ai-memory-with-redis-and-vector-databases
author: Donavan Jones
---

# Storing AI Memory with Redis and Vector Databases

Following the memory-scope framework from the previous article, here's the concrete implementation: Redis for anything that needs fast, structured access within a session, and a vector database for anything that needs semantic recall across time.

*Part of the [Agentic AI Systems series](/categories/agentic-ai-systems).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every agentic AI systems deep-dive in this series."
destinationUrl: "/categories/agentic-ai-systems"
---
::

## Redis for Session State

Session memory needs low latency (it's read and written on nearly every agent step) and a natural expiration policy. Redis fits both:

```python
import redis
import json

r = redis.Redis(host='localhost', port=6379, db=0)

def append_session_context(session_id, entry):
    key = f"session:{session_id}:context"
    r.rpush(key, json.dumps(entry))
    r.expire(key, 60 * 60 * 4)  # 4-hour TTL

def get_session_context(session_id, last_n=20):
    key = f"session:{session_id}:context"
    entries = r.lrange(key, -last_n, -1)
    return [json.loads(e) for e in entries]
```

The TTL matters — session memory that never expires slowly turns into an unmanaged long-term store with none of the deliberate curation that long-term memory needs.

## Vector Storage for Long-Term Recall

Long-term memories need to be findable by meaning, not just by exact key — "what did I learn about this user's deployment setup" should surface a memory stored as "user runs k3s on ARM64 nodes" even if the query doesn't use those exact words.

```python
def store_long_term_memory(content, metadata):
    embedding = embed(content)
    vector_store.upsert(
        vector=embedding,
        payload={"content": content, **metadata, "created_at": now()},
    )

def recall_relevant_memories(query, top_k=5):
    query_embedding = embed(query)
    return vector_store.search(query_embedding, top_k=top_k)
```

## Why Not Put Everything in One Store

Redis is fast but not built for semantic search — it's a poor fit for "find memories related to this concept." A vector database handles semantic recall well but isn't optimized for the high-frequency read/write pattern of active session state. Using each for what it's good at, rather than forcing one store to do both jobs, is the difference between a memory system that feels responsive and one that adds noticeable latency to every agent step.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how this memory storage layer fits into a full production agentic system."
destinationUrl: "/systems/agentic-ai"
---
::

## Promotion Between Stores

The bridge between the two is the memory-promotion step: after a session ends, or periodically during a long-running one, an extraction pass reviews the session's Redis-stored context and decides what's durable enough to embed and store long-term. Most session context doesn't get promoted — it was useful in the moment and irrelevant afterward. Only the patterns and facts likely to matter again get written to the vector store.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The AI Starter Kit"
  supportingCopy: "Get the Self-Hosted AI Starter Kit — Redis and vector database templates included ($29)."
  destinationUrl: "/products/self-hosted-ai-starter-kit"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Building an AI Copilot That Understands Your Entire Codebase"
  supportingCopy: "Memory storage applied to a real production use case."
  destinationUrl: "/blog/agentic-ai-systems/building-an-ai-copilot-that-understands-your-codebase"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get new agentic AI breakdowns delivered before they're public."
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
    description: "Official documentation for the in-memory data store used for session-scoped agent state."
  - label: "Vector Database — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Vector_database"
    type: "wikipedia"
    description: "Background on vector similarity search used for long-term semantic memory recall."
---
::

---

*[← Back to Agentic AI Systems](/categories/agentic-ai-systems)*
