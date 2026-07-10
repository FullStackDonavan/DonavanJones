---
title: "OpenClaw from Scratch: Installation, Configuration, and First Workflow"
description: "Building OpenClaw, a self-hosted coding agent loop on top of a local model — installation, configuration, and the first end-to-end workflow."
date: 2026-02-09
lastUpdated: "2026-07-09"
category: "local-vibe-coding"
tags:
  - local-vibe-coding
  - openclaw
  - agents
draft: true
slug: openclaw-from-scratch
author: Donavan Jones
---

# OpenClaw from Scratch: Installation, Configuration, and First Workflow

OpenClaw is the name I gave the coding agent I built to sit on top of a local model pair — the same read-plan-edit-verify loop that tools like Claude Code popularized, but with drafting and verification split across two different local models instead of one, and a hosted model kept in reserve for whatever that pair can't resolve. This walks through getting it installed and running your first real workflow.

*Part of the [Local Vibe Coding series](/categories/local-vibe-coding).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every local vibe coding deep-dive in this series."
destinationUrl: "/categories/local-vibe-coding"
---
::

## Why Build Rather Than Use an Existing Agent

There are open-source coding agent frameworks already. I built my own for a narrower reason: control over exactly how a task moves between the fast Jetson-hosted draft model, the larger 3090-hosted verifier, and a hosted escalation path, plus control over the permission model for destructive operations (file writes, shell commands) without depending on an upstream project's release cadence for security-sensitive changes.

## The Core Loop

OpenClaw's agent loop is deliberately simple — the sophistication is in the tool implementations, not the loop itself. The addition over a single-model loop is a verification stage between "model produced a diff" and "human sees a diff":

```
1. Receive task from user
2. Draft: send task + relevant file context to Ornith-9B
3. Ornith-9B responds with either:
   a. A tool call (read_file, edit_file, run_command, search_codebase)
   b. A final diff
4. If tool call: execute it, return result to Ornith-9B, go to 3
5. If final diff: send it to Ornith-1.0-35B for verification against the task and codebase conventions
6. If verification passes: present diff for human review, stop
7. If verification fails: send Ornith-9B the diff plus the verifier's objection for one retry
8. If verification fails twice, or the task was flagged as hard up front: escalate to Claude Code instead of retrying locally again
```

This is the same shape as most production agent loops — the loop terminates on a final answer, not on a fixed step count, and every tool call result feeds back into the next model call. The verification stage is the one addition that isn't in a typical single-model ReAct loop, and it's the reason a 9B model drafting is viable at all — it doesn't need to be right the first time, it needs a second, more capable model checking its work before a human ever sees it.

### From a Hardcoded Loop to a Router

The eight steps above describe the control flow, but the first version of OpenClaw baked that flow directly into one function, which made it awkward to change what "verification failed twice" actually does without editing the loop itself. The version I run today separates the two: OpenClaw is a router, and each step in the loop is a skill — a self-contained folder under `.claude/skills/` with its own instructions, independently testable and independently swappable.

```
.claude/skills/
├── draft-code/          # step 2-4 above — Ornith-9B, Jetson-hosted
├── verify-code/         # step 5 — Ornith-1.0-35B, 3090-hosted
├── ask-claude-fix/       # step 8 — Claude Code escalation
├── repository-memory/    # retrieval context feeding both draft and verify
├── kubernetes-deployment/
├── security-review/
└── performance-review/
```

The router's only job is deciding which skill handles a task next, based on the task's declared complexity and whatever the previous skill reported back:

```python
task = {
    "type": "feature_request",
    "repo": "versehub",
    "priority": "medium",
}

router.assign(task)
```

`router.assign` looks at `task["type"]` and any complexity hint attached to it, then walks the same draft → verify → retry/escalate path from the eight-step loop — the difference is that path is now data (which skill ran, what it returned) instead of inline branching. That's what makes `ask-claude-fix` a first-class skill rather than a special-cased exception at the bottom of the function: architecturally, escalating to Claude Code is no different from calling `verify-code`, it's just another skill the router can reach.

## Installation

```bash
git clone https://github.com/donavanjones/openclaw
cd openclaw
pip install -r requirements.txt
cp config.example.yaml config.yaml
```

The config file is where model routing lives:

```yaml
models:
  draft: "hf.co/deepreinforce-ai/Ornith-9B:Q4_K_M"          # first-pass generation, Jetson-hosted
  verify: "hf.co/deepreinforce-ai/Ornith-1.0-35B:Q4_K_M"    # reviews the draft, 3090-hosted
  embed: "nomic-embed-text"                                  # retrieval embeddings
  escalate: "claude-code"                                    # tasks the local pair can't resolve
  endpoint: "http://localhost:11434"

tools:
  allow_shell: true
  allow_write: true
  require_confirmation: ["run_command", "delete_file"]
  max_verify_retries: 1

router:
  hard_task_types: ["architecture_change", "security_review", "unfamiliar_codebase"]
  eval_log: "postgres://localhost/agent_tasks"
```

`require_confirmation` is the safety valve — any tool listed there pauses for explicit approval before executing, which matters a lot more when the model actually calling tools is a fast 9B draft model than when it's a much more reliable frontier model. The verification pass catches a bad diff before it's shown to me; it doesn't undo a destructive tool call that already ran, which is why the confirmation gate sits in front of the draft model specifically, not after verification.

`router.hard_task_types` is the up-front skip: a task tagged as one of those goes straight to `ask-claude-fix` without burning a `draft-code`/`verify-code` cycle first, since I already know those categories fail local verification often enough that the retry isn't worth the wait. `router.eval_log` is where every skill invocation gets written — task, which skill ran, the draft, the verifier's score, and for failures, why. That table is what turns "the local pair got this wrong" from an annoyance into a dataset, and it's the input to the LoRA training pass covered later in this series.

## First Workflow

```bash
openclaw run "Add input validation to the signup form in src/forms/signup.py"
```

OpenClaw reads `signup.py` and its imports, sends the task and file contents to Ornith-9B, and gets back a sequence of tool calls: read the validation utility module, propose an edit to `signup.py` adding calls to it, then a final diff. That diff goes to Ornith-1.0-35B for review against the same file context; if it passes, the diff is shown for review before anything is written to disk.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how OpenClaw fits into the broader local AI homelab."
destinationUrl: "/systems/local-vibe-coding"
---
::

## What Took the Longest to Get Right

Not the model integration — the permission and confirmation model. An agent that asks for confirmation on every single tool call is unusable; one that never asks is dangerous. Getting the `require_confirmation` list tuned to genuinely risky operations (shell commands, deletions) while leaving read operations and simple edits automatic took several iterations of watching where it actually mattered versus where it was just friction.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The AI Starter Kit"
  supportingCopy: "Get the Self-Hosted AI Starter Kit — agent architecture patterns and FastAPI examples ($29)."
  destinationUrl: "/products/self-hosted-ai-starter-kit"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Building Your First AI Coding Agent"
  supportingCopy: "The general pattern behind OpenClaw's design."
  destinationUrl: "/blog/local-vibe-coding/first-offline-ai-coding-agent"
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
  - label: "ReAct: Synergizing Reasoning and Acting in Language Models"
    url: "https://doi.org/10.48550/arXiv.2210.03629"
    type: "doi"
    description: "The reasoning-and-acting pattern underlying most agent loops, including OpenClaw's."
  - label: "Principle of Least Privilege — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Principle_of_least_privilege"
    type: "wikipedia"
    description: "The security principle behind the confirmation-gated tool permission model."
---
::

---

*[← Back to Local Vibe Coding](/categories/local-vibe-coding)*
