---
title: "OpenClaw from Scratch: Installation, Configuration, and First Workflow"
description: "Building OpenClaw, a self-hosted coding agent loop on top of a local model — installation, configuration, and the first end-to-end workflow."
date: 2026-02-09
lastUpdated: "2026-07-12"
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

OpenClaw is the name I gave the coding agent I built on top of a local model — the same read-plan-edit-verify loop that tools like Claude Code popularized, running against a 35B model with enough capacity to own that whole loop itself, with a hosted model kept in reserve for whatever it flags as needing help. This walks through getting it installed and running your first real workflow.

*Part of the [Local Vibe Coding series](/categories/local-vibe-coding).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every local vibe coding deep-dive in this series."
destinationUrl: "/categories/local-vibe-coding"
---
::

## Why Build Rather Than Use an Existing Agent

There are open-source coding agent frameworks already. I built my own for a narrower reason: control over exactly how a task moves between the 3090-hosted coding agent, the Jetson-hosted retrieval and background layer, and a hosted escalation path, plus control over the permission model for destructive operations (file writes, shell commands) without depending on an upstream project's release cadence for security-sensitive changes.

## The Core Loop

OpenClaw's agent loop is deliberately simple — the sophistication is in the tool implementations, not the loop itself. It's the same read-plan-edit-test-review shape as any other agent loop, with a self-review pass before the diff ever reaches me:

```
1. Receive task from user
2. Classify: architecture-review checks whether the task is safe for a local coding agent to touch at all
3. If structural (an ORM swap, a data-model redesign): escalate to Claude Code, stop
4. Retrieve: pull relevant context for the task from Weaviate (repository-memory)
5. Send task + context to Ornith-1.0-35B on the 3090
6. Ornith-1.0-35B responds with either:
   a. A tool call (read_file, edit_file, run_command, search_codebase)
   b. A final diff, tagged pass or needs_help against its own review of the change
7. If tool call: execute it, return result, go to 6
8. If final diff tagged pass: present diff for human review, stop
9. If final diff tagged needs_help: escalate to Claude Code instead of retrying locally again
```

This is the same shape as most production agent loops — the loop terminates on a final answer, not on a fixed step count, and every tool call result feeds back into the next model call. Steps 2-3 and 6b are the two additions worth calling out. The architecture-review gate exists because I watched the coding agent burn a full local cycle on a task that was never a coding problem in the first place — "replace the ORM" isn't a diff, it's a decision, and the earlier version of this loop had no way to recognize that before the agent was three files into a migration it had no business making unilaterally. Step 6b's self-review is a separate thing: the model reviews its own diff against the task and the retrieved context before handing it back, rather than just returning whatever it first produces. That's viable specifically because Ornith-1.0-35B is large enough to hold the whole task — repository conventions, the diff, and a critique of that diff — in one context, which a smaller drafting-only model can't do reliably.

### From a Hardcoded Loop to a Router

The nine steps above describe the control flow, but the first version of OpenClaw baked that flow directly into one function, which made it awkward to change what "needs help" actually does without editing the loop itself. The version I run today separates the two: OpenClaw is a router, and each step in the loop is a skill — a self-contained folder under `.claude/skills/` with its own instructions, independently testable and independently swappable.

```
.claude/skills/
├── architecture-review/  # steps 2-3 above — gates structural changes before they reach coding-agent
├── repository-memory/    # step 4 above — embeddings generated on Jetson #1, indexed in Weaviate on the storage Pi
├── coding-agent/         # steps 5-8 above — Ornith-1.0-35B, 3090-hosted
├── code-review/
├── security-review/
├── test-runner/
├── deployment/
└── ask-claude-fix/       # step 9 — Claude Code escalation
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

`router.assign` looks at `task["type"]` and any complexity hint attached to it, then walks the same classify → retrieve → code → review/escalate path from the nine-step loop — the difference is that path is now data (which skill ran, what it returned) instead of inline branching. That's what makes `ask-claude-fix` a first-class skill rather than a special-cased exception at the bottom of the function: architecturally, escalating to Claude Code is no different from calling `code-review`, it's just another skill the router can reach — and `architecture-review` reaching the same conclusion before `coding-agent` ever runs is no different either. `code-review`, `security-review`, `test-runner`, and `deployment` exist as their own skills rather than being folded into `coding-agent` because each is a task category common enough to deserve its own prompt and routing rule — a security review isn't just "run the coding agent again with a different question."

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
  agent: "hf.co/deepreinforce-ai/Ornith-1.0-35B:Q4_K_M"     # the coding agent, 3090-hosted
  utility: "hf.co/deepreinforce-ai/Ornith-9B:Q4_K_M"        # background tasks, Jetson #3-hosted
  embed: "nomic-embed-text"                                  # embedding generation on Jetson #1, index on the storage Pi's Weaviate
  escalate: "claude-code"                                    # tasks the local agent can't resolve
  endpoint: "http://localhost:11434"

tools:
  allow_shell: true
  allow_write: true
  require_confirmation: ["run_command", "delete_file"]

router:
  hard_task_types: ["architecture_change", "security_review", "unfamiliar_codebase"]
  eval_log: "postgres://localhost/agent_tasks"
```

`require_confirmation` is the safety valve — any tool listed there pauses for explicit approval before executing. The agent's own self-review catches a bad diff before it's shown to me; it doesn't undo a destructive tool call that already ran, which is why the confirmation gate sits in front of every tool call, not just at the end of the loop.

`router.hard_task_types` is what `architecture-review` actually checks against: a task tagged as one of those goes straight to `ask-claude-fix` without burning a `coding-agent` cycle first, since I already know those categories need Claude's judgment more often than not. `router.eval_log` is where every skill invocation gets written — task, which skill ran, what the agent produced, and for anything that needed Claude, why. That table is what turns "the local agent got this wrong" from an annoyance into a dataset, and it's the input to the LoRA training pass covered later in this series.

## First Workflow

```bash
openclaw run "Add input validation to the signup form in src/forms/signup.py"
```

OpenClaw's `repository-memory` skill pulls `signup.py`, its imports, and the project's existing validation conventions from Weaviate. `coding-agent` takes that context and gets to work on Ornith-1.0-35B: read the validation utility module, propose an edit to `signup.py` adding calls to it, run the existing test file, and review its own diff against the task before returning it. If it comes back tagged `pass`, the diff is shown for review before anything is written to disk; if it comes back `needs_help`, it goes to `ask-claude-fix` instead.

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
