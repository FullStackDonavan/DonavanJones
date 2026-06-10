---
title: "Embeddings"
description: "Embedding services in AI backend architectures."
date: 2026-03-05
lastUpdated: "2026-06-09"
category: "backend-engineering"
tags:
  - embeddings
  - ai
draft: false
cluster: "backend-engineering"
slug: embeddings
author: Donavan Jones
---

# Embeddings

Before I built the embedding service, search on my platform was keyword-based. A user looking for passages about "forgiveness" would get results containing the word "forgiveness" and miss everything about "mercy," "pardon," "reconciliation," or "grace." The words are different. The meaning is the same.

Embeddings fix this. They convert text into a vector — a list of numbers — that encodes semantic meaning rather than surface form. Two passages that mean similar things end up close together in vector space, regardless of the specific words used. This makes search dramatically more useful for a domain like scripture where the same idea appears across thousands of verses in dozens of translations.

This article covers what embeddings are, how the embedding service is designed, what gets embedded and when, and the operational decisions that keep it fast and affordable.

*Part of the [Backend Engineering series](/categories/backend-engineering).*

## What an Embedding Actually Is

An embedding model takes a piece of text and outputs a fixed-length array of floating-point numbers — typically 768 to 3072 dimensions depending on the model. This vector represents the text's meaning in a high-dimensional space where semantic similarity corresponds to geometric proximity.

A concrete example. Given these three inputs:

- "For God so loved the world" (John 3:16)
- "God's love for humanity is boundless"
- "The boiling point of water is 100 degrees Celsius"

The first two will produce vectors that are close together (high cosine similarity). The third will be far away. The embedding model learned these relationships from training on massive text corpora and encoded them as geometry.

The vector itself is opaque — you cannot read it and understand what it means. But you can compute the distance between two vectors cheaply, at scale, and use that distance as a proxy for semantic similarity.

## The Embedding Service

The embedding service is a single-purpose HTTP service with one job: accept text, return a vector. It is stateless, horizontally scalable, and sits behind an internal load balancer.

The API surface is intentionally minimal:

```
POST /embed
{
  "text": "What is the armor of God?",
  "model": "text-embedding-3-small",
  "normalize": true
}

→ 200
{
  "embedding": [0.023, -0.817, 0.441, ...],  // 1536 dimensions
  "tokens": 9,
  "model": "text-embedding-3-small"
}
```

Callers specify what they want embedded and which model to use. The service handles batching, retries, caching, and cost tracking internally. Callers get a clean vector back.

### Batching

Embedding API calls have a per-request overhead. Sending 100 single-text requests is much more expensive (in latency and cost) than sending one request with 100 texts. The embedding service accepts both single texts and arrays:

```
POST /embed/batch
{
  "texts": ["verse 1", "verse 2", ..., "verse 100"],
  "model": "text-embedding-3-small"
}

→ 200
{
  "embeddings": [[...], [...], ...],
  "tokens": 1847,
  "model": "text-embedding-3-small"
}
```

The initial Bible text indexing — roughly 31,000 verses across multiple translations — ran entirely through the batch endpoint. Single-text calls are used for real-time operations like embedding a user's search query.

### Caching

Embedding the same text twice is wasteful. The service maintains a Redis cache keyed by `hash(text + model)`. Cache hits return immediately without touching the embedding API. For static content like Bible verses, the cache hit rate is near 100% after the first full indexing run.

Cache TTL is long (30 days) for static content and short (1 hour) for user-generated content like notes or questions. The service infers content type from the `source` field callers pass with each request.

### Model Selection

Not all embedding tasks need the same model. I use two models depending on the use case:

| Use Case | Model | Dimensions | Notes |
|---|---|---|---|
| Bible verse indexing | `text-embedding-3-small` | 1536 | Cost-effective for static corpus |
| User query embedding | `text-embedding-3-small` | 1536 | Matched to index model |
| Study note indexing | `text-embedding-3-large` | 3072 | Higher quality for personal content |
| Cross-lingual search | `text-embedding-3-large` | 3072 | Better multilingual alignment |

The critical constraint: query embeddings must use the same model as the index embeddings they will be compared against. Mixing models produces meaningless similarity scores. The service enforces this by tagging stored embeddings with the model that produced them and rejecting search requests that use mismatched models.

## What Gets Embedded

Everything that needs to be semantically searchable gets an embedding. In practice that means:

**Bible verses** — every verse in every indexed translation. Each verse is embedded as a single unit. Cross-reference searches ("find passages similar to Romans 8:28") work by embedding the source verse and finding its nearest neighbors.

**User study notes** — every note a user saves gets embedded at write time. This powers personal search: "find my notes about suffering" returns notes that discuss suffering even if the word "suffering" never appears.

**User questions** — when a user asks a question, the query is embedded and used to retrieve the most semantically relevant passages before they are sent to the inference service as context. This is the retrieval step in retrieval-augmented generation (RAG).

**Commentary excerpts** — third-party theological commentary is chunked and embedded for retrieval alongside scripture. Chunk size matters here; I use 512-token chunks with a 64-token overlap to preserve context across boundaries.

## The Embedding Pipeline

For real-time operations (a user saves a note, asks a question), embedding happens synchronously in the request path with a tight timeout. For bulk operations (indexing a new Bible translation, reindexing after a model upgrade), embedding happens through an async pipeline.

The async pipeline uses a message queue. A job is submitted with a list of texts and a destination (which vector store collection to write to). Workers pull jobs from the queue, call the embedding service in batches, and write the resulting vectors to the vector database. Progress is tracked in a jobs table so failed batches can be retried without reprocessing completed work.

```
Indexing pipeline:

Job submitted → Queue
Worker pulls job
  → POST /embed/batch (texts[0..99])
  → Write embeddings to vector DB
  → Mark batch complete
  → POST /embed/batch (texts[100..199])
  ...
Job complete → Notify
```

The pipeline is idempotent. If a worker crashes mid-job, restarting it from the last completed batch produces the same result as if it had never crashed. This is enforced by writing the batch offset to the jobs table before processing each batch, not after.

---

*Explore more articles in the [Backend Engineering series](/categories/backend-engineering).*

---

## Chunking Strategy

Embedding a 10,000-word commentary chapter as a single vector loses information. The vector represents the average meaning of the whole document, which is too diffuse to be useful for retrieval. Texts above a certain length need to be chunked before embedding.

My chunking rules by content type:

- **Bible verses**: no chunking — each verse is already a natural unit
- **User notes**: no chunking under 1000 tokens; split at paragraph boundaries above that
- **Commentary**: 512-token chunks with 64-token overlap, split at sentence boundaries
- **Study guides**: 256-token chunks, split at heading or paragraph boundaries

The overlap matters. Without it, a chunk boundary can split a sentence mid-thought, and the semantic meaning of both halves degrades. With overlap, each chunk contains enough context from its neighbors to be independently meaningful.

## Operational Considerations

**Reindexing costs real money.** Switching embedding models requires reindexing everything because old vectors are incompatible with new model outputs. For 31,000 verses across four translations, a full reindex costs a few dollars and takes about 20 minutes. For a larger corpus, this becomes a meaningful operational event. I version the embedding model in the vector store collection name (`verses_v2_small`) so old and new indexes can coexist during a transition.

**Dimension reduction is a lever.** The `text-embedding-3` models support truncating their output to fewer dimensions at the cost of some accuracy. For the verse index, I tested truncating from 1536 to 512 dimensions — storage drops by 66%, query latency drops proportionally, and retrieval quality dropped by about 3% on my evaluation set. For most use cases that tradeoff is worth it; for theological precision, I kept full dimensions.

**Monitor embedding drift.** If the distribution of incoming queries shifts significantly from the distribution of indexed content, retrieval quality degrades. I log a sample of query embeddings and their top-k retrieval results weekly and manually review a subset. This is manual and lightweight; at larger scale it would be automated with an evaluation pipeline.

## The Relationship to Search

Embeddings are not search — they are the input to search. The next article covers the vector search service that stores these embeddings and answers similarity queries. The embedding service produces the vectors; the search service indexes and queries them.

The boundary is intentional. The embedding service knows nothing about where vectors end up. The search service knows nothing about how vectors are produced. Either can be swapped or upgraded without touching the other, as long as the vector dimensions and model version metadata stay consistent across the handoff.

Keeping them separate is what makes a model upgrade tractable: you run the new embedding model, populate a new vector store collection, switch the search service to point at the new collection, and tear down the old one — all without touching the embedding service's API or the search service's query logic.

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "Word Embedding — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Word_embedding"
    type: "wikipedia"
    description: "Overview of embedding models — the technology that converts text into dense vectors for semantic search and retrieval."
  - label: "Retrieval-Augmented Generation — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation"
    type: "wikipedia"
    description: "According to this overview, RAG uses embedding-based retrieval to inject relevant context at inference time — the use case this embedding service was built to serve."
  - label: "Sentence-BERT: Sentence Embeddings Using Siamese BERT-Networks (Reimers & Gurevych, 2019)"
    url: "https://doi.org/10.48550/arXiv.1908.10084"
    type: "doi"
    description: "Introduced bi-encoder sentence embeddings for semantic similarity — the architecture class that OpenAI's text-embedding models build on."
  - label: "Redis — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Redis"
    type: "wikipedia"
    description: "Overview of Redis as an in-memory data store — the caching layer that reduces repeated embedding API calls for static content like Bible verses to near-zero cost."
---
::

---

*[← Back to Backend Engineering series](/categories/backend-engineering)*
