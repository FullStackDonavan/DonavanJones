---
title: "Tool Calling"
description: "How AI agents use tool calling for enhanced capabilities."
date: 2026-04-25
lastUpdated: "2026-06-09"
category: "ai-engineering"
tags:
  - ai-engineering
  - tools
  - agents
draft: false
cluster: "ai-engineering"
slug: tool-calling
author: Donavan Jones
---

# Tool Calling

A language model on its own is a text transformer. It takes text in, produces text out. It cannot look up a Bible verse, search a knowledge base, save a note, or check what the current date is. Its knowledge is frozen at training time. Its awareness of the world extends only as far as the context window it is given.

Tool calling changes this. It is the mechanism by which a model steps outside the text-in/text-out boundary and interacts with external systems. The model decides it needs information it does not have, invokes a tool to retrieve it, receives the result, and continues generating — all within a single inference flow. What looked like a limitation of the model becomes a question of what tools are made available to it.

This article covers how tool calling works at the API level, how to design tools that models use reliably, the failure modes specific to tool-based systems, and how the tool layer is structured on this platform.

*Part of the [AI Engineering series](/categories/ai-engineering).*

## How Tool Calling Works

Tool calling is a feature of the model API, not a framework or library. The model is given a list of tool definitions alongside the conversation. Each definition describes a function: its name, what it does, and what parameters it accepts. The model decides whether to call a tool, which tool to call, and with what arguments. The application executes the call and returns the result. The model continues.

The turn structure with tool calling:

```
1. Application sends: messages + tool definitions
2. Model responds: tool_use block (tool name + arguments)
3. Application executes the tool
4. Application sends: tool_result block (return value)
5. Model responds: final text response (or another tool call)
```

Steps 2–4 can repeat multiple times before the model produces a final text response. A complex query might require three or four tool calls in sequence as the model builds up the information it needs.

At the API level (using Anthropic's Messages API):

```typescript
const response = await anthropic.messages.create({
  model: "claude-opus-4-8",
  max_tokens: 1024,
  tools: [
    {
      name: "get_verse",
      description: "Retrieve the text of a Bible verse or passage by reference.",
      input_schema: {
        type: "object",
        properties: {
          reference: {
            type: "string",
            description: "Bible reference in standard format, e.g. 'Romans 8:28' or 'John 3:16-17'",
          },
          translation: {
            type: "string",
            enum: ["ESV", "NIV", "KJV", "NASB"],
            description: "Bible translation to use. Defaults to ESV if not specified.",
          },
        },
        required: ["reference"],
      },
    },
  ],
  messages: [
    { role: "user", content: "What does Paul say about suffering in Romans 5?" },
  ],
});

// Response may be a tool_use block
if (response.stop_reason === "tool_use") {
  const toolUse = response.content.find(b => b.type === "tool_use");
  // toolUse.name === "get_verse"
  // toolUse.input === { reference: "Romans 5:3-5", translation: "ESV" }
}
```

The model chose to call `get_verse` with `Romans 5:3-5` — it inferred the specific passage from the question without being told the exact reference. This inference is the core value of tool calling: the model bridges the gap between a natural language request and a structured function call.

## Tool Definition Design

The quality of a tool definition determines how reliably the model uses it correctly. A poorly written definition produces wrong tool calls, incorrect arguments, and model behavior that looks confused. A well-written definition produces predictable, correct tool usage almost every time.

### The Description Is the Contract

The `description` field in a tool definition is not documentation — it is a prompt. The model reads it to decide whether to call this tool and how. Every word matters.

Bad description:
```
"description": "Gets Bible content"
```

Good description:
```
"description": "Retrieve the exact text of one or more Bible verses or a contiguous passage by standard reference notation. Use this when you need the precise wording of a specific scripture. Do not use for searching by topic or theme — use search_passages for that."
```

The good description does three things:
1. States what the tool does precisely
2. States when to use it (precise wording, specific reference)
3. States when NOT to use it (searching by topic — use a different tool)

The negative instruction is often more important than the positive one. Without it, the model may call `get_verse` when it should call `search_passages`, because both are "Bible content" tools.

### Parameter Descriptions Guide Argument Construction

Each parameter description is also a prompt. The model uses it to decide what value to pass.

```typescript
{
  name: "search_passages",
  description: "Search for Bible passages semantically relevant to a topic, question, or theme. Returns the most relevant verses and short passages. Use when you need to find what scripture says about a concept, not when you already know the specific reference.",
  input_schema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Natural language description of what you are looking for. Be specific. 'suffering and perseverance' is better than 'hard times'. Include theological terms if relevant.",
      },
      testament: {
        type: "string",
        enum: ["old", "new", "both"],
        description: "Which testament to search. Use 'both' unless the context clearly indicates one testament is more relevant.",
      },
      limit: {
        type: "integer",
        description: "Maximum number of passages to return. Use 3-5 for focused answers, up to 10 for comprehensive coverage. Default is 5.",
        minimum: 1,
        maximum: 10,
      },
    },
    required: ["query"],
  },
}
```

Notice the guidance embedded in `query`'s description: "Be specific. 'suffering and perseverance' is better than 'hard times'." This directly shapes the model's query construction. Without it, the model might pass a vague query and get worse search results — then surface those worse results in its response.

### Enums Over Freeform Strings Where Possible

When a parameter has a constrained set of valid values, use `enum`. The model cannot guess that valid translation values are `"ESV"`, `"NIV"`, `"KJV"`, `"NASB"` — without an enum, it might pass `"English Standard Version"` or `"esv"` or `"New International"`. All technically reasonable; none matching the API's expected format.

Enums remove a whole class of argument construction errors.

### JSON Schema as a Safety Net

The `input_schema` is JSON Schema. Full validation applies: `required` fields, `minimum`/`maximum` on numbers, `pattern` on strings, nested object shapes. Use these constraints to catch malformed tool calls before they reach the tool implementation:

```typescript
{
  name: "save_study_note",
  input_schema: {
    type: "object",
    properties: {
      verse_ref: {
        type: "string",
        pattern: "^[a-z0-9_]+$",
        description: "Verse reference in slug format, e.g. 'rom_8_28'",
      },
      content: {
        type: "string",
        minLength: 10,
        maxLength: 2000,
        description: "The note content. Must be substantive — do not save empty or trivial notes.",
      },
      tags: {
        type: "array",
        items: { type: "string" },
        maxItems: 5,
        description: "Optional topic tags for the note.",
      },
    },
    required: ["verse_ref", "content"],
  },
}
```

A `content` field with `minLength: 10` prevents the model from saving an empty string or a one-word note. This is application logic expressed as a schema constraint — the model sees it and self-corrects before making the call.

---

*Explore more articles in the [AI Engineering series](/categories/ai-engineering).*

---

## The Tool Execution Layer

Tool definitions live in the model's prompt. Tool implementations live in the application. The boundary between them is where most tool calling bugs originate.

The tool router maps tool names to handler functions and manages execution:

```typescript
const toolHandlers: Record<string, ToolHandler> = {
  get_verse:        handlers.getVerse,
  search_passages:  handlers.searchPassages,
  save_study_note:  handlers.saveStudyNote,
  lookup_lexicon:   handlers.lookupLexicon,
  get_user_notes:   handlers.getUserNotes,
};

async function executeTool(
  toolUse: ToolUseBlock,
  context: RequestContext
): Promise<ToolResultBlock> {
  const handler = toolHandlers[toolUse.name];

  if (!handler) {
    return {
      type: "tool_result",
      tool_use_id: toolUse.id,
      is_error: true,
      content: `Unknown tool: ${toolUse.name}`,
    };
  }

  try {
    const result = await handler(toolUse.input, context);
    return {
      type: "tool_result",
      tool_use_id: toolUse.id,
      content: JSON.stringify(result),
    };
  } catch (err) {
    return {
      type: "tool_result",
      tool_use_id: toolUse.id,
      is_error: true,
      content: `Tool execution failed: ${(err as Error).message}`,
    };
  }
}
```

Three things this handles explicitly:

**Unknown tools**: if the model calls a tool not in the registry, return an error rather than throwing. The model can recover from a tool error and try a different approach. An uncaught exception aborts the entire inference loop.

**Execution errors**: tool handlers can fail for legitimate reasons (downstream service unavailable, invalid reference, permission denied). These errors are returned as `is_error: true` tool results — the model receives the error message and can respond appropriately ("I couldn't retrieve that passage — the reference may be formatted incorrectly").

**Request context propagation**: every handler receives the request context (user ID, session ID, permissions). The context is never passed through the model — it stays in the application layer. This prevents a class of prompt injection attacks where a malicious input tries to manipulate the model into calling a tool with elevated permissions.

## The Agentic Loop

When the model response contains a `tool_use` block, the application must continue the conversation with the tool result. This creates an agentic loop:

```typescript
async function runAgentLoop(
  messages: Message[],
  tools: Tool[],
  context: RequestContext,
  maxIterations = 10
): Promise<string> {
  let iteration = 0;

  while (iteration < maxIterations) {
    const response = await anthropic.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 2048,
      tools,
      messages,
    });

    // Add assistant's response to history
    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason === "end_turn") {
      // Model finished — extract final text
      const text = response.content
        .filter(b => b.type === "text")
        .map(b => b.text)
        .join("");
      return text;
    }

    if (response.stop_reason === "tool_use") {
      // Execute all tool calls in this response (may be multiple)
      const toolResults = await Promise.all(
        response.content
          .filter(b => b.type === "tool_use")
          .map(b => executeTool(b, context))
      );

      // Add tool results as a user turn
      messages.push({ role: "user", content: toolResults });
      iteration++;
      continue;
    }

    // Unexpected stop reason
    throw new Error(`Unexpected stop_reason: ${response.stop_reason}`);
  }

  throw new Error(`Agent loop exceeded max iterations (${maxIterations})`);
}
```

`maxIterations` is a safety bound. An agent that loops indefinitely — calling tools in a cycle, getting confused, calling the same tool again — burns API budget and never returns a response. Ten iterations is generous for any task on this platform; most complete in two or three. Exceeding the limit signals a problem with the tool definitions or the prompt, not a normal operating condition.

Multiple tool calls in a single response are executed in parallel (`Promise.all`). The model sometimes requests two independent lookups simultaneously — `get_verse` and `search_passages` in the same response block. There is no reason to serialize them.

## Failure Modes Specific to Tool Calling

**Argument hallucination**: the model constructs plausible-looking but wrong arguments. A verse reference like "Romans 5:3-5" is correct; "Romans 5:3-7" for the same passage is also plausible but incorrect. The tool handler must validate arguments rigorously — checking that a verse reference actually exists in the database, not just that it matches a pattern.

**Tool choice confusion**: given multiple tools with overlapping descriptions, the model picks the wrong one. Most common when tool descriptions are vague or do not include the "do not use when" guidance. Fix: sharpen the boundary conditions in descriptions and add negative instructions.

**Infinite tool loops**: the model calls a tool, receives a result, decides it needs more information, calls the tool again with slightly different arguments, and so on. This usually indicates the tool is not returning enough information or the model does not understand how to interpret the result. Fix: improve the tool's return format to include more context, or add examples to the tool description.

**Ignoring tool results**: the model calls a tool, receives a result, and then answers as if it never called it — from its training data instead of the retrieved content. This is more common with weaker models and with tool results that are poorly formatted. Fix: structure tool results clearly, with explicit labels (`"Verse text: ..."`) rather than bare content.

**Unauthorized action attempts**: a model that has access to a `save_study_note` tool might be manipulated by a malicious input into saving content the user did not intend. This is prompt injection via the tool surface. Fix: the context layer checks permissions before every tool execution regardless of what the model passes, and write-action tools confirm intent with the user before executing.

## Tools as the Agent's Senses

The right mental model for tools is that they are the agent's senses and actuators. Without tools, the model is blind to the current state of the world — it knows only what was in its training data and what has been explicitly placed in the context window. With tools, it can perceive: retrieve a verse, search for relevant passages, look up a word's Greek root, check what the user has studied before.

The quality of an agent's behavior is bounded by the quality of its tools. A well-designed tool makes a capability reliably available. A poorly-designed tool creates a capability that works intermittently, fails silently, or leads the model to incorrect conclusions. Investing in tool definitions — clear descriptions, constrained schemas, explicit negative instructions, well-formatted return values — pays dividends across every interaction that uses them.

The next article covers agent orchestration: how to compose multiple tools and multiple model calls into coherent multi-step reasoning processes.

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "ReAct: Synergizing Reasoning and Acting in Language Models (Yao et al., 2023)"
    url: "https://doi.org/10.48550/arXiv.2210.03629"
    type: "doi"
    description: "Foundational paper on ReAct — the reasoning + tool-use loop pattern that underpins modern agentic tool calling."
  - label: "Toolformer: Language Models Can Teach Themselves to Use Tools (Schick et al., 2023)"
    url: "https://doi.org/10.48550/arXiv.2302.04761"
    type: "doi"
    description: "Meta AI research showing how models learn when and how to call external tools through self-supervised training."
  - label: "Function (computer programming) — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Function_(computer_programming)"
    type: "wikipedia"
    description: "Background on the function abstraction that tool definitions mirror — tools are callable function signatures exposed to the model."
  - label: "Software Agent — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Software_agent"
    type: "wikipedia"
    description: "Overview of software agent concepts — the broader category that tool-calling AI agents belong to."
---
::

---

*[← Back to AI Engineering](/categories/ai-engineering)*
