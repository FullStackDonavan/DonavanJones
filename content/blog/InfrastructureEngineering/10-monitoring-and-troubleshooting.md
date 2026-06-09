---
title: "Monitoring and Troubleshooting"
description: "How to monitor and troubleshoot a Raspberry Pi Kubernetes cluster using Prometheus, Grafana, and kubectl debugging for production issues."
date: 2025-10-18
category: "infrastructure-engineering"
tags:
  - monitoring
  - troubleshooting
draft: false
cluster: "infrastructure-engineering"
slug: monitoring-and-troubleshooting
author: Donavan Jones
---

# Monitoring and Troubleshooting

## Introduction

In a homelab environment like my Raspberry Pi–based K3s cluster, things are intentionally lightweight but still production-inspired. I run multiple worker nodes across Pis in a small rack setup, along with supporting services like Gitea for CI/CD, containerized workloads for AI experiments, and local services that simulate real-world infrastructure patterns.

Because resources are limited and nodes can be sensitive to network or power fluctuations, monitoring and troubleshooting becomes a core part of keeping everything stable. Instead of relying on heavy enterprise tools, I focus on simple, effective observability: logs, metrics, and Kubernetes-native tooling that helps me quickly identify when something drifts out of expected behavior.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

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

---

*Explore more articles in the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

---

## Observability Tools I Use

In my setup, I prefer lightweight tools that don’t overwhelm the cluster:

- `kubectl` for direct inspection  
- `journalctl` on nodes for system-level logs  
- Basic metrics tooling for CPU/memory tracking  
- Gitea logs for CI/CD debugging  
- Custom scripts for quick health checks across all Pis in the rack  

I intentionally avoid heavy observability stacks unless I specifically need them, since the goal is to keep the cluster lean and responsive.

---

## Conclusion

Monitoring and troubleshooting in a Raspberry Pi K3s homelab is less about enterprise-grade tooling and more about consistency and visibility. My rack setup forces me to stay close to the system, which actually makes me a better engineer—I see failures early, understand resource limits clearly, and learn how Kubernetes behaves under constrained conditions.

Over time, this approach has made my cluster more predictable and easier to scale, especially as I continue adding services like CI/CD pipelines, AI workloads, and experimental applications on top of the same infrastructure.

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*