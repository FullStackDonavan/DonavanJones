---
title: "AI Pipeline Design"
description: "The internal design of VerseHub's AI study domain — retrieval, hybrid model routing, and response assembly."
date: 2026-07-15
lastUpdated: "2026-07-15"
category: "versehub-engineering"
tags:
  - versehub-engineering
  - ai-pipeline
draft: true
slug: ai-pipeline-design
author: Donavan Jones
---

# AI Pipeline Design

VerseHub's AI study domain is a pipeline, not a single model call — retrieval, classification, generation, and verification each run as distinct stages, which makes the pipeline debuggable and each stage independently improvable.

*Part of the [VerseHub Engineering series](/categories/versehub-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every VerseHub engineering deep-dive in this series."
destinationUrl: "/categories/versehub-engineering"
---
::

## The Pipeline Stages

```
1. User submits a study question
2. Query classification — scope and complexity assessment
3. Retrieval — Weaviate semantic search against the scripture corpus
4. Model routing — Llama 3.2 8B (standard) or OpenAI API (complex/low-confidence)
5. Generation — grounded response using retrieved passages as context
6. Verification — check generated claims against retrieved source text
7. Response assembly — final answer with citations back to source passages
```

Each stage is a distinct, testable unit. A regression in retrieval quality shows up as a distinct failure mode from a regression in generation quality, and being able to isolate which stage is responsible is what makes debugging a pipeline like this tractable at all.

## Query Classification Drives the Routing Decision

Not every question needs the same treatment. A direct factual lookup ("what does this verse say") is classified differently from an open-ended theological question ("how do these two passages relate"), and the classification result feeds directly into the model-routing decision in stage 4 — simpler, well-scoped questions route to the local Llama model; open-ended or ambiguous questions escalate to the OpenAI API, where a stronger model's broader reasoning is worth the additional cost.

## Grounding Generation in Retrieved Text

The generation stage is explicitly instructed to answer using only the retrieved passages as its factual basis, with the retrieved text passed directly into the prompt context — not to rely on the model's own training-time familiarity with scripture, which reduces (though doesn't eliminate) the risk of the model confidently misquoting or misattributing text.

## Verification as Its Own Stage, Not an Afterthought

Rather than trusting generation output directly, a verification stage checks specific claims in the generated response against the retrieved source passages before the response is assembled and returned. This is covered in full depth in its own article in this series — it's substantial enough to warrant separate treatment, and it's the stage most responsible for VerseHub's AI features being trustworthy enough to ship to real users.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how this AI pipeline fits into VerseHub's full production architecture."
destinationUrl: "/systems/versehub-engineering"
---
::

## Why Stages, Not a Single Prompt

A single, large prompt asking a model to retrieve context, decide on approach, generate an answer, and self-verify in one pass is harder to debug and harder to improve incrementally than a pipeline with explicit stage boundaries. Splitting the work into stages costs some additional latency (multiple model/service calls instead of one) in exchange for a system that's meaningfully easier to reason about and improve piece by piece.

::CtaCardRow
  :::CtaTryApp
  ---
  buttonText: "Try VerseHub"
  supportingCopy: "See this AI pipeline running in production."
  destinationUrl: "https://versehub.app/"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Verification Pipeline for AI Outputs"
  supportingCopy: "A deep dive on stage 6 of this pipeline."
  destinationUrl: "/blog/versehub-engineering/verification-pipeline-for-ai-outputs"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get new VerseHub engineering breakdowns delivered before they're public."
  ---
  :::
::

## Further Reading

::AuthoritativeLinks
---
title: "Authoritative Sources"
links:
  - label: "Pipeline (software) — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Pipeline_(software)"
    type: "wikipedia"
    description: "Background on the staged-pipeline architectural pattern applied to this AI processing flow."
  - label: "Vector Database — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Vector_database"
    type: "wikipedia"
    description: "Background on the semantic search infrastructure powering the retrieval stage."
---
::

---

*[← Back to VerseHub Engineering](/categories/versehub-engineering)*
