---
title: "Tool-Based Reasoning"
description: "Tool-based reasoning approaches in AI agent frameworks."
date: 2026-05-06
category: "ai-engineering"
tags:
  - ai-engineering
  - tools
  - frameworks
draft: false
slug: tool-based-reasoning
author: Donavan Jones
---

# Tool-Based Reasoning

Article 03 covered the mechanics of tool calling — the API, tool definitions, the agentic loop. This article covers the reasoning dimension: how models actually use tools to think, the patterns that emerge when a model has access to external information, why tool-based reasoning produces better answers than pure in-context reasoning for knowledge-intensive tasks, and how to structure tools and prompts to elicit the reasoning behavior you want.

The distinction matters. A model that calls tools mechanically — retrieving exactly what was asked for, nothing more — is less valuable than a model that uses tools as part of an active reasoning process: forming a hypothesis, retrieving evidence, evaluating it, refining the hypothesis, retrieving more targeted evidence, and synthesizing a grounded answer. The difference between these behaviors is partly model capability, but it is significantly shaped by how tools are defined and how reasoning is prompted.

*Part of the [AI Engineering series](/categories/ai-engineering).*

## Why Pure In-Context Reasoning Fails on Knowledge Tasks

A model without tools reasons purely from its training data and the current context window. For general knowledge this is often adequate. For specific, precise, or time-sensitive knowledge it breaks down.

For a Bible study platform, the failure modes are concrete:

**Verse misquotation.** A model asked for the exact text of Romans 8:28 from the ESV will often produce a paraphrase or a blend of translations rather than the precise wording. Training data contains many versions of famous verses; the model has no way to produce the exact canonical text without retrieving it.

**Passage confusion.** A model asked whether Romans 5 or Romans 8 discusses the Spirit more extensively will frequently confuse the two, misattribute content, or produce confident summaries that mix material from multiple chapters.

**Cross-reference gaps.** A model asked what passages cross-reference a specific verse may list well-known ones from training data and miss less prominent ones that are genuinely in the cross-reference database.

**Lexical inaccuracy.** A model asked about the Greek word for "love" in 1 Corinthians 13 knows *agape* but may conflate its semantic range with *philia* or misstate specific Strong's definitions.

In each case, the model is not lying — it is producing its best approximation from imperfect training signal. The fix is not a better model; it is giving the model access to authoritative sources through tools. A model that can retrieve the exact ESV text, check the cross-reference database, and look up the Strong's lexicon entry will be accurate on these tasks regardless of what its training data says.

## The ReAct Pattern

ReAct (Reasoning + Acting) is the foundational pattern for tool-based reasoning. Named in a 2022 paper, it describes a reasoning loop where the model alternates between reasoning steps (thinking about what it knows and needs) and action steps (tool calls to gather information).

The pattern produces reasoning traces that look like:

```
Thought: The user is asking about Paul's use of the word "righteousness" in Romans.
I should first retrieve the specific passages in Romans where Paul discusses righteousness,
then check the Greek term being used and its lexical range.

Action: search_passages(query="righteousness Romans Paul", book="Romans")

Observation: [Romans 1:17, Romans 3:21-22, Romans 4:3, Romans 5:17, Romans 10:3-4]
Key text: "For in it the righteousness of God is revealed..." (Rom 1:17)

Thought: The core passages are Romans 1:17, 3:21-22, and 10:3-4. I should look up
the Greek term for "righteousness" to understand what Paul means.

Action: lookup_lexicon(strongs="G1343")  # dikaiosynē

Observation: G1343 dikaiosynē — righteousness, justice; the state of being in right
relationship; used in LXX for Hebrew tsedaqah; Paul uses it in two senses:
(1) God's own righteousness/covenant faithfulness, (2) righteousness imputed to believers

Thought: This distinction is exactly what the user needs. I can now explain Paul's
argument using the actual passages and the precise semantic content of dikaiosynē.

Answer: [grounded explanation using retrieved content]
```

Each Thought step reasons about what is needed. Each Action step retrieves it. Each Observation incorporates what was learned. The final answer is built from retrieved evidence, not from training data approximation.

Modern models (Claude, GPT-4) implement ReAct-style reasoning natively through the tool calling API — the Thought steps are the model's internal reasoning before emitting a tool call, and the Observation is the tool result returned. You do not need to explicitly prompt for ReAct format; the capability is built into the model's tool-use training.

## Reasoning Depth: Shallow vs Deep Tool Use

Not all tool-based reasoning is equally thorough. The same model, given the same tools, will reason more or less deeply depending on the task framing and system prompt.

**Shallow tool use**: the model calls the most obvious tool with the most obvious argument, gets a result, and answers. Fast, adequate for simple factual queries.

```
User: What is the shortest verse in the Bible?
→ search_passages(query="shortest verse") → John 11:35 "Jesus wept."
→ "The shortest verse in the Bible is John 11:35: 'Jesus wept.'"
```

**Deep tool use**: the model plans a sequence of retrievals, builds understanding incrementally, evaluates what it finds against what it expected, and adjusts its approach.

```
User: Does Paul's understanding of grace in his early letters differ from his later ones?

Thought: This requires comparing Paul's grace theology across time. I need to identify
which letters are considered early vs late, then retrieve key grace passages from each
period and compare them.

Action: search_passages(query="grace Paul early letters", books=["Galatians", "1 Thessalonians"])
Observation: [Galatians 1:6, 1:15, 2:21, 5:4 — grace language tied to Judaizer controversy]

Thought: Galatians uses grace primarily in contrast to works-of-law. Let me check
a later letter.

Action: search_passages(query="grace Paul prison epistles", books=["Ephesians", "Philippians"])
Observation: [Ephesians 2:8, 3:2, 3:7-8 — grace as cosmic scope, stewardship, mystery]

Thought: There's a possible development from grace-as-justification to grace-as-cosmic
gift. I should check the lexical usage across these...
```

The same tool set produces qualitatively different answers depending on reasoning depth. Deep tool use is elicited by:

1. **Task complexity**: questions that genuinely require multiple pieces of information naturally produce more tool calls
2. **System prompt framing**: explicitly instructing the model to "reason step by step before calling tools" and "verify claims with retrieval" increases depth
3. **Tool description quality**: tools described as enabling investigation ("use to explore the range of evidence") produce more thorough use than tools described as lookup operations ("use to retrieve X")

## Structuring Tools to Encourage Investigation

Tool definitions shape reasoning behavior, not just execution behavior. A tool described as a lookup operation invites single-call use. A tool described as an investigation capability invites iterative use.

Compare these two descriptions for the same semantic search tool:

**Lookup framing:**
```
"description": "Search Bible passages by topic. Returns relevant verses."
```

**Investigation framing:**
```
"description": "Search Bible passages semantically. Use iteratively to explore a topic
from multiple angles — search broadly first to identify relevant territory, then search
specifically to gather the passages that best support your reasoning. A single search
rarely captures the full picture; plan on 2-4 searches for complex topics."
```

The second description explicitly invites multiple calls and frames them as part of a reasoning process, not a single lookup. Models follow this framing — they are trained to follow the intent of tool descriptions.

Similarly, return value framing influences how results are incorporated into reasoning:

**Bare return value:**
```json
["Romans 5:1", "Romans 8:1", "Galatians 2:16"]
```

**Reasoning-enriched return value:**
```json
{
  "results": [...],
  "note": "These 8 results represent 3 distinct theological clusters. Consider searching
           each cluster separately for deeper coverage.",
  "suggested_followup": "search_passages(query='justification by faith alone Romans')"
}
```

The enriched return value actively guides the model's next reasoning step. The model reads it and often follows the suggestion — not because it is forced to, but because the note makes the follow-up search obviously the right next action.

---

*Explore more articles in the [AI Engineering series](/categories/ai-engineering).*

---

## Chain-of-Thought Before Tool Calls

Explicit reasoning before tool calls produces better tool call arguments. A model that thinks through what it needs before invoking retrieval constructs more targeted queries than one that calls tools reactively.

This can be prompted directly:

```
system: Before calling any tool, briefly reason about:
1. What specific information do you need?
2. Which tool is most appropriate?
3. What is the most precise query or arguments that will get what you need?

Then call the tool. Do not skip the reasoning step.
```

The reasoning step produces noticeably better queries. "What does Paul say about suffering?" → `search_passages(query="Paul suffering")` is shallow. The same question with a reasoning step:

```
Thought: Paul discusses suffering in several distinct contexts — persecution for faith,
the suffering of creation, personal weakness, sharing in Christ's sufferings. The user's
question doesn't specify, so I should search broadly first, then look at each major
passage. Romans 5:3-5 and 2 Corinthians 4:7-12 and 12:7-10 are likely core passages.

Action: search_passages(query="Paul suffering persecution weakness transformation",
                        books=["Romans", "2 Corinthians", "Philippians"])
```

The query is more targeted, the book filter is applied, and the model already has specific passages in mind to verify or supplement.

## Handling Conflicting Tool Results

A model doing thorough tool-based investigation will sometimes retrieve results that appear to conflict. Two commentary excerpts with different interpretations of a passage. A cross-reference that connects two passages in a way that seems theologically inconsistent. Lexical data that complicates a simple reading.

How the model handles these conflicts is a key quality dimension. Three behaviors to encourage:

**Acknowledge the tension explicitly.** A model that surfaces conflicting interpretations and notes them produces more useful output than one that silently picks one and ignores the other. "Commentators disagree on whether *dikaiosynē* here refers primarily to God's attribute or God's gift — Moo and Wright take opposite positions."

**Weight sources appropriately.** Not all retrieved content is equally authoritative. Primary sources (the text itself) should outweigh commentary. Early church consensus should be noted alongside modern scholarship. The model should reason about source credibility, not treat all retrieved content equally.

**Return to retrieval when uncertain.** When the model reaches a point where two retrieved pieces seem inconsistent, it should call another tool to investigate the inconsistency rather than paper over it. "These two passages seem to be in tension — let me look at the Greek more carefully."

These behaviors are partly model capability and partly prompted. Explicitly instructing the model to "surface tensions in the sources, not resolve them prematurely" and "retrieve more evidence when you find apparent contradictions" moves behavior in the right direction.

## Tool Call Sequencing Strategies

For complex reasoning tasks, the sequence in which tools are called matters. Different strategies suit different question types.

**Breadth-first**: search broadly across multiple collections before going deep into any one. Good for exploratory questions where the relevant territory is not known in advance.

```
1. search_passages(broad query, multiple books)
2. search_passages(broad query, commentary)
3. [assess what was found]
4. get_verse(specific passages identified)
5. lookup_lexicon(key terms identified)
```

**Depth-first**: identify the most relevant passage immediately and go deep on it before expanding.

```
1. get_verse(specific known passage)
2. lookup_lexicon(key terms in that passage)
3. get_verse(cross-references of that passage)
4. search_passages(thematic expansion)
```

**Hypothesis-driven**: form a hypothesis first, retrieve evidence to test it, revise and re-test.

```
Hypothesis: Paul uses "grace" in Galatians primarily in contrast to law-observance
1. search_passages(query="grace law Galatians")
2. [evaluate: does the evidence support the hypothesis?]
3. search_passages(query="grace apart from law Romans")
4. [compare: is Galatians usage distinct from Romans?]
```

The right strategy depends on what the question is actually asking. Factual lookups need depth-first. Interpretive questions need hypothesis-driven. Comprehensive coverage questions need breadth-first. A well-prompted model selects strategy based on question type; a model without prompting guidance defaults to reactive single-call retrieval.

## Reasoning Quality Signals

When evaluating tool-based reasoning in production, several signals indicate quality:

**Tool call count relative to question complexity.** A simple factual question answered with 4 tool calls probably indicates the model is being inefficient or confused. A complex comparative question answered with 1 tool call probably indicates shallow reasoning. Expected call counts by question type give a baseline for anomaly detection.

**Query specificity.** Broad, vague queries (`search_passages(query="God")`) suggest the model is not reasoning before calling tools. Specific, targeted queries suggest genuine reasoning about what evidence is needed.

**Result utilization.** Does the final response actually use the content that was retrieved? A model that retrieves 8 passages and cites only 1 while ignoring the others may have retrieved poorly or may be reasoning from its training data instead of the retrieved content. Cross-checking retrieved content against the final response content is a quality signal.

**Consistency between thought and action.** When reasoning is logged (the thought steps before each tool call), inconsistency between stated intent and actual tool call arguments indicates reasoning that is not grounded in the model's own prior statements.

Logging full reasoning traces — every thought step, tool call, and observation, not just the final answer — is the infrastructure that makes quality evaluation possible. Without it, you can see that the final answer is wrong but cannot determine whether the failure was in the retrieval, the reasoning, or the synthesis.

## Tool-Based Reasoning as a Design Principle

The deeper insight from working with tool-based reasoning is that the quality of an AI system's answers is not primarily determined by model capability — it is determined by the quality of the evidence the model has access to and the quality of the reasoning process by which it uses that evidence.

A highly capable model with no tools, asked about a specific verse, produces an approximation. A moderately capable model with well-designed tools and a well-prompted reasoning process produces a grounded, accurate answer. The tools and the prompting carry more weight than many engineers expect.

This reframes the engineering problem. Instead of asking "how do I get a better model?" the right question is often "how do I give the model better evidence, and how do I prompt it to reason about that evidence more carefully?" The first question is expensive and outside your control. The second is solvable with good tool design and thoughtful prompting.

The next article covers retrieval systems for theological content specifically — how the evidence gathering half of this equation is designed for the domain.

---

*[← Back to AI Engineering](/categories/ai-engineering)*
