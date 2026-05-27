---
title: "Networking Issues"
description: "Common networking issues in Kubernetes homelab clusters."
date: 2026-05-26
tags:
  - infrastructure
  - kubernetes
  - networking
draft: true
slug: networking-issues
author: Donavan Jones
---

# Networking Issues

## Introduction

Networking is one of the most common failure points in a Kubernetes homelab environment. In my own setup—a Raspberry Pi–based K3s cluster running inside a custom homelab rack alongside services like Gitea, CI runners, and internal tooling—networking issues tend to surface more often than compute or storage problems. 

Because K3s is designed to be lightweight, it abstracts a lot of networking complexity, but that also means when something breaks, you often have to dig into CNI behavior, cluster DNS, routing between nodes, and even physical network topology in your rack.

This article covers the most common networking issues I’ve run into (and seen others hit), along with practical debugging approaches that actually work in a real homelab environment.

---

# Common Networking Issues in Kubernetes

## 1. Pod-to-Pod Communication Failure

One of the first signs of a networking issue is when pods cannot communicate across nodes.

In a multi-node Raspberry Pi cluster, this is often caused by:

- CNI plugin misconfiguration (Flannel, Calico, or Canal)
- Overlapping pod CIDR ranges
- Firewall rules blocking VXLAN or WireGuard traffic
- Node network interfaces not being correctly routed in the rack switch

**Debug steps:**
```bash
kubectl get pods -o wide
kubectl get nodes -o wide
```

Then test direct connectivity between nodes:
```bash
ping <node-ip>
```

If nodes can ping each other but pods cannot, the issue is likely CNI-related.

## 2. CoreDNS Not Resolving Services
Another frequent issue is DNS failure inside the cluster.

Symptoms:
- Pods can reach IPs but not service names
- nslookup kubernetes.default fails inside containers

In my rack setup, this sometimes happens after node restarts or when a worker node rejoins the cluster late.

### Debug steps:
```bash
kubectl get pods -n kube-system
kubectl logs -n kube-system deployment/coredns
```

Common causes:
- CoreDNS stuck in CrashLoopBackOff
- Upstream resolvers misconfigured (common when using Pi-hole or custom DNS in a homelab)
- kubelet not correctly pointing to cluster DNS IP

## 3. Service Not Accessible from Outside Cluster
This is common when exposing services like:
- Gitea
- dashboards
- internal APIs

In a homelab rack, this often comes down to ingress misconfiguration or missing MetalLB setup.

### Typical causes:
- Service type still set to ClusterIP instead of LoadBalancer or NodePort
- MetalLB pool not configured correctly
- Router not forwarding traffic to correct node IPs

```bash
kubectl get svc
kubectl describe svc <service-name>
```

If you're running a Pi-based rack, make sure your switch and router are not isolating VLANs unintentionally.

## 4. Node Network Instability (Common in Raspberry Pi Clusters)
In Raspberry Pi clusters like mine, intermittent network drops are usually caused by:
- Underpowered PoE or USB-C power delivery
- Cheap Ethernet switches
- Loose cables in the rack
- Power-saving features on NICs

This often leads to:
- Nodes randomly NotReady
- Pods being rescheduled repeatedly
- Flapping cluster DNS

### Check node health:
```bash
kubectl describe node <node-name>
```

Look for:

- Network unreachable errors
- Kubelet restarts
- Frequent status transitions

## 5. CNI Plugin Breakdown (Flannel / Calico Issues)
The CNI layer is the backbone of pod networking.

In K3s, Flannel is common by default, but it can break if:

- VXLAN port (8472) is blocked
- Nodes are on multiple subnets without proper routing
- Firewall rules are too aggressive

```bash
kubectl get pods -n kube-system
```

Look for flannel or calico pods not in Running state.

## 6. IP Conflicts in Homelab Networks
This is more common than people expect in rack setups where:

- Static IPs are assigned manually
- DHCP range overlaps with reserved devices
- Multiple routers exist in the network chain

### Symptoms:

- Nodes randomly disconnect
- Duplicate IP warnings
- SSH sessions dropping unexpectedly

### Fix:

- Reserve IPs for all Pi nodes
- Standardize DHCP range on main router
- Avoid mixing static + DHCP unmanaged assignments

## Debugging Strategy I Use in My Rack
In my homelab rack (K3s cluster + CI runners + Gitea + AI containers), I always follow this order:

1. Check node status
2. Check pod status across nodes
3. Validate CoreDNS
4. Test service-to-service communication
5. Check physical network (switch, cables, power)
6. Only then inspect CNI internals

This prevents wasting time debugging Kubernetes when the issue is actually physical networking.

## Conclusion

Networking issues in Kubernetes are rarely caused by a single point of failure—they are usually a chain reaction between cluster configuration, CNI behavior, and underlying physical infrastructure. In a homelab rack environment like a Raspberry Pi K3s cluster, these issues become even more visible due to hardware limitations and simpler networking hardware.

The key takeaway is to always separate the problem into layers: physical network, node network, pod network, and service network. Once you consistently debug in that order, most issues become much easier to isolate and fix.

As your rack grows—with CI/CD runners, Gitea, AI workloads, and additional services—the networking layer becomes the most critical part of the entire system. Keeping it clean and predictable will save you a lot of time long-term.