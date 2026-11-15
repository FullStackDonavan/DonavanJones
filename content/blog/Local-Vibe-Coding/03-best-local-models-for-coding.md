---
title: "Best Local Models for Coding"
description: "The best local models for coding in 2026: Ornith-1.0-35B, Qwen2.5-Coder, DeepSeek-Coder-V2 and CodeLlama compared on quality, speed, tool use and VRAM."
date: 2026-07-29
lastUpdated: "2026-11-14"
category: "local-vibe-coding"
tags:
  - local-vibe-coding
  - models
  - ollama
draft: false
slug: best-local-models-for-coding
author: Donavan Jones
excerptImage: /img/blog/local-vibe-coding/03-best-local-models-for-coding.jpg
---

# Best Local Models for Coding

For agentic coding on a single 24GB GPU, the best local model I've found is Ornith-1.0-35B: a mixture-of-experts model that fits in about 21GB at Q4_K_M and runs at roughly 64 tok/s on my RTX 3090. For single-file completion, Qwen2.5-Coder is the strongest alternative. There are dozens of locally-runnable models that claim to be good at code; very few are good at code *you actually have to maintain*, as opposed to code that looks plausible on a leaderboard. This is an opinionated comparison based on real use, not a synthetic eval.

*Part of the [Local Vibe Coding series](/categories/local-vibe-coding). See the [Local Vibe Coding hub](/systems/local-vibe-coding) for the full system.*

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
| Ornith-1.0-9B | 9B | Same family and output style as the 35B | On an 8GB Jetson it barely fit (≈5.3GB, 4K context) and ran ~3 tok/s end to end; I retired it |
| Ornith-1.0-35B | 35B MoE (~3B active) | Follows instructions literally, holds a strict JSON tool protocol, ~64 tok/s on one 3090, enough capacity to plan and self-review | No native `tools` capability in Ollama (tool calls go through JSON-in-content); weaker on unusual language/framework combos |
| Qwen2.5-Coder | 32B | Strong on Python and TypeScript specifically, fast | Less reliable tool-calling out of the box |
| DeepSeek-Coder-V2 | 16B / 236B (MoE) | Excellent code completion quality at the 16B tier | The larger MoE variant is impractical on a single consumer GPU |
| CodeLlama | 34B | Mature, well-documented, wide tooling support | Noticeably behind newer releases on complex tasks |

## What I Actually Run

For the agent loop covered elsewhere in this series (OpenClaw), Ornith-1.0-35B on the 3090 is the daily driver — it owns the whole `coding-agent` skill: read, plan, edit, test, and review its own diff before anything reaches me. Background utility work (summaries, quick classifications) runs on `llama3.2:3b`, pinned on a Jetson Orin Nano Super at about 21 tok/s, and never touches the coding loop. Tool-calling reliability matters more for an agentic workflow than a few extra points of raw code quality, because a model that occasionally emits malformed calls breaks the loop entirely — so the coding agent runs on the model with the most headroom. I ran a split-tier version of this earlier, with Ornith-1.0-9B drafting on a Jetson and the 35B only verifying. The 9B was too slow and too tight on 8GB to be worth it, and the 35B has enough capacity to do the whole job itself, so I retired the drafter.

For pure autocomplete-style single-file work — not agentic, just "finish this function" — Qwen2.5-Coder is the one most people reach for, and it's especially strong on Python and TypeScript. Its smaller sizes also run on a Jetson, which is why it sits on my small-model shelf there; if you want to know [what a tiny model can do with the right fine-tune](/blog/ai-engineering/25-tiny-tool-calling-model-34-to-98), that post goes deep.

## The Honest Ceiling

None of these close the gap to a frontier hosted model on genuinely hard problems: multi-file refactors that require holding a large mental model of the codebase, subtle concurrency bugs, or unfamiliar library APIs the model has limited training exposure to. That gap is real and worth being honest about — see ["Local AI vs Claude Code: Cost, Speed, and Privacy After 30 Days"](/blog/local-vibe-coding/10-local-ai-vs-claude-code-30-days) for where specifically that ceiling shows up in practice.

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
  destinationUrl: "/blog/local-vibe-coding/04-ai-coding-without-internet"
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

::JetsonLeaderboardCard
---
metric: code
blurb: "HumanEval-style pass rates for small coding models on a Jetson Orin Nano Super, tests run in a sandbox."
---
::

## Related reading

- [Jetson Orin Nano LLM leaderboard](/jetson-leaderboard) — measured speed, accuracy, tool calling and coding for every model I run on the Jetsons
- [Running Ornith-1.0-35B Locally with Ollama](/blog/local-vibe-coding/02-running-ornith-locally-with-ollama) — previous in the series: the setup for the model I recommend here.
- [AI Coding Without Internet](/blog/local-vibe-coding/04-ai-coding-without-internet) — next: what fully offline coding requires.
- [Local Vibe Coding hub](/systems/local-vibe-coding) — the whole system on one page.
- [Using Three Jetson Orin Nano Supers as an AI Cluster](/blog/ai-homelab-engineering/02-three-jetson-orin-nano-supers-as-ai-cluster) — what small models can and can't do on 8GB boards.

---

*[← Back to Local Vibe Coding](/categories/local-vibe-coding)*
