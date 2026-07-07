---
title: "Electricity vs API Pricing"
description: "A direct comparison methodology between per-token API pricing and the per-request electricity cost of running an equivalent model locally."
date: 2026-05-20
lastUpdated: "2026-06-09"
category: "ai-cost-optimization"
tags:
  - ai-cost-optimization
  - electricity
draft: true
slug: electricity-vs-api-pricing
author: Donavan Jones
---

# Electricity vs API Pricing

Comparing a per-token API price against local electricity cost requires converting both to the same unit — cost per request — which is a less obvious calculation than it sounds, because electricity cost doesn't scale with tokens the way API pricing does; it scales with GPU time.

*Part of the [AI Cost Optimization series](/categories/ai-cost-optimization).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI cost optimization deep-dive in this series."
destinationUrl: "/categories/ai-cost-optimization"
---
::

## Converting Electricity Cost to Cost-Per-Request

```
Cost per request = (GPU power draw during generation × generation time in hours) / 1000 × $/kWh
```

Where GPU power draw during active generation is meaningfully higher than idle draw (covered in the [monthly power bill breakdown](/blog/ai-homelab-engineering/monthly-power-bill-ai-cluster) elsewhere on this site), and generation time depends on model size, quantization, and output length.

## A Worked Comparison

For a typical coding-assistant request generating roughly 1,500 output tokens, taking about 15 seconds on a local 34B model under active GPU load (~350W):

```
(350W × 15s / 3600s) / 1000 × $0.14/kWh ≈ $0.0002 per request
```

Against a hosted API's output pricing at, illustratively, $15 per million tokens:

```
1,500 tokens × $15/1,000,000 = $0.0225 per request
```

At this illustrative comparison, the electricity cost of the same request run locally is roughly two orders of magnitude cheaper than the hosted API cost — which is the core reason the economics favor local hardware so strongly once it's already been purchased and utilization is high enough to justify the upfront cost.

## Why This Comparison Is Easy to Overstate

This math only reflects the marginal cost of an additional request once hardware is already owned and running. It deliberately excludes hardware amortization (the actual purchase price, spread over its useful life) — which is why this comparison is not the same as "local AI is 100x cheaper than API access" in absolute terms. It's specifically the marginal cost comparison, which matters once you're deciding whether to run one more request locally versus through an API, given hardware you already have.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See the full hardware and electricity model behind these numbers."
destinationUrl: "/systems/ai-cost-optimization"
---
::

## Where Amortization Enters the Full Picture

The complete cost comparison — including hardware amortization, not just marginal electricity — is covered in the [Hardware ROI](/blog/ai-cost-optimization/hardware-roi-for-ai-development) article in this series. This article's narrower point stands on its own regardless: once hardware is already owned, the marginal cost of local inference is close enough to free that maximizing local usage (for tasks a local model can actually handle well) is close to a strictly dominant choice on cost alone.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Production AI API Boilerplate"
  supportingCopy: "Get a boilerplate with built-in cost tracking across local and hosted inference ($39)."
  destinationUrl: "/products/production-ai-api-boilerplate"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Hardware ROI for AI Development"
  supportingCopy: "The full cost picture, including hardware amortization."
  destinationUrl: "/blog/ai-cost-optimization/hardware-roi-for-ai-development"
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
  - label: "Kilowatt-hour — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kilowatt-hour"
    type: "wikipedia"
    description: "The billing unit used to convert GPU power draw into a comparable dollar cost."
  - label: "Marginal Cost — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Marginal_cost"
    type: "wikipedia"
    description: "The economic concept underlying why this comparison excludes hardware amortization by design."
---
::

---

*[← Back to AI Cost Optimization](/categories/ai-cost-optimization)*
