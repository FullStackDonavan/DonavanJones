---
title: "Claude API Cost Breakdown"
description: "Claude API cost breakdown: current per-token pricing for Opus, Sonnet, and Haiku, and what really drives spend: output length, prompt caching, and thinking."
date: 2026-07-07
lastUpdated: "2026-11-14"
category: "ai-cost-optimization"
tags:
  - ai-cost-optimization
  - claude-api
draft: false
slug: claude-api-cost-breakdown
author: Donavan Jones
excerptImage: /img/blog/ai-cost-optimization/01-claude-api-cost-breakdown.jpg
---

# Claude API Cost Breakdown

Claude API pricing is per million tokens, billed separately for input and output, and output costs 5x input on every tier. As of November 2026 the current models list at $4/$20 (Opus), $2/$10 (Sonnet), and $0.10/$0.50 (Haiku, for prompts up to 100K tokens) per million input/output tokens. What actually drives your bill — output length, caching, and request volume — matters more than the sticker price.

*Part of the [AI Cost Optimization series](/categories/ai-cost-optimization). For the hardware these numbers are based on, see the [AI homelab systems hub](/systems/ai-homelab).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI cost optimization deep-dive in this series."
destinationUrl: "/categories/ai-cost-optimization"
---
::

## Pricing by Model Tier

| Model | Input ($/1M tokens) | Output ($/1M tokens) | Best for |
|---|---|---|---|
| Claude Opus 5.5 (top tier) | $4.00 | $20.00 | Hardest reasoning, long-horizon agentic work |
| Claude Sonnet 5.5 (mid tier) | $2.00 | $10.00 | Best balance of speed, quality, and cost for coding |
| Claude Haiku 5.5 (fast tier) | $0.10 | $0.50 | High-volume, latency-sensitive, simpler tasks |

First-party API list prices as of November 2026 (Haiku 5.5's rate applies to prompts up to 100K tokens). Older models still served are priced differently — Opus 4.x, for example, lists at $5/$25 — so check the model ID you're actually calling.

Output tokens cost roughly 5x input tokens across every tier — a useful rule of thumb, since it means the length of the response matters more to cost than the length of the prompt, for most typical requests.

## What Actually Drives Real-World Spend

**Output length, not input length, usually dominates.** A short prompt that generates a long response (a full function implementation, a detailed explanation) costs more than a long prompt with a short response, because output tokens are priced several times higher than input tokens.

**Prompt caching cuts repeated-context costs substantially.** For agentic workflows that resend the same system prompt and tool definitions on every request, cache reads on the current Opus and Sonnet models are billed at 5% of the standard input rate ($0.20 and $0.10 per million tokens) — this is one of the highest-leverage cost optimizations available and is frequently left unconfigured in naive implementations.

**Extended thinking adds billed tokens.** Reasoning/thinking tokens are billed as output tokens even when they're not the final visible answer — a task that benefits from deep reasoning costs more than the same task run without it, which is a real tradeoff between quality and cost, not just a quality knob.

## A Rough Monthly Estimate

For a developer using an agentic coding tool heavily — call it 50 substantial requests a day, each averaging 2,000 input tokens (with caching reducing the effective billed amount) and 1,500 output tokens, on a mid-tier model — the output cost dominates:

```
50 requests/day × 1,500 output tokens × $10/1M ≈ $0.75/day → ~$23/month (output alone)
Input costs, with caching applied, typically add a smaller fraction on top.
```

For my own day-to-day comparison of hosted versus local coding, see [Local AI vs Claude Code after 30 days](/blog/local-vibe-coding/10-local-ai-vs-claude-code-30-days). This is illustrative math, not a universal number — actual spend depends heavily on task complexity, caching hit rate, and how much of the workload runs on a cheaper tier versus the top tier.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See where API costs fit into a hybrid local/hosted AI architecture."
destinationUrl: "/systems/ai-homelab"
---
::

## Where This Series Goes Next

This breakdown is the reference point for the comparisons elsewhere in this series — against [OpenAI's pricing](/blog/ai-cost-optimization/02-openai-api-cost-vs-local-ai), against the [electricity cost of local inference](/blog/ai-cost-optimization/03-electricity-vs-api-pricing), and against a full year of real usage in the [Claude Max cost comparison](/blog/ai-cost-optimization/07-local-ai-stack-vs-year-of-claude-max).

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Production AI API Boilerplate"
  supportingCopy: "Get a production-ready API boilerplate with caching and cost controls built in ($39)."
  destinationUrl: "/products/production-ai-api-boilerplate"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: OpenAI API Cost vs Local AI"
  supportingCopy: "The same breakdown applied to OpenAI's pricing model."
  destinationUrl: "/blog/ai-cost-optimization/02-openai-api-cost-vs-local-ai"
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
  - label: "Claude Pricing — Official Documentation"
    url: "https://platform.claude.com/docs/en/pricing"
    type: "external"
    description: "Official, current pricing reference for all Claude API model tiers."
  - label: "Prompt Caching — Official Documentation"
    url: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching"
    type: "external"
    description: "Official documentation for the caching mechanism referenced above as the highest-leverage cost optimization."
---
::

## Related reading

- [OpenAI API Cost vs Local AI](/blog/ai-cost-optimization/02-openai-api-cost-vs-local-ai) — next: the same framework applied to OpenAI's API
- [How I Built a Local AI Stack for Less Than a Year of Claude Max](/blog/ai-cost-optimization/07-local-ai-stack-vs-year-of-claude-max) — the full year-long comparison these numbers feed into
- [AI Homelab systems hub](/systems/ai-homelab) — the local hardware on the other side of the comparison
- [Why I Stopped Paying for Claude: Building a Local AI Development Environment](/blog/local-vibe-coding/09-why-i-stopped-paying-for-claude) — why I moved most routine coding work to local models

---

*[← Back to AI Cost Optimization](/categories/ai-cost-optimization)*
