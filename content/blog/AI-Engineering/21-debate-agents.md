---
title: "Debate Agents"
description: "Debate agents for theological argumentation in AI pipelines."
date: 2026-07-05
lastUpdated: "2026-06-09"
category: "ai-engineering"
tags:
  - ai-engineering
  - agents
  - debate
draft: true
cluster: "ai-engineering"
slug: debate-agents
author: Donavan Jones
---

# Debate Agents

The hardest questions in theological study are not factual — they are interpretive and contested. What does Paul mean by "works of the law" in Galatians? Is the "righteousness of God" in Romans 1:17 a divine attribute, a gift, or both? Did Calvin teach double predestination in the same sense as later Calvinist scholasticism?

A single-agent response to these questions tends toward premature closure. The model selects one reading, marshals the best evidence for it, and presents a coherent case. This can look authoritative while actually suppressing the genuine complexity. A user who gets a well-argued Reformed answer to a question about Romans 9 has not been exposed to what Arminius actually argued or why serious scholars still hold that view. They have been given one side of a living debate as if it were settled.

Debate agents address this by using multiple agents, each assigned to argue a distinct theological position, with an orchestrating agent that moderates the exchange and synthesizes a balanced summary. The output is not one position — it is the debate itself, structured so the user can follow the argument and form their own view.

*Part of the [AI Engineering series](/categories/ai-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every ai engineering deep-dive in this series."
destinationUrl: "/categories/ai-engineering"
---
::

## When Debate Agents Are Appropriate

Not every question warrants a debate pipeline. Deploying multi-agent orchestration for "What does Romans 8:28 say?" produces unnecessary overhead and a confusing response. The debate pipeline is appropriate for:

- Questions where two or more traditions reach meaningfully different conclusions from the same text
- Questions where the user is explicitly asking about theological disagreement ("How do Calvinists and Arminians read this differently?")
- Questions about the interpretation of contested passages where the debate is itself the scholarly landscape
- Study guide generation for passages that are historically controversial

The single-agent pipeline handles everything else. The debate pipeline is invoked by query classification when the query is classified as `comparative` or when the retrieved commentary contains significant disagreement across traditions.

```typescript
function shouldRouteToDebatePipeline(
  analysis: QueryAnalysis,
  retrievalContext: RetrievalContext
): boolean {
  if (analysis.type === "comparative") return true;

  const traditionDivergence = computeTraditionDivergence(
    retrievalContext.commentary
  );
  return traditionDivergence >= 0.65; // high disagreement threshold
}

function computeTraditionDivergence(
  commentary: CommentaryChunk[]
): number {
  const byTradition = groupBy(commentary, c => c.tradition);
  const traditions = Object.keys(byTradition);
  if (traditions.length < 2) return 0;

  // Score disagreement between traditions based on their position extractions
  const positions = traditions.map(t =>
    extractTraditionPosition(byTradition[t])
  );
  return cosineDissimilarity(positions[0].vector, positions[1].vector);
}
```

## The Debate Agent Architecture

The debate pipeline has four components: a retrieval stage that assembles tradition-specific evidence, two or more advocate agents that argue assigned positions, a critic agent that challenges each advocate, and a moderator agent that synthesizes the exchange.

```
                    ┌─────────────────────┐
                    │  Tradition-Specific  │
                    │  Retrieval           │
                    └─────────┬───────────┘
                              │
           ┌──────────────────┼──────────────────┐
           │                  │                  │
           ▼                  ▼                  ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │  Advocate A  │   │  Advocate B  │   │  Advocate C  │
    │  (Reformed)  │   │  (Arminian)  │   │  (if needed) │
    └──────┬──────┘   └──────┬──────┘   └──────┬──────┘
           │                  │                  │
           └──────────────────┼──────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Critic Agent        │
                    │  (challenges both)   │
                    └─────────┬───────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Moderator Agent     │
                    │  (synthesis)         │
                    └─────────┬───────────┘
                              │
                              ▼
                    Structured debate response
```

## Tradition-Specific Retrieval

Before any agent generates, the retrieval stage assembles separate evidence packages for each tradition:

```typescript
async function assembleDebateContext(
  query: string,
  traditions: TheologicalTradition[]
): Promise<Map<TheologicalTradition, TraditionContext>> {
  const contexts = await Promise.all(
    traditions.map(async tradition => {
      const [scripture, commentary] = await Promise.all([
        retrieveScripture(query, { tradition }),
        retrieveCommentary(query, {
          tradition,
          limit: 4,
          minScore: 0.70,
        }),
      ]);

      return [tradition, { scripture, commentary }] as const;
    })
  );

  return new Map(contexts);
}
```

Both traditions receive the same scripture passages — the text is the same for everyone. The commentary packages differ: Reformed advocates receive Calvin, Owen, Murray, Schreiner; Arminian advocates receive Arminius, Wesley, Wiley, Picirilli. Each agent argues from the sources its tradition actually uses.

This is a critical design constraint. An advocate that argues a Reformed position using Arminian commentary, or vice versa, produces a strawman argument. The debate is only useful if each position is argued from its own best sources.

## The Advocate Agents

Each advocate agent receives a system prompt that assigns a tradition and instructs it to argue faithfully for that position:

```typescript
function buildAdvocateSystemPrompt(
  tradition: TheologicalTradition,
  query: string
): string {
  return `You are a theological advocate for the ${tradition} tradition 
engaging a question in Christian doctrine.

Your task: Present the strongest possible case for how the ${tradition} 
tradition answers this question, drawn from the sources provided.

Rules:
- Argue from the provided ${tradition} commentary and scripture
- Present your tradition's actual position, not a caricature
- Use your tradition's own theological vocabulary and categories
- Cite specific sources from the provided context: [CITE: ref]
- Acknowledge where your tradition's position is genuinely strong
- Do not misrepresent the opposing position — your job is to make the 
  positive case for yours, not to attack theirs
- Length: 250-350 words

Question: ${query}`;
}
```

The instruction "do not misrepresent the opposing position" is intentional and important. Advocates in theological debate have a long history of arguing against the weakest version of the opponent's position. The system prompt prevents this not to limit the advocacy, but to ensure the debate structure produces understanding rather than rhetorical performance.

The advocates run in parallel — there is no sequential dependency between Advocate A and Advocate B:

```typescript
async function runAdvocates(
  query: string,
  debateContext: Map<TheologicalTradition, TraditionContext>,
  traditions: TheologicalTradition[]
): Promise<Map<TheologicalTradition, AdvocateResponse>> {
  const responses = await Promise.all(
    traditions.map(async tradition => {
      const context = debateContext.get(tradition)!;
      const systemPrompt = buildAdvocateSystemPrompt(tradition, query);

      const response = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001", // fast model for advocate turns
        max_tokens: 500,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: buildAdvocateUserMessage(query, context),
          },
        ],
      });

      return [tradition, parseAdvocateResponse(response)] as const;
    })
  );

  return new Map(responses);
}
```

Advocate agents run on the fast model (Haiku). They are doing constrained, single-perspective generation from provided sources — this does not require the full reasoning capacity of the main study model. Using a fast model here keeps latency reasonable; the debate pipeline is already more expensive than a single-agent response.

## The Critic Agent

After both advocates have generated, the critic agent reads both responses and produces targeted challenges:

```typescript
const CRITIC_SYSTEM_PROMPT = `You are a theological critic reviewing arguments 
from two different Christian traditions on the same question.

Your task: Identify the strongest challenge to each position — the place 
where each argument is most vulnerable to the other's critique, or where 
both arguments rest on assumptions that deserve scrutiny.

Rules:
- Challenge each position with the strongest version of the opposing argument
- Do not declare a winner — identify tensions and weaknesses, not correct answers
- Note where both traditions share common ground
- Note where the disagreement traces to deeper differences (hermeneutics, 
  theological anthropology, etc.) rather than just the immediate question
- Cite scripture from the provided context where it applies pressure to 
  either position
- Length: 150-200 words per position`;

async function runCritic(
  query: string,
  advocates: Map<TheologicalTradition, AdvocateResponse>,
  scripture: RetrievalResult[]
): Promise<CriticResponse> {
  const advocateText = [...advocates.entries()]
    .map(([t, r]) => `${t} position:\n${r.argument}`)
    .join("\n\n---\n\n");

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6", // stronger model — cross-argument reasoning
    max_tokens: 600,
    system: CRITIC_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Question: ${query}\n\n${advocateText}\n\nScripture context:\n${formatScripture(scripture)}`,
      },
    ],
  });

  return parseCriticResponse(response);
}
```

The critic runs on the stronger Sonnet model. The reasoning required — holding both arguments simultaneously, identifying their structural weaknesses, tracing disagreements to first principles — benefits from more capacity than the advocates need.

The critic's output is not a judgment. It is a diagnostic: "The Reformed position's strength is its exegesis of Romans 9:11-13; its vulnerability is explaining why God's choice does not render human response meaningless. The Arminian position's strength is integrating passages about genuine human responsibility; its vulnerability is the exegetical tension in Romans 9:16 where Paul explicitly denies that election depends on human will."

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

## The Moderator Agent

The moderator reads all previous outputs — both advocate arguments and the critic's challenges — and produces the final structured response:

```typescript
const MODERATOR_SYSTEM_PROMPT = `You are moderating a theological debate 
for a Bible study user. You have received arguments from two traditions 
and a critical analysis of both positions.

Your task: Produce a balanced, structured summary that:
1. States the question clearly
2. Presents each tradition's core argument fairly, in 2-3 sentences
3. Notes the key points of disagreement
4. Identifies what both traditions agree on
5. Notes where the disagreement traces to deeper theological commitments
6. Suggests how the user might engage further with the question

Do not resolve the debate. Your role is to ensure the user understands 
the genuine disagreement and can engage with both positions knowledgeably.

Format using clear headers. Total length: 500-700 words.`;

async function runModerator(
  query: string,
  advocates: Map<TheologicalTradition, AdvocateResponse>,
  critic: CriticResponse,
  userProfile: UserTheologicalProfile
): Promise<ModeratorResponse> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 900,
    system: buildModeratorSystemPrompt(userProfile),
    messages: [
      {
        role: "user",
        content: buildModeratorUserMessage(query, advocates, critic),
      },
    ],
  });

  return parseModeratorResponse(response);
}
```

The moderator's system prompt is personalized by user profile. A user identified as Reformed receives a moderator that presents their own tradition's argument first — familiar ground — then engages the Arminian response as a serious alternative. A user with no tradition identification receives a symmetrically framed summary. The personalization does not change the substance; it changes the framing order.

## Structured Output Format

The debate response has a defined structure that the front end renders distinctly from standard study responses:

```typescript
interface DebateResponse {
  question: string;
  traditions: Array<{
    name: TheologicalTradition;
    coreArgument: string;
    keyPassages: string[];
    keyScholars: string[];
    citations: Citation[];
  }>;
  keyDisagreements: string[];
  commonGround: string[];
  deeperRoots: string;    // where the disagreement traces to
  forFurtherStudy: string[];
  moderatorSummary: string;
}
```

The front end renders this as a structured comparison view — advocates side by side with their key passages, then the disagreement analysis, then the moderator summary. This visual structure makes the two-position nature of the debate immediately clear to the user; they are not reading a single coherent response but a structured comparison.

::CtaTryApp
---
buttonText: "Try The Live AI App"
supportingCopy: "Try the RAG-powered Bible study app these patterns were built for."
destinationUrl: "https://bibleverse.donavanjones.com/register"
---
::

## Preventing Debate Pipeline Failure Modes

Three consistent failure modes in debate agents:

**Advocate drift**: the advocate, despite its tradition assignment, gradually incorporates the other tradition's arguments. This produces two responses that converge on the same position, defeating the purpose. Fixed by including explicit examples of the tradition's actual position in the system prompt and running a post-generation check that verifies the advocate's position is distinct from the opposing tradition.

**False balance**: the moderator presents both positions as equally well-supported even when the textual evidence strongly favors one. The debate format can create an appearance of balance that misrepresents the actual state of scholarship. Fixed by instructing the moderator to note when evidence weight differs: "Most critical commentators find the exegetical case for [position] stronger at this specific point, though [other tradition] responds with..."

**Irresolvable escalation**: without stopping conditions, a debate pipeline could run multiple rounds, with advocates responding to critiques and generating further responses indefinitely. Fixed by the architecture: advocates run once, critic runs once, moderator runs once. There is no iteration. The goal is illumination, not resolution.

## Latency and Cost

The debate pipeline is more expensive than single-agent generation:

| Stage | Model | Calls | Latency contribution |
|---|---|---|---|
| Tradition retrieval | — | 2 parallel | ~250ms |
| Advocates | Haiku (×2 parallel) | 2 | ~800ms |
| Critic | Sonnet | 1 | ~1,200ms |
| Moderator | Sonnet | 1 | ~1,500ms |
| **Total** | | **6** | **~3,750ms** |

Compared to the standard single-agent pipeline at ~1,800ms end-to-end, the debate pipeline takes roughly twice as long. This is the right tradeoff for questions where the debate structure provides genuine value. For standard study questions, the latency cost is not justified — which is why the routing logic is conservative about when to invoke it.

The cost difference is similar: six model calls versus one, with two of those calls on Sonnet. Debate responses are cached aggressively. The same question about Romans 9 election asked by two different users within a 24-hour window reuses the cached debate structure; only the moderator summary is personalized and regenerated.

The debate pipeline is not a general architecture — it is a specialized tool for the specific cases where understanding a contested question requires hearing both sides argued from their own sources. Used in those cases, it produces responses that no single-agent approach can match: not one answer, but a structured engagement with the genuine disagreement that has animated Christian theology for centuries.

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
  buttonText: "Read: Voice Narration Pipelines"
  supportingCopy: "Continue with \"Voice Narration Pipelines\" for the next piece of this system."
  destinationUrl: "/blog/ai-engineering/22-voice-narration-pipelines"
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
  - label: "Dialectic — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Dialectic"
    type: "wikipedia"
    description: "According to this overview, dialectic is the method of examining opposing arguments to arrive at truth — the centuries-old practice that debate agent architecture operationalizes."
  - label: "Socratic Method — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Socratic_method"
    type: "wikipedia"
    description: "The structured questioning method for examining claims and exposing contradictions — the pedagogical model for surfacing interpretive complexity in theological questions."
  - label: "Improving Factuality and Reasoning via Multiagent Debate (Du et al., 2023)"
    url: "https://doi.org/10.48550/arXiv.2305.14325"
    type: "doi"
    description: "Research showing that structured debate between multiple model instances improves factuality and reasoning quality over single-agent generation."
  - label: "Multi-Agent System — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Multi-agent_system"
    type: "wikipedia"
    description: "Foundational overview of multi-agent architectures — the technical model that debate agent orchestration builds on."
---
::

---

*[← Back to AI Engineering](/categories/ai-engineering)*
