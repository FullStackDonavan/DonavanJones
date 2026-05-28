---
title: "Cooling and Power Setup"
description: "Cooling and power strategies for a home server rack."
date: 2026-05-26
category: "infrastructure-engineering"
tags:
  - cooling
  - power
draft: true
slug: cooling-and-power-setup
author: Donavan Jones
---

# Cooling and Power Setup

## Introduction

Building a stable homelab rack is not just about compute power—it’s about making sure everything runs reliably under continuous load. In my setup, I’m running a mix of Raspberry Pi nodes in a K3s cluster, containerized services, and a separate development machine with an RTX 3090 handling heavier AI workloads. 

This combination creates a unique challenge: low-power ARM devices sitting next to a high-power GPU system, all needing consistent airflow, clean power delivery, and thermal stability. Without proper planning, heat buildup and unstable power can quickly become the bottleneck of the entire system.

This guide covers how I approached cooling and power distribution to keep the rack stable, quiet enough for a home environment, and scalable for future expansion.

---

## Cooling Strategy

My rack design prioritizes passive airflow first, then active cooling where necessary.

### 1. Airflow Design
I structured the rack so air moves in a single direction—from bottom intake to top exhaust. This helps prevent heat recirculation between devices like the Pi cluster nodes and networking gear.

- Raspberry Pi nodes are grouped together to share ambient cooling
- Higher heat devices are spaced out vertically
- Cable management is kept tight to avoid airflow obstruction

### 2. Active Cooling
While most of the cluster runs low power, sustained workloads (especially AI workloads from the 3090 machine) generate significant heat.

- Added case fans on enclosed sections of the rack
- GPU workstation uses its own dedicated cooling system and is physically separated from the rack
- Small USB-powered fans are used for localized hotspots when needed

### 3. Thermal Monitoring
I rely on system-level monitoring across nodes:

- CPU temperature tracking on each Pi
- GPU temperature monitoring on the 3090 system
- Alerts for sustained temperature spikes

This ensures I catch thermal issues before they become stability problems in Kubernetes workloads.

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

- Keeps K3s control plane nodes alive during short outages
- Prevents data corruption in services like PostgreSQL and vector databases
- Gives enough time for graceful shutdown if needed

### 3. Load Management
Because I run mixed workloads (AI services, APIs, and dev tools), I avoid overloading a single power rail.

- Heavy compute stays on the GPU workstation
- Lightweight services stay on the Pi cluster
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

## Conclusion

A homelab rack is an ecosystem, not just a stack of machines. Cooling and power design determine whether that ecosystem stays stable under load or collapses when workloads increase.

In my setup, separating compute tiers—low-power Kubernetes nodes on Raspberry Pis and high-power AI workloads on a dedicated GPU machine—makes everything more predictable and easier to manage. Combined with structured airflow, UPS-backed power, and monitoring, the system stays reliable even as I continue building out more services and experiments.

The goal moving forward is simple: keep the infrastructure boring. If cooling and power are done right, everything else—AI agents, deployments, and experiments—can run freely on top of it.