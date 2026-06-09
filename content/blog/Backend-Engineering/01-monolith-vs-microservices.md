---
title: "Monolith vs Microservices"
description: "Tradeoffs and reasoning behind splitting monoliths into microservices."
date: 2026-02-20
category: "backend-engineering"
tags:
  - architecture
  - microservices
draft: false
slug: monolith-vs-microservices
author: Donavan Jones
---

# Monolith vs Microservices

When I started building the backend for my AI-powered Bible study platform, I made a decision that most engineers eventually face: do I start with a single deployable application or split everything into separate services from day one?

I started with a monolith. Then I split it. Here is what I learned.

*Part of the [Backend Engineering series](/categories/backend-engineering).*

## What a Monolith Actually Is

A monolith is a single deployable unit. All of your application logic — user authentication, data access, business rules, background jobs — lives in one codebase and deploys together. One `git push`, one build, one running process.

This gets a bad reputation, but for most projects early on, a monolith is the right choice. You get:

- **Simple local development**: one process to run, one set of logs to read
- **Easy refactoring**: renaming a function or moving a module requires no network contracts
- **Low operational overhead**: one service to monitor, one deploy pipeline to maintain
- **Transactional integrity**: database operations that span multiple domains are trivial

The problem is not that monoliths are bad. The problem is that they become painful in specific, predictable ways as a system grows.

## When a Monolith Starts to Hurt

My platform has several distinct concerns: user management, Bible text retrieval, AI inference, embeddings, search, and audio narration. In a monolith, all of these share the same process and the same database.

The friction showed up in three places:

**Deployment coupling.** When I updated the AI inference logic, I had to redeploy everything — including the authentication service that had not changed in weeks. A bad deploy touched parts of the system that were completely unrelated.

**Scaling mismatch.** The embedding generation pipeline is computationally expensive and bursty. The user authentication service is lightweight and constant. In a monolith, you scale both together. Adding more instances to handle embedding load also adds unnecessary capacity for auth — and cost.

**Team and codebase isolation.** As the surface area grew, understanding the full system became harder. Changes in one domain would unexpectedly break behavior in another. The boundaries between concerns were implicit rather than enforced.

## The Move to Microservices

I broke out services along domain boundaries. Each service owns its own data, exposes a clear API, and deploys independently. The main splits I made:

| Service | Responsibility |
|---|---|
| Auth Service | JWT issuance, session management, user identity |
| Bible Text Service | Verse retrieval, book/chapter indexing, translation management |
| AI Inference Service | LLM prompt execution, response streaming |
| Embedding Service | Vector generation for semantic search |
| Search Service | Vector similarity queries, hybrid retrieval |
| Narration Service | Text-to-speech pipeline, audio storage |

Each service is a separate Node.js application with its own database schema. They communicate over HTTP and an internal message queue for async operations.

## The Real Tradeoffs

Splitting into microservices is not free. I want to be honest about what gets harder.

### Network becomes a first-class concern

In a monolith, calling a function is cheap and reliable. In microservices, every cross-service call is a network request that can fail, time out, or return stale data. You have to handle:

- Retries with exponential backoff
- Circuit breakers to prevent cascade failures
- Distributed tracing to follow a request across services
- Timeouts at every call site

I use structured logging with a shared `requestId` header so I can trace a single user request through five different services. This is manageable, but it is work you do not have in a monolith.

### Transactions across services are painful

In a single database, a transaction is atomic. If anything fails, everything rolls back. Across services with separate databases, there is no such guarantee. I rely on the **saga pattern** for multi-step operations: each step emits an event, and compensating actions undo work if a later step fails.

For example, when a user saves a study note that triggers an embedding update and a narration job, those three operations happen asynchronously. If the narration fails, the embedding and note still exist. The system has to be designed to tolerate this kind of partial state.

### Local development gets more complex

Running five services locally requires either Docker Compose or careful port management. I use Docker Compose with a shared network so services can discover each other by name. The developer experience is still good, but it is a step up in complexity from `npm run dev`.

### Distributed debugging is slower

When something breaks in a monolith, the stack trace tells you everything. When something breaks across services, you are reading logs from multiple places and reconstructing what happened. I invested early in structured logging and a local log aggregator (Loki + Grafana) to make this tractable.

---

*Explore more articles in the [Backend Engineering series](/categories/backend-engineering).*

---

## The Framework I Use for Deciding

The question is not "monolith or microservices" — it is "where does the pain actually live?"

I use three signals:

1. **Independent scaling needs.** If one part of your system has dramatically different resource requirements than the rest, it is a candidate for extraction.

2. **Independent deployment cadence.** If one team or domain needs to ship multiple times a day while others ship weekly, coupling them in one deployable creates friction.

3. **Clear domain boundaries.** If you can define a service with a single sentence — "this service handles user authentication" — and that boundary rarely changes, it is a good extraction candidate.

If none of these apply, stay in the monolith. Complexity that does not solve a real problem is just debt with extra steps.

## Where I Landed

For my platform, the split was the right call — specifically because AI inference and embedding generation have wildly different scaling profiles than authentication or text retrieval. I can run multiple inference replicas behind a load balancer during heavy usage and scale them back down without touching anything else.

But I extracted services gradually. Auth and Bible text came first because the boundaries were obvious and the payoff was immediate. Narration and search came later, once the pain of having them in the monolith was concrete rather than theoretical.

The general pattern: start with a modular monolith where domain boundaries are respected in code even if they are not enforced by network. When a specific service needs to scale, deploy, or evolve independently — extract it then.

Do not split prematurely. Distributed systems are hard. Make the complexity earn its place.

---

*[← Back to Backend Engineering series](/categories/backend-engineering)*
