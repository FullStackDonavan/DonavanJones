---
title: "Agent Orchestration (Backend)"
description: "Orchestrating agents in backend engineering."
date: 2026-03-26
lastUpdated: "2026-06-09"
category: "backend-engineering"
tags:
  - orchestration
  - ai
draft: false
slug: agent-orchestration-backend
author: Donavan Jones
---

# Agent Orchestration (Backend)

Single-call inference — send a prompt, get a response — handles most user-facing interactions on this platform. A user asks about a passage, the inference service builds a prompt with retrieved context, calls the model once, and streams the answer back. The interaction is complete in a few seconds.

But some tasks cannot be completed in a single inference call. A full study guide requires multiple passes: an outline pass to establish structure, a content pass for each section, a cross-reference pass to find supporting passages, and a review pass to check consistency. A research agent that answers a complex theological question might need to search different collections, synthesize conflicting commentary, and produce a structured argument. These tasks require coordinating multiple model calls, tool uses, and services over a longer time horizon.

That coordination is agent orchestration. This article covers how it is implemented in the backend: the task graph model, how agents use tools, how failures are handled, and what makes multi-step agent execution different from the single-call inference patterns covered earlier.

*Part of the [Backend Engineering series](/categories/backend-engineering).*

## What an Agent Is (in This Context)

The word "agent" carries a lot of baggage. In the context of this backend, an agent is a specific, bounded thing: a process that executes a predefined task graph, makes LLM calls at decision points, uses a set of registered tools, and produces a structured output.

Agents are not autonomous. They do not decide on their own what tasks to pursue. A user or a backend process triggers an agent with a specific goal and a defined set of tools. The agent executes toward that goal, using the model to make decisions at each step, until it either produces the output or fails.

This is a deliberate constraint. Fully autonomous agents that decide their own goals are interesting research but poor production engineering — they are hard to reason about, hard to bound in terms of cost and time, and hard to debug when they go wrong. Bounded agents with explicit task graphs and observable state are what I actually ship.

## The Task Graph Model

Every agent execution follows a task graph — a directed acyclic graph (DAG) of steps with defined inputs, outputs, and dependencies.

A study guide agent looks like this:

```
fetch_passage
    ↓
retrieve_context ──────────────────┐
    ↓                              ↓
generate_outline          retrieve_crossrefs
    ↓                              ↓
generate_sections (×N) ────────────┘
    ↓
validate_structure
    ↓
store_result
```

Each node is a step with a type (LLM call, tool call, or transform), defined inputs from the graph context, and defined outputs written back to the graph context. Steps with no dependency between them can run in parallel — `retrieve_context` and `retrieve_crossrefs` run concurrently, and `generate_sections` fans out across all sections simultaneously.

The graph is defined in code as a typed configuration object, not assembled at runtime by the model:

```typescript
const studyGuideGraph: TaskGraph = {
  steps: [
    { id: "fetch_passage", type: "tool", tool: "bible_text", inputs: ["passage_ref"] },
    { id: "retrieve_context", type: "tool", tool: "vector_search", inputs: ["fetch_passage.text"], parallel: true },
    { id: "retrieve_crossrefs", type: "tool", tool: "cross_reference", inputs: ["fetch_passage.text"], parallel: true },
    { id: "generate_outline", type: "llm", model: "claude-sonnet-4-6", inputs: ["fetch_passage.text", "retrieve_context.results"], dependsOn: ["retrieve_context"] },
    { id: "generate_sections", type: "llm_fan_out", model: "claude-opus-4-8", inputs: ["generate_outline.sections", "retrieve_context.results", "retrieve_crossrefs.refs"], dependsOn: ["generate_outline", "retrieve_crossrefs"] },
    { id: "validate_structure", type: "transform", fn: "validateStudyGuide", inputs: ["generate_sections.results"] },
    { id: "store_result", type: "tool", tool: "storage", inputs: ["validate_structure.output"] },
  ],
};
```

This graph definition is the contract. It says exactly which steps exist, what each step depends on, and what data flows between them. The orchestrator executes it — it does not interpret it, extend it, or modify it at runtime.

## The Orchestrator

The orchestrator is the engine that executes a task graph. It maintains execution state, dispatches steps when their dependencies are satisfied, handles parallel execution, and manages failures.

Core responsibilities:

**Dependency resolution.** The orchestrator tracks which steps are complete and which are blocked. When all dependencies of a step are satisfied, the step is added to the ready queue. Steps with no dependencies start immediately.

**Parallel dispatch.** Ready steps that are marked parallel are dispatched concurrently. The orchestrator does not wait for one to finish before starting another. In the study guide graph, `retrieve_context` and `retrieve_crossrefs` run simultaneously, cutting total latency compared to sequential execution.

**Context propagation.** Each step's output is written to a shared execution context keyed by step ID. Downstream steps read their inputs from this context using the `stepId.outputField` notation from the graph definition. The context is the only communication channel between steps — there are no direct step-to-step calls.

**State persistence.** Execution state is written to the database after each step completes. If the orchestrator process crashes mid-execution, the job can be resumed from the last completed step. This is the same durability pattern used in the OCR pipeline and inference job queue — progress is never lost to a process restart.

```typescript
async function executeStep(job: AgentJob, step: TaskStep): Promise<void> {
  await db.agentSteps.update(job.id, step.id, { status: "running", startedAt: new Date() });

  try {
    const inputs = resolveInputs(step.inputs, job.context);
    const output = await dispatchStep(step, inputs);
    job.context[step.id] = output;
    await db.agentSteps.update(job.id, step.id, { status: "completed", output, completedAt: new Date() });
  } catch (err) {
    await db.agentSteps.update(job.id, step.id, { status: "failed", error: err.message });
    throw err;
  }
}
```

## Tools

LLM steps in the graph can call tools. Tools are registered functions with typed inputs and outputs that the model can invoke through the standard tool-use API. On this platform, the registered tools are:

| Tool | Description |
|---|---|
| `bible_text` | Fetch one or more passages by reference |
| `vector_search` | Semantic search across the Bible verse and commentary collections |
| `cross_reference` | Look up standard cross-references for a passage |
| `lexicon_lookup` | Retrieve Strong's definitions for Hebrew or Greek terms |
| `note_search` | Search the current user's personal study notes |
| `web_search` | Search for theological resources (gated, pro tier only) |
| `storage` | Write structured output to the user's document library |

Each tool is implemented as a thin adapter that calls the appropriate backend service. `vector_search` calls the search service. `bible_text` calls the Bible text service. Tools do not contain business logic — they are the agent's interface to the rest of the backend.

Tool calls are logged with their inputs and outputs as part of the job execution trace. This makes the agent's reasoning observable: you can read the execution log and see exactly which tools were called, with what inputs, and what they returned. When an agent produces a wrong answer, the trace is how you find out why.

### Tool Call Validation

The model does not always call tools correctly. It may pass a malformed passage reference, omit a required parameter, or call a tool with inputs outside its accepted range. Every tool call is validated against the tool's input schema before execution:

```typescript
async function callTool(tool: RegisteredTool, rawArgs: unknown): Promise<ToolOutput> {
  const args = tool.inputSchema.parse(rawArgs); // Zod validation, throws on failure
  return tool.handler(args);
}
```

Validation failures are returned to the model as a tool error with a description of what went wrong. The model can then retry the tool call with corrected inputs. This retry loop is bounded — a tool that fails validation three times in a row causes the step to fail rather than letting the model spin in a correction loop indefinitely.

---

*Explore more articles in the [Backend Engineering series](/categories/backend-engineering).*

---

## LLM Fan-Out

The `llm_fan_out` step type is worth explaining separately. When the study guide outline is ready, each section needs to be generated independently. There might be five sections. Generating them sequentially wastes time — each takes 10–20 seconds.

Fan-out dispatches one LLM call per item in the input array, all concurrently, and waits for all to complete:

```typescript
async function executeFanOut(step: FanOutStep, inputs: FanOutInputs): Promise<FanOutOutput> {
  const items = inputs[step.fanOutOver]; // e.g., the array of sections from the outline
  const results = await Promise.allSettled(
    items.map(item => executeLlmStep(step, { ...inputs, item }))
  );

  const succeeded = results.filter(r => r.status === "fulfilled").map(r => r.value);
  const failed = results.filter(r => r.status === "rejected");

  if (failed.length > step.maxFailures) {
    throw new Error(`Fan-out failed: ${failed.length}/${items.length} items failed`);
  }

  return { results: succeeded, failedCount: failed.length };
}
```

`Promise.allSettled` is deliberate over `Promise.all`. If one section fails to generate, the other sections should still complete. The orchestrator decides whether the partial result is acceptable based on `maxFailures` — for a five-section guide, one failed section might be retried, but three failures indicate something systemic and should abort the job.

## Failure Handling

Multi-step agents fail in more interesting ways than single-call inference. A step can fail because:

- The LLM call returned a malformed response (handled by output validation and retry)
- A tool call failed due to a downstream service error (handled by tool-level retry)
- The model exceeded its context window (handled by context trimming and retry)
- The job hit its token budget (handled by graceful abort with partial result)
- The process orchestrating the job crashed (handled by state persistence and resume)

The failure strategy varies by step type and cause:

**Retryable failures** — transient errors (network timeouts, 429 rate limits, temporary service unavailability) are retried with exponential backoff up to three times per step.

**Correctable failures** — output validation failures or tool call errors where the model can correct its behavior are returned to the model as error feedback, allowing a retry with corrected behavior, up to two correction attempts.

**Fatal failures** — permanent errors (invalid input, content policy rejection, budget exhaustion) abort the job immediately. Retrying would produce the same failure.

**Partial success** — fan-out steps that exceed `maxFailures` but have some successful results can optionally store the partial output and notify the user rather than aborting. A study guide with four of five sections completed is more useful to the user than no guide at all.

## Observability and Tracing

Agent jobs produce much more observability surface than single-call inference. Every step has a status, a duration, token counts, and (for LLM steps) the full prompt and response. This creates a complete execution trace:

```
Job: study_guide_job_01HX...
  ├── fetch_passage        ✓  0.3s
  ├── retrieve_context     ✓  0.8s (parallel)
  ├── retrieve_crossrefs   ✓  0.6s (parallel)
  ├── generate_outline     ✓  8.2s  [312 prompt tokens, 428 completion tokens]
  ├── generate_sections
  │     ├── section_1      ✓  12.1s [1842 prompt tokens, 634 completion tokens]
  │     ├── section_2      ✓  14.3s [1891 prompt tokens, 712 completion tokens]
  │     ├── section_3      ✗  failed (validation: missing citations)
  │     │   └── retry_1    ✓  11.8s [1901 prompt tokens, 698 completion tokens]
  │     ├── section_4      ✓  13.2s [1856 prompt tokens, 681 completion tokens]
  │     └── section_5      ✓  9.7s  [1748 prompt tokens, 592 completion tokens]
  ├── validate_structure   ✓  0.1s
  └── store_result         ✓  0.2s
Total: 47.3s | 12,530 tokens | $0.09
```

This trace is stored with the job record and accessible from the platform's admin interface. When a user reports that their study guide is wrong, the trace shows exactly which retrieval results were used, which model generated which section, and whether any validation retries occurred. Debugging without this would mean reading logs from five different services and reconstructing the sequence manually.

## Cost Accounting

Multi-step agents can be expensive. A full study guide generation costs $0.08–0.15 in model API spend at current pricing — manageable per user, but significant at scale. Unlike single-call inference where the token count is predictable from the task type, agent jobs have variable token counts depending on retrieved context, outline length, and section depth.

I track cost at the job level, not just the service level. Each LLM step records its token consumption, the cost is computed at step completion, and the job total is available immediately on completion. This feeds the same spend dashboards used for the inference service, and the same circuit breakers apply — if an agent job would push daily spend over budget, it is queued for execution during off-peak hours rather than running immediately.

## What Makes Agents Harder Than Inference

Single-call inference is a request/response: send a prompt, get a completion, validate, return. Agents are stateful, multi-step processes that run for minutes rather than seconds, consume multiple services, and produce partial state that needs to be handled gracefully when things go wrong.

The patterns that make agents tractable in production are not unique to agents — they are the same patterns that make any complex async process manageable: durable state, explicit failure modes, observable execution, and bounded resource consumption. The model is just one component inside a larger system. Building it as a system, not as a series of model calls with some glue code, is what makes it reliable.

The next article covers async workers more broadly — the infrastructure layer that underlies agent execution, job queues, and every other async process in the backend.

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "Multi-Agent System — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Multi-agent_system"
    type: "wikipedia"
    description: "According to this overview, a multi-agent system coordinates multiple AI agents to accomplish goals — the architecture underlying the agent orchestration framework described in this article."
  - label: "Generative Agents: Interactive Simulacra of Human Behavior (Park et al., 2023)"
    url: "https://doi.org/10.1145/3586183.3606763"
    type: "doi"
    description: "Seminal paper on multi-step agent architectures — the research that established durable state, tool use, and observable execution traces as key agent design principles."
  - label: "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation (Wu et al., 2023)"
    url: "https://doi.org/10.48550/arXiv.2308.08155"
    type: "doi"
    description: "According to this paper, AutoGen demonstrates that multi-agent conversation with explicit task graphs significantly improves complex task completion — the inspiration for the task graph orchestration model."
  - label: "Workflow — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Workflow"
    type: "wikipedia"
    description: "Overview of workflow systems — the conceptual model behind the task graph: explicit steps, dependencies, and state transitions that define how multi-step agent jobs execute."
---
::

---

*[← Back to Backend Engineering series](/categories/backend-engineering)*
