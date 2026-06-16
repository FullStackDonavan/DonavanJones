---
title: "Semantic Retrieval"
description: "Semantic retrieval techniques for theological AI systems."
date: 2026-05-26
lastUpdated: "2026-06-09"
category: "ai-engineering"
tags:
  - ai-engineering
  - retrieval
  - semantic
draft: false
slug: semantic-retrieval
author: Donavan Jones
---

# Semantic Retrieval

Semantic retrieval is the process of finding content that means what a query means — not content that contains the same words, but content that addresses the same concepts, questions, or ideas. It is the retrieval technique that makes RAG-based AI systems useful for natural language questions rather than just keyword lookups.

Earlier articles covered the infrastructure of semantic retrieval (vector databases, embedding services) and the domain-specific design of retrieval systems for theology. This article focuses on the techniques themselves: how semantic retrieval works at the query-document matching level, where it succeeds and where it predictably fails for theological content, and the practical methods used to compensate for its failures.

*Part of the [AI Engineering series](/categories/ai-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every ai engineering deep-dive in this series."
destinationUrl: "/categories/ai-engineering"
---
::

## What Semantic Retrieval Is Actually Measuring

Semantic retrieval measures cosine similarity between two vectors in a high-dimensional space. High similarity means the query and the document are close together in the space the embedding model learned to represent meaning.

But similarity in embedding space is not the same as relevance to a question. This conflation is the source of most semantic retrieval failures.

Consider a query about "Paul's teaching on predestination." The most semantically similar passages in the embedding space might include:
- Romans 8:29-30 — directly relevant, discusses foreknowing and predestining
- Ephesians 1:4-5 — directly relevant, chosen before the foundation of the world
- Romans 9:11 — directly relevant, God's purpose in election
- Ephesians 2:8-9 — semantically adjacent (salvation, grace, not works) but not specifically about predestination
- John 6:44 — "No one can come to me unless the Father draws him" — relevant but different framing
- A Calvinist commentary excerpt using the word "predestination" frequently — retrieved by keyword density in the embedding, not by conceptual fit

The first three are what the user probably wants. The last three are semantically adjacent but not the most helpful responses. The commentary may rank high simply because "predestination" is a rare term that dominates its embedding vector — a form of semantic keyword bias.

Understanding this helps calibrate when semantic retrieval is sufficient on its own and when it needs to be supplemented.

## The Semantic Retrieval Pipeline in Detail

The full pipeline from query to ranked candidates has five stages that each offer tuning opportunities:

### Stage 1: Query Analysis

Before embedding, classify the query to determine which retrieval strategies are appropriate.

```typescript
interface QueryAnalysis {
  type: "direct_lookup" | "topical" | "comparative" | "interpretive" | "lexical";
  hasExplicitRef: boolean;     // "Romans 8:28"
  hasGreekHebrew: boolean;     // transliterated or Unicode terms
  isComparative: boolean;      // "compare X and Y", "difference between"
  testament: "old" | "new" | "both" | "unknown";
  keyEntities: string[];       // persons, books, themes extracted
  complexity: "simple" | "moderate" | "complex";
}

function analyzeQuery(query: string, history: Turn[]): QueryAnalysis {
  return {
    type: classifyQueryType(query),
    hasExplicitRef: /\b[1-3]?\s*[A-Za-z]+\s+\d+:\d+/.test(query),
    hasGreekHebrew: /[Ͱ-Ͽ֐-׿]/.test(query) || hasTransliteration(query),
    isComparative: /\b(compare|difference|contrast|versus|vs\.?|versus)\b/i.test(query),
    testament: inferTestament(query, history),
    keyEntities: extractEntities(query),
    complexity: assessComplexity(query, history),
  };
}
```

The classification determines: which embedding strategy to use (raw query, rewritten query, or HyDE), which collections to search, what filters to apply, and whether to run cross-reference traversal in parallel.

### Stage 2: Query Embedding

Covered in detail in article 11. The short version: complex queries use HyDE; short queries use rewriting; follow-up queries embed the full conversational context. Simple direct lookups skip embedding entirely.

### Stage 3: Candidate Retrieval

ANN search returns the top-k candidates by approximate cosine similarity. Two design decisions at this stage:

**k selection**: retrieving too few candidates (k=5) risks missing the best passage if approximate search places it at position 6. Retrieving too many (k=50) floods the reranker with noise and slows reranking. For theological content, k=20 is the default; complex comparative queries use k=30 to ensure broad coverage.

**Score thresholding**: candidates with similarity scores below 0.55 are discarded before reranking. Scores below this threshold reliably indicate poor semantic match — passing them to the reranker wastes compute and occasionally produces confusing results where a low-quality match gets promoted.

```typescript
const MIN_SIMILARITY = 0.55;

const rawCandidates = await vectorStore.search("bible_verses", {
  vector: queryEmbedding,
  filter: buildQueryFilter(analysis),
  limit: analysis.complexity === "complex" ? 30 : 20,
});

const candidates = rawCandidates.filter(c => c.score >= MIN_SIMILARITY);
```

The 0.55 threshold is empirically determined from the evaluation set — it is the score below which recall@5 improvement from including the candidate is statistically insignificant while precision@5 drops meaningfully.

### Stage 4: Reranking

The reranker is a cross-encoder model that scores each candidate against the full query text. Where the bi-encoder embedding model produces approximate similarity by comparing independent vectors, the cross-encoder processes the query and document together — it sees the full text of both simultaneously and computes a more accurate relevance score.

The quality improvement from reranking is consistent and significant. For a theological query like "What does Hebrews say about Jesus as the fulfillment of Old Testament priesthood?", the top-5 after embedding retrieval contains several accurate results but also one or two passages retrieved because they share "priesthood" or "fulfillment" vocabulary in a different context. After reranking, those are typically displaced to positions 8–12 while more genuinely relevant passages move up.

```typescript
async function rerank(
  query: string,
  candidates: RetrievalCandidate[],
  topN: number = 5
): Promise<RetrievalCandidate[]> {
  const scores = await crossEncoderModel.score(
    candidates.map(c => ({ query, passage: c.text }))
  );

  return candidates
    .map((c, i) => ({ ...c, rerankScore: scores[i] })
    .sort((a, b) => b.rerankScore - a.rerankScore)
    .slice(0, topN);
}
```

The reranker runs on the local GPU (article 13 in the Backend Engineering series). Latency: 20–30ms for 20 candidates. This is in the request path; the latency is justified by the retrieval quality improvement.

### Stage 5: Result Assembly

The top-N reranked candidates are assembled into the context block passed to the model. Assembly decisions:

**Deduplication**: if the same passage appears from multiple retrieval strategies (semantic search + cross-reference + direct lookup), it is included once with a provenance tag indicating how it was found.

**Ordering within context**: primary text first, then cross-references, then commentary. Research on LLM attention suggests earlier context gets more weight; primary text should be first.

**Snippet extraction**: for long chunks (commentary excerpts), extract the 150-token window most relevant to the query rather than passing the full 600-token chunk. Relevance of specific sentences is scored by the reranker's attention weights when available.

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

## Where Semantic Retrieval Fails for Theology

Knowing the failure modes lets you design around them. Four consistent failure patterns:

### Semantic Proximity Without Relevance

The most frequent failure: passages that are about the same general topic but do not answer the specific question. A query about "Paul's view of the law in Romans 7" retrieves all Romans passages about the law — including Romans 3, Romans 4, Romans 6, Romans 10 — because they share the same semantic neighborhood as Romans 7 content.

The fix is always more specific context. A query that says "Romans 7 specifically, Paul's description of the inner struggle" retrieves more precisely. When the user's query is naturally short and vague, query rewriting (article 11) helps. When the user is asking a follow-up question in context, embedding the full conversational context helps.

### Rare Concept Drift

Rare theological terms — *hypostatic union*, *perichoresis*, *communicatio idiomatum* — appear infrequently in training data. The embedding model represents them less precisely. A query containing these terms produces a vector that drifts toward more common theological vocabulary rather than the specific concept.

The glossary normalization strategy from article 11 partially addresses this. Another approach: use BM25 keyword search as a supplementary signal for queries containing rare terms. BM25 does not drift — "hypostatic union" retrieves documents containing exactly those tokens. Combining sparse BM25 retrieval with dense semantic retrieval (hybrid search) ensures rare terminology is handled precisely while common conceptual vocabulary benefits from semantic matching.

### Negation Blindness

Embedding models are largely insensitive to negation. "Passages that do NOT discuss salvation by works" embeds nearly identically to "passages that discuss salvation by works" — the semantic representation of the concept dominates; the negation is not strongly encoded.

A query like "What does Paul say that contradicts the idea that salvation requires human effort?" may retrieve passages about salvation and effort — exactly the content the user wants to reason against, but not what they want to surface as evidence.

Negation queries require post-retrieval filtering: retrieve broadly on the positive concept, then filter the result set by whether the passage's content supports or contradicts the relevant claim. This filtering step is an LLM call, not a retrieval operation.

### Theological Register Misalignment

A user asking "Is God controlling everything that happens?" is asking what a theologian would call a question about divine providence, sovereignty, and the problem of evil. The embedding of the user's question lives in colloquial language space. The relevant content lives in formal theological register.

If the embedding model's representation of "God controlling everything" is not proximate to "divine sovereignty" and "meticulous providence" in the embedding space, the semantic search surfaces conversational-register content (devotional passages about trusting God) rather than the systematic theological content that best addresses the question.

Mitigations: theological vocabulary expansion (article 11), query rewriting to include theological register terms, and maintaining separate collections for devotional vs systematic theological content so each can be searched with appropriate weight.

## Hybrid Semantic + Lexical Retrieval

Pure semantic retrieval and pure keyword (BM25) retrieval each have characteristic failure modes. Semantic fails on rare terminology and negation. BM25 fails on synonyms, paraphrases, and conceptual matches without shared vocabulary.

Hybrid retrieval combines both scores using a weighted sum:

```
final_score = α × semantic_score + (1 - α) × bm25_score
```

The optimal α depends on the query type:

| Query Type | α (semantic weight) | Reason |
|---|---|---|
| Rare theological terms | 0.3 | BM25 handles precise vocabulary better |
| Conceptual questions | 0.85 | Semantic handles meaning across vocabulary |
| Name/person/place lookups | 0.2 | BM25 matches proper nouns precisely |
| Cross-translation retrieval | 0.95 | Semantic bridges translation vocabulary gaps |
| Follow-up in context | 0.8 | Semantic captures conversational intent |

Rather than a fixed α, the platform uses query analysis to select an α dynamically:

```typescript
function selectHybridAlpha(analysis: QueryAnalysis): number {
  if (analysis.hasGreekHebrew) return 0.35;
  if (analysis.type === "direct_lookup") return 0.1;
  if (analysis.isComparative) return 0.8;
  if (analysis.keyEntities.some(e => isProperNoun(e))) return 0.4;
  return 0.75; // default: semantic-leaning
}
```

BM25 search runs against the full-text index in Postgres (using `tsvector` and `ts_rank`). The scores from Postgres BM25 and Qdrant semantic search are normalized to a common 0-1 range before combining.

## Contextual Compression

Retrieval returns chunks. Chunks contain context. Not all of that context is relevant to the specific query. **Contextual compression** extracts only the relevant portions of each retrieved chunk before passing it to the model.

For a 600-token commentary chunk on Romans 8, a query about "the meaning of *synergei* in verse 28" might only need the 80-token section that discusses the Greek verb — the rest of the chunk, however accurate, dilutes the context window with less relevant material.

```typescript
async function compressChunk(
  query: string,
  chunk: RetrievalChunk
): Promise<string> {
  if (chunk.tokens <= 150) return chunk.text; // Too short to compress meaningfully

  const compressed = await fastModel.complete({
    prompt: `Extract only the sentences from this passage that are directly relevant 
to answering: "${query}"

Passage:
${chunk.text}

If the entire passage is relevant, return it unchanged. If no part is relevant, 
return "NOT_RELEVANT". Otherwise, return only the relevant sentences.`,
    maxTokens: 200,
  });

  if (compressed === "NOT_RELEVANT") return null;
  return compressed;
}
```

Contextual compression improves context window utilization — the model receives denser relevant information per token. The tradeoff: one lightweight model call per chunk. With k=5 final chunks, this adds 5 fast model calls to the retrieval path.

I use contextual compression selectively: for commentary chunks over 300 tokens when the query is specific (low complexity queries don't need it; their relevant passages are naturally short), and never for verse-level scripture chunks which are already minimal units.

::CtaTryApp
---
buttonText: "Try The Live AI App"
supportingCopy: "Try the RAG-powered Bible study app these patterns were built for."
destinationUrl: "https://bibleverse.donavanjones.com/register"
---
::

## Retrieval Evaluation: The Continuous Loop

Semantic retrieval quality is not fixed after initial deployment. User behavior reveals gaps: queries that produce irrelevant results, searches that frustrate users into rephrasing, questions where the model's response indicates its context was unhelpful.

The continuous evaluation loop:

1. **Log retrieval results** alongside user feedback signals (explicit thumbs down, follow-up clarification requests, session abandonment after a response)
2. **Cluster low-satisfaction queries** by type — rare vocabulary, negation, cross-translation, comparative
3. **Add annotated examples** to the evaluation set from the clusters (50 per quarter)
4. **Test retrieval improvements** (new embedding strategy, different α, new chunking) against the expanded evaluation set
5. **Deploy improvements** that show measurable gain on new examples without regression on old ones

The evaluation set grows from 300 to 500 to 1000 annotated examples over successive quarters. The larger set makes improvements more detectable and regressions more apparent. It is the connective tissue between retrieval engineering effort and measurable user experience improvement.

Semantic retrieval feels solved once the infrastructure is in place. It is not — it is a continuous engineering discipline of finding where retrieval fails for your specific content and users, fixing those failures, and not breaking what works. The infrastructure makes iteration cheap; the evaluation set makes it measurable.

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
  buttonText: "Read: Citation Grounding"
  supportingCopy: "Continue with \"Citation Grounding\" for the next piece of this system."
  destinationUrl: "/blog/ai-engineering/13-citation-grounding"
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
  - label: "Semantic Similarity — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Semantic_similarity"
    type: "wikipedia"
    description: "Defines the semantic similarity concept that embedding-based retrieval operationalizes — and its limits as a proxy for relevance."
  - label: "Okapi BM25 — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Okapi_BM25"
    type: "wikipedia"
    description: "According to this overview, BM25 is the sparse keyword retrieval baseline that dense semantic search is benchmarked against — and often combined with via hybrid search."
  - label: "Cosine Similarity — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Cosine_similarity"
    type: "wikipedia"
    description: "The distance metric used in semantic retrieval — understanding it clarifies why topically related but lexically distant content is found or missed."
  - label: "Dense Passage Retrieval for Open-Domain QA (Karpukhin et al., 2020)"
    url: "https://doi.org/10.48550/arXiv.2004.04906"
    type: "doi"
    description: "Established that dense retrieval outperforms BM25 for natural language questions — the evidence base for semantic retrieval over keyword search."
---
::

---

*[← Back to AI Engineering](/categories/ai-engineering)*
