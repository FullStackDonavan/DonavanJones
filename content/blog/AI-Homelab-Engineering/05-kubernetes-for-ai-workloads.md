---
title: "Kubernetes for AI Workloads"
description: "Scheduling patterns specific to AI inference workloads — GPU resource requests, node affinity, and avoiding contention on shared clusters."
date: 2026-02-11
lastUpdated: "2026-06-09"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - kubernetes
draft: true
slug: kubernetes-for-ai-workloads
author: Donavan Jones
---

# Kubernetes for AI Workloads

Scheduling a stateless web service and scheduling a GPU-bound inference workload are different problems, even though both run on the same Kubernetes control plane. AI workloads have resource profiles — VRAM, not just CPU/RAM — and failure modes that generic scheduling defaults don't handle well out of the box.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI homelab deep-dive in this series."
destinationUrl: "/categories/ai-homelab-engineering"
---
::

## GPU Resource Requests Aren't Like CPU/Memory

Kubernetes' default resource model assumes divisible resources — you can request half a CPU core. GPUs, in the standard NVIDIA device plugin model, are requested as whole units; a pod either gets exclusive access to a GPU or it gets none. This means bin-packing multiple small workloads onto one GPU requires either a workload that explicitly manages sharing (running multiple models within one process) or a GPU-sharing solution like NVIDIA's MPS, rather than relying on Kubernetes' default scheduler to divide it up.

## Node Affinity for Heterogeneous Hardware

In a cluster mixing ARM64 (Jetson) and x86 (desktop GPU) nodes, workloads need explicit placement rules — an x86-built container image simply won't run on an ARM64 node, and a workload sized for the 3090's VRAM shouldn't be scheduled onto a Jetson board even if the scheduler considers it "available."

```yaml
affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
        - matchExpressions:
            - key: kubernetes.io/arch
              operator: In
              values: ["arm64"]
```

## Preventing Resource Contention

The failure mode most specific to AI workloads: a background embedding job and an interactive coding-agent session both scheduled onto the same GPU node, competing for VRAM, causing the interactive session to see degraded latency at exactly the moment a human is waiting on it. Setting `priorityClassName` on latency-sensitive workloads, combined with resource limits on batch jobs, keeps interactive work from being starved by background work.

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: interactive-high-priority
value: 1000000
---
# on the interactive workload's pod spec:
priorityClassName: interactive-high-priority
```

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how workload scheduling fits into the full AI homelab architecture."
destinationUrl: "/systems/ai-homelab"
---
::

## Health Checks for Model-Serving Pods

A generic HTTP liveness probe checking that a port responds isn't enough for a model server — a pod can respond to health checks while its underlying model failed to load or is stuck. A more meaningful probe hits an endpoint that actually exercises inference:

```yaml
livenessProbe:
  httpGet:
    path: /api/generate
    port: 11434
  initialDelaySeconds: 60  # model load time, not just process start
  periodSeconds: 30
```

The generous `initialDelaySeconds` matters — a model load can take far longer than a typical web service's startup, and a probe configured for web-service timings will restart-loop a perfectly healthy pod that's still loading a large model into VRAM.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Raspberry Pi AI Cluster Blueprint"
  supportingCopy: "Get working Kubernetes manifests for AI workload scheduling ($39)."
  destinationUrl: "/products/raspberry-pi-ai-cluster-blueprint"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Networking for AI Clusters"
  supportingCopy: "The networking layer underneath this scheduling model."
  destinationUrl: "/blog/ai-homelab-engineering/networking-for-ai-clusters"
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
  - label: "Pod Priority and Preemption — Kubernetes Documentation"
    url: "https://kubernetes.io/docs/concepts/scheduling-eviction/pod-priority-preemption/"
    type: "external"
    description: "Official documentation for the priority-class mechanism used to protect interactive workloads."
  - label: "NVIDIA Multi-Process Service (MPS) — Official Documentation"
    url: "https://docs.nvidia.com/deploy/mps/index.html"
    type: "external"
    description: "NVIDIA's mechanism for sharing a single GPU across multiple processes, referenced above."
---
::

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
