---
title: "Building Your First AI Coding Agent That Runs Completely Offline"
description: "Build your first offline AI coding agent: a minimal Python loop with three tools (read, write, run) against a local Ollama model, and where it breaks at scale."
date: 2026-09-07
lastUpdated: "2026-11-14"
category: "local-vibe-coding"
tags:
  - local-vibe-coding
  - agents
  - offline
draft: false
slug: first-offline-ai-coding-agent
author: Donavan Jones
excerptImage: /img/blog/local-vibe-coding/06-first-offline-ai-coding-agent.jpg
---

# Building Your First AI Coding Agent That Runs Completely Offline

An offline AI coding agent is just a loop: send the task to a local model, execute whatever tool it asks for (read a file, write a file, run a command), feed the result back, and stop when it returns a final answer. You don't need OpenClaw's full feature set to have one working by this afternoon; the minimum viable version is under 150 lines of Python. This is that version, stripped to its essentials so the pattern is obvious.

*Part of the [Local Vibe Coding series](/categories/local-vibe-coding). See the [Local Vibe Coding hub](/systems/local-vibe-coding) for the full system.*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every local vibe coding deep-dive in this series."
destinationUrl: "/categories/local-vibe-coding"
---
::

## The Three Tools You Actually Need

Every useful coding agent, no matter how sophisticated it eventually becomes, starts from the same three primitives:

**`read_file(path)`** — gives the model visibility into existing code. Without this, every request requires you to manually paste in context.

**`write_file(path, content)`** — lets the model make changes without you manually copying its output back into your editor.

**`run_command(cmd)`** — lets the model run tests, linters, and builds to verify its own work rather than guessing.

Everything else — search, multi-file diffs, git integration — is a refinement on top of these three.

## Minimal Loop

```python
import ollama

def read_file(path):
    return open(path).read()

def write_file(path, content):
    open(path, 'w').write(content)
    return f"Wrote {len(content)} bytes to {path}"

def run_command(cmd):
    import subprocess
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout + result.stderr

TOOLS = {
    "read_file": read_file,
    "write_file": write_file,
    "run_command": run_command,
}
# TOOL_SCHEMAS: one JSON-schema function definition per tool above (omitted for brevity)

def agent_loop(task, model="qwen3:4b"):  # any Ollama model that reports the `tools` capability
    messages = [{"role": "user", "content": task}]
    for _ in range(10):  # hard cap prevents runaway loops
        response = ollama.chat(model=model, messages=messages, tools=TOOL_SCHEMAS)
        messages.append(response["message"])
        if not response["message"].get("tool_calls"):
            return response["message"]["content"]  # final answer
        for call in response["message"]["tool_calls"]:
            result = TOOLS[call["function"]["name"]](**call["function"]["arguments"])
            messages.append({"role": "tool", "content": str(result)})
    return "Hit iteration limit without a final answer."
```

The iteration cap matters more than it looks — a small local model is more prone than a frontier model to getting stuck in a loop (re-reading the same file, re-running the same failing command) without a hard stop.

One caveat: this uses Ollama's native `tools` parameter, which only works for models whose template supports it (`ollama show <model>` lists the capability). Ornith-1.0-35B, the model I actually use for coding, doesn't report it, so in OpenClaw the model returns a JSON object in its message content and the loop parses that instead. The [Ollama setup post](/blog/local-vibe-coding/02-running-ornith-locally-with-ollama) shows that protocol, and [Tool Calling](/blog/ai-engineering/03-tool-calling) covers the general pattern.

## Where This Breaks Down at Scale

This minimal version has no context management — every tool result gets appended to `messages` forever, which will eventually blow past the context window on a long session. It also has no confirmation gate, so `run_command` will happily execute anything the model asks, including destructive commands. And it trusts whatever the model returns as a final answer — there's no self-review checking the diff before it's applied. All three are exactly the gaps OpenClaw's fuller implementation closes: instead of one `agent_loop` function doing everything, a router hands the task to a `repository-memory` skill for context, then a `coding-agent` skill — running a larger model with enough capacity to review its own diff before returning it — and a task it flags as uncertain goes to an `ask-claude-fix` skill instead of looping forever.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how this pattern scales into a full local AI development environment."
destinationUrl: "/systems/local-vibe-coding"
---
::

## Why Build This Yourself At All

Using this minimal loop directly in production is a bad idea — but building it once, by hand, is the fastest way to understand exactly what a coding agent is actually doing under the hood of a polished tool like Claude Code or Cursor. Once you've written the loop yourself, "the agent read three files and then wrote a diff" stops being a black box and becomes a debuggable sequence of tool calls you can reason about.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The AI Starter Kit"
  supportingCopy: "Get the Self-Hosted AI Starter Kit — full agent architecture and tool-calling patterns ($29)."
  destinationUrl: "/products/self-hosted-ai-starter-kit"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Connecting Ornith to Your Own Codebase"
  supportingCopy: "Add real codebase context to this minimal loop."
  destinationUrl: "/blog/local-vibe-coding/07-connecting-ornith-to-your-codebase"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get new local AI breakdowns delivered before they're public."
  ---
  :::
::

## Further Reading

::AuthoritativeLinks
---
title: "Authoritative Sources"
links:
  - label: "Ollama Python Library — GitHub"
    url: "https://github.com/ollama/ollama-python"
    type: "external"
    description: "The Python client used for the minimal agent loop above."
  - label: "Function Calling — OpenAI API Documentation"
    url: "https://platform.openai.com/docs/guides/function-calling"
    type: "external"
    description: "The tool/function-calling schema format that Ollama and most local models implement compatibly."
---
::

## Related reading

- [OpenClaw from Scratch](/blog/local-vibe-coding/05-openclaw-from-scratch) — previous in the series: the full version of this loop.
- [Connecting Ornith to Your Own Codebase](/blog/local-vibe-coding/07-connecting-ornith-to-your-codebase) — next: giving the loop real codebase context.
- [Local Vibe Coding hub](/systems/local-vibe-coding) — the whole system on one page.
- [Local Agent Systems](/blog/ai-engineering/07-local-agent-systems) — the same idea applied beyond coding.

---

*[← Back to Local Vibe Coding](/categories/local-vibe-coding)*
