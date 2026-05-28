---
title: "Joining Worker Nodes"
description: "Adding worker nodes to a K3s Raspberry Pi cluster."
date: 2026-05-26
category: "infrastructure-engineering"
tags:
  - k3s
  - kubernetes
draft: true
slug: joining-worker-nodes
author: Donavan Jones
---

# Joining Worker Nodes

In a distributed Kubernetes setup like a K3s cluster running on a Raspberry Pi-based homelab rack, worker nodes are what give your system real scale and flexibility. In your setup, where ARM64 devices handle lightweight workloads alongside more powerful nodes in your rack, adding workers is a key step in expanding capacity without overcomplicating the control plane. This guide walks through how to safely and cleanly join additional worker nodes to your existing K3s cluster so they can immediately begin running workloads, pods, and services.

## Joining Worker Nodes

How to join worker nodes to the K3s control plane.

Typical steps include installing K3s on the new node in agent mode and pointing it at the existing server node using the cluster token. On your Raspberry Pi cluster, ensure all nodes are on the same network segment within your rack and can resolve each other reliably before attempting to join. You can retrieve the token from the control plane node and use it during installation like this:

```bash
curl -sfL https://get.k3s.io | K3S_URL=https://<server-ip>:6443 K3S_TOKEN=<node-token> sh -
```

Once executed, the node will automatically register with the control plane and appear in your cluster as a ready worker node. You can verify this from your main node using:


```bash
kubectl get nodes
```
At that point, the new worker becomes part of your homelab compute pool, ready to run workloads from your CI/CD pipelines, Gitea runners, or any of your AI and infrastructure services deployed across the rack.

## Conclusion

Adding worker nodes to your K3s cluster is one of the simplest yet most powerful ways to scale your homelab without introducing unnecessary complexity. In your rack setup, this pattern lets you grow compute capacity incrementally—whether you're distributing AI workloads, running CI/CD jobs through Gitea, or hosting backend services across multiple Raspberry Pis. With each new node, your cluster becomes more resilient, more flexible, and better suited for the kind of modular infrastructure you're building.