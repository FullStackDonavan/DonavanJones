---
title: "Batching"
description: "Batching strategies for AI inference and backend services."
date: 2026-04-03
lastUpdated: "2026-06-09"
category: "backend-engineering"
tags:
  - batching
  - ai
draft: false
slug: batching
author: Donavan Jones
---

# Batching

Batching is one of the highest-leverage optimizations in an AI backend. It appears in every layer of this platform — embedding generation, GPU inference, database writes, notification delivery, API calls — and the version in each layer looks slightly different. The underlying principle is always the same: fixed overhead paid once across many units of work is cheaper than fixed overhead paid once per unit.

Earlier articles touched on batching in specific contexts: adaptive batching in the embedding service, dynamic batching for GPU workloads, bulk writes in the job queue. This article pulls those threads together into a complete treatment: where batching applies, how to implement it correctly, and how to tune the tradeoffs between latency and throughput that batching always introduces.

*Part of the [Backend Engineering series](/categories/backend-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every backend engineering breakdown in this series."
destinationUrl: "/categories/backend-engineering"
---
::

## The Fundamental Economics

Every operation has two cost components: fixed overhead and variable cost per unit.

Fixed overhead is paid regardless of how many units are processed — establishing a network connection, serializing a request, scheduling a thread, loading a model for inference. Variable cost scales with work — tokens processed, bytes transferred, rows written.

Without batching, every unit pays the full fixed overhead:

```
10 requests × (50ms overhead + 2ms/unit) = 10 × 52ms = 520ms total
```

With batching, 10 units share one overhead payment:

```
1 batch of 10 × (50ms overhead + 2ms/unit × 10) = 50ms + 20ms = 70ms total
```

The same 10 units take 70ms batched versus 520ms unbatched. Throughput increases by 7×. This is not a minor optimization — it is a qualitative change in what the system can handle.

The catch: batching introduces latency for individual units. The first request in a batch waits for the batch to fill before being processed. A request that arrives when the batch is empty waits up to the maximum batch window before seeing any work done. This is the central tradeoff: throughput versus individual request latency.

## Where Batching Applies on This Platform

Batching is relevant at every layer that has non-trivial fixed overhead per operation:

| Layer | What Gets Batched | Fixed Overhead Eliminated |
|---|---|---|
| Embedding API | Text → vector requests | HTTP round-trip, API auth, request parsing |
| GPU inference | Model forward passes | CUDA kernel launch, tensor allocation |
| Database writes | INSERT/UPDATE operations | Transaction begin, fsync, index update |
| Notification delivery | Push notifications | APNs/FCM connection establishment |
| Vector store writes | Embedding upserts | Network round-trip, index update |
| LLM prompt caching | Shared prompt prefixes | Token re-processing cost |

Each layer requires different batching mechanics because the shape of the overhead differs.

## Batch Window Design

The batch window is the core design decision: how long do you hold incoming requests before dispatching a batch?

There are three window strategies:

**Size-triggered**: dispatch when the batch reaches N items. Simple, predictable throughput, but individual request latency is unbounded when load is low — if the batch never fills, no request is ever dispatched.

**Time-triggered**: dispatch every T milliseconds regardless of batch size. Predictable latency ceiling, but during high load you may dispatch small batches when waiting for a larger one would improve throughput.

**Hybrid (size or time, whichever comes first)**: dispatch when batch reaches N items OR when T milliseconds have elapsed since the first item arrived. This is what I use everywhere. It bounds latency at low load (the timer fires) and maximizes throughput at high load (the size limit fires before the timer).

```typescript
class BatchWindow<T, R> {
  private batch: Array<{ item: T; resolve: (r: R) => void; reject: (e: Error) => void }> = [];
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private readonly maxSize: number,
    private readonly maxWaitMs: number,
    private readonly process: (items: T[]) => Promise<R[]>
  ) {}

  async add(item: T): Promise<R> {
    return new Promise((resolve, reject) => {
      this.batch.push({ item, resolve, reject });

      if (this.batch.length >= this.maxSize) {
        this.flush();
      } else if (!this.timer) {
        this.timer = setTimeout(() => this.flush(), this.maxWaitMs);
      }
    });
  }

  private async flush() {
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    const current = this.batch.splice(0, this.maxSize);
    if (current.length === 0) return;

    try {
      const results = await this.process(current.map(e => e.item));
      current.forEach((e, i) => e.resolve(results[i]));
    } catch (err) {
      current.forEach(e => e.reject(err as Error));
    }
  }
}
```

This implementation is reusable across embedding, GPU inference, and vector store writes. The caller receives a promise that resolves when the batch containing their item completes. From the caller's perspective, it looks like a normal async function call — the batching is invisible.

## Tuning Batch Parameters

`maxSize` and `maxWaitMs` require empirical tuning against the specific workload. The right values depend on the overhead characteristics of the operation and the latency requirements of the caller.

**Embedding API** (`maxSize: 100`, `maxWaitMs: 20ms`)

The embedding API charges per token and has a fixed HTTP overhead of ~40ms. A batch of 100 texts amortizes that overhead across 100 results. The 20ms window keeps individual request latency below 60ms (20ms wait + ~40ms API call), which is acceptable for both real-time queries and background indexing.

**GPU inference reranker** (`maxSize: 32`, `maxWaitMs: 20ms`)

GPU kernels have significant launch overhead relative to execution time for small models. Batch size is limited by VRAM — above 32 candidates, activation memory approaches the slice ceiling. At 20ms window, most user-triggered searches arrive as part of a batch during normal load, keeping GPU utilization high without sacrificing p95 latency.

**Vector store upserts** (`maxSize: 200`, `maxWaitMs: 100ms`)

Qdrant accepts bulk upsert payloads. The overhead per upsert request is dominated by network round-trip and index update. Background indexing is not latency-sensitive (100ms wait is fine), and large batches significantly reduce the number of network calls during bulk operations. For real-time single-note saves, the 100ms window means a user waits up to 100ms before their note appears in search — acceptable.

**Database writes** (`maxSize: 500`, `maxWaitMs: 50ms`)

Postgres transactions have fsync overhead that dominates write cost at low volumes. A single `INSERT ... VALUES ($1, $1), ($2, $2), ...` with 500 rows costs roughly the same as 5 rows in terms of I/O — the WAL write is batched at the filesystem level regardless. For audit logging and analytics writes that do not need to be visible in real time, 50ms windows with large batch sizes are cost-free in terms of user experience.

## Partial Failure Handling

When a batch fails, what happens to the individual requests inside it?

The naive approach — reject every request in the batch on any error — is overly conservative. A single malformed item in the embedding API request should not cause 99 correctly-formed items to fail. The API returns an error for the whole batch, but that error is often caused by one problematic input.

My strategy varies by operation type:

**Atomic operations** (database transactions, vector store upserts): fail the whole batch and let each caller retry individually. These operations either succeed for all items or fail for all items — partial success is not possible at the operation level.

**Independent operations** (embedding API calls, notification delivery): on batch failure, split the batch in half and retry each half independently. This binary search approach isolates the failing item(s) without requiring individual retries for every item in a large batch.

```typescript
async function batchWithFallback<T, R>(
  items: T[],
  process: (batch: T[]) => Promise<R[]>,
  processOne: (item: T) => Promise<R>
): Promise<R[]> {
  try {
    return await process(items);
  } catch {
    if (items.length === 1) {
      // Base case: single item failed, return the error for this item
      return [await processOne(items[0]).catch(e => { throw e; })];
    }
    // Recursive split: try each half independently
    const mid = Math.floor(items.length / 2);
    const [left, right] = await Promise.allSettled([
      batchWithFallback(items.slice(0, mid), process, processOne),
      batchWithFallback(items.slice(mid), process, processOne),
    ]);
    // merge results, propagating individual failures
    return [
      ...(left.status === "fulfilled" ? left.value : items.slice(0, mid).map(() => { throw left.reason; })),
      ...(right.status === "fulfilled" ? right.value : items.slice(mid).map(() => { throw right.reason; })),
    ];
  }
}
```

This finds the failing items in O(log n) retries rather than O(n) individual retries.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how this fits into the production backend system it was built for."
destinationUrl: "/systems/backend"
---
::

---

*Explore more articles in the [Backend Engineering series](/categories/backend-engineering).*

---

## Batching and Request Ordering

A subtle hazard: batching can reorder operations in ways that violate expected consistency.

Consider a user who saves a note (triggers an embedding upsert) and then immediately searches for it. The embedding goes into the batch window. The search fires before the batch flushes. The note is not yet in the vector index. The search returns nothing. The user thinks search is broken.

This read-your-writes problem appears whenever batching adds delay to a write that a subsequent read depends on. There are three solutions:

**Synchronous write for high-priority items.** Skip the batch window for writes that are immediately user-visible. The user's own note saves bypass batching — their embedding is written synchronously. Background reindexing uses batching. The distinction is whether the user is waiting for the result.

**Wait for flush before confirming.** The API response for a note save does not return until the embedding batch containing that note has flushed and the upsert confirmed. The user sees a slightly slower save but gets read-your-writes consistency.

**Optimistic UI with eventual sync.** Return the note immediately to the UI and accept that it may not appear in search for up to one batch window. Show the note in search results from the local state until the index catches up. This is the most complex approach and most appropriate for high-frequency updates where the UI is already managing local state.

I use the first approach — synchronous write for interactive user content, batching for background work. The line between "interactive" and "background" is whether the user is waiting for the result of the write.

## Batching Across Services

Batching does not only apply within a service — it can apply at the inter-service boundary.

When the agent orchestrator runs a fan-out step generating five study guide sections simultaneously, each section generation triggers its own retrieval call to the vector search service. Instead of five separate search requests, the orchestrator batches them:

```typescript
// Instead of this:
const results = await Promise.all(sections.map(s => searchService.search(s.query)));

// Do this:
const results = await searchService.searchBatch(sections.map(s => s.query));
```

The search service receives one batch request, runs five concurrent queries against the vector store, and returns all results together. The overhead of five HTTP requests and five connection setups is replaced by one. The vector store sees five queries, which can be executed in parallel internally — the batch does not serialize them.

This pattern applies wherever a caller makes multiple requests to the same service in quick succession. It requires the callee to expose a batch API, but the investment is usually worth it for high-throughput internal service calls.

## Monitoring Batch Efficiency

The metrics that reveal whether batching is working:

**Average batch fill rate** — what fraction of the max batch size is used on average. A fill rate below 20% means the timer is firing before the batch fills, and the max size is over-provisioned for current load. A fill rate above 95% consistently means the batch size is the bottleneck — increasing it would improve throughput.

**Batch wait time** — how long items wait in the batch window before being dispatched. At high load, this approaches zero (batches fill immediately). At low load, this approaches `maxWaitMs`. The p95 wait time tells you what most users actually experience.

**Throughput vs. single-item baseline** — compare the time to process N items via the batch endpoint versus N individual calls. This ratio should be close to the theoretical speedup based on fixed overhead fraction. If the actual speedup is significantly lower than expected, the fixed overhead estimate was wrong or there is contention inside the batch processor.

```sql
SELECT
  DATE_TRUNC('hour', created_at)  AS hour,
  AVG(batch_size)                  AS avg_batch_size,
  MAX(batch_size)                  AS max_batch_size,
  AVG(wait_time_ms)                AS avg_wait_ms,
  AVG(processing_time_ms)          AS avg_processing_ms,
  COUNT(*)                         AS batch_count
FROM batch_metrics
WHERE service = 'embedding'
GROUP BY 1
ORDER BY 1 DESC
LIMIT 24;
```

**Cost per unit** — for paid APIs (embedding, inference), cost per unit should decrease as batching improves. If cost per embedding is the same with batching as without, the batch API is not being used correctly or the provider does not discount batch requests.

::CtaContactWork
---
buttonText: "Let's Talk About Your Throughput Strategy"
supportingCopy: "Designing batching or throughput optimizations for your own backend? Let's talk through the architecture."
destinationUrl: "/hire-me"
---
::

## When Not to Batch

Batching is not always the right choice.

**When latency is the only constraint.** A user-triggered search query is waiting. The query embedding needs to be generated as fast as possible. Adding it to a batch window introduces up to `maxWaitMs` of extra latency for no throughput benefit — there is only one item. For singleton, latency-critical operations, skip the batch window and call the API directly.

**When order matters strictly.** Some operations must be applied in sequence and cannot be reordered or grouped. A series of append operations to a user's reading progress must be written in order. Batching writes from different users together is fine; batching writes from the same user in a way that could reorder them is not.

**When the overhead is not actually fixed.** If the operation's cost is purely variable — proportional to the number of items with no meaningful fixed component — batching adds complexity without reducing cost. Batching is only valuable when there is a fixed overhead to amortize.

The pattern to avoid is reflexive batching — adding a batch window everywhere because it sounds like a good idea. Measure the fixed overhead of the operation first. If it is small relative to variable cost, batching will not help much and will add latency and complexity for minimal gain.

Batching is a tool for a specific problem. When the problem is there, it is one of the most impactful optimizations available. When it is not, it is just complexity.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The API Boilerplate"
  supportingCopy: "Get the Production AI API Boilerplate — FastAPI starter, auth, vector search, embedding services, Docker, and CI/CD examples ($49)."
  destinationUrl: "/products/production-ai-api-boilerplate"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Latency Optimization"
  supportingCopy: "Continue with \"Latency Optimization\" to see how batching fits into the broader set of techniques for making backend services feel fast."
  destinationUrl: "/blog/backendengineering/15-latency-optimization"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get new backend engineering breakdowns delivered before they're public."
  ---
  :::
::

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "Batch Processing — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Batch_processing"
    type: "wikipedia"
    description: "According to this overview, batch processing groups multiple units of work to amortize fixed overhead — the core principle behind the adaptive batch windows used for embedding, GPU inference, and vector store writes."
  - label: "Throughput — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Throughput"
    type: "wikipedia"
    description: "Overview of throughput as a system metric — the dimension that batching optimizes by maximizing the number of items processed per unit of fixed overhead."
  - label: "Amortized Analysis — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Amortized_analysis"
    type: "wikipedia"
    description: "According to this overview, amortized analysis measures average cost per operation across a sequence — the theoretical basis for why batching reduces per-item cost when fixed overhead dominates variable cost."
  - label: "Latency (Engineering) — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Latency_(engineering)"
    type: "wikipedia"
    description: "Overview of latency as a system property — the dimension that batching trades against throughput, motivating the hybrid size-or-time batch window strategy described in this article."
---
::

---

*[← Back to Backend Engineering series](/categories/backend-engineering)*
