---
title: "K3s on Raspberry Pis"
description: "Guide to setting up K3s on Raspberry Pi clusters."
date: 2026-05-26
tags:
  - infrastructure
  - k3s
  - raspberry-pi
draft: false
slug: k3s-on-raspberry-pis
author: Donavan Jones
---

This guide walks through setting up a lightweight Kubernetes distribution (K3s) across a Raspberry Pi cluster, designed for homelab environments. In your setup, this typically fits into a broader rack-based infrastructure where multiple Pi nodes handle workloads like CI/CD runners, self-hosted services (such as Gitea), and internal APIs. The goal is to create a stable, low-power compute layer that integrates cleanly with your existing homelab architecture and can scale as you add more nodes or services.

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
In your rack setup, ensure:

- All Pi nodes are on the same VLAN or flat LAN segment
- Port 6443 is open between nodes
- Consistent DNS or /etc/hosts entries for node resolution

If you're integrating with other parts of your homelab (like your Gitea runners or AI services running in Docker on your 3090 machine), consider assigning dedicated namespaces for separation.

## Optional: Enable kubectl on Server
```bash
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $(id -u):$(id -g) ~/.kube/config
```

## Conclusion
Your Raspberry Pi K3s cluster becomes the foundational layer of your homelab rack, giving you a distributed compute environment that can run services, CI pipelines, and internal tooling with minimal power consumption. As your infrastructure grows—especially with components like Gitea CI runners, AI workloads on your RTX 3090 machine, and additional microservices—you can treat this cluster as the orchestration backbone that ties everything together cleanly and reliably.