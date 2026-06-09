---
title: "Vector Search"
description: "Vector search services in distributed backend architectures."
date: 2026-03-07
lastUpdated: "2026-06-09"
category: "backend-engineering"
tags:
  - vector-search
  - ai
draft: false
cluster: "backend-engineering"
slug: vector-search
author: Donavan Jones
---

# Vector Search

The previous article covered how the embedding service converts text into vectors. This article covers what happens next: storing those vectors, querying them efficiently, and returning results that are actually useful in a production system.

Vector search is deceptively simple on the surface — "find the nearest neighbors to this query vector" — but the details around index design, query construction, result ranking, and operational scaling are where the real engineering lives. Getting it right is the difference between a search feature that feels magical and one that returns plausible-looking but unhelpful results.

*Part of the [Backend Engineering series](/categories/backend-engineering).*

## What Vector Search Is Solving

Traditional search is keyword-based. It matches documents that contain the words in the query. This breaks down in two ways for a Bible study platform:

First, scripture uses archaic or translation-specific language. A user searching for "second chances" will not find "the prodigal son" with keyword search even though that parable is one of the most famous illustrations of the concept.

Second, users do not always know the right terms. A new believer asking "how does God feel about people who mess up?" is semantically asking about grace, forgiveness, and redemption — but none of those words appear in the query.

Vector search solves both by operating on meaning rather than tokens. The query is embedded into the same vector space as the indexed content, and similarity is measured geometrically. Passages that mean similar things cluster together regardless of vocabulary.

## The Vector Search Service

The search service owns the vector database and answers all similarity queries. It has no knowledge of how embeddings are produced — it accepts vectors as input and returns ranked results. This separation, established in the previous article, is what makes model upgrades tractable.

The service exposes three primary endpoints:

```
POST /search/semantic
{
  "query_vector": [...],
  "collection": "bible_verses_en",
  "top_k": 20,
  "filters": {
    "book": "Romans",
    "testament": "new"
  }
}

POST /search/hybrid
{
  "query_vector": [...],
  "query_text": "armor of God",
  "collection": "bible_verses_en",
  "top_k": 20,
  "alpha": 0.7
}

POST /search/rerank
{
  "query_text": "armor of God",
  "candidates": [...],
  "top_n": 5
}
```

The three endpoints reflect three distinct search strategies I use depending on the query context. Each is explained below.

## The Vector Database

I use **Qdrant** as the vector database. The selection criteria were: self-hostable (no external SaaS dependency for core search), strong filtering support (needed for scripture metadata like book, chapter, testament, translation), active development, and good client library support for Node.js.

Alternatives I considered:

| Database | Why Not |
|---|---|
| Pinecone | SaaS-only, vendor dependency, cost at scale |
| Weaviate | More complex operational profile than needed |
| pgvector | Good option, but I wanted dedicated vector storage separate from the main Postgres instance |
| Chroma | Good for development; less battle-tested for production at the time |

Qdrant runs as a separate container with persistent volume storage. Collections are the unit of organization — each logical dataset (bible verses by translation, user notes, commentary) gets its own collection with its own vector dimensions and indexing configuration.

### Collection Design

Each collection stores points. A point is a vector plus a payload (arbitrary JSON metadata) plus an ID:

```json
{
  "id": "rom_8_28_esv",
  "vector": [0.023, -0.817, ...],
  "payload": {
    "book": "Romans",
    "chapter": 8,
    "verse": 28,
    "translation": "ESV",
    "text": "And we know that for those who love God all things work together for good...",
    "testament": "new",
    "genre": "epistle"
  }
}
```

The payload fields are indexed for filtering. Filtering happens at the vector search level — Qdrant applies the filter before or during the ANN search, not as a post-processing step on the full result set. This means filtered queries are fast even across large collections.

## Approximate Nearest Neighbor Search

Exact nearest neighbor search — comparing the query vector to every vector in the collection — is too slow at scale. A collection with 500,000 vectors would require 500,000 cosine similarity computations per query. Approximate Nearest Neighbor (ANN) search trades a small amount of recall for a large gain in speed.

Qdrant uses **HNSW** (Hierarchical Navigable Small World graphs) as its ANN algorithm. HNSW builds a multi-layer graph where each node is connected to its nearest neighbors. A query traverses the graph starting from the top layer, drilling down to find approximate neighbors without scanning the full collection.

The key parameters I tuned:

- **`m`** (connections per node): 16 — higher values improve recall but increase memory and index build time
- **`ef_construct`** (build-time search width): 100 — controls index quality during construction
- **`ef`** (query-time search width): 64 — controls the recall/speed tradeoff at query time

On my verse collection (~125,000 vectors across four translations), these settings give sub-10ms query latency with roughly 97% recall compared to exact search. For a Bible study application, the 3% of cases where the top result differs from the true nearest neighbor is an acceptable tradeoff.

## Three Search Strategies

### 1. Pure Semantic Search

Used when the user is doing concept-based exploration: "find passages about perseverance," "show me verses similar to Psalm 23." The query is embedded and the top-k nearest neighbors are returned from the collection.

This is the simplest strategy and works well when meaning alignment is the primary concern. Its weakness is that it can drift — a query about "light" might surface passages about physical light when the user means spiritual illumination. Filters help constrain this.

### 2. Hybrid Search

Used for most standard search queries where both semantic relevance and keyword precision matter. Hybrid search combines a vector similarity score with a BM25 keyword relevance score using a weighted sum:

```
final_score = alpha * semantic_score + (1 - alpha) * keyword_score
```

The `alpha` parameter controls the balance. I use `alpha = 0.7` as the default, weighting semantic search more heavily, but certain query types adjust it:

- Verse reference lookups ("Romans 8:28"): `alpha = 0.1` — mostly keyword
- Concept searches ("what does grace mean"): `alpha = 0.9` — mostly semantic
- General questions: `alpha = 0.7` — balanced default

The BM25 component runs against a full-text index on the `text` field in the payload. Qdrant supports sparse vectors for this, or I can run BM25 in Postgres and merge results in the search service. Currently I use the latter since the full-text index in Postgres is already maintained for other purposes.

### 3. Reranking

Used as a post-processing step when result quality needs to be maximized — primarily in the RAG retrieval path before sending context to the inference service.

The first-pass search retrieves a larger candidate set (top-20 to top-50). A cross-encoder reranker then scores each candidate against the full query text. Cross-encoders are slower than bi-encoders (the embedding model) because they process the query and each document together rather than independently, but they produce more accurate relevance scores.

I use a lightweight cross-encoder model running locally. The reranker narrows 20 candidates to the top 5 that will actually be sent to the LLM as context. This two-stage approach (fast ANN retrieval + slow reranking on a small set) gets near cross-encoder quality at near bi-encoder speed.

```
Query → Embed → ANN search (top-20) → Rerank → Top-5 context passages
```

---

*Explore more articles in the [Backend Engineering series](/categories/backend-engineering).*

---

## Metadata Filtering

Filters are what make vector search practical for structured content like scripture. Without filters, a semantic query for "suffering builds character" might surface results from across the entire Bible corpus — including passages that are semantically related but contextually irrelevant (a user studying the New Testament epistles does not want results from the Psalms unless they ask for them).

I expose filters on every search endpoint:

```json
{
  "filters": {
    "testament": "new",
    "translation": "ESV",
    "book": { "in": ["Romans", "Galatians", "Ephesians"] },
    "chapter": { "gte": 5, "lte": 10 }
  }
}
```

Qdrant evaluates these filters during the ANN traversal using its payload index. The performance cost is low because the filtered candidate pool is still much larger than the top-k result size.

## Scoring and Result Shape

Raw vector similarity scores (cosine similarity, range -1 to 1) are not meaningful to callers. The search service normalizes scores to a 0–1 range and adds a `relevance_tier` label (high / medium / low) based on score thresholds calibrated against my evaluation set.

```json
{
  "results": [
    {
      "id": "rom_5_3_esv",
      "score": 0.91,
      "relevance_tier": "high",
      "text": "Not only that, but we rejoice in our sufferings...",
      "metadata": { "book": "Romans", "chapter": 5, "verse": 3, "translation": "ESV" }
    },
    ...
  ],
  "query_time_ms": 7,
  "total_candidates": 125000
}
```

Callers use `relevance_tier` to decide whether results are good enough to surface to the user or send to inference. If the top result is `low` relevance, the inference service knows retrieval failed and can respond accordingly rather than hallucinating context around a poor match.

## Operational Considerations

**Index build time matters at reindex.** Adding 125,000 vectors to an HNSW index takes several minutes with my current settings. During a full reindex (model upgrade, new translation), the old collection remains live and the new collection is built in the background. The search service switches over atomically once the new index is ready — a config update, not a deploy.

**Memory sizing.** HNSW indexes are memory-resident for fast querying. Each vector (1536 float32 values) takes about 6KB. 500,000 vectors is ~3GB of vector data alone, plus graph overhead. I size the Qdrant container with enough RAM to hold the active collections in memory with headroom.

**Quantization as a lever.** Qdrant supports scalar quantization (float32 → int8) which reduces memory by 4x at a small accuracy cost (~1% recall drop in my testing). I have not needed it yet but it is the first lever to pull if the index outgrows available RAM.

**Monitoring recall quality.** I run a weekly evaluation using a fixed set of 200 ground-truth query/result pairs built from user feedback and manual annotation. If recall drops below 90% on this set, it triggers a review of index parameters or chunking strategy. This is the only reliable way to catch silent degradation — latency and error metrics will not tell you when the right answer drops from position 1 to position 5.

## What Search Makes Possible

Vector search is the retrieval backbone of the entire platform. Every RAG-powered response, every "related passages" suggestion, every personal note search runs through this service. The quality of retrieval directly determines the quality of everything the inference service produces — garbage in, garbage out.

The patterns here — hybrid search, two-stage retrieval with reranking, metadata filtering, calibrated relevance tiers — are not specific to Bible study. They apply to any system where users need to find information by meaning rather than by exact terms. The infrastructure is generic; the value is in how you tune it for your specific content and users.

The next article covers streaming — getting responses from the inference service back to users in real time, which is the other half of making AI features feel fast and responsive.

---

*[← Back to Backend Engineering series](/categories/backend-engineering)*
