---
title: "Vibe Coding Locally: My Complete 2026 Setup with Jetson Orin and an RTX 3090"
description: "Why I stopped treating local AI as a toy and built a production coding assistant on my own Kubernetes cluster: Jetson Orin, RTX 3090, Ollama, repository embeddings, and a multi-model agent pipeline."
date: 2026-07-06
lastUpdated: "2026-07-09"
category: "local-vibe-coding"
tags:
  - local-vibe-coding
  - jetson-orin
  - rtx-3090
  - ollama
draft: false
slug: vibe-coding-locally-2026-setup
author: Donavan Jones
---

# Vibe Coding Locally: My Complete 2026 Setup with Jetson Orin and an RTX 3090

I wanted an AI coding assistant that understood my entire codebase, kept my source code private, and didn't cost hundreds of dollars every month. So I stopped treating local AI as a toy and built a production coding assistant that runs on my own Kubernetes cluster: three Jetson Orin Nano Supers running the always-on retrieval and background-agent layer, an RTX 3090 running the actual coding agent, Ollama serving the models, repository embeddings feeding retrieval, and a multi-model agent pipeline tying it all together.

"Vibe coding," where you lean on an AI agent for the bulk of the typing while you steer architecture and review output, is normally described as a cloud thing. Claude Code, Cursor, a browser tab open to a hosted model. My version runs on a rack in my office and a desktop under my desk, and after months of daily use it holds up for a real, meaningful slice of my day-to-day work.

This post is the foundation: the hardware, the models, the agent loop, and why I split inference across two very different classes of GPU instead of picking one.

*Part of the [Local Vibe Coding series](/categories/local-vibe-coding).*

## Follow the Build

This isn't a one-off setup tour. It's the first entry in a build log. Everything below is running today, but each piece deserves its own deep-dive, and that's where this series is headed:

1. **Why I'm building my own coding assistant.** This post covers the hardware, the stack, and the reasoning.
2. **Choosing the base model.** Why Ornith-1.0-35B is the coding agent, and where the Jetson-hosted Ornith-9B fits as a utility model.
3. **Repository indexing.** Teaching the assistant the shape of a codebase.
4. **Building embeddings.** The Weaviate retrieval layer that feeds every prompt.
5. **Tool calling and the skills layer.** How OpenClaw routes a task through the architecture-review, repository-memory, coding-agent, and review skills to read files, run commands, and edit code.
6. **Git integration.** From generated diff to reviewed commit on self-hosted Gitea.
7. **Agent memory.** What the assistant remembers between sessions.
8. **LoRA training.** Turning logged failed attempts into training data for a better coding agent, trained right on the 3090 that runs it.
9. **Benchmarks.** The local pipeline vs Claude Code, with real numbers.
10. **Open-sourcing it.** Turning the whole thing into a framework anyone can run.

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every local vibe coding deep-dive in this series."
destinationUrl: "/categories/local-vibe-coding"
---
::

## The Hardware Split

I run two distinct tiers, and the split is deliberate rather than accidental — though it took a revision to get the division of labor right. My first version had this backwards.

**A Jetson Orin Nano Super cluster (three nodes)** is the always-on infrastructure layer, not a coding brain. I say "a cluster" carefully here: each node runs its own independent services rather than one model split across the three, so this is a cluster in the always-on-fleet sense, not a distributed-inference one. Each node has a specific job:

- **Jetson #1 — Repository Memory Worker.** Parses git repos, chunks code, and generates embeddings. It does not host the vector database itself — Weaviate's memory footprint grows with collection size, and across VerseHub, Kingdom Tools, and everything else I want indexed, that's more RAM than a Jetson board is sized for. Jetson #1 does the compute-light, always-on ingestion work and writes into Weaviate; it doesn't hold the index.
- **Jetson #2 — Agent Workers.** Documentation generation, commit summaries, log analysis, test-report parsing, background security scans — the steady stream of small tasks that don't need a 35B model or a human in the loop.
- **Jetson #3 — Always-On AI Services.** Whisper, TTS, and smaller utility LLMs, including Ornith-9B, for API-facing and production AI features that don't need the 3090's throughput.

**A small x86 storage server** holds Weaviate, PostgreSQL, and MinIO. This isn't an inference node at all — no model runs on it — but it earns its own line in the hardware list rather than getting silently folded into "the Jetson tier," because that's exactly the kind of undersell that leads to putting a memory-hungry vector database on a board that can't hold it. Jetson #1 feeds it; the coding agent queries it; it does neither the drafting nor the deciding.

**RTX 3090 (24GB VRAM)** hosts Ornith-1.0-35B as the local coding agent — the model that owns the actual loop: read the relevant files, plan the change, edit, run tests, and review its own diff before I ever see it. My original design treated the 3090 as a verifier only, reviewing drafts written by the Jetson-hosted 9B. That undersold it. A verifier is reactive — "here's code, find problems with it" — but a coding agent needs repository understanding, planning, multi-file edits, tool use, and iterative fixes, and a 35B model on 24GB of VRAM has enough capacity to actually do that across a multi-step edit, not just critique one. Reserving that capacity for review alone was leaving most of it unused. Ornith-9B didn't go away — it moved to Jetson #3, where it's a utility model for background tasks, not the model doing the coding.

The division of labor now maps to *interactive vs. always-on* rather than *fast-and-small vs. big-and-slow*. The coding agent is the one thing that wants a human sitting in front of it waiting on a response, so it gets the GPU that isn't doing anything else. Everything else — indexing, embeddings, background workers, utility inference, and now the data layer itself — runs on hardware built to sit at low power 24/7 without competing with the interactive path.

## Software Stack

| Layer | Tool | Purpose |
|---|---|---|
| Model runtime | Ollama | Model serving, quantization management, API compatibility |
| Coding agent | Ornith-1.0-35B (quantized) | Reads, plans, edits, tests, and reviews its own diff, RTX 3090-hosted |
| Utility models | Ornith-9B (Q4_K_M, ~5.6GB) | Background tasks — docs, commit summaries, log analysis — on Jetson #3 |
| Escalation | Claude Code (External Principal Architect) | Architecture decisions, hard debugging, security review, and whatever the coding agent flags as needing help |
| Agent layer | OpenClaw (custom) | Router + skills: `architecture-review`, `repository-memory`, `coding-agent`, `code-review`, `security-review`, `test-runner`, `deployment`, `ask-claude-fix` |
| Orchestration | k3s | Scheduling every workload across the Jetson, desktop, and storage nodes |
| Ingress | Traefik | Routes requests to services across namespaces |
| Data layer | PostgreSQL, Redis, MinIO, Weaviate | Structured storage, `agent_tasks` eval log, caching, object storage, vector search — all on the dedicated storage server, not the Jetson fleet |
| Git + CI | Gitea + Actions runner | Self-hosted repo hosting and pipeline runs, no dependency on GitHub |
| Observability | Prometheus, Grafana, Loki + Promtail | Metrics, dashboards, and log aggregation across every pod |

Ollama is the layer that made this practical rather than theoretical. It handles model downloading, quantization format management, and exposes an OpenAI-compatible API, which meant the agent layer didn't need custom integration code per model.

The "k3s (on the Jetson nodes)" framing undersells it. This is a full cluster, not a scheduler bolted onto a couple of small boards. Metrics and logs flow into Prometheus and Loki regardless of which node a pod lands on, Traefik fronts everything so services don't need to remember node IPs, and Gitea gives the whole setup a private git remote and CI runner instead of pushing code to a third party. None of that is specific to AI workloads. It's the same platform layer I'd want under any self-hosted project, but it's what makes the coding agent feel like a normal part of the cluster instead of a special case bolted on the side.

## Why Not Just One GPU

The obvious question: why not put everything on the 3090 and skip the Jetson cluster entirely? Two reasons.

**Power.** The 3090 idles hot even at low load. Running background embedding jobs and small-model lookups 24/7 on it means a meaningfully higher power bill for work that doesn't need that much silicon. The Jetson nodes sip power by comparison and are built to be always-on.

**Contention.** When I'm mid-session with the coding agent on the 3090, I don't want a background indexing job on the same card stealing VRAM or scheduling priority. Splitting the workload across separate hardware means the interactive path — the one I'm actually sitting in front of — never waits on the batch path.

## What "Vibe Coding" Actually Looks Like Here

In practice, a session looks like: OpenClaw's `repository-memory` skill pulls context from Weaviate on the storage server (kept current by Jetson #1's ingestion jobs), Ornith-1.0-35B on the 3090 runs the actual loop — read the relevant files, plan the change, edit, run tests, review its own diff — and I review what it produces before it lands. If the agent flags its own diff as uncertain, or I already know up front that the task is the kind that needs an architecture call, it goes to Claude Code instead of grinding through local retries. It's the same shape as Claude Code's own agent loop (read, plan, edit, verify), just running on hardware I own, with a human review step in front of the commit either way.

## The Router and the Skills Layer

OpenClaw's job isn't running a model — it's deciding which skill handles a task and what happens next. Early versions had that decision hardcoded into one function; what runs today is a router in front of a set of named skills, each a self-contained folder with its own instructions rather than a branch buried in application code:

```
                      User Request
                            |
                            v
                    OpenClaw Router
                            |
                  architecture-review skill
                            |
                   +--------+--------+
                   |                 |
                simple            structural
                   |                 |
                   v                 v
        repository-memory skill   Claude Code
                   |
                   v
             Weaviate context
        (storage server, kept current
          by Jetson #1 ingestion)
                   |
                   v
                  coding-agent skill
                  RTX 3090 (Ornith-1.0-35B)
                            |
                    Read → Plan → Edit
                       → Test → Review
                            |
                            v
                     Human Review
                            |
                   +--------+--------+
                   |                 |
                 Good           Needs Help
                   |                 |
                   v                 v
                Commit      ask-claude-fix skill
                                     |
                                     v
                               Claude Code
```

`architecture-review` is the newest addition, and it sits in front of everything else on purpose. Its only job is deciding whether a task is safe to hand to `coding-agent` at all, before a single file gets touched. "Add a validation function" clears it immediately. "Replace Prisma with Drizzle across the app" doesn't — that's not a coding task, it's an architecture decision wearing a coding task's clothes, and the right answer is "don't start editing," not three files into a migration that a 35B model has no business deciding on its own. Adding this gate came out of watching the coding agent burn a full local cycle on exactly that kind of task before self-review caught that something was structurally wrong — by then the wasted cycle had already happened. Catching it before the loop starts is strictly better than catching it after.

`repository-memory` is the retrieval layer for everything that clears architecture-review — it queries Weaviate and assembles context before the coding agent ever sees the task, rather than that logic living inline in the agent itself. `coding-agent` is the loop above: the one skill that actually reads, plans, edits, tests, and reviews. Alongside it are narrower skills for work that deserves its own dedicated prompt and routing rule instead of being lumped into a generic request: `code-review`, `security-review`, `test-runner`, `deployment`. `ask-claude-fix` fires when the coding agent flags its own output as uncertain. Making all of this explicit skills instead of if-statements is what lets the routing logic get smarter over time without touching the model-calling code underneath it.

The router's job, concretely, is sizing the task before picking a path:

- **Simple** (a new endpoint, a small component, a test): `architecture-review` clears it → `repository-memory` → `coding-agent` → human review → commit.
- **Medium** (an auth flow, a multi-file refactor): the same path, but if the agent flags the diff as uncertain, it falls through to `ask-claude-fix` rather than looping on itself.
- **Structural** (swapping an ORM, redesigning the data model, anything that changes how the codebase is shaped rather than what it does): `architecture-review` flags it up front and it goes straight to Claude Code — `coding-agent` never sees it.

## The AI Engineering Loop Is the Point

The hardware split is a decent story. The bigger differentiator is what happens to the tasks the coding agent doesn't get right the first time. Every run through the router — which skill handled it, what the agent produced, whether it needed Claude, and if so why — gets logged to an `agent_tasks` table in Postgres:

```
        agent_tasks
             |
             v
   Failed Local Attempts
             |
             v
     Training Dataset
             |
             v
      RTX 3090 LoRA
             |
             v
   Better Coding Agent
```

The interesting field is `failure_reason`: a short note on what the agent got wrong before `ask-claude-fix` handed the task to Claude. Because the coding agent and the training run share the same 3090, there's no separate training rig to provision — weeks of logged failures become the LoRA dataset, and the fine-tuning happens on the same card that's going to run the improved model. That's the part most local-AI setups miss: running a model locally is table stakes, but a system that turns its own failures into next quarter's training data is a coding agent that gets better on its own schedule instead of only on whatever cadence the upstream model gets updated.

## The Full Picture

Zoomed out past the individual skills, the whole system is three pieces reporting to one router:

```
                         Human Developer
                                |
                                v
                         OpenClaw Router
                                |
              +-----------------+----------------+
              |                                  |
              v                                  v

      RTX 3090 Workstation                 Jetson Fleet + Storage
      Local Principal Developer            Always-On AI Layer

      Ornith-1.0-35B                       Repository Memory (ingestion)
      Coding Agent                         Weaviate / Postgres / MinIO
      LoRA Training                        Background Workers
                                            Utility Models (Ornith-9B)

              |
              v

          Claude Code
      External Principal Architect
```

None of the three pieces is the point on its own. A 3090 running a 35B model is just a workstation with a good GPU. A Jetson fleet running embeddings and background jobs is just a homelab. Claude Code by itself is just a subscription. What makes this a system instead of three separate tools is the router deciding which piece sees a task, the memory layer making sure whichever piece gets it has real context instead of a blank prompt, and the eval log turning every local miss into next quarter's training data. That's the actual product of this build — not the 3090, not the Jetsons, not Ornith by itself.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how this fits into the broader AI homelab it runs on."
destinationUrl: "/systems/local-vibe-coding"
---
::

## Where It Fails

I'm not going to tell you the local pipeline matches a frontier model, because it doesn't, and pretending otherwise would make everything else in this series less trustworthy.

Concretely: Claude Code has handled some refactors in a single pass that required multiple local iterations, and on a few of those, my local agent still flagged the result as uncertain and I escalated anyway. Multi-file changes that require holding a lot of the codebase in working memory are the most common failure mode; the agent loses the thread past a certain number of files in play, and its own self-review catches that it's uncertain more often than it catches a genuinely wrong diff outright. Subtle convention violations occasionally slip through too: code that's correct but doesn't look like the rest of the repo.

That's exactly why Claude Code isn't a fallback I'm embarrassed about — it's a distinct role with a distinct job. Think of it as two people, not one model backing up another: the RTX 3090 running Ornith-1.0-35B is the **local Principal Developer** — it owns CRUD, components, tests, docs, small refactors, migrations, and the day-to-day volume. Claude Code is the **external Principal Architect** — architecture decisions, debugging the genuinely confusing failures, large refactors, security review, anything in a part of the codebase the local agent hasn't seen enough of to have good instincts about. That's a different job description than "handles what the smaller model couldn't," and treating it that way changes what I route to it up front instead of only after a failed local attempt. I'm not replacing Claude here — I'm building a private engineering team where Claude is the outside expert I bring in for the hard calls. The failures the local agent does hit are still the most useful data I have; they're what's driving the LoRA training work above, and the benchmarks post will put honest numbers on where the line actually sits.

## What I'd Change

If I were starting today, I'd size the 3090 tier around a single well-chosen quantized model rather than experimenting with several. Model swapping costs real time in VRAM load and unload, and I underestimated that early on. I'd also set up power monitoring from day one instead of retrofitting it months in, since the actual cost-per-month question ("Local AI vs Claude Code: Cost, Speed, and Privacy After 30 Days") is impossible to answer honestly without real numbers.

## Where This Is Going

The endgame for this series isn't just documenting my assistant. It's turning it into an open-source framework anyone can run. The target experience I'm building toward:

```bash
git clone <the OpenClaw framework repo>
docker compose up
# index your repo, ask questions, generate code,
# review changes, commit, all on your own hardware
```

Every post in this series doubles as documentation for that framework: the model choices, the indexing pipeline, the tool-calling layer, the coding agent's read-plan-edit-test-review loop. By the time we reach Part 10, the build log becomes the manual.

Next up: Ollama configuration in depth, the case for Ornith-1.0-35B specifically as the local coding agent, and the from-scratch build of OpenClaw itself.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Vibe Coding Blueprint"
  supportingCopy: "Get the Local Vibe Coding Blueprint: hardware split guide, Kubernetes manifests, repo indexing scripts, and the coding agent's skill loop ($39)."
  destinationUrl: "/products/local-vibe-coding-blueprint"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Running Ornith-1.0-35B Locally with Ollama"
  supportingCopy: "Continue with the full Ollama setup guide."
  destinationUrl: "/blog/local-vibe-coding/running-ornith-locally-with-ollama"
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
  - label: "Ollama Official Site"
    url: "https://ollama.com"
    type: "external"
    description: "The model runtime used throughout this setup for local inference serving."
  - label: "NVIDIA Jetson Orin Developer Site"
    url: "https://developer.nvidia.com/embedded/jetson-orin"
    type: "external"
    description: "Official specs and documentation for the Jetson Orin platform used in the cluster tier."
  - label: "Quantization (deep learning) on Wikipedia"
    url: "https://en.wikipedia.org/wiki/Quantization_(signal_processing)"
    type: "wikipedia"
    description: "Background on the quantization techniques that make running large models on consumer GPUs feasible."
---
::

---

*[← Back to Local Vibe Coding](/categories/local-vibe-coding)*
