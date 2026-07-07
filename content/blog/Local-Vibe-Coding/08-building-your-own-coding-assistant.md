---
title: "Building Your Own Coding Assistant"
description: "A general blueprint for building a local coding assistant from the pieces covered in this series — model, retrieval, tools, and the agent loop."
date: 2026-03-02
lastUpdated: "2026-06-09"
category: "local-vibe-coding"
tags:
  - local-vibe-coding
  - agents
  - architecture
draft: true
slug: building-your-own-coding-assistant
author: Donavan Jones
---

# Building Your Own Coding Assistant

By this point in the series, every individual piece has been covered — a model pair (Ornith-9B drafting, Ornith-1.0-35B verifying), a runtime (Ollama), a retrieval layer for codebase awareness, and an agent loop (OpenClaw). This article is the assembly instructions: how those pieces fit together into something you'd actually use daily, and the decisions that matter most when building your own version.

*Part of the [Local Vibe Coding series](/categories/local-vibe-coding).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every local vibe coding deep-dive in this series."
destinationUrl: "/categories/local-vibe-coding"
---
::

## The Four Layers

```
┌─────────────────────────────────────┐
│  Interface (CLI / editor extension) │
├─────────────────────────────────────┤
│  Agent Loop (plan → act → verify)   │
├─────────────────────────────────────┤
│  Retrieval (codebase index/search)  │
├─────────────────────────────────────┤
│  Model Runtime (Ollama + Ornith)    │
└─────────────────────────────────────┘
```

Each layer is independently replaceable. The interface can be a bare CLI or a full editor extension. The agent loop can be as minimal as the 150-line version covered earlier in this series or as featured as OpenClaw, with or without a verification stage between draft and human review. The retrieval layer can be skipped entirely for small codebases. The model runtime is the one layer that's genuinely load-bearing — everything above it depends on the model (or models) actually being capable enough to drive the loop.

## Decisions That Matter Most

**Start with the interface you'll actually use.** A coding assistant that requires switching to a terminal and typing a command is friction that compounds — I underestimated this initially and found usage dropped off within days until I wired OpenClaw into a lightweight editor extension that surfaces the diff review inline.

## From Terminal to Editor

The CLI version prints the final diff as text and stops — fine for a demo, bad for daily use, because reading a unified diff in a terminal and then manually applying it defeats half the point of an agent. Getting it into the editor took two changes: OpenClaw had to stop printing prose and start emitting structured events, and something on the editor side had to be listening for them.

**OpenClaw side — swap stdout prose for an event stream.** The CLI already moves through named stages (draft, verify, retry, escalate, final diff); the only change is emitting each as a JSON line instead of a sentence:

```bash
openclaw run --json "Add input validation to the signup form in src/forms/signup.py"
```

```json
{"event": "draft_started", "model": "ornith-9b"}
{"event": "tool_call", "name": "read_file", "args": {"path": "src/forms/signup.py"}}
{"event": "verify_started", "model": "ornith-1.0-35b"}
{"event": "verify_passed"}
{"event": "final_diff", "file": "src/forms/signup.py", "diff": "@@ -12,6 +12,9 @@..."}
```

Nothing about the loop itself changes — it's the same draft → verify → retry/escalate sequence from the core loop, just narrated as events instead of printed as text.

**Editor side — a thin extension that shells out and renders.** The extension doesn't reimplement any of the agent logic; it spawns the CLI, reads the JSON lines, and reacts to whichever events it cares about:

```typescript
const proc = spawn('openclaw', ['run', '--json', task]);

readline.createInterface({ input: proc.stdout }).on('line', (line) => {
  const event = JSON.parse(line);

  if (event.event === 'final_diff') {
    const original = vscode.Uri.file(event.file);
    const proposed = vscode.Uri.parse(`openclaw-diff:${event.file}`); // virtual doc holding the proposed content
    vscode.commands.executeCommand('vscode.diff', original, proposed, 'OpenClaw: Proposed Change');
  }

  if (event.event === 'confirmation_required') {
    vscode.window.showWarningMessage(
      `OpenClaw wants to run: ${event.command}`,
      'Approve', 'Deny'
    ).then((choice) => proc.stdin.write(JSON.stringify({ approved: choice === 'Approve' }) + '\n'));
  }
});
```

`vscode.diff` is doing the real work here — it's the same native side-by-side view VS Code uses for its own source control diffs, fed a real file on one side and a virtual, in-memory document holding the proposed content on the other. The human review step from the core loop doesn't move — it's still "see the diff, then decide" — it just happens as a VS Code diff view with Accept/Reject buttons in the editor tab instead of a wall of text in a terminal. Accepting writes the virtual document's content to disk; rejecting closes the diff and discards it, same as ignoring the CLI's printed diff would.

The `confirmation_required` event follows the same pattern for the mid-loop gates (`run_command`, `delete_file`) — instead of blocking on a terminal `y/n`, it's a VS Code notification with buttons, and the extension writes the approval back to the CLI process's stdin so the loop can continue.

**Confirmation gates before features.** It's tempting to build retrieval, multi-file editing, and test-running before locking down which operations require human approval. Do the safety model first — retrofitting it after the agent already has broad, ungated write access to your filesystem is a bad position to be building from.

**Budget for iteration, not perfection.** The first version of the agent loop will get stuck in loops, misinterpret tasks, and occasionally do something you didn't ask for. That's expected — the value comes from tightening the loop over weeks of real use, not from getting the design right on paper before writing any code.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See the complete local AI development environment this assistant runs inside."
destinationUrl: "/systems/local-vibe-coding"
---
::

## Is It Worth Building Instead of Using Something Existing

If your goal is just "use AI to code faster," an existing tool is almost certainly the faster path — Claude Code, Cursor, and similar are more polished than anything built solo, and covered elsewhere in this series against exactly that tradeoff. Building your own makes sense for a narrower set of reasons: genuine data-privacy requirements that rule out any hosted option, a specific integration need existing tools don't support, or — the reason I did it — wanting to actually understand every layer of how these tools work rather than treating them as a black box.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The AI Starter Kit"
  supportingCopy: "Get the Self-Hosted AI Starter Kit — the full architecture blueprint for a local AI stack ($29)."
  destinationUrl: "/products/self-hosted-ai-starter-kit"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Why I Stopped Paying for Claude"
  supportingCopy: "The full story of why this build happened in the first place."
  destinationUrl: "/blog/local-vibe-coding/why-i-stopped-paying-for-claude"
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
  - label: "Separation of Concerns — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Separation_of_concerns"
    type: "wikipedia"
    description: "The design principle behind splitting the assistant into independently replaceable layers."
  - label: "Ollama — Official Site"
    url: "https://ollama.com"
    type: "external"
    description: "The model runtime layer this entire architecture depends on."
  - label: "VS Code Extension API — Official Documentation"
    url: "https://code.visualstudio.com/api"
    type: "external"
    description: "Reference for the extension host, virtual documents, and the vscode.diff command used to surface the diff review inline."
---
::

---

*[← Back to Local Vibe Coding](/categories/local-vibe-coding)*
