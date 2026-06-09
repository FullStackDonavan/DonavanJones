---
title: "Inference Services"
description: "Design and implementation of inference services in AI backends."
date: 2026-03-18
lastUpdated: "2026-06-09"
category: "backend-engineering"
tags:
  - inference
  - ai
draft: false
cluster: "backend-engineering"
slug: inference-services
author: Donavan Jones
---

# Inference Services

The inference service is where a user's question becomes an answer. Every other service in the backend — authentication, retrieval, embeddings, search — exists to support this moment. Getting the inference service right means everything that depends on it works well. Getting it wrong means no amount of good architecture elsewhere saves the user experience.

Earlier in this series I covered AI services at a high level and streaming as a transport mechanism. This article goes one layer deeper: the internal design of the inference service itself — how prompts are constructed, how requests are routed, how outputs are validated, how long-running jobs are handled, and how the service scales without burning through API budget.

*Part of the [Backend Engineering series](/categories/backend-engineering).*

## The Two Modes of Inference

Not all inference requests are the same shape. I split inference into two modes with different handling:

**Synchronous (streaming)** — the user is waiting for a response. A question about a passage, a brief explanation, a definition. Latency is the primary constraint. The service streams tokens back immediately using SSE. The request stays open until the response is complete or the user disconnects.

**Asynchronous (job queue)** — the user triggered a long-running generation they do not need to watch in real time. A full study guide, a multi-chapter commentary summary, a reading plan for the next 90 days. These can take 30–120 seconds and produce thousands of tokens. The user does not sit at a spinner — they get a notification when the job completes.

The same inference logic runs both modes. The difference is in the request lifecycle wrapper: synchronous requests get an SSE response handler, asynchronous requests get a job record and a queue worker.

## Prompt Construction

The quality of the model's output is almost entirely determined by the quality of the prompt. Prompt construction is not a config file — it is application logic that deserves the same care as any other code.

Every inference request goes through a prompt builder that assembles four components in order:

**1. System instructions** — the model's role, constraints, and output format. These are static per task type and cached. For a verse explanation task:

```
You are a knowledgeable Bible study assistant. Your responses should be:
- Grounded in the provided scripture passages
- Theologically precise but accessible to non-scholars
- Structured with a brief summary followed by deeper context
- Free of speculation beyond what the text supports

Do not reference passages not provided in the context unless quoting well-known cross-references.
```

**2. Retrieved context** — the passages, commentary excerpts, and cross-references pulled from the vector search service. This is the RAG layer. Context is ordered by relevance score and trimmed to fit within a budget. The most relevant content goes first because models attend more strongly to content at the beginning of the context window.

**3. Conversation history** — prior turns in the session, if this is a multi-turn interaction. History is summarized if it exceeds a token threshold rather than truncated, which preserves the semantic content of earlier turns without blowing the context window.

**4. User query** — the user's actual question or request, formatted consistently as the final human turn.

The prompt builder calculates token counts for each component and enforces a budget. If context + history exceeds the budget, context is trimmed by dropping lowest-relevance passages first, then history is summarized. The system instructions and user query are never trimmed — they are the non-negotiable anchors.

```typescript
function buildPrompt(task: InferenceTask): BuiltPrompt {
  const systemTokens = countTokens(task.systemInstructions);
  const queryTokens = countTokens(task.userQuery);
  const reserved = systemTokens + queryTokens + COMPLETION_BUFFER;
  const available = MAX_CONTEXT_TOKENS - reserved;

  const context = trimToTokenBudget(task.retrievedContext, available * 0.7);
  const history = trimToTokenBudget(task.conversationHistory, available * 0.3);

  return { system: task.systemInstructions, context, history, query: task.userQuery };
}
```

The 70/30 split between context and history is a tunable default. Tasks with no history (one-shot questions) allocate the full available budget to retrieved context.

## Task Types and Model Routing

Different tasks need different models. The inference service owns model selection — callers specify a task type, not a model name. This keeps callers insulated from model changes and lets routing logic evolve without touching every consumer.

| Task Type | Model | Max Tokens | Streaming |
|---|---|---|---|
| `verse_explanation` | claude-haiku-4-5 | 512 | Yes |
| `passage_commentary` | claude-sonnet-4-6 | 1024 | Yes |
| `study_guide` | claude-opus-4-8 | 4096 | Async job |
| `reading_plan` | claude-sonnet-4-6 | 2048 | Async job |
| `theological_qa` | claude-opus-4-8 | 1024 | Yes |
| `summarization` | claude-haiku-4-5 | 256 | Yes |

The model selection considers three inputs: task type, user tier (free users get faster/cheaper models), and current system pressure (if the primary model is rate-limited, fall back to an alternative).

Model fallback is handled inside the inference service, invisible to callers:

```typescript
const modelPriority = {
  study_guide: ["claude-opus-4-8", "claude-sonnet-4-6"],
  theological_qa: ["claude-opus-4-8", "claude-sonnet-4-6"],
  verse_explanation: ["claude-haiku-4-5", "claude-sonnet-4-6"],
};

async function selectModel(taskType: string, tier: UserTier): Promise<string> {
  const candidates = tier === "free"
    ? modelPriority[taskType].slice(-1)  // cheapest only
    : modelPriority[taskType];

  for (const model of candidates) {
    if (await isModelAvailable(model)) return model;
  }
  throw new Error("No models available");
}
```

`isModelAvailable` checks a Redis key that the rate limit tracker maintains. When a model hits its rate limit, the tracker sets a key with a TTL matching the rate limit reset window. The model selector skips any model with an active rate limit key.

## Output Validation

The model returns text. That text must meet expectations before it leaves the service boundary. What "meets expectations" means depends on the task type.

**Schema validation** applies to tasks that request structured output. Study guides are returned as JSON with defined sections. If the model produces invalid JSON or omits required fields, the service retries with an explicit correction instruction — up to two retries before returning a structured error.

```typescript
async function validateStudyGuide(raw: string): Promise<StudyGuide> {
  try {
    const parsed = JSON.parse(raw);
    return studyGuideSchema.parse(parsed); // Zod schema
  } catch {
    throw new ValidationError("study_guide", raw);
  }
}
```

**Citation grounding** applies to responses that reference scripture. The validator extracts all verse references from the response (regex matching standard citation formats) and checks each against the list of passages provided in the retrieved context. References to passages not in the context are flagged as potential hallucinations. Flagged responses are either retried (if the hallucination rate is high) or returned with a warning annotation (if a single spurious citation slips through).

**Length validation** catches responses that are suspiciously short. A `study_guide` task that returns 50 tokens almost certainly failed silently — the model stopped early, hit a content filter, or misunderstood the task. Responses below a minimum token threshold for their task type are retried once.

**Theological consistency** is a light-touch check specific to this platform. A small set of high-confidence rules flags responses that contradict core Christian doctrinal positions (asserting Jesus did not rise from the dead, denying the existence of God, etc.). These are edge cases the model rarely hits, but when it does, the failure is significant. Flagged responses are sent to a moderation queue rather than returned to the user.

---

*Explore more articles in the [Backend Engineering series](/categories/backend-engineering).*

---

## The Job Queue for Async Tasks

Study guide generation is the canonical async task. A full study guide for a passage might involve:

- Retrieving 30+ relevant verses and commentary excerpts
- Generating an outline (one inference call)
- Generating each section with full context (4–6 inference calls)
- Compiling and validating the complete guide

Total time: 45–90 seconds. Total tokens: 8,000–15,000. This cannot be a synchronous request.

The job queue uses a simple pattern: a `jobs` table in Postgres plus a queue consumer running as a separate process pool.

```sql
CREATE TABLE inference_jobs (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL,
  task_type     TEXT NOT NULL,
  input         JSONB NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending',
  result        JSONB,
  error         TEXT,
  model_used    TEXT,
  tokens_used   INTEGER,
  created_at    TIMESTAMPTZ DEFAULT now(),
  started_at    TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ
);
```

The client submits a job and receives a `job_id` immediately. It polls the job status endpoint or waits for a push notification. The worker process picks up `pending` jobs, processes them, and writes the result back to the table.

Job workers claim jobs atomically to prevent double-processing:

```sql
UPDATE inference_jobs
SET status = 'processing', started_at = now()
WHERE id = (
  SELECT id FROM inference_jobs
  WHERE status = 'pending'
  ORDER BY created_at
  FOR UPDATE SKIP LOCKED
  LIMIT 1
)
RETURNING *;
```

`FOR UPDATE SKIP LOCKED` is the key clause. Multiple worker processes can run this query simultaneously — each will claim a different row and skip rows already locked by another worker. No job gets processed twice, no worker blocks another.

Failed jobs are retried up to three times with exponential backoff before being marked `failed`. Permanent failures (invalid input, content policy rejection) are marked `failed` immediately without retrying.

## Prompt Caching

Many inference requests are structurally similar. The system instructions are identical across all requests of the same task type. The retrieved context for a popular passage (John 3:16, Romans 8:28) is the same for every user who asks about it. Repeating these tokens in every API call wastes money.

Anthropic's prompt caching feature allows marking prompt prefixes as cacheable. The API charges a reduced rate for cache reads compared to full input tokens. I structure every prompt to maximize cache hits:

```
[Cached] System instructions        ← static, long-lived cache
[Cached] Retrieved context          ← keyed by passage + translation
[Not cached] Conversation history   ← user-specific, changes every turn
[Not cached] User query             ← unique per request
```

System instructions are marked cacheable and never change within a model version. Retrieved context is marked cacheable and keyed by the set of passage IDs — the same passages retrieved for Romans 8:28 by any user produce the same cache hit. Only the user-specific tail of the prompt (history + query) is uncached.

In practice, cache hits on system instructions occur on nearly every request. Cache hits on retrieved context occur on popular passages, which represent a disproportionate share of traffic. Combined, prompt caching reduces input token costs by 40–60% in steady-state operation.

## Rate Limiting and Spend Control

The inference service is the only place in the system where a single misbehaving request can generate significant unexpected cost. I apply three layers of control:

**Per-user rate limiting** — enforced at the API gateway before the request reaches inference. Free users: 20 inference calls per day. Pro users: 200 per day. Exceeding the limit returns a 429 with retry-after metadata.

**Per-request token ceilings** — every task type has a `max_tokens` ceiling enforced in the API call. The model cannot generate beyond this limit regardless of how the prompt is structured. Ceilings are set conservatively for cheap models and more generously for expensive ones.

**Daily spend circuit breaker** — the service tracks cumulative API spend against a daily budget. If spend exceeds 80% of the daily budget before midnight, the service begins routing all requests to the cheapest available model. At 100%, non-critical requests (summarization, reading plan generation) are queued for after midnight. Critical requests (direct user questions) are served with a truncated context window to reduce token count.

The circuit breaker is a coarse instrument and I have never needed the 100% threshold in production. But having it means a runaway job or an unexpected traffic spike cannot generate unbounded cost overnight.

## Observability

The inference service emits structured logs for every request with:

- `task_type`, `model_used`, `user_tier`
- `prompt_tokens`, `completion_tokens`, `cache_read_tokens`
- `latency_ms` (time to first token, time to last token)
- `validation_retries` (how many output validation retries occurred)
- `fallback_triggered` (whether a fallback model was used)

These feed a dashboard that tracks cost per task type, model utilization, cache hit rates, and validation retry rates. A spike in `validation_retries` on a specific task type usually means a prompt template change caused a regression in output format — catchable before users notice because the retries succeed, but worth fixing to reduce latency and cost.

Inference quality is harder to instrument than inference correctness. I log 1% of complete request/response pairs (with user consent) for periodic qualitative review. Automated metrics catch structural failures; human review catches the subtler degradations in reasoning quality that metrics miss.

## What Makes Inference Different from Other Services

Inference is the only service where the output is probabilistic. Every other service in this backend does what it is told: auth validates a token, search returns the k nearest neighbors, the notification service delivers an event. The inference service calls a model that makes predictions — and predictions can be confidently wrong.

This changes the operational posture. You test other services by asserting their output. You evaluate inference by measuring its output distribution against a quality baseline. You monitor other services for errors. You monitor inference for both errors and silent quality degradation.

Build the service like any other — clean boundaries, explicit contracts, observable internals — but hold it to a different standard of evidence when you want to know if it is working well.

---

*[← Back to Backend Engineering series](/categories/backend-engineering)*
