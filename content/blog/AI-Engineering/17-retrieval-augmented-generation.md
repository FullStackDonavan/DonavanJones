---
title: "Retrieval Augmented Generation"
description: "Using retrieval augmented generation in theological AI pipelines."
date: 2026-06-08
lastUpdated: "2026-06-09"
category: "ai-engineering"
tags:
  - ai-engineering
  - retrieval
  - generation
draft: false
slug: retrieval-augmented-generation
author: Donavan Jones
---

# Retrieval Augmented Generation

The earlier articles in this series have covered individual components of retrieval-augmented generation in detail: vector databases, embedding strategies, semantic retrieval, chunking, citation grounding, hallucination reduction, and prompt engineering. This article steps back and explains the whole: what RAG is, why it is the right architecture for theological AI specifically, how the retrieval and generation sides interact, and the design decisions that make the difference between a RAG system that feels like a knowledgeable guide and one that feels like an expensive search engine with a language model stapled to the end.

*Part of the [AI Engineering series](/categories/ai-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every ai engineering deep-dive in this series."
destinationUrl: "/categories/ai-engineering"
---
::

## What RAG Is and Why It Exists

Language models are trained on a fixed corpus. Once training ends, the model's knowledge is frozen. It knows what it learned and nothing more. For many applications this is fine — a model trained on enough text has broad general knowledge. But for applications that require specific, authoritative, up-to-date, or verifiable knowledge, frozen training knowledge is a serious limitation.

Theological AI has all four requirements. The knowledge base is specific: it is not general knowledge about religion, it is the specific texts of the Biblical canon, specific lexicons, specific commentaries, specific cross-references. It is authoritative: users are not asking for opinions about what the Bible says, they are asking what the Bible actually says and they need to be able to check the answer. It is personal: a good Bible study assistant knows what *this* user has studied, what questions they have asked before, what passages matter to them. And it is verifiable: every claim should be traceable to a source that the user can read.

Retrieval-augmented generation is the architectural response to these requirements. Rather than relying on what the model learned in training, RAG retrieves relevant content from an external knowledge base at query time and places it in the model's context window before generating. The model then generates from evidence — it reads the actual verse text, the actual lexical definition, the actual commentary — rather than from memory.

The key insight: the model does not need to know everything. It needs to read carefully and reason well. RAG separates these concerns. The knowledge base handles what is known; the model handles how to reason about it.

## The Architecture

RAG is not a single fixed architecture. It is a family of patterns that share the core structure: retrieve relevant content, inject it into the context, generate from the augmented context. The specifics vary significantly. On this platform, the full architecture looks like this:

```
Knowledge Base                    Request Path
──────────────                    ────────────
Bible corpus (31k+ verses)        User question
  × 4 translations                     │
Commentary library                     ▼
  (Reformed, Evangelical,         Query analysis
   Patristic, Historical)              │
Lexical resources                      ▼
  (BDAG, BDB, Strong's)           Retrieval (parallel)
Cross-reference graph             ├─ Vector search (Qdrant)
User notes                        ├─ Keyword search (BM25)
User memory                       ├─ Graph traversal (AGE)
                                  └─ Direct lookup
                                       │
                                       ▼
                                  Reranking
                                  (cross-encoder)
                                       │
                                       ▼
                                  Context assembly
                                  (retrieval + memory
                                   + conversation history)
                                       │
                                       ▼
                                  Generation (Claude)
                                       │
                                       ▼
                                  Post-processing
                                  (citation verification,
                                   memory extraction)
                                       │
                                       ▼
                                  Response to user
```

The architecture has three major components — the knowledge base, the retrieval pipeline, and the generation pipeline — each with design decisions that affect the whole.

## The Knowledge Base

The knowledge base is not a database of facts. It is a structured library of source texts, each indexed in a form that enables relevant retrieval.

**Structuring for retrieval** means every unit in the knowledge base has been chunked, embedded, and stored with metadata appropriate to its content type. Bible verses are stored individually — one embedding per verse per translation, 31,000+ embeddings across four translations. Commentary is stored in argument-aware chunks of 300–600 tokens with context headers. Lexical entries are stored as complete units. Cross-references are edges in a graph database, not embeddings.

The structure reflects the retrieval semantics of each content type. Verses are retrieved by semantic similarity; the 31k×4 collection handles this. Cross-references are retrieved by structural relationship; the graph handles this. Lexical entries are retrieved by exact term match or semantic similarity; a dedicated lexical collection handles this. Using one storage system for everything — flattening all content types into one semantic index — would produce worse retrieval across the board.

**Maintaining provenance** means every stored chunk carries enough metadata to be cited accurately. Source, author, passage reference, tradition, retrieval method, score. When the model generates a citation, the citation is constructed from this metadata, not inferred from the chunk text. Provenance is stored, not derived.

**Keeping the knowledge base current** is a concern for commentary and user notes, not scripture. Scripture does not change. Commentary additions are infrequent — a new work added to the library triggers the ingest pipeline but is not a routine operation. User notes are written in real time and ingested synchronously within the request path; the note embedding is available for retrieval within seconds of the note being saved.

## The Retrieval Pipeline

Retrieval is not lookup. This is the most important framing difference between a RAG system that works and one that does not.

Lookup is deterministic: given an exact key, return the exact value. It works for reference lookups — "give me Romans 8:28 in ESV" — but not for semantic questions. "What does Paul teach about suffering?" has no key. The answer is distributed across dozens of passages, multiple commentaries, and cross-references that connect Paul's letters to the Psalms and to Job. Retrieval is the process of finding all of it, ranking it by relevance, and presenting the best of it.

### The Multi-Strategy Approach

A single retrieval strategy is insufficient for theological content. Different query types need different retrieval mechanisms:

**Semantic search** (dense vector retrieval) finds passages that mean what the query means, even when they use different vocabulary. Essential for topical queries: "What does the Bible say about forgiveness?" retrieves relevant passages regardless of which specific words they use.

**Keyword search** (sparse BM25 retrieval) finds passages that use specific vocabulary. Essential for precise terminological queries: "Find passages that use the word *propitiation*." Semantic search on this query might retrieve passages about atonement theory generally; BM25 finds exactly the term.

**Graph traversal** finds passages connected by established cross-reference relationships. Essential for canonical themes: starting from Genesis 3:15 and following the seed-of-the-woman thread through scripture requires graph traversal, not similarity search.

**Direct lookup** finds an exact passage by reference. Essential for reference queries: "Show me Romans 8:28-30."

These strategies are not alternatives. They are complementary, and the retrieval pipeline runs all four in parallel, merging results with source-specific weights.

```typescript
async function multiStrategyRetrieval(
  query: string,
  analysis: QueryAnalysis
): Promise<MergedResults> {
  const strategies: Promise<RetrievalResult[]>[] = [
    vectorSearch(query, analysis),
    bm25Search(query, analysis),
  ];

  if (analysis.hasExplicitRef) {
    strategies.push(directLookup(analysis.explicitRefs));
  }

  if (analysis.hasExplicitRef || analysis.keyEntities.length > 0) {
    strategies.push(graphTraversal(analysis.explicitRefs, analysis.keyEntities));
  }

  const results = await Promise.all(strategies);
  return mergeResults(results, STRATEGY_WEIGHTS);
}
```

The conditional execution matters: graph traversal and direct lookup are only triggered when the query analysis identifies references or entities that warrant them. Running graph traversal on every query would add unnecessary latency for queries where it will return nothing useful.

### Reranking

The initial retrieval returns k=20–30 candidates. The top-k by vector similarity or BM25 score is a noisy ranking — semantic proximity does not equal relevance to the specific question. Reranking corrects this.

A cross-encoder model receives each (query, candidate) pair and produces a more accurate relevance score. Unlike the bi-encoder embedding model that produces independent vectors for query and document, the cross-encoder processes both together — it sees the full text of the query and the candidate simultaneously and computes their interaction. This produces more accurate relevance scores at higher latency.

The latency cost (20–30ms for 20 candidates) is justified by consistent quality improvement. The top-5 after reranking are reliably more relevant than the top-5 by initial ranking alone. The improvement is most pronounced for queries where the most relevant passage uses different vocabulary than the query — semantic search ranks it low initially; the cross-encoder promotes it because it recognizes the conceptual relationship.

### The Retrieval-Generation Gap

The single most common RAG failure is retrieving the right content and then not using it. This happens when:

- The retrieved content is too deep in the context window to receive attention
- The retrieved content is relevant but not highlighted as relevant to the specific question
- The model's generation habits (from training) override the retrieved evidence

All three are addressable through context assembly design:

**Position matters.** The retrieved evidence should appear immediately before the user's question — not at the top of a 100k-token context window where it will receive diluted attention. The context assembly order: user profile, conversation history, retrieved evidence, retrieval quality signal, user question.

**Labels matter.** Retrieved content is labeled by source type and authority (SCRIPTURE, LEXICAL RESOURCE, COMMENTARY). Labels help the model prioritize content by epistemic weight rather than treating all retrieved text as equivalent.

**Constraints matter.** The system prompt instruction "base your response on the provided context" is not magical, but it is real. Combined with citation requirements that force the model to reference specific passages, it significantly increases the probability that generation uses what was retrieved rather than falling back to training memory.

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

## The Generation Pipeline

Generation is the last step, not the most important step. By the time the model generates, the hard work should be done: the right evidence assembled, the context structured to surface what matters, the constraints specified to prevent the failure modes.

What makes generation work in a RAG system:

**Constrained generation.** The model is not asked to know things — it is asked to synthesize evidence. The system prompt frames it this way: "Based on the scripture and resources provided..." The model that generates well in a RAG context is one that reads and reasons rather than one that recalls and reports.

**Citation as structure.** Requiring citations throughout the response forces the model to anchor each claim to specific evidence. This is not just for user trust — it changes how the model generates. When every claim needs a `[CITE: ref]`, the model has to confirm that the claim is actually supported before making it. This self-checking behavior is a consequence of the citation requirement, not a separate instruction.

**Hedging instructions.** Explicit instructions to hedge when evidence is limited ("The text does not directly address..." "Theologians disagree on...") counteract the training-distribution bias toward confident generation. Without these instructions, the model produces confident responses from limited evidence. With them, confidence tracks evidence.

**Token budget management.** The generation token budget is computed from what is left after context assembly. Context assembly is bounded by design — retrieval is capped at 40% of the total context window, history at 30%, memory at 20% — so generation always has room. Running out of token budget mid-response is a preventable failure, and the budget management prevents it.

## What RAG Does Not Solve

RAG is a significant improvement over pure generation from training memory. It is not a complete solution to the problems of AI-generated theological content.

**RAG does not solve hallucination.** It significantly reduces it by grounding generation in retrieved evidence. But the model can still hallucinate within the constraints — asserting that retrieved content says something it does not, making connections between passages that are not supported, generating plausible-sounding interpretations that have no scholarly basis. The hallucination reduction techniques in article 14 address this, but no combination of techniques eliminates it.

**RAG does not solve interpretive bias.** The retrieval system returns what is in the knowledge base. If the knowledge base over-represents one theological tradition, retrieval will consistently surface that tradition's interpretation and underrepresent others. The knowledge base design — balanced commentary representation across Reformed, Evangelical, Arminian, Anglican, Catholic, and Patristic traditions — is as important as the retrieval quality.

**RAG does not solve context window limits.** A user who has studied a book of the Bible across 40 sessions has accumulated more context than fits in any model's context window. Memory compression, semantic summarization, and episodic memory retrieval (article 19) address this, but they are imperfect approximations. The model never has complete context about what a user has learned.

**RAG does not replace human judgment.** The platform's most important feature is that it surfaces evidence and options, not that it provides answers. A user who reads "Reformed commentators tend to read this verse as supporting unconditional election, while Arminian commentators read it as conditional" has what they need to form their own view. A user who reads "this verse teaches unconditional election" has been given a theological conclusion dressed as evidence. RAG helps make the first kind of response easier to produce. The prompt design, content constraints, and uncertainty expressions ensure it actually happens.

::CtaTryApp
---
buttonText: "Try The Live AI App"
supportingCopy: "Try the RAG-powered Bible study app these patterns were built for."
destinationUrl: "https://bibleverse.donavanjones.com/register"
---
::

## Evaluating the Full System

RAG quality is end-to-end quality. Retrieval precision and generation quality are necessary but not sufficient to evaluate individually. The metric that matters is whether the user's question was answered well — grounded in the text, accurate to what the text says, honest about uncertainty, useful for study.

The evaluation set covers five question categories:

| Category | What it tests | Pass criteria |
|---|---|---|
| Direct reference | Retrieval precision + accurate quotation | Exact verse retrieved and quoted correctly |
| Topical survey | Multi-passage retrieval + synthesis | Top passages retrieved; balanced tradition representation |
| Interpretive question | Contested claim handling | Disagreement acknowledged; no false consensus |
| Word study | Lexical retrieval + semantic range | Correct lexical entry retrieved; range presented not collapsed |
| Personal application | Memory integration + appropriate hedging | Prior study context referenced; application offered not imposed |

Evaluation runs after each significant change to retrieval strategy, system prompt, model version, or knowledge base content. A change that improves direct reference handling should not degrade topical survey performance. End-to-end evaluation catches these cross-category regressions that component-level metrics miss.

The platform runs continuous evaluation on a sample of production queries (with user permission and privacy controls). Production queries reveal failure patterns that synthetic test sets do not — the unexpected combinations, the edge cases, the ways users phrase questions that no test writer would have predicted. Production evaluation is how the system improves over time rather than only at deployment time.

RAG is not a feature or a product — it is a system discipline. Every component matters: the knowledge base structure, the chunking, the embedding strategy, the retrieval pipeline, the context assembly, the prompt design, the generation constraints, the post-processing, the evaluation. Getting one component right while leaving another unaddressed produces a system that works in some cases and fails in others. The work is getting all of them right, together, for the specific domain they serve.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The AI Starter Kit"
  supportingCopy: "Get the Self-Hosted AI Starter Kit — Ollama setup, RAG architecture diagrams, embedding pipeline templates, and FastAPI examples ($29)."
  destinationUrl: "/products/self-hosted-ai-starter-kit"
  price: "$29"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Theological Consistency"
  supportingCopy: "Continue with \"Theological Consistency\" for the next piece of this system."
  destinationUrl: "/blog/ai-engineering/18-theological-consistency"
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
  - label: "Retrieval-Augmented Generation — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation"
    type: "wikipedia"
    description: "Overview of the RAG pattern, its components, and its role in grounding generative AI responses in external knowledge."
  - label: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (Lewis et al., 2020)"
    url: "https://doi.org/10.48550/arXiv.2005.11401"
    type: "doi"
    description: "The original RAG paper from Meta AI — introduced the retrieve-then-generate architecture and demonstrated its advantages over purely parametric models."
  - label: "Dense Passage Retrieval for Open-Domain QA (Karpukhin et al., 2020)"
    url: "https://doi.org/10.48550/arXiv.2004.04906"
    type: "doi"
    description: "According to this research, dense retrieval is the component that makes RAG work — showing bi-encoder retrieval outperforms BM25 for open-domain questions."
  - label: "Information Retrieval — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Information_retrieval"
    type: "wikipedia"
    description: "Foundational discipline covering document indexing, ranking, and relevance — the theoretical underpinning of the retrieval side of RAG."
---
::

---

*[← Back to AI Engineering](/categories/ai-engineering)*
