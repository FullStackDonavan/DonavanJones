---
title: "Vector Search"
description: "How I run vector search in production with Weaviate: HNSW indexes, hybrid BM25 + semantic search, reranking, metadata filters, and silent retrieval failures."
date: 2026-03-07
lastUpdated: "2026-11-14"
category: "backend-engineering"
tags:
  - vector-search
  - ai
draft: false
cluster: "backend-engineering"
slug: vector-search
author: Donavan Jones
excerptImage: /img/blog/backendengineering/05-vector-search.jpg
---

# Vector Search

Vector search stores embeddings in an approximate-nearest-neighbor index and returns the passages whose meaning is closest to the query, usually blended with keyword scoring and filtered by metadata. In [VerseHub](/projects/versehub) that index is Weaviate, holding scripture verses and Church Fathers collections embedded with all-MiniLM-L6-v2.

The [previous article](/blog/backendengineering/04-embeddings) covered how the embedding service converts text into vectors. This one covers what happens next: storing those vectors, querying them efficiently, and returning results that are actually useful in a production system.

Vector search is deceptively simple on the surface — "find the nearest neighbors to this query vector" — but the details around index design, query construction, result ranking, and operational scaling are where the real engineering lives. Getting it right is the difference between a search feature that feels magical and one that returns plausible-looking but unhelpful results.

*Part of the [Backend Engineering series](/categories/backend-engineering). For how these pieces fit together, see the [backend systems overview](/systems/backend).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every backend engineering breakdown in this series."
destinationUrl: "/categories/backend-engineering"
---
::

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

I use **Weaviate** as the vector database, running in-cluster on my home lab K3s cluster next to PostgreSQL, Redis, and MinIO. The selection criteria were: self-hostable (no external SaaS dependency for core search), strong filtering support (needed for scripture metadata like book, chapter, testament, translation), and built-in hybrid search.

How the common options compare:

| Database | Trade-off |
|---|---|
| Weaviate | What I run: self-hosted, native hybrid (BM25 + vector) search, payload filtering |
| Qdrant | Also a strong self-hosted choice with excellent filtering |
| Pinecone | SaaS-only, vendor dependency, cost at scale |
| pgvector | Good option if you want vectors inside your main Postgres instance |
| Chroma | Good for development; less battle-tested for production |

Weaviate runs as its own service with persistent volume storage. Collections are the unit of organization — VerseHub has one for verses and one for Church Fathers passages, each with its own properties and indexing configuration.

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

The payload fields are indexed for filtering. Filtering happens at the vector search level — the database applies the filter before or during the ANN search, not as a post-processing step on the full result set. This means filtered queries are fast even across large collections.

## Approximate Nearest Neighbor Search

Exact nearest neighbor search — comparing the query vector to every vector in the collection — is too slow at scale. A collection with 500,000 vectors would require 500,000 cosine similarity computations per query. Approximate Nearest Neighbor (ANN) search trades a small amount of recall for a large gain in speed.

Weaviate (like Qdrant and pgvector) uses **HNSW** (Hierarchical Navigable Small World graphs) as its ANN algorithm. HNSW builds a multi-layer graph where each node is connected to its nearest neighbors. A query traverses the graph starting from the top layer, drilling down to find approximate neighbors without scanning the full collection.

The key parameters to understand (names vary slightly by database):

- **`m` / `maxConnections`** (connections per node): higher values improve recall but increase memory and index build time
- **`ef_construct` / `efConstruction`** (build-time search width): controls index quality during construction
- **`ef`** (query-time search width): controls the recall/speed trade-off at query time

For a corpus the size of the Bible plus commentary, the defaults are a reasonable starting point; tune `ef` first if recall looks low, because it changes nothing about the stored index.

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

The BM25 component runs against a full-text index on the `text` field. Weaviate does this natively in its hybrid query (with the same `alpha` knob); with other databases you can use sparse vectors or run BM25 in Postgres and merge results in the search service.

### 3. Reranking

Used as a post-processing step when result quality needs to be maximized — primarily in the RAG retrieval path before sending context to the inference service.

The first-pass search retrieves a larger candidate set (top-20 to top-50). A cross-encoder reranker then scores each candidate against the full query text. Cross-encoders are slower than bi-encoders (the embedding model) because they process the query and each document together rather than independently, but they produce more accurate relevance scores.

A lightweight cross-encoder can run locally next to the embedder. The reranker narrows 20 candidates to the top 5 that will actually be sent to the LLM as context. This two-stage approach (fast ANN retrieval + slow reranking on a small set) gets near cross-encoder quality at near bi-encoder speed.

```
Query → Embed → ANN search (top-20) → Rerank → Top-5 context passages
```

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

The database evaluates these filters during the ANN traversal using its property index. The performance cost is low because the filtered candidate pool is still much larger than the top-k result size.

## Scoring and Result Shape

Raw vector similarity scores (cosine similarity, range -1 to 1) are not meaningful to callers. The search service normalizes scores to a 0–1 range and adds a `relevance_tier` label (high / medium / low) based on score thresholds calibrated against a small hand-checked evaluation set.

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
  "total_candidates": 20
}
```

Callers use `relevance_tier` to decide whether results are good enough to surface to the user or send to inference. If the top result is `low` relevance, the inference service knows retrieval failed and can respond accordingly rather than hallucinating context around a poor match.

The failure that taught me this was worse than a low score. In VerseHub, the scripture path once stopped sending the query vector to Weaviate, so "search" returned verses in insertion order. Separately, a retrieval error was being swallowed and returned as an empty list, which let the model write confident answers with no evidence behind them. Now a retrieval failure raises, and the [verification pipeline](/blog/versehub-engineering/06-verification-pipeline-for-ai-outputs) checks every cited reference against what was actually retrieved.

## Operational Considerations

**Index build time matters at reindex.** Building an HNSW index over a full corpus is not instant. During a full reindex (model upgrade, new translation), the old collection remains live and the new collection is built in the background. The search service switches over atomically once the new index is ready — a config update, not a deploy.

**Memory sizing.** HNSW indexes are memory-resident for fast querying. A 1536-dimension float32 vector takes about 6KB, so 500,000 of them is ~3GB before graph overhead. A 384-dimension all-MiniLM-L6-v2 vector is about 1.5KB, a quarter of that. Size the vector database with enough RAM to hold the active collections in memory with headroom.

**Quantization as a lever.** Most vector databases support quantization (for example float32 → int8 scalar quantization, a 4x memory cut) at a small accuracy cost. I have not needed it yet, but it is the first lever to pull if the index outgrows available RAM.

**Monitoring recall quality.** Keep a fixed set of ground-truth query/result pairs and re-run it after any index, model, or chunking change. This is the only reliable way to catch silent degradation — latency and error metrics will not tell you when the right answer drops from position 1 to position 5.

::CtaContactWork
---
buttonText: "Let's Talk About Your Search Pipeline"
supportingCopy: "Building hybrid search or reranking for your own retrieval system? Let's talk through the architecture."
destinationUrl: "/hire-me"
---
::

## What Search Makes Possible

Vector search is the retrieval backbone of the entire platform. Every RAG-powered response, every "related passages" suggestion, every personal note search runs through this service. The quality of retrieval directly determines the quality of everything the inference service produces — garbage in, garbage out.

The patterns here — hybrid search, two-stage retrieval with reranking, metadata filtering, calibrated relevance tiers — are not specific to Bible study. They apply to any system where users need to find information by meaning rather than by exact terms. The infrastructure is generic; the value is in how you tune it for your specific content and users.

The next article covers streaming — getting responses from the inference service back to users in real time, which is the other half of making AI features feel fast and responsive.

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
  buttonText: "Read: Streaming"
  supportingCopy: "Continue with \"Streaming\" to see how these retrieved results get turned into a real-time response back to the user."
  destinationUrl: "/blog/backendengineering/06-streaming"
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
  - label: "Vector Database — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Vector_database"
    type: "wikipedia"
    description: "Overview of vector database architecture and approximate nearest neighbor search — the infrastructure this vector search service is built on."
  - label: "Hierarchical Navigable Small World (HNSW) — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Hierarchical_navigable_small_world"
    type: "wikipedia"
    description: "According to this overview, HNSW is the graph-based ANN algorithm that enables millisecond-scale similarity search across hundreds of thousands of vectors."
  - label: "Okapi BM25 — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Okapi_BM25"
    type: "wikipedia"
    description: "The sparse keyword retrieval function combined with vector similarity in hybrid search — the BM25 component that handles exact reference lookups like 'Romans 8:28'."
  - label: "Dense Passage Retrieval for Open-Domain QA (Karpukhin et al., 2020)"
    url: "https://doi.org/10.48550/arXiv.2004.04906"
    type: "doi"
    description: "According to this research, bi-encoder dense retrieval outperforms BM25 for natural language questions — the foundational evidence for the semantic-weighted hybrid search strategy."
---
::

## Related reading

- [Embeddings](/blog/backendengineering/04-embeddings) — previous in the series: how the vectors are produced
- [Streaming](/blog/backendengineering/06-streaming) — next in the series: getting the answer back to the user
- [Vector Databases](/blog/ai-engineering/02-vector-databases) — a broader comparison of vector stores for AI systems
- [Storing AI Memory with Redis and Vector Databases](/blog/agentic-ai-systems/05-storing-ai-memory-with-redis-and-vector-databases) — the same storage layer used for agent memory
- [Backend systems overview](/systems/backend) — the hub for this series

---

*[← Back to Backend Engineering series](/categories/backend-engineering)*
