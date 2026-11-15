---
title: "GPU Allocation"
description: "GPU allocation on real AI hardware: one model per Jetson, sharing an RTX 3090, VRAM budgeting, unified-memory gotchas, batching, warm-up, and monitoring."
date: 2026-03-30
lastUpdated: "2026-11-14"
category: "backend-engineering"
tags:
  - gpu
  - ai
draft: false
slug: gpu-allocation
author: Donavan Jones
excerptImage: /img/blog/backendengineering/13-gpu-allocation.jpg
---

# GPU Allocation

GPU allocation is deciding which model or service gets which GPU memory, and when, so latency-sensitive work is never starved and no device runs out of VRAM. On memory-constrained hardware the rule that matters most is simple: budget memory first, then batch to keep the GPU busy.

With a managed API, GPU allocation is the provider's problem. On my setup it is mine: VerseHub and my other services run on one RTX 3090 (24 GB) workstation and three Jetson Orin Nano Super 8GB boards in my K3s cluster, with hosted APIs used for some work. This article covers how I divide that hardware, why GPU allocation is a distinct engineering problem from CPU allocation, and the strategies that keep utilization high without running out of memory.

*Part of the [Backend Engineering series](/categories/backend-engineering). For how these pieces fit together, see the [backend systems overview](/systems/backend). The hardware itself is covered in the [AI homelab hub](/systems/ai-homelab).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every backend engineering breakdown in this series."
destinationUrl: "/categories/backend-engineering"
---
::

## Why GPU Allocation Is Different

A CPU handles one task at a time per core. Modern CPUs have 8–128 cores, each handling a different thread. CPU allocation is well-understood: give each container a CPU share, the OS scheduler handles contention, and horizontal scaling adds more cores.

GPUs work differently. A modern GPU has thousands of CUDA cores grouped into streaming multiprocessors — but they execute the same operation in parallel across large batches of data (SIMD). A GPU is not fast at one thing at a time; it is fast at many instances of the same operation at once. For a small model, a batch of 64 embedding computations can take not much longer than a batch of 1, because the hardware processes them in parallel. This is the fundamental reason batching matters for GPU workloads in a way it does not for CPU workloads.

Allocation decisions for GPUs therefore cannot treat GPU time the same as CPU time. The right question is not "how much of the GPU does this task consume?" but "how do I structure work so the GPU is doing useful computation rather than waiting?"

## The GPU Workloads

On my hardware, GPU-resident workloads fall into a few categories:

**Embedding model** — all-MiniLM-L6-v2 in a Docker container on the RTX 3090. It is the only embedder VerseHub uses, so it is in the request path for every search.

**Fast-draft LLM** — llama3.2:3b in Ollama on one Jetson, pinned in memory permanently so it never cold-starts. It produces VerseHub's first-pass answers at about 21 tok/s.

**Speech** — Kokoro-82M TTS and whisper.cpp STT on a second Jetson, with no LLM on that board.

**Image generation and model experiments** — a Stable Diffusion service and a shelf of small Ollama models on the third Jetson, one large model or service at a time.

**Large models and training** — Ornith-1.0-35B (about 21 GB of VRAM) and LoRA training on the 3090, which is why the 3090's schedule is the one I watch most closely.

Classical image work like OCR preprocessing (deskewing, denoising) usually does not need a GPU at all, and Tesseract runs on CPU — those stay on CPU workers.

## Dedicated vs Shared GPU Instances

The first allocation decision is whether a workload gets a dedicated GPU instance or shares one.

**Dedicated** means the GPU is allocated exclusively to one workload. No other process competes for VRAM or compute. The upside is predictable latency and zero interference. The downside is cost — a dedicated GPU instance is expensive when the workload is bursty and utilization is low.

**Shared** means multiple workloads run on the same GPU. On datacenter cards (A100, H100, A30), NVIDIA's MIG (Multi-Instance GPU) partitions one GPU into isolated slices with guaranteed memory and compute. Consumer GPUs and Jetsons do not have MIG, so sharing means co-locating processes and budgeting memory yourself.

My allocation is mostly "one role per device":

| Device | Role | Why |
|---|---|---|
| Jetson Orin Nano Super #1 | Image generation + small-model shelf | One big model or service at a time |
| Jetson Orin Nano Super #2 | Speech (Kokoro TTS + Whisper STT) | Both small; measured 0.85 s TTS→STT round trip |
| Jetson Orin Nano Super #3 | llama3.2:3b, pinned | Latency-sensitive drafts, never unloaded |
| RTX 3090 (24 GB) | Embedder, Ornith-35B, LoRA training | Shared; large jobs scheduled around each other |

Dedicating a whole 8 GB board to one role sounds wasteful until you try to fit two models on it. More on that below, and in [Running Multiple Local Models Without Melting Your GPU](/blog/ai-homelab-engineering/09-running-multiple-local-models-without-melting-gpu).

## VRAM as the Primary Constraint

For neural network workloads, VRAM (GPU memory) is usually the binding constraint before compute. A model must fit entirely in VRAM to run efficiently — if it does not, parts of the model are offloaded to system RAM, and every access to offloaded layers incurs a PCIe transfer that destroys throughput.

VRAM planning before deploying a model:

| Model | Parameters | Precision | VRAM Required |
|---|---|---|---|
| sentence-transformers/all-MiniLM-L6-v2 | 22M | FP16 | ~0.5 GB |
| cross-encoder/ms-marco-MiniLM-L-6-v2 | 22M | FP16 | ~0.5 GB |
| Ornith-1.0-9B (measured on a Jetson) | 9B | Quantized GGUF | ~5.3 GB, 4K context max |
| Ornith-1.0-35B (measured on the 3090) | 35B MoE | Q4_K_M GGUF | ~21.2 GB |
| Activation memory (batched inference) | — | — | 2–4× model size |

Activation memory — the intermediate tensors generated during a forward pass — scales with batch size and sequence length. A model that occupies 1 GB of VRAM in weights might require 4–6 GB total during inference on a large batch. VRAM allocation must account for peak activation memory, not just model weights.

The rule I follow: budget at least 2× the model's weight size as headroom for activations and KV cache, then test at the largest expected batch size and context length before deploying to confirm it fits.

**Unified memory has its own trap.** A Jetson's 8 GB is shared between CPU and GPU, with about 7.4 GiB usable. The CUDA allocator there cannot reclaim the Linux page cache, so a model can fail to load with out-of-memory even when `free -h` says plenty is "available." My fix before every model swap: stop the old model, then `sync; echo 3 > /proc/sys/vm/drop_caches`, then load. In practice only one ~4–5 GB model fits per board — Ornith-9B at 5.3 GB barely fit, crawled at about 3 tok/s end to end, and I retired it.

## Dynamic Batching for GPU Workloads

As covered in the embedding service article, batching is essential for GPU efficiency. A GPU that processes requests one at a time wastes most of its parallel capacity — the hardware is built to operate on many inputs simultaneously.

For the local embedding model and reranker, I use a dynamic batching server in front of the model. Incoming requests are accumulated in a buffer and dispatched to the model as a batch when either the buffer is full or a timeout fires. This is the same adaptive batcher pattern from the embedding service, but with GPU-specific tuning:

```
Buffer timeout:   20ms    (latency budget)
Max batch size:   32      (VRAM and latency tradeoff)
Min batch size:   1       (do not hold a request waiting when load is low)
```

Treat the max batch size as something to measure, not guess. Raise it until activation memory approaches your VRAM budget or latency starts climbing non-linearly, then back off. The right number depends on the model, the sequence lengths, and how much memory the device has left after everything else on it.

GPU utilization during a batch is near 100%. GPU utilization between batches is near 0%. The batcher's job is to minimize the gap between batches — to keep the GPU busy rather than idle.

## Model Warm-Up and Cold Start

Loading a model from disk into GPU VRAM takes time — seconds, depending on model size and storage speed. On my Jetson, llama3.2:3b takes about 5.1 s to load from NVMe. A cold-start penalty like that on the first request after a deployment or restart is unacceptable for a latency-sensitive service, which is why that model is pinned in memory permanently.

For services that do restart, I use explicit warm-up:

```typescript
async function startModelServer(modelPath: string) {
  await loadModelIntoVRAM(modelPath);

  // Warm-up: run a batch of dummy inputs through the model
  // This ensures all CUDA kernels are compiled and cached
  const dummyInputs = Array(16).fill("warm up input text");
  await runInference(dummyInputs);

  logger.info("Model warm-up complete, ready to serve");
  await markServiceReady(); // only now does the load balancer start routing traffic
}
```

The warm-up pass does two things. First, it loads model weights into VRAM and confirms the model is runnable before marking the service ready. Second, it triggers CUDA kernel compilation — on the first run of a new operation shape, CUDA compiles an optimized kernel for that specific input shape and caches it. Subsequent runs with the same shape use the cached kernel and are significantly faster. Running warm-up with representative input sizes ensures the critical path is not compiled on the first real user request.

The service only registers with the load balancer after warm-up completes. This prevents any user request from hitting a cold model.

## Preemption and Priority

When a GPU is shared (via MIG on datacenter cards, or via a scheduling layer on everything else), competing workloads need priority rules. Not all GPU work is equally urgent:

- A reranker call in the request path, blocking a user's search result: **high priority**
- A historical OCR batch job running in the background: **low priority**
- A reindexing run during off-peak hours: **lowest priority**

I implement priority at the queue level, not the GPU level. High-priority workloads are served from a separate queue that is always drained before lower-priority queues. The GPU does not need to understand priority — the batching server decides which requests to batch together based on queue order.

True GPU preemption (interrupting a running kernel to process a higher-priority request) is not implemented. The latency of most GPU operations on these model sizes is under 50ms — short enough that a high-priority request waits at most one batch cycle before being served. For workloads with much longer kernel execution times (large models, large batches), preemption would matter more.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how this fits into the production backend system it was built for."
destinationUrl: "/systems/backend"
---
::

---

*Explore more articles in the [Backend Engineering series](/categories/backend-engineering).*

---

## Monitoring GPU Utilization

GPU utilization is reported differently from CPU utilization, and the difference matters for interpretation. On my cluster, the Jetsons expose GPU load through a small custom agent `/metrics` endpoint that [Prometheus](/blog/infrastructureengineering/41-prometheus-on-pi-cluster) scrapes, and model load/unload/benchmark controls live on the Devices page of [Kingdom Tools](/projects/kingdom-tools), my internal platform.

**SM utilization** — the fraction of streaming multiprocessors active at a given moment. High SM utilization during inference, near zero between batches. A time-averaged SM utilization of 40–60% is reasonable for a bursty workload; sustained >90% suggests the GPU is a bottleneck.

**VRAM utilization** — how much GPU memory is in use. This should be stable at roughly (model size + activation headroom). Unexpectedly growing VRAM usage indicates a memory leak — typically tensors not being freed after inference.

**Batch size distribution** — what fraction of batches hit the max batch size versus being timer-flushed early. A high fraction of timer-flushed batches means load is low relative to capacity; a high fraction of max-size batches means the GPU is saturated.

**Time-to-first-response** — the end-to-end latency from request arrival to first inference result. This is the user-visible metric that all GPU optimization is ultimately in service of.

```sql
-- Query from the metrics table (logged by the GPU service)
SELECT
  percentile_cont(0.50) WITHIN GROUP (ORDER BY latency_ms) AS p50,
  percentile_cont(0.95) WITHIN GROUP (ORDER BY latency_ms) AS p95,
  percentile_cont(0.99) WITHIN GROUP (ORDER BY latency_ms) AS p99,
  AVG(batch_size)                                           AS avg_batch_size,
  AVG(gpu_sm_utilization)                                   AS avg_sm_util
FROM gpu_inference_metrics
WHERE created_at > now() - interval '1 hour'
GROUP BY model_name;
```

A p95 latency that is much higher than p50 indicates occasional large batches or VRAM pressure causing slowdowns on some requests. A low average batch size combined with high latency indicates the batcher timeout is too aggressive — requests are being dispatched before the batch fills, wasting throughput.

::CtaContactWork
---
buttonText: "Let's Talk About Your GPU Infrastructure"
supportingCopy: "Allocating GPU resources or tuning batching for your own AI workloads? Let's talk through the architecture."
destinationUrl: "/hire-me"
---
::

## Cost vs Performance Tradeoffs

GPU capacity costs more than CPU capacity, whether you rent it by the hour or buy it and share a few boards across every workload. Every GPU allocation decision has a cost dimension.

The question I ask before allocating GPU for a workload: **what is the latency cost of running on CPU instead?**

For anything in the request path — the embedder that every search waits on, the draft model a user is watching stream — a GPU-vs-CPU gap of hundreds of milliseconds is noticeable, so GPU is justified.

For background work like OCR, the user is not waiting. The latency difference is real but the user experience impact is low, so whether GPU is justified depends on throughput: if the CPU workers keep up, leave it on CPU and keep the GPU free for interactive work.

This cost-versus-latency analysis is the right framework for GPU allocation decisions. The answer is not always GPU, and it is not always the biggest GPU available. It is the smallest allocation that meets the latency and throughput requirements for the workload, at the point in the scaling curve where the workload actually is today.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The API Boilerplate"
  supportingCopy: "Get the Production AI API Boilerplate — FastAPI starter, auth, vector search, embedding services, Docker, and CI/CD examples ($49)."
  destinationUrl: "/products/production-ai-api-boilerplate"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Batching"
  supportingCopy: "Continue with \"Batching\" for a deeper look at the throughput technique that makes GPU allocation decisions like these pay off."
  destinationUrl: "/blog/backendengineering/14-batching"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get new backend engineering breakdowns delivered before they're public."
  ---
  :::
::

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "Graphics Processing Unit — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Graphics_processing_unit"
    type: "wikipedia"
    description: "According to this overview, GPUs provide massively parallel compute — the hardware characteristic that makes them orders of magnitude faster than CPUs for neural network inference workloads."
  - label: "CUDA — Wikipedia"
    url: "https://en.wikipedia.org/wiki/CUDA"
    type: "wikipedia"
    description: "Overview of CUDA — NVIDIA's parallel computing platform and the runtime environment for GPU inference, kernel compilation, and VRAM management described in this article."
  - label: "Multi-Instance GPU — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Multi-instance_GPU"
    type: "wikipedia"
    description: "According to this overview, MIG partitions a GPU into isolated slices with dedicated VRAM and compute — the technique used to share a single A10G GPU across multiple small local models."
  - label: "Video RAM — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Video_RAM_(dual-ported_DRAM)"
    type: "wikipedia"
    description: "Background on GPU memory — understanding VRAM constraints and activation memory overhead is central to the MIG slice sizing decisions described in this article."
---
::

::JetsonLeaderboardCard
---
metric: all
---
::

## Related reading

- [Jetson Orin Nano LLM leaderboard](/jetson-leaderboard) — measured speed, accuracy, tool calling and coding for every model I run on the Jetsons
- [Async Workers](/blog/backendengineering/12-async-workers) — previous in the series
- [Batching](/blog/backendengineering/14-batching) — next in the series: keeping the GPU busy
- [Using Three Jetson Orin Nano Supers as an AI Cluster](/blog/ai-homelab-engineering/02-three-jetson-orin-nano-supers-as-ai-cluster) — the hardware these allocations run on
- [RTX 3090 + Jetson Orin: A Hybrid AI Architecture](/blog/ai-homelab-engineering/03-rtx-3090-jetson-orin-hybrid-architecture) — why the big GPU and the edge boards split the work
- [Backend systems overview](/systems/backend) — the hub for this series

---

*[← Back to Backend Engineering series](/categories/backend-engineering)*
