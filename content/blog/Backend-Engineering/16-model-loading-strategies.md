---
title: "Model Loading Strategies"
description: "Approaches to model loading in AI backend systems."
date: 2026-04-09
category: "backend-engineering"
tags:
  - models
  - ai
draft: false
slug: model-loading-strategies
author: Donavan Jones
---

# Model Loading Strategies

Every locally-hosted model has to get from disk into memory before it can process a single request. For most software, loading a configuration file or a small dataset is fast enough to be irrelevant. For neural network models, loading is a significant operation — seconds to minutes depending on model size, storage speed, and destination (RAM vs VRAM). Handled carelessly, model loading becomes the dominant source of latency in an otherwise fast system.

This platform runs several local models: the fine-tuned Tesseract model for historical OCR, the sentence-transformers embedding model for the embedding fallback path, and the cross-encoder reranker. None of these are large by modern standards — tens to hundreds of megabytes rather than tens of gigabytes. But the loading strategies still matter, because loading happens at service startup, at deployment, and in some configurations on demand, and each of those contexts has different constraints.

This article covers how models are loaded in each context, how loading interacts with service availability, and the strategies I use to make loading transparent to users.

## What Model Loading Actually Involves

Loading a model from disk into a usable state has four distinct phases, each with different cost:

**File I/O** — reading the model weights from disk into system memory. For a 400MB model on an NVMe SSD, this takes roughly 0.2–0.5 seconds. On spinning disk or a network file system, it can take 5–20 seconds. Storage speed is the dominant factor here.

**Deserialization** — converting the on-disk format (typically safetensors or pickle) into in-memory tensor objects. For safetensors format, this is nearly zero overhead — the format is designed for direct memory mapping. For legacy pickle format, deserialization adds significant CPU cost.

**Device transfer** — moving tensors from system RAM to VRAM if the model runs on GPU. A 400MB model takes 0.1–0.3 seconds to transfer over PCIe at 16GB/s theoretical throughput (real-world transfers are slower due to overhead). Larger models take proportionally longer.

**Kernel compilation** — on the first inference run after loading, CUDA compiles optimized kernels for each unique operation shape. This is a one-time cost per process lifetime, but it can add 2–10 seconds of latency to the first request after startup. Subsequent requests with the same input shapes use cached kernels and are unaffected.

Total load time for a 400MB model on GPU: 1–5 seconds. For a 6GB model: 30–60 seconds. For a 70B model: 10–30 minutes (not a use case here, but the scaling is worth understanding).

## Startup Loading vs On-Demand Loading

The first strategic decision is when to load: at service startup or on first use.

**Startup loading** — the service loads all models before accepting any traffic. Loading is synchronous with startup; the process is not ready until all models are in memory.

**On-demand loading** — models are loaded lazily when first needed. The service starts quickly, but the first request that triggers a model load experiences full loading latency.

For this platform, I load all models at startup. The reasoning:

On-demand loading trades a slow first request for fast startup. In a production system where services are load-balanced and health-checked, a slow first request is a user-facing problem — that request goes to a specific instance, and that user experiences the full loading delay. Startup loading moves the delay out of the request path entirely. The service is simply unavailable until it is ready, which the load balancer handles cleanly.

The only context where on-demand loading makes sense is when models are large and rarely used, and the cold-start penalty is acceptable (a background job service, for example, where no user is waiting synchronously). For request-path models, startup loading is always the right choice.

```typescript
async function startService() {
  logger.info("Loading models...");

  const [embeddingModel, rerankerModel, ocrModel] = await Promise.all([
    loadModel("sentence-transformers/all-MiniLM-L6-v2"),
    loadModel("cross-encoder/ms-marco-MiniLM-L-6-v2"),
    loadModel("tesseract/historical-religious-v2"),
  ]);

  // Warm up each model with dummy inputs (triggers CUDA kernel compilation)
  await Promise.all([
    warmUp(embeddingModel, ["warm up text"]),
    warmUp(rerankerModel, [{ query: "warm up", passage: "warm up" }]),
    warmUp(ocrModel, [dummyImage()]),
  ]);

  logger.info("All models ready. Registering with load balancer.");
  await registerHealthy(); // only now does traffic start flowing
  await startServer();
}
```

The three models load in parallel — they have no dependency on each other, and parallel loading cuts total startup time from ~10 seconds sequential to ~4 seconds. Warm-up runs after all models are loaded, also in parallel.

`registerHealthy()` is the gate. The load balancer health check endpoint returns 503 until this call completes. No user request reaches the service until the models are loaded and warmed.

## Keeping Models in Memory

Once loaded, models should stay in memory for the life of the service process. Unloading and reloading models on a per-request or per-session basis would be catastrophic for latency. The model is the most expensive object in the process — treat it as a singleton initialized once at startup.

This is obvious for a single-model service. It becomes less obvious when the service needs to handle multiple model versions simultaneously — for example, during a model upgrade where old and new versions must coexist.

For coexistence, I maintain a model registry:

```typescript
class ModelRegistry {
  private models = new Map<string, LoadedModel>();

  async get(name: string, version: string): Promise<LoadedModel> {
    const key = `${name}:${version}`;
    if (!this.models.has(key)) {
      throw new Error(`Model ${key} not loaded. Add to startup manifest.`);
    }
    return this.models.get(key)!;
  }

  async load(name: string, version: string): Promise<void> {
    const key = `${name}:${version}`;
    if (this.models.has(key)) return; // already loaded
    const model = await loadModel(resolveModelPath(name, version));
    await warmUp(model, sampleInputs(name));
    this.models.set(key, model);
  }

  unload(name: string, version: string): void {
    const key = `${name}:${version}`;
    const model = this.models.get(key);
    if (model) {
      model.dispose(); // release VRAM / memory
      this.models.delete(key);
    }
  }
}
```

The registry never loads on demand in the request path — it throws if a requested model is not loaded. Loading is always an explicit startup or administrative action. This prevents the on-demand loading anti-pattern from sneaking in through the registry interface.

## Model Storage and Distribution

Models need to be available on the filesystem when a service starts. In a containerized deployment, this means the model weights must be either baked into the container image or fetched at startup from object storage.

**Baked into the image**: model weights are copied into the Docker image during build. The image is larger (hundreds of megabytes to gigabytes), but startup is fast — no network download required. Container pull time increases proportionally with image size.

**Fetched at startup**: the container is small, but the first startup on a new instance includes downloading the model from S3 or similar. Download time depends on model size and network bandwidth. A 400MB model over a 1Gbps connection takes under 5 seconds; over a slower connection, it can be 30+ seconds.

I use a hybrid: small utility models (under 200MB) are baked into the image. Larger models are fetched at startup and cached on the instance's local disk. Subsequent restarts on the same instance use the local cache.

```typescript
async function loadModel(name: string, version: string): Promise<LoadedModel> {
  const localPath = path.join(MODEL_CACHE_DIR, name, version);

  if (!fs.existsSync(localPath)) {
    logger.info(`Model ${name}@${version} not in local cache. Downloading...`);
    await downloadFromS3(`models/${name}/${version}`, localPath);
  }

  return loadFromDisk(localPath);
}
```

The cache is keyed by name and version — upgrading the model version automatically fetches a new copy without manual cache invalidation. Old versions are cleaned up by a maintenance job that deletes cache entries not referenced by the current startup manifest.

## Deployment and Zero-Downtime Updates

Model updates are the most disruptive type of deployment for this service. Updating a stateless API service is straightforward — roll new containers, traffic shifts gradually, old containers drain. Updating a model-serving service adds the loading time to the rollout window. If the new model takes 8 seconds to load, each new instance is unavailable for 8 seconds during rollout.

In a rolling deploy with three instances, the sequence is:

```
Instance 1: drain → stop → start → [8s load] → ready → traffic resumes
Instance 2: drain → stop → start → [8s load] → ready → traffic resumes
Instance 3: drain → stop → start → [8s load] → ready → traffic resumes
```

Total time with two healthy instances always serving traffic: ~30 seconds for a three-instance rollout. Acceptable.

The failure case to avoid: starting all three instances simultaneously. If loading fails on all three (corrupted model file, insufficient VRAM), all instances fail their health check simultaneously and the service goes down. Rolling deploys with a maximum of one unavailable instance at a time prevent this.

### Blue-Green for Large Models

For larger models or longer load times, a rolling deploy creates an extended window where the system runs at reduced capacity. Blue-green deployment avoids this:

1. Stand up a complete new environment (green) with the new model
2. Load and warm up all green instances fully
3. Switch traffic from blue to green atomically at the load balancer
4. Keep blue running for a short rollback window, then decommission

With blue-green, the traffic cutover happens only after all green instances are fully ready. No user request hits an instance that is still loading. The tradeoff is doubled instance cost during the rollout window.

I use rolling deploy for small model updates and blue-green for major model changes — new architectures, significant size increases, or updates where the fallback to the previous version needs to remain possible for longer than a rolling drain window.

## Handling Load Failures

Models can fail to load. The file can be corrupted. The download can fail mid-transfer. VRAM can be insufficient. The startup code has to handle these cases without silently swallowing errors.

```typescript
async function loadModelWithValidation(name: string, version: string): Promise<LoadedModel> {
  let model: LoadedModel;

  try {
    model = await loadModel(name, version);
  } catch (err) {
    logger.error(`Failed to load model ${name}@${version}: ${err.message}`);

    // Attempt to fall back to the previous version if available
    const fallbackVersion = await getLastKnownGoodVersion(name);
    if (fallbackVersion && fallbackVersion !== version) {
      logger.warn(`Falling back to ${name}@${fallbackVersion}`);
      model = await loadModel(name, fallbackVersion);
    } else {
      throw new Error(`Model ${name} failed to load and no fallback available`);
    }
  }

  // Validate the model produces expected output on a known input
  const testOutput = await runInference(model, knownTestInput(name));
  if (!outputMatchesExpected(name, testOutput)) {
    throw new Error(`Model ${name}@${version} loaded but failed validation`);
  }

  return model;
}
```

Two safety nets: version fallback if the target version fails to load, and output validation to catch models that load but produce wrong results (corrupted weights, wrong model file). A model that loads but silently produces garbage is worse than a model that fails to load — at least a load failure is immediately obvious.

## Memory Management Across the Process Lifetime

Neural network inference allocates temporary tensors for each batch — activation memory, attention matrices, intermediate computations. These tensors should be released after each inference call. In Python with PyTorch, this is handled by the garbage collector, but it is not always timely. In production, I explicitly clear the CUDA cache after each inference batch to prevent activation memory from accumulating:

```python
import torch

def run_inference_batch(model, inputs):
    with torch.no_grad():  # disable gradient tracking for inference
        outputs = model(inputs)

    # Explicitly release intermediate tensors
    torch.cuda.empty_cache()
    return outputs.cpu().numpy()
```

`torch.no_grad()` disables gradient computation and halves the activation memory required — inference never needs gradients, and the context manager prevents PyTorch from allocating them. `torch.cuda.empty_cache()` releases cached allocations back to CUDA's memory pool after the batch.

Without these, VRAM usage grows slowly over time as cached tensors accumulate. The service runs fine initially and then starts getting OOM errors hours into production. This is the kind of bug that only appears under sustained load and is difficult to reproduce in testing.

## What Changes When Models Get Bigger

Everything in this article is tuned for models under 1GB. The strategies scale, but the tradeoffs shift as model size grows:

At 1–10GB, startup loading time becomes significant enough to require longer health check grace periods and blue-green becomes more attractive. VRAM sizing requires more careful planning. Model caching on disk becomes essential to avoid repeated large downloads.

At 10–100GB, loading a model once and sharing it across multiple request handlers (rather than one model per process) becomes necessary. A single 70B model instance can serve multiple concurrent requests through batching. The process model shifts from "one model per service instance" to "one model instance serving many request handlers."

At 100GB+, model sharding across multiple GPUs is required — the model does not fit on a single device. This is infrastructure I do not currently run; the platform uses managed APIs for workloads that need models of this size.

The strategies in this article are appropriate for the model sizes I actually deploy locally. They are the right starting point for any system running small-to-medium local models, and the right mental model for reasoning about what changes as those models grow.
