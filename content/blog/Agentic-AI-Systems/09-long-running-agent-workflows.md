---
title: "Long-Running Agent Workflows"
description: "Long-running agent workflows that run for hours or days: durable checkpointing, progress visibility, graceful interruption, and re-validating assumptions."
date: 2026-10-17
lastUpdated: "2026-11-14"
category: "agentic-ai-systems"
tags:
  - agentic-ai-systems
  - orchestration
draft: false
slug: long-running-agent-workflows
author: Donavan Jones
excerptImage: /img/blog/agentic-ai-systems/09-long-running-agent-workflows.jpg
---

# Long-Running Agent Workflows

Most agent examples assume a task completes in seconds. Real agentic work — a large migration, a multi-day research task, an overnight batch job — runs far longer, and the design considerations change meaningfully once a workflow's duration is measured in hours rather than seconds.

*Part of the [Agentic AI Systems series](/categories/agentic-ai-systems). For how these patterns fit together in a running system, see the [agentic AI systems hub](/systems/agentic-ai).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every agentic AI systems deep-dive in this series."
destinationUrl: "/categories/agentic-ai-systems"
---
::

## What Changes at Longer Durations

**Checkpointing becomes mandatory, not optional.** A short task can afford to restart from scratch on failure. A workflow running for six hours cannot — every meaningful unit of progress needs to be durably recorded (this is exactly what [Temporal's activity model](/blog/agentic-ai-systems/07-building-multi-agent-workflows-with-temporal) is built for) so a failure partway through resumes rather than restarts.

**Progress visibility matters.** A human isn't watching a six-hour task in real time the way they'd watch a ten-second one. The workflow needs to surface periodic, meaningful status — not a stream of low-level tool calls, but "completed step 3 of 7, currently validating output" — somewhere a human can check without needing to tail logs. Centralized logs still matter for the post-mortem — in my cluster that's [Loki and Promtail](/blog/infrastructureengineering/43-loki-promtail-on-pi-cluster) — but they shouldn't be the progress UI.

**Graceful interruption.** Long workflows need a defined way to pause or stop mid-execution without leaving the system in an inconsistent state — a signal the workflow checks between steps, not a hard process kill that might land mid-write.

## A Practical Checkpoint Pattern

```python
@workflow.defn
class LongMigrationWorkflow:
    @workflow.run
    async def run(self, files: list[str]):
        results = []
        for i, file in enumerate(files):
            result = await workflow.execute_activity(
                migrate_file_task, file,
                start_to_close_timeout=timedelta(minutes=15),
                retry_policy=RetryPolicy(maximum_attempts=3),
            )
            results.append(result)
            workflow.upsert_search_attributes({"progress": i + 1, "total": len(files)})
        return results
```

Each file's migration is its own durable activity — a failure on file 400 of 1000 doesn't lose the previous 399, and `upsert_search_attributes` gives a queryable progress indicator without polling logs.

## Handling Drift Over Long Durations

The longer a workflow runs, the more likely something in its environment changes mid-flight — a dependency gets updated, an external API's behavior shifts. Long-running agent workflows benefit from periodic re-validation of assumptions (re-checking that a file still exists in the expected state before acting on it) rather than trusting that the world hasn't changed since the workflow started.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how long-running workflows fit into a full production agentic system."
destinationUrl: "/systems/agentic-ai"
---
::

## The Human Check-In Point

For workflows long enough to run overnight or across days, building in a deliberate summary check-in — not just raw progress, but a plain-language "here's what's been done and here's what's next" — makes the difference between a workflow a human trusts to run unattended and one they feel compelled to babysit. The guardrails for fully unattended, recurring runs are covered next in [Autonomous Background Jobs](/blog/agentic-ai-systems/10-autonomous-background-jobs).

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The AI Starter Kit"
  supportingCopy: "Get the Self-Hosted AI Starter Kit — durable workflow and checkpointing patterns ($29)."
  destinationUrl: "/products/self-hosted-ai-starter-kit"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Autonomous Background Jobs"
  supportingCopy: "The simpler cousin of long-running workflows — recurring unattended jobs."
  destinationUrl: "/blog/agentic-ai-systems/10-autonomous-background-jobs"
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
  - label: "Checkpointing — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Application_checkpointing"
    type: "wikipedia"
    description: "Background on checkpointing, the fault-tolerance pattern underlying durable long-running workflows."
  - label: "Temporal — Official Documentation"
    url: "https://docs.temporal.io/"
    type: "external"
    description: "The durable execution platform used for the checkpoint pattern shown above."
---
::

## Related reading

- [Event-Driven AI Agents Using Kafka](/blog/agentic-ai-systems/08-event-driven-ai-agents-using-kafka) — previous: event-triggered agents
- [Autonomous Background Jobs](/blog/agentic-ai-systems/10-autonomous-background-jobs) — next: guardrails for agents that run on a schedule
- [Agentic AI Systems hub](/systems/agentic-ai) — the hub for the agentic AI series
- [Temporal Workflows in Production](/blog/versehub-engineering/07-temporal-workflows-in-production) — durable workflows running in a real product
- [Grafana on a Pi K3s Cluster](/blog/infrastructureengineering/42-grafana-on-pi-cluster) — dashboards for watching long jobs

---

*[← Back to Agentic AI Systems](/categories/agentic-ai-systems)*
