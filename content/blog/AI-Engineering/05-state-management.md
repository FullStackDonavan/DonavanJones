---
title: "State Management"
description: "State management strategies for AI agents."
date: 2026-04-29
category: "ai-engineering"
tags:
  - ai-engineering
  - state
  - agents
draft: false
slug: state-management
author: Donavan Jones
---

# State Management

Every AI agent exists in a world of state. The conversation so far. The tools it has called and what they returned. The user it is talking to and what it knows about them. The task it is working on and how far it has gotten. The pipeline it is running inside and what previous stages produced.

Managing this state correctly is one of the less glamorous but most consequential parts of AI engineering. Get it wrong and agents lose context mid-conversation, produce responses that contradict earlier turns, fail to use information they retrieved two steps ago, or repeat work that was already done. The model itself is stateless — every inference call is independent. State management is entirely the application's responsibility.

*Part of the [AI Engineering series](/categories/ai-engineering).*

This article covers the distinct types of state an AI agent system manages, how each is represented and stored, and the failure modes that emerge from state mismanagement.

## The Statelessness of Models

It is worth being precise about what "the model is stateless" means, because it shapes every design decision.

When you call a model API, you pass the entire conversation context in the request. The model processes it and returns a response. Nothing persists on the model provider's side between calls. The next call starts fresh — it knows nothing about the previous call unless you include the previous conversation in the new request.

This is fundamentally different from a stateful service like a database, which maintains state across requests. A model is more like a pure function: given the same input, it produces (approximately) the same output. The "memory" of a conversation is the conversation history you pass in each request — not something the model holds.

The implication: every piece of state the agent needs must be either in the context window of the current call or retrievable from an external store before the call is made. There is no third option.

## Five Layers of Agent State

An AI agent on this platform manages state at five distinct layers, each with different scope, lifetime, and storage requirements.

### Layer 1: Turn State

The immediate state of the current model interaction. A single inference call may involve multiple turns — the model calls a tool, receives a result, calls another tool, receives another result, then produces a final response. The sequence of messages exchanged within this single logical interaction is turn state.

Turn state is held in memory as an array of message objects for the duration of the inference loop:

```typescript
interface Turn {
  role: "user" | "assistant";
  content: MessageContent[]; // text blocks, tool_use blocks, tool_result blocks
}

// Grows as the inference loop executes
const turns: Turn[] = [
  { role: "user", content: [{ type: "text", text: "What does Romans 8 say about the Spirit?" }] },
  { role: "assistant", content: [{ type: "tool_use", name: "search_passages", input: { query: "..." } }] },
  { role: "user", content: [{ type: "tool_result", tool_use_id: "...", content: "..." }] },
  { role: "assistant", content: [{ type: "text", text: "Romans 8 presents the Spirit as..." }] },
];
```

Turn state is ephemeral — it exists only while the inference loop runs. It is not persisted directly; instead, the final assistant response and summary metadata are extracted and written to session state when the loop completes.

The key concern with turn state is completeness. Every message in the sequence — including all tool call and tool result turns — must be included when the next model call is made within the loop. Dropping a tool result turn produces a model that behaves as if it never called that tool, sometimes generating hallucinated results instead of using the retrieved data.

### Layer 2: Session State

The state of an ongoing conversation across multiple user messages within one session. Where turn state covers one logical interaction, session state covers the whole session — the thread of a conversation that may involve dozens of exchanges over an hour.

Session state contains:
- Full message history for the session (compressed when it exceeds token thresholds)
- Session metadata: started at, last active, channel (web/mobile)
- Current task context: what the user is working on, what stage it is in
- Accumulated tool call results that may be referenced again later in the session

Session state is stored in Redis with the session ID as the key and a TTL that expires inactive sessions after a configurable period (2 hours of inactivity by default). Redis is the right store for session state because it is fast (sessions are read on every message), it handles TTL-based expiry natively, and sessions are naturally scoped to a single service instance or can be shared across instances with a shared Redis cluster.

```typescript
interface SessionState {
  sessionId: string;
  userId: string;
  startedAt: number;
  lastActiveAt: number;
  messages: CompressedMessageHistory;
  currentTask: TaskContext | null;
  accumulatedContext: Record<string, unknown>;
}
```

**History compression** is the critical session state operation. Conversation history grows without bound if not managed. When the message history exceeds a token threshold (typically 8,000 tokens), older turns are compressed: the oldest N turns are summarized by a lightweight model call into a few sentences, and that summary replaces the original turns. The summary preserves semantic content while dramatically reducing token count.

```typescript
async function compressHistoryIfNeeded(session: SessionState): Promise<SessionState> {
  const tokenCount = estimateTokens(session.messages.turns);

  if (tokenCount <= COMPRESSION_THRESHOLD) return session;

  const oldTurns = session.messages.turns.slice(0, TURNS_TO_COMPRESS);
  const summary = await summarizeAgent.run({
    turns: oldTurns,
    instruction: "Summarize these conversation turns, preserving key questions asked, answers given, passages referenced, and any conclusions reached.",
  });

  return {
    ...session,
    messages: {
      summary: (session.messages.summary ?? "") + "\n" + summary,
      turns: session.messages.turns.slice(TURNS_TO_COMPRESS),
    },
  };
}
```

The accumulated summary is prepended to the context window as a `<prior_context>` block before the recent turns. The model sees a compressed representation of older conversation, full representation of recent turns.

---

*Explore more articles in the [AI Engineering series](/categories/ai-engineering).*

---

### Layer 3: Task State

When a user triggers a long-running task — a study guide generation, a reading plan build, a multi-passage research query — that task runs asynchronously. Task state tracks where the task is in its lifecycle.

Task state is more durable than session state. It persists beyond the session that spawned it (the user can close the app and return to find their study guide complete) and must survive service restarts.

```typescript
interface TaskState {
  taskId: string;
  userId: string;
  sessionId: string;
  taskType: string;
  status: "pending" | "running" | "completed" | "failed";
  input: unknown;
  currentStage: string | null;
  stageOutputs: Record<string, unknown>; // output from each completed stage
  result: unknown | null;
  error: string | null;
  createdAt: Date;
  completedAt: Date | null;
  tokenUsage: { prompt: number; completion: number; cached: number };
}
```

`stageOutputs` is the key field for resilience. When a pipeline stage completes, its output is written to `stageOutputs` before the next stage begins. If the process crashes between stages, the task can be resumed from the last completed stage — the orchestrator reads `stageOutputs` to determine where to pick up.

This is the same durable checkpoint pattern from the backend engineering series, expressed here from the agent perspective. The agent does not hold its own state in memory — it reads its state from the database at the start of each stage and writes its output at the end.

### Layer 4: User State

Persistent state about the user that spans all sessions and tasks: their memory profile (covered in article 01), their preferences, their reading history, their study progress. User state does not expire — it is the long-term record of who this user is and what they have done on the platform.

User state is stored in Postgres. It is retrieved at session start and at the beginning of any task that needs it, then cached in Redis for the duration of the session.

The key design principle for user state: **the model never writes directly to it**. All user state updates go through application-layer functions with explicit semantics. The model can invoke a `save_study_note` tool, but the tool implementation writes to Postgres and the vector store — the model never has direct database access. This keeps user state consistent and auditable even when model outputs are imperfect.

### Layer 5: Pipeline State

When multiple agents collaborate in an orchestration pipeline, shared state flows between them. Pipeline state is the accumulated inputs, intermediate outputs, and metadata from a single pipeline execution.

Pipeline state is distinct from task state: task state tracks the pipeline's execution status and persistence; pipeline state is the data payload flowing through the pipeline.

```typescript
interface PipelineState {
  runId: string;
  taskId: string;
  passage: string;
  userMemory: UserMemorySnapshot;

  // Stage outputs — populated as pipeline progresses
  retrievedContext?: RetrievalResult[];
  outline?: StudyGuideOutline;
  draftSections?: Record<string, string>;
  critiqueResults?: CritiqueResult[];
  finalSections?: Record<string, string>;
}
```

Each agent receives the full pipeline state as input and returns only its own stage's output — not a modified copy of the full state. The orchestrator merges the stage output into the pipeline state before passing it forward. This keeps agent interfaces clean: each agent knows what it needs from the state and produces one well-defined output.

## State Transitions and Invariants

State management bugs come in two varieties: state that is stale (a past value being used when a newer one exists) and state that is incomplete (a required value missing when it should be present).

Stale state typically originates from caching without invalidation. Session state cached in Redis at session start becomes stale if the user's preferences change mid-session on another device. My convention: reload user preferences at the start of each message, not just at session start. The extra Redis read is cheap compared to the user confusion from acting on outdated preferences.

Incomplete state typically originates from async writes that have not yet completed. A task that reads its pipeline state immediately after writing a stage output may read a partially-committed state if writes are not synchronous. I use `await` on every state write before reading from that state in a subsequent step — no fire-and-forget writes in the critical path.

A useful invariant to enforce: **every state read that will influence model behavior should be verified before the model call, not assumed present.** If `pipeline.retrievedContext` is null when the writing agent tries to access it, the model produces a response without retrieved passages — a silent, hard-to-detect quality degradation.

```typescript
function assertPipelineState<K extends keyof PipelineState>(
  state: PipelineState,
  requiredFields: K[]
): void {
  for (const field of requiredFields) {
    if (state[field] == null) {
      throw new Error(`Pipeline state missing required field: ${field} in run ${state.runId}`);
    }
  }
}

// Before calling the writing agent
assertPipelineState(state, ["retrievedContext", "outline"]);
const draft = await writingAgent.run(state);
```

Hard failures from missing state are better than silent quality degradation from absent context.

## Context Window as State

The context window is not separate from state — it is the materialization of state into the form the model consumes. Constructing the context window for a model call is an explicit state assembly operation:

```typescript
function buildContextWindow(
  session: SessionState,
  userMemory: UserMemorySnapshot,
  pipelineState: PipelineState | null,
  systemPrompt: string
): Message[] {
  const messages: Message[] = [];

  // 1. System prompt
  messages.push({ role: "system", content: systemPrompt });

  // 2. User memory as a structured block
  if (userMemory.semanticFacts.length > 0) {
    messages.push({
      role: "user",
      content: formatMemoryBlock(userMemory),
    });
    messages.push({ role: "assistant", content: "I understand. I'll keep this context in mind." });
  }

  // 3. Session history summary (if compressed)
  if (session.messages.summary) {
    messages.push({
      role: "user",
      content: `<prior_context>${session.messages.summary}</prior_context>`,
    });
    messages.push({ role: "assistant", content: "Understood." });
  }

  // 4. Recent session turns
  messages.push(...session.messages.turns.map(turnToMessage));

  // 5. Pipeline state context (for multi-stage tasks)
  if (pipelineState) {
    messages.push({
      role: "user",
      content: formatPipelineContext(pipelineState),
    });
  }

  return messages;
}
```

The order within the context window is itself a state management decision. Memory comes early (giving the model the user's profile before the conversation), recent history comes later (for recency weighting), and current task context comes last (highest attention for the most immediately relevant information).

## What Goes Wrong Without Explicit State Management

The failure modes from poor state management are subtle and expensive to debug:

**Context amnesia** — the model "forgets" something it was told earlier in the session because the history was dropped or compressed too aggressively. The user notices when the model contradicts itself or asks for information it was already given.

**Tool result blindness** — the model calls a tool, the result is returned, but the result is not properly included in the next model call. The model proceeds without the retrieved information, sometimes filling the gap with hallucinated content that looks plausible.

**Stale personalization** — the model responds based on a memory snapshot that was current at session start but is now outdated. The user updated their preferred translation mid-session; the model keeps using the old one.

**Pipeline incoherence** — a later pipeline stage produces output that contradicts an earlier stage because it did not receive the earlier stage's output in its context. The study guide introduction says the passage is about grace; the conclusion says it is about judgment — because the writing agents for each section got different context windows.

**Orphaned task state** — a long-running task completes but the user's session has expired. The task result is never delivered. The user returns later, checks their tasks, and finds a completed study guide — but the notification was never sent because the session state that held the delivery target was gone.

Each of these is avoidable with explicit state management: clear ownership of each state type, explicit reads and writes, invariant checks before model calls, and session-independent delivery for task results. State management is not exciting work, but its absence is immediately visible in the quality of the user experience.

---

*[← Back to AI Engineering](/categories/ai-engineering)*
