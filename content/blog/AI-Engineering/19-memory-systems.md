---
title: "Memory Systems"
description: "Memory systems in AI pipelines for Bible study."
date: 2026-06-26
category: "ai-engineering"
tags:
  - ai-engineering
  - memory
  - bible-study
draft: false
cluster: "ai-engineering"
slug: memory-systems
author: Donavan Jones
---

# Memory Systems

The first article in this series introduced the four memory types on this platform — episodic, semantic, procedural, and working — and described the retrieval pipeline that assembles them into a user context before generation. That article was conceptual. This one is implementation-focused: how each memory type is extracted, stored, aged, and retrieved, what goes wrong in practice, and what makes memory for theological AI different from memory in general-purpose AI systems.

The central tension in memory system design is between completeness and precision. A memory system that stores everything is noisy — relevant facts are buried in the accumulated record of every session. A memory system that stores only what it is confident about is sparse — it misses nuance and gradual shifts that no single extraction event captures cleanly. The engineering work is finding the operating point between these extremes that serves actual users in actual study sessions.

*Part of the [AI Engineering series](/categories/ai-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every ai engineering deep-dive in this series."
destinationUrl: "/categories/ai-engineering"
---
::

## The Four Memory Layers

Each memory type stores different things and is retrieved under different conditions.

| Layer | What it stores | Storage | Retention |
|---|---|---|---|
| Working | Current session state, active task context | Redis | Session lifetime |
| Episodic | Session summaries, specific exchanges | Postgres + Qdrant | Configurable (default: permanent) |
| Semantic | Distilled user knowledge, theological positions | Postgres + Qdrant | Permanent with decay weighting |
| Procedural | Study patterns, preferences, interaction habits | Postgres | Permanent |

These are not redundant — each layer retrieves under different conditions with different latency requirements. Working memory is accessed on every turn (Redis, <5ms). Episodic memory is retrieved when a topic echoes a prior session (vector search, ~100ms). Semantic memory is retrieved when the question touches on something the user has studied in depth (vector search + keyword, ~120ms). Procedural memory is loaded at session start and rarely queried mid-session (Postgres, ~30ms).

## Working Memory

Working memory holds the state of the current session: the conversation history, the active task context (if the user is in the middle of a study guide or word study), and any temporary flags set during this session (translation preference override, depth-level adjustment).

```typescript
interface WorkingMemory {
  sessionId: string;
  userId: string;
  startedAt: string;
  conversationHistory: Turn[];
  activeTask: TaskContext | null;
  sessionFlags: {
    translationOverride?: string;
    depthOverride?: "deep" | "survey" | "devotional";
    topicsRaisedThisSession: string[];
    passagesEngaged: string[];
  };
  tokenCount: number;
}
```

Working memory is stored in Redis with a TTL of 24 hours after the last activity — long enough to survive a browser close and return, short enough to not persist indefinitely. When the TTL expires, the session is closed and its content is processed into the longer-term memory layers via the extraction pipeline.

The conversation history in working memory is not the full verbatim transcript. After each turn, the history is checked against a token budget:

```typescript
const WORKING_MEMORY_HISTORY_BUDGET = 12_000; // tokens

function trimHistory(history: Turn[], budget: number): Turn[] {
  let total = 0;
  const trimmed: Turn[] = [];

  // Walk backwards — keep the most recent turns first
  for (let i = history.length - 1; i >= 0; i--) {
    const turnTokens = countTokens(history[i].content);
    if (total + turnTokens > budget) break;
    trimmed.unshift(history[i]);
    total += turnTokens;
  }

  // Always keep at least the last 3 turns regardless of token count
  if (trimmed.length < 3 && history.length >= 3) {
    return history.slice(-3);
  }

  return trimmed;
}
```

Dropped turns are not discarded — they are fed into the episodic memory extraction pipeline before removal. The session history in working memory is always the recent tail; the older material is preserved in episodic form.

## Episodic Memory

Episodic memory stores what happened in prior sessions — not the verbatim transcript, but meaningful summaries of what was studied, what was asked, and what was understood.

### Extraction

At session close (or when a turn is dropped from working memory), an extraction call converts raw conversation content into episodic records:

```typescript
async function extractEpisodicMemory(
  turns: Turn[],
  userId: string,
  sessionId: string
): Promise<EpisodicRecord[]> {
  const extraction = await fastModel.complete({
    prompt: `Summarize the Bible study content from these conversation turns.

For each distinct topic or passage engaged, create a brief record including:
- The passage or topic studied
- The key questions explored
- The conclusions reached (if any)
- Any unresolved questions raised

Format as JSON array of objects with fields:
{ topic, passageRefs, questionsExplored, conclusions, openQuestions }

Turns:
${formatTurns(turns)}`,
    maxTokens: 400,
  });

  const records = parseEpisodicExtraction(extraction);

  return records.map(r => ({
    ...r,
    userId,
    sessionId,
    date: new Date().toISOString(),
    embedding: null, // filled in by the embedding pipeline
  }));
}
```

The extraction runs asynchronously — the user is not waiting for it. Records are written to Postgres, then queued for embedding; the Qdrant vector index is updated within a few seconds.

### Storage

```sql
CREATE TABLE episodic_memory (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id),
  session_id  UUID NOT NULL,
  date        TIMESTAMPTZ NOT NULL DEFAULT now(),
  topic       TEXT NOT NULL,
  passage_refs TEXT[],
  questions_explored TEXT[],
  conclusions TEXT,
  open_questions TEXT[],
  embedding   VECTOR(1536),
  access_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMPTZ
);

CREATE INDEX idx_episodic_user_date ON episodic_memory (user_id, date DESC);
CREATE INDEX idx_episodic_passage_refs ON episodic_memory USING GIN (passage_refs);
CREATE INDEX idx_episodic_embedding ON episodic_memory USING hnsw (embedding vector_cosine_ops);
```

The `passage_refs` GIN index allows fast lookup of all episodic records related to a specific passage. When the user asks about Romans 8:28, the retrieval pipeline runs both vector similarity search (for semantically related episodes) and the passage index lookup (for episodes that explicitly engaged Romans 8:28). Both paths run in parallel; results are merged.

### Retrieval

Episodic memory is retrieved when the current query matches prior episodes semantically or by passage reference:

```typescript
async function retrieveEpisodicContext(
  query: string,
  queryEmbedding: number[],
  explicitRefs: string[],
  userId: string,
  limit = 3
): Promise<EpisodicRecord[]> {
  const [semantic, explicit] = await Promise.all([
    qdrant.search("episodic_memory", {
      vector: queryEmbedding,
      filter: { must: [{ key: "user_id", match: { value: userId } }] },
      limit,
      score_threshold: 0.72,
    }),
    explicitRefs.length > 0
      ? db.query<EpisodicRecord>(
          `SELECT * FROM episodic_memory
           WHERE user_id = $1
             AND passage_refs && $2
           ORDER BY date DESC
           LIMIT $3`,
          [userId, explicitRefs, limit]
        )
      : Promise.resolve([]),
  ]);

  return mergeDeduplicatedBy("id", [
    ...semantic.map(r => r.payload as EpisodicRecord),
    ...explicit.rows,
  ]).slice(0, limit);
}
```

The score threshold of 0.72 is deliberately high for episodic retrieval. The purpose is to surface prior sessions that are genuinely relevant to the current question — not everything adjacent. A lower threshold produces episodic context that distracts the model with loosely related history; a higher threshold produces the focused prior-session grounding that actually helps.

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

## Semantic Memory

Semantic memory is the distillation layer. Where episodic memory stores what happened (session by session), semantic memory stores what the user knows — the accumulated understanding that has been synthesized from multiple sessions of study.

### What Gets Stored

Not every piece of episodic information graduates to semantic memory. The extraction criteria are intentionally selective:

- **Repeated engagement**: a topic the user has visited in three or more sessions gets a semantic record
- **Explicit conclusion**: a session where the user reached a stated position or expressed deep understanding
- **Stored note**: passages the user annotated in their study notes (strong signal of significance)
- **Position formation**: any session where the theological position memory (article 18) was updated

```typescript
async function extractSemanticMemory(
  userId: string
): Promise<void> {
  // Run periodically (weekly) to process accumulated episodic records
  const candidates = await db.query(`
    SELECT topic, array_agg(conclusions) AS all_conclusions,
           count(*) AS session_count,
           max(date) AS last_engaged
    FROM episodic_memory
    WHERE user_id = $1
      AND conclusions IS NOT NULL
    GROUP BY topic
    HAVING count(*) >= 2
       AND max(date) > now() - interval '90 days'
  `, [userId]);

  for (const candidate of candidates.rows) {
    const existing = await getSemanticRecord(userId, candidate.topic);
    await upsertSemanticRecord(userId, candidate, existing);
  }
}
```

### Synthesis vs Accumulation

The key property of semantic memory is that it synthesizes rather than accumulates. Multiple episodic records on justification do not produce one semantic record that concatenates all prior session summaries — they produce one semantic record that distills the essential understanding:

```typescript
async function synthesizeSemanticRecord(
  topic: string,
  episodicRecords: EpisodicRecord[],
  existing: SemanticRecord | null
): Promise<SemanticRecord> {
  const synthesis = await fastModel.complete({
    prompt: `Based on these study sessions about "${topic}", write a concise 
summary of this user's current understanding of the topic.

Focus on:
- The core understanding they have reached
- The passages they find most significant
- Any theological position they have settled on or are working toward
- Questions that remain open for them

This summary will be used to give future study sessions context about 
what this user already knows. Be specific, not generic.

Prior sessions:
${episodicRecords.map(r =>
  `Session ${r.date}: ${r.conclusions || "no conclusions noted"}`
).join("\n")}

${existing ? `Previous summary to update: ${existing.summary}` : ""}`,
    maxTokens: 200,
  });

  return {
    userId: episodicRecords[0].userId,
    topic,
    summary: synthesis,
    passageRefs: unique(episodicRecords.flatMap(r => r.passageRefs ?? [])),
    sessionCount: episodicRecords.length,
    lastUpdated: new Date().toISOString(),
    embedding: await embeddingService.embed(synthesis),
  };
}
```

The synthesis model call produces a paragraph-length summary that is specific to this user's understanding — not a generic description of what the topic is, but what this user has come to understand about it. "You have worked through justification across five sessions, arriving at a Reformed reading of Romans 3-4 while leaving open the question of how James 2 relates to it. The New Perspective on Paul is on your list to engage next."

### Decay Weighting

Semantic memory records are not all equally current. Understanding from three years ago may have been superseded by more recent study. Rather than expiring old records (which discards genuine long-term knowledge), decay weighting reduces the effective weight of older records in retrieval:

```typescript
function computeDecayWeight(lastUpdated: string): number {
  const daysSince = (Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24);
  const halfLifeDays = 180; // semantic memory half-life: 6 months
  return Math.pow(0.5, daysSince / halfLifeDays);
}
```

A semantic record updated six months ago has half the retrieval weight of one updated today. After 18 months without update, a record is at 12.5% weight — it surfaces only when nothing more recent is relevant. The half-life is configurable per user; heavy users who study intensively want faster decay (newer understanding replacing older); casual users benefit from longer retention.

## Procedural Memory

Procedural memory stores how the user likes to study — preferences, habits, and patterns that make the system feel calibrated to them rather than generic.

```typescript
interface ProceduralMemory {
  userId: string;

  // Explicit preferences
  preferredTranslation: string;         // "ESV"
  depthPreference: "deep" | "survey" | "devotional";
  preferOriginalLanguage: boolean;
  wantsHistoricalContext: boolean;
  prefersStructuredStudy: boolean;      // outlines vs. conversational

  // Inferred patterns
  typicalSessionLength: number;         // minutes, inferred from session history
  mostStudiedBooks: string[];           // ["Romans", "Psalms", "John"]
  studyTimeOfDay: "morning" | "afternoon" | "evening" | "variable";
  engagesWithCommentary: boolean;       // does this user read the commentary citations?
  asksFollowUpQuestions: boolean;       // tendency to go deep vs. move on

  // Theological profile
  primaryTradition: TheologicalTradition | null;
  sensitiveTopics: string[];
  lastUpdated: string;
}
```

Procedural memory is loaded once at session start and injected into the system prompt as the user profile section. It does not require retrieval — it is small (under 1,000 tokens) and always relevant.

Updates to procedural memory come from two sources: explicit user preference changes (changing translation preference in settings updates the record immediately) and implicit behavioral signals processed in the weekly background job:

```typescript
async function updateProceduralMemory(userId: string): Promise<void> {
  const recentSessions = await getRecentSessions(userId, 30); // last 30 days

  const patterns = analyzeStudyPatterns(recentSessions);

  await db.query(`
    UPDATE procedural_memory
    SET
      most_studied_books = $2,
      typical_session_length = $3,
      engages_with_commentary = $4,
      asks_follow_up_questions = $5,
      last_updated = now()
    WHERE user_id = $1
  `, [
    userId,
    patterns.mostStudiedBooks,
    patterns.typicalSessionLengthMinutes,
    patterns.commentaryEngagementRate > 0.4,
    patterns.followUpQuestionRate > 0.5,
  ]);
}
```

## Memory Retrieval at Query Time

At query time, the memory assembly runs in parallel with retrieval as described in article 15. The assembled memory context has a token budget (20% of the context window) and a priority ordering:

```typescript
function assembleMemoryContext(
  working: WorkingMemory,
  episodic: EpisodicRecord[],
  semantic: SemanticRecord[],
  procedural: ProceduralMemory,
  budget: number
): string {
  // Procedural is always included — it's the baseline user profile
  const proceduralTokens = countTokens(formatProcedural(procedural));
  let remaining = budget - proceduralTokens;

  // Semantic next — distilled understanding is more valuable than raw episodes
  const semanticText = formatSemantic(semantic);
  const semanticFit = truncateToTokenBudget(semanticText, remaining * 0.6);
  remaining -= countTokens(semanticFit);

  // Episodic last — specific session history only if budget allows
  const episodicText = formatEpisodic(episodic);
  const episodicFit = truncateToTokenBudget(episodicText, remaining);

  return [
    "USER PROFILE\n" + formatProcedural(procedural),
    semanticFit ? "PRIOR STUDY CONTEXT\n" + semanticFit : "",
    episodicFit ? "RECENT SESSIONS\n" + episodicFit : "",
  ].filter(Boolean).join("\n\n---\n\n");
}
```

The priority order — procedural first, semantic second, episodic third — reflects what is most reliably useful. Procedural memory shapes every response. Semantic memory shapes responses on topics the user knows well. Episodic memory provides specific session continuity; if the budget is tight, this is the first to be trimmed.

::CtaTryApp
---
buttonText: "Try The Live AI App"
supportingCopy: "Try the RAG-powered Bible study app these patterns were built for."
destinationUrl: "https://bibleverse.donavanjones.com/register"
---
::

## Theological Memory: What Makes This Domain Different

Generic memory systems for AI assistants focus on user preferences and conversation continuity. Theological memory has additional requirements that generic designs do not address:

**Position memory with supporting evidence.** A general-purpose assistant might remember "the user prefers concise answers." A theological assistant needs to remember "the user has concluded that Romans 5:18 uses 'all' in a federally representative sense, based on the Adam-Christ parallel in vv. 15-17." The position without the evidence is less useful than the position with it — and the evidence determines how the position should be updated when challenged.

**Tradition-aware memory.** The same study session means different things depending on the user's tradition. A user engaging with N.T. Wright's *Justification* is asking different questions than a traditional Reformed reader — the memory extraction needs to capture not just what they studied but from within what interpretive framework.

**Open question tracking.** Bible study generates questions that are not resolved in a single session. Tracking open questions — "how does James 2 relate to Paul on justification?", "what does the author of Hebrews mean by falling away?" — and surfacing them when relevant passages appear gives the system the ability to say "you raised this question six weeks ago — the passage you're reading now is where most commentators address it."

```typescript
interface OpenQuestion {
  question: string;
  raisedDate: string;
  relatedPassages: string[];
  attempts: number;         // how many times the user has returned to it
  status: "open" | "tentatively resolved" | "deferred";
}
```

Open questions are surfaced proactively when a retrieval result is directly relevant:

```typescript
function checkOpenQuestionRelevance(
  openQuestions: OpenQuestion[],
  retrievedPassages: string[]
): OpenQuestion[] {
  return openQuestions.filter(q =>
    q.status === "open" &&
    q.relatedPassages.some(p => retrievedPassages.includes(p))
  );
}
```

When relevant open questions are found, they are injected into the context with a framing note: "This session is touching on a question you raised previously and haven't fully resolved. You might want to address it here."

## Memory Privacy and Control

Users have complete control over their memory data. The platform exposes four operations:

**View**: users can inspect all stored memories — episodic records, semantic summaries, procedural preferences, open questions — through a memory panel in the interface.

**Correct**: users can edit any stored memory. If a semantic summary misrepresents their understanding, they can correct it in place. The corrected summary is immediately re-embedded for accurate retrieval.

**Delete**: users can delete individual memories or clear all memory for a topic or session. Deletion cascades through Postgres (record removed) and Qdrant (embedding deleted) within the same transaction.

**Export**: all memory data is exportable as JSON in a structured format that other systems could import. This is not just a legal requirement — it is a promise that the platform does not hold user knowledge hostage.

The privacy architecture ensures that memory data is never used for training or surfaced to other users. Each user's memory is queryable only by that user's session. The user ID is part of every Qdrant filter — there is no code path that retrieves memory without an explicit user ID bound.

## Memory System Evaluation

Memory system quality is hard to evaluate directly because the benefit of memory is contextual — it matters for users who have study history, not for new users. The evaluation metrics:

**Retrieval precision**: for a set of annotated (query, prior session) pairs, does episodic retrieval surface the correct prior sessions? Measured as precision@3.

**Semantic synthesis quality**: for a set of users with significant study history, does the semantic summary accurately represent their stated understanding? Evaluated by showing users their own semantic summaries and asking whether they recognize them as accurate.

**Procedural preference accuracy**: does the system's procedural model predict user behavior (translation choice, depth preference, commentary engagement)? Measured against session logs.

**Open question resolution rate**: over time, are open questions being resolved or deferred indefinitely? A system where all questions accumulate without resolution has a retrieval or surfacing problem.

These metrics are evaluated quarterly against a cohort of active users. The evaluation reveals which memory layer is weakest — usually episodic extraction quality, because the extraction model must summarize noisy conversation content into structured records under significant ambiguity. When episodic precision is low, the extraction prompt is revised and re-evaluated against the annotated test set.

Memory is the layer that transforms the platform from a capable theological tool into something closer to a study companion. The capability to answer questions well is table stakes. The ability to remember what you have studied, where you have arrived, and what questions you are still working through — that is what makes the tool feel like it knows you.

Building it well is months of unglamorous work: extraction pipelines, schema design, retrieval tuning, privacy infrastructure, evaluation. None of it is visible to the user directly. But users who study with a system that has good memory versus one that does not feel the difference immediately.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The AI Starter Kit"
  supportingCopy: "Get the Self-Hosted AI Starter Kit — Ollama setup, RAG architecture diagrams, embedding pipeline templates, and FastAPI examples ($29)."
  destinationUrl: "/products/self-hosted-ai-starter-kit"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Moderation"
  supportingCopy: "Continue with \"Moderation\" for the next piece of this system."
  destinationUrl: "/blog/ai-engineering/20-moderation"
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
  - label: "Episodic Memory — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Episodic_memory"
    type: "wikipedia"
    description: "Cognitive science definition of episodic memory — the model for event-based storage that the implementation tracks at the database level."
  - label: "Semantic Memory — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Semantic_memory"
    type: "wikipedia"
    description: "According to this overview, semantic memory stores stable facts about the world — the cognitive model for the user profile extraction pipeline."
  - label: "MemGPT: Towards LLMs as Operating Systems (Packer et al., 2023)"
    url: "https://doi.org/10.48550/arXiv.2310.08560"
    type: "doi"
    description: "Research on managing LLM memory using OS-inspired paging — the most direct technical precedent for hierarchical memory tiers in production AI agents."
  - label: "Generative Agents: Interactive Simulacra of Human Behavior (Park et al., 2023)"
    url: "https://doi.org/10.48550/arXiv.2304.03442"
    type: "doi"
    description: "Stanford research on agents with episodic memory and reflection pipelines — the architecture that the memory formation and extraction design is modeled on."
---
::

---

*[← Back to AI Engineering](/categories/ai-engineering)*
