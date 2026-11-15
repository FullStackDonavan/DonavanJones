---
title: "Temporal Workflows in Production"
description: "Temporal workflows in production at VerseHub: the ScholarWorkflow refine pass (retrieve, score, generate, verify), why BullMQ wasn't enough, and the bugs I hit."
date: 2026-10-06
lastUpdated: "2026-11-14"
category: "versehub-engineering"
tags:
  - versehub-engineering
  - temporal
draft: false
slug: temporal-workflows-in-production
author: Donavan Jones
excerptImage: /img/blog/versehub-engineering/07-temporal-workflows-in-production.jpg
---

# Temporal Workflows in Production

VerseHub uses Temporal for its multi-step AI refine pass — a `ScholarWorkflow` that retrieves, scores, generates, and verifies — because each step can fail independently and needs to resume where it left off, which a simple job queue doesn't model. BullMQ was already handling straightforward background jobs like media transcoding and notifications, and still does; those are short, single-step, and fit its queue model fine. The Temporal workers run on the Raspberry Pi side of my K3s cluster.

*Part of the [VerseHub Engineering series](/categories/versehub-engineering). For the project overview, see the [VerseHub project page](/projects/versehub).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every VerseHub engineering deep-dive in this series."
destinationUrl: "/categories/versehub-engineering"
---
::

## Why BullMQ Wasn't Enough for These Specifically

The multi-step AI study workflows — retrieve, score, generate, verify, and potentially regenerate on a failed verification, as covered in the [verification pipeline article](/blog/versehub-engineering/06-verification-pipeline-for-ai-outputs) — involve multiple sequential steps, each of which can fail independently, with a need to resume from the last successful step rather than restart the whole workflow. BullMQ handles job retries well at the level of a single job; it doesn't natively model a multi-step workflow's state the way Temporal does.

## What Runs on Temporal in VerseHub

A simplified version of the refine workflow:

```python
@workflow.defn
class ScholarWorkflow:
    @workflow.run
    async def run(self, question: str, user_id: str) -> str:
        context = await workflow.execute_activity(retrieve_context, question, ...)
        scored = await workflow.execute_activity(score_evidence, {"question": question, "context": context}, ...)
        response = await workflow.execute_activity(
            generate_response, {"question": question, "context": scored}, ...
        )
        verification = await workflow.execute_activity(verify_response, {"response": response, "context": context}, ...)
        if not verification.passed:
            response = await workflow.execute_activity(
                regenerate_with_feedback, {"original": response, "feedback": verification.feedback}, ...
            )
        return response
```

Each activity's result is durably recorded — a transient failure in the generation step (a model timeout, for instance) retries that step specifically without re-running retrieval or scoring from scratch.

## Production Lessons

Two things bit me once this was live:

- **The default 10-second timeout.** Temporal's default 10 s task timeout is fine for most work and far too short for LLM generation on small hardware. Long-running activities need explicit, generous timeouts (and heartbeats where it makes sense), or they fail and retry even though nothing is actually wrong.
- **Three workflows per question.** Small helper calls — quick classification and rewrite steps — were each starting their own workflow, so one question spawned three. That was durability overhead for calls that didn't need it. Helpers now hit a direct quick-LLM endpoint, and only the real refine pass runs as a workflow.

The general patterns are covered in [Long-Running Agent Workflows](/blog/agentic-ai-systems/09-long-running-agent-workflows).

## What Stays on BullMQ

Media transcoding, notification delivery, and other single-step, fire-and-forget jobs remain on BullMQ — introducing Temporal's heavier orchestration model for jobs that don't need multi-step durability would be adding complexity without a corresponding benefit. The two coexist deliberately, each handling the class of job it's actually suited for.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how workflow orchestration fits into VerseHub's full architecture."
destinationUrl: "/projects/versehub"
---
::

## What Changed After Adopting Temporal

Before Temporal, a failure partway through the multi-step study response flow meant either silently returning a partial/unverified response or restarting the entire flow from scratch — neither is acceptable for a user-facing feature. With Temporal, a mid-workflow failure resumes cleanly from its last durable checkpoint, which meaningfully improved reliability on exactly the feature (AI study responses) where reliability mattered most.

::CtaCardRow
  :::CtaTryApp
  ---
  buttonText: "Try VerseHub"
  supportingCopy: "See this workflow orchestration running in production."
  destinationUrl: "https://versehub.app/"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Building Multi-Agent Workflows with Temporal"
  supportingCopy: "The general Temporal orchestration pattern this workflow is built on."
  destinationUrl: "/blog/agentic-ai-systems/07-building-multi-agent-workflows-with-temporal"
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
  - label: "Temporal — Official Documentation"
    url: "https://docs.temporal.io/"
    type: "external"
    description: "Official documentation for the durable execution platform used for VerseHub's multi-step AI workflows."
  - label: "BullMQ — Official Documentation"
    url: "https://docs.bullmq.io/"
    type: "external"
    description: "Documentation for the simpler job queue that continues to handle single-step background jobs."
---
::

## Related reading

- [Verification Pipeline for AI Outputs](/blog/versehub-engineering/06-verification-pipeline-for-ai-outputs) — previous in the series: the verify step in depth.
- [MinIO Storage Strategy](/blog/versehub-engineering/08-minio-storage-strategy) — next: where media and artifacts live.
- [VerseHub project page](/projects/versehub) — overview and architecture diagram.
- [Building Multi-Agent Workflows with Temporal](/blog/agentic-ai-systems/07-building-multi-agent-workflows-with-temporal) — the general Temporal orchestration pattern.
- [Async Workers](/blog/backendengineering/12-async-workers) — when a plain queue is the right tool instead.

---

*[← Back to VerseHub Engineering](/categories/versehub-engineering)*
