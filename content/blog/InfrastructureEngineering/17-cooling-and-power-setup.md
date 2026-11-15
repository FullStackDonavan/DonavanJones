---
title: "Cooling and Power Setup"
description: "How I handle cooling and power for a home rack of Raspberry Pis, Jetson Orin boards, and an RTX 3090 — airflow, UPS planning, and thermal monitoring."
date: 2025-11-05
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - cooling
  - power
draft: false
slug: cooling-and-power-setup
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/17-cooling-and-power-setup.jpg
---

# Cooling and Power Setup

For a home server rack, cooling and power come down to three things: move air in one direction through the rack, keep the high-draw GPU machine physically and electrically separate from the low-power nodes, and put the control plane and networking on a UPS. Then watch temperatures in your monitoring stack so you find out about heat before Kubernetes does. My rack has four Raspberry Pis and three Jetson Orin boards, with an RTX 3090 workstation kept outside it.

## Introduction

Building a stable homelab rack is not just about compute power—it’s about making sure everything runs reliably under continuous load. In my setup, I’m running four Raspberry Pi nodes and three Jetson Orin Nano Super GPU workers in a K3s cluster, plus a separate development machine with an RTX 3090 handling the heaviest AI workloads.

This combination creates a unique challenge: low-power ARM devices and small GPU boards sitting near a high-power GPU system, all needing consistent airflow, clean power delivery, and thermal stability. Without proper planning, heat buildup and unstable power can quickly become the bottleneck of the entire system.

This guide covers how I approached cooling and power distribution to keep the rack stable, quiet enough for a home environment, and scalable for future expansion.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For how every node and service fits together, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

---

## Cooling Strategy

My rack design prioritizes passive airflow first, then active cooling where necessary.

### 1. Airflow Design
I structured the rack so air moves in a single direction—from bottom intake to top exhaust. This helps prevent heat recirculation between devices like the Pi cluster nodes and networking gear.

- Raspberry Pi nodes are grouped together to share ambient cooling
- Higher heat devices are spaced out vertically
- Cable management is kept tight to avoid airflow obstruction

### 2. Active Cooling
While most of the cluster runs low power, sustained workloads generate real heat — the 3090 machine most of all, but also the Jetsons, which I run in MAXN_SUPER (maximum performance) power mode with one model kept loaded on gpu-worker-3 around the clock.

- Added case fans on enclosed sections of the rack
- GPU workstation uses its own dedicated cooling system and is physically separated from the rack
- Small USB-powered fans are used for localized hotspots when needed

### 3. Thermal Monitoring
I rely on system-level monitoring across nodes:

- CPU temperature tracking on each Pi
- GPU temperature monitoring on the 3090 system
- Jetson GPU load, scraped by Prometheus from a small custom `/metrics` agent on each board
- Alerts for sustained temperature spikes

The metrics land in the same Prometheus and Grafana stack I use for everything else (see [Grafana on a Pi K3s cluster](/blog/infrastructureengineering/42-grafana-on-pi-cluster)). This ensures I catch thermal issues before they become stability problems in Kubernetes workloads.

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

## Power Setup

Power stability is just as important as cooling in a distributed homelab.

### 1. Power Distribution
Everything in the rack runs through a centralized power strip with surge protection.

- Pi cluster uses low-wattage, multi-port USB-C power supplies
- Networking gear is isolated on its own UPS-backed outlet
- Dev machine (3090 system) is on a separate high-capacity circuit path

This separation prevents high-load spikes from affecting sensitive cluster nodes.

### 2. UPS Strategy
I use a UPS to protect the core infrastructure:

- Keeps the K3s control plane node (pi-node1, my only server) alive during short outages
- Prevents data corruption in services like PostgreSQL and vector databases
- Gives enough time for graceful shutdown if needed

### 3. Load Management
Because I run mixed workloads (AI services, APIs, and dev tools), I avoid overloading a single power rail.

- Heavy compute stays on the GPU workstation
- Small-model inference stays on the Jetsons, one job per board
- Lightweight services stay on the Pi cluster

For the cost side of running all this 24/7, see [power consumption tradeoffs](/blog/infrastructureengineering/30-power-consumption-tradeoffs).
- Services are distributed based on power and thermal cost, not just CPU usage

---

## Scalability Considerations

The goal of this setup is not just stability—it’s growth.

As I expand the system (adding more nodes, services, or AI workloads), I can:

- Add additional UPS capacity without reworking the rack
- Introduce more Pi nodes without affecting thermal balance
- Scale GPU workloads independently from the cluster
- Integrate new services into Kubernetes without changing physical layout

---

::CtaContactWork
---
buttonText: "Let's Talk About Your Rack's Power and Cooling"
supportingCopy: "Planning cooling and power distribution for your own rack? Let's talk through the design."
destinationUrl: "/hire-me"
---
::

## Conclusion

A homelab rack is an ecosystem, not just a stack of machines. Cooling and power design determine whether that ecosystem stays stable under load or collapses when workloads increase.

In my setup, separating compute tiers—low-power Kubernetes nodes on Raspberry Pis and high-power AI workloads on a dedicated GPU machine—makes everything more predictable and easier to manage. Combined with structured airflow, UPS-backed power, and monitoring, the system stays reliable even as I continue building out more services and experiments.

The goal moving forward is simple: keep the infrastructure boring. If cooling and power are done right, everything else—AI agents, deployments, and experiments—can run freely on top of it.

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
  buttonText: "Read: Cost vs Performance Tradeoffs"
  supportingCopy: "Continue with \"Cost vs Performance Tradeoffs\" to see how these power and cooling choices weigh against raw performance."
  destinationUrl: "/blog/infrastructureengineering/18-cost-vs-performance-tradeoffs"
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
  - label: "Thermal Management (Electronics) — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Thermal_management_(electronics)"
    type: "wikipedia"
    description: "According to this overview, thermal management prevents electronic components from overheating — the concern that motivates structured airflow and heat sink selection for Raspberry Pi nodes running continuous workloads."
  - label: "Uninterruptible Power Supply — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Uninterruptible_power_supply"
    type: "wikipedia"
    description: "Overview of UPS systems — the power protection used to keep the K3s control plane alive during outages and enable graceful shutdown before data corruption occurs in PostgreSQL and vector databases."
  - label: "Power Management — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Power_management"
    type: "wikipedia"
    description: "According to this overview, power management controls energy consumption in computing systems — the practice of distributing workloads between low-power Pi nodes and the high-draw GPU machine to prevent circuit overloads."
  - label: "Data Center Cooling — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Computer_cooling"
    type: "wikipedia"
    description: "Overview of computer cooling principles — understanding airflow patterns and thermal zones informs the homelab rack's physical layout, separating heat-generating GPU hardware from the always-on Pi cluster."
---
::

---

## Related reading

- [Control Plane Taints](/blog/infrastructureengineering/16-control-plane-taints) — previous in the series
- [Cost vs Performance Tradeoffs](/blog/infrastructureengineering/18-cost-vs-performance-tradeoffs) — next in the series
- [Monitoring and Troubleshooting](/blog/infrastructureengineering/10-monitoring-and-troubleshooting) — where the temperature and GPU metrics end up
- [Infrastructure systems overview](/systems/infrastructure) — the hub page for the whole rack: nodes, services, and how they connect
- [My Monthly Power Bill Running an Always-On AI Cluster](/blog/ai-homelab-engineering/14-monthly-power-bill-ai-cluster) — what an always-on AI cluster costs to run

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*