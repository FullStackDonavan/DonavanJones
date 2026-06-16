---
title: "Retrieval Systems for Theology"
description: "AI retrieval systems for theological texts and arguments."
date: 2026-05-08
lastUpdated: "2026-06-09"
category: "ai-engineering"
tags:
  - ai-engineering
  - retrieval
  - theology
draft: false
cluster: "ai-engineering"
slug: retrieval-systems-for-theology
author: Donavan Jones
---

# Retrieval Systems for Theology

Retrieval is the evidence-gathering half of a RAG system — the part that determines what the model knows about the current question before it starts generating. In a generic RAG system, retrieval is a semantic similarity search: embed the query, find nearest neighbors, pass them to the model. Simple, often adequate.

Theological content breaks this simplicity in instructive ways. Scripture is not a generic knowledge corpus. It is a structured, cross-referenced, multiply-interpreted body of texts with specific linguistic properties, a complex internal relationship graph, and a centuries-long tradition of commentary that must be handled alongside the primary texts. Retrieval systems that treat it like a Wikipedia dump get mediocre results. Systems designed for its specific characteristics get dramatically better ones.

*Part of the [AI Engineering series](/categories/ai-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every ai engineering deep-dive in this series."
destinationUrl: "/categories/ai-engineering"
---
::

This article covers what makes theological retrieval distinct, the multiple retrieval strategies the platform uses, how they compose, and what the evaluation process looks like.

## What Makes Theological Retrieval Distinct

### The text is dense with meaning at the unit level

A single Bible verse can be a complete theological argument. "For God so loved the world that he gave his only Son, that whoever believes in him should not perish but have eternal life" (John 3:16) contains the entire gospel in 26 words. In a typical document corpus, a sentence is a fragment; in scripture, a verse is often a unit.

This changes the retrieval unit. For most corpora, chunking at the sentence level loses context; you need paragraphs or sections. For scripture, the verse is a natural retrieval unit with well-understood boundaries and metadata. Verse-level retrieval is appropriate in ways that sentence-level retrieval rarely is for other content.

### The same meaning appears in radically different words

"Do not be anxious about anything" (Philippians 4:6) and "Cast all your anxiety on him" (1 Peter 5:7) express semantically overlapping content through different vocabulary, different authors, different audiences, different grammatical constructions. A query about "worry and anxiety" should retrieve both — semantic search handles this well.

But consider: "The Lord is my shepherd" (Psalm 23:1) and "I am the good shepherd" (John 10:11) are not semantically similar by the metric of surface form, but theologically they are deeply connected — the gospel writer is explicitly invoking Psalm 23 imagery. This cross-reference relationship is not captured by embedding similarity alone. It requires the graph-based cross-reference system built into the platform's data model.

### Translation creates multiple valid representations of the same text

"The Spirit himself bears witness with our spirit that we are children of God" (Romans 8:16, ESV) and "The Spirit himself testifies with our spirit that we are God's children" (Romans 8:16, NIV) are the same verse. Embedding them separately produces two nearby but distinct vectors. Querying with "Spirit testifies children God" is slightly more similar to the NIV embedding than the ESV embedding, so the user's preferred translation might rank second rather than first.

Translation-aware retrieval requires either: (1) indexing each translation separately and filtering by the user's preference, (2) indexing one canonical translation and mapping results to the user's preferred translation at serve time, or (3) using translation-normalized embeddings that collapse translation variation into a single representation.

The platform uses approach (1): each translation has its own index partition, and retrieval filters to the user's preferred translation by default with a fallback to the canonical translation.

### Commentary, interpretation, and the primary text are distinct layers

A query about Romans 8:28 might need the verse text, the historical context, the Greek lexical analysis, and modern scholarly interpretation. These are four different kinds of content with different authority levels and different appropriate use cases. A retrieval system that mixes them indiscriminately will produce responses that conflate the apostle Paul with a 20th-century commentator.

The platform maintains separate collection partitions for scripture, patristic commentary (church fathers), historical commentaries (Reformation through 19th century), modern scholarly commentary, and lexical data. Retrieval from each layer is intentional, not incidental.

## The Five Retrieval Strategies

No single retrieval strategy works well across all theological questions. The platform uses five, composing them based on question type.

### 1. Direct Reference Lookup

When the user asks about a specific passage by reference — "What does Romans 5:1 say?" — the right retrieval is not semantic search. It is an exact lookup by reference identifier.

```typescript
async function lookupPassage(ref: string, translation: string): Promise<Passage> {
  // Normalize reference format
  const normalized = normalizeRef(ref);  // "Romans 5:1" → "rom_5_1"

  // Direct database lookup — no embedding, no ANN search
  return db.verses.findOne({
    where: { ref: normalized, translation_id: translation },
  });
}
```

Semantic search for a known reference is worse than direct lookup in every dimension: slower, more expensive, and potentially returns a different verse if the query embedding is slightly closer to a thematically related passage. Direct lookup should be tried first whenever the question contains a parseable reference.

The reference parser handles common formats: "Romans 5:1", "Rom 5:1", "Rom. 5:1", "Romans 5", "Romans 5:1-5", and ranges. Multi-verse ranges are retrieved as individual verses and assembled in canonical order.

### 2. Semantic Similarity Search

The workhorse for topical and conceptual queries. "What does the Bible say about forgiveness?" has no specific reference — it needs semantic search across the full verse corpus.

The design decisions for theological semantic search differ from generic corpora:

**Query expansion for theological vocabulary.** Biblical concepts often have multiple names: "grace" maps to *charis*, *hesed*, "loving-kindness", "mercy", "favor". A query about "grace" should also surface passages about these related concepts. Before embedding the query, a lightweight expansion step adds theological synonyms and related terms drawn from a domain vocabulary:

```typescript
const theologyVocab = {
  grace: ["mercy", "loving-kindness", "favor", "hesed", "charis"],
  salvation: ["redemption", "deliverance", "justification", "atonement"],
  faith: ["belief", "trust", "faithfulness", "pistis"],
  // ...
};

function expandQuery(query: string): string {
  const words = query.toLowerCase().split(/\s+/);
  const expansions = words.flatMap(w => theologyVocab[w] ?? []);
  return [...new Set([...words, ...expansions])].join(" ");
}
```

The expanded query embeds with broader semantic coverage than the raw query, improving recall for the synonymous vocabulary that scripture uses.

**Testament and genre filtering.** A query about "the law" means something different in Psalms (Torah-as-delight) than in Romans (Torah-as-condemning). Filtering by testament and genre before retrieval reduces cross-context noise:

```typescript
const results = await vectorStore.search("bible_verses", {
  vector: queryEmbedding,
  filter: buildFilter(query, userContext),  // infers testament/genre from query context
  limit: 20,
});
```

**High-recall retrieval followed by reranking.** Initial semantic search retrieves top-20 candidates. A cross-encoder reranker then scores each candidate against the full query, reordering results by genuine relevance rather than embedding proximity. Reranking regularly promotes results from position 8-15 to the top 5 — the embedding captures broad semantic similarity; the reranker captures nuanced relevance.

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

### 3. Graph-Based Cross-Reference Traversal

Semantic search cannot find relationships that exist only in the cross-reference graph. Passage A references Passage B not because they share vocabulary but because the author of A was consciously alluding to B.

The New Testament is saturated with Old Testament allusions. Jesus's "blessed are the meek" (Matthew 5:5) quotes Psalm 37:11. "The Lord is with you" greeting to Mary (Luke 1:28) echoes multiple Old Testament passages where the divine presence formula appears. These connections are in the cross-reference database, not detectable by embedding similarity.

Cross-reference retrieval runs in parallel with semantic search for questions where the passage under study is known:

```typescript
async function retrieveWithCrossRefs(
  anchorRef: string,
  query: string
): Promise<RetrievalResult[]> {
  const [semantic, crossRefs] = await Promise.all([
    semanticSearch(query, { excludeRef: anchorRef }),
    graphTraversal(anchorRef, { depth: 2, types: ["REFERENCES", "ALLUDES_TO"] }),
  ]);

  // Merge: cross-references get a boost when they are also semantically relevant
  return mergeWithBoost(semantic, crossRefs, { crossRefBoost: 0.15 });
}
```

Cross-references receive a relevance boost when they are already semantically close to the query. A cross-reference that is both explicitly linked and semantically similar ranks higher than one that is only one or the other.

### 4. Lexical and Linguistic Retrieval

Questions about specific Greek or Hebrew terms require retrieval from the lexicon rather than from the verse corpus. "What is the range of meaning of *agape*?" is a lexical question; the right retrieval is the Strong's entry, word study, and corpus usage statistics, not verse semantic search.

Lexical retrieval is triggered when the query contains:
- Greek or Hebrew terms (detected by character set or common transliteration patterns)
- Strong's numbers ("G26", "H2617")
- Phrases like "the Greek word for", "Hebrew word", "original language"

```typescript
async function lexicalRetrieval(term: string): Promise<LexicalResult> {
  // Try exact match first
  const exact = await lexicon.findByTerm(term);
  if (exact) return exact;

  // Fuzzy match for transliterations
  const fuzzy = await lexicon.fuzzySearch(term, { threshold: 0.85 });
  if (fuzzy.length > 0) return fuzzy[0];

  // Semantic match via embedding
  const semantic = await vectorStore.search("lexicon_entries", {
    vector: await embed(term),
    limit: 3,
  });
  return semantic[0];
}
```

Lexical retrieval is combined with verse corpus retrieval: the lexical entry explains the term's range; the verse corpus shows its usage in context. Both appear in the final prompt context.

### 5. Historical and Commentary Retrieval

Commentary retrieval adds interpretive depth to the retrieved scripture. It is always supplementary — commentary amplifies and contextualizes primary text, never replaces it.

The platform distinguishes three commentary tiers with different authority weightings:

**Primary tier**: Church fathers (pre-Nicene and Nicene) — Origen, Chrysostom, Augustine, Ambrose. These represent the earliest sustained theological interpretation of the texts. Retrieved when questions touch on patristic interpretation, early church practice, or the meaning of disputed terms in their original context.

**Secondary tier**: Reformation and post-Reformation — Calvin, Luther, Owen, Wesley, Spurgeon. Theological tradition that shaped Protestant interpretation. Retrieved for questions about Reformed, Lutheran, or Wesleyan perspectives.

**Modern tier**: 20th-21st century scholarship — F.F. Bruce, N.T. Wright, Douglas Moo, Thomas Schreiner. Technical commentary with historical-critical and grammatical analysis. Retrieved for detailed exegetical questions.

Retrieval from each tier is filtered by the question type and, where available, the user's stated theological tradition:

```typescript
async function commentaryRetrieval(
  query: string,
  passageRef: string,
  userTradition: string | null
): Promise<CommentaryResult[]> {
  const filter: CommentaryFilter = {
    passage_ref: { $eq: passageRef },
  };

  // Weight tiers by question type
  if (isPatristicQuestion(query)) {
    filter.tier = { $eq: "patristic" };
  } else if (userTradition) {
    filter.tradition = { $in: traditionMapping[userTradition] };
  }

  return vectorStore.search("commentary_chunks", {
    vector: await embed(query),
    filter,
    limit: 5,
  });
}
```

## Composing Retrieval Strategies

For most queries, multiple strategies run in parallel and their results are merged before being passed to the model:

```typescript
async function retrieveContext(
  query: string,
  userContext: UserContext
): Promise<RetrievalContext> {
  const questionType = classifyQuestion(query);
  const anchorRef = extractReference(query);

  const retrievals: Promise<RetrievalResult[]>[] = [
    semanticSearch(query, userContext),
  ];

  if (anchorRef) {
    retrievals.push(directLookup(anchorRef, userContext.translation));
    retrievals.push(crossReferenceTraversal(anchorRef, query));
  }

  if (isLexicalQuestion(query)) {
    retrievals.push(lexicalRetrieval(extractTerm(query)));
  }

  if (questionType !== "simple_factual") {
    retrievals.push(commentaryRetrieval(query, anchorRef, userContext.tradition));
  }

  const allResults = (await Promise.all(retrievals)).flat();
  return assembleContext(allResults, query, TOKEN_BUDGET);
}
```

The `assembleContext` function token-budgets the combined results. Scripture receives priority allocation; commentary fills remaining space after scripture. Lexical data is compact and always included when retrieved. The assembled context is ordered: primary text first, cross-references second, lexical data third, commentary last — reflecting authority levels.

::CtaTryApp
---
buttonText: "Try The Live AI App"
supportingCopy: "Try the RAG-powered Bible study app these patterns were built for."
destinationUrl: "https://bibleverse.donavanjones.com/register"
---
::

## Evaluation: Does Retrieval Actually Work?

Retrieval quality is measured against a ground-truth evaluation set of 300 query/result pairs built from actual platform usage and manually annotated:

```json
{
  "query": "What does the Bible say about anxiety and worry?",
  "expected_top_5": [
    "phil_4_6",
    "matt_6_25",
    "1pet_5_7",
    "ps_55_22",
    "matt_6_34"
  ],
  "expected_in_top_10": [
    "luke_12_22",
    "john_14_27",
    "isa_41_10"
  ],
  "should_not_appear": ["rom_8_28"]  // often retrieved incorrectly for anxiety queries
}
```

Metrics tracked:

**Recall@5**: fraction of ground-truth top-5 results that appear in the system's top 5. Target: ≥ 0.80 for theological queries.

**Precision@5**: fraction of the system's top 5 that are in the ground truth relevant set. Measures noise — irrelevant results crowding out relevant ones.

**Mean Reciprocal Rank**: how high in the result list the first ground-truth result appears. Measures whether the best match is at position 1 or buried.

**Negative recall**: does the system correctly avoid the `should_not_appear` passages? These are passages that are semantically similar but contextually wrong — Romans 8:28 ("all things work for good") appearing in anxiety queries is a retrieval error even though it is thematically adjacent.

The evaluation runs weekly in production and after any change to the retrieval pipeline (new embedding model, changed chunking, updated cross-reference data). A recall@5 drop of more than 3 points triggers a review before the change ships to production.

## What Good Retrieval Enables

The quality ceiling for RAG-based theological responses is determined by retrieval. A model that receives the five most relevant passages, the precise lexical definition of the key term, and the most pertinent commentary excerpt will produce a better answer than a model that receives ten vaguely relevant passages and no lexical context — regardless of model capability.

Retrieval engineering is not glamorous work. Tuning query expansion vocabulary, calibrating cross-reference boost weights, evaluating tier weighting for commentary — none of it feels like building AI. But the hours spent on retrieval quality compound directly into the quality of every answer the platform produces. It is the most leverage-rich engineering work in the system.

The next two articles go deeper into two components of this pipeline: chunking strategies for religious texts (article 10) and semantic retrieval techniques (article 12).

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
  buttonText: "Read: Chunking Religious Texts"
  supportingCopy: "Continue with \"Chunking Religious Texts\" for the next piece of this system."
  destinationUrl: "/blog/ai-engineering/10-chunking-religious-texts"
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
  - label: "Biblical Hermeneutics — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Biblical_hermeneutics"
    type: "wikipedia"
    description: "According to this overview, hermeneutics is the discipline of interpreting scripture — the domain that theological retrieval systems must serve accurately."
  - label: "Information Retrieval — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Information_retrieval"
    type: "wikipedia"
    description: "Foundational field covering relevance, precision, and recall — the metrics that define retrieval quality in theological AI systems."
  - label: "Dense Passage Retrieval for Open-Domain QA (Karpukhin et al., 2020)"
    url: "https://doi.org/10.48550/arXiv.2004.04906"
    type: "doi"
    description: "Facebook AI research establishing dense vector retrieval as superior to sparse keyword matching for open-domain question answering."
  - label: "Lexical Semantics — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Lexical_semantics"
    type: "wikipedia"
    description: "The study of word meaning — directly relevant to theological retrieval where single Greek or Hebrew terms carry dense, contested meaning."
---
::

---

*[← Back to AI Engineering](/categories/ai-engineering)*
