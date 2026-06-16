---
title: "Hallucination Reduction"
description: "Techniques for reducing hallucinations in theological AI retrieval."
date: 2026-05-30
lastUpdated: "2026-06-09"
category: "ai-engineering"
tags:
  - ai-engineering
  - retrieval
  - hallucination
draft: false
cluster: "ai-engineering"
slug: hallucination-reduction
author: Donavan Jones
---

# Hallucination Reduction

The previous article covered citation grounding — ensuring that claims in AI responses are traceable to specific retrieved sources. This article covers the broader problem that citation grounding is one response to: hallucination.

Hallucination is when a model generates content that is confidently stated but factually wrong or unsupported. In a general-purpose AI assistant, hallucinations are annoying and sometimes harmful. In a theological AI system where users are trying to understand what the Bible actually says, hallucinations are a category error. A model that invents a verse reference, misquotes a passage, attributes a theological position to the wrong tradition, or synthesizes a doctrine from partial evidence is not helping users understand scripture — it is creating false beliefs about scripture while wearing the authority of a knowledgeable guide.

The engineering response to this is not to find a model that never hallucinates — no such model exists. It is to design a system where hallucinations are structurally prevented where possible, detected when they occur, and surfaced transparently when they cannot be corrected.

*Part of the [AI Engineering series](/categories/ai-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every ai engineering deep-dive in this series."
destinationUrl: "/categories/ai-engineering"
---
::

## The Taxonomy of Hallucinations in Theological AI

Not all hallucinations are the same problem. Categorizing them reveals which interventions apply where.

**Factual hallucinations** — the model states something false about the world. "Romans 8:28 was written by Peter" is false. "The word *agape* appears 115 times in the New Testament" might be wrong by 20 occurrences. These are the most detectable hallucinations because they can be checked against authoritative data.

**Textual hallucinations** — the model misquotes or paraphrases a text and presents the paraphrase as the actual wording. "Jesus said 'God helps those who help themselves'" — not in the Bible, but the model has seen this misattribution enough times in training data to generate it with confidence. Subtler: the model quotes Romans 8:28 as "all things work together for good for those who love the Lord" — close but not ESV or NIV or any standard translation.

**Interpretive hallucinations** — the model presents a contested or fringe interpretation as settled consensus, or attributes a theological position to a tradition that does not hold it. "All major Christian traditions affirm that baptism is necessary for salvation" misrepresents Reformed and evangelical traditions. "Calvin taught that God is the author of sin" misrepresents Calvin's actual position.

**Conflationary hallucinations** — the model blends two distinct passages, doctrines, or figures into one. Attributing Paul's argument from Romans 3 to Galatians 2 because both discuss justification. Combining Job's complaints with the Psalms of lament into a single undifferentiated "biblical view of suffering."

**Omission hallucinations** — the model presents a partial picture as complete. Answering "What does the Bible say about wealth?" by citing passages about generosity while omitting passages about wealth as a blessing or the prosperity dimensions of Old Testament covenant. Not false, but misleading by selection.

Each category requires different prevention strategies.

## Prevention Layer 1: Retrieval Grounding

The most effective hallucination prevention is not post-generation checking — it is ensuring the model has accurate information before generating. A model that generates from a context window containing the actual verse text, the actual lexical definition, and the actual cross-references will hallucinate less than one generating from training memory, regardless of how capable the model is.

This is the core argument for RAG in theological AI: not that it makes the model smarter, but that it reduces the circumstances under which the model must rely on imperfect training memory.

Specific retrieval design decisions that reduce hallucinations:

**Include the full verse text, not just the reference.** A model given "Romans 8:28" in context will sometimes confuse it with adjacent verses or generate a paraphrase. A model given the full text — "And we know that for those who love God all things work together for good, for those who are called according to his purpose" — will quote it accurately because the text is right there.

**Include negative context for contested claims.** If a user asks about a theologically contested question, the retrieval should include passages that represent multiple perspectives, not just the passages most similar to the query. A query about election that only retrieves Calvinist-aligned passages will produce a one-sided response not because the model is biased but because the retrieval was.

**Flag low-retrieval-confidence.** When the retrieval system returns few results (fewer than 3 passages with scores above 0.7), the model is being asked to answer with inadequate evidence. The response should be scoped accordingly:

```typescript
function buildRetrievalQualitySignal(results: RetrievalResult[]): string {
  const highConfidence = results.filter(r => r.score >= 0.75);

  if (highConfidence.length === 0) {
    return "RETRIEVAL_WARNING: No high-confidence passages found. Answer with caution and acknowledge limited evidence.";
  }
  if (highConfidence.length <= 2) {
    return "RETRIEVAL_NOTICE: Limited evidence retrieved. Scope your answer to what is directly supported.";
  }
  return "";
}
```

This signal is injected into the system prompt. The model reads it and adjusts its confidence accordingly — a model instructed to "answer with caution and acknowledge limited evidence" produces more hedged, accurate responses than one that has no signal about retrieval quality.

## Prevention Layer 2: Prompt Constraints

System prompt constraints that reduce hallucination:

**Scope to provided context.** The single most effective constraint:

```
Base your response exclusively on the passages and commentary provided in the 
context block. Do not draw on information from outside these sources.
If a question cannot be answered from the provided context, say so explicitly.
```

This does not eliminate hallucination — models are imperfect at following this instruction — but it significantly reduces training-data drift.

**Prohibit specific high-risk behaviors:**

```
Do not:
- Quote any Bible verse from memory — only quote verses provided in the context
- Claim consensus where traditions disagree
- Attribute specific views to denominations or theologians unless the source 
  is in the provided context
- Use phrases like "the Bible clearly states" or "all Christians believe" 
  — these overstate certainty
```

Each prohibition targets a specific hallucination pattern that empirical testing showed appearing in responses without it.

**Require explicit uncertainty.** When the model does not have adequate evidence:

```
When you are uncertain or when evidence is limited, say so explicitly.
Acceptable uncertainty phrases: "The text does not directly address...", 
"Theologians disagree on...", "The evidence suggests but does not 
establish...", "This is my reading of the passage, but..."

Never simulate certainty you do not have.
```

Models fine-tuned for helpfulness tend to overclaim — they produce confident answers because confident answers feel more helpful. Explicit uncertainty instruction counteracts this tendency.

## Prevention Layer 3: Post-Generation Checking

Even with strong retrieval grounding and prompt constraints, hallucinations occur. Post-generation checking catches the ones that slipped through.

### Verse Quote Verification

Every quoted verse in a response is extracted and compared against the database:

```typescript
async function verifyQuotedVerses(
  response: string,
  translation: string
): Promise<VerificationResult[]> {
  // Extract all quoted passages from the response
  const quotes = extractQuotes(response); // finds text in quotation marks with verse refs

  return Promise.all(quotes.map(async quote => {
    const actual = await db.verses.findOne({
      ref: normalizeRef(quote.ref),
      translation_id: translation,
    });

    if (!actual) {
      return { quote, status: "reference_not_found", actual: null };
    }

    const similarity = stringSimilarity(quote.text, actual.text);
    return {
      quote,
      actual: actual.text,
      status: similarity >= 0.95 ? "exact" :
              similarity >= 0.80 ? "paraphrase" :
              "mismatch",
      similarity,
    };
  }));
}
```

Results:
- **exact** (≥95% string similarity): pass silently
- **paraphrase** (80–95%): show the actual text alongside the quoted text with a note
- **mismatch** (<80%): flag prominently; replace the quoted text with the actual text

String similarity is used rather than exact match because minor formatting differences (punctuation, capitalization, abbreviation) should not trigger a flag. True misquotations have similarity below 80%.

### Cross-Reference Plausibility

When the response references cross-references or thematic connections between passages, verify that those connections are in the cross-reference graph:

```typescript
async function verifyCrossReference(
  sourceRef: string,
  targetRef: string
): Promise<boolean> {
  // Check the cross-reference graph (2 hops max)
  const connected = await graphQuery(`
    MATCH (s:Passage {ref: $source})-[:REFERENCES|:ALLUDES_TO*1..2]->(t:Passage {ref: $target})
    RETURN count(*) > 0 AS connected
  `, { source: normalizeRef(sourceRef), target: normalizeRef(targetRef) });

  return connected;
}
```

If the model asserts "Romans 8:28 is a direct echo of Genesis 50:20" and that cross-reference is not in the graph, the claim is flagged as unverified. The graph does not contain every possible allusion — it reflects established scholarly consensus on cross-references — but it covers the most common ones. An asserted connection absent from the graph is either a model hallucination or a genuine scholarly insight not captured in the reference data; either way, it should be marked as the model's interpretation rather than a settled connection.

### Theological Position Attribution

Claims that attribute positions to specific traditions or theologians are checked against a small knowledge base of established positions:

```typescript
const theologicalPositions = {
  "Reformed/Calvinist": {
    affirms: ["total depravity", "unconditional election", "limited atonement",
              "irresistible grace", "perseverance of the saints"],
    denies: ["salvation by works", "loss of salvation", "human free will in salvation"],
  },
  "Arminian/Wesleyan": {
    affirms: ["prevenient grace", "free will", "conditional election",
              "unlimited atonement", "possibility of apostasy"],
    denies: ["double predestination", "irresistible grace"],
  },
  // ...
};

function checkPositionAttribution(
  tradition: string,
  claim: string
): "consistent" | "inconsistent" | "unknown" {
  const positions = theologicalPositions[tradition];
  if (!positions) return "unknown";

  if (positions.denies.some(d => claim.toLowerCase().includes(d))) {
    return "inconsistent";
  }
  return "consistent";
}
```

This is a coarse check — theological traditions have nuance that a flat list cannot capture. But it catches the most common misattributions: "Calvinists believe salvation can be lost" (inconsistent), "Arminians deny grace entirely" (inconsistent).

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

## Detection Layer: Confidence Calibration

Some hallucinations are not preventable through retrieval or prompting — they emerge from the model's training distribution. The best response to these is accurate confidence signaling: the system should express less certainty when the evidence is weaker.

Rather than asking the model to self-report its confidence (which models are notoriously poor at), I use a separate calibration signal derived from retrieval:

```typescript
function computeResponseConfidence(
  retrievalResults: RetrievalResult[],
  citationVerification: VerificationResult[],
  uncitedClaims: string[]
): ConfidenceLevel {
  const avgRetrievalScore = mean(retrievalResults.map(r => r.score));
  const citationPassRate = citationVerification.filter(v => v.status !== "mismatch").length
    / citationVerification.length;
  const uncitedClaimFraction = uncitedClaims.length
    / (citationVerification.length + uncitedClaims.length);

  const score = (avgRetrievalScore * 0.4)
    + (citationPassRate * 0.4)
    + ((1 - uncitedClaimFraction) * 0.2);

  if (score >= 0.85) return "high";
  if (score >= 0.65) return "moderate";
  return "low";
}
```

This confidence level is shown to users as a visual indicator:

- **High confidence**: response well-grounded in retrieved scripture, all citations verified
- **Moderate confidence**: response grounded but some claims unverified or retrieval was limited
- **Low confidence**: response draws significantly on model knowledge; user should verify claims independently

Low-confidence responses include an explicit header: "This response is based primarily on the model's training knowledge rather than retrieved scripture. Please verify claims against the original text."

::CtaTryApp
---
buttonText: "Try The Live AI App"
supportingCopy: "Try the RAG-powered Bible study app these patterns were built for."
destinationUrl: "https://bibleverse.donavanjones.com/register"
---
::

## The Honest Acknowledgment of Limits

Hallucination reduction is a continuous engineering problem with no complete solution. Every measure described here reduces hallucinations; none eliminates them. The right engineering posture is:

**Design for detection, not just prevention.** Some hallucinations will pass every check. The system should be designed so users can verify independently — through the citation panel, the confidence indicator, and direct links to the actual verse text. Users who check and find the model was wrong should be able to do so easily.

**Treat hallucination failures as feedback.** When a user flags a response as inaccurate, that flagged response becomes training data for the evaluation and monitoring system. Patterns in flagged responses reveal systematic hallucination patterns — specific domains (patristic attributions, historical context) or specific question types (comparative claims, attribution questions) that need additional prevention investment.

**Be honest with users about uncertainty.** The most hallucination-resistant thing an AI theological tool can do is model intellectual humility. "The text does not directly address this question" and "theologians disagree on this point" are correct, useful responses that prevent the user from leaving with false confidence. A model that always produces an answer, however uncertain its evidence, is more dangerous than one that regularly says "I am not sure — here is what the text says, and you should draw your own conclusion."

The platform's ultimate responsibility is not to produce right answers — it is to help users engage with the actual text. Hallucination reduction in service of that goal is not primarily a technical concern. It is a form of respect for the text and for the people trying to understand it.

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
  buttonText: "Read: AI Pipelines for Bible Study"
  supportingCopy: "Continue with \"AI Pipelines for Bible Study\" for the next piece of this system."
  destinationUrl: "/blog/ai-engineering/15-ai-pipelines-for-bible-study"
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
  - label: "Hallucination (Artificial Intelligence) — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)"
    type: "wikipedia"
    description: "According to this overview, AI hallucination is the generation of plausible-sounding but factually incorrect content — the core problem this article addresses."
  - label: "TruthfulQA: Measuring How Models Mimic Human Falsehoods (Lin et al., 2021)"
    url: "https://doi.org/10.48550/arXiv.2109.07958"
    type: "doi"
    description: "Research establishing a benchmark for measuring model truthfulness — shows that larger models are not automatically more truthful."
  - label: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (Lewis et al., 2020)"
    url: "https://doi.org/10.48550/arXiv.2005.11401"
    type: "doi"
    description: "The original RAG paper — established that retrieval-grounded generation reduces factual errors compared to parametric-only generation."
  - label: "FActScoring: Fine-Grained Atomic Evaluation of Factual Precision (Min et al., 2023)"
    url: "https://doi.org/10.48550/arXiv.2305.14251"
    type: "doi"
    description: "Methodology for measuring hallucination at the atomic claim level — the evaluation approach applied to detect doctrinal and textual errors."
---
::

---

*[← Back to AI Engineering](/categories/ai-engineering)*
