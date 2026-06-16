---
title: "Citation Grounding"
description: "Grounding AI responses with citations in theological retrieval."
date: 2026-05-27
lastUpdated: "2026-06-09"
category: "ai-engineering"
tags:
  - ai-engineering
  - retrieval
  - citations
draft: false
slug: citation-grounding
author: Donavan Jones
---

# Citation Grounding

An AI response about scripture that does not cite the actual text it is drawing from is asking the user to trust the model's approximation of what the Bible says. For casual conversation, that trust might be reasonable. For a platform built specifically to help people understand scripture accurately, it is not — the text is authoritative, and any claim about what the text says should be traceable directly to the text.

Citation grounding is the practice of ensuring AI responses include verifiable references to the sources they draw from — and that those references are real, accurate, and consistent with what the response actually claims. It is different from simply having the model mention verse references. A model can confidently cite Romans 8:28 in a response about anxiety and be making a superficially plausible but contextually inappropriate connection. Grounded citations are verified: the cited passage actually appears in the retrieved context, the response's claims are supported by the cited text, and the user can check both.

This article covers how citation grounding is implemented — eliciting citations from the model, verifying them against retrieved sources, presenting them usefully to users, and handling the cases where citation breaks down.

*Part of the [AI Engineering series](/categories/ai-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every ai engineering deep-dive in this series."
destinationUrl: "/categories/ai-engineering"
---
::

## The Three Levels of Citation Failure

Understanding what can go wrong clarifies what good citation grounding needs to prevent:

**Level 1 — Fabricated citations**: the model cites a reference that does not exist or does not say what the model claims. "Romans 4:12 teaches that faith alone justifies" — Romans 4:12 exists but says nothing so direct. The model has generated a plausible-sounding but inaccurate paraphrase attached to a real reference.

**Level 2 — Real citations, wrong context**: the model cites a real verse that genuinely says something related, but uses it to support a point it does not actually make in context. Romans 8:28 ("all things work together for good") cited in a response about God preventing all suffering — the verse is real, the citation is recognizable, but the theological claim being supported is not what the verse means.

**Level 3 — Uncited claims**: the model makes theological claims without citing anything, drawing on training data rather than retrieved content. These are invisible failures — the user has no signal that the claim is uncited and therefore unverifiable.

A citation grounding system prevents all three. Level 1 is prevented by verifying citations against retrieved content. Level 2 requires checking that the cited passage actually supports the specific claim. Level 3 is prevented by prompting the model to cite all theological claims and flagging uncited claims in responses.

## Eliciting Citations from the Model

The first step is getting the model to produce citable responses consistently. This requires explicit instruction in the system prompt and a structured response format that makes citation a required output element rather than an optional addition.

### System Prompt Instruction

```
Every theological claim you make must be supported by a specific scripture citation 
from the passages provided. Format citations inline using [CITE: ref] notation 
immediately after the claim they support.

Example: "Paul argues that justification comes through faith, not works [CITE: rom_3_28], 
a theme he returns to when discussing Abraham [CITE: rom_4_3]."

Rules:
- Only cite passages provided in the context block
- Each citation must directly support the claim it follows
- Do not cite a passage just because it is related — cite it because it is evidence 
  for the specific claim
- If a claim cannot be supported by the provided passages, say so explicitly rather 
  than omitting the citation
```

The "only cite passages provided in the context block" instruction is the critical constraint. Without it, the model draws on training data for citations — producing plausible but unverifiable references that cannot be checked against retrieved content.

The instruction to say so explicitly when a claim cannot be supported is equally important. It surfaces the gap rather than letting the model generate an unsupported claim that looks cited.

### Structured Output Format

For study guide generation and longer-form responses, I use a structured JSON output format that separates claims from their citations:

```typescript
interface CitedResponse {
  sections: Array<{
    heading: string;
    content: string;          // plain prose, no inline citations
    citations: Array<{
      claim: string;          // the specific claim being supported
      ref: string;            // "rom_3_28"
      passage_text: string;   // the actual verse text
      support_level: "direct" | "contextual" | "thematic";
    }>;
  }>;
  uncited_claims: string[];  // claims the model could not cite
}
```

Separating citations from prose makes verification programmatic — each `citation` object has a `ref` that can be checked against retrieved content and a `claim` that can be compared to the cited `passage_text`.

`support_level` distinguishes three citation strengths:
- **direct**: the passage explicitly states the claim
- **contextual**: the passage implies or contextually supports the claim
- **thematic**: the passage is thematically related but the connection requires interpretation

This distinction matters for how citations are presented to users. Direct support is shown with high confidence; thematic support is shown with an interpretive qualifier ("This theme appears in...").

## Verifying Citations Against Retrieved Content

Once the model produces citations, each one is verified before the response reaches the user. Verification has two steps: presence checking and support checking.

### Presence Checking

The most basic check: does the cited reference exist in the context that was passed to the model?

```typescript
function verifyPresence(
  citations: Citation[],
  retrievedContext: RetrievalResult[]
): CitationVerificationResult[] {
  const retrievedRefs = new Set(retrievedContext.map(r => r.ref));

  return citations.map(citation => ({
    ...citation,
    inContext: retrievedRefs.has(citation.ref),
    existsInDatabase: null,  // checked next
  }));
}
```

A citation not in the retrieved context means the model invented it — drawing on training data rather than provided passages. This is a Level 1 failure. The citation is flagged and not displayed to the user without a warning.

If the citation is not in context but is a valid reference (exists in the database), there are two interpretations: the model retrieved from training memory correctly but outside the provided context, or the retrieval pipeline failed to surface a relevant passage. Either way, the citation should be marked "from model knowledge, not retrieved context" and the user should be told the full verse text has been fetched separately.

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

### Support Checking

Presence is necessary but not sufficient. A cited passage may be in context without actually supporting the claim being made. Support checking verifies that the claim is grounded in the cited text.

```typescript
async function verifySupport(
  claim: string,
  citedPassage: string,
  passageText: string
): Promise<SupportCheckResult> {
  const result = await fastModel.complete({
    prompt: `Does the following Bible passage directly support, contextually support, 
or not support this claim?

Claim: "${claim}"

Passage (${citedPassage}): "${passageText}"

Respond with exactly one of:
- DIRECT: the passage explicitly states this claim
- CONTEXTUAL: the passage implies or contextually supports this claim  
- THEMATIC: the passage is related but does not specifically support this claim
- NOT_SUPPORTED: the passage does not support this claim

Then in one sentence, explain why.`,
    maxTokens: 80,
  });

  return parseSupportCheckResult(result);
}
```

This is a lightweight model call — it runs on a fast, inexpensive model. The classification is intentionally coarse (four categories) to be reliable at low model capacity. A claim marked `NOT_SUPPORTED` triggers one of two actions: the model is asked to revise the citation with a correction prompt, or the citation is flagged for user display with a warning.

Running support checking on every citation in a full response (typically 5–15 citations) adds 5–15 fast model calls. At average latency of 300ms each, that is 1.5–4.5 seconds of additional processing. This is done asynchronously after the streaming response completes — the user sees the response first, then citations are verified and annotated in a second pass. For synchronous interactive responses, support checking runs only on high-confidence claims (the top 3 by citation frequency in the response) and deferred for the rest.

## Presenting Citations to Users

Verified citations are displayed in a way that lets users inspect the supporting evidence without interrupting the reading flow of the response.

### Inline Citation Markers

In the rendered response, `[CITE: rom_3_28]` becomes a numbered superscript linked to an expandable citation panel:

```
Paul argues that justification comes through faith, not works¹, a theme 
he returns to when discussing Abraham².

---
¹ Romans 3:28 — "For we hold that one is justified by faith apart from 
  works of the law."
  Support level: Direct

² Romans 4:3 — "For what does the Scripture say? 'Abraham believed God, 
  and it was counted to him as righteousness.'"
  Support level: Contextual — Paul uses Abraham as an illustration of 
  faith-based justification rather than a direct restatement.
```

Each citation shows the full verse text so users can evaluate the claim against the source without navigating away. The support level label sets expectations — "direct" means the verse says exactly this; "contextual" means it requires interpretation.

### Source Attribution

Beyond the verse reference, citations include the translation used and the retrieval provenance:

```typescript
interface DisplayCitation {
  number: number;
  ref: string;               // "rom_3_28"
  displayRef: string;        // "Romans 3:28"
  translation: string;       // "ESV"
  text: string;              // full verse text
  supportLevel: string;      // "Direct" | "Contextual" | "Thematic"
  supportExplanation: string;
  source: "scripture" | "commentary" | "lexicon";
  author?: string;           // for commentary: "F.F. Bruce"
  retrievalMethod: "semantic" | "cross_reference" | "direct_lookup";
}
```

Commentary citations include the author and work:

```
³ F.F. Bruce, "The Letter of Paul to the Romans" — Commentary on Romans 3:28:
  "The faith through which justification comes is personal trust in Christ..."
  Support level: Contextual — Bruce's interpretation aligns with the claim 
  but represents one scholarly reading among several.
```

The interpretive qualifier for commentary citations ("one scholarly reading among several") is important. Commentary is not scripture. It is authoritative opinion, not primary text, and responses that present commentary-based claims with the same confidence as scripture-based claims misrepresent the epistemic status of the evidence.

### The Citation Panel

On longer responses, citations are collected into a collapsible panel at the bottom of the response:

```
[3 Scripture citations] [2 Commentary citations] ▼

Romans 3:28 (ESV) — Direct support
Romans 4:3 (ESV) — Contextual support
Romans 5:1 (ESV) — Contextual support

F.F. Bruce, Romans Commentary — Contextual support
John Calvin, Romans Commentary — Thematic support
```

Users who want to verify claims can expand the panel without the citation apparatus cluttering the reading experience for users who do not.

::CtaTryApp
---
buttonText: "Try The Live AI App"
supportingCopy: "Try the RAG-powered Bible study app these patterns were built for."
destinationUrl: "https://bibleverse.donavanjones.com/register"
---
::

## Handling Citation Failures

Not every citation attempt succeeds. The handling of failures is as important as the handling of successes.

### Uncited Claims

When the model makes a theological claim without a citation — the Level 3 failure — the system detects it through a post-response scan:

```typescript
async function detectUncitedClaims(
  response: string,
  citations: Citation[]
): Promise<string[]> {
  const citedPositions = citations.map(c => response.indexOf(c.claim));

  // Ask a lightweight model to identify theological claims in the response
  const claims = await fastModel.complete({
    prompt: `List each distinct theological claim in this response as a short phrase:
    
${response}

Only list claims about scripture, God, salvation, or Christian doctrine. 
One per line.`,
    maxTokens: 200,
  });

  const allClaims = claims.split("\n").filter(Boolean);
  return allClaims.filter(claim =>
    !citations.some(c => roughMatch(c.claim, claim))
  );
}
```

Detected uncited claims are surfaced to the user with a note: "This claim is from the model's training knowledge and has not been verified against retrieved scripture." This is a soft warning — it does not suppress the claim, but it sets appropriate epistemic expectations.

### Hallucinated References

When a cited reference does not exist in the database (fails the presence check and the database lookup), it is a hallucinated citation. Hallucinated citations are never shown to the user. Instead:

```
Note: The model attempted to cite a reference that could not be verified 
(Rom 4:12 in this context). This claim has been marked unverified.
```

The full response is still returned — a single citation failure does not invalidate a well-supported response. Only the specific unsupported claim is flagged.

### Weak Support

Citations that pass presence checking but return `NOT_SUPPORTED` in the support check are shown with an explicit qualification:

```
Romans 3:9 — "What then? Are we Jews any better off? No, not at all."
⚠ Support level: Not directly supported — this passage addresses Jewish 
  privilege rather than justification specifically. The connection requires 
  additional context from the broader argument in Romans 3.
```

This transparency builds user trust. A platform that acknowledges the limits of its citations is more trustworthy than one that presents all citations with equal confidence.

## Why Citation Grounding Matters Specifically for Theology

In many AI applications, citation grounding is a nice-to-have — it improves trust and verifiability but the stakes of a wrong uncited claim are low. In theological AI, the stakes are different.

Scripture is treated as authoritative by the people using this platform. A response that misrepresents what scripture says — whether through a fabricated citation, an out-of-context reference, or an unsupported claim dressed up as biblical teaching — does real harm. It forms false beliefs about what the text says. It may lead someone to a theological position they would not hold if they read the actual passage. It undermines trust in the platform when the user eventually checks the reference themselves.

Citation grounding is not primarily a technical constraint on this platform — it is an ethical one. The model should not speak for scripture. It should surface scripture and help the user understand it. Verified, transparent citations are how the system stays in that role.

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
  buttonText: "Read: Hallucination Reduction"
  supportingCopy: "Continue with \"Hallucination Reduction\" for the next piece of this system."
  destinationUrl: "/blog/ai-engineering/14-hallucination-reduction"
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
  - label: "Citation — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Citation"
    type: "wikipedia"
    description: "According to this overview, citation is a formal reference to a source — the standard the AI system's grounding practice is modeled on."
  - label: "Fact-Checking — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Fact-checking"
    type: "wikipedia"
    description: "The journalistic and research practice of verifying claims against sources — the domain that citation grounding adapts for AI-generated theological content."
  - label: "Natural Language Inference — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Natural_language_inference"
    type: "wikipedia"
    description: "The task of determining whether a hypothesis is entailed by a premise — the formal basis for checking whether a model's claim is supported by retrieved text."
  - label: "FActScoring: Fine-Grained Atomic Evaluation of Factual Precision (Min et al., 2023)"
    url: "https://doi.org/10.48550/arXiv.2305.14251"
    type: "doi"
    description: "Research on atomic claim-level factuality evaluation — the methodology underlying citation verification in production AI systems."
---
::

---

*[← Back to AI Engineering](/categories/ai-engineering)*
