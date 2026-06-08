---
title: "Persistent Memory Systems"
description: "Overview of persistent memory systems in local AI agents."
date: 2026-04-20
category: "ai-engineering"
tags:
  - ai-engineering
  - memory
  - agents
draft: false
slug: persistent-memory-systems
author: Donavan Jones
---

# Persistent Memory Systems

Every conversation with an LLM starts from zero. The model has no memory of who you are, what you have studied before, what questions you have asked, or what you have already told it. Each session is a blank slate. For a simple chatbot, this is fine. For a Bible study platform built around continuity — a tool meant to accompany someone's study over months and years — it is a fundamental design problem.

Persistent memory systems are how AI agents overcome this limitation. They give agents the ability to remember things across sessions: who the user is, what they have studied, what they have struggled with, what they already know. Done well, memory transforms a stateless model into something that feels like a knowledgeable companion that actually pays attention.

This article covers the architecture of persistent memory in AI agent systems — the different types of memory, how each is stored and retrieved, how memory integrates into inference, and the tradeoffs involved. The platform context throughout is a Bible study application where memory makes the difference between a generic AI assistant and one that knows this user's faith journey.

## The Core Problem: Context Window Limits

A language model processes everything it knows about the current situation from its context window — the text passed in with each request. Context windows have grown large (100K–1M tokens in recent models), but they are still finite, and filling them entirely on every request is expensive.

More importantly, not all history is equally relevant. A user who has been studying Paul's letters for six months has generated thousands of interactions. Dumping all of it into the context window would be expensive, slow, and counterproductive — most of it would be irrelevant to the current question, diluting the signal from the parts that matter.

Persistent memory solves this by storing history externally and retrieving only the relevant portions for each request. The context window contains a curated summary of what is most relevant right now, not a raw transcript of everything that has ever happened.

## Four Types of Memory

AI memory systems are most clearly understood through four distinct types, each serving a different purpose:

### 1. Episodic Memory

Episodic memory stores specific past events: what happened, when, and in what context. In a study application, episodic memory answers questions like: "What did this user ask about last Tuesday?" and "What passages has this user engaged with most deeply?"

Episodic memories are typically stored as timestamped records with enough metadata to make them retrievable by time, topic, or entity. They are the raw material that other memory types are built from.

Examples on this platform:
- User asked about the meaning of "propitiation" in Romans 3:25 (April 12)
- User completed the Sermon on the Mount reading plan (March 30)
- User expressed confusion about predestination vs free will (April 5)
- User saved a note about the Greek word *charis* and its connection to grace

### 2. Semantic Memory

Semantic memory stores general knowledge about the user that has been extracted or inferred from episodic events — stable facts that do not change with each interaction. Where episodic memory says "on April 5 the user asked about predestination," semantic memory says "the user is working through questions about Calvinist theology."

Semantic memories are compressed representations. They are updated when episodic patterns warrant it, not on every interaction. A user who asks about grace five times across three weeks has that pattern compressed into a semantic memory: "this user is deeply engaged with the concept of grace; background in evangelical tradition; familiar with standard definitions but exploring deeper nuance."

This is the memory type most responsible for making the agent feel like it actually knows the user. When the system can say "given what I know about your theological background, here is how I would frame this…" — that is semantic memory at work.

### 3. Procedural Memory

Procedural memory stores learned behaviors and preferences — how the user likes to interact, what kinds of responses work well for them, what formats they prefer.

Examples:
- User prefers concise answers with scripture references rather than long explanations
- User responds well to historical context about biblical settings
- User gets confused by technical theological jargon without plain-language explanation
- User likes to be given follow-up questions to deepen their study

Procedural memories are behavioral rather than factual. They shape how the agent responds rather than what it says. An agent without procedural memory gives the same style of response to every user; with it, responses adapt to the individual.

### 4. Working Memory

Working memory is the active context of the current session — what has been said in this conversation, what has been established, what is being worked through right now. It is not persistent in the same way as the other three types; it lives for the duration of the session and may be summarized and compressed into episodic memory at the end.

Working memory is what fills the conversation history portion of the context window. Managing its size — knowing when to summarize rather than carry full history forward — is one of the key implementation challenges.

## Storage Architecture

Each memory type has different storage requirements:

| Memory Type | Storage | Access Pattern | Retention |
|---|---|---|---|
| Episodic | Postgres (append-only) | Time-range or entity lookup | 12–24 months |
| Semantic | Postgres + Vector store | Semantic similarity search | Indefinite, versioned |
| Procedural | Postgres (key-value) | Direct lookup by user + preference key | Indefinite |
| Working | Redis | Sequential (LIFO) | Session lifetime |

**Episodic storage** is append-only. New events are inserted; old events are never modified. This gives a reliable audit trail and allows re-deriving semantic memories if the extraction logic changes. Events older than 12–24 months are archived rather than deleted — rarely accessed but retained for long-term pattern analysis.

**Semantic storage** uses both Postgres (for structured retrieval by topic, entity, or date) and a vector store (for similarity-based retrieval when the semantic match is fuzzy). Storing "the user is working through Calvinist theology" alongside its embedding vector lets the agent retrieve it whether the current query mentions "Calvinism" or "predestination" or "election" or "sovereign grace" — all semantically close.

**Procedural storage** is a simple key-value structure. Keys like `response_style`, `explanation_depth`, `preferred_translation` map to learned values. These are updated slowly through explicit feedback and inferred behavioral patterns.

**Working memory** lives in Redis as a session-scoped list. The current session's conversation turns are pushed to the list as they happen. When the list exceeds a token threshold, the oldest turns are summarized and the summary replaces them, keeping the list within bounds.

## Memory Formation: How Episodic Becomes Semantic

Raw episodic events do not automatically become useful semantic memories. The compression step — extracting durable knowledge from specific events — is an explicit pipeline.

After each session (or periodically for long-running sessions), an extraction pass runs over recent episodic events:

```
Recent episodic events →
  LLM extraction prompt →
    Candidate semantic memories →
      Conflict resolution against existing memories →
        Updated semantic memory store
```

The extraction prompt is something like:

```
Given the following recent interactions with this user, identify any durable facts 
about their theological background, study interests, knowledge gaps, or learning style 
that should be added to or updated in their persistent profile. 

Focus on stable patterns rather than one-time events. Only extract what you are 
confident is genuinely characteristic of this user based on multiple signals.

Recent interactions:
[episodic events]

Existing profile:
[current semantic memories]

Return a JSON list of memory updates with fields: type, content, confidence, supersedes.
```

The conflict resolution step handles updates: if the user's response to a new study topic contradicts an old semantic memory about their knowledge level, the old memory is superseded rather than duplicated. Memory versioning preserves the history of what was believed and when, which is useful for debugging and for understanding how the user's knowledge has evolved.

## Memory Retrieval at Inference Time

When a user sends a message, the memory system assembles a curated memory context to inject into the prompt. This is not a dump of everything — it is a relevance-ranked selection.

The retrieval pipeline:

```
1. Embed the user's current message
2. Vector search against semantic memories → top-5 most relevant facts
3. Keyword search against episodic events → recent events on this topic
4. Load procedural preferences → always include (small, structured)
5. Load working memory → recent session turns, summarized if needed
6. Assemble memory context with relevance ranking and token budget
```

Steps 1–4 run in parallel. Step 5 uses the current session's Redis list. Step 6 composes the final memory block that enters the prompt:

```
[Memory Context]
About this user:
- Studying Paul's epistles; currently focused on Romans (semantic)
- Has strong foundation in evangelical theology; exploring Reformed perspectives (semantic)
- Prefers concise responses with direct scripture citations (procedural)
- Gets confused by technical terms without plain-language definition (procedural)

Recent relevant history:
- Last week asked about the meaning of "justified" in Romans 3:24 (episodic)
- Expressed interest in understanding Greek word roots (episodic)

Current session:
- User: "Can you explain what Paul means by 'the righteousness of God' in Romans?"
```

This memory context replaces what would otherwise be a cold start. The model now knows who it is talking to before the first token of response is generated.

## Memory Decay and Relevance Weighting

Not all memories should carry equal weight forever. A user's theological questions from two years ago may no longer reflect where they are. Study interests shift. Knowledge grows. An agent that relies too heavily on old memories gives responses calibrated for who the user was, not who they are.

I implement soft decay on episodic memories using a recency weight:

```
weight = base_relevance × exp(-decay_rate × days_since_event)
```

Where `decay_rate` is tuned per memory type: fast for specific questions (7-day half-life), slow for study patterns (90-day half-life), near-zero for explicitly confirmed facts ("user confirmed they have read the whole Bible").

Semantic memories derived from recent episodic events score higher than those derived from old ones. When retrieval scores two semantic memories similarly for relevance, recency breaks the tie.

The decay is not deletion — old memories remain in storage. They simply rank lower in retrieval until a new episodic event refreshes their relevance (a user who returns to a topic they studied 18 months ago boosts those old memories back to prominence).

## Privacy and Memory Control

Memory systems raise real privacy concerns. A system that remembers everything indefinitely, without user control, is surveillance infrastructure wearing the disguise of personalization.

I give users explicit control over their memory:

**View**: users can see all semantic memories the system holds about them — the profile as the agent sees it.

**Correct**: users can edit or delete specific memories. If the system inferred something wrong ("user is unfamiliar with the book of Job"), the user can correct it.

**Reset**: users can clear all memories for a fresh start. This is a destructive action with a confirmation step; the data is soft-deleted and retained for 30 days before permanent removal.

**Export**: users can export all their memories and episodic history as JSON. This is their data.

Memory transparency is not just ethically correct — it builds trust. Users who understand what the system knows about them are more likely to engage deeply with a tool that can genuinely help them.

## What Good Memory Enables

The difference between an AI study tool with and without persistent memory is the difference between a stranger and a teacher who knows you.

Without memory: "Romans 8:28 means that God works all circumstances, even difficult ones, toward good for those who love him."

With memory: "Romans 8:28 builds directly on the tension you were exploring last week — Paul has just finished describing the inner conflict of living between the Spirit and the flesh in chapter 7. The 'all things' here answers the question you asked about suffering: it is not just comfort, it is a claim about the arc of the whole Christian life. Given your interest in the Greek, the word for 'work together' is *synergei* — it appears only here in Paul and carries the sense of cooperative action, which connects to the Spirit interceding for us in the verses just before."

The second response is only possible because the system knows this user: their current study context, their prior questions, their interest in Greek. It is not a better generic answer — it is a specifically appropriate answer for this person at this point in their study.

That specificity is what persistent memory makes possible. It is what makes an AI tool feel less like a search engine and more like a companion who has been paying attention.
