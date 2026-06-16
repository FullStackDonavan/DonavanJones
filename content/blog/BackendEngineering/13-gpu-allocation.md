---
title: "GPU Allocation"
description: "Strategies for GPU allocation in AI backend systems."
date: 2026-03-30
lastUpdated: "2026-06-09"
category: "backend-engineering"
tags:
  - gpu
  - ai
draft: false
slug: gpu-allocation
author: Donavan Jones
---

# GPU Allocation

Most of this platform's AI workloads run against managed APIs — Anthropic for inference, OpenAI for embeddings. In that model, GPU allocation is the provider's problem. You send a request, they route it to hardware, you pay per token. Simple.

But managed APIs are not the right answer for everything. Some workloads benefit from running closer to the application: the OCR preprocessing pipeline, local embedding models for latency-sensitive retrieval, the Tesseract fine-tuned model for historical documents, image processing for uploaded scans. These workloads need compute — and for some of them, GPU compute specifically.

This article covers how GPU resources are allocated and managed for the workloads that run locally, why GPU allocation is a distinct engineering problem from CPU allocation, and the strategies I use to keep utilization high without over-provisioning.

*Part of the [Backend Engineering series](/categories/backend-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every backend engineering breakdown in this series."
destinationUrl: "/categories/backend-engineering"
---
::

## Why GPU Allocation Is Different

A CPU handles one task at a time per core. Modern CPUs have 8–128 cores, each handling a different thread. CPU allocation is well-understood: give each container a CPU share, the OS scheduler handles contention, and horizontal scaling adds more cores.

GPUs work differently. A modern GPU (NVIDIA A10G, L4, etc.) has thousands of streaming multiprocessors — but they execute the same operation in parallel across large batches of data (SIMD). A GPU is not fast at one thing at a time; it is fast at many instances of the same operation at once. A batch of 64 embedding computations takes roughly the same time as a batch of 1 on a GPU, because the hardware processes all 64 in parallel. This is the fundamental reason batching matters for GPU workloads in a way it does not for CPU workloads.

Allocation decisions for GPUs therefore cannot treat GPU time the same as CPU time. The right question is not "how much of the GPU does this task consume?" but "how do I structure work so the GPU is doing useful computation rather than waiting?"

## The GPU Workloads

On this platform, GPU-resident workloads fall into three categories:

**Local embedding model** — a self-hosted `sentence-transformers` model running on GPU for latency-sensitive embedding operations. Currently this is a backup path used when the managed API is rate-limited or unavailable; the primary path is the managed OpenAI API. When the local model is active, it runs on a dedicated GPU instance.

**OCR preprocessing** — the deskewing, denoising, and layout analysis steps in the OCR pipeline use GPU-accelerated image processing via CUDA-backed OpenCV. These are not neural network workloads — they are classical image operations that benefit from GPU parallelism but do not require the full VRAM of a modern AI accelerator. They run on a GPU-enabled CPU instance (one with a modest GPU like an NVIDIA T4) rather than a dedicated AI accelerator.

**Historical OCR model** — the fine-tuned Tesseract model for historical religious documents runs inference on GPU when available. This is a batch workload: individual OCR jobs are queued and processed in batches to amortize GPU initialization overhead.

**Local reranker** — the cross-encoder reranker used in the two-stage retrieval pipeline (covered in the vector search article) runs as a local model. Reranking is latency-sensitive in the request path, and GPU inference is significantly faster than CPU for the input sizes involved (20 candidate passages, each a few hundred tokens).

## Dedicated vs Shared GPU Instances

The first allocation decision is whether a workload gets a dedicated GPU instance or shares one.

**Dedicated** means the GPU is allocated exclusively to one workload. No other process competes for VRAM or compute. The upside is predictable latency and zero interference. The downside is cost — a dedicated GPU instance is expensive when the workload is bursty and utilization is low.

**Shared** means multiple workloads run on the same GPU. NVIDIA's MIG (Multi-Instance GPU) technology allows partitioning a GPU into isolated slices, each with guaranteed VRAM and compute. A single A10G can be partitioned into seven 1g.6gb instances, each running a separate workload with no cross-contamination.

My allocation:

| Workload | Allocation | Reason |
|---|---|---|
| Local embedding model | Dedicated (1× A10G) | Latency-sensitive, primary fallback path |
| Reranker | MIG slice (1g.6gb) | Small model, low VRAM, latency-sensitive |
| Historical OCR | MIG slice (2g.12gb) | Medium model, batch workload |
| Image preprocessing | GPU-enabled CPU instance | Classical ops, no VRAM requirements |

The reranker and historical OCR model share the same A10G using MIG, reducing the cost of running both versus two dedicated instances.

## VRAM as the Primary Constraint

For neural network workloads, VRAM (GPU memory) is usually the binding constraint before compute. A model must fit entirely in VRAM to run efficiently — if it does not, parts of the model are offloaded to system RAM, and every access to offloaded layers incurs a PCIe transfer that destroys throughput.

VRAM planning before deploying a model:

| Model | Parameters | Precision | VRAM Required |
|---|---|---|---|
| sentence-transformers/all-MiniLM-L6-v2 | 22M | FP16 | ~0.5 GB |
| cross-encoder/ms-marco-MiniLM-L-6-v2 | 22M | FP16 | ~0.5 GB |
| Tesseract (fine-tuned) | — | — | ~1.5 GB |
| Activation memory (batched inference) | — | — | 2–4× model size |

Activation memory — the intermediate tensors generated during a forward pass — scales with batch size and sequence length. A model that occupies 1 GB of VRAM in weights might require 4–6 GB total during inference on a large batch. VRAM allocation must account for peak activation memory, not just model weights.

The rule I follow: allocate a MIG slice with at least 2× the model's weight size as headroom for activations, then test at the largest expected batch size before production deployment to confirm it fits.

## Dynamic Batching for GPU Workloads

As covered in the embedding service article, batching is essential for GPU efficiency. A GPU that processes requests one at a time wastes most of its parallel capacity — the hardware is built to operate on many inputs simultaneously.

For the local embedding model and reranker, I use a dynamic batching server in front of the model. Incoming requests are accumulated in a buffer and dispatched to the model as a batch when either the buffer is full or a timeout fires. This is the same adaptive batcher pattern from the embedding service, but with GPU-specific tuning:

```
Buffer timeout:   20ms    (latency budget)
Max batch size:   32      (VRAM and latency tradeoff)
Min batch size:   1       (do not hold a request waiting when load is low)
```

The batch size limit of 32 is empirically determined. Above 32, the activation memory for the reranker approaches the VRAM ceiling of the MIG slice, and latency increases non-linearly as the GPU begins swapping. Below 32, throughput is proportionally lower but latency stays flat. The sweet spot for this model on this hardware is 16–24 requests per batch during normal load.

GPU utilization during a batch is near 100%. GPU utilization between batches is near 0%. The batcher's job is to minimize the gap between batches — to keep the GPU busy rather than idle.

## Model Warm-Up and Cold Start

Loading a model from disk into GPU VRAM takes time — 2–10 seconds depending on model size and storage speed. A cold-start penalty of 10 seconds on the first request after a deployment or restart is unacceptable for a latency-sensitive service.

I handle this with explicit warm-up:

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

When a GPU is shared (via MIG or via a scheduling layer), competing workloads need priority rules. Not all GPU work is equally urgent:

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

GPU utilization is reported differently from CPU utilization, and the difference matters for interpretation:

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

GPU instances cost more than CPU instances — often 5–10× for equivalent core count. Every GPU allocation decision has a cost dimension.

The question I ask before allocating GPU for a workload: **what is the latency cost of running on CPU instead?**

For the reranker, CPU inference on a 22M parameter model takes ~200ms per batch of 20. GPU inference takes ~8ms. The reranker is in the request path for search queries. A 200ms latency penalty on search is noticeable; 8ms is not. GPU is justified.

For the historical OCR model, CPU inference takes ~4s per page; GPU takes ~0.8s. OCR is an async background job — the user is not waiting. The latency difference is real but the user experience impact is low. Whether GPU is justified depends on throughput requirements, not latency. At current OCR volume, the throughput difference does not require GPU — the CPU workers keep up. If volume doubles, GPU becomes worth it.

This cost-versus-latency analysis is the right framework for GPU allocation decisions. The answer is not always GPU, and it is not always the biggest GPU available. It is the smallest allocation that meets the latency and throughput requirements for the workload, at the point in the scaling curve where the workload actually is today.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The API Boilerplate"
  supportingCopy: "Get the Production AI API Boilerplate — FastAPI starter, auth, vector search, embedding services, Docker, and CI/CD examples ($49)."
  destinationUrl: "/products/production-ai-api-boilerplate"
  price: "$49"
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

---

*[← Back to Backend Engineering series](/categories/backend-engineering)*
