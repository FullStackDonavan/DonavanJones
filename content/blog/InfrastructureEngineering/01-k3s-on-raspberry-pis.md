---
title: "K3s on Raspberry Pis"
description: "Step-by-step guide to setting up a K3s Kubernetes cluster on Raspberry Pi nodes — networking, configuration, and first workload deployment."
date: 2025-09-07
category: "infrastructure-engineering"
tags:
  - k3s
  - raspberry-pi
draft: false
cluster: "infrastructure-engineering"
slug: k3s-on-raspberry-pis
author: Donavan Jones
---

This guide walks through setting up a lightweight Kubernetes distribution (K3s) across a Raspberry Pi cluster, designed for homelab environments. In my setup, this fits into a broader rack-based infrastructure where multiple Pi nodes handle workloads like CI/CD runners, self-hosted services (such as Gitea), and internal APIs. The goal is to create a stable, low-power compute layer that integrates cleanly with my existing homelab architecture and can scale as I add more nodes or services.

# K3s on Raspberry Pis

How to set up K3s on a Raspberry Pi cluster for homelab infrastructure.

K3s is a lightweight Kubernetes distribution designed for edge devices and resource-constrained systems like Raspberry Pi clusters. It removes many of the heavy dependencies of full Kubernetes while still maintaining core functionality, making it ideal for homelabs and small production-like environments.

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

## Networking Notes
In me rack setup, I ensured:

- All Pi nodes are on the same VLAN or flat LAN segment
- Port 6443 is open between nodes
- Consistent DNS or /etc/hosts entries for node resolution

If I’m integrating this with other parts of my homelab—like Gitea runners or AI services running in Docker on my RTX 3090 machine—I usually separate them into dedicated Kubernetes namespaces to keep workloads cleanly isolated and easier to manage.

## Optional: Enable kubectl on Server
```bash
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $(id -u):$(id -g) ~/.kube/config
```

## Conclusion
My Raspberry Pi K3s cluster forms the foundation of my homelab rack, giving me a lightweight distributed compute layer for running services, CI pipelines, and internal tooling with minimal power usage. As my infrastructure expands—especially with components like Gitea CI runners, AI workloads on my RTX 3090 machine, and additional microservices—I rely on this cluster as the orchestration backbone that keeps everything connected, organized, and running reliably.
