---
title: "Prompt Engineering"
description: "Prompt engineering for retrieval-augmented generation in theology."
date: 2026-06-06
lastUpdated: "2026-06-09"
category: "ai-engineering"
tags:
  - ai-engineering
  - prompt
  - bible-study
draft: false
slug: prompt-engineering
author: Donavan Jones
---

# Prompt Engineering

Prompt engineering for a theological AI system is different from prompt engineering for a general-purpose assistant. The domain has specific constraints — epistemic obligations to the text, traditions that disagree in documented ways, a user base that includes people with serious theological training alongside people encountering a passage for the first time — and these constraints have to be encoded in the prompts, not assumed from the model.

This article is about how prompts are built on this platform: the system prompt architecture, instruction patterns that work, patterns that fail, how prompts adapt to context, and how they get evaluated. Not theory — the specific design decisions that emerged from building and operating a production theological AI system.

*Part of the [AI Engineering series](/categories/ai-engineering).*

## The System Prompt is Architecture

The system prompt is not a greeting or a role assignment. It is the structural contract that governs every response the model produces. Getting it wrong means every response is wrong in the same systematic way — and systematic failures are the hardest kind to notice because they look like the model's personality rather than a design error.

The platform's system prompt has five sections, each with a distinct function:

```
[Role and Context]
[Content Constraints]
[Citation Requirements]
[Response Format]
[Quality Standards]
```

### Role and Context

```
You are a theological study assistant helping a Christian understand scripture 
more deeply. You have access to a curated library of Bible translations, 
lexical resources, commentaries from multiple traditions, and the user's 
personal study notes.

Your purpose is to help the user engage with the actual text — not to provide 
a definitive theological position, but to surface what the text says, what 
interpreters have understood it to mean, and where legitimate disagreement 
exists among traditions.

User profile: {user_preference_summary}
Translation preference: {translation}
Study depth: {depth_level} — {depth_description}
```

The role definition has two important properties. First, it defines the model as a study aid rather than an authority — "help the user engage" rather than "explain to the user." This framing keeps the model from overstating confidence and from positioning itself as the endpoint of the user's investigation rather than a step toward the text. Second, the `{user_preference_summary}` injection means every system prompt is personalized to the specific user — their theological background, study history, and how much technical depth they want.

### Content Constraints

```
Constraints:
- Base all theological claims on the passages and resources provided in context.
  Do not draw on information outside the provided context.
- Where traditions disagree on an interpretation, present the disagreement 
  rather than choosing a side unless the user explicitly asks for your view.
- Do not claim consensus where none exists. Do not say "all Christians believe" 
  or "the Bible clearly teaches" when the point is contested.
- If a question cannot be answered from the provided context, say so explicitly 
  rather than generating an answer from training knowledge.
- Quote Bible verses only from the provided passages. Do not quote from memory.
```

Each constraint exists because the failure mode it prevents actually occurred in testing without it. "Base all theological claims on provided context" prevents training-data drift. "Where traditions disagree, present the disagreement" prevents the model from defaulting to one tradition's reading of a passage. "Do not claim consensus" prevents false certainty on contested questions. "If the question cannot be answered, say so" prevents low-confidence generation from sparse context.

The explicit constraint against quoting from memory is the most operationally impactful. Without it, the model quotes verses from training data — usually close but not exact, often the right verse but a paraphrase rather than the actual translation. With it, the model quotes only text that is in its context window, which is also the text that gets citation-verified.

### Citation Requirements

```
Citation format:
Every theological claim must be supported by a citation using [CITE: ref] 
notation immediately after the claim.

Example: "Paul argues that justification is by faith alone [CITE: rom_3_28]."

- Only cite references from the provided context
- Each citation must directly support the specific claim it follows  
- If a claim cannot be supported from provided context, note it explicitly:
  "This interpretation is not supported by the passages in context."
```

This is reproduced here from article 13 — it belongs in the system prompt, not just in the article about citation grounding.

### Response Format

```
Format your response as follows:
- Lead with the most direct answer to the question
- Then provide supporting analysis with inline citations
- Close with 1-2 sentences on where to go deeper (related passages, 
  lexical resources, or commentary) if relevant
- For word studies: include a section on the original language term
- For cross-reference questions: trace the theme in canonical order
  unless context suggests another order is more useful

Use plain prose. Do not use headers for responses under 400 words.
Use headers for longer responses or structured study content.
```

Format instructions reduce the variance in response structure. Without them, the model makes its own formatting choices based on training distribution — sometimes that is fine, sometimes it produces unnecessary headers, bullet points where prose would serve better, or responses that bury the direct answer in prefatory remarks.

The "lead with the most direct answer" instruction addresses a consistent failure pattern: models fine-tuned for helpfulness tend to front-load context and caveats before reaching the actual response. For a user who asked "What does *agape* mean?", the most helpful response starts with the answer, not with two paragraphs of context about Greek vocabulary.

### Quality Standards

```
Quality checks to apply before responding:
- Is every theological claim cited?
- Does the response address what the user actually asked, not a simpler 
  version of it?
- Are traditions presented accurately and without caricature?
- Are uncertainty and disagreement acknowledged where they exist?
- Is the response pitched at the right depth for this user?
```

This section asks the model to self-check before generating. It is not a perfect mechanism — the model cannot reliably audit its own output — but it reduces the frequency of the specific failure modes listed. It functions less as a verification step and more as a pre-generation attention direction: by listing these quality criteria, the prompt focuses the model's generation process on them.

## Intent-Driven Prompt Variants

The base system prompt is adapted for specific study intents. Rather than one prompt serving all study types, each intent has a specialized template:

### Word Study Prompt Additions

```
You are conducting a word study on: {term} ({strongs_ref})

Approach:
1. Define the term using the lexical resources provided
2. Describe the semantic range — how the term is used differently 
   in different contexts
3. Identify the most significant occurrences provided and what they 
   reveal about the term's meaning
4. Note any disputed aspects of the term's meaning or translation
5. Summarize how the term functions in the user's query context

Do not claim a single definitive meaning if the term has legitimate 
range. Present the range, then explain which meaning best fits 
the query context and why.
```

The "do not claim a single definitive meaning" instruction is critical for word studies. Models have a strong tendency toward providing clean, simple definitions. For Greek and Hebrew terms, clean definitions are often wrong — *sarx* means "flesh" but what "flesh" means varies from biological matter (1 Cor 15:39) to the sin nature (Rom 8:5) to "human" as a category (John 1:14). A prompt that forces the model to present range produces more accurate word studies than one that allows it to collapse the range to a single gloss.

### Comparative Study Prompt Additions

```
This question asks you to compare interpretations, traditions, or texts.

When comparing:
- Present each position accurately, in its strongest form
- Use sources from the provided context rather than characterizing positions 
  from memory
- Avoid framing comparisons as "correct vs incorrect" — frame them as 
  different theological reasoning paths with different starting assumptions
- If the provided context supports one position more strongly, note this 
  explicitly: "The provided commentary material tends toward X interpretation, 
  though Y position is also represented by..."
- Distinguish between disagreements about facts (text criticism, historical 
  background) and disagreements about interpretation (theological meaning)
```

The "steelman each position" instruction — present each in its strongest form — is directly relevant to theological comparison. Models default to presenting the majority position sympathetically and the minority position in its weakest form. In theological discourse, the minority position is often represented by serious scholars with sophisticated arguments. Prompting for the strongest form of each forces the model to engage with actual positions rather than strawmen.

### Personal Application Prompt Additions

```
The user is asking how this passage applies to their situation.

When addressing personal application:
- Ground application in what the text actually says, not what would 
  be most comforting or affirming
- Distinguish between the text's original meaning and how that meaning 
  applies to a modern context
- Present application as invitation and reflection, not instruction or judgment
- If the text is ambiguous about application, say so rather than projecting 
  a single application with false confidence
- Reference the user's prior study notes if relevant, using them to connect 
  this passage to their ongoing theological reflection
```

The "ground application in what the text actually says, not what would be most comforting" instruction pushes against a specific model tendency: models fine-tuned for helpfulness drift toward responses that validate and comfort the user's framing. For devotional content, some of that is appropriate. But when the text says something challenging, the prompt needs to explicitly prevent the model from softening it.

---

*Explore more articles in the [AI Engineering series](/categories/ai-engineering).*

---

## Prompting for Uncertainty Expression

One of the hardest prompt engineering problems on this platform is getting the model to express uncertainty accurately. Models are trained on human-generated text where confident assertions are more common than hedged ones, and this training distribution biases toward confidence. Left to their own devices, models will state uncertain things confidently.

The fix requires explicit instruction across multiple dimensions:

```
Uncertainty expression:
- Use "the text suggests" rather than "the text proves" for interpretive claims
- Use "many interpreters hold" rather than "interpreters hold" when 
  the position is not universal
- When the evidence for a claim is limited to one or two sources in context, 
  note this: "Based on the commentary provided..."
- For historically contested questions (predestination, free will, the 
  nature of hell), explicitly note the contestation rather than presenting 
  one view as settled
- "I don't know" is a valid response. Use it when the provided context 
  does not support a claim.
```

Each of these instructions targets a specific overclaiming pattern. "The text proves" overstates interpretive certainty. "Interpreters hold" (without qualification) implies universal consensus. Hiding source scarcity behind confident claims makes responses sound better-grounded than they are.

Testing uncertainty expression against a benchmark of known-contested theological questions reveals whether the model is calibrated. For questions where scholarly consensus is genuinely divided (the meaning of *aionios* in Matthew 25:46, the scope of "all" in Romans 5:18), well-calibrated prompts produce responses that acknowledge the division. Poorly calibrated prompts produce responses that pick a side and present it as settled.

## Context Injection Patterns

How context is presented in the prompt matters as much as what context is included.

### Labeling Sources Explicitly

Context is not dumped into the prompt as undifferentiated text. Each source is labeled by type and authority level:

```
SCRIPTURE (Primary Source)
Romans 8:28-30 (ESV):
"And we know that for those who love God all things work together for good..."

LEXICAL RESOURCE
Strong's G4941 (synergei): to work together, to cooperate; compound of syn- 
(together) + ergon (work). Used in the NT primarily by Paul...

COMMENTARY (Reformed tradition)
John Calvin, Commentary on Romans 8:28:
"This is a universal proposition, applicable to all the circumstances of life..."

COMMENTARY (Evangelical tradition)
Douglas Moo, The Epistle to the Romans, p. 526:
"The precise subject of 'work together' is disputed among interpreters..."

USER NOTES
Your note from 2026-03-14:
"The 'all things' here has to include suffering — Paul wrote this from 
prison. The universality is the point."
```

Labels do two things. They tell the model what to trust and how to weight evidence (Scripture over commentary, commentary over user notes). And they prevent the model from treating Calvin's commentary and the user's personal note as epistemically equivalent — which it will do without labels, because they are structurally similar text.

### The Retrieval Quality Header

Immediately before the user's question, the prompt includes a retrieval quality signal:

```
RETRIEVAL SUMMARY
- 4 scripture passages retrieved (3 high confidence, 1 moderate)
- 3 commentary excerpts retrieved (2 Reformed, 1 Evangelical)
- 1 lexical entry retrieved
- No user notes found for this topic

Scope your response to what is directly supported by the above.
```

This signals to the model how much evidence it has to work with. A model that knows it has only moderate-confidence retrieval on a topic will hedge accordingly. A model with no signal about retrieval quality will generate with equal confidence regardless of evidence depth.

## Testing Prompts

A prompt is not finished when it produces a good response to the query it was written for. It is finished when it produces acceptable responses across the full distribution of queries it will receive in production — including the edge cases.

The prompt evaluation set on this platform has four categories:

**Contested theological questions**: election, free will, hell, the role of the law, the scope of atonement. Correct response: presents multiple positions with their supporting evidence; does not choose a side; acknowledges the genuine scholarly debate.

**Precise textual questions**: "What does *dikaiosynē* mean in Romans 3:21?" Correct response: draws on lexical resources in context; presents the semantic range; applies the appropriate meaning to the verse.

**Questions with sparse retrieval**: questions on obscure topics where the corpus has limited coverage. Correct response: acknowledges limited evidence; scopes response to what is supported; suggests where to look for more.

**Leading questions**: "Isn't it true that Paul taught once-saved-always-saved?" Correct response: engages with the actual evidence rather than validating the framing; presents the relevant passages; notes where the question's framing overstates the evidence.

Each category tests a different failure mode. A prompt that handles contested questions well but validates leading questions has a different problem than one that handles leading questions well but overclaims on precise textual questions. Running all four categories reveals the full failure profile.

Prompt iterations are evaluated against the full test set, not just the queries that motivated the change. A fix to overclaiming on contested questions should not break accurate handling of precise textual questions. This regression-awareness is what separates systematic prompt engineering from trial-and-error.

## The Meta-Lesson

The most useful framing I have found for prompt engineering in this domain: prompts are specifications. They describe the behavior you want the same way a type signature describes the interface you expect. The difference is that a type compiler enforces the specification at build time, while a prompt can only influence the probability distribution over outputs at runtime.

That probabilistic enforcement is why prompt engineering requires an evaluation set. You cannot know whether your specification is working by reading it — you can only know by running it against the full range of inputs it will encounter and observing whether the outputs are within the acceptable distribution. The evaluation set is what makes prompt engineering engineering rather than guesswork.

Every constraint in the system prompt on this platform exists because a version without it produced a systematic failure on a real query. The specification grew from the failures. That is the only reliable way to build it.

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "Prompt Engineering — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Prompt_engineering"
    type: "wikipedia"
    description: "According to this overview, prompt engineering is the practice of structuring inputs to elicit specific, reliable model behaviors — the discipline this article applies to theological AI."
  - label: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models (Wei et al., 2022)"
    url: "https://doi.org/10.48550/arXiv.2201.11903"
    type: "doi"
    description: "Foundational research establishing that step-by-step reasoning instructions improve model performance on complex tasks — the evidence behind structured prompting."
  - label: "Few-Shot Learning — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Few-shot_learning_(natural_language_processing)"
    type: "wikipedia"
    description: "Overview of few-shot in-context learning — the technique of providing examples in the prompt to guide model output format and behavior."
  - label: "Constitutional AI: Harmlessness from AI Feedback (Bai et al., 2022)"
    url: "https://doi.org/10.48550/arXiv.2212.08073"
    type: "doi"
    description: "Anthropic research on using explicit principles in prompts to constrain model behavior — the approach adapted for theological epistemic constraints."
---
::

---

*[← Back to AI Engineering](/categories/ai-engineering)*
