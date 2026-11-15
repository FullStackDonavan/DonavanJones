---
title: "Storing AI Memory with Redis and Vector Databases"
description: "Storing AI agent memory with Redis and a vector database: Redis with TTLs for fast session state, vector search for long-term recall, and promotion between."
date: 2026-09-01
lastUpdated: "2026-11-14"
category: "agentic-ai-systems"
tags:
  - agentic-ai-systems
  - redis
  - vector-databases
draft: false
slug: storing-ai-memory-with-redis-and-vector-databases
author: Donavan Jones
excerptImage: /img/blog/agentic-ai-systems/05-storing-ai-memory-with-redis-and-vector-databases.jpg
---

# Storing AI Memory with Redis and Vector Databases

Use Redis for session memory that an agent reads and writes on nearly every step, and a vector database for long-term memories that need to be found by meaning. Neither store does the other's job well, so a production agent uses both, with a promotion step in between. This is the concrete implementation of the scopes from [Agent Memory Architectures](/blog/agentic-ai-systems/04-agent-memory-architectures).

*Part of the [Agentic AI Systems series](/categories/agentic-ai-systems). For how these patterns fit together in a running system, see the [agentic AI systems hub](/systems/agentic-ai).*

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

This is the split I run at home: Redis lives on one of the Raspberry Pi workers in my K3s cluster (it also backs VerseHub's LLM response cache), and Weaviate holds the vectors, embedded with all-MiniLM-L6-v2. The [VerseHub Redis memory layer](/blog/versehub-engineering/05-redis-memory-layer-design) post covers that side in more detail.

## Vector Storage for Long-Term Recall

Long-term memories need to be findable by meaning ([vector search](/blog/backendengineering/05-vector-search)), not just by exact key — "what did I learn about this user's deployment setup" should surface a memory stored as "user runs k3s on ARM64 nodes" even if the query doesn't use those exact words.

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
  destinationUrl: "/blog/agentic-ai-systems/06-building-an-ai-copilot-that-understands-your-codebase"
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

## Related reading

- [Agent Memory Architectures](/blog/agentic-ai-systems/04-agent-memory-architectures) — previous: the three memory scopes this implements
- [Building an AI Copilot That Understands Your Entire Codebase](/blog/agentic-ai-systems/06-building-an-ai-copilot-that-understands-your-codebase) — next: putting retrieval and memory together in a codebase copilot
- [Agentic AI Systems hub](/systems/agentic-ai) — the hub for the agentic AI series
- [MinIO and Distributed AI Storage](/blog/ai-homelab-engineering/07-minio-and-distributed-ai-storage) — the rest of the storage layer in my homelab

---

*[← Back to Agentic AI Systems](/categories/agentic-ai-systems)*
