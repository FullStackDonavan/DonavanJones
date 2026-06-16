---
title: "Flashing Raspberry Pi OS"
description: "How to flash Raspberry Pi OS Lite and configure base settings for a production-ready Kubernetes homelab node from scratch on ARM64 hardware."
date: 2025-09-20
lastUpdated: "2026-06-09"
category: "infrastructure-engineering"
tags:
  - raspberry-pi
  - setup
draft: false
slug: flashing-raspberry-pi-os
author: Donavan Jones
---

# Flashing Raspberry Pi OS

## Introduction

In a Kubernetes-based homelab environment, having consistent and repeatable node provisioning is critical. In my own setup, I run a Raspberry Pi–based K3s cluster as part of a larger rack architecture that also includes CI/CD pipelines (via Gitea runners), containerized AI services, and edge services that I deploy and test locally before pushing to production. Flashing Raspberry Pi OS is the first foundational step in bringing a new node into that system, ensuring it can reliably join the cluster, run workloads, and participate in automated deployments.

This guide walks through the process of flashing Raspberry Pi OS in a way that aligns with infrastructure-as-code thinking, so each node in the cluster behaves predictably and can be reproduced or replaced without manual drift.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

---

## Steps to Flash Raspberry Pi OS for Cluster Nodes

### 1. Download Raspberry Pi OS
Download the official Raspberry Pi OS image from the Raspberry Pi website. For cluster nodes, I typically use Raspberry Pi OS Lite (64-bit) to keep the system lightweight for Kubernetes workloads.

### 2. Install Raspberry Pi Imager
Install Raspberry Pi Imager on your workstation. This tool simplifies writing OS images to SD cards or SSDs.

### 3. Select Operating System
Open Raspberry Pi Imager and choose:
- Raspberry Pi OS (Lite, 64-bit)

### 4. Select Storage Device
Insert your SD card or SSD and select it as the target device.

### 5. Preconfigure Settings (Recommended)
Before flashing, open advanced settings and configure:
- Hostname (e.g., `k3s-node-1`, `k3s-node-2`)
- Enable SSH
- Set username and password
- Configure Wi-Fi (if not using Ethernet in rack setup)
- Set locale/timezone

In my rack setup, I strongly prefer Ethernet-only nodes to keep latency stable across the Kubernetes cluster.

### 6. Flash the Image
Click “Write” and allow the process to complete. This will erase and install Raspberry Pi OS onto the storage device.

### 7. Boot the Node
Insert the storage device into the Raspberry Pi and power it on. The node will boot and apply initial configuration.

### 8. Verify Network Access
From your main machine or control node, verify the node is reachable:
```bash
ssh pi@k3s-node-1.local
```

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

## Post-Flash Cluster Preparation (Homelab Context)

Once flashed, I integrate the node into my broader homelab stack:
- Join it to the **K3s cluster** running across the rack
- Register it with **Gitea CI/CD runners** for automated deployments
- Install monitoring agents for system observability
- Label it based on role (compute, AI inference, storage, etc.)

This keeps the system modular, where nodes are interchangeable parts of a larger distributed infrastructure.

---

::CtaContactWork
---
buttonText: "Let's Talk About Your Node Provisioning"
supportingCopy: "Standardizing node setup for your own Pi cluster or homelab? Let's talk through the architecture."
destinationUrl: "/hire-me"
---
::

## Conclusion

Flashing Raspberry Pi OS is more than just imaging an SD card—it is the first step in building a reproducible edge computing environment. In a homelab rack like mine, where Kubernetes, CI/CD automation, and local AI services all run together, consistent node setup ensures stability and scalability. Once a node is flashed and standardized, it becomes a plug-and-play unit in the cluster, ready to handle workloads, run pipelines, and participate in the larger distributed system.

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
  buttonText: "Read: Static IPs and Networking"
  supportingCopy: "Continue with \"Static IPs and Networking\" to give each freshly flashed node a stable address on the cluster network."
  destinationUrl: "/blog/infrastructureengineering/04-static-ips-and-networking"
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
  - label: "Raspberry Pi OS — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Raspberry_Pi_OS"
    type: "wikipedia"
    description: "According to this overview, Raspberry Pi OS is the official Debian-based operating system for Raspberry Pi hardware — the foundation flashed onto each cluster node before K3s installation."
  - label: "Disk Image — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Disk_image"
    type: "wikipedia"
    description: "Overview of disk imaging — the process used to write OS images to SD cards and SSDs, enabling reproducible node setup across the homelab cluster."
  - label: "Secure Shell — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Secure_Shell"
    type: "wikipedia"
    description: "According to this overview, SSH provides encrypted remote shell access — the protocol used to configure and manage each Raspberry Pi node after flashing, enabling headless operation."
  - label: "Edge Computing — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Edge_computing"
    type: "wikipedia"
    description: "Overview of edge computing — the deployment model motivating reproducible, standardized node setup so each Pi becomes an interchangeable compute unit in the distributed cluster."
---
::

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*
