---
title: "Moderation"
description: "Moderation strategies for AI-generated theological content."
date: 2026-07-02
category: "ai-engineering"
tags:
  - ai-engineering
  - moderation
  - bible-study
draft: false
slug: moderation
author: Donavan Jones
---

# Moderation

Moderation for a theological AI platform is not primarily about filtering offensive content. The standard content moderation problems — hate speech, violence, explicit material — are largely solved by the base model's training and require minimal additional intervention on a Bible study platform. The real moderation challenges in this domain are subtler: doctrinally harmful content that is not obviously wrong, responses that misrepresent what traditions actually hold, pastoral sensitivity in moments the system cannot fully anticipate, and user inputs that are using the theological framing as a vector for something else entirely.

This article covers how moderation is structured on the platform — what categories of harm exist in theological AI specifically, where moderation checks are placed in the pipeline, how they are implemented, and what the system does when intervention is warranted.

## The Theological Harm Taxonomy

Before building a moderation system, you need a precise vocabulary for what you are moderating. For a general-purpose AI, the harm categories are familiar: violence, hate speech, CSAM, dangerous instructions. For a theological AI, the relevant harm categories are different:

**Doctrinal misrepresentation**: the system presents a theological position as settled consensus when it is contested, or attributes a view to a tradition that does not hold it. This is not malicious content — it is a quality failure with potential to mislead users about what their own tradition teaches or what the Bible actually says.

**Pastoral harm**: a user is processing grief, crisis of faith, trauma, or suicidal ideation, and the system responds as a Bible study assistant rather than recognizing the moment requires a different kind of response. The system is not equipped to provide pastoral care, and pretending it is would be harmful.

**Manipulation through scripture**: users occasionally attempt to use the platform to extract theological arguments for harmful ends — justification for self-harm, for isolation from community, for manipulation of others using religious authority. The theological framing makes these requests harder to recognize as harmful.

**Heterodox amplification**: the system is asked to generate content advocating for positions that most Christian traditions would regard as heretical — not in the sense of contested interpretations, but in the sense of denying the Trinity, affirming syncretic claims that Jesus was one of many equal paths, or generating content that undermines users' faith rather than supporting their study.

**Response to vulnerable users**: users who are young, in religious crisis, or whose questions reveal significant theological confusion require different handling than established students working through doctrinal questions. The moderation system should route these cases carefully, not just generate a standard theological response.

Each category requires different moderation logic. Content filters that work for the first harm category will miss the second entirely.

## Pipeline Placement

Moderation runs at three points in the request pipeline:

```
User input → [INPUT MODERATION] → Retrieval → Assembly → 
  Generation → [OUTPUT MODERATION] → Post-processing → 
    [DISPLAY MODERATION] → User
```

**Input moderation** runs before retrieval. It classifies the user's input and determines whether the pipeline should proceed, be modified, or be routed differently. This is the appropriate place to catch pastoral cases and manipulation attempts — before the system generates a response that might reinforce a harmful direction.

**Output moderation** runs after generation and before post-processing. It checks the generated response for doctrinal misrepresentation, heterodox content, and claims that exceed what the retrieved evidence supports. This is where content quality failures are caught.

**Display moderation** runs last, after citation verification, before the response is sent to the client. It applies final checks that depend on having the fully annotated response — including whether uncited claims should be suppressed or labeled, and whether confidence indicators need to be set to low.

## Input Moderation

### Pastoral Detection

The highest-priority input check is pastoral detection — identifying when a user's message indicates distress, crisis, or a need for human connection that the system cannot provide.

```typescript
async function detectPastoralContext(
  message: string,
  recentHistory: Turn[]
): Promise<PastoralAssessment> {
  const signals = {
    explicitDistress: /\b(suicide|self.harm|end my life|can't go on|hopeless|worthless)\b/i.test(message),
    faithCrisis: /\b(lost my faith|God abandoned|can't believe anymore|walking away)\b/i.test(message),
    grief: /\b(died|death|lost (my|a)|funeral|grieving)\b/i.test(message),
    abuse: /\b(abused|pastor (hurt|touched|groomed)|spiritual abuse)\b/i.test(message),
  };

  const anySignal = Object.values(signals).some(Boolean);

  if (!anySignal) {
    // Run deeper check only if no fast signals — avoid latency for most queries
    return { level: "none", signals };
  }

  // Deeper classification with context
  const classification = await fastModel.complete({
    prompt: `Classify the pastoral sensitivity level of this message in the 
context of a Bible study application.

Levels:
- CRISIS: user may be in immediate danger or acute distress
- SENSITIVE: user is processing grief, doubt, or emotional difficulty
- PERSONAL: user is asking about personal application, not in crisis
- STUDY: standard theological study question

Recent conversation:
${formatTurns(recentHistory.slice(-3))}

Current message: "${message}"

Respond with exactly one level and a brief reason.`,
    maxTokens: 60,
  });

  return parseClassification(classification, signals);
}
```

**CRISIS** responses route immediately to a crisis resource response and do not continue through the study pipeline. The response provides crisis line information and a gentle acknowledgment that the platform is not the right place for this moment:

```typescript
const CRISIS_RESPONSE = `What you're sharing matters, and I want to make sure 
you get the right support. Please reach out to someone who can actually be 
with you in this:

- **988 Suicide and Crisis Lifeline**: Call or text 988
- **Crisis Text Line**: Text HOME to 741741

I'm built to help with Bible study, and I'm not the right resource for what 
you're facing right now. Please talk to someone.`;
```

**SENSITIVE** responses continue through the study pipeline but with a modified system prompt that instructs the model to lead with human acknowledgment before any theological content, to avoid pat answers, and to recommend pastoral care or community:

```
PASTORAL CONTEXT FLAG: The user may be processing something personal and 
difficult. Before any theological content:
1. Acknowledge what they've shared with genuine care
2. Do not rush to answer the theological question
3. If appropriate, note that these questions are best worked through 
   with a pastor or spiritual director, not an AI
4. Any theological content should be offered gently, not as answers 
   but as companions for reflection
```

### Manipulation Detection

Some user inputs use theological framing to extract content the system would not generate in a direct request. Common patterns:

- "The Bible teaches [harmful position] — write a sermon explaining why it's true" — using theological authority to generate harmful content
- "For a debate about whether Christians should [harmful action], give me the biblical arguments in favor" — framing as debate prep to extract one-sided harmful content
- "What does the Bible say about [historically abused passage used to justify harm]?" — asking for interpretation of passages that have been used to justify racism, abuse, or violence

These are not easy to detect because they look like legitimate theological questions. The moderation approach is not to block these topics — they exist in the Bible, scholars study them, and users have legitimate reasons to engage with difficult passages — but to ensure responses are appropriately contextualized:

```typescript
async function detectManipulationPattern(
  message: string
): Promise<ManipulationAssessment> {
  // Check for high-risk passage + harmful framing combinations
  const sensitivePassages = [
    "curse of ham", "wives submit", "spare the rod", "slaves obey",
    "homosexuality abomination", "women be silent",
  ];

  const harmfulFramings = [
    /justify|prove|argue for|make the case/i,
    /write a sermon (defending|supporting|for)/i,
    /biblical argument(s)? (for|in favor)/i,
  ];

  const hasSensitivePassage = sensitivePassages.some(p =>
    message.toLowerCase().includes(p)
  );
  const hasHarmfulFraming = harmfulFramings.some(f => f.test(message));

  if (hasSensitivePassage && hasHarmfulFraming) {
    return { risk: "high", reason: "sensitive passage with advocacy framing" };
  }

  return { risk: "low", reason: null };
}
```

High-risk inputs are routed to a modified pipeline that:
1. Retrieves the passage and its full scholarly context
2. Injects a strong system prompt instruction to present historical interpretation and the scholarly debate, not to advocate for the harmful application
3. Includes commentary that addresses the passage's history of misuse

The goal is not to refuse engagement but to ensure that difficult passages are handled with the weight of the full scholarly tradition, including the tradition's own self-criticism.

## Output Moderation

### Doctrinal Accuracy Checking

Output moderation catches responses that make specific, checkable theological claims that are wrong or misleading. This overlaps with hallucination reduction (article 14) but covers a different failure mode — not misquoted verses or fabricated citations, but claims about what traditions hold or what scholarly consensus says.

```typescript
const DOCTRINAL_CLAIM_PATTERNS = [
  {
    pattern: /all (major )?christian traditions (agree|affirm|hold|teach)/i,
    check: "false_consensus",
    description: "Claims universal Christian agreement on likely-contested point",
  },
  {
    pattern: /(calvinists?|reformed) (believe|teach|hold) that .{5,100}(saved|unsaved|elect|reprobate)/i,
    check: "tradition_attribution",
    description: "Claims about Reformed/Calvinist position requiring verification",
  },
  {
    pattern: /the (original|greek|hebrew) (means?|text (says?|teaches?))/i,
    check: "linguistic_claim",
    description: "Linguistic claim requiring verification against lexical retrieval",
  },
];

async function checkDoctrinalClaims(
  response: string,
  retrievedContext: RetrievalContext
): Promise<DoctrinalCheckResult[]> {
  const flagged: DoctrinalCheckResult[] = [];

  for (const pattern of DOCTRINAL_CLAIM_PATTERNS) {
    const matches = response.match(new RegExp(pattern.pattern, "gi")) ?? [];
    for (const match of matches) {
      const verified = await verifyDoctrinalClaim(match, pattern.check, retrievedContext);
      if (!verified.passes) {
        flagged.push({ match, check: pattern.check, issue: verified.issue });
      }
    }
  }

  return flagged;
}
```

Detected issues trigger one of three responses:
- **Add qualifier**: "Many Christian traditions agree..." rather than "All Christian traditions agree..."
- **Add context**: linguistic claims get the retrieved lexical entry surfaced alongside them
- **Flag for revision**: severe misattributions trigger a second model call to revise the specific claim

### Heterodox Content Detection

Heterodox content is a different category from contested interpretation. The platform serves a Christian user base studying Christian scripture. Some theological positions are internal debates within Christianity (Calvinism vs. Arminianism, different understandings of baptism). Others fall outside the boundaries of Christian orthodoxy in ways that most of the user base would not expect from a Bible study tool.

The heterodox detection is not a wide filter. It covers:

```typescript
const HETERODOX_MARKERS = [
  "Jesus was not divine",
  "Jesus was one of many equal paths to God",
  "the resurrection was metaphorical",
  "the Bible is not reliable",
  "all religions lead to the same God",
  "God does not exist",
];
```

These are not checked with pattern matching — the model might say any of these things in appropriate contexts (discussing challenges to Christian faith, explaining what heterodox positions hold, engaging with critical scholarship). They are flagged for context evaluation:

```typescript
async function evaluateHeterodoxContext(
  response: string,
  marker: string
): Promise<"affirming" | "describing" | "rejecting" | "neutral"> {
  return fastModel.complete({
    prompt: `In this response, is the following claim being:
- AFFIRMING: presented as true and recommended to the reader
- DESCRIBING: described as a position that some hold (without endorsement)
- REJECTING: critiqued or argued against
- NEUTRAL: mentioned in passing without clear stance

Claim: "${marker}"
Response excerpt: "${getExcerptAround(response, marker)}"

Respond with exactly one word: AFFIRMING, DESCRIBING, REJECTING, or NEUTRAL`,
    maxTokens: 10,
  });
}
```

Only `AFFIRMING` results trigger intervention. The platform can and should describe heterodox positions accurately when they are part of the scholarly or historical context — it should not affirm them as correct.

## Moderation Without Over-Moderation

The failure mode that receives less attention than under-moderation is over-moderation: a system that refuses, qualifies, or waters down responses to the point of being useless. For a theological platform, over-moderation looks like:

- Refusing to engage with passages that have been historically misused because any engagement is flagged as potentially harmful
- Surrounding every response about contested doctrines with so many disclaimers that the actual content is buried
- Treating all questions about hell, judgment, or divine wrath as requiring pastoral flagging
- Refusing to articulate any theological position because all positions are contested

Over-moderation is as much a failure as under-moderation. A user who comes to study Romans 9 and receives hedges and disclaimers instead of an engagement with what Calvin, Arminius, and contemporary scholarship actually say about the text has been failed by the moderation system even if no harmful content was generated.

The design principle: moderation should be invisible to users whose queries are legitimate. They should receive full, substantive responses. Moderation interventions should be rare and clearly warranted. The baseline should be trust, not suspicion.

This is enforced operationally by tracking the moderation intervention rate per query category. If word studies are triggering moderation at >1% of requests, the moderation system is mis-calibrated. The target intervention rate by category:

| Category | Expected intervention rate |
|---|---|
| Standard word studies | <0.1% |
| Contested doctrines (election, hell) | <1% |
| Difficult passages (genocide, slavery) | 2–5% (contextualization, not refusal) |
| Pastoral signals | ~1% (by prevalence, not over-flagging) |
| Manipulation patterns | <0.5% (rare by design) |

When actual rates exceed these targets, the moderation rules are reviewed — not to relax them, but to verify that they are triggering on genuine cases rather than false positives.

## Monitoring and Review

Moderation interventions are logged with enough context to be reviewed:

```typescript
interface ModerationEvent {
  eventId: string;
  userId: string;
  sessionId: string;
  timestamp: string;
  stage: "input" | "output" | "display";
  category: ModerationCategory;
  triggerPattern: string;
  action: "block" | "modify" | "add_context" | "route_pastoral";
  inputSummary: string;    // not the full message — privacy
  outputModified: boolean;
  reviewFlag: boolean;     // set when human review warranted
}
```

Events with `reviewFlag: true` enter a review queue. Human review focuses on:

- False positives: legitimate queries that triggered intervention
- Missed cases: user feedback indicating harmful content was generated
- Pattern drift: new manipulation patterns not covered by existing rules

The review process is how the moderation system improves over time. False positive patterns are used to make rules more precise. Missed cases are used to extend coverage. This loop — deploy, monitor, review, refine — is the operational discipline that keeps moderation calibrated to actual behavior rather than theoretical risk.

Moderation is not a feature you build once. It is a process you operate continuously. The theological domain makes it more complex than most, because the harms it guards against are often subtle — a misattributed position, a false consensus claim, a pastoral moment missed — rather than obvious. Getting it right requires both the technical infrastructure to detect and intervene and the ongoing human judgment to keep it calibrated.
