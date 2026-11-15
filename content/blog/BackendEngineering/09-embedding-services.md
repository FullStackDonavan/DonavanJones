---
title: "Embedding Services"
description: "Running an embedding service in production: managed API vs self-hosted models, adaptive batching, index consistency, model migration, and evaluation."
date: 2026-03-20
lastUpdated: "2026-11-14"
category: "backend-engineering"
tags:
  - embeddings
  - ai
draft: false
slug: embedding-services
author: Donavan Jones
excerptImage: /img/blog/backendengineering/09-embedding-services.jpg
---

# Embedding Services

Running an embedding service reliably comes down to four things: choosing where the model runs, batching requests efficiently, keeping the vector index in sync with the source data, and migrating models without downtime. The [earlier embeddings article](/blog/backendengineering/04-embeddings) answered "what does the service do." This one answers "what does it take to run it reliably at scale."

Running an embedding service in production is different from building one. The design that works for 10,000 vectors during development starts showing cracks at 500,000. Reindexing runs that took minutes start taking hours. Model upgrades that seemed straightforward become coordinated migrations. Subtle inconsistencies accumulate between what is indexed and what is actually in the database.

This article covers the operational and engineering concerns that only surface once the service is carrying real load.

*Part of the [Backend Engineering series](/categories/backend-engineering). For how these pieces fit together, see the [backend systems overview](/systems/backend).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every backend engineering breakdown in this series."
destinationUrl: "/categories/backend-engineering"
---
::

## API vs Self-Hosted Models

The first decision when building an embedding service is where the model runs. There are two options:

**Managed API** (OpenAI, Anthropic, Cohere) — you send text over HTTPS and receive vectors back. No infrastructure to run, no GPU to provision, no model to update. You pay per token.

**Self-hosted** (sentence-transformers, custom fine-tuned models) — you run the model yourself on CPU or GPU hardware. You pay for compute, not per token. Latency is local. Model weights are yours.

For VerseHub I self-host: all-MiniLM-L6-v2 runs in a Docker container on the RTX 3090 in my workstation, and the vectors go to Weaviate on the [home lab cluster](/blog/ai-homelab-engineering/01-my-homelab-architecture-for-agentic-ai). The model is small (384 dimensions), the GPU was already there, and it keeps scripture queries and user notes off third-party APIs. The trade-offs:

| Factor | Managed API | Self-Hosted |
|---|---|---|
| Operational cost | Per-token pricing | Fixed compute cost |
| Latency | Network round trip | Local |
| Model quality | Large, regularly updated models | Whatever you choose and maintain |
| Availability | Provider SLA | Your infrastructure SLA |
| Customization | Limited | Full control, including fine-tuning |
| Data privacy | Text leaves your network | Text stays local |

If you do not already own a GPU, a managed API is usually cheaper at low volume, because per-token pricing beats paying for idle hardware. The break-even depends on your volume and hardware; I walk through that math in [when to buy a GPU instead of paying API fees](/blog/ai-cost-optimization/05-when-to-buy-a-gpu-instead-of-api-fees).

Another reason to self-host early is if the domain required a fine-tuned model that the managed APIs cannot provide. Biblical Hebrew, Koine Greek, and theological Latin are underrepresented in general-purpose embedding models. If retrieval quality on ancient language content degrades noticeably, a domain-fine-tuned self-hosted model becomes worth the operational cost — and a local model is the only kind you can fine-tune freely.

## Throughput Architecture

Where the bottleneck lives depends on where the model runs. In front of a managed API, the service is I/O-bound: most of each request's time is spent waiting for the upstream response, so an event-loop runtime like Node.js can keep many requests in flight and the practical limit is the provider's rate limit. In front of a local GPU, the service is compute-bound: the GPU processes one batch at a time, so how you group requests into batches matters far more than concurrency.

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

If you use a managed API, the upstream has a rate limit expressed in tokens per minute and requests per minute. Exceeding it produces 429 errors. Retrying naively after a 429 can cause cascading retries that keep the service over the rate limit.

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

This is not a two-phase commit — I do not want strong transactional guarantees between Postgres and the vector store. I want eventual consistency with a short convergence window and an observable gap metric.

### Consistency Auditing

A periodic consistency audit compares the set of content IDs in the primary database against the set of IDs in the vector store. Any ID present in one but not the other is a consistency violation. The audit produces a report with:

- Count of missing vectors (content without an embedding)
- Count of orphaned vectors (embedding without corresponding content — typically from deleted records)
- Oldest unresolved inconsistency (a proxy for how long the gap has been there)

Missing vectors are queued for reembedding. Orphaned vectors are deleted. The audit gives a weekly snapshot of index health without requiring perfect synchronization on every write.

## Model Migration

Switching embedding models is the most disruptive operational event in the embedding service lifecycle. Old vectors are incompatible with new model outputs. The entire index must be rebuilt, and the new index must replace the old one without downtime.

My migration process:

**Phase 1 — Shadow index.** Start writing to both the old and new index simultaneously. New and updated content gets embedded with both models. The old index remains the source of truth for reads.

**Phase 2 — Bulk backfill.** The async pipeline reembeds all existing content with the new model into the new index. This runs at off-peak hours to avoid competing with real-time traffic for rate limit capacity or GPU time.

**Phase 3 — Validation.** Run the evaluation suite (covered below) against both indexes. Confirm the new index meets or exceeds the old index's recall and precision scores.

**Phase 4 — Cutover.** Update the search service to read from the new index. Keep the old index live for 48 hours as a rollback target.

**Phase 5 — Cleanup.** Delete the old index and stop dual-writing.

The shadow write in Phase 1 ensures that by the time the bulk backfill finishes, the new index is nearly complete — only the oldest content needs to be reembedded. The gap between shadow start and backfill completion is small.

Version naming is critical throughout. Name collections `{content_type}_{model_version}` — for example `bible_verses_minilm` for all-MiniLM-L6-v2 and `bible_verses_te3s` if you moved to `text-embedding-3-small`. The search service reads its target collection name from config, not from code, so the cutover is a config update with no deploy.

## Evaluating Embedding Quality

You cannot tell whether your embeddings are good by looking at them. You need an evaluation set.

Build a ground-truth evaluation set of query/result pairs curated from real searches and annotated by hand:

```json
{
  "query": "God's faithfulness even when we are unfaithful",
  "relevant_passages": ["2tim_2_13", "lam_3_22", "rom_3_3", "ps_89_33"],
  "irrelevant_passages": ["gen_1_1", "rev_22_16"]
}
```

Against this set, measure:

**Recall@5** — what fraction of ground-truth relevant passages appear in the top 5 results.

**MRR (Mean Reciprocal Rank)** — the average reciprocal rank of the first relevant result. Measures whether the best result is at position 1 or buried at position 4.

**Precision@5** — what fraction of the top 5 results are actually relevant. Complements recall by penalizing result sets that are broad but imprecise.

Run this evaluation after every model migration and on a regular schedule in production, and treat a meaningful score drop as a stop sign for further indexing changes.

Building the ground-truth set is the part that takes real time. But it is the only reliable signal you have for whether the embedding pipeline is working. Every other metric tells you the service is running; only the evaluation set tells you the service is working. I learned that the hard way when VerseHub's scripture search silently stopped sending the query vector to Weaviate and returned verses in insertion order — every health check was green.

## Cost Attribution

Embedding costs are real — API fees on a managed service, GPU time on a self-hosted one — and unevenly distributed. The bulk of spending comes from two activities: the initial indexing of the full Bible corpus and study notes, and real-time query embedding.

Tag every embedding call with a cost center:

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

::CtaContactWork
---
buttonText: "Let's Talk About Your Embedding Infrastructure"
supportingCopy: "Scaling an embedding pipeline or planning a model migration of your own? Let's talk through the architecture."
destinationUrl: "/hire-me"
---
::

## What Running It Taught Me

The embedding service looks simple from the outside — send text, get vector — but it is one of the most operationally interesting services in the backend. The statefulness of the vector index, the irreversibility of model migrations, the invisibility of quality degradation, and the long-tail cost of bulk operations all require deliberate design.

The patterns that matter most in practice: write-through consistency with a background auditor, adaptive batching to maximize throughput without overwhelming rate limits, evaluation-first model migrations, and cost attribution by source. None of these are hard individually. Missing any one of them will eventually produce a problem that is harder to diagnose than it needed to be.

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
  buttonText: "Read: OCR Pipelines"
  supportingCopy: "Continue with \"OCR Pipelines\" to see another AI microservice with its own throughput, consistency, and evaluation challenges."
  destinationUrl: "/blog/backendengineering/10-ocr-pipelines"
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

## Related reading

- [Inference Services](/blog/backendengineering/08-inference-services) — previous in the series
- [OCR Pipelines](/blog/backendengineering/10-ocr-pipelines) — next in the series: feeding scanned text into this service
- [Model Loading Strategies](/blog/backendengineering/16-model-loading-strategies) — related: keeping a self-hosted embedder warm
- [Embedding Strategies](/blog/ai-engineering/11-embedding-strategies) — choosing models and chunking for retrieval quality
- [Backend systems overview](/systems/backend) — the hub for this series

---

*[← Back to Backend Engineering series](/categories/backend-engineering)*
