---
title: "Event-Driven AI Agents Using Kafka"
description: "Event-driven AI agents using Kafka: when to trigger agents from events instead of requests, and how replay, consumer groups, and dead-letter topics help."
date: 2026-10-10
lastUpdated: "2026-11-14"
category: "agentic-ai-systems"
tags:
  - agentic-ai-systems
  - kafka
  - event-driven
draft: false
slug: event-driven-ai-agents-using-kafka
author: Donavan Jones
excerptImage: /img/blog/agentic-ai-systems/08-event-driven-ai-agents-using-kafka.jpg
---

# Event-Driven AI Agents Using Kafka

Not every agent should be triggered by a direct request. Some are better modeled as reacting to a continuous stream of events — a new file uploaded, a support ticket created, a deployment completed — rather than being called synchronously and expected to respond immediately. Kafka is the backbone that makes this reliable at scale.

*Part of the [Agentic AI Systems series](/categories/agentic-ai-systems). For how these patterns fit together in a running system, see the [agentic AI systems hub](/systems/agentic-ai).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every agentic AI systems deep-dive in this series."
destinationUrl: "/categories/agentic-ai-systems"
---
::

## Why Event-Driven Instead of Request/Response

A request/response agent (call it, wait for a result) is the right model when there's a human waiting for an answer. An event-driven agent fits better when the trigger is something happening elsewhere in the system and there's no one synchronously waiting — a new support ticket should trigger a triage agent, but the ticket-creation code shouldn't block on the agent's full analysis to finish.

## Basic Structure

```python
from confluent_kafka import Consumer, Producer

consumer = Consumer({
    'bootstrap.servers': 'localhost:9092',
    'group.id': 'triage-agent',
    'auto.offset.reset': 'earliest',
})
consumer.subscribe(['support.ticket.created'])

producer = Producer({'bootstrap.servers': 'localhost:9092'})

while True:
    msg = consumer.poll(1.0)
    if msg is None:
        continue
    ticket = json.loads(msg.value())
    result = triage_agent.process(ticket)
    producer.produce('support.ticket.triaged', json.dumps(result).encode())
    consumer.commit(msg)
```

The agent doesn't poll a queue and pull work when idle — it subscribes to a topic and reacts as events arrive, and Kafka's consumer group model handles distributing load across multiple agent instances automatically if volume grows.

## Why Kafka Specifically, Not Just a Queue

**Replay.** Kafka retains events for a configured retention period rather than deleting them once consumed. If a bug in the triage agent's logic is discovered after the fact, the events can be replayed through a fixed version of the agent — something a simple queue that deletes on consumption can't do.

**Multiple independent consumers.** The same `support.ticket.created` event can be consumed by a triage agent, an analytics pipeline, and an audit logger independently, each tracking its own read position — without the ticket-creation service needing to know about any of them.

**Ordering guarantees within a partition.** For agents where event order matters (a sequence of updates to the same entity), Kafka's per-partition ordering guarantee gives a deterministic processing order that's harder to guarantee with some other queue designs.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how event-driven agents fit into a full production agentic system."
destinationUrl: "/systems/agentic-ai"
---
::

## Failure Handling

An agent that fails partway through processing an event shouldn't silently drop it. Committing the consumer offset only after successful processing (rather than immediately on receipt) means a crashed agent picks the event back up on restart. For events that repeatedly fail, a dead-letter topic keeps them from blocking the main stream while preserving them for investigation.

## Where Kafka Fits in My Own Stack (It Doesn't, Yet)

To be clear about my own setup: I don't run Kafka in my homelab. VerseHub's agent steps are orchestrated with [Temporal](/blog/agentic-ai-systems/07-building-multi-agent-workflows-with-temporal), and streamed answers go over Redis pub/sub. That's exactly where I learned why replay semantics matter — a pub/sub replay bug once interleaved streamed text every 18 characters. Kafka's retained, offset-tracked log is what I'd reach for once event volume and replay needs justify running it; until then, simpler [async workers](/blog/backendengineering/12-async-workers) cover most background agent work.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The AI Starter Kit"
  supportingCopy: "Get the Self-Hosted AI Starter Kit — event-driven and orchestration architecture patterns ($29)."
  destinationUrl: "/products/self-hosted-ai-starter-kit"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Long-Running Agent Workflows"
  supportingCopy: "Combining event-driven triggers with durable long-running execution."
  destinationUrl: "/blog/agentic-ai-systems/09-long-running-agent-workflows"
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
  - label: "Apache Kafka — Official Documentation"
    url: "https://kafka.apache.org/documentation/"
    type: "external"
    description: "Official documentation for the distributed event streaming platform used as the agent event backbone."
  - label: "Event-Driven Architecture — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Event-driven_architecture"
    type: "wikipedia"
    description: "Background on the event-driven architectural style applied here to agent triggering."
---
::

## Related reading

- [Building Multi-Agent Workflows with Temporal](/blog/agentic-ai-systems/07-building-multi-agent-workflows-with-temporal) — previous: durable, workflow-driven agent coordination
- [Long-Running Agent Workflows](/blog/agentic-ai-systems/09-long-running-agent-workflows) — next: designing agent workflows that run for hours or days
- [Agentic AI Systems hub](/systems/agentic-ai) — the hub for the agentic AI series
- [Streaming](/blog/backendengineering/06-streaming) — streaming LLM output, where the pub/sub lesson came from

---

*[← Back to Agentic AI Systems](/categories/agentic-ai-systems)*
