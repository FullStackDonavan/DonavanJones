---
title: "My Monthly Power Bill Running an Always-On AI Cluster"
description: "How to estimate the monthly power bill of an always-on AI cluster: a simple formula and a worked example for an RTX 3090, three Jetsons, and four Pis."
date: 2026-11-10
lastUpdated: "2026-11-14"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - cost
draft: false
slug: monthly-power-bill-ai-cluster
author: Donavan Jones
excerptImage: /img/blog/ai-homelab-engineering/14-monthly-power-bill-ai-cluster.jpg
---

# My Monthly Power Bill Running an Always-On AI Cluster

"How much does this actually cost to run" is the question every homelab writeup dodges with a vague gesture at electricity being "not that much." The short answer for a cluster like mine: roughly 200 W of average draw, which works out to about 150 kWh a month — around $20 at an illustrative $0.14/kWh. Here's the methodology behind that estimate, with a worked example against this cluster's hardware; plug in your own electricity rate and usage pattern for a number specific to your setup.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering). For the full system map, see the [AI homelab architecture hub](/systems/ai-homelab).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI homelab deep-dive in this series."
destinationUrl: "/categories/ai-homelab-engineering"
---
::

## The Formula

```
Monthly cost = Σ (device wattage × hours/day × 30 × utilization factor) / 1000 × $/kWh
```

The utilization factor matters more than raw wattage ratings — a GPU's rated TDP is its maximum draw under full sustained load, not its typical draw across a mix of idle and active periods, and conflating the two badly overestimates cost.

## Worked Example

Estimated power draw by device, at typical (not peak) utilization for this cluster's usage pattern. These are planning estimates from rated draw and duty cycle, not metered readings:

| Device | Rated max draw | Typical utilization | Effective avg draw |
|---|---|---|---|
| RTX 3090 (desktop, GPU + system) | ~450W | ~25% (bursty interactive use) | ~115W |
| Jetson Orin Nano Super ×3 (MAXN_SUPER, 25W mode) | ~25W each | ~60% (near-continuous background) | ~45W total |
| Raspberry Pi nodes ×4 (control plane + 3 workers) | ~7W each (varies by model) | ~90% (always-on) | ~25W total |
| Network gear (switch, router) | ~20W | ~100% | ~20W |
| **Total effective average** | | | **~205W** |

At a continuous ~205W average draw:

```
205W × 24h × 30 days = 147.6 kWh/month
```

At an illustrative rate of $0.14/kWh (electricity rates vary significantly by region — check your own utility bill for the actual figure):

```
147.6 kWh × $0.14/kWh ≈ $20.66/month
```

## Why This Number Surprises People

The intuition that a ~450W GPU workstation (the 3090 itself is rated at 350W) must be expensive to run 24/7 doesn't hold up once utilization is factored in honestly — this cluster's coding-agent workload is bursty, not sustained, so the 3090 spends most of its time much closer to idle draw than its rated maximum. A workload that keeps the GPU at sustained high utilization (continuous batch inference or long training runs, for example) would produce a meaningfully higher number than this one — which is worth remembering as I turn the 3090 machine into a dedicated box for fine-tuning small models. The broader tradeoffs are in [power consumption tradeoffs](/blog/infrastructureengineering/30-power-consumption-tradeoffs).

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See the full hardware this cost breakdown is based on."
destinationUrl: "/systems/ai-homelab"
---
::

## How This Compares to a Subscription

Set against a heavy-use hosted AI coding subscription, this electricity cost is a small fraction of the monthly bill — which is the actual point of the [local AI vs Claude Code cost comparison](/blog/local-vibe-coding/10-local-ai-vs-claude-code-30-days) covered elsewhere on this site, and of the broader [electricity vs API pricing](/blog/ai-cost-optimization/03-electricity-vs-api-pricing) analysis. The hardware itself was the real upfront cost; the ongoing electricity cost of keeping it running is close to negligible by comparison, provided utilization stays in the bursty, not-sustained-load pattern most coding workloads actually produce.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Raspberry Pi AI Cluster Blueprint"
  supportingCopy: "Get the full hardware list and cost worksheet for this build ($39)."
  destinationUrl: "/products/raspberry-pi-ai-cluster-blueprint"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: The Biggest Mistakes I Made Building My AI Homelab"
  supportingCopy: "What went wrong — and what would have saved both money and time."
  destinationUrl: "/blog/ai-homelab-engineering/15-biggest-mistakes-building-ai-homelab"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get new homelab breakdowns delivered before they're public."
  ---
  :::
::

## Further Reading

::AuthoritativeLinks
---
title: "Authoritative Sources"
links:
  - label: "Thermal Design Power (TDP) — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Thermal_design_power"
    type: "wikipedia"
    description: "Background on TDP ratings and why they represent maximum, not typical, power draw."
  - label: "Kilowatt-hour — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kilowatt-hour"
    type: "wikipedia"
    description: "The billing unit used throughout the cost calculation above."
---
::

## Related reading

- [Local AI Security: Keeping Your Code and Data Private](/blog/ai-homelab-engineering/13-local-ai-security-keeping-data-private) — previous in the series: the security posture.
- [The Biggest Mistakes I Made Building My AI Homelab](/blog/ai-homelab-engineering/15-biggest-mistakes-building-ai-homelab) — next: what went wrong along the way.
- [AI Homelab architecture hub](/systems/ai-homelab) — the interactive system diagram.
- [How I Built a Local AI Stack for Less Than a Year of Claude Max](/blog/ai-cost-optimization/07-local-ai-stack-vs-year-of-claude-max) — the upfront hardware side of the cost story.

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
