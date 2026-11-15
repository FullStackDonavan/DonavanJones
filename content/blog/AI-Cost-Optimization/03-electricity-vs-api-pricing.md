---
title: "Electricity vs API Pricing"
description: "Electricity vs API pricing: how to convert local GPU power draw into cost per request and compare it with per-token API fees, with a worked RTX 3090 example."
date: 2026-08-01
lastUpdated: "2026-11-14"
category: "ai-cost-optimization"
tags:
  - ai-cost-optimization
  - electricity
draft: false
slug: electricity-vs-api-pricing
author: Donavan Jones
excerptImage: /img/blog/ai-cost-optimization/03-electricity-vs-api-pricing.jpg
---

# Electricity vs API Pricing

Once you already own the hardware, the electricity for a local request costs a small fraction of the same request through an API — about $0.0003 versus $0.015 in the worked example below. Getting there means converting both to cost per request, because electricity scales with GPU time, not with tokens the way API pricing does.

*Part of the [AI Cost Optimization series](/categories/ai-cost-optimization). For the hardware these numbers are based on, see the [AI homelab systems hub](/systems/ai-homelab).*

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

Where GPU power draw during active generation is meaningfully higher than idle draw (covered in the [monthly power bill breakdown](/blog/ai-homelab-engineering/14-monthly-power-bill-ai-cluster) elsewhere on this site), and generation time depends on model size, quantization, and output length (the levers covered in [RTX 3090 Optimization for LLMs](/blog/ai-homelab-engineering/10-rtx-3090-optimization-for-llms)).

## A Worked Comparison

Take a typical coding-assistant request that generates about 1,500 output tokens. On my RTX 3090, Ornith-1.0-35B generates at about 64 tok/s, so that's roughly 23 seconds of generation. Assume the card draws close to its 350 W limit while generating and an electricity rate of $0.14/kWh:

```
(350W × 23s / 3600s) / 1000 × $0.14/kWh ≈ $0.0003 per request
```

Against a hosted API's output pricing at $10 per million tokens (the current mid-tier [Claude rate](/blog/ai-cost-optimization/01-claude-api-cost-breakdown)):

```
1,500 tokens × $10/1,000,000 = $0.015 per request
```

In this comparison, the electricity for the same request run locally is roughly 50x cheaper than the hosted API cost — which is the core reason the economics favor local hardware so strongly once it's already been purchased and utilization is high enough to justify the upfront cost.

## Why This Comparison Is Easy to Overstate

This math only reflects the marginal cost of an additional request once hardware is already owned and running. It deliberately excludes hardware amortization (the actual purchase price, spread over its useful life) — which is why this comparison is not the same as "local AI is 50x cheaper than API access" in absolute terms. It's specifically the marginal cost comparison, which matters once you're deciding whether to run one more request locally versus through an API, given hardware you already have.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See the full hardware and electricity model behind these numbers."
destinationUrl: "/systems/ai-homelab"
---
::

## Where Amortization Enters the Full Picture

The complete cost comparison — including hardware amortization, not just marginal electricity — is covered in the [Hardware ROI](/blog/ai-cost-optimization/04-hardware-roi-for-ai-development) article in this series. This article's narrower point stands on its own regardless: once hardware is already owned, the marginal cost of local inference is close enough to free that maximizing local usage (for tasks a local model can actually handle well) is close to a strictly dominant choice on cost alone.

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
  destinationUrl: "/blog/ai-cost-optimization/04-hardware-roi-for-ai-development"
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

## Related reading

- [OpenAI API Cost vs Local AI](/blog/ai-cost-optimization/02-openai-api-cost-vs-local-ai) — previous: the general hosted-vs-local cost formula
- [Hardware ROI for AI Development](/blog/ai-cost-optimization/04-hardware-roi-for-ai-development) — next: adding hardware amortization to the picture
- [AI Homelab systems hub](/systems/ai-homelab) — the cluster these power numbers come from
- [Power Consumption Tradeoffs](/blog/infrastructureengineering/30-power-consumption-tradeoffs) — power tradeoffs across the whole rack

---

*[← Back to AI Cost Optimization](/categories/ai-cost-optimization)*
