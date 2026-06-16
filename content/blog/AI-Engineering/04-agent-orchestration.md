---
title: "Agent Orchestration"
description: "Managing and orchestrating multiple AI agents."
date: 2026-04-27
lastUpdated: "2026-06-09"
category: "ai-engineering"
tags:
  - ai-engineering
  - orchestration
  - agents
draft: false
cluster: "ai-engineering"
slug: agent-orchestration
author: Donavan Jones
---

# Agent Orchestration

The previous article covered tool calling — the mechanism by which a single model call steps outside its context window to retrieve information or take action. Tool calling makes a single agent more capable. Orchestration makes multiple agents work together toward a goal that no single agent call could accomplish alone.

The distinction matters. Tool calling is about depth: one model, reasoning through a problem, invoking tools to gather what it needs. Orchestration is about breadth and composition: multiple model calls, each specialized or scoped, coordinated to produce something more complex than any single call could generate. The study guide that requires a planning pass, multiple section generations, a cross-reference pass, and a final review is an orchestration problem, not a tool calling problem.

This article covers orchestration patterns — how to structure multi-agent workflows, how agents communicate, how to decompose complex tasks, and how to maintain coherence across multiple model calls.

*Part of the [AI Engineering series](/categories/ai-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every ai engineering deep-dive in this series."
destinationUrl: "/categories/ai-engineering"
---
::

## Why Single-Agent Calls Have Limits

A single model call has three practical limits that orchestration addresses:

**Context window saturation.** Every piece of information the agent needs must fit in the context window simultaneously. For a task that requires processing a large corpus — summarizing 30 commentary excerpts, generating a multi-section document, reasoning about a complex theological argument across many texts — the context window runs out before the task is complete. Orchestration lets multiple agents each work on a scoped subset.

**Attention dilution.** Context window size is not the only constraint. A model given 50,000 tokens of context to reason about attends to it imperfectly — early content is processed less effectively than content near the end of the prompt. A focused agent with 3,000 tokens of relevant context will often outperform a general agent with 50,000 tokens of everything, because its attention is not split.

**Task decomposition quality.** Complex tasks have multiple subtasks that require different prompting strategies, different model sizes, and different quality checks. A single prompt trying to do everything produces mediocre output for each subtask. A pipeline of specialized agents — one for outlining, one for generating sections, one for checking theological accuracy — can apply the right instructions and the right scrutiny at each stage.

## Three Orchestration Patterns

### Pattern 1: Sequential Pipeline

The simplest orchestration pattern: each agent passes its output to the next. The output of stage N is the input to stage N+1. No branching, no parallelism.

```
Query → Retrieval Agent → Outline Agent → Writing Agent → Review Agent → Response
```

Each agent is scoped to one responsibility. The retrieval agent finds relevant passages. The outline agent structures the argument. The writing agent generates prose from the outline. The review agent checks consistency and citations.

This pattern is predictable and easy to debug — if the final output is wrong, you trace backward through the stages to find where it went wrong. The cost is latency: stages run sequentially, so total time is the sum of all stage latencies.

On this platform, sequential pipeline is the structure for study guide generation:

```typescript
async function generateStudyGuide(passage: string, userId: string): Promise<StudyGuide> {
  // Stage 1: Retrieve relevant context
  const context = await retrievalAgent.run({ passage, userId });

  // Stage 2: Generate outline
  const outline = await outlineAgent.run({ passage, context });

  // Stage 3: Generate each section (parallel within this stage)
  const sections = await Promise.all(
    outline.sections.map(section =>
      writingAgent.run({ section, context, passage })
    )
  );

  // Stage 4: Review and validate
  const reviewed = await reviewAgent.run({ passage, outline, sections });

  return assemble(outline, reviewed.sections);
}
```

Stage 3 fans out — each section is generated in parallel once the outline is ready. This is where sequential pipeline and parallel execution mix: the stages are sequential, but within stage 3, the work is parallel.

### Pattern 2: Plan-and-Execute

In a plan-and-execute pattern, a planning agent first decomposes the task into steps, and an execution agent (or multiple agents) then carries out each step. The plan is explicit and inspectable — you can see what the system intends to do before it does it.

```
Task → Planner Agent → Plan (list of steps) → Executor Agent (×N) → Results → Synthesizer
```

The planner's job is to reason about the task and produce a structured sequence of actions. It does not execute anything itself. The executor's job is to carry out one specific step, grounded by the planner's context.

This pattern is powerful for open-ended tasks where the right sequence of steps is not known in advance. A user asking "explain the theological significance of water in the Old Testament" does not have a fixed pipeline — the planner determines that the right approach is: identify key water narratives, retrieve each, identify common theological themes, compare to New Testament fulfillment, synthesize.

```typescript
// Planner produces a structured plan
const plan = await plannerAgent.run({
  task: userQuery,
  availableTools: toolDescriptions,
  context: userMemory,
});
// plan.steps = [
//   { id: 1, action: "search_passages", args: { query: "water Old Testament" } },
//   { id: 2, action: "search_passages", args: { query: "water creation Genesis" } },
//   { id: 3, action: "synthesize", dependsOn: [1, 2], description: "..." },
//   ...
// ]

// Execute steps respecting dependencies
const results = await executePlan(plan, executorAgent);
```

The planner output is structured data — a list of steps with dependencies — not prose. This makes execution deterministic given the plan, and makes the plan auditable: if the final answer is wrong, inspect the plan to see if the decomposition was correct.

### Pattern 3: Reflection and Critique

A reflection pattern adds a critic agent that evaluates another agent's output and feeds critique back for revision. The producing agent and the critic agent iterate until the output meets a quality threshold or a maximum iteration count is reached.

```
Producer Agent → Draft → Critic Agent → Critique → Producer Agent → Revised Draft → ...
```

Reflection is most valuable for tasks where quality is hard to define upfront but recognizable when seen — theological accuracy, argumentative coherence, appropriate tone. A critic prompted specifically to find flaws produces more targeted feedback than a general instruction to "make this better."

On this platform, reflection is used for theological consistency checking on generated study content:

```typescript
async function generateWithReflection(
  task: GenerationTask,
  maxIterations = 3
): Promise<string> {
  let draft = await writerAgent.run(task);

  for (let i = 0; i < maxIterations; i++) {
    const critique = await theologicalCriticAgent.run({
      draft,
      passage: task.passage,
      sourcePassages: task.retrievedContext,
    });

    if (critique.approved) break;

    // Feed critique back to the writer
    draft = await writerAgent.run({
      ...task,
      previousDraft: draft,
      critique: critique.issues,
    });
  }

  return draft;
}
```

The critic is not a general editor — it is scoped to theological accuracy. It checks whether claims in the draft are grounded in the source passages, whether interpretations are within mainstream theological bounds, and whether citations are correct. Other quality dimensions (prose quality, structure, length) are handled separately.

The iteration count limit is essential. A critic that always finds something to critique and a writer that cannot satisfy it will loop forever without this bound.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how this fits into the production ai engineering system it was built for."
destinationUrl: "/systems/ai"
---
::

---

*Explore more articles in the [AI Engineering series](/categories/ai-engineering).*

---

## Agent Communication: How Agents Pass Information

Agents communicate through shared state, not direct function calls between model instances. Each agent takes structured input, produces structured output, and the orchestrator routes information between them.

This is a critical design constraint. Agents do not talk to each other — they talk to the orchestrator, which routes information and manages the overall flow. This keeps each agent's behavior testable in isolation and keeps the orchestration logic visible in one place.

Shared state takes different forms depending on the pattern:

**Pipeline state** — the accumulated output from all previous stages, passed forward as structured JSON. Each stage adds to the state object rather than replacing it.

```typescript
interface PipelineState {
  input: { passage: string; userId: string };
  retrieval?: { passages: Passage[]; commentary: Commentary[] };
  outline?: { sections: Section[]; theme: string };
  drafts?: { [sectionId: string]: string };
  review?: { approved: boolean; issues: string[] };
}
```

**Scratchpad** — a running text log of reasoning steps, tool calls, and intermediate conclusions that all agents in the pipeline can read. The scratchpad gives later agents context about how earlier agents approached the problem.

**Explicit handoff messages** — structured messages that summarize what the current agent accomplished and what the next agent should do. More verbose than structured state but easier for the model to parse when the state is complex.

The choice between these depends on how much the downstream agent needs to understand the upstream agent's reasoning vs. just its outputs. For sequential pipelines producing well-defined outputs, structured state is cleanest. For reflection loops where the critic needs to understand the writer's intent, scratchpad or explicit handoff messages give the critic more to work with.

## Specialized vs General Agents

A key architectural decision: should each agent in the pipeline have a specialized system prompt, or should all agents share a general system prompt?

Specialized agents have system prompts tuned to their specific role:

```
Outline Agent system prompt:
"You are a theological outline specialist. Your task is to analyze a Bible passage 
and the provided commentary excerpts and produce a clear, structured outline for a 
study guide. Your outline must have 3-5 main sections, each with a theological focus 
and key supporting verses. Do not write prose — produce a structured outline only."

Writing Agent system prompt:
"You are a Bible study writer. You will receive a section outline and supporting 
passages. Write clear, accessible prose for this section — approximately 200-300 words. 
Ground every claim in the provided passages. Use plain language; avoid jargon unless 
you define it."
```

General agents use a broader prompt and are given instructions for their current task inline.

Specialized agents are more predictable and produce more consistent outputs within their domain. They are also more brittle — a specialized agent that receives input outside its expected scope produces poor results. General agents adapt to more input variation but require more careful prompting on each call.

My preference: specialized agents for well-defined stages with stable input/output shapes (outline generation, section writing, theological critique), general agents for open-ended reasoning steps where the task structure is dynamic (planning, synthesis across varied inputs).

## Model Selection Per Agent

Not every agent in a pipeline needs the same model. Different tasks have different capability requirements, and using an expensive model everywhere multiplies cost without proportional quality gain.

On this platform, the same orchestration pipeline uses three different model tiers:

| Agent Role | Model | Reason |
|---|---|---|
| Planner | claude-opus-4-8 | Complex reasoning required for decomposition |
| Section writer | claude-opus-4-8 | Quality output is the user-visible result |
| Outline generator | claude-sonnet-4-6 | Structured output, less nuance required |
| Theological critic | claude-sonnet-4-6 | Checklist-style evaluation, not generative |
| Retrieval summarizer | claude-haiku-4-5 | Compression task, speed matters |
| Format validator | claude-haiku-4-5 | Schema checking, minimal reasoning needed |

The user-visible output (section content) uses the most capable model. Internal pipeline steps that process or structure information use lighter models. A retrieval summarizer that compresses 10 passages to 2 for context injection does not need Opus — it needs to be fast and cheap.

This tiering reduces inference cost for the same pipeline by 40–60% while delivering essentially the same final output quality, because the quality-sensitive steps still use the best model.

## Memory Integration

Orchestrated agents need access to the user's persistent memory — not just the current task's context. A study guide generation pipeline should know the user's theological background, their prior engagement with this passage, and their preferred explanation depth. This information shapes the outline, the writing style, and the level of assumed knowledge.

Memory is injected at the pipeline input, not passed between agents:

```typescript
async function runStudyGuidePipeline(
  passage: string,
  userId: string
): Promise<StudyGuide> {
  // Load memory once, at pipeline entry
  const userMemory = await memorySystem.retrieve(userId, passage);

  // Pass to all agents that need it
  const context = await retrievalAgent.run({ passage, userId, userMemory });
  const outline = await outlineAgent.run({ passage, context, userMemory });
  // ...
}
```

Each agent that receives `userMemory` decides how to use it based on its own system prompt. The outline agent uses it to calibrate section depth and assumed knowledge. The writing agent uses it to calibrate language level and tone. The critic uses it to evaluate whether the output is appropriate for this user specifically.

Injecting memory at the pipeline entry rather than having each agent independently retrieve it avoids duplicate memory queries and ensures all agents see the same memory snapshot for this request.

::CtaTryApp
---
buttonText: "Try The Live AI App"
supportingCopy: "Try the RAG-powered Bible study app these patterns were built for."
destinationUrl: "https://bibleverse.donavanjones.com/register"
---
::

## Observability Across Agent Boundaries

Debugging an orchestration pipeline requires visibility across all agent calls, not just the final output. When a study guide section is wrong, the cause could be in any stage — bad retrieval, incorrect outline structure, poor writing, or a critic that missed an error.

Every agent call emits a span with its role, model, prompt token count, completion token count, and the full input/output. These spans are correlated by a shared `pipeline_run_id` so the complete trace for one pipeline execution can be reconstructed.

The trace for a failed study guide run shows exactly which agent produced the error, what input it received, and what it returned. Without this, debugging requires mental reconstruction from scattered logs. With it, finding the failure is usually a one-minute trace inspection.

## What Orchestration Is Not

Orchestration is not a solution to a poorly-designed prompt. Adding more agents to compensate for a bad system prompt produces a more expensive, slower version of the same bad output. Before orchestrating, exhaust single-agent options — often a well-constructed prompt with the right context retrieval handles what seemed to require multiple agents.

Orchestration is appropriate when:
- The task genuinely exceeds what fits coherently in one context window
- Different subtasks benefit from fundamentally different prompting strategies
- Quality checking requires a perspective genuinely distinct from the generator's
- Parallelism across independent subtasks would meaningfully reduce latency

If none of these apply, a single well-prompted agent call is the better choice. Simpler, cheaper, faster, and easier to debug.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The AI Starter Kit"
  supportingCopy: "Get the Self-Hosted AI Starter Kit — Ollama setup, RAG architecture diagrams, embedding pipeline templates, and FastAPI examples ($29)."
  destinationUrl: "/products/self-hosted-ai-starter-kit"
  price: "$29"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: State Management"
  supportingCopy: "Continue with \"State Management\" for the next piece of this system."
  destinationUrl: "/blog/ai-engineering/05-state-management"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get new ai engineering breakdowns delivered before they're public."
  ---
  :::
::

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "Multi-Agent System — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Multi-agent_system"
    type: "wikipedia"
    description: "Overview of multi-agent system architecture, communication patterns, and coordination mechanisms."
  - label: "Generative Agents: Interactive Simulacra of Human Behavior (Park et al., 2023)"
    url: "https://doi.org/10.48550/arXiv.2304.03442"
    type: "doi"
    description: "Stanford research demonstrating how multiple coordinated AI agents produce coherent emergent behavior — foundational orchestration precedent."
  - label: "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation (Wu et al., 2023)"
    url: "https://doi.org/10.48550/arXiv.2308.08155"
    type: "doi"
    description: "Microsoft Research paper introducing the AutoGen multi-agent conversation framework for complex task orchestration."
  - label: "Workflow — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Workflow"
    type: "wikipedia"
    description: "General principles of workflow design and task sequencing — the conceptual model behind agent pipeline orchestration."
---
::

---

*[← Back to AI Engineering](/categories/ai-engineering)*
