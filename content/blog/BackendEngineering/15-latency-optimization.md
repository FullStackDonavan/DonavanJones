---
title: "Latency Optimization"
description: "Optimizing latency in backend and AI microservices."
date: 2026-04-06
lastUpdated: "2026-06-09"
category: "backend-engineering"
tags:
  - latency
  - optimization
draft: false
cluster: "backend-engineering"
slug: latency-optimization
author: Donavan Jones
---

# Latency Optimization

Latency is the user experience metric that everything else is in service of. A platform with perfect accuracy, comprehensive content, and flawless reliability feels broken if responses take ten seconds. Users do not wait — they leave, or worse, they stay but trust the platform less every time they notice the delay.

This platform has two distinct latency profiles that need different approaches. Interactive requests — a user asking a question about a passage, searching for related verses, loading their study notes — have hard latency budgets in the hundreds of milliseconds. AI-mediated requests — streaming a study guide answer, generating a multi-section commentary — have softer budgets measured in seconds, where time-to-first-token matters more than time-to-last.

This article covers the specific techniques I use across the stack to hit those budgets: where time actually goes in a request, the high-leverage optimizations I reached for first, and the lower-leverage work I did once the easy wins were exhausted.

*Part of the [Backend Engineering series](/categories/backend-engineering).*

## Measuring Before Optimizing

The first rule of latency optimization is measure before you change anything. Intuitions about where time is spent are wrong more often than right. The database query you were sure was the bottleneck turns out to take 4ms. The SDK initialization you never thought about takes 40ms on every cold request.

I instrument every request with distributed tracing. Each service adds spans with start and end timestamps for discrete operations. A complete trace for a semantic search request looks like:

```
Total: 187ms
├── Auth middleware          6ms
├── Rate limit check         3ms
├── Query embedding         52ms   ← embedding API call
│   ├── Cache check          1ms   (miss)
│   └── API call            51ms
├── Vector search           38ms
│   ├── ANN query           31ms
│   └── Payload fetch        7ms
├── Reranking               28ms
│   └── Cross-encoder       27ms
├── Response serialization   4ms
└── Network (est.)          56ms
```

This trace shows exactly where the 187ms goes. Without it, I would have guessed "the database" or "the vector search" and been wrong. The actual bottleneck is the embedding API call at 52ms — and that is a cache miss. The same request on a cache hit takes 1ms instead of 51ms, dropping total latency to 137ms.

Distributed tracing at this granularity is the prerequisite for everything that follows. Optimizing without it is guessing.

## Latency Budgets

Before optimizing, set a target. Not "as fast as possible" — a specific number that represents good enough for the user experience you are building.

My budgets by request type:

| Request Type | p50 Budget | p95 Budget | Primary Constraint |
|---|---|---|---|
| Search query | 150ms | 300ms | Embedding + retrieval |
| Verse lookup | 30ms | 80ms | DB query + cache |
| Note save | 80ms | 200ms | DB write + async embed |
| Session resume / load | 120ms | 250ms | Multiple DB reads |
| Streaming first token | 800ms | 2000ms | LLM time-to-first-token |
| Push notification | 500ms | 2000ms | APNs/FCM delivery |

These budgets inform prioritization. If search query p95 is 450ms, closing that 150ms gap matters more than shaving the verse lookup from 30ms to 25ms — the verse lookup is already inside budget. You optimize the things that are over budget, in order of how over they are.

## The High-Leverage Optimizations

### Caching at Every Layer

Caching is the highest-leverage latency optimization available and the one that compounds most dramatically across a request. The search trace above shows a 51ms embedding API call on a cache miss. With a cache hit, that becomes 1ms. That single change cuts the p50 from 187ms to 137ms — a 27% reduction from one fix.

I cache at four layers:

**Embedding cache** — vectors keyed by `hash(text + model)` in Redis. TTL of 30 days for static content (Bible verses), 1 hour for user-generated content. Hit rate for verse queries is near 100% after warm-up.

**Database query cache** — frequently accessed, rarely changing data lives in Redis: user preferences, active sessions, subscription tier, reading plan state. These are read on nearly every request and change at most daily. Without caching, every request hits Postgres for data that has not changed since last week.

**HTTP response cache** — Bible text responses (verse lookup, passage fetch) are cached at the API gateway with a long TTL. The canonical text of Romans 8:28 does not change. These responses can be cached indefinitely and served from memory without touching any service.

**DNS and connection caching** — internal service calls use persistent HTTP/2 connections with connection pooling. Establishing a new TCP connection and TLS handshake to an internal service adds 10–30ms that is entirely avoidable after the first call.

The order matters. Caching database queries before caching embeddings gives smaller gains because the DB queries are already fast. Caching the highest-cost operations first maximizes the return per hour of engineering time.

### Parallelizing Independent Work

Many requests require data from multiple sources that have no dependency on each other. The instinctive implementation is sequential: fetch A, then fetch B, then fetch C. The correct implementation is parallel: fetch A, B, and C simultaneously, then proceed when all three complete.

The search request trace shows this opportunity: after the embedding call, both vector search and (if needed) metadata lookups are independent. Running them sequentially costs 38ms + N for metadata; running them in parallel costs max(38ms, N).

Across a typical multi-source request:

```typescript
// Sequential — 180ms total
const user = await getUser(userId);           // 15ms
const prefs = await getPreferences(userId);   // 12ms
const history = await getHistory(userId);     // 18ms
const notes = await getNotes(userId);         // 22ms

// Parallel — 22ms total (limited by slowest)
const [user, prefs, history, notes] = await Promise.all([
  getUser(userId),
  getPreferences(userId),
  getHistory(userId),
  getNotes(userId),
]);
```

The parallel version is 8× faster for this combination of calls. The gains are real and easy to capture — the work is already written, it just needs to be dispatched concurrently.

The constraint is dependency. If B requires the result of A, they cannot be parallelized. Map the dependency graph before reaching for `Promise.all`. Where there is no dependency, there should be no sequential execution.

### Eliminating Round Trips

Every network round trip between services adds latency. A request that makes five sequential inter-service calls across a 5ms internal network adds 25ms of pure networking overhead — before any work is done. There are three ways to reduce this:

**Colocate services that always call each other.** The embedding service and vector search service are almost always called together in the search path. Running them in the same availability zone, or even the same host, cuts internal network latency to sub-millisecond.

**Denormalize hot data.** The user's subscription tier is checked on every inference request. Rather than fetching it from the auth service on each call, it is included in the JWT claims and validated locally. Zero network calls to get the tier.

**Batch cross-service calls.** Multiple calls to the same service in the same request can be combined into one batch call (covered in the batching article). Five vector search queries become one batch search request — one network round trip instead of five.

The goal is to keep the number of sequential network calls in the critical path as low as possible. Parallel calls do not add latency to each other; sequential calls do.

### Connection Pooling

Opening a new database connection for every request is expensive — 5–15ms per connection establishment, plus memory overhead on the database server. Connection pooling reuses existing connections: the pool maintains N open connections and assigns them to requests on demand.

I use PgBouncer as a connection pooler in front of Postgres in transaction pooling mode. The application maintains a small pool to PgBouncer (10 connections per service instance); PgBouncer maintains a larger pool to Postgres (50 connections). Transaction pooling means a connection is held only for the duration of a transaction, not the full request lifecycle.

Without pooling, a burst of 100 concurrent requests each waiting for a DB connection creates 100 connection establishment attempts — latency spikes, Postgres runs out of connections, requests queue. With pooling, those 100 requests share 50 connections; the average wait for a connection is negligible.

The same principle applies to connections to Redis, Qdrant, and internal services. Persistent connection pools everywhere.

## Medium-Leverage Optimizations

Once the high-leverage work is done, several medium-return optimizations compound the gains.

### Response Payload Sizing

Every byte in a response must be serialized, transmitted, and deserialized. API endpoints that return more data than the client needs waste time on all three. I audit response payloads for unused fields and provide field selection on endpoints that return large objects.

A search result that includes the full verse text, all metadata fields, and embedded cross-references might be 2KB per result × 20 results = 40KB. If the client only needs the verse reference and first 100 characters for a list view, a field-selected response might be 200 bytes per result × 20 results = 4KB — 10× smaller, 10× faster to serialize and transmit.

This is not premature optimization — it is designing the API to send what is asked for, not everything available.

### Database Query Optimization

Slow queries are a latency spike source that is easy to miss when it is rare. A query that takes 4ms 99% of the time and 800ms 1% of the time will not show up in your p50 but will dominate your p99.

I run `pg_stat_statements` in production and review the top 20 slowest queries weekly. The most common patterns I fix:

**Missing index on a filter column.** A query filtering by `user_id` on a table with millions of rows does a sequential scan without an index. Adding the index turns an 800ms query into a 2ms query.

**N+1 queries.** Fetching a list of study notes and then fetching the tag for each note individually produces N+1 queries where one join would do. This shows up in the trace as many fast queries in sequence with total time larger than any individual query.

**Fetching more columns than needed.** `SELECT *` on a table with JSONB columns or large text fields transfers data that the query does not use. Selecting only needed columns reduces I/O.

**Unindexed ORDER BY.** Sorting a result set that is not indexed on the sort column requires loading and sorting all matching rows. Indexing the sort column turns an O(n log n) operation into an index scan.

### Streaming as a Latency Strategy

For AI-generated content, streaming is not just a feature — it is a latency strategy. The user's perceived response time is time-to-first-token, not time-to-last-token. A 15-second complete response that starts streaming immediately after 800ms feels fast. A 3-second complete response that shows nothing until it is done feels slow.

This means the optimization goal for LLM requests is not "reduce total generation time" but "reduce time to first token." The levers for this are:

- **Model selection**: smaller models have lower time-to-first-token at the cost of output quality
- **Prompt length**: longer prompts take longer to process before generation starts; trimming the prompt prefix reduces TTFT
- **Infrastructure**: geographic proximity to the model provider's inference infrastructure reduces network latency on the API call

For my platform, the dominant TTFT driver is prompt length — specifically, the length of the retrieved context prepended before the user's question. A full context window of retrieved passages can add 500–800ms to TTFT compared to a minimal prompt. I cap retrieved context aggressively for real-time queries and allow larger context for async jobs where TTFT does not matter.

---

*Explore more articles in the [Backend Engineering series](/categories/backend-engineering).*

---

## The Long Tail: p99 Latency

Optimizing p50 is straightforward. Optimizing p99 requires finding and fixing a different class of problem — things that happen rarely but when they do, they are very slow.

Common p99 causes in this system:

**GC pauses**: Node.js garbage collection pauses the event loop. Long GC pauses — caused by large object allocations or fragmented heap — can add 50–200ms to any request that happens to run during a pause. I monitor GC pause time and tune the V8 heap size to keep major GC pauses under 10ms.

**Cold connections**: even with connection pooling, occasionally a request gets the cold path — a new connection establishment. This is rare enough to not affect p50 but shows up in p99. Keeping pools warm with periodic health-check queries prevents cold paths.

**Lock contention**: Postgres row locks can cause a fast query to wait for another transaction to finish. This is rare in read-heavy workloads but surfaces under write spikes. Identifying the locked queries via `pg_locks` and adjusting transaction scope usually resolves it.

**Retry amplification**: a request that hits a transient error and retries adds the full retry latency to the p99. Ensuring retries use backoff and are rare (rather than systematic) keeps retry-amplified latency out of the p99.

The discipline for p99 is: take a sample of your slowest 1% of requests, group them by cause, and fix the most common cause. Then repeat. p99 optimization is iterative and requires actual slow request traces, not guesses.

## What Did Not Help

Not every latency optimization pans out. Things I tried that did not move the needle meaningfully:

**HTTP/2 multiplexing for internal calls**: I expected the ability to send multiple requests over one connection without head-of-line blocking to help. With connection pooling already in place, the practical benefit was under 2ms — not worth the added complexity.

**Response compression**: compressing API responses adds CPU time for compression and decompression. For the small payloads in this system (most responses under 10KB), the CPU cost exceeded the transmission savings on local networks. Compression makes sense for large responses over slow networks, not for small payloads over fast internal networks.

**Precomputing study guide outlines**: I considered precomputing outlines for popular passages to reduce async job time. The personalization requirements (user tier, study context, translation preference) meant precomputed outlines were reused so rarely that the storage and compute cost was not justified.

These dead ends are worth tracking. Revisiting them without memory of having tried them wastes time. The answer to "did we try X?" should be in the engineering notes, not in someone's memory.

## The Practical Priority Order

If I were starting fresh and needed to get to good latency quickly:

1. Instrument first — get distributed tracing on every service before touching any code
2. Add caching to the highest-cost uncached operations
3. Parallelize independent operations in the request path
4. Add connection pooling if not already present
5. Fix the top three slow queries from `pg_stat_statements`
6. Enable streaming for any response over ~1 second
7. Audit response payloads for unused data

Steps 1–4 together typically move p50 by 30–50% in a system that has not been latency-optimized before. Steps 5–7 get the remaining gains. Everything after that is long-tail work that delivers diminishing returns.

Latency optimization is never done — the system grows, new bottlenecks emerge, and user expectations rise. But hitting the initial targets with a disciplined approach leaves a system that is fast enough that the work after this is maintenance, not crisis.

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "Latency (Engineering) — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Latency_(engineering)"
    type: "wikipedia"
    description: "According to this overview, latency is the delay between a stimulus and a response — the system property this article systematically reduces through caching, parallelization, and connection pooling."
  - label: "Cache (Computing) — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Cache_(computing)"
    type: "wikipedia"
    description: "Overview of caching as a latency strategy — the highest-leverage optimization category described in this article, spanning embedding caches, query caches, and HTTP response caches."
  - label: "Connection Pool — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Connection_pool"
    type: "wikipedia"
    description: "According to this overview, connection pooling reuses existing database connections to avoid repeated establishment overhead — essential for keeping database latency below 5ms per query."
  - label: "Distributed Tracing — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Tracing_(software)"
    type: "wikipedia"
    description: "Overview of distributed tracing — the observability technique recommended as the first step before any latency optimization, to identify actual bottlenecks rather than guessing."
---
::

---

*[← Back to Backend Engineering series](/categories/backend-engineering)*
