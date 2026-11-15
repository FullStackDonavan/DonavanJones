---
title: "Connecting Ornith to Your Own Codebase"
description: "Connecting Ornith-1.0-35B to your codebase: AST chunking, code embeddings in Weaviate, task-time retrieval, and a fresh index for a local coding agent."
date: 2026-09-21
lastUpdated: "2026-11-14"
category: "local-vibe-coding"
tags:
  - local-vibe-coding
  - ornith
  - retrieval
draft: false
slug: connecting-ornith-to-your-codebase
author: Donavan Jones
excerptImage: /img/blog/local-vibe-coding/07-connecting-ornith-to-your-codebase.jpg
---

# Connecting Ornith to Your Own Codebase

To connect a local model like Ornith to your own codebase, chunk the code by function and class, embed those chunks into a vector database, and retrieve only the relevant pieces (plus any files the task names) for each request. Without that, a model with no knowledge of your codebase's conventions will confidently reinvent utilities that already exist. It's the same retrieval pattern used for RAG, applied to code instead of documents. In OpenClaw this lives as its own skill, `repository-memory` — rather than being inlined into the coding agent itself, it's a dedicated step the `coding-agent` skill calls into before Ornith-1.0-35B writes or reviews a single line, so the model that ends up planning and editing already has the codebase's conventions in front of it instead of guessing at them. A background indexing job does the parsing and embedding, and the vectors live in Weaviate running in-cluster, off the inference hardware.

*Part of the [Local Vibe Coding series](/categories/local-vibe-coding). See the [Local Vibe Coding hub](/systems/local-vibe-coding) for the full system.*

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

Each chunk gets embedded with a small dedicated embedding model (nomic-embed-text, rather than burning Ornith-1.0-35B's cycles on it) and written to Weaviate, stored with its file path and containing class/module for retrieval-time context. [Embedding Strategies](/blog/ai-engineering/11-embedding-strategies) covers how to choose that model.

## Retrieval at Task Time

```
1. Embed the current task description
2. Vector search against the function/class index → top-k relevant chunks
3. Also grab the file(s) the task explicitly references, in full
4. Include a directory tree summary for structural orientation
5. Assemble into the context sent to Ornith-1.0-35B — the same context it holds onto for its own self-review pass after producing a diff
```

Step 3 matters as much as step 2 — semantic search finds *related* code, but if the user explicitly names a file, that file needs to be included in full regardless of what the embedding search ranks it.

One lesson I carried over from VerseHub: make retrieval failures loud. There, a retrieval call that silently failed returned an empty list, and the model went on to produce confident answers with no evidence behind them. It now raises instead, and the same rule applies here — if the vector search errors, the coding agent should stop, not improvise. The full story is in [Verification Pipeline for AI Outputs](/blog/versehub-engineering/06-verification-pipeline-for-ai-outputs).

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
  destinationUrl: "/blog/local-vibe-coding/08-building-your-own-coding-assistant"
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

## Related reading

- [Building Your First AI Coding Agent That Runs Completely Offline](/blog/local-vibe-coding/06-first-offline-ai-coding-agent) — previous in the series: the minimal agent loop.
- [Building Your Own Coding Assistant](/blog/local-vibe-coding/08-building-your-own-coding-assistant) — next: the full assistant this retrieval layer supports.
- [Local Vibe Coding hub](/systems/local-vibe-coding) — the whole system on one page.
- [Building an AI Copilot That Understands Your Entire Codebase](/blog/agentic-ai-systems/06-building-an-ai-copilot-that-understands-your-codebase) — the same problem from the agent-systems side.

---

*[← Back to Local Vibe Coding](/categories/local-vibe-coding)*
