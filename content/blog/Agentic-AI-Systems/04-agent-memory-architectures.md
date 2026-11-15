---
title: "Agent Memory Architectures"
description: "Agent memory architectures: how to split working, session, and long-term memory for a production AI agent, and decide what gets promoted between them."
date: 2026-08-20
lastUpdated: "2026-11-14"
category: "agentic-ai-systems"
tags:
  - agentic-ai-systems
  - memory
draft: false
slug: agent-memory-architectures
author: Donavan Jones
excerptImage: /img/blog/agentic-ai-systems/04-agent-memory-architectures.jpg
---

# Agent Memory Architectures

An agent without memory re-derives everything from scratch on every task, including things it already figured out five minutes ago. Memory architecture is what lets an agent build on its own prior work — within a task, across a session, and across sessions over time — and each of those three scopes needs a different storage strategy.

*Part of the [Agentic AI Systems series](/categories/agentic-ai-systems). For how these patterns fit together in a running system, see the [agentic AI systems hub](/systems/agentic-ai).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every agentic AI systems deep-dive in this series."
destinationUrl: "/categories/agentic-ai-systems"
---
::

## Three Scopes of Agent Memory

**Working memory (within a task)** — the current plan, intermediate results, and tool outputs accumulated during a single task. Lives in the agent loop's own state, discarded or summarized once the task completes.

**Session memory (across a conversation)** — context that should persist across multiple related tasks in one session but doesn't need to survive indefinitely. A reasonable fit for Redis, keyed by session ID, with a TTL.

**Long-term memory (across sessions)** — durable facts, learned patterns, and past decisions worth keeping indefinitely. This needs both structured storage (for direct lookup) and a [vector store](/blog/ai-engineering/02-vector-databases) (for semantic recall when the exact phrasing of a future query doesn't match how something was originally stored).

In my own cluster that maps to Redis for session-scoped data, Weaviate for vectors, and PostgreSQL for structured records — the same split VerseHub uses, described in [Redis Memory Layer Design](/blog/versehub-engineering/05-redis-memory-layer-design).

## Why Not Just One Big Context Window

Even with a large context window, dumping everything into every request is expensive and dilutes the signal — most of an agent's accumulated history is irrelevant to its current step. Structured memory scopes let the agent retrieve only what's relevant right now, rather than paying the token cost of everything it's ever done.

## What Gets Stored at Each Layer

```
Working memory:   current plan, step results, tool call history (this task only)
Session memory:   user preferences established this session, task context, recent decisions
Long-term memory: durable facts about the project/user, patterns that recur across sessions,
                   past mistakes worth not repeating
```

The promotion path — working memory to session memory to long-term memory — is an explicit compression step, similar to the memory-formation pipeline covered in the [AI Engineering series](/blog/ai-engineering/01-persistent-memory-systems): not everything that happens in working memory is worth keeping, and an extraction pass decides what's durable enough to promote.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how memory architecture fits into a full production agentic system."
destinationUrl: "/systems/agentic-ai"
---
::

## The Failure Mode of Getting This Wrong

An agent that treats everything as long-term memory accumulates noise — every intermediate tool call and abandoned plan gets stored indefinitely, and retrieval quality degrades as the signal-to-noise ratio drops. An agent that treats nothing as long-term memory repeats the same mistakes and re-learns the same project context every session. The right architecture is deliberate about what gets promoted and what gets discarded.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The AI Starter Kit"
  supportingCopy: "Get the Self-Hosted AI Starter Kit — memory architecture patterns and Redis templates ($29)."
  destinationUrl: "/products/self-hosted-ai-starter-kit"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Storing AI Memory with Redis and Vector Databases"
  supportingCopy: "The concrete storage implementation behind this architecture."
  destinationUrl: "/blog/agentic-ai-systems/05-storing-ai-memory-with-redis-and-vector-databases"
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
  - label: "Working Memory — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Working_memory"
    type: "wikipedia"
    description: "Cognitive science background on the working-memory concept applied to agent task state."
  - label: "Generative Agents: Interactive Simulacra of Human Behavior"
    url: "https://doi.org/10.48550/arXiv.2304.03442"
    type: "doi"
    description: "Stanford research on memory streams and reflection in agent architectures."
---
::

## Related reading

- [Teaching AI Agents About Your Project with RAG](/blog/agentic-ai-systems/03-teaching-ai-agents-about-your-project-with-rag) — previous: retrieving project context at request time
- [Storing AI Memory with Redis and Vector Databases](/blog/agentic-ai-systems/05-storing-ai-memory-with-redis-and-vector-databases) — next: the concrete Redis + vector store implementation
- [Agentic AI Systems hub](/systems/agentic-ai) — the hub for the agentic AI series
- [Memory Systems](/blog/ai-engineering/19-memory-systems) — memory systems from the AI engineering side

---

*[← Back to Agentic AI Systems](/categories/agentic-ai-systems)*
