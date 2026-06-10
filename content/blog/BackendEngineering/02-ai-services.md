---
title: "AI Services"
description: "Overview of AI services in a microservices backend."
date: 2026-02-27
lastUpdated: "2026-06-09"
category: "backend-engineering"
tags:
  - ai
  - services
draft: false
slug: ai-services
author: Donavan Jones
---

# AI Services

In the previous article I described how I split a monolith into distinct services. The most consequential splits were the AI-specific ones — not because they were technically harder to extract, but because AI services have fundamentally different operational characteristics than everything else in a backend.

Standard backend services are CPU-light, stateless, and fast. An auth service responds in single-digit milliseconds. An AI inference service might take 5–30 seconds, consume a GPU, stream tokens back incrementally, and cost real money per request. Treating these the same way is how you build systems that are either expensive or broken.

This article covers how AI services fit into a distributed backend, what makes them different, and the design patterns I use to make them reliable.

*Part of the [Backend Engineering series](/categories/backend-engineering).*

## The AI Service Landscape

In my platform, "AI services" refers to three distinct concerns, each running as its own deployable:

**Inference Service** — Takes a prompt and returns a completion. This is the core LLM call: user asks a question about a Bible passage, the service builds a context-rich prompt, calls the model, and streams tokens back to the client. This service is stateless per-request but expensive per-call.

**Embedding Service** — Converts text into a high-dimensional vector. Every time a user saves a note, highlights a verse, or a new Bible passage is indexed, this service generates an embedding that gets stored in the vector database. Embeddings power semantic search throughout the platform.

**Moderation / Guardrails Service** — Screens inputs and outputs for content policy violations, theological consistency checks, and prompt injection attempts before they reach inference. Optional in many systems; essential in mine given the religious context and the need to prevent the model from producing outputs that contradict source material.

Each of these services has a different scaling model, cost profile, and failure mode. They need to be designed separately.

## What Makes AI Services Different

### Latency is an order of magnitude higher

A database query takes milliseconds. An LLM completion takes seconds — sometimes tens of seconds for longer responses. This changes everything about how clients interact with the service.

You cannot use the standard request-response pattern and expect a good user experience. A 20-second HTTP request that blocks the UI is not acceptable. The solution is **streaming**: the inference service sends tokens back as they are generated using Server-Sent Events (SSE) or WebSockets, and the client renders them progressively. The user sees the answer building in real time instead of waiting for a spinner.

```
Client → POST /completions (prompt)
Server → 200 OK, Content-Type: text/event-stream
Server → data: {"token": "The"}
Server → data: {"token": " apostle"}
Server → data: {"token": " Paul"}
...
Server → data: [DONE]
```

This means the inference service is long-lived per request. Connection management, backpressure, and client disconnection handling all become real concerns.

### Cost is per-call, not per-instance

Standard services cost money when you run them. AI services cost money every time they do anything. A single LLM call to generate a study guide section might cost $0.05–0.20 depending on the model and token count. At scale, uncontrolled inference spend will ruin your unit economics before you notice.

I handle this with three controls:

**Token budgeting.** Every prompt is constructed with a maximum context window in mind. Retrieved passages, conversation history, and system instructions are trimmed to fit within a defined token budget. I never let user-supplied input drive unbounded token consumption.

**Request caching.** Identical or near-identical prompts (common for standard study questions against the same verse) return cached completions. I cache at the prompt hash level with a TTL that balances freshness against cost.

**Rate limiting per user.** Each user has a daily inference quota enforced at the API gateway before the request reaches the inference service. Hard quota = request rejected. Soft quota = downgraded to a smaller model.

### Failures are probabilistic, not binary

A database either returns data or it throws an error. An LLM returns something — but that something might be wrong, hallucinated, off-topic, or in the wrong format. This is a different kind of failure that standard error handling does not address.

My inference service wraps every response in a validation layer before it leaves the service boundary:

- **Schema validation**: if the prompt asked for a JSON-structured response, parse and validate it before returning it downstream
- **Grounding check**: compare citations in the response against the retrieved source passages to detect hallucinated verse references
- **Retry on malformed output**: if the model returns unparseable JSON, retry with an explicit correction instruction before surfacing an error to the client

This validation happens inside the inference service, not in the calling service. Every consumer gets a clean, validated response or an explicit error — never raw, unverified model output.

## Service Architecture in Practice

Here is how a typical user request flows through the AI services on my platform:

```
User asks: "What does Romans 8:28 mean in context?"

1. API Gateway
   → Auth check (JWT validation)
   → Rate limit check (user quota)
   → Route to /ai/completions

2. Moderation Service
   → Screen input for policy violations
   → Check for prompt injection patterns
   → Pass or reject

3. Inference Service
   → Retrieve relevant passages via Embedding + Search services
   → Build prompt with system instructions + retrieved context
   → Call LLM with streaming enabled
   → Validate response (citations, schema, grounding)
   → Stream tokens back through API Gateway to client

4. Post-processing (async, after response sent)
   → Log request/response pair for review
   → Update user's reading history
   → Trigger embedding update if new study note created
```

Steps 1–3 are synchronous and in the critical path. Step 4 is async via a message queue — it does not block the user's response.

## Inter-Service Communication

AI services communicate with the rest of the backend in two ways depending on whether the operation is latency-sensitive.

**Synchronous HTTP** for anything in the request path. The inference service calls the embedding service to vectorize the user's query, then calls the search service to retrieve relevant passages. These happen sequentially within a single inference request. I set aggressive timeouts (2s for embeddings, 3s for search) and fall back to a degraded experience — answering from general knowledge without retrieved context — rather than timing out the whole request.

**Async message queue** for anything that does not need to be in the critical path. After a response is sent, the inference service publishes a `completion.finished` event. Downstream consumers (logging, analytics, note-saving, narration triggers) process it independently. If one of them fails, it does not affect the response the user already received.

---

*Explore more articles in the [Backend Engineering series](/categories/backend-engineering).*

---

## Model Selection as a Service Concern

Not every request needs the most capable — and most expensive — model. I treat model selection as a first-class routing decision inside the inference service, not something callers control directly.

The inference service selects a model based on task type, user tier, and current system load:

| Task | Default Model | Fallback |
|---|---|---|
| Simple verse lookup / definition | Small fast model | — |
| Study guide generation | Large capable model | Medium model |
| Theological deep dive | Large capable model | Reject if degraded |
| Summarization | Medium model | Small model |

This keeps callers simple — they describe what they want, not which model to use — and lets me change model routing without touching any calling service.

## Observability

AI services need specialized observability on top of standard metrics. Beyond latency and error rate, I track:

- **Token usage per request**: both prompt tokens and completion tokens, tagged by task type and user tier
- **Cache hit rate**: what fraction of inference requests were served from cache
- **Model fallback rate**: how often the system degraded to a smaller model
- **Validation failure rate**: how often model outputs failed schema or grounding checks before reaching the user
- **Cost per user cohort**: daily spend broken down by feature usage

Without this instrumentation, you cannot tell whether the system is working well or just working. A 99% success rate on inference sounds good until you realize 1% of responses are grounded hallucinations that passed validation.

## What I Would Do Differently

If I were starting over, I would introduce the **embedding service earlier**. I built it after the inference service and had to retrofit semantic retrieval into prompts that were already in production. The retrieval quality improvement was significant enough that I should have treated it as foundational from day one.

I would also set up cost monitoring on day one rather than week four. The first month of development had several experiments that generated significant API spend that I only noticed after the fact. A daily budget alert with a hard cutoff would have caught it immediately.

AI services are not special — they are just services with unusual performance characteristics. Design them like any other service: clear boundaries, explicit contracts, graceful degradation, and observable internals. The model is an implementation detail inside the service, not something the rest of the system should know about.

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "Retrieval-Augmented Generation — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation"
    type: "wikipedia"
    description: "According to this overview, RAG retrieves relevant context before generation — the architectural pattern the inference service implements for grounded responses."
  - label: "Software as a Service — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Software_as_a_service"
    type: "wikipedia"
    description: "Overview of service-oriented architecture — the model for designing AI inference as a standalone service with clear boundaries and observable internals."
  - label: "Rate Limiting — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Rate_limiting"
    type: "wikipedia"
    description: "According to this overview, rate limiting controls resource consumption — essential for AI services where a single misbehaving request can generate significant unexpected cost."
  - label: "Hallucination (Artificial Intelligence) — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)"
    type: "wikipedia"
    description: "Definition of AI hallucination — the failure mode that output validation and citation grounding in the inference service are designed to detect and prevent."
---
::

---

*[← Back to Backend Engineering series](/categories/backend-engineering)*
