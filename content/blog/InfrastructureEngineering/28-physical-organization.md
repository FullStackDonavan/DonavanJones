---
title: "Physical Organization"
description: "How I physically organized my homelab rack — cable management, node placement, switch positioning, power distribution, and lessons from the build."
date: 2025-12-09
category: "infrastructure-engineering"
tags:
  - homelab
  - organization
draft: false
slug: physical-organization
author: Donavan Jones
---

# Physical Organization

## Introduction

A homelab is only as reliable as both its architecture and its physical layout. Over time, I realized that clean wiring, proper airflow, and intentional device placement matter just as much as Kubernetes manifests or CI/CD pipelines.

In my setup, I run a Raspberry Pi–based K3s cluster as the backbone of my infrastructure, with services like Gitea powering my Git workflows and CI/CD pipelines deploying directly into the cluster. Alongside this, I also use a separate development machine with an RTX 3090 running containerized AI models for experimentation and local inference workloads.

This document breaks down how I physically organized my rack and supporting equipment so that everything stays maintainable, scalable, and easy to debug.

---

## Rack Overview

My rack is designed around three core principles:

- Stability first (no loose or floating power/network dependencies)
- Clear separation of compute layers (cluster vs development workloads)
- Easy access for upgrades, debugging, and cable tracing

At a high level, the rack includes:

- Raspberry Pi nodes forming a K3s Kubernetes cluster
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

### Development Machine (RTX 3090)

My GPU development machine is physically separate from the rack but logically integrated into the ecosystem.

It runs:

- Dockerized AI models
- Experimental inference workloads
- Local development environments

While not inside the rack, it connects over the network and behaves like a high-performance worker node when needed. This separation keeps heat, noise, and power draw isolated from the always-on cluster.

---

## Networking Layout

Networking is one of the most important parts of the physical setup.

The design is:

- One central switch for internal cluster traffic
- Dedicated ports for each Raspberry Pi node
- One uplink to the main router
- Static or reserved IPs for all core infrastructure services

Gitea, CI runners, and Kubernetes API endpoints all rely on predictable network paths, so labeling and port consistency is critical.

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

Power reliability is treated as a first-class concern.

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

---

## Conclusion

The physical organization of a homelab is often underestimated, but it becomes critical as the system grows beyond a few devices.

In my setup, the combination of a Raspberry Pi K3s cluster, a dedicated networking layout, structured power distribution, and a separate GPU development machine creates a clean separation of concerns between compute layers.

This physical discipline directly supports everything built on top of it—from CI/CD pipelines in Gitea to AI workloads running in Docker containers. When the physical layer is organized well, the software layer becomes significantly easier to scale, debug, and evolve.

Ultimately, the rack is not just hardware—it is the foundation that everything else runs on.