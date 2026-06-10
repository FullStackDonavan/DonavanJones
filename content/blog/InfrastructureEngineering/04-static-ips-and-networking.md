---
title: "Static IPs and Networking"
description: "How to configure static IP addresses and networking on Raspberry Pi nodes so every Kubernetes cluster member has a stable, predictable address."
date: 2025-09-24
lastUpdated: "2026-06-09"
category: "infrastructure-engineering"
tags:
  - networking
  - raspberry-pi
draft: false
slug: static-ips-and-networking
author: Donavan Jones
---

# Static IPs and Networking

## Introduction

In a homelab environment, especially one built around a Raspberry Pi Kubernetes cluster like the one in my rack setup, networking becomes the backbone of everything. When you're running multiple nodes, services, and possibly external integrations (like Gitea CI runners, AI workloads, or storage services), you cannot rely on DHCP to keep things stable long-term.

In my rack, I’m running a multi-node K3s cluster distributed across Raspberry Pis, alongside a separate development machine with an RTX 3090 handling heavier containerized AI workloads. This mix of edge devices and compute nodes makes consistent networking critical. Static IPs ensure that each node is always reachable, predictable, and properly referenced in Kubernetes manifests, SSH configs, and service discovery setups.

This guide walks through how I structured static IPs and networking so my cluster remains stable, reproducible, and easy to manage.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

---

# Why Static IPs Matter in a Kubernetes Homelab

When running Kubernetes on Raspberry Pis, dynamic IPs introduce unnecessary complexity:

- Nodes can disappear from the cluster if IPs change
- kubectl contexts break when nodes shift addresses
- SSH access becomes unreliable
- Load balancers and ingress rules become unstable
- CI/CD runners lose connectivity to the control plane

By assigning static IPs, every node becomes a fixed “infrastructure primitive” rather than a moving target.

In my setup, this is especially important because:

- The control plane node must always be reachable
- Worker nodes are pinned to specific roles (e.g., AI workloads, storage, CI runners)
- External services (like my Gitea instance running in-cluster) depend on predictable routing

---

# Network Layout Overview

My homelab rack is structured around a simple but scalable layout:

- Router provides DHCP for baseline connectivity
- Raspberry Pi nodes are assigned static IPs outside DHCP range
- Kubernetes control plane has the lowest reserved IP
- Worker nodes are grouped by function (compute, storage, CI/CD)
- Development machine (RTX 3090 box) sits on the same LAN for container builds and model inference

Example layout:

| Node Type        | Hostname        | Static IP       |
|----------------|----------------|----------------|
| Control Plane   | pi-master       | 192.168.1.10    |
| Worker Node 1   | pi-worker-1     | 192.168.1.11    |
| Worker Node 2   | pi-worker-2     | 192.168.1.12    |
| CI Runner Node  | pi-runner       | 192.168.1.13    |
| Dev GPU Machine | dev-3090        | 192.168.1.50    |

This structure ensures everything in the cluster is addressable without ambiguity.

---

# Method 1: Router-Based Static DHCP Reservations (Recommended)

The cleanest approach is setting static leases directly in your router.

Steps:

1. Log into your router admin panel
2. Find “DHCP Reservation” or “Static Leases”
3. Match each Raspberry Pi MAC address to a fixed IP
4. Assign IPs outside your dynamic pool
5. Reboot devices or renew DHCP leases

Advantages:
- Centralized control
- Easy to manage and visualize
- No per-device configuration drift

This is the method I prefer for most of my rack because it scales cleanly as I add more nodes.

---

# Method 2: Static IPs on Raspberry Pi OS

If router control is limited, you can configure static IPs directly on each Pi.

Edit the DHCP client configuration:

```bash
sudo nano /etc/dhcpcd.conf
```

```bash
interface eth0
static ip_address=192.168.1.11/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1 8.8.8.8
```

Then restart networking:


```bash
sudo systemctl restart dhcpcd
```

This method is useful when devices need to remain stable even if moved between networks.

---

*Explore more articles in the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

---

## DNS and Hostname Resolution
Static IPs alone are not enough—you also need predictable name resolution.

In my setup:

- Each node has a hostname matching its role
- Router handles local DNS resolution when possible
- /etc/hosts is used as a fallback for direct node-to-node resolution
- Kubernetes internal DNS handles service-level discovery

Example /etc/hosts entry:


```bash
192.168.1.10  pi-master
192.168.1.11  pi-worker-1
192.168.1.12  pi-worker-2
```

This makes SSH and cluster operations significantly faster and more reliable.

## Kubernetes Networking Considerations

Since this is a K3s cluster, networking is simplified but still sensitive to IP stability.

Static IPs ensure:

- K3s server URL (https://192.168.1.10:6443) never changes
- Worker nodes always reconnect without rejoining cluster
- CNI (Flannel in my setup) maintains consistent pod routing
- Ingress controllers remain stable under restarts

In my rack, I also isolate cluster traffic from general LAN traffic where possible, especially for workloads involving:

- AI inference pipelines
- CI/CD builds via Gitea runners
- Internal service-to-service communication


## Common Mistakes to Avoid
- Putting static IPs inside DHCP range (causes conflicts)
- Forgetting to update DNS after IP changes
- Mixing router reservations with OS-level static configs
- Not documenting IP assignments (this becomes painful later)
- Using random IPs per node without structure

A structured IP plan is just as important as the cluster itself.

## Conclusion

Static IP networking is one of the foundational layers that makes a Raspberry Pi Kubernetes cluster stable and scalable. In my rack setup, it is what allows everything—from the K3s control plane to CI/CD runners and GPU-backed development machines—to behave like a unified system instead of a collection of loosely connected devices.

Once static IPs are in place, everything else in the stack becomes easier: Kubernetes stops breaking on reboot, services become predictable, and the entire homelab starts to feel like a real production-like environment rather than a hobby cluster.

This is one of those “invisible” infrastructure decisions that quietly determines whether your system feels fragile or solid.

---

## Further Reading

::AuthoritativeLinks
---
title: "Sources"
links:
  - label: "Dynamic Host Configuration Protocol — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol"
    type: "wikipedia"
    description: "According to this overview, DHCP automatically assigns IP addresses to network devices — understanding DHCP reservations is the foundation for the router-based static IP strategy described in this article."
  - label: "IP Address — Wikipedia"
    url: "https://en.wikipedia.org/wiki/IP_address"
    type: "wikipedia"
    description: "Overview of IP addressing — the network identity that must remain stable for each Kubernetes node to maintain cluster connectivity, API server URLs, and CNI routing."
  - label: "Domain Name System — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Domain_Name_System"
    type: "wikipedia"
    description: "According to this overview, DNS translates human-readable names to IP addresses — the resolution layer configured via /etc/hosts and router DNS so node hostnames resolve reliably within the cluster."
  - label: "Computer Network — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Computer_network"
    type: "wikipedia"
    description: "Overview of computer networking concepts — the foundational knowledge underlying IP planning, subnet design, and the networking decisions that determine whether a Kubernetes cluster stays stable across reboots."
---
::

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*