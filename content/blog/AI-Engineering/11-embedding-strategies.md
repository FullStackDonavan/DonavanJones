---
title: "Embedding Strategies"
description: "Embedding strategies for semantic retrieval in theology."
date: 2026-05-20
category: "ai-engineering"
tags:
  - ai-engineering
  - embeddings
  - retrieval
draft: false
slug: embedding-strategies
author: Donavan Jones
---

# Embedding Strategies

Earlier articles in this series covered what embeddings are (article 02), how the embedding service is built (Backend Engineering article 09), and how retrieval systems for theology are structured (article 09). This article sits between those layers: the specific decisions about how theological content is embedded that determine what the retrieval system can and cannot find.

Embedding strategies are the choices made at the interface between text and vector: which model, which representation of the text, how to handle domain-specific vocabulary, how to embed asymmetric queries vs documents, and how to evaluate whether the strategy is working for the specific domain. Generic embedding strategies work for generic content. Theological content has properties that reward domain-specific choices.

*Part of the [AI Engineering series](/categories/ai-engineering).*

## The Asymmetry Problem

The most important embedding strategy decision for RAG systems is often the least discussed: queries and documents are different kinds of text, and a good embedding model handles this asymmetry deliberately.

A Bible verse: "And we know that for those who love God all things work together for good, for those who are called according to his purpose." — Romans 8:28

A user query: "Does God cause bad things to happen for a reason?"

These texts are semantically related — the verse answers the question — but they look very different. The verse is declarative, uses archaic second-person-free construction, and employs theological vocabulary ("called," "purpose"). The query is interrogative, colloquial, and uses plain language.

An embedding model that treats both as identical inputs and maps them to the same semantic space will produce lower similarity scores between these two texts than the semantic relationship warrants, because the surface form difference overwhelms the meaning similarity.

Modern embedding models address this with **asymmetric training**: query encoders and document encoders are fine-tuned differently, producing representations where query vectors and document vectors are comparable even though they come from different distributions. OpenAI's `text-embedding-3` models and models like `intfloat/e5-large` use this approach.

The practical implication: use models with documented asymmetric training for RAG retrieval tasks. Do not use models that only demonstrate performance on symmetric similarity (sentence pair comparison). Check the model card for retrieval benchmarks (BEIR, MTEB retrieval subset) rather than semantic textual similarity benchmarks.

## Query Representation: What You Actually Embed

The user's raw message is rarely the best text to embed for retrieval. Several transformations improve retrieval quality:

### Hypothetical Document Embedding (HyDE)

Instead of embedding the question, generate a hypothetical answer and embed that. The hypothesis is a document-form text that lives in the same distributional space as the actual documents being retrieved.

A user asks: "What does Hebrews teach about Jesus as high priest?"

Raw query embedding: a vector for an interrogative sentence about priestly theology.

HyDE approach: use a fast model call to generate a 2-3 sentence hypothetical answer, then embed that:

```typescript
async function hydeEmbed(query: string): Promise<number[]> {
  // Generate a plausible answer in document form
  const hypothesis = await fastModel.complete({
    prompt: `Write a 2-3 sentence answer about this topic as if from a Bible commentary: "${query}"`,
    maxTokens: 100,
  });

  // Embed the hypothesis, not the query
  return embeddingService.embed(hypothesis);
}
```

The hypothesis might produce: "Hebrews presents Jesus as the ultimate high priest who, unlike the Levitical priests, offered himself as the perfect sacrifice once for all. His priesthood is after the order of Melchizedek, surpassing the Levitical order in permanence and efficacy. As high priest, he intercedes for believers at the right hand of God."

This text lives in the same distributional space as commentary chunks. Embedding it retrieves commentary that discusses priestly theology in document-form language — which is where the best answers are.

HyDE adds one model call to the retrieval path. The tradeoff: better recall on complex theological questions at the cost of 300–500ms additional latency. For the platform's retrieval path, HyDE is used selectively — for complex interpretive questions where the user query is short and the target content is dense, not for direct reference lookups or simple factual queries where the raw query embeds well.

### Query Rewriting

Short queries embed poorly because they lack context. "Grace Romans" is a 3-token query that embeds to a broad semantic blob — "grace" and "Romans" are both highly polysemous in theological content. A rewritten version with more context embeds more precisely:

```typescript
async function rewriteQuery(
  query: string,
  conversationContext: string
): Promise<string> {
  return fastModel.complete({
    prompt: `Rewrite this theological search query as a complete, specific question 
that captures the user's intent. Include relevant theological terms.

Conversation context: ${conversationContext}
Original query: "${query}"

Rewritten query:`,
    maxTokens: 60,
  });
}

// "Grace Romans" → "What does Paul teach about God's grace in the book of Romans, 
// particularly in relation to salvation and righteousness?"
```

The rewritten query embeds with higher specificity and better recalls targeted content. Like HyDE, this adds a model call to the retrieval path — I apply it only for short queries (under 5 tokens) where the improvement is most significant.

### Embedding the Full Conversation Turn

For multi-turn conversations, the current user message may not capture the full retrieval intent. "What about his use of it in chapter 8?" makes no sense in isolation — it requires knowing that the previous turn discussed Paul's use of *dikaiosynē* in Romans.

The embedding for retrieval should reflect the full conversational context, not just the latest message:

```typescript
function buildRetrievalQuery(
  currentMessage: string,
  recentHistory: Turn[]
): string {
  // Include enough prior context to make the query self-contained
  const contextTurns = recentHistory.slice(-3);
  const context = contextTurns
    .map(t => `${t.role}: ${t.text}`)
    .join("\n");

  return `${context}\nuser: ${currentMessage}`;
}
```

The combined text embeds to a vector that captures the conversational context, producing better retrieval for follow-up questions that depend on prior turns.

## Document Representation: What Gets Indexed

The text that gets embedded for indexing is not always the raw document text. Several representation strategies improve retrieval quality for theological content.

### Title-Body Augmentation

For chunks from structured sources (commentary sections, lexicon entries), prepending the section title improves retrieval:

```
[Raw chunk text]
"The word dikaiosynē appears 92 times in the New Testament, with 57 occurrences in 
Paul's letters. In Romans, Paul uses it in two distinct senses..."

[Augmented for embedding]
"Strong's G1343: dikaiosynē — righteousness, justice. Pauline usage in Romans.
The word dikaiosynē appears 92 times in the New Testament, with 57 occurrences in 
Paul's letters. In Romans, Paul uses it in two distinct senses..."
```

The augmented text embeds more specifically to its topic. A query about "righteousness in Romans" retrieves this chunk more reliably because the title terms appear in the indexed text, not only in the payload metadata.

This augmentation is only used for the embedding — the stored chunk text remains the original. The index representation and the display representation are different.

### Summary-as-Index

For long chunks where the body text is dense and contains many tangential topics, embedding a model-generated summary of the chunk rather than the chunk itself can improve retrieval precision:

```typescript
async function buildIndexRepresentation(chunk: Chunk): Promise<string> {
  if (chunk.tokens <= 200) return chunk.text; // Short chunks: embed as-is

  // For longer chunks, generate a summary for indexing
  const summary = await fastModel.complete({
    prompt: `Summarize this theological text in 2-3 sentences, capturing its main 
topic, key biblical references, and central argument:\n\n${chunk.text}`,
    maxTokens: 80,
  });

  // Embed the summary, store the full text for retrieval display
  return summary;
}
```

The summary is what gets embedded; the full chunk text is what gets returned when the chunk is retrieved. The model sees the full text; the retrieval system navigates by the summary's more focused semantic signature.

I use summary-as-index selectively — for patristic chunks with high conceptual density and for modern commentary sections that cover multiple register shifts. For scripture (short, natural units) and user notes (personal, specific), direct embedding of the text works better.

---

*Explore more articles in the [AI Engineering series](/categories/ai-engineering).*

---

## Handling Theological Vocabulary Distribution

General-purpose embedding models are trained on web text, books, and Wikipedia. Biblical content appears in their training data, but as a small fraction of the total. This means theological vocabulary — especially technical terms, transliterated Greek and Hebrew, and archaic theological phrasing — is underrepresented in the model's training distribution.

Underrepresented vocabulary embeds less precisely. The model's representation of "propitiatory sacrifice" or "*peripateo*" or "federal headship" is trained on fewer examples than its representation of common words, so these terms contribute less signal to their embeddings.

Three mitigations:

### Glossary Normalization

Before embedding, translate archaic or highly technical terms to their modern plain-language equivalents for the embedding representation (while preserving originals in the stored text):

```typescript
const theologicalGlossary: Record<string, string> = {
  propitiation: "satisfying God's wrath through sacrifice",
  justification: "being declared righteous before God",
  sanctification: "the process of becoming holy",
  imputation: "crediting righteousness or sin to another's account",
  peripateo: "to walk, to live, manner of life",
  hesed: "steadfast covenant love and faithfulness",
  // ...
};

function normalizeForEmbedding(text: string): string {
  return text.replace(
    /\b(propitiation|justification|sanctification|imputation|peripateo|hesed)\b/gi,
    match => `${match} (${theologicalGlossary[match.toLowerCase()] ?? match})`
  );
}
```

The normalized text still contains the original term (preserving specificity) but adds the explanation alongside it (improving the embedding model's representation). A query using "God's wrath" will now find chunks about "propitiation" even if the model's internal representation of propitiation is weak.

### Instruction-Prefixed Embeddings

Some embedding models (E5, BGE, Instructor) support instruction prefixes that shift the embedding to a specific task domain:

```typescript
// Instructor-style models
const docInstruction = "Represent this theological passage for retrieval:";
const queryInstruction = "Represent this Bible study question for retrieval:";

const docEmbedding = await embed(`${docInstruction} ${chunkText}`);
const queryEmbedding = await embed(`${queryInstruction} ${userQuery}`);
```

The instruction helps the model apply the right transformation for the content type. For theological content, instruction-prefixed models consistently outperform bare embedding on retrieval benchmarks when the instruction is domain-specific.

This is only available for models that support it. The `text-embedding-3` family does not use instruction prefixes. `intfloat/instructor-xl` and `BAAI/bge-large-en-v1.5` do. The choice of instruction-capable vs non-instruction model is a significant design decision in the embedding strategy.

### Fine-Tuned Embeddings

The highest quality option for domain-specific retrieval is a fine-tuned embedding model trained on theological query-passage pairs. Fine-tuning adapts the model's representation space to the specific vocabulary, query patterns, and semantic relationships in the domain.

Fine-tuning data format (contrastive triplets):

```json
{
  "query": "What does Paul mean by the righteousness of God?",
  "positive": "Romans 1:17 — For in it the righteousness of God is revealed...",
  "negative": "Romans 3:9 — What then? Are we Jews any better off? No, not at all..."
}
```

The model learns to pull queries and their relevant passages closer in vector space, and push non-relevant passages further.

Fine-tuning is not currently deployed on this platform — the cost of building a high-quality training set (thousands of annotated query-passage pairs) and the operational complexity of running a self-hosted model have not yet been justified by the incremental quality improvement over `text-embedding-3-small` with the normalization and instruction strategies above. It is the next logical step if retrieval quality plateaus at the current ceiling.

## Multi-Vector Representations

Single-vector embeddings collapse all the information in a text to one point in space. This works well when the semantic content is coherent, but for chunks that cover multiple topics — a patristic passage on grace, free will, and predestination simultaneously — a single vector is a compromise between all three.

**ColBERT-style late interaction** addresses this by producing one vector per token and computing query-document similarity as the sum of maximum token-vector similarities. The query token for "predestination" aligns to the document tokens about predestination specifically; the query token for "grace" aligns to the grace tokens. The full similarity score captures multi-topic relevance that a single-vector approach misses.

Late interaction models are computationally expensive at query time — scoring each candidate requires O(|query_tokens| × |doc_tokens|) similarity computations rather than one dot product. They are typically used as a reranking step over a single-vector pre-retrieved candidate set (retrieve top-100 with single-vector, rerank top-20 with ColBERT) rather than as the primary index.

The platform currently uses a cross-encoder reranker (article 09) rather than ColBERT. ColBERT is on the evaluation roadmap for theological content specifically, because the multi-topic density of patristic and Reformation-era text is exactly the use case it handles best.

## Evaluating Embedding Strategy Quality

Embedding strategy quality is measured the same way retrieval quality is — against the ground truth evaluation set — but with an additional diagnostic: **embedding space visualization**.

For a sample of 500 verse embeddings across the full Bible, a 2D projection (UMAP or t-SNE) reveals the structure of the embedding space:

- Are theologically similar verses clustered together regardless of book?
- Are different translations of the same verse overlapping or separated?
- Are there unexpected clusters that reveal embedding artifacts?

A good embedding strategy produces a space where the Psalms cluster near each other, but also where Psalms about covenant faithfulness cluster near Pauline passages about grace, because the theological relationship is real. A poorly calibrated embedding strategy produces clusters that are primarily book-level (Genesis passages near each other, Romans passages near each other) with weaker cross-book semantic clustering.

This visualization is qualitative, not quantitative — it informs intuition about what the embedding space represents. Quantitative evaluation against the ground truth set provides the actionable metric; the visualization explains why the numbers are what they are.

Every embedding strategy decision in this article — HyDE, query rewriting, title augmentation, glossary normalization — produces a measurable change in retrieval quality when evaluated against the ground truth set. The decisions that shipped to production are those that showed clear improvement. The ones that did not are documented as negative results so they are not re-evaluated from scratch when the strategy is revisited.

---

*[← Back to AI Engineering](/categories/ai-engineering)*
