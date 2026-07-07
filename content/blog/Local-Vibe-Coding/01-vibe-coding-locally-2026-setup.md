---
title: "Vibe Coding Locally: My Complete 2026 Setup with Jetson Orin and an RTX 3090"
description: "Why I stopped treating local AI as a toy and built a production coding assistant on my own Kubernetes cluster: Jetson Orin, RTX 3090, Ollama, repository embeddings, and a multi-model agent pipeline."
date: 2026-07-06
lastUpdated: "2026-07-07"
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

I wanted an AI coding assistant that understood my entire codebase, kept my source code private, and didn't cost hundreds of dollars every month. So I stopped treating local AI as a toy and built a production coding assistant that runs on my own Kubernetes cluster: Jetson Orin boards drafting code, an RTX 3090 verifying it, Ollama serving the models, repository embeddings feeding retrieval, and a multi-model agent pipeline tying it all together.

"Vibe coding," where you lean on an AI agent for the bulk of the typing while you steer architecture and review output, is normally described as a cloud thing. Claude Code, Cursor, a browser tab open to a hosted model. My version runs on a rack in my office and a desktop under my desk, and after months of daily use it holds up for a real, meaningful slice of my day-to-day work.

This post is the foundation: the hardware, the models, the agent loop, and why I split inference across two very different classes of GPU instead of picking one.

*Part of the [Local Vibe Coding series](/categories/local-vibe-coding).*

## Follow the Build

This isn't a one-off setup tour. It's the first entry in a build log. Everything below is running today, but each piece deserves its own deep-dive, and that's where this series is headed:

1. **Why I'm building my own coding assistant.** This post covers the hardware, the stack, and the reasoning.
2. **Choosing the base model.** Why Ornith-9B drafts and Ornith-1.0-35B verifies.
3. **Repository indexing.** Teaching the assistant the shape of a codebase.
4. **Building embeddings.** The Weaviate retrieval layer that feeds every prompt.
5. **Tool calling.** How OpenClaw reads files, runs commands, and edits code.
6. **Git integration.** From generated diff to reviewed commit on self-hosted Gitea.
7. **Agent memory.** What the assistant remembers between sessions.
8. **LoRA training.** Fine-tuning on my own code and conventions.
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

I run two distinct inference tiers, and the split is deliberate rather than accidental:

**Jetson Orin Nano Super cluster** hosts Ornith-9B (Q4_K_M, ~5.6GB), the model that actually drafts code. Small enough to stay loaded on modest VRAM, fast enough that a first-pass draft doesn't feel like waiting. This tier also handles embedding generation and background agent tasks that don't need the 3090's throughput.

**RTX 3090 (24GB VRAM)** hosts Ornith-1.0-35B, which never writes a first draft. Its job is reviewing what the 9B just wrote: checking it against the task, the retrieved context, and the codebase's conventions, and either passing it through or sending it back for another pass. A verifier benefits from being the bigger, slower model in a way a drafter doesn't, since it only runs once per draft, not once per token.

The division of labor matters more than the raw specs. Drafting is bursty and wants to feel instant, so it runs on the tier that's always warmed up and doesn't compete with anything else. Verification is a single, heavier call per draft, so it's worth spending the 3090's extra capacity on it. Background tasks (indexing a repo, generating embeddings for search) share the Jetson tier with the drafter rather than the 3090.

## Software Stack

| Layer | Tool | Purpose |
|---|---|---|
| Model runtime | Ollama | Model serving, quantization management, API compatibility |
| Draft model | Ornith-9B (Q4_K_M, ~5.6GB) | First-pass code generation, on the Jetson tier |
| Verification model | Ornith-1.0-35B (quantized) | Reviews the draft against task, context, and conventions before it's shown to me |
| Escalation | Claude Code | Genuinely hard tasks the local draft/verify loop can't resolve |
| Agent layer | OpenClaw (custom) | Tool calling, file edits, command execution |
| Orchestration | k3s | Scheduling every workload across the Jetson and desktop nodes |
| Ingress | Traefik | Routes requests to services across namespaces |
| Data layer | PostgreSQL, Redis, MinIO, Weaviate | Structured storage, caching, object storage, vector search for retrieval |
| Git + CI | Gitea + Actions runner | Self-hosted repo hosting and pipeline runs, no dependency on GitHub |
| Observability | Prometheus, Grafana, Loki + Promtail | Metrics, dashboards, and log aggregation across every pod |

Ollama is the layer that made this practical rather than theoretical. It handles model downloading, quantization format management, and exposes an OpenAI-compatible API, which meant the agent layer didn't need custom integration code per model.

The "k3s (on the Jetson nodes)" framing undersells it. This is a full cluster, not a scheduler bolted onto a couple of small boards. Metrics and logs flow into Prometheus and Loki regardless of which node a pod lands on, Traefik fronts everything so services don't need to remember node IPs, and Gitea gives the whole setup a private git remote and CI runner instead of pushing code to a third party. None of that is specific to AI workloads. It's the same platform layer I'd want under any self-hosted project, but it's what makes the coding agent feel like a normal part of the cluster instead of a special case bolted on the side.

## Why Not Just One GPU

The obvious question: why not put everything on the 3090 and skip the Jetson cluster entirely? Two reasons.

**Power.** The 3090 idles hot even at low load. Running background embedding jobs and small-model lookups 24/7 on it means a meaningfully higher power bill for work that doesn't need that much silicon. The Jetson nodes sip power by comparison and are built to be always-on.

**Contention.** When I'm mid-session with the coding agent, I don't want a background indexing job stealing VRAM or scheduling priority. Splitting the workload across separate hardware means the interactive path never waits on the batch path.

## What "Vibe Coding" Actually Looks Like Here

In practice, a session looks like: OpenClaw reads the relevant files (via the Jetson-hosted embedding index for retrieval), Ornith-9B drafts a first pass on that same Jetson tier, Ornith-1.0-35B on the 3090 reviews the draft against the task and codebase conventions, and if it passes I review the diff before it lands. If the task is the kind that keeps failing verification, or I already know it's the kind that will, it goes to Claude Code instead of grinding through local retries. It's the same shape as Claude Code's agent loop (read, plan, edit, verify), just with an extra local verification pass in front of the human review, and every part of it running on hardware I own.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how this fits into the broader AI homelab it runs on."
destinationUrl: "/systems/local-vibe-coding"
---
::

## Where It Fails

I'm not going to tell you the local pipeline matches a frontier model, because it doesn't, and pretending otherwise would make everything else in this series less trustworthy.

Concretely: Claude Code has solved refactors in one prompt that my local assistant needed three verification retries to get right, and on a few of those, the third retry still failed and I escalated anyway. Multi-file changes that require holding a lot of the codebase in working memory are the most common failure mode; the 9B drafter loses the thread, and the 35B verifier correctly rejects the draft but can't fix it. Subtle convention violations occasionally slip through verification too: code that's correct but doesn't look like the rest of the repo.

That's exactly why Claude Code is a first-class part of the stack rather than a fallback I'm embarrassed about. The local pipeline earns its keep on the high-volume, well-scoped work, and the failures are the most useful data I have. Several of them are driving the LoRA training work later in this series, and the benchmarks post will put honest numbers on where the line actually sits.

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

Every post in this series doubles as documentation for that framework: the model choices, the indexing pipeline, the tool-calling layer, the verification loop. By the time we reach Part 10, the build log becomes the manual.

Next up: Ollama configuration in depth, the case for Ornith-1.0-35B specifically, and the from-scratch build of OpenClaw itself.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The AI Starter Kit"
  supportingCopy: "Get the Self-Hosted AI Starter Kit: Ollama setup, RAG architecture diagrams, and FastAPI examples ($29)."
  destinationUrl: "/products/self-hosted-ai-starter-kit"
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
