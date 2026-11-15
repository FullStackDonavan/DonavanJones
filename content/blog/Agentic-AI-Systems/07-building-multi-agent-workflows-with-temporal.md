---
title: "Building Multi-Agent Workflows with Temporal"
description: "Building multi-agent workflows with Temporal: run each agent as a durable activity so workflows survive crashes, retry failed steps, and wait for human signals."
date: 2026-10-01
lastUpdated: "2026-11-14"
category: "agentic-ai-systems"
tags:
  - agentic-ai-systems
  - temporal
  - orchestration
draft: false
slug: building-multi-agent-workflows-with-temporal
author: Donavan Jones
excerptImage: /img/blog/agentic-ai-systems/07-building-multi-agent-workflows-with-temporal.jpg
---

# Building Multi-Agent Workflows with Temporal

An in-process loop coordinating multiple agents works fine until the process crashes, the host restarts, or a single step takes long enough that you need the workflow to survive beyond one running program. Temporal solves this by making workflow state durable — every step's result is persisted, so a workflow can resume exactly where it left off regardless of what happened to the process that was running it.

*Part of the [Agentic AI Systems series](/categories/agentic-ai-systems). For how these patterns fit together in a running system, see the [agentic AI systems hub](/systems/agentic-ai).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every agentic AI systems deep-dive in this series."
destinationUrl: "/categories/agentic-ai-systems"
---
::

## Why Durable Execution Matters for Multi-Agent Workflows

Multi-agent workflows are exactly the kind of process most likely to run long enough for something to go wrong along the way: an agent calling an external API that's temporarily down, a worker process restarting for a deploy, a step that takes twenty minutes. Without durable execution, any of these means starting the whole workflow over. With Temporal, the workflow resumes from its last completed step.

## Structuring a Multi-Agent Workflow

```python
from datetime import timedelta
from temporalio import workflow

@workflow.defn
class ResearchAndWriteWorkflow:
    @workflow.run
    async def run(self, topic: str) -> str:
        research = await workflow.execute_activity(
            research_agent_task, topic, start_to_close_timeout=timedelta(minutes=10),
        )
        draft = await workflow.execute_activity(
            writing_agent_task, research, start_to_close_timeout=timedelta(minutes=5),
        )
        verified = await workflow.execute_activity(
            verification_agent_task, draft, start_to_close_timeout=timedelta(minutes=3),
        )
        if not verified.passed:
            draft = await workflow.execute_activity(
                writing_agent_task, {"research": research, "feedback": verified.feedback},
                start_to_close_timeout=timedelta(minutes=5),
            )
        return draft
```

Each agent runs as a Temporal activity. If the writing agent's activity fails (a model API error, a timeout), Temporal retries it automatically per the configured retry policy — the research agent's already-completed result isn't lost or re-run.

This is the shape of VerseHub's refine pass: a Temporal `ScholarWorkflow` running on the Raspberry Pi workers in my cluster, with retrieve → score → generate → verify as separate activities. One production lesson: set explicit timeouts on every LLM-backed step — Temporal's default 10-second task timeout bit me early on. More in [Temporal Workflows in Production](/blog/versehub-engineering/07-temporal-workflows-in-production).

## Signals for Human-in-the-Loop Steps

Some multi-agent workflows need to pause for human input mid-way — approving a plan, providing missing information. Temporal signals handle this cleanly: the workflow waits on a signal, and the workflow's durable state means it can [wait for hours or days](/blog/agentic-ai-systems/09-long-running-agent-workflows) without holding any process resources in the meantime.

```python
@workflow.defn
class ApprovalGatedWorkflow:
    def __init__(self):
        self.approved = None

    @workflow.signal
    def approve(self, decision: bool):
        self.approved = decision

    @workflow.run
    async def run(self, task: str):
        plan = await workflow.execute_activity(planning_agent_task, task, ...)
        await workflow.wait_condition(lambda: self.approved is not None)
        if self.approved:
            return await workflow.execute_activity(execution_agent_task, plan, ...)
        return "Rejected"
```

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how Temporal-based orchestration fits into a full production agentic system."
destinationUrl: "/systems/agentic-ai"
---
::

## What Temporal Doesn't Solve

Temporal handles durability and retries; it doesn't decide what the agents should do or resolve semantic conflicts between their outputs. It's the reliability layer underneath the agent logic, not a replacement for the [planning](/blog/agentic-ai-systems/02-planning-agents-explained) and [verification](/blog/agentic-ai-systems/11-verification-agents-in-production) work covered elsewhere in this series.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The AI Starter Kit"
  supportingCopy: "Get the Self-Hosted AI Starter Kit — full agent orchestration patterns ($29)."
  destinationUrl: "/products/self-hosted-ai-starter-kit"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Event-Driven AI Agents Using Kafka"
  supportingCopy: "The event-driven alternative to workflow-based orchestration."
  destinationUrl: "/blog/agentic-ai-systems/08-event-driven-ai-agents-using-kafka"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get new agentic AI breakdowns delivered before they're public."
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
    description: "Official documentation for the durable execution platform used throughout this workflow architecture."
  - label: "Durable Execution — Temporal Docs"
    url: "https://docs.temporal.io/evaluate/understanding-temporal"
    type: "external"
    description: "Explanation of the durable execution model that lets workflows survive crashes and restarts."
---
::

## Related reading

- [Building an AI Copilot That Understands Your Entire Codebase](/blog/agentic-ai-systems/06-building-an-ai-copilot-that-understands-your-codebase) — previous: combining retrieval and memory into one system
- [Event-Driven AI Agents Using Kafka](/blog/agentic-ai-systems/08-event-driven-ai-agents-using-kafka) — next: triggering agents from events instead of requests
- [Agentic AI Systems hub](/systems/agentic-ai) — the hub for the agentic AI series
- [Agent Orchestration](/blog/ai-engineering/04-agent-orchestration) — orchestration patterns beyond Temporal
- [Raspberry Pi AI Cluster Setup](/blog/ai-homelab-engineering/08-raspberry-pi-ai-cluster-setup) — the Pi workers these workflows actually run on

---

*[← Back to Agentic AI Systems](/categories/agentic-ai-systems)*
