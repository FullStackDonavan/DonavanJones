---
title: "From 34% to 98%: Teaching a 0.6B Model to Run My Homelab"
description: "Six dataset versions, two base models and one prompt bug: how a 600-million-parameter model on a Jetson Orin Nano learned to turn plain English into the right tool call 98% of the time."
date: 2026-11-02
lastUpdated: "2026-11-02"
category: "ai-engineering"
tags:
  - ai-engineering
  - tool-calling
  - fine-tuning
  - lora
draft: true
cluster: "ai-engineering"
slug: tiny-tool-calling-model-34-to-98
author: Donavan Jones
---

# From 34% to 98%: Teaching a 0.6B Model to Run My Homelab

My homelab dashboard has a command bar. Press Ctrl+K, type "restart whisper on the voice box" or "is Charlie ok", and it turns the sentence into a function call: `restart_service(device: "the voice box", service: "whisper")`. Checks run straight away. Anything that changes something shows a plan and waits for me to click Run.

The model behind it has 600 million parameters, runs on a Jetson Orin Nano at about 34 tokens a second, and gets the right call 98% of the time on wording it has never seen. Out of the box, the same model got 34%.

This is how it got from one to the other, including the parts that didn't work.

*Part of the [AI Engineering series](/categories/ai-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI engineering deep-dive in this series."
destinationUrl: "/categories/ai-engineering"
---
::

## Why a Tiny Model

A frontier model would handle these requests without any training. But the command bar sits in front of a lab where every gigabyte of GPU memory is spoken for: one Jetson runs Stable Diffusion, one runs speech, one runs the language model for a game world. A 7B model for the command bar would push one of them out.

A 0.6B model with a 20 MB LoRA adapter fits next to everything else. It doesn't need to reason. It needs to pick one of ten functions and copy a few words out of a short sentence, reliably. That's a narrow job, and narrow jobs are what small fine-tuned models are good at.

## The Scoreboard

From v3 on, every number is on the same held-out test: 103 questions phrased in ways the model never saw in training. v1 and v2 were scored on earlier, easier test splits (see Lesson 2), so treat their numbers as rough.

| Version | Model | What changed | Score |
|---|---|---|---|
| — | Qwen3 0.6B, untrained | nothing | 34% |
| v1 | FunctionGemma 270M | first dataset, 257 rows | 21% |
| v2 | FunctionGemma 270M | 825 rows, answers use internal IDs | 43% |
| v3 | FunctionGemma 270M | answers copy the user's own words | 77% |
| v4 | FunctionGemma 270M | targeted rows for v3's misses | 80% |
| v4 | Qwen3 0.6B | bigger base, served through Ollama's template | 85% |
| v4 | Qwen3 0.6B | same adapter, exact training prompt | 94% |
| v5 | Qwen3 0.6B | fixed a bias the v4 data created | 98% |

Training each version took about 20 minutes on an RTX 3090. The interesting part is what each step taught me.

## Lesson 1: Don't Make the Model Memorize Your IDs

In v2 the model was trained to answer with internal names: `device: "gpu-worker-2"`, `model: "qwen2.5-coder:3b"`. On new wording it did one of two things. It copied what I'd typed anyway ("the voice box"), which my code didn't recognize. Or it invented an ID that looked plausible and didn't exist.

v3 flipped it. The model copies the user's words into each argument, exactly as written, and a plain lookup table turns words into IDs. "The voice box", "Echo", "worker 2" and "the speech box" all resolve to the same Jetson in code. The model's job got easier, my code got the part that needs to be exact, and the score went from 43% to 77%.

If a small model is filling in arguments, let it copy. Do the mapping in code, where it's testable.

## Lesson 2: Hold Out Phrasings, Not Sentences

The first test set held out random sentences. The training set had "load qwen on charlie", the test had "load llama on nova", and the model passed by matching the template. That measures memory, not understanding.

From v3 on, the test set holds out whole phrasings: if "bring X up on Y" is a test template, no training row uses "bring … up". The scores dropped, and they started telling the truth.

## Lesson 3: Your Serving Prompt Must Be Your Training Prompt

Moving from FunctionGemma to Qwen3 0.6B on the same v4 data scored 85%. The misses were strange: simple status questions came back empty.

The cause had nothing to do with the model. Training renders each example with Qwen's own chat template. Ollama, serving the model, used its own template for Qwen3, which lays out the tool list slightly differently and opens a thinking block first. The model was being asked a question in a format it had never seen.

So the command bar now builds the exact training prompt itself (I checked it character for character against the tokenizer on 303 examples), sends it raw, and parses the `<tool_call>` tags directly. Same adapter, same weights: 85% became 94%.

When a fine-tuned model underperforms in production, compare the actual prompt it receives with the one it was trained on before you touch the data.

## Lesson 4: Your Fixes Can Teach New Mistakes

v4 added rows for v3's misses, including more benchmark examples. Several of them said "run": "run the benchmark for X", "how well does X run on Y". The model learned that "run" means benchmark. In the v4 Qwen results, "have worker 3 run the 3B llama" and "launch X on Y" turned into benchmark requests.

v5 fixed this with data on both sides: 160 load examples built on run, start, use and running, and benchmark examples that always say bench, benchmark, speed or test. It also added a few arithmetic and off-topic questions answered in plain text, after the model invented an `add` function for "what is 2 + 2". 98%.

Two misses remain, both "pop X onto Y" read as unload. "Pop" never appears in training. That's a real gap, and leaving it in the test is what keeps the number honest.

## Lesson 5: Pick by Score, Not by Date

I trained v5 twice with identical settings. The second run scored 96%, the first 98%. Two questions out of 103 is noise, but the command bar was set to use the newest deployed model, so it quietly switched to the weaker one.

Now it uses the deployed model with the best test score. A retrain has to beat the current one on the same questions before it takes over.

## Lesson 6: The Model Never Executes Anything

Even at 98%, the model isn't trusted. Its output goes through three gates:

1. **Resolve.** Words become IDs. An unknown Jetson, a model that isn't installed on that box, or a service that box doesn't run becomes a plain error, not an action.
2. **Validate.** One bug I found this way: "have Nova run the 3B llama" planned to load the 3B *Coder*, because Nova has no Llama and "3B" was the only shared word. Models now have to match by name, not just size.
3. **Confirm.** Read-only checks run at once. Anything that changes the lab shows exactly what it will do and waits for a click. Nothing destructive is a function at all.

A 2% error rate is fine when the cost of an error is reading a plan and clicking Cancel.

## What's Next

v6 adds five more functions: training status, cluster pod health, saved benchmark results, restarting an app, and freeing a Jetson's memory. Fifteen functions makes the prompt longer, and a 0.6B model gets less accurate as the list grows. I'll publish how that went in the next post.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Blueprint"
  supportingCopy: "All six dataset generators, the scoring harness, the exact-prompt serving code and the command bar ($39)."
  destinationUrl: "/products/tiny-tool-calling-model-blueprint"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Tool Calling"
  supportingCopy: "The basics of how models call tools, before you fine-tune one."
  destinationUrl: "/blog/ai-engineering/03-tool-calling"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get the v6 results and new fine-tuning breakdowns before they're public."
  ---
  :::
::

## Further Reading

::AuthoritativeLinks
---
title: "Authoritative Sources"
links:
  - label: "LoRA: Low-Rank Adaptation of Large Language Models"
    url: "https://arxiv.org/abs/2106.09685"
    type: "external"
    description: "The paper behind the 20 MB adapters used here."
  - label: "Qwen3 function calling — Qwen documentation"
    url: "https://qwen.readthedocs.io/en/latest/framework/function_call.html"
    type: "external"
    description: "The official tool-calling format the exact-prompt fix reproduces."
  - label: "PEFT — Hugging Face documentation"
    url: "https://huggingface.co/docs/peft"
    type: "external"
    description: "The library used to train the LoRA adapters."
---
::

---

*[← Back to AI Engineering](/categories/ai-engineering)*
