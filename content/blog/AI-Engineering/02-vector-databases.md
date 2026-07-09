---
title: "Vector Databases"
description: "Role of vector databases in AI agent memory and retrieval."
date: 2026-04-23
lastUpdated: "2026-06-09"
category: "ai-engineering"
tags:
  - ai-engineering
  - vector-db
  - retrieval
draft: false
cluster: "ai-engineering"
slug: vector-databases
author: Donavan Jones
---

# Vector Databases

The previous article described persistent memory as a system with four distinct types — episodic, semantic, procedural, working. Two of those types (episodic and semantic) rely heavily on a specific kind of storage that relational databases handle poorly: retrieval by meaning rather than by identifier.

A relational database retrieves by equality or range: give me the row where `id = 42`, or give me all rows where `created_at > last_week`. It has no native concept of "give me the rows that mean something similar to this sentence." Vector databases fill this gap. They are purpose-built to store high-dimensional vectors and answer similarity queries efficiently at scale.

This article covers what vector databases are, why they are the right tool for AI agent memory specifically, how to think about collection design, and how a vector database fits into the broader memory architecture alongside relational storage.

*Part of the [AI Engineering series](/categories/ai-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every ai engineering deep-dive in this series."
destinationUrl: "/categories/ai-engineering"
---
::

## What a Vector Database Actually Does

A vector database stores vectors — arrays of floating-point numbers — alongside metadata payloads. Its primary operation is approximate nearest neighbor (ANN) search: given a query vector, return the K vectors in the database that are geometrically closest to it.

Geometric closeness corresponds to semantic similarity when the vectors are embeddings. Two texts that mean similar things produce embeddings that are close together in vector space. So "nearest neighbor search over embeddings" is effectively "find content that means something similar to this query."

This is the operation that makes AI agents useful for knowledge retrieval. An agent that can ask "what do I know that is semantically related to what the user just said?" can retrieve relevant context without the user having to use exact keyword matches. That capacity is what separates a naive keyword-search system from a genuinely intelligent one.

## Why Not Just Use Postgres?

The `pgvector` extension adds vector similarity search to Postgres. For small datasets and moderate query volumes, it works well. The Backend Engineering series uses a dedicated vector store (Qdrant) rather than pgvector, and the reasoning is worth revisiting from the AI engineering perspective.

The question is not just "can Postgres store vectors?" but "what does the vector database need to do in an AI agent context?"

AI agents have specific requirements that dedicated vector databases optimize for:

**Filtering at query time.** An agent retrieving memory for user A should not surface memories from user B. Filtering the vector search by `user_id` must happen inside the ANN search — not as a post-processing step on the full result set. Dedicated vector stores apply filters during ANN traversal, keeping filtered queries fast regardless of collection size. `pgvector`'s filter support is improving but still less efficient for complex filter combinations.

**Multiple collections with different schemas.** An agent's memory system needs several distinct namespaces: one for semantic user profiles, one for episodic events, one for indexed knowledge content, one for study notes. Dedicated vector stores support multiple named collections with independent configuration. In pgvector, these become separate tables with separate indexes — manageable but requiring more application-level coordination.

**Built-in payload indexing.** Metadata attached to vectors (timestamps, user IDs, content type, topic tags) needs to be indexed for efficient filtering. Dedicated vector stores index payloads natively. pgvector requires creating separate Postgres indexes on companion columns.

**Distance metric flexibility.** Different embedding models perform best with different distance metrics (cosine similarity, dot product, Euclidean distance). Dedicated vector stores configure this per collection. pgvector supports all three but requires specifying it correctly at index creation.

The pragmatic answer: pgvector is the right choice if you want to minimize infrastructure and your vector workload is modest. A dedicated store is the right choice when the vector database is a first-class component of your AI system — when collection design, query performance, and filtering flexibility matter.

## Collections as Memory Namespaces

In a dedicated vector store, the fundamental unit of organization is the collection (called an index in some systems). Each collection has its own set of vectors, its own payload schema, and its own ANN index. Designing collections is a first-order AI engineering decision because it determines what kinds of memory retrieval are possible and how fast they are.

On this platform, memory is organized into five collections:

**`user_semantic_profiles`** — semantic memories about users. Each point is one semantic fact about one user: their theological background, study interests, knowledge gaps, learning style observations. Payload includes `user_id`, `category`, `confidence`, `last_updated`.

Retrieval: "find the semantic facts about this user that are most relevant to this current topic."

**`episodic_events`** — raw interaction records. Each point is one session event: a question asked, a passage studied, a concept engaged with. Payload includes `user_id`, `session_id`, `timestamp`, `event_type`, `entities` (people, passages, themes mentioned).

Retrieval: "find past events for this user that are semantically related to what they are asking now."

**`bible_verses`** — the full Bible corpus, one point per verse per translation. This is the primary knowledge retrieval collection — the one that powers RAG-based answers. Payload includes `ref`, `book`, `chapter`, `verse`, `translation`, `testament`, `genre`.

Retrieval: "find passages that are semantically relevant to this question."

**`commentary_chunks`** — theological commentary, chunked and embedded. Each point is one chunk from a commentary, lexicon entry, or theological reference work. Payload includes `source`, `author`, `date`, `topic`, `passage_ref`.

Retrieval: "find commentary that is semantically relevant to this passage and this question."

**`user_notes`** — user-authored study notes. Each point is one note saved by one user. Payload includes `user_id`, `note_id`, `verse_ref`, `created_at`.

Retrieval: "find this user's past notes that are relevant to what they are currently studying."

The collection boundaries are not arbitrary. They correspond to distinct retrieval contexts with different filter requirements and different payload schemas. Merging them would require more complex filters on every query and would compromise the clarity of what each retrieval operation means.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how this fits into the production ai engineering system it was built for."
destinationUrl: "/systems/ai"
---
::

---

*Explore more articles in the [AI Engineering series](/categories/ai-engineering).*

---

## The Role of Payload Filtering in Agent Memory

Payload filtering is what makes multi-user memory tractable. Without it, a query against `user_semantic_profiles` would return the most relevant semantic memories across all users — clearly wrong. With a `user_id` filter, the same query returns only the memories for the requesting user.

The filter is not optional — it is part of the memory semantics. A query against `episodic_events` without a `user_id` filter is not a valid memory retrieval operation; it is a privacy violation. I enforce this in the application layer by requiring `user_id` as a mandatory parameter on every memory retrieval function and injecting it as a filter automatically.

Beyond user isolation, filters enable temporal and categorical memory scoping:

```typescript
// Retrieve episodic memories about a topic, recent only
const memories = await vectorStore.search("episodic_events", {
  vector: queryEmbedding,
  filter: {
    user_id: { $eq: userId },
    timestamp: { $gte: thirtyDaysAgo },
    event_type: { $in: ["question", "deep_engagement"] },
  },
  limit: 10,
});
```

```typescript
// Retrieve semantic memories in a specific category
const profile = await vectorStore.search("user_semantic_profiles", {
  vector: queryEmbedding,
  filter: {
    user_id: { $eq: userId },
    category: { $in: ["theological_background", "study_interests"] },
    confidence: { $gte: 0.7 },
  },
  limit: 5,
});
```

The filter syntax above is Qdrant's filter language. The principle — metadata predicates applied during ANN traversal — is common across all major vector stores, though the syntax differs.

## Embedding Alignment Across Collections

Every query against every collection uses the same embedding model. This is a hard constraint, not a preference.

Similarity search compares a query vector against stored vectors using geometric distance. If the query is embedded with model A and the stored vectors were produced by model B, the distance computation is meaningless — the vectors occupy different spaces. A high similarity score from a cross-model comparison tells you nothing.

On this platform, all five collections use the same model: `text-embedding-3-small` from OpenAI. This means:

- Every piece of text that enters any collection is embedded with this model
- Every query embedding is generated with this model
- Switching models requires reindexing all five collections simultaneously

The reindexing constraint is why model upgrades are coordinated across all collections rather than collection-by-collection. A partial upgrade — some collections on the new model, some on the old — would make cross-collection similarity comparisons unreliable.

There is one legitimate exception: collections with fundamentally different content types may benefit from specialized models. Ancient Greek and Hebrew text underrepresents in general-purpose models; a multilingual model trained on ancient languages would produce better embeddings for `commentary_chunks` that include interlinear text. If I introduce a second embedding model for a subset of collections, those collections can only be queried with their own model — cross-collection retrieval requires the same model throughout.

## Populating Collections: Indexing Strategies

Collections are populated through two distinct flows:

**Bulk indexing** — loading the static corpus (Bible verses, commentary, reference works). This is a one-time or infrequent operation that processes tens of thousands of documents. It runs through the async job pipeline at controlled throughput, respecting embedding API rate limits. The Bible verse collection (31,102 verses × 4 translations = ~124,000 vectors) takes roughly 20 minutes to index from scratch.

**Real-time indexing** — adding new content as users create it (study notes, highlighted passages, session events). This happens in the foreground with a soft latency budget. A user saving a note expects it to appear in search within a few seconds — the embedding and upsert must complete before the session ends, even if the acknowledgment to the user is optimistic.

The architecture decision is whether real-time indexing is synchronous or asynchronous. My choice: synchronous upsert into the vector store as part of the note-save operation, with a 2-second timeout. If the upsert times out, the note is saved to Postgres and queued for async indexing. The user gets their note immediately; search visibility follows within a minute via the queue.

## Retrieval Composition: Combining Multiple Collections

The most powerful memory retrievals combine results from multiple collections. Answering "what do I know about this topic, for this user?" requires pulling from `bible_verses`, `commentary_chunks`, and `user_notes` simultaneously — different content types, unified by the current query.

I run these in parallel and merge by score:

```typescript
async function retrieveRelevantContext(
  userId: string,
  queryEmbedding: number[],
  limit: number = 15
): Promise<RetrievalResult[]> {
  const [verses, commentary, userNotes, semanticMemory] = await Promise.all([
    vectorStore.search("bible_verses", {
      vector: queryEmbedding,
      filter: { translation: { $eq: userPrefs.translation } },
      limit: 8,
    }),
    vectorStore.search("commentary_chunks", {
      vector: queryEmbedding,
      limit: 4,
    }),
    vectorStore.search("user_notes", {
      vector: queryEmbedding,
      filter: { user_id: { $eq: userId } },
      limit: 4,
    }),
    vectorStore.search("user_semantic_profiles", {
      vector: queryEmbedding,
      filter: { user_id: { $eq: userId } },
      limit: 3,
    }),
  ]);

  return mergeAndRank([
    ...verses.map(r => ({ ...r, source: "scripture", weight: 1.0 })),
    ...commentary.map(r => ({ ...r, source: "commentary", weight: 0.85 })),
    ...userNotes.map(r => ({ ...r, source: "user_note", weight: 0.9 })),
    ...semanticMemory.map(r => ({ ...r, source: "memory", weight: 1.1 })),
  ], limit);
}
```

The weights adjust for source type: user memory is boosted (more relevant than generic commentary for a personalized response), commentary is slightly downweighted relative to scripture (scripture is the primary source), user notes are weighted highly (personal engagement is a strong signal).

The `mergeAndRank` function normalizes scores across collections to a common scale, applies source weights, deduplicates (a verse may appear in both `bible_verses` and as a reference in `user_notes`), and returns the top N results.

::CtaTryApp
---
buttonText: "Try The Live AI App"
supportingCopy: "Try the RAG-powered Bible study app these patterns were built for."
destinationUrl: "https://versehub.app/register"
---
::

## The Vector Database Is Not the Whole Memory System

A mistake I want to name explicitly: treating the vector database as the memory system.

It is one component of the memory system. The full picture from article 01:

- **Vector store**: handles semantic and episodic retrieval (finding relevant content by meaning)
- **Postgres**: stores the authoritative record of all events, preferences, and semantic facts
- **Redis**: manages working memory for active sessions
- **The extraction pipeline**: converts episodic events into semantic memories

The vector store knows how to find things by similarity. It does not know how to maintain consistency, enforce relationships, run aggregations, or handle the relational structure of user accounts and preferences. Postgres handles all of that.

The clean division: Postgres is the system of record; the vector store is the retrieval index. Every piece of data in the vector store also has an authoritative copy in Postgres. If the vector index is corrupted or needs rebuilding, everything can be reindexed from Postgres. If a user deletes their data, the deletion happens in Postgres first and propagates to the vector store — not the other way around.

This architecture means the vector store can be treated as a cache with rebuild semantics, not as a primary store. That simplifies the operational model significantly and keeps the source of truth in a system that has decades of reliability tooling around it.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The AI Starter Kit"
  supportingCopy: "Get the Self-Hosted AI Starter Kit — Ollama setup, RAG architecture diagrams, embedding pipeline templates, and FastAPI examples ($29)."
  destinationUrl: "/products/self-hosted-ai-starter-kit"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Tool Calling"
  supportingCopy: "Continue with \"Tool Calling\" for the next piece of this system."
  destinationUrl: "/blog/ai-engineering/03-tool-calling"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get new ai engineering breakdowns delivered before they're public."
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
    description: "Overview of vector database architecture, approximate nearest neighbor search, and use cases in AI systems."
  - label: "Nearest Neighbor Search — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Nearest_neighbor_search"
    type: "wikipedia"
    description: "Foundational explanation of ANN search — the core operation all vector similarity retrieval is built on."
  - label: "Retrieval-Augmented Generation — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation"
    type: "wikipedia"
    description: "Overview of RAG architecture — the retrieval pattern this collection design directly supports."
  - label: "Dense Passage Retrieval for Open-Domain QA (Karpukhin et al., 2020)"
    url: "https://doi.org/10.48550/arXiv.2004.04906"
    type: "doi"
    description: "Facebook AI research establishing dense vector retrieval as superior to sparse BM25 for open-domain question answering — foundational precedent for embedding-based knowledge retrieval."
  - label: "Approximate Nearest Neighbors Oh Yeah (ANNOY) — GitHub"
    url: "https://doi.org/10.48550/arXiv.1603.09320"
    type: "doi"
    description: "Influential work on approximate nearest neighbor indexing strategies that underpin modern vector store ANN engines."
---
::

---

*[← Back to AI Engineering](/categories/ai-engineering)*
