---
title: "Why I Built a Homelab"
description: "Why I built a homelab: to learn production infrastructure hands-on, cut cloud costs for experiments, and run VerseHub and local AI on hardware I control."
date: 2026-01-25
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - homelab
  - motivation
draft: false
slug: why-i-built-a-homelab
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/37-why-i-built-a-homelab.jpg
---

# Why I Built a Homelab

## Introduction

I built my homelab because I needed somewhere to learn, build, break, and deploy real systems without paying cloud prices for every experiment or being limited by someone else's platform. It didn't start as a “cool tech project” — it started out of necessity. Over time, it evolved into something much bigger: a personal infrastructure stack that powers my development work, experiments with AI systems, and even parts of my Bible app ecosystem.

What began as a few machines running locally has grown into a structured rack-based environment: a 7-node K3s cluster (four Raspberry Pis and three Jetson Orin Nano Super GPU workers), a separate development machine with a single RTX 3090, and a CI/CD pipeline powered by Gitea. This setup gives me full control over how I build and deploy software — from backend services to AI workflows and game systems.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For the full architecture, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

## The Problem I Was Trying to Solve

Before the homelab, I was constantly hitting the same walls:

- Cloud costs scaling too quickly for experimentation  
- Limited control over deployment environments  
- Difficulty testing distributed systems locally  
- Slow feedback loops when building full-stack features  
- Fragmented tooling across different platforms  

I was building real systems — AI pipelines, a Bible app with social features, streaming services, and game systems — but I didn’t have an infrastructure that matched the complexity of what I was trying to create.

## Building the Rack: Turning Chaos into Structure

The turning point was organizing everything into a rack-based homelab.

At the core of the setup is a **Raspberry Pi K3s Kubernetes cluster**, which handles lightweight workloads, services, and deployments. This cluster acts as the backbone for my infrastructure experiments — everything from APIs to internal tools like [Kingdom Tools](/projects/kingdom-tools), my own platform for provisioning and managing services, runs here in containers. Three Jetson Orin Nano Supers joined later as GPU workers, so small models, speech, and image generation now run inside the cluster too.

Alongside it, I run a **separate development machine with an RTX 3090**, which handles heavier workloads like AI model inference and Dockerized ML services. Instead of pushing everything to the cluster, I split responsibilities:

- Cluster → orchestration, services, CI/CD, APIs  
- Jetson GPU workers → always-on small models, speech, image generation
- Dev machine → large models, embeddings, training, compute-heavy workloads  

This separation gives me flexibility and keeps the system stable even when I’m experimenting aggressively.

## CI/CD and Gitea as the Glue

One of the most important pieces of the system is my **Gitea-based CI/CD pipeline**.

Every time I push code:

- Repositories live in Gitea inside the cluster  
- Runners handle builds and deployments  
- Kubernetes updates services automatically  
- ARM64 Docker images are rebuilt and imported onto the nodes  

This setup turned my homelab into something closer to a real production environment. It also forces me to think in terms of infrastructure-as-code, repeatability, and reliability.

It’s not just a dev environment anymore — it’s a full lifecycle system.

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

## Why Not Just Use the Cloud?

Cloud platforms are powerful, but they come with tradeoffs that don’t align with how I build:

- Cost grows with experimentation  
- Less visibility into infrastructure layers  
- Harder to simulate real distributed systems locally  
- Vendor constraints on architecture decisions  

I dig into the actual numbers in [How I Built a Local AI Stack for Less Than a Year of Claude Max](/blog/ai-cost-optimization/07-local-ai-stack-vs-year-of-claude-max). My homelab solves that by giving me **ownership of the entire stack**, from hardware to orchestration. If something breaks, I fix it. If I want to test a new architecture, I can deploy it immediately.

That freedom is what makes iteration fast.

## How It Connects to My Bible App and AI Work

A big reason I built this system was to support the larger ecosystem I’m building — especially my Bible app, [VerseHub](/projects/versehub).

Inside that ecosystem, I have:

- AI-powered Bible and Quran comparison tools  
- Devotionals and content pipelines  
- Game systems for learning and memorization  
- Social and debate features  
- Video and livestream infrastructure  

The homelab lets me run all of this locally or semi-locally before scaling anything outward. Even AI features like agents, retrieval systems, and embeddings can be tested on my own infrastructure before going to production.

Today VerseHub's answers start with a fast draft from llama3.2:3b on a Jetson (about 21 tok/s) and are refined by a Temporal workflow on the Pi workers — all on this hardware. The full story is in [Scaling VerseHub with Local AI Infrastructure](/blog/versehub-engineering/09-scaling-versehub-with-local-ai-infrastructure).

## What I’ve Learned So Far

Building this homelab has taught me more than any course or tutorial could:

- Distributed systems become real when you break them yourself  
- Kubernetes only makes sense when you actually deploy things at scale  
- CI/CD is not optional — it’s the foundation of serious systems  
- Hardware constraints force better architecture decisions  
- Owning infrastructure changes how you think about software  

It also made me realize how much complexity exists under modern “simple” apps.

::CtaContactWork
---
buttonText: "Let's Talk About Your Reasons For Self-Hosting"
supportingCopy: "Weighing whether to build your own homelab instead of renting cloud infrastructure? Let's talk through the tradeoffs."
destinationUrl: "/hire-me"
---
::

## Conclusion

This homelab is not just a technical setup — it’s the foundation of how I build everything now.

It gives me a controlled environment to experiment, fail, and iterate quickly while still simulating real-world production systems. The Raspberry Pi nodes handle orchestration, the Jetsons handle always-on inference, the RTX 3090 machine handles heavy AI workloads, and Gitea ties everything together into a continuous deployment pipeline.

More importantly, it represents independence. Instead of renting infrastructure, I’m building it. Instead of being limited by platforms, I’m designing my own.

And as my Bible app, AI systems, and game ecosystem grow, this homelab grows with them — not as a support tool, but as the backbone of everything.

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
  buttonText: "Read: Why Lightweight Kubernetes Matters"
  supportingCopy: "Continue with \"Why Lightweight Kubernetes Matters\" to see why K3s specifically was the right fit for this homelab."
  destinationUrl: "/blog/infrastructureengineering/38-why-lightweight-kubernetes-matters"
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
  - label: "Homelab — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Home_server"
    type: "wikipedia"
    description: "According to this overview, home servers and homelabs provide personal computing infrastructure for learning and self-hosting — the environment that motivated building a Kubernetes rack rather than depending on cloud platforms."
  - label: "Kubernetes — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes"
    type: "wikipedia"
    description: "Overview of Kubernetes — the orchestration platform that only makes practical sense once you deploy real workloads, making the homelab the most effective environment for actually learning how it works."
  - label: "Self-Hosting — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Self-hosting_(web_services)"
    type: "wikipedia"
    description: "According to this overview, self-hosting runs services on infrastructure you control rather than third-party platforms — the philosophy behind building the homelab rack instead of renting cloud compute."
  - label: "Infrastructure as Code — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Infrastructure_as_code"
    type: "wikipedia"
    description: "Overview of infrastructure as code — the practice that transforms a homelab from manual configuration into a reproducible, version-controlled system that mirrors real production engineering workflows."
---
::

---

## Related reading

- [Troubleshooting (Skill)](/blog/infrastructureengineering/36-troubleshooting-skill) — previous in the series.
- [Why Lightweight Kubernetes Matters](/blog/infrastructureengineering/38-why-lightweight-kubernetes-matters) — next in the series: why K3s instead of full Kubernetes.
- [Infrastructure systems overview](/systems/infrastructure) — the hub for the full cluster architecture.
- [My Homelab Architecture for Agentic AI Development](/blog/ai-homelab-engineering/01-my-homelab-architecture-for-agentic-ai) — the AI side of the same lab.

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*