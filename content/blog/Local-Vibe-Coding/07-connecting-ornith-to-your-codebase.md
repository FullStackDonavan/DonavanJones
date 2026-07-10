---
title: "Connecting Ornith to Your Own Codebase"
description: "How to give a local model real awareness of an existing codebase — indexing, retrieval, and context assembly for large repositories."
date: 2026-02-23
lastUpdated: "2026-07-09"
category: "local-vibe-coding"
tags:
  - local-vibe-coding
  - ornith
  - retrieval
draft: true
slug: connecting-ornith-to-your-codebase
author: Donavan Jones
---

# Connecting Ornith to Your Own Codebase

A model with no knowledge of your codebase's structure, conventions, and existing utilities will confidently reinvent things that already exist. Giving Ornith real awareness of a large repository — beyond whatever fits in a single context window — requires the same retrieval patterns used for RAG, applied to code instead of documents. In OpenClaw this lives as its own skill, `repository-memory` — rather than being inlined into the coding agent itself, it's a dedicated step the `coding-agent` skill calls into before Ornith-1.0-35B writes or reviews a single line, so the model that ends up planning and editing already has the codebase's conventions in front of it instead of guessing at them. The work splits across two machines: Jetson #1 does the parsing and embedding, and the resulting vectors get stored in Weaviate on a separate storage server, not on the Jetson board itself.

*Part of the [Local Vibe Coding series](/categories/local-vibe-coding).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every local vibe coding deep-dive in this series."
destinationUrl: "/categories/local-vibe-coding"
---
::

## Why Dumping the Whole Repo Doesn't Work

Even at a generous 32K token context window, a mid-sized codebase doesn't fit. And even where it technically would fit, dumping every file into every request wastes the model's attention on irrelevant code and slows every single call down. The fix is the same one used in document RAG: index the codebase, retrieve only what's relevant to the current task, and assemble a focused context.

## Indexing Approach

I chunk by function and class rather than by fixed-size text blocks — code has natural semantic boundaries that fixed-size chunking ignores, and splitting a function in half produces a chunk that means nothing on its own.

```python
import ast

def extract_chunks(filepath):
    tree = ast.parse(open(filepath).read())
    chunks = []
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.ClassDef)):
            source = ast.get_source_segment(open(filepath).read(), node)
            chunks.append({
                "name": node.name,
                "type": type(node).__name__,
                "file": filepath,
                "source": source,
            })
    return chunks
```

Each chunk gets embedded on Jetson #1 (using the fast nomic-embed-text model, rather than burning Ornith-1.0-35B's cycles on it) and written to Weaviate on the storage server, stored with its file path and containing class/module for retrieval-time context.

## Retrieval at Task Time

```
1. Embed the current task description
2. Vector search against the function/class index → top-k relevant chunks
3. Also grab the file(s) the task explicitly references, in full
4. Include a directory tree summary for structural orientation
5. Assemble into the context sent to Ornith-1.0-35B — the same context it holds onto for its own self-review pass after producing a diff
```

Step 3 matters as much as step 2 — semantic search finds *related* code, but if the user explicitly names a file, that file needs to be included in full regardless of what the embedding search ranks it.

## Keeping the Index Fresh

Code changes constantly, and a stale index causes the agent to reference functions that have since been renamed or removed. I re-index on a file-watch trigger rather than a fixed schedule — any file save inside the tracked directories re-embeds just that file's chunks, which keeps the index current without a full re-index on every change.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how codebase retrieval fits into the full local AI development environment."
destinationUrl: "/systems/local-vibe-coding"
---
::

## What Improves and What Doesn't

Codebase-aware retrieval meaningfully reduces the "reinvented a utility that already exists" failure mode and improves consistency with existing naming conventions. It doesn't fix deeper architectural blindness — a model can retrieve the right functions and still miss that a proposed change violates an invariant that lives three modules away and isn't captured in any single chunk. That class of failure needs a human reviewing the diff, same as it does with any AI coding tool.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The AI Starter Kit"
  supportingCopy: "Get the Self-Hosted AI Starter Kit — embedding pipeline templates and RAG architecture diagrams ($29)."
  destinationUrl: "/products/self-hosted-ai-starter-kit"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Building Your Own Coding Assistant"
  supportingCopy: "See the full assistant this retrieval layer supports."
  destinationUrl: "/blog/local-vibe-coding/building-your-own-coding-assistant"
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
  - label: "Abstract Syntax Tree — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Abstract_syntax_tree"
    type: "wikipedia"
    description: "The code representation used to chunk by function/class boundary rather than fixed-size text blocks."
  - label: "Retrieval-Augmented Generation — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation"
    type: "wikipedia"
    description: "The general retrieval pattern applied here to source code instead of documents."
---
::

---

*[← Back to Local Vibe Coding](/categories/local-vibe-coding)*
