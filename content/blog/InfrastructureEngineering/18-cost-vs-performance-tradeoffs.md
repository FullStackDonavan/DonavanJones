---
title: "Cost vs Performance Tradeoffs"
description: "How to balance cost and performance when building homelab infrastructure — hardware choices, power costs, and what you actually get for the money."
date: 2025-11-08
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - cost
  - performance
draft: false
slug: cost-vs-performance-tradeoffs
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/18-cost-vs-performance-tradeoffs.jpg
---

# Cost vs Performance Tradeoffs

The best cost-to-performance split for a homelab is to put each workload on the cheapest hardware that can actually run it. In my setup that means always-on services on Raspberry Pis, small-model inference on Jetson Orin boards, and only the largest models on one RTX 3090. Spending on performance pays off only where a workload hits a real limit, which for AI is almost always memory.

## Introduction

Building a homelab is always a balancing act between what you *can afford* and what you *need to perform*. In my case, that balance has evolved over time as my infrastructure grew from a small single-machine setup into a full rack with a Kubernetes cluster (K3s on four Raspberry Pis and three Jetson Orin Nano Super GPU workers), a dedicated development machine with an RTX 3090 running AI workloads in Docker, and supporting services like Gitea CI runners acting as the glue between deployments and automation.

The real challenge isn’t just raw performance—it’s deciding where performance actually matters and where cost-efficient systems are “good enough.” Every component in the rack has to justify its place, whether it's compute, storage, networking, or orchestration overhead.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For how every node and service fits together, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

## The Core Tradeoff: Cost vs Performance

At the heart of my setup is a clear split:

- **Low-cost distributed compute (Raspberry Pi K3s cluster)**  
  Handles lightweight services, APIs, background workers, and always-on infrastructure tasks. This keeps power consumption and hardware costs extremely low while still giving me orchestration flexibility.

- **Low-power GPU tier (three Jetson Orin Nano Super boards)**  
  K3s GPU workers with 8 GB of unified memory each. One serves llama3.2:3b around the clock at about 20.8 tok/s, one handles speech (Kokoro TTS + Whisper STT), and one handles image generation and a shelf of small models. They're cheap to run 24/7, but each fits only one ~4–5 GB model at a time.

- **High-performance centralized compute (RTX 3090 dev machine in Docker)**  
  Used for the large models (Ornith-1.0-35B at about 64 tok/s), embeddings, LoRA training, and heavier workloads that won't fit in a Jetson's memory.

- **CI/CD and orchestration layer (Gitea + runners)**  
  This acts as the bridge between development and deployment. It lets me treat infrastructure as code, pushing updates that build and deploy automatically into the cluster.

This separation keeps costs down while still allowing high-performance workloads when needed.

## Where Cost Optimization Works

Some areas benefit massively from being cheap and distributed:

- Always-on services (auth, APIs, dashboards)
- Lightweight databases or caching layers
- Monitoring and internal tooling
- Experimental deployments and testing environments

Using Raspberry Pis for this layer means I can scale horizontally without worrying about power draw or expensive hardware upgrades.

## Where Performance Matters More

Other workloads simply don’t scale well on low-power nodes:

- AI inference and model experimentation
- Vector search and embedding generation
- Heavy backend processing jobs
- Any GPU-accelerated workload

For these, the RTX 3090 machine becomes the “performance anchor” of the entire system. The Jetsons take everything small enough to fit, and only what truly needs 24 GB of VRAM goes to the 3090, which exposes it as a service.

The cheap tier has real limits, and I've hit them. I tried running Ornith-1.0-9B on a Jetson as a drafter for the 35B model. It barely fit (about 5.3 GB, with a 4K context maximum) and ran at roughly 3 tok/s end to end, so I retired it. That's the cost-versus-performance line in practice: the cheap tier stops being "good enough" right at the memory limit. The [RTX 3090 + Jetson hybrid architecture](/blog/ai-homelab-engineering/03-rtx-3090-jetson-orin-hybrid-architecture) post covers how the two tiers split work.

## The Hidden Cost: Complexity

One thing I underestimated early on is that “cheap hardware” doesn’t always mean “cheap system.”

A distributed homelab introduces:

- Networking complexity between nodes
- Service discovery and load balancing overhead
- More CI/CD plumbing
- Debugging across multiple machines

This is where tools like Kubernetes and [Gitea runners](/blog/infrastructureengineering/21-gitea-runners-pipeline) become essential—they reduce mental overhead even if they add system overhead. The physical side of that cost — airflow, UPS, and power distribution — is in [cooling and power setup](/blog/infrastructureengineering/17-cooling-and-power-setup).

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how this fits into the production infrastructure it was built for."
destinationUrl: "/systems/infrastructure"
---
::

---

*Explore more articles in the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

---

## What I’ve Learned So Far

The biggest realization is that optimization is not about minimizing cost everywhere—it’s about placing resources where they create leverage.

- Cheap compute is best when failure is acceptable or load is light
- Expensive compute is best when precision or speed matters
- Orchestration tools are worth the complexity if they reduce long-term friction

My rack works because each layer has a clear purpose instead of trying to make every node do everything.

::CtaContactWork
---
buttonText: "Let's Talk About Your Cost/Performance Balance"
supportingCopy: "Figuring out where to spend on performance and where to save on your own rack? Let's talk through the tradeoffs."
destinationUrl: "/hire-me"
---
::

## Conclusion

The real tradeoff in homelab design isn’t just cost versus performance—it’s simplicity versus flexibility. My setup covers both ends and the middle: inexpensive distributed nodes for resilience and experimentation, low-power Jetson GPUs for small always-on models, and a high-performance GPU machine for heavy workloads that actually need power.

Over time, I’ve found that the goal isn’t to eliminate tradeoffs, but to understand them well enough that every piece of the system earns its place. In a way, the rack is less about hardware and more about intentional design—knowing exactly what should be cheap, what should be fast, and what should stay simple.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Pi Cluster Blueprint"
  supportingCopy: "Get the Raspberry Pi AI Cluster Blueprint — hardware list, network diagram, node roles, folder structures, Kubernetes manifests, and a troubleshooting checklist ($19)."
  destinationUrl: "/products/raspberry-pi-ai-cluster-blueprint"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: DNS and Service Discovery"
  supportingCopy: "Continue with \"DNS and Service Discovery\" to see how these cost-optimized nodes find and talk to each other."
  destinationUrl: "/blog/infrastructureengineering/19-dns-and-service-discovery"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get new infrastructure engineering breakdowns delivered before they're public."
  ---
  :::
::

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "Total Cost of Ownership — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Total_cost_of_ownership"
    type: "wikipedia"
    description: "According to this overview, total cost of ownership accounts for acquisition, operation, and maintenance costs — the framework for comparing homelab hardware costs against cloud spend over time."
  - label: "Computer Performance — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Computer_performance"
    type: "wikipedia"
    description: "Overview of computer performance metrics — the dimension traded against cost in every homelab hardware decision, from choosing Pi nodes for lightweight services to deploying an RTX 3090 for AI inference."
  - label: "Cloud Computing — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Cloud_computing"
    type: "wikipedia"
    description: "According to this overview, cloud computing provides on-demand infrastructure as a service — the alternative to homelab hardware whose per-usage pricing makes it expensive for continuous, experimentally-driven workloads."
  - label: "Kubernetes — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes"
    type: "wikipedia"
    description: "Overview of Kubernetes as an orchestration layer — understanding how K3s adds operational complexity helps frame the cost-versus-benefit decision of self-hosting versus managed Kubernetes services."
---
::

---

## Related reading

- [Cooling and Power Setup](/blog/infrastructureengineering/17-cooling-and-power-setup) — previous in the series
- [DNS and Service Discovery](/blog/infrastructureengineering/19-dns-and-service-discovery) — next in the series
- [Infrastructure systems overview](/systems/infrastructure) — the hub page for the whole rack: nodes, services, and how they connect
- [When Should You Buy a GPU Instead of Paying API Fees?](/blog/ai-cost-optimization/05-when-to-buy-a-gpu-instead-of-api-fees) — the buy-a-GPU vs pay-for-API decision
- [My Monthly Power Bill Running an Always-On AI Cluster](/blog/ai-homelab-engineering/14-monthly-power-bill-ai-cluster) — the running-cost side of the tradeoff

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*