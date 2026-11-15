---
title: "Physical Organization"
description: "How I physically organized my homelab rack: four Raspberry Pis, three Jetson Orin Nanos, switch and cable layout, power, and a separate RTX 3090 box."
date: 2025-12-09
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - homelab
  - organization
draft: false
slug: physical-organization
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/28-physical-organization.jpg
---

# Physical Organization

## Introduction

I organize my homelab rack so the physical layout mirrors the software: the K3s nodes are grouped together on one switch with labeled, short cable runs, power and networking are separated, and the heavy GPU workstation lives outside the rack. Clean wiring, airflow, and intentional placement matter just as much as Kubernetes manifests or CI/CD pipelines, especially when you are debugging a failure.

In my setup, a 7-node K3s cluster — four Raspberry Pis (one control plane, three workers) and three Jetson Orin Nano Super GPU workers — is the backbone of my infrastructure, with services like Gitea powering my Git workflows and CI/CD pipelines deploying directly into the cluster. Alongside this, I also use a separate development machine with an RTX 3090 running containerized AI models for experimentation and local inference workloads.

This document breaks down how I physically organized my rack and supporting equipment so that everything stays maintainable, scalable, and easy to debug.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For the full architecture, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

---

## Rack Overview

My rack is designed around three core principles:

- Stability first (no loose or floating power/network dependencies)
- Clear separation of compute layers (cluster vs development workloads)
- Easy access for upgrades, debugging, and cable tracing

At a high level, the rack includes:

- Four Raspberry Pi nodes forming the K3s control plane and general worker pool
- Three Jetson Orin Nano Super 8GB boards as GPU worker nodes (image generation, speech, LLM)
- Networking switch providing internal cluster communication
- Router / uplink to external internet services
- Storage and power distribution components
- Integration point for my external RTX 3090 development machine

---

## Compute Layout

### Raspberry Pi K3s Cluster

The Raspberry Pi nodes are physically grouped together in the rack for simplicity and airflow management. Each node is:

- Uniformly mounted to keep cable lengths consistent
- Powered through a centralized power delivery setup
- Connected via short, labeled Ethernet runs to a dedicated switch

This keeps cluster networking predictable and reduces latency variance between nodes.

The cluster runs:

- Kubernetes (K3s)
- Internal services (APIs, dashboards, bots)
- Gitea runners for CI/CD builds

---

### Jetson GPU Workers

The three Jetson Orin Nano Super boards sit next to the Pis and join the same K3s cluster as GPU workers. Each boots from NVMe, runs headless, and has a single role — image generation, speech (TTS/STT), or a pinned LLM — because 8 GB of unified memory only fits one real model per board. I cover how those roles were chosen in [Node Roles](/blog/infrastructureengineering/27-node-roles).

---

### Development Machine (RTX 3090)

My GPU development machine is physically separate from the rack but logically integrated into the ecosystem.

It runs:

- The sentence embedder (all-MiniLM-L6-v2 in Docker) used for VerseHub retrieval
- Larger models like Ornith-1.0-35B in Ollama, plus LoRA training jobs
- Local development environments

While not inside the rack, it connects over the network and behaves like a high-performance worker node when needed. This separation keeps heat, noise, and power draw isolated from the always-on cluster.

---

## Networking Layout

Networking is one of the most important parts of the physical setup.

The design is:

- One central switch for internal cluster traffic
- Dedicated ports for each Raspberry Pi and Jetson node
- One uplink to the main router
- Static or reserved IPs for all core infrastructure services (I learned why the hard way — see [recovering after a control plane IP change](/blog/infrastructureengineering/44-recovering-after-control-plane-ip-change))

Gitea, CI runners, and Kubernetes API endpoints all rely on predictable network paths, so labeling and port consistency is critical.

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

## Cable Management Strategy

Cable management is not just aesthetic—it directly impacts debugging speed.

My approach:

- Every Ethernet cable is labeled at both ends
- Power cables are separated from data lines to reduce clutter and interference
- Cable runs are grouped by function (cluster, uplink, external devices)
- Excess cable length is coiled and secured, not left hanging

This makes it possible to trace any node in seconds instead of minutes.

---

## Power Distribution

Power reliability is treated as a first-class concern (the tradeoffs are covered in [Power Consumption Tradeoffs](/blog/infrastructureengineering/30-power-consumption-tradeoffs)).

The rack is structured so that:

- Cluster nodes share a controlled power source
- Networking equipment has separate power protection
- Critical systems are prioritized for uptime stability

This ensures that a single device failure does not cascade across the entire system.

---

## Service Awareness in Physical Design

One thing I learned building this system is that physical organization should reflect software architecture.

For example:

- Kubernetes cluster nodes are physically grouped because they function as a single compute unit
- CI/CD runners (via Gitea) are tied to predictable nodes for reproducible builds
- External GPU workloads are separated to prevent resource contention and heat issues

The physical layout mirrors the logical architecture of the system.

---

## Maintainability Considerations

Everything in the rack is designed to be:

- Hot-swappable where possible
- Easy to re-cable without dismantling the entire system
- Scalable without needing a full redesign

This is especially important as the cluster evolves. Adding new nodes or services should not require rebuilding the rack structure.

::CtaContactWork
---
buttonText: "Let's Talk About Your Rack Layout"
supportingCopy: "Organizing the physical layout of your own rack for maintainability? Let's talk through cable management and power planning."
destinationUrl: "/hire-me"
---
::

---

## Conclusion

The physical organization of a homelab is often underestimated, but it becomes critical as the system grows beyond a few devices.

In my setup, the combination of a Raspberry Pi K3s cluster, a dedicated networking layout, structured power distribution, and a separate GPU development machine creates a clean separation of concerns between compute layers.

This physical discipline directly supports everything built on top of it—from CI/CD pipelines in Gitea to AI workloads running in Docker containers. When the physical layer is organized well, the software layer becomes significantly easier to scale, debug, and evolve.

Ultimately, the rack is not just hardware—it is the foundation that everything else runs on.

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
  buttonText: "Read: Pod Layouts"
  supportingCopy: "Continue with \"Pod Layouts\" to see how workloads are arranged inside the cluster this rack hosts."
  destinationUrl: "/blog/infrastructureengineering/29-pod-layouts"
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
  - label: "Server Rack — Wikipedia"
    url: "https://en.wikipedia.org/wiki/19-inch_rack"
    type: "wikipedia"
    description: "According to this overview, server racks provide standardized mounting for network and computing hardware — the physical framework used to organize Raspberry Pi nodes, switches, and power equipment in the homelab."
  - label: "Cable Management — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Cable_management"
    type: "wikipedia"
    description: "Overview of cable management — the practice of labeling and organizing cables by function, directly reducing the time to trace and debug physical connectivity issues in a growing rack."
  - label: "Network Switch — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Network_switch"
    type: "wikipedia"
    description: "According to this overview, network switches interconnect devices within a local area network — the central switching equipment whose port layout and labeling the physical organization strategy is built around."
  - label: "Data Center Design — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Data_center"
    type: "wikipedia"
    description: "Overview of data center design principles — the enterprise practices (airflow planning, power distribution, structured cabling) scaled down and applied to homelab rack organization described in this article."
---
::

---

## Related reading

- [Node Roles](/blog/infrastructureengineering/27-node-roles) — previous in the series: what each node does.
- [Pod Layouts](/blog/infrastructureengineering/29-pod-layouts) — next in the series: how workloads land on those nodes.
- [Infrastructure systems overview](/systems/infrastructure) — the hub for the full cluster architecture.
- [My Homelab Architecture for Agentic AI Development](/blog/ai-homelab-engineering/01-my-homelab-architecture-for-agentic-ai) — the same hardware viewed as an AI platform.

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*