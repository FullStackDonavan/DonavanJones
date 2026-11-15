---
title: "AI Pipeline Design"
description: "VerseHub's AI pipeline design: a fast llama3.2:3b draft on a Jetson, then a Temporal refine pass that retrieves, scores, generates, and verifies citations."
date: 2026-08-26
lastUpdated: "2026-11-14"
category: "versehub-engineering"
tags:
  - versehub-engineering
  - ai-pipeline
draft: false
slug: ai-pipeline-design
author: Donavan Jones
excerptImage: /img/blog/versehub-engineering/04-ai-pipeline-design.jpg
---

# AI Pipeline Design

VerseHub's AI study domain is a pipeline, not a single model call: a fast draft from a small local model, then a refine pass where retrieval, scoring, generation, and citation verification each run as distinct stages. That split makes the pipeline debuggable and lets each stage be improved on its own.

*Part of the [VerseHub Engineering series](/categories/versehub-engineering). For the project overview, see the [VerseHub project page](/projects/versehub).*

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
2. Fast draft — llama3.2:3b, pinned on a Jetson Orin Nano Super (~21 tok/s), streamed to the user
3. Refine pass starts as a Temporal ScholarWorkflow on the Pi workers:
   a. Retrieve — embed the query (all-MiniLM-L6-v2) and search Weaviate's verse and Church Fathers collections
   b. Score — rank and filter the retrieved evidence
   c. Generate — grounded response using the retrieved passages as context
   d. Verify — check every citation against the retrieved evidence
4. Response assembly — final answer with citations back to source passages
```

Each stage is a distinct, testable unit. A regression in retrieval quality shows up as a distinct failure mode from a regression in generation quality, and being able to isolate which stage is responsible is what makes debugging a pipeline like this tractable at all.

## Why a Fast Draft and a Refine Pass

Not every question needs the same treatment, and nobody wants to stare at a spinner. The draft gives the user an answer to read within seconds from a 3B model that's always loaded, so there's no model load time on the request path. The refine pass then does the expensive, careful work — retrieval, scoring, grounded generation, citation checks — durably in Temporal, where a slow or failed step retries on its own instead of failing the request.

One early mistake: helper calls (small classification and rewrite steps) each started their own workflow, so a single question could spawn three workflows. Those now go to a direct quick-LLM endpoint, and only the real refine pass runs as a workflow. More on that in [Temporal Workflows in Production](/blog/versehub-engineering/07-temporal-workflows-in-production).

## Retrieval Bugs Are Silent Bugs

Two retrieval failures taught me to test this stage on its own. First, the scripture search path wasn't sending the query vector to Weaviate, so it returned verses in insertion order — results that looked like search results but weren't. Second, when retrieval failed it returned an empty list, and generation happily produced confident answers with no evidence behind them. Retrieval now raises on failure instead. The general techniques are in [Semantic Retrieval](/blog/ai-engineering/12-semantic-retrieval).

## Grounding Generation in Retrieved Text

The generation stage is explicitly instructed to answer using only the retrieved passages as its factual basis, with the retrieved text passed directly into the prompt context — not to rely on the model's own training-time familiarity with scripture, which reduces (though doesn't eliminate) the risk of the model confidently misquoting or misattributing text.

## Verification as Its Own Stage, Not an Afterthought

Rather than trusting generation output directly, a verification stage checks specific claims in the generated response against the retrieved source passages before the response is assembled and returned. This is covered in full depth in [Verification Pipeline for AI Outputs](/blog/versehub-engineering/06-verification-pipeline-for-ai-outputs) — it's substantial enough to warrant separate treatment, and it's the stage most responsible for VerseHub's AI features being trustworthy enough to ship to real users.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how this AI pipeline fits into VerseHub's full production architecture."
destinationUrl: "/projects/versehub"
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
  destinationUrl: "/blog/versehub-engineering/06-verification-pipeline-for-ai-outputs"
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

## Related reading

- [How I Built a Production AI Bible Platform](/blog/versehub-engineering/03-how-i-built-a-production-ai-bible-platform) — previous in the series: the build order.
- [Redis Memory Layer Design](/blog/versehub-engineering/05-redis-memory-layer-design) — next: sessions, rate limits, and the LLM cache.
- [VerseHub project page](/projects/versehub) — overview and architecture diagram.
- [Citation Grounding](/blog/ai-engineering/13-citation-grounding) — the grounding technique behind stage 3d.
- [Building Multi-Agent Workflows with Temporal](/blog/agentic-ai-systems/07-building-multi-agent-workflows-with-temporal) — the general Temporal pattern.

---

*[← Back to VerseHub Engineering](/categories/versehub-engineering)*
