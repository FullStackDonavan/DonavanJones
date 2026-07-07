---
title: "Temporal Workflows in Production"
description: "Why VerseHub introduced Temporal alongside BullMQ specifically for its more complex, long-running agentic AI workflows."
date: 2026-08-05
lastUpdated: "2026-08-05"
category: "versehub-engineering"
tags:
  - versehub-engineering
  - temporal
draft: true
slug: temporal-workflows-in-production
author: Donavan Jones
---

# Temporal Workflows in Production

VerseHub already had BullMQ handling straightforward background jobs — media transcoding, notification delivery — well before any agentic AI features existed. Those jobs are short, mostly single-step, and BullMQ's simpler queue model fits them fine. The more elaborate agentic study workflows that came later needed something with stronger durability guarantees, which is where Temporal entered the stack.

*Part of the [VerseHub Engineering series](/categories/versehub-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every VerseHub engineering deep-dive in this series."
destinationUrl: "/categories/versehub-engineering"
---
::

## Why BullMQ Wasn't Enough for These Specifically

The multi-step AI study workflows — retrieve, classify, generate, verify, and potentially regenerate on a failed verification, as covered in the [verification pipeline article](/blog/versehub-engineering/verification-pipeline-for-ai-outputs) — involve multiple sequential steps, each of which can fail independently, with a need to resume from the last successful step rather than restart the whole workflow. BullMQ handles job retries well at the level of a single job; it doesn't natively model a multi-step workflow's state the way Temporal does.

## What Runs on Temporal in VerseHub

```python
@workflow.defn
class StudyResponseWorkflow:
    @workflow.run
    async def run(self, question: str, user_id: str) -> str:
        context = await workflow.execute_activity(retrieve_context, question, ...)
        classification = await workflow.execute_activity(classify_query, question, ...)
        response = await workflow.execute_activity(
            generate_response, {"question": question, "context": context, "classification": classification}, ...
        )
        verification = await workflow.execute_activity(verify_response, {"response": response, "context": context}, ...)
        if not verification.passed:
            response = await workflow.execute_activity(
                regenerate_with_feedback, {"original": response, "feedback": verification.feedback}, ...
            )
        return response
```

Each activity's result is durably recorded — a transient failure in the generation step (a model API timeout, for instance) retries that step specifically without re-running retrieval or classification from scratch.

## What Stays on BullMQ

Media transcoding, notification delivery, and other single-step, fire-and-forget jobs remain on BullMQ — introducing Temporal's heavier orchestration model for jobs that don't need multi-step durability would be adding complexity without a corresponding benefit. The two coexist deliberately, each handling the class of job it's actually suited for.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how workflow orchestration fits into VerseHub's full architecture."
destinationUrl: "/systems/versehub-engineering"
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
  destinationUrl: "/blog/agentic-ai-systems/building-multi-agent-workflows-with-temporal"
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

---

*[← Back to VerseHub Engineering](/categories/versehub-engineering)*
