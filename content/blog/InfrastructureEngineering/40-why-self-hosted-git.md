---
title: "Why Self-Hosted Git"
description: "Reasons for running a self-hosted Git service in my homelab."
date: 2026-05-26
tags:
  - infrastructure
  - git
  - ci-cd
draft: false
slug: why-self-hosted-git
author: Donavan Jones
---

# Why Self-Hosted Git

## Introduction

In a modern homelab environment, especially one built around a Kubernetes-based stack like my Raspberry Pi K3s rack, self-hosting core infrastructure services becomes a natural next step. Instead of relying entirely on external platforms like GitHub or GitLab SaaS, I run my own Git service inside the cluster alongside my CI/CD pipelines, internal tools, and application workloads.

For me, self-hosted Git is not just about “owning my code.” It’s about control over my deployment pipeline, tighter integration with my Kubernetes environment, reduced external dependencies, and the ability to experiment freely with infrastructure patterns. My setup includes a mixed homelab rack (Raspberry Pi worker nodes plus a more powerful development machine with an RTX 3090 running containerized AI workloads), which makes local-first development and deployment especially important.

This article breaks down why self-hosting Git fits into that architecture and why it has become a core piece of my system design.

---

## Why Self-Hosted Git Matters in a Homelab

### 1. Full Control Over CI/CD Pipelines

When Git is self-hosted, CI/CD is no longer constrained by external platform limits. In my setup, Git pushes can directly trigger workflows running inside the same Kubernetes cluster where my applications live. This creates a tight feedback loop:

- Code is pushed to my internal Git server
- Webhooks trigger CI runners deployed inside K3s
- Builds and deployments happen within my infrastructure boundary

This removes reliance on external CI minutes, rate limits, or platform-specific restrictions.

---

### 2. Native Integration With My K3s Cluster

Because my homelab is Kubernetes-native, self-hosted Git becomes another internal service rather than an external dependency.

In my rack architecture:
- Raspberry Pi nodes handle lightweight workloads and CI runners
- My main dev machine (with GPU) handles heavier AI/container builds
- Services are deployed through Kubernetes manifests stored directly in Git

This turns Git into the “source of truth” for the entire cluster.

---

### 3. Better Security and Network Isolation

Running Git internally means:
- No exposure of private repos to third-party SaaS platforms
- Reduced attack surface for external account compromise
- Full control over authentication, SSH keys, and access policies

In a homelab where I already control ingress, load balancing, and networking at the cluster level, it makes sense to extend that trust boundary to version control as well.

---

### 4. Offline-First and Resilient Development

One underrated benefit is resilience. My environment doesn’t depend on internet access for core development workflows.

Even if external services go down:
- I can still commit code
- Run CI pipelines locally in the cluster
- Deploy services internally
- Sync outward later when needed

This is especially useful in experimental infrastructure setups where stability is being tested.

---

### 5. Tight Coupling With Infrastructure as Code

My Git service is not just for application code. It also stores:
- Kubernetes manifests
- Helm charts
- CI/CD pipeline definitions
- Infrastructure-as-code configurations
- Deployment scripts for my rack

This makes Git the backbone of my entire homelab architecture. Everything is declarative and version-controlled.

---

### 6. Experimentation With Advanced Workflows

Self-hosting Git enables experimentation that would be harder on SaaS platforms, such as:
- Custom webhook triggers into Kubernetes services
- Running AI-assisted CI pipelines using local models on my RTX 3090 machine
- Testing multi-node distributed build systems across Pi nodes
- Building internal developer tools that integrate directly with repos

This turns Git from a storage system into an active part of the infrastructure runtime.

---

## How It Fits Into My Rack Architecture

In my current setup:
- K3s cluster runs core services including Git and CI runners
- Raspberry Pi nodes distribute workloads
- Dedicated dev machine handles GPU-heavy workloads and model inference
- Docker containers are used for isolated services and AI tooling

Git sits at the center of this system, acting as the coordination layer between code, infrastructure, and deployment.

---

## Conclusion

Self-hosting Git in my homelab isn’t about replacing GitHub—it’s about building a system where version control becomes part of the infrastructure itself. In a Kubernetes-driven rack environment, Git evolves from a code repository into a control plane for deployments, automation, and experimentation.

By integrating Git directly into my K3s cluster, I gain tighter control, better security, and a development workflow that mirrors production infrastructure. More importantly, it allows me to treat my homelab as a fully integrated system rather than a collection of disconnected tools.

As my rack continues to evolve, self-hosted Git remains one of the foundational pieces that everything else builds on.