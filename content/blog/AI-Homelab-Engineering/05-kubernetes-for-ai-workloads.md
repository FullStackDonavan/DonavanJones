---
title: "Kubernetes for AI Workloads"
description: "Kubernetes scheduling for AI inference workloads: GPU resource requests, node affinity on mixed Jetson and Pi nodes, priority classes, and model health checks."
date: 2026-08-30
lastUpdated: "2026-11-14"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - kubernetes
draft: false
slug: kubernetes-for-ai-workloads
author: Donavan Jones
excerptImage: /img/blog/ai-homelab-engineering/05-kubernetes-for-ai-workloads.jpg
---

# Kubernetes for AI Workloads

Kubernetes can run AI inference workloads well, but only if you tell it things its defaults don't know: GPUs are whole units, a model sized for one board can't land on another, and a model server can look healthy while its model failed to load. Scheduling a stateless web service and scheduling a GPU-bound inference workload are different problems, even on the same control plane.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering). For the full system map, see the [AI homelab architecture hub](/systems/ai-homelab).*

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

My cluster is all ARM64, but it's still heterogeneous: four Raspberry Pis with no GPU and three Jetson Orin Nano Supers with 8 GB of unified memory each, every Jetson dedicated to one role (image generation, speech, or LLM). Workloads need explicit placement rules — a speech service scheduled onto the LLM board would fight the pinned model for the same 8 GB, and a GPU workload on a Pi simply won't run. If you mix in x86 nodes, the same mechanism also keeps an x86-only image off ARM64 boards.

```yaml
affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
        - matchExpressions:
            - key: kubernetes.io/arch
              operator: In
              values: ["arm64"]
            - key: kubernetes.io/hostname
              operator: In
              values: ["gpu-worker-2"]   # the speech board
```

The [backend post on GPU allocation](/blog/backendengineering/13-gpu-allocation) covers the same problem from the service side.

## Preventing Resource Contention

The failure mode most specific to AI workloads: a background batch job and an interactive request both scheduled onto the same GPU node, competing for memory, causing the interactive session to see degraded latency at exactly the moment a human is waiting on it. Setting `priorityClassName` on latency-sensitive workloads, combined with resource limits on batch jobs, keeps interactive work from being starved by background work.

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

A generic HTTP liveness probe checking that a port responds isn't enough for a model server — a pod can respond to health checks while its underlying model failed to load or is stuck. Ollama's `/api/generate` only accepts POST, so an `httpGet` probe against it will always fail; probe a cheap GET endpoint for liveness and run a real generation as a separate synthetic check:

```yaml
livenessProbe:
  httpGet:
    path: /api/tags   # GET-able; confirms the server and model registry respond
    port: 11434
  initialDelaySeconds: 60  # model load time, not just process start
  periodSeconds: 30
```

The generous `initialDelaySeconds` matters — a model load can take far longer than a typical web service's startup, and a probe configured for web-service timings will restart-loop a perfectly healthy pod that's still loading a large model into memory. Even llama3.2:3b takes 5.1 s to load on my Jetson, and bigger models take far longer.

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
  destinationUrl: "/blog/ai-homelab-engineering/06-networking-for-ai-clusters"
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

## Related reading

- [Kubernetes for AI Developers: Deploying Local Models with k3s](/blog/ai-homelab-engineering/04-kubernetes-for-ai-developers-k3s) — previous in the series: k3s install and a first model deployment.
- [Networking for AI Clusters](/blog/ai-homelab-engineering/06-networking-for-ai-clusters) — next: the network underneath this scheduling model.
- [AI Homelab architecture hub](/systems/ai-homelab) — the interactive system diagram.
- [Model Loading Strategies](/blog/backendengineering/16-model-loading-strategies) — keeping models warm versus loading on demand.

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
