---
title: "Systems Thinking"
description: "How systems thinking applies to infrastructure design — understanding failure modes, feedback loops, and building homelabs for long-term reliability."
date: 2026-01-14
lastUpdated: "2026-06-09"
category: "infrastructure-engineering"
tags:
  - systems
  - design
draft: false
slug: systems-thinking
author: Donavan Jones
---

# Systems Thinking

## Introduction

Building infrastructure is often treated as a collection of individual tools—Kubernetes, Docker, CI/CD pipelines, databases, and services—but real stability comes from understanding how those parts interact as a unified system. In my own homelab, especially with a Raspberry Pi-based K3s cluster, a separate development machine with an RTX 3090, and supporting services like Gitea and CI runners, I’ve learned that every component has ripple effects across the entire architecture. A change in one layer—compute, networking, storage, or deployment—inevitably affects the others.

This mindset shift is what systems thinking is about: designing not just for functionality, but for relationships, dependencies, and failure modes. Instead of asking “does this service work?”, I started asking “how does this service behave under load, failure, or change, and what else does it impact?”

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

## Understanding Infrastructure as a System

My homelab evolved from a simple cluster into a multi-layered system:

- A **K3s Raspberry Pi cluster** handling container orchestration and lightweight workloads
- A **separate development machine with an RTX 3090** running local models in Docker containers
- A **Gitea instance running inside the cluster**, acting as the central code and CI/CD hub
- **CI runners deployed into Kubernetes**, acting as the bridge between code commits and deployments
- A growing set of **microservices and applications**, including parts of my Bible app ecosystem

At first, these were separate experiments. Over time, they became interconnected subsystems. The cluster doesn’t just “run apps”—it is the execution layer of a broader pipeline that starts at development on my local machine and ends in production-like deployments inside Kubernetes.

## Feedback Loops and Dependencies

One of the biggest realizations in applying systems thinking is that feedback loops matter more than individual components.

For example:

- A CI pipeline failure isn’t just a build issue—it affects deployment velocity and confidence in automation
- Resource constraints on the Raspberry Pi cluster influence how I design services (lighter images, fewer dependencies, better caching)
- Running AI workloads on a separate GPU machine forces me to design APIs between inference services and application services
- Gitea becomes more than version control—it becomes the coordination layer for the entire system

Each part feeds information back into how I design the next part. The system teaches me how to build it.

## Failure Domains and Isolation

Another key principle is isolation. In a poorly designed system, one failure cascades everywhere. In a well-designed system, failures are contained.

In my setup:

- The GPU dev machine is isolated from the cluster so heavy inference workloads don’t disrupt orchestration
- Kubernetes namespaces separate experimental workloads from core services
- CI runners are treated as disposable infrastructure, not critical stateful components
- Storage and stateful services are carefully separated from stateless application layers

This separation allows me to experiment aggressively without risking the entire system collapsing.

## Scaling Through Composition

Instead of scaling vertically (bigger machines), I’ve leaned into scaling through composition—adding small, well-defined systems that plug into the existing architecture.

Examples include:

- Adding new microservices to the cluster without modifying existing ones
- Extending CI pipelines rather than rewriting them
- Treating AI models as services rather than embedded logic
- Building new applications (like parts of the Bible app) as independent modules that communicate through APIs

This approach keeps the system flexible. Each new addition strengthens the ecosystem rather than complicating it.

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

## Observability as a First-Class Concern

In systems thinking, you can’t improve what you can’t see. Observability has become a core part of my infrastructure design.

Logs, metrics, and deployment feedback loops across my cluster help me understand:

- Where bottlenecks occur in CI/CD pipelines
- How workloads behave under resource pressure on the Pi cluster
- When services degrade before they fully fail
- How deployment changes affect system stability

Without observability, the system becomes guesswork. With it, the system becomes readable.

::CtaContactWork
---
buttonText: "Let's Talk About Your System's Failure Modes"
supportingCopy: "Thinking through feedback loops and failure domains in your own infrastructure? Let's talk through the design."
destinationUrl: "/hire-me"
---
::

## Conclusion

Systems thinking has completely changed how I approach infrastructure. My homelab is no longer a collection of tools—it is a living architecture where every decision has downstream effects. The Raspberry Pi cluster, the GPU development machine, Gitea, CI/CD pipelines, and my application stack all function as interconnected parts of a larger system rather than isolated projects.

The goal is no longer just to “deploy things,” but to design a system that can evolve, fail safely, and scale through composition. That shift—from tools to systems—is what makes the difference between a fragile setup and a resilient one.

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
  buttonText: "Read: Troubleshooting (Skill)"
  supportingCopy: "Continue with \"Troubleshooting (Skill)\" to see how this systems mindset translates into hands-on debugging."
  destinationUrl: "/blog/infrastructureengineering/36-troubleshooting-skill"
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
  - label: "Systems Thinking — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Systems_thinking"
    type: "wikipedia"
    description: "According to this overview, systems thinking analyzes how a system's parts interrelate and work over time — the discipline applied to homelab infrastructure design, where every architectural decision has downstream effects on other components."
  - label: "Distributed Computing — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Distributed_computing"
    type: "wikipedia"
    description: "Overview of distributed computing — the paradigm in which systems thinking becomes essential, since failures in one service propagate through the network to dependent services in non-obvious ways."
  - label: "Observability (Software) — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Observability_(software)"
    type: "wikipedia"
    description: "According to this overview, observability measures how well system state can be inferred from external outputs — the first-class design concern described as essential for understanding bottlenecks and failures in a distributed homelab."
  - label: "Infrastructure as Code — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Infrastructure_as_code"
    type: "wikipedia"
    description: "Overview of infrastructure as code — the practice that operationalizes systems thinking, making infrastructure declarative and reproducible so every component's intended state is version-controlled and auditable."
---
::

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*