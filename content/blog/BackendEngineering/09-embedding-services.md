---
title: "Embedding Services"
description: "Building and scaling embedding services in backend systems."
date: 2026-03-20
lastUpdated: "2026-06-09"
category: "backend-engineering"
tags:
  - embeddings
  - ai
draft: false
slug: embedding-services
author: Donavan Jones
---

# Embedding Services

An earlier article in this series introduced the embedding service: what embeddings are, the basic API design, batching, caching, and what content gets embedded. That article answered "what does the service do." This one answers "what does it take to run it reliably at scale."

Running an embedding service in production is different from building one. The design that works for 10,000 vectors during development starts showing cracks at 500,000. Reindexing runs that took minutes start taking hours. Model upgrades that seemed straightforward become coordinated migrations. Subtle inconsistencies accumulate between what is indexed and what is actually in the database.

This article covers the operational and engineering concerns that only surface once the service is carrying real load.

*Part of the [Backend Engineering series](/categories/backend-engineering).*

## API vs Self-Hosted Models

The first decision when building an embedding service is where the model runs. There are two options:

**Managed API** (OpenAI, Anthropic, Cohere) — you send text over HTTPS and receive vectors back. No infrastructure to run, no GPU to provision, no model to update. You pay per token.

**Self-hosted** (sentence-transformers, custom fine-tuned models) — you run the model yourself on CPU or GPU hardware. You pay for compute, not per token. Latency is local. Model weights are yours.

I use a managed API (OpenAI's `text-embedding-3` family) and have no plans to self-host. The reasoning:

| Factor | Managed API | Self-Hosted |
|---|---|---|
| Operational cost | Per-token pricing | Fixed compute cost |
| Break-even volume | ~50M tokens/month | — |
| Latency | 50–150ms network | 5–30ms local |
| Model quality | State-of-the-art, updated | Depends on maintenance |
| Availability | Provider SLA | Your infrastructure SLA |
| Customization | None (fine-tuning limited) | Full control |

At my current volume, the managed API is significantly cheaper than the GPU instance that would be needed to run a comparable model. Self-hosting becomes economically interesting above roughly 50 million tokens per month — which is the point where fixed compute costs become less than per-token API spend at current pricing.

The one scenario where I would self-host earlier is if the domain required a fine-tuned model that the managed APIs cannot provide. Biblical Hebrew, Koine Greek, and theological Latin are underrepresented in general-purpose embedding models. If retrieval quality on ancient language content degrades noticeably, a domain-fine-tuned self-hosted model becomes worth the operational cost.

## Throughput Architecture

The embedding service is not CPU-bound or memory-bound — it is I/O-bound. Most of each request's time is spent waiting for the upstream API response. This means the service can handle high concurrency on modest hardware, but the concurrency model needs to be designed carefully.

The service runs as a Node.js process, which handles I/O concurrency natively through the event loop. Multiple embedding requests can be in-flight simultaneously without blocking each other. The practical limit is the upstream API's rate limit, not the service's hardware capacity.

### Adaptive Batching

The batch endpoint introduced in article 04 accepts an array of texts. But callers do not always know the optimal batch size. A caller submitting 1,000 texts should not have to think about whether to split that into batches of 100 or 200.

The service handles batching internally through an adaptive batcher. Incoming single requests are held in a short buffer (up to 20ms) and flushed as a batch when either the buffer is full or the timer fires:

```typescript
class AdaptiveBatcher {
  private queue: PendingRequest[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private readonly MAX_BATCH = 100;
  private readonly FLUSH_INTERVAL_MS = 20;

  async embed(text: string): Promise<number[]> {
    return new Promise((resolve, reject) => {
      this.queue.push({ text, resolve, reject });
      if (this.queue.length >= this.MAX_BATCH) {
        this.flush();
      } else if (!this.flushTimer) {
        this.flushTimer = setTimeout(() => this.flush(), this.FLUSH_INTERVAL_MS);
      }
    });
  }

  private async flush() {
    if (this.flushTimer) { clearTimeout(this.flushTimer); this.flushTimer = null; }
    const batch = this.queue.splice(0, this.MAX_BATCH);
    if (batch.length === 0) return;

    try {
      const vectors = await callEmbeddingAPI(batch.map(r => r.text));
      batch.forEach((r, i) => r.resolve(vectors[i]));
    } catch (err) {
      batch.forEach(r => r.reject(err));
    }
  }
}
```

This turns individually-submitted requests into efficient batches automatically. During high load, batches fill quickly and flush at the size limit. During low load, they flush after the timer regardless of fill level. Callers get a simple single-text API while the service maximizes throughput.

### Rate Limit Management

The upstream API has a rate limit expressed in tokens per minute and requests per minute. Exceeding it produces 429 errors. Retrying naively after a 429 can cause cascading retries that keep the service over the rate limit.

I track consumed tokens in a sliding window and pre-emptively throttle before hitting the limit rather than reacting after:

```typescript
class RateLimiter {
  private readonly LIMIT_TPM = 1_000_000;
  private readonly WINDOW_MS = 60_000;
  private usage: { tokens: number; timestamp: number }[] = [];

  async waitForCapacity(tokens: number): Promise<void> {
    const now = Date.now();
    this.usage = this.usage.filter(u => now - u.timestamp < this.WINDOW_MS);
    const used = this.usage.reduce((sum, u) => sum + u.tokens, 0);

    if (used + tokens > this.LIMIT_TPM * 0.9) { // throttle at 90%
      const wait = this.WINDOW_MS - (now - this.usage[0].timestamp);
      await delay(wait);
    }

    this.usage.push({ tokens, timestamp: Date.now() });
  }
}
```

The 90% threshold gives headroom. Hitting 90% of the rate limit and pausing is far better than hitting 100%, getting a 429, waiting for the retry-after window, and potentially losing the batch.

---

*Explore more articles in the [Backend Engineering series](/categories/backend-engineering).*

---

## Consistency: Keeping the Index in Sync

The hardest problem in running an embedding service is not generating vectors — it is ensuring the vectors in the index accurately reflect the current state of the source data.

Several things can cause the index to drift out of sync with reality:

- A note is updated but the old embedding is not replaced
- A verse translation is corrected but the verse was not reindexed
- An embedding job fails mid-run and leaves partial results
- A reindex is triggered but the old vectors are not cleaned up

### Write-Through Embedding

For user-generated content (notes, highlights, annotations), I use a write-through pattern: when content is written to the primary database, an embedding is generated and written to the vector store as part of the same logical operation — not as a fire-and-forget afterthought.

```typescript
async function saveNote(userId: string, noteContent: string) {
  const [note, embedding] = await Promise.all([
    db.notes.insert({ userId, content: noteContent }),
    embeddingService.embed(noteContent),
  ]);

  await Promise.all([
    vectorStore.upsert({ id: note.id, vector: embedding, payload: { userId, noteId: note.id } }),
  ]);

  return note;
}
```

Both operations run in parallel. If the vector store write fails, the note write is still committed (the note is not lost) and the failure is queued for retry. A background consistency job runs hourly and finds notes without a corresponding vector, reembedding any that are missing.

This is not a two-phase commit — I do not want strong transactional guarantees between Postgres and Qdrant. I want eventual consistency with a short convergence window and an observable gap metric.

### Consistency Auditing

A weekly consistency audit compares the set of content IDs in the primary database against the set of IDs in the vector store. Any ID present in one but not the other is a consistency violation. The audit produces a report with:

- Count of missing vectors (content without an embedding)
- Count of orphaned vectors (embedding without corresponding content — typically from deleted records)
- Oldest unresolved inconsistency (a proxy for how long the gap has been there)

Missing vectors are queued for reembedding. Orphaned vectors are deleted. The audit gives a weekly snapshot of index health without requiring perfect synchronization on every write.

## Model Migration

Switching embedding models is the most disruptive operational event in the embedding service lifecycle. Old vectors are incompatible with new model outputs. The entire index must be rebuilt, and the new index must replace the old one without downtime.

My migration process:

**Phase 1 — Shadow index.** Start writing to both the old and new index simultaneously. New and updated content gets embedded with both models. The old index remains the source of truth for reads.

**Phase 2 — Bulk backfill.** The async pipeline reembeds all existing content with the new model into the new index. This runs at off-peak hours to avoid competing with real-time traffic for rate limit capacity.

**Phase 3 — Validation.** Run the evaluation suite (covered below) against both indexes. Confirm the new index meets or exceeds the old index's recall and precision scores.

**Phase 4 — Cutover.** Update the search service to read from the new index. Keep the old index live for 48 hours as a rollback target.

**Phase 5 — Cleanup.** Delete the old index and stop dual-writing.

The shadow write in Phase 1 ensures that by the time the bulk backfill finishes, the new index is nearly complete — only the oldest content needs to be reembedded. The gap between shadow start and backfill completion is small.

Version naming is critical throughout. Collections in Qdrant are named `{content_type}_{model_version}` — `bible_verses_te3s` for `text-embedding-3-small`, `bible_verses_te3l` for `text-embedding-3-large`. The search service reads its target collection name from config, not from code, so the cutover is a config update with no deploy.

## Evaluating Embedding Quality

You cannot tell whether your embeddings are good by looking at them. You need an evaluation set.

I maintain a ground-truth evaluation set of 300 query/result pairs curated from actual user searches and annotated manually:

```json
{
  "query": "God's faithfulness even when we are unfaithful",
  "relevant_passages": ["2tim_2_13", "lam_3_22", "rom_3_3", "ps_89_33"],
  "irrelevant_passages": ["gen_1_1", "rev_22_16"]
}
```

Against this set, I measure:

**Recall@5** — what fraction of ground-truth relevant passages appear in the top 5 results. My target is ≥ 85%.

**MRR (Mean Reciprocal Rank)** — the average reciprocal rank of the first relevant result. Measures whether the best result is at position 1 or buried at position 4.

**Precision@5** — what fraction of the top 5 results are actually relevant. Complements recall by penalizing result sets that are broad but imprecise.

This evaluation runs automatically after every model migration and weekly in production. A score drop of more than 3 points on any metric triggers a review before any further changes are made to the indexing pipeline.

Building the ground-truth set is the part that takes real time — it required manually reviewing several hundred search results over a few sessions. But it is the only reliable signal you have for whether the embedding pipeline is working. Every other metric tells you the service is running; only the evaluation set tells you the service is working.

## Cost Attribution

Embedding costs are real and unevenly distributed. The bulk of spending comes from two activities: the initial indexing of the full Bible corpus and study notes, and real-time query embedding.

I tag every embedding API call with a cost center:

```typescript
await embeddingService.embed(text, {
  source: "user_query",       // or "note_index", "verse_index", "reindex"
  userId: session.userId,
  taskId: job?.id,
});
```

The embedding service logs token counts tagged by source. This feeds a cost breakdown dashboard that shows, per day:

- What fraction of embedding spend comes from indexing vs. queries
- Which users or jobs drove the most embedding spend
- Whether a reindex job is running and consuming unusual budget

Without this attribution, a runaway reindex job looks identical to a sudden spike in user activity. With it, the cause is immediately obvious.

## What Running It Taught Me

The embedding service looks simple from the outside — send text, get vector — but it is one of the most operationally interesting services in the backend. The statefulness of the vector index, the irreversibility of model migrations, the invisibility of quality degradation, and the long-tail cost of bulk operations all require deliberate design.

The patterns that matter most in practice: write-through consistency with a background auditor, adaptive batching to maximize throughput without overwhelming rate limits, evaluation-first model migrations, and cost attribution by source. None of these are hard individually. Missing any one of them will eventually produce a problem that is harder to diagnose than it needed to be.

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "Word Embedding — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Word_embedding"
    type: "wikipedia"
    description: "Overview of embedding model architecture — the technology the embedding service wraps with batching, caching, rate limiting, and consistency auditing."
  - label: "MTEB: Massive Text Embedding Benchmark (Muennighoff et al., 2022)"
    url: "https://doi.org/10.48550/arXiv.2210.07316"
    type: "doi"
    description: "According to this benchmark, embedding model performance varies significantly by task — the basis for model selection decisions and evaluation methodology described in this article."
  - label: "Eventual Consistency — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Eventual_consistency"
    type: "wikipedia"
    description: "The consistency model used between Postgres and the vector store — understanding eventual consistency clarifies why a background auditor rather than two-phase commit is the right architecture."
  - label: "Rate Limiting — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Rate_limiting"
    type: "wikipedia"
    description: "According to this overview, rate limiting controls throughput to prevent exceeding API quotas — the proactive throttling strategy used to avoid 429 errors from the embedding API."
---
::

---

*[← Back to Backend Engineering series](/categories/backend-engineering)*
