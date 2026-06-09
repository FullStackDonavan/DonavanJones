---
title: "AI Engineering Ideas"
description: "Brainstormed AI engineering topics and a draft planning note for new content."
date: 2026-07-16
category: "ai-engineering"
tags:
  - ai-engineering
  - ideas
  - planning
draft: false
slug: ai-engineering-ideas
author: Donavan Jones
---

# What I Learned Building an AI Bible Study Platform

This is the final article in the AI Engineering series, and I want to use it differently. The previous 23 articles have been technical deep-dives — embedding strategies, chunking decisions, retrieval pipelines, debate agents, OCR post-processing. This one steps back. What did this whole project teach me? What worked, what did not, what still does not, and where does the work go from here?

The series documented building something I actually use and care about. That changes the engineering in ways I did not fully anticipate when I started. This article is my attempt to be honest about what the experience was like — which problems were harder than expected, which turned out to be solved by things I had not originally planned, and what I would do differently if I were starting over.

*Part of the [AI Engineering series](/categories/ai-engineering).*

## What the Two Series Actually Built

The Backend Engineering series and the AI Engineering series are one system described from two angles. The Backend series covers the infrastructure: how data is stored, services communicate, embeddings are generated, queues are processed, GPUs are allocated. The AI series covers the intelligence: how retrieval works, how generation is constrained, how memory persists, how quality is evaluated.

Neither series is complete without the other. A brilliant retrieval strategy is useless if the embedding service has a batching bug that randomly drops vectors. A robust Postgres job queue does not help if the inference service prompt is poorly designed. The split into two series reflected how I think about the work — infrastructure first, then intelligence on top of it — but in practice, bugs at the infrastructure level often surface as AI quality failures, and AI design decisions often require infrastructure changes to implement.

If I were organizing this again, I would structure it as a single series with a clear through-line: what needs to be true at each layer for the one above it to work. The current split is accurate to how I built it, which was not always in the most logical order.

## What Worked Better Than Expected

**The retrieval pipeline.** RAG has become a standard approach, but the specific combination of multi-strategy retrieval (semantic + BM25 + graph traversal + direct lookup), cross-encoder reranking, and tradition-weighted context assembly turned out to work remarkably well for theological content. The quality gap between "single semantic search" and "full pipeline" is larger than I expected — retrieval precision improvements have a larger effect on response quality than model improvements at the same cost. If I had to pick one engineering investment that returned the most value, it would be the reranker.

**Citation grounding.** I was not certain this would actually change how users experienced responses. It does, dramatically. Users who can see the verse text in the citation panel — and can see the support level classification next to each citation — engage with the responses as evidence to evaluate rather than answers to accept. This is exactly the relationship with scripture the platform is trying to support. Citation grounding is not just a quality feature. It is a product philosophy made concrete.

**Debate agents.** When I designed the debate pipeline, I was not sure it would feel natural or if the output would be useful. In practice, it produces something that single-agent responses genuinely cannot: the experience of hearing two thoughtful interlocutors argue from their own sources. Users who ask about election, free will, or the scope of atonement and receive a structured Reformed-vs-Arminian exchange leave the interaction with something more valuable than a tidy answer — they leave with a map of the actual disagreement. That is what serious study needs.

**Memory as the differentiator.** I knew abstractly that memory would make the system better. What I did not fully anticipate is how much it changes the user's relationship with the platform. A system that knows you have spent three weeks working through Romans and have an open question about Romans 9:16 feels qualitatively different from one that treats every session as a blank slate. The engineering work — episodic extraction, semantic synthesis, position storage — is unglamorous. The product outcome is what turns a capable tool into something that feels like it knows you.

## What Required More Iteration Than Expected

**Hallucination reduction.** I wrote article 14 as if hallucination reduction is a solved problem with known techniques. It is not. It is an ongoing engineering discipline. Every technique described — retrieval grounding, prompt constraints, post-generation checking, confidence calibration — reduces the hallucination rate. None of them push it to zero. The long tail of hallucinations that survive all checks is still there, and it consists of the most subtle failures: plausible interpretive connections that are not actually in the scholarly record, confident theological attributions that are directionally correct but slightly wrong in specifics, synthesis claims that no single source supports but that the model has assembled convincingly from adjacent sources.

I have not solved this. What I have done is make the failures visible (through confidence indicators and citation annotation) and traceable (through the feedback pipeline). The honest position is that hallucination reduction is never done — it is a continuous effort to push the frontier of what the system confidently asserts toward what it can actually verify.

**Theological consistency.** Article 18 describes the consistency engineering that exists. What it does not convey is how long it took to realize consistency was a problem. For the first several months of building, I was focused on single-response quality: does this response correctly answer this question? It took user testing with people who used the platform regularly to surface the consistency issue. The same user asking about the same passage in different sessions was sometimes getting responses that implied different theological positions — not dramatically different, but enough to notice. The position memory and tradition profile systems were built in response to observed real-world failures, not designed upfront.

**Prompt engineering.** I thought prompt engineering would be solved work — write the system prompt, iterate a few times, move on. Instead it is continuous. Every significant change to the retrieval pipeline, the memory system, or the model version requires prompt evaluation and usually prompt revision. The constraints that work for Claude Sonnet 4.6 are not identical to the constraints that worked for earlier versions. The prompts that work well for Reformed users are subtly different from those that work well for users with no tradition identification. Prompt engineering is not a task that gets done. It is a practice that continues as long as the system is operating.

**Evaluation.** The hardest ongoing work is not building features — it is measuring whether they work. Single-response evaluation is tractable. End-to-end evaluation — does the system serve users well across the full distribution of queries, over multiple sessions, across different theological backgrounds — is genuinely hard. My current evaluation suite covers known cases reasonably well. It does not cover the unknown cases well, by definition. The production feedback loop (flagged responses, session abandonment signals, follow-up question patterns) is the only window into failure modes that evaluation sets do not anticipate.

## What I Would Do Differently

**Start with the evaluation set.** The 300-query ground truth evaluation set I built for retrieval quality should have existed before the first line of RAG code. Instead, it was built months in, after I had already made many retrieval decisions that would have been made differently if I had been evaluating against a concrete benchmark from the start. Evaluation-first is the correct methodology. I did not follow it because building the evaluation set felt like overhead when there was infrastructure to build. It was not overhead — it was the foundation.

**Invest earlier in the domain dictionary.** The pronunciation dictionary for voice narration (340 entries), the OCR domain dictionary (28,000 theological terms), and the embedding glossary normalization all do essentially the same thing: they encode domain knowledge that the base models lack. I built each independently, at different times, for different pipeline stages. A unified theological term knowledge base, built early and referenced by every stage that needs domain vocabulary, would have been more efficient than three separate domain knowledge investments.

**Take moderation more seriously from the start.** The moderation article describes a thoughtful system. It was not thoughtful from day one. The pastoral detection, manipulation pattern recognition, and heterodox content checks were all added in response to actual failure cases observed in testing. A few of those failures were uncomfortable. They would have been better handled by a system designed for them than by the reactive additions the system now has. Moderation for theological AI is not standard content filtering — it requires domain-specific thinking that I should have done earlier.

---

*Explore more articles in the [AI Engineering series](/categories/ai-engineering).*

---

## What Is Still Unsolved

**Fine-tuned embeddings.** The embedding strategies article mentions fine-tuning as "the next logical step." It still is. The theological vocabulary normalization and instruction prefixes improve retrieval quality, but a model fine-tuned on theological query-passage pairs would represent the semantic relationships in this domain more accurately than any general-purpose model. Building the training set — thousands of annotated query-passage pairs with positive and hard negative examples — is the blocking work. It is substantial but finite, and retrieval quality gains from a domain-fine-tuned model would cascade through every RAG-dependent feature on the platform.

**Better Greek manuscript OCR.** The OCR pipeline handles printed Greek in modern critical editions well. It handles scanned manuscript Greek poorly. The polytonic character recognition, ligature handling, and scriptio continua segmentation problems for actual manuscript images are not solved by adding post-processing layers to a general OCR engine. Solving this properly requires either a specialized manuscript OCR model (there are research efforts in this direction — Transkribus, the HTR United models) or accepting that primary manuscript digitization is out of scope and relying on existing critical editions. I have not decided.

**Multimodal input.** Users study with physical Bibles. They underline, annotate margins, and write notes in the text. Getting that personal annotation data into the system — through a photo of a marked-up page — would complete the memory system in a way that no text-based note-taking feature can. The OCR pipeline for printed text with handwritten annotations is solvable; the semantic interpretation of "what does this underline mean to this user" is harder. I have prototyped this but not shipped it.

**The pastoral boundary.** Moderation article 20 describes detecting pastoral contexts and routing them to crisis resources or sensitivity-modified responses. What it does not describe is a positive vision for what the system should do in those moments beyond flagging them. There is a real question about whether an AI Bible study tool should engage at all with grief, doubt, and crisis — or whether it should always redirect to human community. I have chosen the intermediate path (route crisis to resources, soften sensitivity-flagged responses) but I am not confident it is right. This is less an engineering question than a product ethics question that I continue to think about.

**Personalized study plans.** The memory system knows what a user has studied. It knows where they are theologically, what questions they are working through, what passages they engage with deeply. What it does not do is proactively suggest what to study next — a curriculum that builds on what the user already knows toward the theological questions they are working toward. The data exists. The retrieval and generation infrastructure exists. The missing piece is a planner that reasons about pedagogical sequence across theological topics. This is on the roadmap.

## The Meta-Lesson

Building AI for a domain you care about deeply is different from building AI tools generally. The theological constraints I worked within — epistemic humility about interpretation, honest representation of traditions, pastoral sensitivity, citation transparency — turned out to be good engineering constraints. They forced the system to be more honest about what it knows, more careful about what it claims, more respectful of the complexity it is navigating.

The hardest problems in this system are not at the algorithmic layer. Reranking algorithms are well-understood. Transformer architectures are well-understood. The hard problems are at the intersection of AI and theology: How do you represent genuine interpretive disagreement without false balance? How do you ground theological claims in texts that have been interpreted seventeen different ways without choosing for the user? How do you build a system that feels knowledgeable without becoming authoritative about things that are genuinely contested?

These are not engineering questions with engineering answers. They are questions about what kind of tool the platform should be. The engineering serves those questions — retrieval, memory, citation, moderation are all implementations of product decisions about what the right relationship between an AI assistant and a user studying scripture should look like.

The series is not a definitive reference for building theological AI. It is one person's account of building one system, making specific choices at each layer, and learning from what worked and what did not. The choices made here are defensible but not uniquely correct — someone building a similar platform would make different decisions at several of these layers and might produce something better.

What I hope the series conveys is the shape of the problem: how many layers there are, how each layer creates constraints and opportunities for the layers above it, and how domain knowledge — about scripture, about how people study, about what theological accuracy means — has to permeate the system design rather than being left to the model. The model is capable. It needs to be given the right context, the right constraints, and the right evidence to work from. Building all of that is the engineering.

There is more to build. There will always be more to build. That is not a complaint — it is the condition of working on something that matters.

---

*[← Back to AI Engineering](/categories/ai-engineering)*
