---
title: "Kubernetes for AI Developers: Deploying Local Models with k3s"
description: "A practical introduction to k3s for developers who want Kubernetes' scheduling and reliability without its usual operational weight."
date: 2026-02-04
lastUpdated: "2026-06-09"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - kubernetes
  - k3s
draft: true
slug: kubernetes-for-ai-developers-k3s
author: Donavan Jones
---

# Kubernetes for AI Developers: Deploying Local Models with k3s

Most AI developers' relationship with Kubernetes is limited to deploying to a cloud cluster someone else manages. Running your own — specifically k3s, the lightweight distribution that makes this practical on modest hardware — is a different and useful skill, and it's the backbone of every homelab article in this series.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI homelab deep-dive in this series."
destinationUrl: "/categories/ai-homelab-engineering"
---
::

## Why k3s Instead of Full Kubernetes

Full Kubernetes (kubeadm-based clusters, or a managed distribution) carries operational weight — etcd management, a heavier control plane footprint — that's justified at scale and unnecessary for a homelab. k3s strips this down to a single binary, bundles a lightweight datastore by default, and runs comfortably even on ARM64 boards with limited RAM, without giving up the core scheduling and reliability model that makes Kubernetes worth using in the first place.

## Installing the Control Plane

```bash
curl -sfL https://get.k3s.io | sh -
sudo cat /var/lib/rancher/k3s/server/node-token  # save this for worker nodes
```

Adding a worker (Jetson, Raspberry Pi, or another x86 machine) is a one-liner pointed at the control plane:

```bash
curl -sfL https://get.k3s.io | K3S_URL=https://<control-plane-ip>:6443 \
  K3S_TOKEN=<saved-token> sh -
```

## Deploying a Model-Serving Workload

A minimal deployment for an Ollama-backed model server, requesting GPU access explicitly so the scheduler places it on a GPU-capable node:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ollama-server
spec:
  replicas: 1
  selector:
    matchLabels: {app: ollama}
  template:
    metadata:
      labels: {app: ollama}
    spec:
      containers:
        - name: ollama
          image: ollama/ollama:latest
          resources:
            limits:
              nvidia.com/gpu: 1
          volumeMounts:
            - name: models
              mountPath: /root/.ollama
      volumes:
        - name: models
          persistentVolumeClaim:
            claimName: ollama-models-pvc
```

The `persistentVolumeClaim` matters more than it looks — without it, a pod restart re-downloads every model from scratch, which on a home internet connection is a real wait, not a minor inconvenience.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how k3s orchestrates the full hybrid AI homelab."
destinationUrl: "/systems/ai-homelab"
---
::

## What Kubernetes Actually Buys You Here

Automatic restart when a model server crashes. Rolling updates without manual coordination across nodes. A consistent deployment model across genuinely different hardware architectures (ARM64 and x86) that would otherwise need separate tooling and separate runbooks. None of this is strictly necessary for a single-machine setup — it becomes valuable exactly at the point where you have more than one node and want workloads to be reliable without babysitting them.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Raspberry Pi AI Cluster Blueprint"
  supportingCopy: "Get working k3s configs and the full deployment blueprint ($39)."
  destinationUrl: "/products/raspberry-pi-ai-cluster-blueprint"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Kubernetes for AI Workloads"
  supportingCopy: "Scheduling patterns specific to AI inference workloads."
  destinationUrl: "/blog/ai-homelab-engineering/kubernetes-for-ai-workloads"
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
  - label: "k3s — Official Documentation"
    url: "https://docs.k3s.io/"
    type: "external"
    description: "Official documentation for the lightweight Kubernetes distribution covered throughout this article."
  - label: "Kubernetes — Official Documentation"
    url: "https://kubernetes.io/docs/home/"
    type: "external"
    description: "The upstream project k3s is a lightweight distribution of."
---
::

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
