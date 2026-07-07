---
title: "Local Vibe Coding"
slug: "local-vibe-coding"
tagline: "Build a local AI development environment — offline coding agents, local models, and real cost/speed/privacy tradeoffs"
description:
  - "Local vibe coding is the practice of running your AI coding assistant — the model, the agent loop, the tool-calling — entirely on hardware you own, instead of routing every keystroke through a hosted API. It trades a monthly subscription for a one-time hardware cost, cloud latency for LAN latency, and someone else's data policy for your own."
  - "This series documents a real local development environment built around a Jetson Orin cluster and an RTX 3090: model selection, Ollama setup, a custom offline coding agent, and the honest cost/speed/privacy comparison against Claude Code after 30 days of daily use."
  - "None of this is anti-cloud dogma. It's a practical account of when local wins, when it doesn't, and exactly what it takes to get a local coding agent to a usable state."
featuredArticles:
  - path: "/blog/local-vibe-coding/vibe-coding-locally-2026-setup"
    label: "Start Here"
    reason: "The full hardware and software setup this series is built on"
  - path: "/blog/local-vibe-coding/local-ai-vs-claude-code-30-days"
    label: "Core Comparison"
    reason: "The honest cost, speed, and privacy numbers after real daily use"
  - path: "/blog/local-vibe-coding/when-to-buy-a-gpu-vs-api-fees"
    label: "Decision Framework"
    reason: "The math for when local hardware actually pays for itself"
learningPath:
  - phase: "Setup"
    description: "Getting a local model and agent loop running at all — hardware, Ollama, and the models worth using for code."
    articles:
      - "Vibe Coding Locally: My Complete 2026 Setup with Jetson Orin and an RTX 3090"
      - "Running Ornith-1.0-35B Locally with Ollama: A Complete Guide"
      - "Best Local Models for Coding"
      - "AI Coding Without Internet"
  - phase: "Building the Agent"
    description: "Turning a local model into something that can actually act on a codebase — tool calling, workflows, and your own coding assistant."
    articles:
      - "OpenClaw from Scratch: Installation, Configuration, and First Workflow"
      - "Building Your First AI Coding Agent That Runs Completely Offline"
      - "Connecting Ornith to Your Own Codebase"
      - "Building Your Own Coding Assistant"
  - phase: "The Honest Comparison"
    description: "Where local wins, where it loses, and the decision framework for choosing between local and cloud."
    articles:
      - "Why I Stopped Paying for Claude: Building a Local AI Development Environment"
      - "Local AI vs Claude Code: Cost, Speed, and Privacy After 30 Days"
      - "Ornith-1.0-35B vs Claude Code"
      - "OpenClaw vs Cloud IDEs"
      - "When Should You Buy a GPU Instead of Paying API Fees?"
faqs:
  - question: "Can you actually replace Claude Code with a local model?"
    answer: "For a meaningful slice of day-to-day work, yes — autocomplete-adjacent edits, boilerplate, refactors with a clear pattern, and anything where you're the one holding the architecture in your head. For the hardest reasoning tasks — subtle bugs, unfamiliar codebases, multi-step planning — a frontier hosted model is still meaningfully better. The realistic outcome is a hybrid workflow, not a full replacement."
  - question: "What hardware do you need to run a local coding model well?"
    answer: "A single consumer GPU with 24GB of VRAM (like an RTX 3090) is enough to run a strong 30-70B-class quantized coding model at usable speed. Smaller models run fine on far less — even a Jetson Orin Nano handles 7-8B models comfortably. The GPU is the bottleneck; everything else (CPU, RAM) just needs to keep up with it."
  - question: "Is local AI coding actually cheaper than a subscription?"
    answer: "Over 12-18 months, usually yes, if you're already a heavy user of a paid coding assistant. The hardware is a sunk cost that keeps paying dividends after the break-even point, and there's no per-token or per-seat pricing. It's not cheaper for someone who codes with AI occasionally — the math only works out for people running these tools daily."
  - question: "What's the biggest downside of local AI coding?"
    answer: "Model quality ceiling. Even the best locally-runnable models lag behind frontier hosted models on genuinely hard reasoning tasks. The other real cost is your own time — you are now the ops team for your inference stack, which is a tradeoff, not a free lunch."
---

Local vibe coding is the practice of running your AI coding assistant entirely on hardware you own — the model, the agent loop, the tool-calling that lets it read and edit your codebase — instead of routing every request through a hosted API. It's a direct response to a real tension: AI coding assistants have gotten good enough to use constantly, and "constantly" is exactly when a per-token or per-seat subscription starts to hurt.

This series documents a real setup built around a small Jetson Orin cluster and a single RTX 3090, the models that turned out to be worth running, and the custom offline coding agent built on top of them. It also documents the honest failure modes — the tasks where a local model just isn't there yet, and the operational overhead nobody mentions in the "ditch your subscription" posts.

## What This Series Covers

**Setup and Models** — Getting from bare metal to a working local coding model: hardware choices, Ollama configuration, and which locally-runnable models are actually worth using for code versus which ones look good on a benchmark and fall apart on a real repository.

**Building the Agent** — A model that can chat isn't a coding assistant. Getting to something that reads files, runs commands, and makes multi-step edits requires an agent loop, tool-calling, and a workflow — covered here through a from-scratch build of a local coding agent (OpenClaw) and the patterns behind it.

**The Honest Comparison** — Direct, unhedged comparisons against Claude Code on cost, speed, and privacy after real daily use, plus the decision framework for when buying a GPU actually beats paying API fees and when it doesn't.

The goal of this series isn't to convince anyone to abandon hosted AI tools. It's to document, with real numbers, what local AI coding is actually capable of in 2026 — so the decision to go local (fully, partially, or not at all) is based on data instead of ideology.
