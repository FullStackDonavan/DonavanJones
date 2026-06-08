---
title: "Local Agent Systems"
description: "Overview of local agent systems in AI engineering."
date: 2026-05-03
category: "ai-engineering"
tags:
  - ai-engineering
  - agents
  - frameworks
draft: false
slug: local-agent-systems
author: Donavan Jones
---

# Local Agent Systems

Every article in this series so far has assumed that model inference happens through a cloud API — send a request to Anthropic or OpenAI, receive a completion. For most production AI features, this is the right architecture. Cloud APIs deliver the best available models with no infrastructure to run.

But cloud APIs are not the only option, and for certain tasks they are not the best option. Local agent systems — AI agents that run models on hardware you control — have a different set of tradeoffs that make them compelling for specific use cases: privacy-sensitive workloads, offline operation, latency-critical lightweight tasks, and cost optimization at high inference volume.

This article covers what local agent systems are, when they make sense over cloud APIs, the tooling ecosystem for running models locally, and how local and cloud inference mix on this platform.

## What "Local" Means

"Local" in this context means inference happens on hardware under your control — your development machine, a server in your infrastructure, a device the user owns — rather than on a cloud provider's hardware reached over the internet.

This definition covers two distinct deployment scenarios:

**Developer/server local** — models run on your own servers or local development machine. The model process lives in your infrastructure, you control the hardware, you pay for compute directly. The user still accesses the system over the network; the "local" is from the perspective of the application infrastructure, not the user.

**Client-side local** — models run on the user's own device. Inference happens in the browser (via WebAssembly), in a native desktop app, or on a mobile device. The model never reaches a server. True edge inference.

Most production local agent systems are developer/server local. Client-side local is a narrower use case — the models that fit on consumer hardware are significantly less capable than what runs in the cloud — but increasingly viable as hardware improves and model compression advances.

## The Case for Local

### Privacy

For some content, sending it to a cloud API is a non-starter. A Bible study platform serving users who journal their most personal spiritual struggles, doubts, and prayers has a reasonable obligation to consider whether that content should transit external infrastructure.

The platform's current approach: personal journal content and user reflections that the user has not explicitly shared are processed by a local embedding model rather than a cloud API for indexing. The semantic meaning goes into the vector store; the raw text never leaves the user's data context. Study questions and retrieved content use cloud APIs because the content is not user-private.

This is a selective local deployment — not all-or-nothing. Cloud APIs for content that is safe to send; local models for content that should not leave.

### Latency for Lightweight Tasks

A cloud API inference call has an irreducible latency floor: the time for a packet to reach the provider's data center, queue for an available GPU, execute inference, and return. For a small model doing a lightweight classification task — "is this passage reference formatted correctly?" "what language is this text in?" "what category does this topic fall into?" — local CPU inference can be faster than a cloud round trip.

Latency-sensitive lightweight classification tasks that run in the request path are candidates for local inference even when quality is slightly lower than cloud equivalents.

### Offline Operation

A study app that requires a network connection to function is a study app that fails when the user is on a plane, in a remote location, or has spotty coverage. Local models enable a meaningful offline mode: basic question answering, personal note search, reading plan progression.

The offline mode does not need to match the quality of the connected experience — it needs to be usable. A local model that answers questions adequately is better than a spinner.

### Cost at Volume

Cloud API pricing is per token. At high volume — millions of inference calls per day — the per-token cost compounds to significant infrastructure spend. A local model with a fixed hardware cost amortizes that cost across unlimited inference calls. At sufficient volume, local becomes cheaper than cloud.

The break-even depends on the model size (larger models need more expensive hardware), the hardware utilization rate (an underutilized GPU is expensive), and the cloud API pricing for equivalent quality. For most early-stage products, cloud APIs are cheaper because utilization is low. At scale, the math changes.

## The Local Model Ecosystem

### Ollama

Ollama is the fastest path to running open-source models locally. It handles model downloading, quantization selection, serving, and provides an API compatible with the OpenAI API schema. Drop it into a project that already uses an OpenAI-compatible client and the only change is the base URL.

```bash
# Install and run
brew install ollama
ollama serve

# Pull a model
ollama pull llama3.2:3b
ollama pull nomic-embed-text  # embedding model

# Use via API
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2:3b",
  "prompt": "What does hesed mean in Hebrew?",
  "stream": false
}'
```

OpenAI-compatible endpoint for drop-in replacement:

```typescript
import Anthropic from "@anthropic-ai/sdk"; // or use OpenAI SDK
import OpenAI from "openai";

// Switch between cloud and local by changing the client
const localClient = new OpenAI({
  baseURL: "http://localhost:11434/v1",
  apiKey: "ollama", // required but ignored by Ollama
});

const cloudClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Same call, different backends
const completion = await (useLocal ? localClient : cloudClient).chat.completions.create({
  model: useLocal ? "llama3.2:3b" : "gpt-4o-mini",
  messages: [{ role: "user", content: prompt }],
});
```

Ollama runs on macOS, Linux, and Windows, uses GPU acceleration when available (Apple Silicon MPS, NVIDIA CUDA, AMD ROCm), and falls back to CPU. It handles quantized models (GGUF format) well, which are the practical format for running large models on consumer hardware — a 7B model that requires 14GB of VRAM in FP16 fits in 4–5GB in Q4 quantization with modest quality degradation.

### llama.cpp

llama.cpp is the underlying inference engine that Ollama (and many other tools) use under the hood. Using it directly gives more control: custom sampling parameters, specific quantization formats, embedding extraction, and C/C++ integration for low-level optimization.

For most uses, Ollama's wrapper around llama.cpp is preferable — it handles model management, GPU detection, and API serving. Direct llama.cpp usage is for cases where the wrapper abstracts away something you need.

### LM Studio

LM Studio is a desktop application for downloading and running local models with a GUI. It provides an OpenAI-compatible API server alongside a chat interface for testing. Useful for non-developer team members exploring local models, or for quick model evaluation before committing to a programmatic integration.

### Transformers + FastAPI (Custom Serving)

For self-hosted models where Ollama's abstractions are too restrictive — fine-tuned models, custom architectures, models that need specific preprocessing — running a model directly with Hugging Face Transformers and serving it through FastAPI gives full control:

```python
# model_server.py
from transformers import AutoTokenizer, AutoModelForCausalLM
from fastapi import FastAPI
import torch

app = FastAPI()
model_name = "path/to/fine-tuned-model"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16)
model.eval()

@app.post("/generate")
async def generate(request: GenerateRequest):
    inputs = tokenizer(request.prompt, return_tensors="pt")
    with torch.no_grad():
        outputs = model.generate(**inputs, max_new_tokens=request.max_tokens)
    return {"text": tokenizer.decode(outputs[0], skip_special_tokens=True)}
```

This approach is used for the historical OCR model (fine-tuned Tesseract, Python-served) and for the local reranker (sentence-transformers, served via FastAPI sidecar).

## Model Selection for Local Deployment

Not all models run well locally. The practical constraints:

**Parameter count vs hardware**: a 70B model requires roughly 40GB of VRAM in Q4 quantization — an H100 or two A100s. A 7B model requires roughly 4–5GB — a Mac M2 Pro handles it comfortably. For most local deployments, 7B–13B models are the practical range on available hardware.

**Task-model fit**: smaller models are surprisingly capable at constrained, well-defined tasks and noticeably weaker at open-ended reasoning. A 7B model classifying topic categories or checking passage reference formatting performs well. A 7B model generating a nuanced theological commentary does not. Match model size to task requirements.

**Quantization tradeoffs**: Q4 quantization (4-bit) halves memory requirements versus FP16 at roughly 2–5% quality degradation on standard benchmarks. Q8 quantization cuts memory in half from FP16 with under 1% degradation. For most local tasks, Q4 is the right default; for quality-sensitive tasks, Q8 is worth the extra memory.

Models I use locally on this platform:

| Task | Model | Quantization | Runtime |
|---|---|---|---|
| Embedding (fallback) | nomic-embed-text | FP16 | Ollama |
| Reranking | cross-encoder/ms-marco-MiniLM-L-6-v2 | FP16 | FastAPI |
| Classification (topic, language) | llama3.2:3b | Q4 | Ollama |
| Historical OCR | tesseract-finetuned | N/A | FastAPI |
| Offline Q&A (mobile) | phi-3-mini | Q4 | llama.cpp (device) |

The larger, more capable models (Opus, Sonnet) remain cloud-only — the quality gap between a 7B local model and a frontier model is significant for complex reasoning tasks, and the infrastructure cost of running a 70B model locally is not justified.

## Building a Local Agent Loop

A local agent loop is structurally identical to a cloud agent loop — the same message array, the same tool calling pattern, the same agentic loop from article 03. The only difference is the client pointing at a local endpoint.

For tool calling with a local model, capability matters: not all local models handle tool calling reliably. Models that are specifically fine-tuned for function calling (Llama 3.1, Mistral with function calling fine-tune, Qwen 2.5) work well. Models that are not fine-tuned for it will attempt to call tools but produce malformed JSON arguments frequently.

```typescript
// Local tool-calling agent using Ollama's OpenAI-compatible endpoint
const localAgent = new OpenAI({ baseURL: "http://localhost:11434/v1", apiKey: "ollama" });

async function runLocalAgent(userMessage: string, tools: Tool[]): Promise<string> {
  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage },
  ];

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const response = await localAgent.chat.completions.create({
      model: "llama3.1:8b",  // function-calling capable model
      messages,
      tools: tools.map(toOpenAIToolFormat),
      tool_choice: "auto",
    });

    const choice = response.choices[0];
    messages.push({ role: "assistant", content: choice.message.content, tool_calls: choice.message.tool_calls });

    if (choice.finish_reason === "stop") {
      return choice.message.content ?? "";
    }

    if (choice.finish_reason === "tool_calls") {
      const results = await Promise.all(
        (choice.message.tool_calls ?? []).map(async (call) => ({
          role: "tool" as const,
          tool_call_id: call.id,
          content: JSON.stringify(await executeTool(call.function.name, JSON.parse(call.function.arguments))),
        }))
      );
      messages.push(...results);
    }
  }
  throw new Error("Local agent exceeded max iterations");
}
```

One practical difference: local models respond more slowly than cloud APIs for the same parameter count when running on consumer hardware. A 7B model on an M2 Pro generates roughly 30–60 tokens per second. A cloud API serving the same model at scale generates faster because it runs on optimized hardware with better memory bandwidth. For interactive local agents, 60 tokens/sec is fine. For bulk processing, it may be a bottleneck.

## Hybrid Architecture: Local and Cloud Together

The most practical architecture is hybrid: local for tasks where local is better, cloud for tasks where cloud is better, with a clean abstraction layer that lets either swap without changing application logic.

The abstraction on this platform:

```typescript
interface InferenceClient {
  complete(request: CompletionRequest): Promise<CompletionResponse>;
  embed(texts: string[]): Promise<number[][]>;
}

class CloudInferenceClient implements InferenceClient { /* Anthropic API */ }
class LocalInferenceClient implements InferenceClient { /* Ollama */ }

class RouterInferenceClient implements InferenceClient {
  constructor(
    private cloud: CloudInferenceClient,
    private local: LocalInferenceClient,
    private policy: RoutingPolicy,
  ) {}

  async complete(request: CompletionRequest): Promise<CompletionResponse> {
    const backend = this.policy.selectBackend(request);
    return backend === "local"
      ? this.local.complete(request)
      : this.cloud.complete(request);
  }
}
```

The routing policy considers: task type, privacy classification, user tier (offline mode available for certain tiers), and whether the cloud API is currently available. The application code never knows which backend served a given request.

This abstraction also enables graceful degradation: if the cloud API is rate-limited or unavailable, the router falls back to local for tasks the local model can handle adequately. The fallback is not invisible — quality may drop — but the system stays functional rather than failing completely.

## What Local Cannot Replace (Yet)

Local models are practical for constrained, well-defined tasks. They are not practical substitutes for frontier models on the tasks that require frontier-level capability:

- Complex theological reasoning across multiple texts
- Nuanced interpretation with historical and linguistic context
- Study guide generation that requires coherent multi-section argumentation
- Detecting subtle theological inconsistencies in generated content

For these, the quality difference between a local 7B–13B model and claude-opus-4-8 is significant and user-visible. The platform uses local where local is good enough and cloud where quality is the primary constraint.

The frontier/local quality gap will narrow over time. Models are getting smaller without proportional quality loss. Tasks that require cloud today may be tractable locally in 18–24 months. The abstraction layer is designed to accommodate that shift — adding a new capable local model is a routing policy update, not an application change.
