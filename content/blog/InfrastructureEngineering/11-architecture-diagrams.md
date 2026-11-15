---
title: "Architecture Diagrams"
description: "Visual architecture diagrams for my ARM64 homelab Kubernetes setup — network layout, node topology, storage paths, and service ingress flows."
date: 2025-10-21
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - diagrams
  - architecture
draft: false
slug: architecture-diagrams
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/11-architecture-diagrams.jpg
---

# Architecture Diagrams

My homelab is a seven-node K3s cluster: one Raspberry Pi control plane, three Raspberry Pi workers, and three Jetson Orin Nano Super GPU workers, plus one RTX 3090 workstation outside the cluster. The diagrams below show how those nodes, the in-cluster data services, and the CI/CD path connect. For the whole stack on one page, see the [system overview](/system-overview).

This page shows the relationships between hardware, network, and deployed workloads, so the design is easy to follow whether you're technical or not.

## Node Layout

```text
                    ┌──────────────────────────────┐
                    │  pi-node1 (K3s server, Pi)   │
                    │  Prometheus :30909           │
                    │  Grafana    :30300           │
                    │  Gitea      :32080           │
                    └──────────────┬───────────────┘
                                   │ LAN
     ┌──────────────┬──────────────┼──────────────┬──────────────┐
     │              │              │              │              │
 pi-worker-1    pi-worker-2    pi-worker-3   gpu-worker-1..3   RTX 3090 PC
 (services)     (Redis)        (services)    (Jetson Orin)     (outside K3s)
                                                 │
                     ┌───────────────────────────┼───────────────────────┐
                 gpu-worker-1              gpu-worker-2            gpu-worker-3
                 image-gen: Dreamer SD     speech: Kokoro TTS      llm: llama3.2:3b
                 + small-model shelf       + whisper.cpp STT       pinned in memory
```

The RTX 3090 (24 GB) machine runs the large models, like Ornith-1.0-35B in Ollama, along with the sentence embedder and LoRA training. How the two GPU tiers split work is covered in [RTX 3090 + Jetson Orin: a hybrid AI architecture](/blog/ai-homelab-engineering/03-rtx-3090-jetson-orin-hybrid-architecture).

## Data and Platform Services

```text
  Apps (VerseHub, internal APIs)
        │
        ├── PostgreSQL     relational data
        ├── Redis          cache, pub/sub (on pi-worker-2)
        ├── Weaviate       vector search
        └── MinIO          S3-compatible objects, training datasets

  Observability: Prometheus + Grafana + Loki, Promtail DaemonSet on every node,
                 custom /metrics agent for Jetson GPU load
```

## Deploy Path

```text
  git push main ──► Gitea (in-cluster) ──► Gitea Actions runner
        ──► docker buildx --platform linux/arm64
        ──► k3s ctr images import on each node (imagePullPolicy: Never)
        ──► kubectl rollout
```

The deploy path is explained step by step in the [Gitea runners pipeline](/blog/infrastructureengineering/21-gitea-runners-pipeline) post. Provisioning databases and buckets for each service, and loading models onto each Jetson, goes through [Kingdom Tools](/projects/kingdom-tools), the internal platform I built for this cluster.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For how every node and service fits together, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

---

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

::CtaContactWork
---
buttonText: "Let's Talk About Your Architecture"
supportingCopy: "Mapping out your own homelab or cluster architecture? Let's talk through the design."
destinationUrl: "/hire-me"
---
::

## Conclusion

These architecture diagrams provide a clear, visual understanding of how my homelab and Kubernetes infrastructure are structured and operate. They serve as both a reference for future upgrades and a resource for others interested in building similar systems. If you have questions or want to see more details, feel free to reach out!

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
  buttonText: "Read: ARM64 Considerations"
  supportingCopy: "Continue with \"ARM64 Considerations\" to see the hardware-level tradeoffs behind the topology shown in these diagrams."
  destinationUrl: "/blog/infrastructureengineering/12-arm64-considerations"
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
  - label: "Systems Architecture — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Systems_architecture"
    type: "wikipedia"
    description: "According to this overview, systems architecture describes the structure and behavior of a system — the practice visualized through the homelab diagrams showing node topology, networking, and workload flows."
  - label: "Network Topology — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Network_topology"
    type: "wikipedia"
    description: "Overview of network topology — the physical and logical arrangement of network nodes and connections illustrated in the infrastructure diagrams for the Raspberry Pi K3s cluster."
  - label: "Kubernetes — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes"
    type: "wikipedia"
    description: "According to this overview, Kubernetes orchestrates containerized workloads across nodes — the platform whose control plane, worker nodes, and service boundaries the architecture diagrams document."
  - label: "Infrastructure as Code — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Infrastructure_as_code"
    type: "wikipedia"
    description: "Overview of infrastructure as code — the practice that complements architecture diagrams by capturing the same system structure in version-controlled manifests and configuration files."
---
::

---

## Related reading

- [Monitoring and Troubleshooting](/blog/infrastructureengineering/10-monitoring-and-troubleshooting) — previous in the series
- [ARM64 Considerations](/blog/infrastructureengineering/12-arm64-considerations) — next in the series
- [Infrastructure systems overview](/systems/infrastructure) — the hub page for the whole rack: nodes, services, and how they connect
- [Jetson leaderboard](/jetson-leaderboard) — benchmark results from the Jetson nodes in these diagrams
- [My Homelab Architecture for Agentic AI Development](/blog/ai-homelab-engineering/01-my-homelab-architecture-for-agentic-ai) — the AI side of the same architecture

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*
