---
title: "Chunking Religious Texts"
description: "Strategies for chunking religious texts for AI retrieval."
date: 2026-05-17
category: "ai-engineering"
tags:
  - ai-engineering
  - retrieval
  - chunking
draft: false
slug: chunking-religious-texts
author: Donavan Jones
---

# Chunking Religious Texts

Chunking is how continuous text gets divided into units that can be individually embedded and retrieved. The choice of chunk boundaries determines what the retrieval system can and cannot find — a chunk that splits a theological argument in the middle makes both halves less retrievable than either would be as a whole unit.

Generic chunking advice — "use 512 tokens with 64-token overlap" — works adequately for homogeneous corpora like Wikipedia articles or legal documents. Religious texts are not homogeneous. Scripture, patristic commentary, Reformation theology, modern scholarship, and personal study notes each have distinct structural properties that demand different chunking strategies. Applying one strategy across all of them degrades retrieval quality in ways that are subtle to diagnose and significant in their impact.

This article covers the structural properties of each content type on this platform, the chunking strategy designed for each, and the evaluation process that reveals whether a chunking decision is working.

*Part of the [AI Engineering series](/categories/ai-engineering).*

## Why Chunking Matters More Than It Seems

Embedding models convert text to a vector that represents the aggregate meaning of the entire input. A long chunk has a diffuse representation — the vector captures the average semantic content, which means any single idea within the chunk is represented at reduced fidelity. A short chunk has a sharp, specific representation — but may lack enough context for the model to understand what the chunk is about.

The chunk size tradeoff is: small chunks retrieve precisely but may lack context; large chunks carry more context but retrieve imprecisely.

For theological content, this tradeoff has a concrete form. Consider a 500-word commentary section on Romans 8:28 that covers: (1) the Greek syntax of *synergei*, (2) the scope of "all things", (3) the identity of "those who love God", and (4) application to Christian suffering. A single 500-word chunk embeds all four topics into one vector. A query about "Christian suffering" will retrieve this chunk — but so will queries about "Greek syntax in Romans" and "who are those who love God." The chunk is retrieved by many queries but is relevant to each at only partial depth.

Split into four 125-word chunks on topical boundaries and each retrieves precisely for its own topic. The suffering application chunk appears high in suffering queries; the Greek syntax chunk appears high in syntactic queries. The right passage appears more consistently at the right position.

## Scripture: Verses as Natural Units

The Bible has a built-in chunking structure: chapters and verses. These divisions are not original to the texts — they were added by medieval scholars for navigation — but they have become the de facto reference system for thousands of years of interpretation. Every commentator, preacher, and scholar cites by verse. The verse is the natural retrieval unit.

This makes scripture chunking simpler than other content types. Individual verses are the primary chunks. No splitting, no overlap needed — each verse has its own embedding and its own metadata.

```typescript
interface VerseChunk {
  id: string;            // "rom_8_28_esv"
  ref: string;           // "rom_8_28"
  translation: string;   // "ESV"
  book: string;          // "Romans"
  chapter: number;       // 8
  verse: number;         // 28
  text: string;          // "And we know that for those who love God..."
  testament: string;     // "new"
  genre: string;         // "epistle"
  tokens: number;        // ~28
}
```

However, verse-only chunking has a gap: some theological units span multiple verses. A single verse like Romans 8:28 is complete. But the argument in Romans 8:28-30 — from "all things work together" through "glorification" — is a logical unit that is better retrieved as a pericope than as three separate verses when the question concerns the "golden chain of salvation."

The platform indexes both:

**Verse-level**: every individual verse, for precision retrieval when a specific verse is the answer.

**Pericope-level**: theologically coherent multi-verse units identified from standard biblical outlines. A pericope is 3–15 verses covering one argument, narrative, or discourse unit. Pericopes are indexed alongside verses; retrieval returns whichever matches better for the given query.

Identifying pericope boundaries uses a combination of standard lectionary divisions (well-established theological boundaries) and section headings from the ESV Study Bible, cross-referenced to ensure theological coherence rather than arbitrary typographic breaks.

```typescript
interface PerichopeChunk {
  id: string;              // "rom_8_28_30_esv"
  startRef: string;        // "rom_8_28"
  endRef: string;          // "rom_8_30"
  theme: string;           // "The Golden Chain of Salvation"
  text: string;            // combined verse text
  verseRefs: string[];     // ["rom_8_28", "rom_8_29", "rom_8_30"]
  tokens: number;          // ~95
}
```

When a pericope is retrieved, the individual verse references are surfaced alongside it so the model can cite specific verses within its response rather than a range.

## Commentary: Argument-Aware Chunking

Commentaries are argumentative prose. A commentary on Romans 8 might run 30,000 words. Unlike scripture, it cannot be retrieved at the sentence or paragraph level without losing the argument structure. But unlike a narrative, it does not have verses to anchor on.

The right chunking unit for commentary is the theological argument — one sustained point with its supporting evidence. These roughly correspond to:

- Section headings and their supporting paragraphs
- Individual exegetical points on a specific verse or phrase
- A complete excursus on a theological topic

Commentary chunks on this platform are built with a three-pass process:

**Pass 1: Structural segmentation.** Split on section headings and subsection headings. Most published commentaries use explicit heading hierarchies; this pass identifies them and uses them as primary split points.

**Pass 2: Size normalization.** Segments shorter than 150 tokens are merged with adjacent segments (same heading level). Segments longer than 600 tokens are split at the nearest paragraph boundary within the target range (400–600 tokens). This keeps chunks within the effective range of the embedding model while respecting prose structure.

**Pass 3: Context injection.** Each chunk receives a prepended context header that identifies where it is in the larger work:

```
[Commentary on Romans 8:28-30 | F.F. Bruce, "The Letter of Paul to the Romans" | 
Section: Predestination and Providence | The Golden Chain]

Paul here draws together three concepts...
```

The context header ensures that a chunk retrieved in isolation is still interpretable. Without it, "Paul here draws together three concepts" is ambiguous — the chunk could be from any of dozens of commentaries on any of hundreds of passages. With it, the model knows the source, the author, the section, and the passage.

```typescript
function buildCommentaryChunk(
  segment: TextSegment,
  metadata: CommentaryMetadata
): CommentaryChunk {
  const header = [
    `[Commentary on ${metadata.passageRef}`,
    `| ${metadata.author}, "${metadata.title}"`,
    `| ${metadata.section}]`,
  ].join(" ");

  return {
    id: generateId(metadata, segment),
    text: `${header}\n\n${segment.text}`,
    passageRef: metadata.passageRef,
    author: metadata.author,
    tradition: metadata.tradition,
    tier: metadata.tier,
    tokens: countTokens(header) + segment.tokens,
  };
}
```

The overlap strategy for commentary is different from generic corpora. Rather than fixed-token overlap between adjacent chunks, I use a "trailing sentence" approach: the last sentence of each chunk is repeated as the first sentence of the following chunk. This preserves argumentative continuity at boundaries without duplicating large amounts of content.

## Patristic Writings: Density and Allusion

The Church Fathers wrote in a style that is dense with scripture allusions, Latin/Greek technical terms, and arguments that assume extensive knowledge of earlier theological debates. A passage from Augustine's *City of God* might contain three scripture quotations, a reference to Platonic philosophy, a rebuttal of a Donatist position, and an original theological argument — all in 200 words.

This density creates a specific chunking problem: every chunk is about many things simultaneously. The vector for a patristic chunk represents a diffuse semantic blend that is hard to retrieve precisely.

Two adjustments for patristic content:

**Smaller chunks, more specific.** Patristic chunks are capped at 300 tokens rather than 600. Smaller chunks trade some context for more specific retrieval.

**Explicit topic tagging.** Each patristic chunk is tagged with: the scripture passages it cites or comments on, the theological topics it addresses, and the opposing positions it engages. These tags are stored as payload metadata and used as filter conditions in retrieval:

```typescript
interface PatristicChunk {
  id: string;
  author: string;           // "Augustine"
  work: string;             // "City of God"
  book: number;             // 14
  chapter: number;          // 28
  text: string;
  tokens: number;
  scriptureRefs: string[];  // ["gen_3_1", "rom_5_12"] — explicit citations
  topics: string[];         // ["original_sin", "free_will", "grace"]
  disputesPositions: string[]; // ["Pelagianism", "Manichaeism"]
}
```

When a query touches on a specific topic, the filter on `topics` supplements semantic search with targeted retrieval of patristic material that explicitly addresses that topic. This gives the retrieval system a second signal beyond embedding similarity.

---

*Explore more articles in the [AI Engineering series](/categories/ai-engineering).*

---

## Reformation and Historical Commentary

The Reformation commentators (Calvin, Luther, Owen, Turretin, Baxter) wrote more structured prose than the Church Fathers — closer to modern commentary in form, but often long-form with extensive catechetical structure (question-and-answer sections, numbered propositions, explicit syllogisms).

Calvin's *Institutes* in particular has strong structural regularity: numbered chapters, section numbers, clear topical organization. Luther's commentary works are less structured but often organized around specific disputations.

Chunking strategy: follow the text's own structural markers. For Calvin's *Institutes*, use chapter-section breaks. For Luther's disputations, use the individual thesis as the chunk unit. For catechetical works, use question-answer pairs.

```typescript
// Luther's Heidelberg Disputation: thesis as chunk unit
const thesisChunks = theses.map((thesis, i) => ({
  id: `luther_heidelberg_${i + 1}`,
  work: "Heidelberg Disputation",
  author: "Martin Luther",
  thesisNumber: i + 1,
  thesis: thesis.text,
  proof: thesis.proof,
  text: `Thesis ${i + 1}: ${thesis.text}\n\nProof: ${thesis.proof}`,
  topics: extractTopics(thesis),
  tokens: countTokens(thesis.text) + countTokens(thesis.proof),
}));
```

For unstructured historical commentaries (lengthy prose without clear section markers), the approach falls back to the argument-aware commentary chunking above: structural segmentation → size normalization → context injection.

## Modern Scholarship: Technical Precision

Modern commentaries (F.F. Bruce, Douglas Moo, N.T. Wright, Thomas Schreiner) combine technical grammatical analysis, historical-critical context, and theological synthesis. A single commentary section might shift between: text criticism (manuscript variants), Greek syntactic analysis, second-temple Jewish background, and theological application.

These register shifts within a section mean that a chunk on "Romans 3:21-26" contains content relevant to queries about Greek grammar, Jewish background, justification theology, and atonement theory simultaneously. This is the same density problem as patristic writing, with different registers.

For modern scholarship, I use a hybrid chunking approach:

**Primary split**: at passage-commentary boundaries (each commentary on a verse range gets its own chunk family).

**Secondary split**: within a passage commentary, split at register shifts — identified by the presence of Greek/Hebrew terms (grammatical analysis), citations of Second Temple literature (historical background), or application language ("Christians today").

```typescript
function detectRegisterShift(sentence: string, prevSentence: string): boolean {
  const hasGreek = /[Ͱ-Ͽ]/.test(sentence);
  const hasSecondTemple = /\b(Qumran|Dead Sea Scrolls|Philo|Josephus|Mishnah)\b/i.test(sentence);
  const hasApplication = /\b(today|believer|church|we|our)\b/i.test(sentence);
  const prevHasGreek = /[Ͱ-Ͽ]/.test(prevSentence);

  // Register shift: from grammar to application, or from historical to theological
  return (hasGreek !== prevHasGreek) || (hasSecondTemple && hasApplication);
}
```

Register-split chunks retrieve more precisely: a query about "Second Temple Jewish background for Romans 3:21" surfaces the historical background chunk; a query about "Greek syntax of *dikaiosynē* in Romans 3:21" surfaces the grammatical analysis chunk.

## User Study Notes: Minimal Chunking

User notes are personal, variable-length, and structurally unpredictable. They range from a single sentence ("The word 'propitiation' here = satisfying God's wrath") to multi-paragraph reflections. Chunking strategy:

- Notes under 200 tokens: no chunking — embed as a single unit
- Notes 200–800 tokens: split at paragraph boundaries if multiple paragraphs exist, otherwise embed whole
- Notes over 800 tokens: split at paragraph boundaries with 50-token overlap

No context header is needed for user notes — they are already attributed to the user and associated with a verse reference. The metadata carries enough context.

## Evaluating Chunking Quality

The test for chunking quality is retrieval quality at query time. Poor chunking shows up as:

**Precision loss**: queries return chunks that contain the right information but also a lot of unrelated content, reducing the effective density of relevant information in the context window.

**Recall loss**: content that would answer a query is present in the corpus but embedded in a large chunk with a diffuse vector, so it ranks below smaller, more specific chunks that are slightly less relevant.

**Argument fragmentation**: a multi-step theological argument is split across chunk boundaries in a way that makes each fragment meaningless in isolation.

I evaluate chunking against the same 300-query ground truth set used for retrieval evaluation, with an additional metric: **content utilization** — what fraction of the retrieved chunk is actually used in the model's response. A chunk where only 10% of the text is relevant to the query is a chunking failure; the other 90% is diluting the context window with noise.

Content utilization is measured by asking a lightweight model to score which sentences from each retrieved chunk directly support the response. This is an approximation — the model's scoring is imperfect — but it surfaces systematic chunking failures: consistently low utilization scores on a specific content type signal that chunks from that type are too large or structured incorrectly.

Chunking is one of those infrastructure concerns that feels secondary until the retrieval evaluation scores plateau and no amount of model improvement or prompt tuning moves them. At that point, revisiting the chunking strategy usually unlocks the next significant quality improvement. The structure of the content is the structure of the retrieval — get the chunking right and everything downstream improves.

---

*[← Back to AI Engineering](/categories/ai-engineering)*
