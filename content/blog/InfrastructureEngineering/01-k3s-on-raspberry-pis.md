---
title: "K3s on Raspberry Pis"
description: "Step-by-step guide to setting up a K3s Kubernetes cluster on Raspberry Pi nodes — networking, configuration, and first workload deployment."
date: 2025-09-07
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - k3s
  - raspberry-pi
draft: false
cluster: "infrastructure-engineering"
slug: k3s-on-raspberry-pis
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/01-k3s-on-raspberry-pis.jpg
---

# K3s on Raspberry Pis

To run K3s on Raspberry Pis, flash a 64-bit OS, give every Pi a fixed IP, install the K3s server on one Pi with the official script, then join the rest as agents using the server's node token. That's the whole core install. In my rack, one Pi (pi-node1) is the control plane and three more (pi-worker-1 to -3) are workers, and the same cluster later took on three Jetson Orin Nano Super GPU workers.

This guide walks through that setup for a homelab. In my rack, the Pi nodes run CI/CD runners, self-hosted services like Gitea, and internal APIs. The goal is a stable, low-power compute layer that can grow as I add nodes or services.

K3s is a lightweight Kubernetes distribution designed for edge devices and resource-constrained systems like Raspberry Pi clusters. It removes many of the heavy dependencies of full Kubernetes while still maintaining core functionality, making it ideal for homelabs and small production-like environments.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For how every node and service fits together, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

## Prerequisites

- Raspberry Pi 4 or newer (recommended for control plane node)
- Raspberry Pi OS Lite (64-bit preferred)
- Static IPs or DHCP reservations for each node
- SSH access enabled on all nodes
- At least one node designated as the server (control plane)

## Update All Nodes

Run the following on every Raspberry Pi:

```bash
sudo apt update && sudo apt upgrade -y
sudo reboot
```

## Install K3s on the Server Node
On the primary control plane node:

```bash
curl -sfL https://get.k3s.io | sh -
```

After installation, verify:

```bash
kubectl get nodes
```

Retrieve the node token for agents:

```bash
sudo cat /var/lib/rancher/k3s/server/node-token
```

## Join Worker Nodes
On each worker Pi, replace <SERVER_IP> and <NODE_TOKEN>:

```bash
curl -sfL https://get.k3s.io | K3S_URL=https://<SERVER_IP>:6443 K3S_TOKEN=<NODE_TOKEN> sh -
```

Verify from the server:

```bash
kubectl get nodes -o wide
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

## Networking Notes
In my rack setup, I ensured:

- All Pi nodes are on the same VLAN or flat LAN segment
- Port 6443 is open between nodes
- Consistent DNS or /etc/hosts entries for node resolution (see [static IPs and networking for Pi nodes](/blog/infrastructureengineering/04-static-ips-and-networking))

The fixed-IP part matters more than it looks: my control plane's IP changed once, and it took a full recovery to get the cluster healthy again — I wrote up how I [recovered the cluster after the control plane IP change](/blog/infrastructureengineering/44-recovering-after-control-plane-ip-change).

If I’m integrating this with other parts of my homelab—like [Gitea Actions runners](/blog/infrastructureengineering/21-gitea-runners-pipeline) or AI services running in Docker on my RTX 3090 machine—I usually separate them into dedicated Kubernetes namespaces to keep workloads cleanly isolated and easier to manage.

## Optional: Enable kubectl on Server
```bash
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $(id -u):$(id -g) ~/.kube/config
```

::CtaContactWork
---
buttonText: "Let's Talk About Your Kubernetes Cluster"
supportingCopy: "Setting up K3s on your own Raspberry Pi or homelab hardware? Let's talk through the architecture."
destinationUrl: "/hire-me"
---
::

## Conclusion
My Raspberry Pi K3s cluster forms the foundation of my homelab rack, giving me a lightweight distributed compute layer for running services, CI pipelines, and internal tooling with minimal power usage. As my infrastructure expands—especially with components like Gitea CI runners, AI workloads on my RTX 3090 machine, and additional microservices—I rely on this cluster as the orchestration backbone that keeps everything connected, organized, and running reliably.

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
  buttonText: "Read: Hardware List and Costs"
  supportingCopy: "Continue with \"Hardware List and Costs\" for the full parts list and pricing behind this cluster."
  destinationUrl: "/blog/infrastructureengineering/02-hardware-list-and-costs"
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
    description: "According to this overview, K3s is a lightweight, certified Kubernetes distribution designed for resource-constrained environments — the orchestration layer running across the Raspberry Pi cluster described in this article."
  - label: "Kubernetes — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes"
    type: "wikipedia"
    description: "Overview of Kubernetes as a container orchestration system — the upstream project that K3s packages for ARM64 homelab and edge environments."
  - label: "Raspberry Pi — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Raspberry_Pi"
    type: "wikipedia"
    description: "According to this overview, Raspberry Pi is a low-cost single-board computer — the ARM64 hardware forming the physical compute layer of the homelab cluster."
  - label: "Edge Computing — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Edge_computing"
    type: "wikipedia"
    description: "Overview of edge computing — the architectural model that motivates running Kubernetes locally on low-power hardware rather than delegating all compute to cloud providers."
---
::

---

## Related reading

- [Hardware List and Costs](/blog/infrastructureengineering/02-hardware-list-and-costs) — next in the series
- [Installing K3s Control Plane](/blog/infrastructureengineering/05-installing-k3s-control-plane) — the control plane install in more detail
- [Infrastructure systems overview](/systems/infrastructure) — the hub page for the whole rack: nodes, services, and how they connect
- [Kubernetes for AI Developers: Deploying Local Models with k3s](/blog/ai-homelab-engineering/04-kubernetes-for-ai-developers-k3s) — deploying local AI models onto the same K3s cluster

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*
