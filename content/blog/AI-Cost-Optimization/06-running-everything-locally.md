---
title: "Running Everything Locally"
description: "Running everything locally: what fully replacing hosted AI APIs takes, why the last 15% of coverage costs so much, and why a hybrid setup usually wins."
date: 2026-09-11
lastUpdated: "2026-11-14"
category: "ai-cost-optimization"
tags:
  - ai-cost-optimization
  - local-ai
draft: false
slug: running-everything-locally
author: Donavan Jones
excerptImage: /img/blog/ai-cost-optimization/06-running-everything-locally.jpg
---

# Running Everything Locally

Running every AI workload locally is possible, but it's usually the wrong goal: the last 10–15% of coverage costs far more than the first 80%. A hybrid setup — local models for routine, high-volume work and a hosted API for the hardest tasks — captures most of the savings without the quality hit. This post covers what full local migration really requires and when it's still worth it.

*Part of the [AI Cost Optimization series](/categories/ai-cost-optimization). For the hardware these numbers are based on, see the [AI homelab systems hub](/systems/ai-homelab).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI cost optimization deep-dive in this series."
destinationUrl: "/categories/ai-cost-optimization"
---
::

## What "Everything" Actually Requires

Full local coverage means matching hosted-API capability across every task type you currently rely on it for — not just the common case. That includes the hardest reasoning tasks, the largest context windows, and any capability (certain tool integrations, certain model behaviors) that a locally-runnable model genuinely can't replicate at the same quality. Getting the last 10-15% of coverage costs disproportionately more than the first 80-85%, in both hardware and tuning effort.

## The Diminishing Returns Curve

```
Coverage:  0% ─────────────────── 80% ──────── 95% ──── 100%
Effort:    low                    moderate      high     very high / possibly infeasible
```

The bulk of realistic cost savings come from displacing the first 70-80% of volume — high-frequency, pattern-following requests where a well-tuned local model is genuinely competitive. Chasing full displacement means either accepting a real quality regression on the hardest tasks, or spending disproportionately on hardware and tuning to close a gap that a hosted API closes for a much smaller marginal cost.

## Why Hybrid Wins on Cost, Not Just Convenience

A hybrid approach — local for the 70-80% that's genuinely well-served, hosted for the rest — captures nearly all of the achievable cost savings without paying the steep cost of chasing full coverage. The [30-day cost/speed/privacy comparison](/blog/local-vibe-coding/10-local-ai-vs-claude-code-30-days) elsewhere on this site is a concrete example: the realistic outcome of a serious local AI investment was a hybrid split, not full replacement, and that split delivered most of the available savings.

My own setup is hybrid by design: llama3.2:3b stays pinned in memory on a Jetson for fast drafts (about 21 tok/s), Ornith-1.0-35B on the RTX 3090 handles heavier work, and I still use Claude for the hardest problems. I also tried pushing a 9B model onto a Jetson as a coding drafter; it barely fit, managed about 3 tok/s end to end, and I retired it. That's what chasing the last slice of coverage on the wrong hardware looks like.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how a hybrid local/hosted architecture is actually structured."
destinationUrl: "/systems/ai-homelab"
---
::

## When Full Local Migration Does Make Sense

The exception: hard requirements that aren't about cost at all — genuine data sovereignty or air-gap requirements where no hosted option is acceptable regardless of quality tradeoffs (see [Local AI Security: Keeping Your Code and Data Private](/blog/ai-homelab-engineering/13-local-ai-security-keeping-data-private) and [AI Coding Without Internet](/blog/local-vibe-coding/04-ai-coding-without-internet)). In that case, full local migration is the only compliant option, and the cost-optimization question becomes "how do we get local model quality as close as possible to the hosted baseline," not "should we go local at all."

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Self-Hosted AI Starter Kit"
  supportingCopy: "Get the architecture for a well-tuned local stack, hybrid-ready from day one ($29)."
  destinationUrl: "/products/self-hosted-ai-starter-kit"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: How I Built a Local AI Stack for Less Than a Year of Claude Max"
  supportingCopy: "The real numbers behind a hybrid setup, tracked over a full year."
  destinationUrl: "/blog/ai-cost-optimization/07-local-ai-stack-vs-year-of-claude-max"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get new cost breakdowns delivered before they're public."
  ---
  :::
::

## Further Reading

::AuthoritativeLinks
---
title: "Authoritative Sources"
links:
  - label: "Diminishing Returns — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Diminishing_returns"
    type: "wikipedia"
    description: "The economic concept underlying the effort/coverage curve described above."
  - label: "Data Sovereignty — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Data_sovereignty"
    type: "wikipedia"
    description: "Background on the data sovereignty requirements that justify full local migration regardless of cost tradeoffs."
---
::

::JetsonLeaderboardCard
---
metric: all
---
::

## Related reading

- [Jetson Orin Nano LLM leaderboard](/jetson-leaderboard) — measured speed, accuracy, tool calling and coding for every model I run on the Jetsons
- [When Should You Buy a GPU Instead of Paying API Fees?](/blog/ai-cost-optimization/05-when-to-buy-a-gpu-instead-of-api-fees) — previous: deciding whether hardware is worth buying at all
- [How I Built a Local AI Stack for Less Than a Year of Claude Max](/blog/ai-cost-optimization/07-local-ai-stack-vs-year-of-claude-max) — next: the full year-long cost comparison
- [AI Homelab systems hub](/systems/ai-homelab) — the hybrid local stack in one place
- [Why Local AI Matters](/blog/infrastructureengineering/39-why-local-ai-matters) — the non-cost reasons to run models locally

---

*[← Back to AI Cost Optimization](/categories/ai-cost-optimization)*
