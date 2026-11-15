---
title: "The Biggest Mistakes I Made Building My AI Homelab"
description: "My biggest AI homelab mistakes: a control-plane IP change, a 9B model on an 8GB Jetson, page-cache OOMs, a ServiceLB label, and silent RAG failures."
date: 2026-11-11
lastUpdated: "2026-11-14"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - retrospective
draft: false
slug: biggest-mistakes-building-ai-homelab
author: Donavan Jones
excerptImage: /img/blog/ai-homelab-engineering/15-biggest-mistakes-building-ai-homelab.jpg
---

# The Biggest Mistakes I Made Building My AI Homelab

My biggest AI homelab mistakes weren't exotic: I didn't pin down the control plane's address, I tried to run a model too big for an 8 GB Jetson, I trusted `free -h`, I didn't understand a k3s ServiceLB node label, and I let a RAG pipeline fail silently. Every homelab writeup shows the finished architecture; fewer show the false starts. These are the ones that cost me the most time.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering). For the full system map, see the [AI homelab architecture hub](/systems/ai-homelab).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI homelab deep-dive in this series."
destinationUrl: "/categories/ai-homelab-engineering"
---
::

## Mistake 1: Letting the Control Plane's IP Change

k3s workers register against the control plane's address, and certificates and kubeconfigs bake it in too. When my control plane's IP changed, the cluster didn't heal itself — it needed a real recovery, which I documented in [recovering a K3s cluster after a control plane IP change](/blog/infrastructureengineering/44-recovering-after-control-plane-ip-change). Setting static reservations at the router level takes ten minutes and should be the very first infrastructure decision, not a fix applied after an outage.

## Mistake 2: Putting a 9B Model on an 8 GB Jetson

For a draft→verify coding-agent setup, I ran Ornith-1.0-9B as the drafter on a Jetson Orin Nano Super, with Ornith-1.0-35B verifying on the RTX 3090. The 9B barely fit — about 5.3 GB, with a 4K context ceiling — and ran at roughly 3 tok/s end to end. A drafter that slow defeats the purpose, so I retired it. The same board runs llama3.2:3b at 20.8 tok/s. The lesson: size the model to the board, not the board to the model. That's the reasoning behind the [RTX 3090 + Jetson hybrid architecture](/blog/ai-homelab-engineering/03-rtx-3090-jetson-orin-hybrid-architecture).

## Mistake 3: Trusting `free -h` on a Jetson

Models would OOM on load while `free -h` cheerfully reported memory "available." On a Jetson, the CUDA allocator can't reclaim page cache, and CPU and GPU share the same 8 GB. The fix is to stop the old model and run `sync; echo 3 > /proc/sys/vm/drop_caches` before loading the next one — and to accept that only one ~4-5 GB model fits per board.

## Mistake 4: Not Understanding k3s ServiceLB's Node Label

k3s's built-in ServiceLB uses the `svccontroller.k3s.cattle.io/enablelb` node label to decide which nodes publish LoadBalancer ports. That label broke every LoadBalancer service in my cluster once, through a port 8080 clash I didn't see coming. Full write-up: [how one node label broke every LoadBalancer service](/blog/infrastructureengineering/46-servicelb-node-label-broke-loadbalancers).

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See the architecture that resulted from fixing all of these mistakes."
destinationUrl: "/systems/ai-homelab"
---
::

## Mistake 5: Letting Retrieval Fail Silently

In VerseHub's RAG pipeline, a retrieval failure used to return an empty list instead of an error — so the model happily produced confident answers with no evidence behind them. A related bug meant the scripture path wasn't sending the query vector to Weaviate at all, so results came back in insertion order rather than by relevance. Retrieval failures now raise, and citations are checked against the evidence that was actually retrieved; that design is in the [verification pipeline for AI outputs](/blog/versehub-engineering/06-verification-pipeline-for-ai-outputs). Defaults bit me in the same project, too: Temporal's default 10 s task timeout is too short for LLM calls on small hardware.

## What I'd Do Differently Starting Over

Pin down addressing before deploying a single workload. Size models to the hardware they'll actually run on, and benchmark before committing. Learn the platform's memory and networking quirks — page cache on Jetsons, ServiceLB labels in k3s — before they cause an outage. Make every pipeline fail loudly. None of these are exotic lessons — they're the same discipline any production infrastructure needs, applied a homelab timeline too late in each case.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Raspberry Pi AI Cluster Blueprint"
  supportingCopy: "Skip these mistakes — get the corrected architecture and configs from day one ($39)."
  destinationUrl: "/products/raspberry-pi-ai-cluster-blueprint"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Complete Guide to Building a Production-Ready Local AI Platform"
  supportingCopy: "The full build, incorporating every lesson from this retrospective."
  destinationUrl: "/blog/ai-homelab-engineering/16-complete-guide-production-ready-local-ai-platform"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get new homelab breakdowns delivered before they're public."
  ---
  :::
::

## Further Reading

::AuthoritativeLinks
---
title: "Authoritative Sources"
links:
  - label: "Persistent Volumes — Kubernetes Documentation"
    url: "https://kubernetes.io/docs/concepts/storage/persistent-volumes/"
    type: "external"
    description: "Official documentation for Kubernetes persistent storage, worth configuring before the first real workload."
---
::

## Related reading

- [My Monthly Power Bill Running an Always-On AI Cluster](/blog/ai-homelab-engineering/14-monthly-power-bill-ai-cluster) — previous in the series: what the cluster costs to run.
- [Complete Guide: Building a Production-Ready Local AI Development Platform](/blog/ai-homelab-engineering/16-complete-guide-production-ready-local-ai-platform) — next: the build path with these lessons applied.
- [AI Homelab architecture hub](/systems/ai-homelab) — the interactive system diagram.
- [Verification Agents in Production](/blog/agentic-ai-systems/11-verification-agents-in-production) — why every agent output needs checking against evidence.

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
