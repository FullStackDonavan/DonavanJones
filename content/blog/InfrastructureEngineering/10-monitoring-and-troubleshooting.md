---
title: "Monitoring and Troubleshooting"
description: "How to monitor and troubleshoot a Raspberry Pi Kubernetes cluster using Prometheus, Grafana, and kubectl debugging for production issues."
date: 2025-10-18
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - monitoring
  - troubleshooting
draft: false
cluster: "infrastructure-engineering"
slug: monitoring-and-troubleshooting
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/10-monitoring-and-troubleshooting.jpg
---

# Monitoring and Troubleshooting

To monitor a Raspberry Pi K3s cluster, run Prometheus for metrics, Grafana for dashboards, and Loki with a Promtail DaemonSet for logs. Then troubleshoot in a fixed order: node status, `kubectl describe`, `kubectl logs`, services and endpoints, then resource pressure. That's the stack and the workflow I use on my seven-node cluster of four Pis and three Jetson Orin boards.

## Introduction

In a homelab environment like my Raspberry Pi–based K3s cluster, things are intentionally lightweight but still production-inspired. I run multiple worker nodes across Pis in a small rack setup, along with supporting services like Gitea for CI/CD, containerized workloads for AI experiments, and local services that simulate real-world infrastructure patterns.

Because resources are limited and nodes can be sensitive to network or power fluctuations, monitoring and troubleshooting becomes a core part of keeping everything stable. Instead of relying on heavy enterprise tools, I focus on simple, effective observability: logs, metrics, and Kubernetes-native tooling that helps me quickly identify when something drifts out of expected behavior.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For how every node and service fits together, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

---

## How I Monitor My Cluster

My monitoring approach is layered, starting from the node level up to application workloads:

- **Node health (Raspberry Pi layer)**  
  I keep an eye on CPU, memory, temperature, and disk usage across each Pi node. Since these are ARM-based devices running in a compact rack, thermal and memory pressure are usually the first early warning signs.

- **Kubernetes cluster state (K3s layer)**  
  I regularly check node readiness, pod status, and scheduling issues. K3s keeps things lightweight, but that also means I need to be aware of resource contention when multiple services run on the same node.

- **Application-level logs**  
  For workloads like Gitea, AI services, and internal APIs, I rely heavily on logs. Most debugging starts here when something behaves unexpectedly.

- **Networking checks**  
  Since my cluster spans multiple Pis, I periodically validate internal DNS resolution, service discovery, and inter-pod communication.

---

## Common Issues I Run Into

Working in a small homelab cluster means patterns show up repeatedly:

- Pods stuck in `CrashLoopBackOff` due to missing environment variables or resource limits  
- Node pressure when multiple workloads schedule onto a single Pi  
- Networking hiccups after restarts or SD card latency spikes  
- CI/CD pipeline failures from Gitea runners not reaching the cluster API  
- Image pull delays when registry access is slow or cached improperly  

---

## Troubleshooting Workflow

When something breaks, I follow a consistent flow:

1. Check node status across the cluster  
2. Inspect failing pods with `kubectl describe`  
3. Review logs using `kubectl logs`  
4. Verify services and endpoints  
5. Confirm resource usage (CPU/memory pressure on Pis)  
6. Reproduce locally if it’s application-specific  

This helps me separate infrastructure issues from application bugs quickly.

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

## Observability Tools I Use

In my setup, the observability stack is small but complete:

- **Prometheus** for metrics, exposed on NodePort 30909 ([Prometheus on a Pi K3s cluster](/blog/infrastructureengineering/41-prometheus-on-pi-cluster))
- **Grafana** for dashboards on NodePort 30300 ([Grafana on a Pi K3s cluster](/blog/infrastructureengineering/42-grafana-on-pi-cluster))
- **Loki + Promtail** for logs, with Promtail running as a DaemonSet on every node ([Loki and Promtail on a Pi K3s cluster](/blog/infrastructureengineering/43-loki-promtail-on-pi-cluster))
- A small custom agent on the Jetsons that exposes GPU load on a `/metrics` endpoint for Prometheus to scrape
- `kubectl` and `journalctl` for direct inspection, and Gitea logs for CI/CD debugging

One failure mode no dashboard explained at first: on the Jetsons, models would OOM even when `free -h` showed memory "available". The CUDA allocator on Jetson can't reclaim page cache, so the fix is to stop the old model and run `sync; echo 3 > /proc/sys/vm/drop_caches` before loading the next one.

---

::CtaContactWork
---
buttonText: "Let's Talk About Your Observability Stack"
supportingCopy: "Building monitoring and troubleshooting tooling for your own homelab cluster? Let's talk through the architecture."
destinationUrl: "/hire-me"
---
::

## Conclusion

Monitoring and troubleshooting in a Raspberry Pi K3s homelab is less about enterprise-grade tooling and more about consistency and visibility. My rack setup forces me to stay close to the system, which actually makes me a better engineer—I see failures early, understand resource limits clearly, and learn how Kubernetes behaves under constrained conditions.

Over time, this approach has made my cluster more predictable and easier to scale, especially as I continue adding services like CI/CD pipelines, AI workloads, and experimental applications on top of the same infrastructure.

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
  buttonText: "Read: Architecture Diagrams"
  supportingCopy: "Continue with \"Architecture Diagrams\" to see the full system this monitoring setup keeps an eye on, mapped out visually."
  destinationUrl: "/blog/infrastructureengineering/11-architecture-diagrams"
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
  - label: "Observability (Software) — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Observability_(software)"
    type: "wikipedia"
    description: "According to this overview, observability is the ability to understand internal system state from external outputs — the property that kubectl logs, metrics, and health checks provide for the homelab cluster."
  - label: "Kubernetes — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes"
    type: "wikipedia"
    description: "Overview of Kubernetes operations and debugging — understanding the platform's resource model is essential for interpreting kubectl output and diagnosing pod, node, and network failures."
  - label: "Log Management — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Log_management"
    type: "wikipedia"
    description: "According to this overview, log management involves collecting and analyzing system event records — the practice used with journalctl and kubectl logs to trace failures across Raspberry Pi cluster nodes."
  - label: "Root Cause Analysis — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Root_cause_analysis"
    type: "wikipedia"
    description: "Overview of root cause analysis — the structured debugging methodology applied to cluster failures, guiding diagnosis from symptoms through pod status, node health, and physical networking."
---
::

---

## Related reading

- [Persistent Volumes](/blog/infrastructureengineering/09-persistent-volumes) — previous in the series
- [Architecture Diagrams](/blog/infrastructureengineering/11-architecture-diagrams) — next in the series
- [Recovering a K3s Cluster After a Control Plane IP Change](/blog/infrastructureengineering/44-recovering-after-control-plane-ip-change) — a real troubleshooting walkthrough from this cluster
- [Infrastructure systems overview](/systems/infrastructure) — the hub page for the whole rack: nodes, services, and how they connect
- [The Biggest Mistakes I Made Building My AI Homelab](/blog/ai-homelab-engineering/15-biggest-mistakes-building-ai-homelab) — the mistakes that monitoring would have caught earlier

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*