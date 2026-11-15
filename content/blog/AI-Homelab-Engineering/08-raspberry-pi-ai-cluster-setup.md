---
title: "Raspberry Pi AI Cluster Setup"
description: "Raspberry Pi AI cluster setup: using four Pis as the k3s control plane and utility workers (Redis, Temporal, monitoring) alongside Jetson GPU nodes."
date: 2026-10-08
lastUpdated: "2026-11-14"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - raspberry-pi
draft: false
slug: raspberry-pi-ai-cluster-setup
author: Donavan Jones
excerptImage: /img/blog/ai-homelab-engineering/08-raspberry-pi-ai-cluster-setup.jpg
---

# Raspberry Pi AI Cluster Setup

In a Raspberry Pi AI cluster, the Pis shouldn't do the inference — they run the control plane and the utility services the GPU nodes depend on. My cluster has four: pi-node1 as the k3s control plane and three Pi workers, next to three Jetson Orin Nano Supers that handle the models. That's a cheap, low-power, always-on role the Pis are genuinely good at.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering). For the full system map, see the [AI homelab architecture hub](/systems/ai-homelab).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI homelab deep-dive in this series."
destinationUrl: "/categories/ai-homelab-engineering"
---
::

## What Raspberry Pis Are Good For Here

**k3s control plane.** The control plane doesn't need GPU access — it needs to be reliable and always available. A Raspberry Pi drawing a few watts is a better fit for this role than dedicating a GPU-capable node to it. pi-node1 also hosts Prometheus, Grafana, and my self-hosted Gitea.

**Monitoring and logs.** Lightweight, always-on services — [Prometheus](/blog/infrastructureengineering/41-prometheus-on-pi-cluster), Grafana, Loki, and a Promtail DaemonSet on every node — run comfortably on a Pi's modest resources and don't compete with inference workloads for GPU-node memory. (Local DNS such as Pi-hole is another classic fit.)

**State and orchestration.** Redis runs on pi-worker-2, and the Pi workers run the Temporal workers behind VerseHub's refine pass — retrieve, score, generate, verify — calling out to the GPU nodes only for the model steps. See [Temporal workflows in production](/blog/versehub-engineering/07-temporal-workflows-in-production).

**Cheap capacity for non-GPU batch work.** Anything CPU-bound — like the corpus crawler that runs as a Kubernetes Job and feeds the RAG pipeline — can run on Pi nodes, freeing GPU-capable nodes for work that actually needs them.

## Flashing and Joining a Pi to the Cluster

```bash
# Flash a 64-bit OS (Raspberry Pi OS Lite or Ubuntu Server) with Raspberry Pi Imager, then:
curl -sfL https://get.k3s.io | K3S_URL=https://<control-plane-ip>:6443 \
  K3S_TOKEN=<node-token> sh -
```

Label the node so workloads can be scheduled deliberately away from it if they need GPU access:

```bash
kubectl label node <pi-node-name> gpu-tier=none
```

## Why Not Just Use Jetson Boards for Everything

Jetson Orin boards cost meaningfully more than a Raspberry Pi and dedicate real silicon to GPU compute that's wasted on a workload like DNS resolution or log aggregation. Using cheaper Pi boards for the non-GPU utility roles keeps the more expensive GPU-capable nodes free for actual inference work — matching hardware cost to what a workload actually needs, rather than standardizing on the most capable board available.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how utility nodes fit into the full AI homelab architecture."
destinationUrl: "/systems/ai-homelab"
---
::

## Power and Reliability

A Raspberry Pi's power draw is low enough that running four of them continuously barely registers against the cluster's overall power bill (estimated in [a dedicated article later in this series](/blog/ai-homelab-engineering/14-monthly-power-bill-ai-cluster)) — which is exactly the property that makes them a good fit for always-on, low-priority infrastructure roles.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Raspberry Pi AI Cluster Blueprint"
  supportingCopy: "Get the exact hardware list, flashing steps, and k3s configs used here ($39)."
  destinationUrl: "/products/raspberry-pi-ai-cluster-blueprint"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Running Multiple Local Models Without Melting Your GPU"
  supportingCopy: "How the GPU-capable tier handles concurrent workloads."
  destinationUrl: "/blog/ai-homelab-engineering/09-running-multiple-local-models-without-melting-gpu"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get new homelab breakdowns delivered before they're public."
  ---
  :::
::

## Further Reading

::AuthoritativeLinks
---
title: "Authoritative Sources"
links:
  - label: "Raspberry Pi — Official Documentation"
    url: "https://www.raspberrypi.com/documentation/"
    type: "external"
    description: "Official documentation for the Raspberry Pi hardware used for control-plane and utility nodes."
  - label: "Pi-hole — Official Site"
    url: "https://pi-hole.net/"
    type: "external"
    description: "The local DNS/ad-blocking service commonly run on Raspberry Pi nodes in homelab clusters."
---
::

## Related reading

- [MinIO and Distributed AI Storage](/blog/ai-homelab-engineering/07-minio-and-distributed-ai-storage) — previous in the series: the object storage layer.
- [Running Multiple Local Models Without Melting Your GPU](/blog/ai-homelab-engineering/09-running-multiple-local-models-without-melting-gpu) — next: how the GPU tier handles memory pressure.
- [AI Homelab architecture hub](/systems/ai-homelab) — the interactive system diagram.
- [K3s on Raspberry Pis](/blog/infrastructureengineering/01-k3s-on-raspberry-pis) — the full Pi cluster build, step by step.

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
