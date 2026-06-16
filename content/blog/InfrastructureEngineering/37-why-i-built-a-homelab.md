---
title: "Why I Built a Homelab"
description: "Why I built a personal homelab — learning production infrastructure hands-on, reducing cloud costs, and running AI workloads with full control."
date: 2026-01-25
lastUpdated: "2026-06-09"
category: "infrastructure-engineering"
tags:
  - homelab
  - motivation
draft: false
slug: why-i-built-a-homelab
author: Donavan Jones
---

# Why I Built a Homelab

## Introduction

My homelab didn’t start as a “cool tech project” — it started out of necessity. I needed a space where I could learn, build, break, and deploy systems without depending on expensive cloud services or being limited by external platforms. Over time, it evolved into something much bigger: a personal infrastructure stack that powers my development work, experiments with AI systems, and even parts of my Bible app ecosystem.

What began as a few machines running locally has grown into a structured rack-based environment with a Raspberry Pi K3s cluster, a separate development machine with an RTX 3090 running containerized models, and a CI/CD pipeline powered by Gitea. This setup gives me full control over how I build and deploy software — from backend services to AI workflows and game systems.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

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

At the core of the setup is a **Raspberry Pi K3s Kubernetes cluster**, which handles lightweight workloads, services, and deployments. This cluster acts as the backbone for my infrastructure experiments — everything from APIs to internal tools runs here in containers.

Alongside it, I run a **separate development machine with an RTX 3090**, which handles heavier workloads like AI model inference and Dockerized ML services. Instead of pushing everything to the cluster, I split responsibilities:

- Cluster → orchestration, services, CI/CD, APIs  
- Dev machine → AI models, experimentation, compute-heavy workloads  

This separation gives me flexibility and keeps the system stable even when I’m experimenting aggressively.

## CI/CD and Gitea as the Glue

One of the most important pieces of the system is my **Gitea-based CI/CD pipeline**.

Every time I push code:

- Repositories live in Gitea inside the cluster  
- Runners handle builds and deployments  
- Kubernetes updates services automatically  
- Docker images are rebuilt and distributed across nodes  

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

My homelab solves that by giving me **ownership of the entire stack**, from hardware to orchestration. If something breaks, I fix it. If I want to test a new architecture, I can deploy it immediately.

That freedom is what makes iteration fast.

## How It Connects to My Bible App and AI Work

A big reason I built this system was to support the larger ecosystem I’m building — especially my Bible app.

Inside that ecosystem, I have:

- AI-powered Bible and Quran comparison tools  
- Devotionals and content pipelines  
- Game systems for learning and memorization  
- Social and debate features  
- Video and livestream infrastructure  

The homelab lets me run all of this locally or semi-locally before scaling anything outward. Even AI features like agents, retrieval systems, and embeddings can be tested on my own infrastructure before going to production.

It also allows me to integrate models directly through Docker containers on my RTX 3090 machine while still orchestrating services through Kubernetes.

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

It gives me a controlled environment to experiment, fail, and iterate quickly while still simulating real-world production systems. The Raspberry Pi K3s cluster handles orchestration, the RTX 3090 machine handles heavy AI workloads, and Gitea ties everything together into a continuous deployment pipeline.

More importantly, it represents independence. Instead of renting infrastructure, I’m building it. Instead of being limited by platforms, I’m designing my own.

And as my Bible app, AI systems, and game ecosystem grow, this homelab grows with them — not as a support tool, but as the backbone of everything.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Pi Cluster Blueprint"
  supportingCopy: "Get the Raspberry Pi AI Cluster Blueprint — hardware list, network diagram, node roles, folder structures, Kubernetes manifests, and a troubleshooting checklist ($19)."
  destinationUrl: "/products/raspberry-pi-ai-cluster-blueprint"
  price: "$19"
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

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*