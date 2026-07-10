---
title: "Best Local Models for Coding"
description: "A practical, opinionated comparison of the locally-runnable models worth using for coding work in 2026 — quality, speed, and VRAM tradeoffs."
date: 2026-01-26
lastUpdated: "2026-07-09"
category: "local-vibe-coding"
tags:
  - local-vibe-coding
  - models
  - ollama
draft: true
slug: best-local-models-for-coding
author: Donavan Jones
---

# Best Local Models for Coding

There are dozens of locally-runnable models that claim to be good at code. Very few of them are good at code *you actually have to maintain* — as opposed to code that looks plausible on a leaderboard benchmark. This is a working comparison based on months of daily use across a real codebase, not a synthetic eval.

*Part of the [Local Vibe Coding series](/categories/local-vibe-coding).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every local vibe coding deep-dive in this series."
destinationUrl: "/categories/local-vibe-coding"
---
::

## What "Good for Coding" Actually Means Locally

Benchmark scores on HumanEval-style tests measure something narrower than what matters day-to-day: whether a model can follow the specific conventions of an existing codebase, whether it hallucinates APIs that don't exist, and whether it degrades gracefully or confidently produces broken code when it's out of its depth. Those properties don't show up cleanly in benchmark tables, so the ranking below is based on real usage.

## The Comparison

| Model | Size (usable local) | Strengths | Weaknesses |
|---|---|---|---|
| Ornith-9B | 9B | Fast enough for background tasks on Jetson-class hardware, still tool-calling reliable | Not capable enough to own a full agentic coding loop on its own |
| Ornith-1.0-35B | 35B | Reliable tool-calling, follows instructions literally, good quantization support, enough capacity to plan and self-review | Weaker on unusual language/framework combos |
| Qwen2.5-Coder | 32B | Strong on Python and TypeScript specifically, fast | Less reliable tool-calling out of the box |
| DeepSeek-Coder-V2 | 16B / 236B (MoE) | Excellent code completion quality at the 16B tier | The larger MoE variant is impractical on a single consumer GPU |
| CodeLlama | 34B | Mature, well-documented, wide tooling support | Noticeably behind newer releases on complex tasks |

## What I Actually Run

For the agent loop covered elsewhere in this series (OpenClaw), Ornith-1.0-35B on the 3090 is the daily driver — it owns the whole `coding-agent` skill: read, plan, edit, test, and review its own diff before anything reaches me. Ornith-9B runs separately on the Jetson tier as a utility model for background work (docs, commit summaries, log analysis) that doesn't touch the coding loop at all. Tool-calling reliability matters more for an agentic workflow than a few extra points of raw code quality, because a model that occasionally emits malformed function calls breaks the loop entirely — which is part of why the coding agent runs on the model with the most headroom rather than the fastest one. I ran a split-tier version of this earlier, with the 9B drafting and the 35B only reviewing; the 35B has enough capacity to do the whole job itself, and reserving it for review alone left most of that capacity unused.

For pure autocomplete-style single-file work — not agentic, just "finish this function" — Qwen2.5-Coder at 32B is faster and, on Python and TypeScript specifically, noticeably sharper.

## The Honest Ceiling

None of these close the gap to a frontier hosted model on genuinely hard problems: multi-file refactors that require holding a large mental model of the codebase, subtle concurrency bugs, or unfamiliar library APIs the model has limited training exposure to. That gap is real and worth being honest about — see ["Local AI vs Claude Code: Cost, Speed, and Privacy After 30 Days"](/blog/local-vibe-coding/local-ai-vs-claude-code-30-days) for where specifically that ceiling shows up in practice.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how model selection fits into the full local AI setup."
destinationUrl: "/systems/local-vibe-coding"
---
::

## Choosing for Your Hardware

If VRAM is the constraint (which it usually is), the practical rule is: pick the largest quantized model that fits with headroom for a reasonable context window, not the largest model that technically loads. A 34B model at a 32K context window that never runs out of memory mid-session beats a 70B model at an 8K context window that forces you to truncate history constantly.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The AI Starter Kit"
  supportingCopy: "Get the Self-Hosted AI Starter Kit — model setup, RAG architecture, and FastAPI examples ($29)."
  destinationUrl: "/products/self-hosted-ai-starter-kit"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: AI Coding Without Internet"
  supportingCopy: "See what fully offline coding actually requires."
  destinationUrl: "/blog/local-vibe-coding/ai-coding-without-internet"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get new local AI breakdowns delivered before they're public."
  ---
  :::
::

## Further Reading

::AuthoritativeLinks
---
title: "Authoritative Sources"
links:
  - label: "HumanEval Benchmark — GitHub (OpenAI)"
    url: "https://github.com/openai/human-eval"
    type: "external"
    description: "The original code-generation benchmark referenced across most local model leaderboards."
  - label: "Mixture of Experts — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Mixture_of_experts"
    type: "wikipedia"
    description: "Background on the MoE architecture used by larger models like DeepSeek-Coder-V2's 236B variant."
---
::

---

*[← Back to Local Vibe Coding](/categories/local-vibe-coding)*
