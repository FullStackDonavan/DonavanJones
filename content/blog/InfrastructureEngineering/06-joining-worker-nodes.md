---
title: "Joining Worker Nodes"
description: "How to join worker nodes to an existing K3s cluster on Raspberry Pi — token-based authentication, node labeling, and verifying node readiness."
date: 2025-10-06
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - k3s
  - kubernetes
draft: false
slug: joining-worker-nodes
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/06-joining-worker-nodes.jpg
---

# Joining Worker Nodes

To join a worker node to K3s, read the token from `/var/lib/rancher/k3s/server/node-token` on the server, then run the K3s install script on the new node with `K3S_URL` pointing at the server's port 6443 and `K3S_TOKEN` set to that token. The node registers itself as an agent and shows up in `kubectl get nodes` once it's Ready. I've joined three Raspberry Pi workers and three Jetson Orin Nano Super GPU workers to my cluster this way.

In a distributed Kubernetes setup like a K3s cluster running on a Raspberry Pi-based homelab rack, worker nodes are what give your system real scale and flexibility. In my setup, where ARM64 Pis handle lightweight workloads alongside ARM64 Jetson GPU boards, adding workers is a key step in expanding capacity without overcomplicating the control plane. This guide walks through how to safely and cleanly join additional worker nodes to your existing K3s cluster so they can immediately begin running workloads, pods, and services.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For how every node and service fits together, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

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

Before the join, make sure the server has a fixed address (see [installing the K3s control plane](/blog/infrastructureengineering/05-installing-k3s-control-plane)). After it, label the node so workloads land where they belong. Labels also have side effects: a single ServiceLB node label once [broke every LoadBalancer service in my cluster](/blog/infrastructureengineering/46-servicelb-node-label-broke-loadbalancers) with a port 8080 clash, so I double-check labels on every new node now.

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
buttonText: "Let's Talk About Scaling Your Cluster"
supportingCopy: "Adding worker nodes to your own K3s cluster? Let's talk through the architecture."
destinationUrl: "/hire-me"
---
::

## Conclusion

Adding worker nodes to your K3s cluster is one of the simplest yet most powerful ways to scale your homelab without introducing unnecessary complexity. In a rack setup, this pattern lets you grow compute capacity incrementally—whether you're distributing AI workloads, running CI/CD jobs through Gitea, or hosting backend services across multiple Raspberry Pis. With each new node, your cluster becomes more resilient, more flexible, and better suited for the kind of modular infrastructure you're building.

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
  buttonText: "Read: Storage Setup"
  supportingCopy: "Continue with \"Storage Setup\" to give your newly expanded cluster persistent storage for stateful workloads."
  destinationUrl: "/blog/infrastructureengineering/07-storage-setup"
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
  - label: "K3s — Wikipedia"
    url: "https://en.wikipedia.org/wiki/K3s"
    type: "wikipedia"
    description: "According to this overview, K3s uses a token-based join mechanism to add agent nodes to an existing cluster — the installation pattern described in this article."
  - label: "Kubernetes — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes"
    type: "wikipedia"
    description: "Overview of Kubernetes node architecture — understanding control plane vs. worker node separation clarifies why agent nodes join the cluster rather than running their own API server."
  - label: "Cluster Computing — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Computer_cluster"
    type: "wikipedia"
    description: "According to this overview, a computer cluster provides distributed compute by coordinating multiple nodes — the model that makes adding Raspberry Pi workers an effective way to expand homelab capacity."
  - label: "ARM Architecture — Wikipedia"
    url: "https://en.wikipedia.org/wiki/ARM_architecture_family"
    type: "wikipedia"
    description: "Overview of ARM architecture — the instruction set used by Raspberry Pi hardware, which K3s natively supports with ARM64 binaries for both control plane and worker node roles."
---
::

---

## Related reading

- [Installing K3s Control Plane](/blog/infrastructureengineering/05-installing-k3s-control-plane) — previous in the series
- [Storage Setup](/blog/infrastructureengineering/07-storage-setup) — next in the series
- [Node Roles](/blog/infrastructureengineering/27-node-roles) — how each Pi and Jetson node is assigned a role
- [Infrastructure systems overview](/systems/infrastructure) — the hub page for the whole rack: nodes, services, and how they connect
- [Using Three Jetson Orin Nano Supers as an AI Cluster](/blog/ai-homelab-engineering/02-three-jetson-orin-nano-supers-as-ai-cluster) — joining Jetson Orin boards as GPU workers

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*