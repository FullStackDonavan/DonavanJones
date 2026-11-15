---
title: "Networking Issues"
description: "Common K3s homelab networking issues and how to debug them: pod-to-pod failures, CoreDNS, ServiceLB/LoadBalancer exposure, Flannel VXLAN, and IP conflicts."
date: 2025-11-26
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - kubernetes
  - networking
draft: false
slug: networking-issues
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/25-networking-issues.jpg
---

# Networking Issues

## Introduction

The most common networking issues in a Kubernetes homelab are pod-to-pod failures across nodes, CoreDNS not resolving service names, services that never become reachable from outside the cluster, flaky node links, and IP conflicts. Debug them in layers — physical, node, pod, then service — and most of them become easy to isolate. In my own setup (a 7-node K3s cluster with a Raspberry Pi control plane, Pi workers and Jetson GPU workers, running Gitea, CI runners and internal tooling), networking breaks more often than compute or storage.

Because K3s is designed to be lightweight, it abstracts a lot of networking complexity, but that also means when something breaks, you often have to dig into CNI behavior, cluster DNS, routing between nodes, and even physical network topology in your rack.

This article covers the most common networking issues I’ve run into (and seen others hit), along with practical debugging approaches that actually work in a real homelab environment.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For the full architecture, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

---

## Common Networking Issues in Kubernetes

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

In a homelab rack, this often comes down to ingress misconfiguration or the load balancer layer. K3s ships its own ServiceLB (Klipper) for `LoadBalancer` services; other clusters use MetalLB.

### Typical causes:
- Service type still set to ClusterIP instead of LoadBalancer or NodePort
- ServiceLB not allowed on the right nodes (or a MetalLB pool not configured correctly)
- Two LoadBalancer services fighting over the same host port
- Router not forwarding traffic to correct node IPs

This one bit me directly: a single node label (`svccontroller.k3s.cattle.io/enablelb`) plus a port 8080 clash left my LoadBalancer services stuck — I wrote up the whole thing in [how one node label broke every LoadBalancer service in my K3s cluster](/blog/infrastructureengineering/46-servicelb-node-label-broke-loadbalancers).

```bash
kubectl get svc
kubectl describe svc <service-name>
```

If you're running a Pi-based rack, make sure your switch and router are not isolating VLANs unintentionally.

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

The related failure is the control-plane node changing IP — every agent loses its server. I had to recover from exactly that once; see [recovering a K3s cluster after a control plane IP change](/blog/infrastructureengineering/44-recovering-after-control-plane-ip-change). The prevention side is in [static IPs and networking](/blog/infrastructureengineering/04-static-ips-and-networking).

## Debugging Strategy I Use in My Rack
In my homelab rack (K3s cluster + CI runners + Gitea + AI containers), I always follow this order:

1. Check node status
2. Check pod status across nodes
3. Validate CoreDNS
4. Test service-to-service communication
5. Check physical network (switch, cables, power)
6. Only then inspect CNI internals

This prevents wasting time debugging Kubernetes when the issue is actually physical networking. Having logs from every node in one place helps a lot here — [Loki and Promtail on a Pi K3s cluster](/blog/infrastructureengineering/43-loki-promtail-on-pi-cluster) covers how I collect them.

::CtaContactWork
---
buttonText: "Let's Talk About Your Networking Problems"
supportingCopy: "Chasing down flaky pod networking or DNS failures in your own cluster? Let's talk through the debugging approach."
destinationUrl: "/hire-me"
---
::

## Conclusion

Networking issues in Kubernetes are rarely caused by a single point of failure—they are usually a chain reaction between cluster configuration, CNI behavior, and underlying physical infrastructure. In a homelab rack environment like a Raspberry Pi K3s cluster, these issues become even more visible due to hardware limitations and simpler networking hardware.

The key takeaway is to always separate the problem into layers: physical network, node network, pod network, and service network. Once you consistently debug in that order, most issues become much easier to isolate and fix.

As your rack grows—with CI/CD runners, Gitea, AI workloads, and additional services—the networking layer becomes the most critical part of the entire system. Keeping it clean and predictable will save you a lot of time long-term.

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
  buttonText: "Read: Networking (Skill)"
  supportingCopy: "Continue with \"Networking (Skill)\" for a deeper look at the fundamentals behind these debugging steps."
  destinationUrl: "/blog/infrastructureengineering/26-networking-skill"
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
  - label: "Computer Network — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Computer_network"
    type: "wikipedia"
    description: "According to this overview, a computer network connects devices through shared communication protocols — understanding the layered network model is essential for systematic debugging of the Kubernetes networking issues described in this article."
  - label: "CoreDNS — Wikipedia"
    url: "https://en.wikipedia.org/wiki/CoreDNS"
    type: "wikipedia"
    description: "Overview of CoreDNS — the Kubernetes cluster DNS whose crash or misconfiguration is one of the most common causes of pod networking failures, particularly in homelab environments using Pi-hole or custom upstream resolvers."
  - label: "Container Network Interface — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Container_Network_Interface"
    type: "wikipedia"
    description: "According to this overview, CNI plugins implement pod networking in Kubernetes — Flannel and Calico are the most common CNI implementations whose misconfiguration causes the inter-pod communication failures described in this article."
  - label: "Flannel — GitHub"
    url: "https://github.com/flannel-io/flannel"
    type: "edu"
    description: "Flannel is the default CNI networking layer in K3s clusters — the software responsible for VXLAN overlay networking whose VXLAN port requirements and subnet configuration are common sources of networking issues."
---
::

---

## Related reading

- [Network Topology](/blog/infrastructureengineering/24-network-topology) — previous in the series: how the rack network is laid out.
- [Networking (Skill)](/blog/infrastructureengineering/26-networking-skill) — next in the series: the fundamentals behind these debugging steps.
- [Infrastructure systems overview](/systems/infrastructure) — the hub for the whole cluster architecture.
- [Networking for AI Clusters](/blog/ai-homelab-engineering/06-networking-for-ai-clusters) — the same network viewed from the AI/Jetson side.

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*