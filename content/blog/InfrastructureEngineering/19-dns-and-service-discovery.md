---
title: "DNS and Service Discovery"
description: "How DNS and service discovery work inside a Kubernetes cluster — CoreDNS configuration, service naming, and resolving inter-pod communication issues."
date: 2025-11-10
category: "infrastructure-engineering"
tags:
  - kubernetes
  - dns
draft: false
slug: dns-and-service-discovery
author: Donavan Jones
---

# DNS and Service Discovery

## Introduction

In a Kubernetes-based homelab, DNS and service discovery are what make the entire system feel “alive” instead of just a collection of isolated containers. In my own setup—running a K3s cluster across a small rack of machines and Raspberry Pi nodes, along with heavier workloads offloaded to a separate RTX 3090 development machine—service discovery is the backbone that allows everything to communicate without hardcoding IPs.

As the cluster grows to include services like my Bible app, Gitea CI runners, AI microservices, and backend APIs, DNS becomes essential for keeping communication stable even when pods restart, scale, or move between nodes. Instead of chasing IP addresses, services simply find each other by name.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

---

## How Kubernetes DNS Works

Kubernetes uses CoreDNS (in most modern clusters, including K3s) to resolve service names inside the cluster. Every service gets a stable DNS entry automatically.

For example:

- `my-service.default.svc.cluster.local`
- Shortened inside the cluster to just `my-service`

This means any pod can reach another service using a consistent name instead of an unstable IP address.

In my homelab rack, this is especially useful because nodes can reboot, pods reschedule, and workloads shift between ARM-based Pis and more powerful x86 machines. DNS abstracts all of that complexity away.

---

## Service Discovery in Practice

Service discovery in Kubernetes happens through Services, Endpoints, and labels.

- **Services** act as stable entry points.
- **Labels & selectors** define which pods belong to which service.
- **Endpoints** update automatically when pods change.

In my setup, this is what allows things like:

- The Bible app frontend talking to backend APIs without knowing where they are running
- AI services in Docker containers on my dev machine being reachable from cluster workloads when exposed properly
- CI/CD runners in Gitea picking up jobs and routing them correctly across nodes

Everything is loosely coupled but still deeply connected.

---

*Explore more articles in the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

---

## DNS in a Hybrid Homelab (Rack + Dev Machine)

My setup isn’t a pure cloud-native cluster—it’s hybrid:

- K3s running on a small homelab rack (multiple nodes)
- A separate development machine with an RTX 3090 running AI containers
- Gitea running inside the cluster acting as the glue for CI/CD
- Services deployed via manifests pushed through repositories

This makes DNS even more important because not everything is in one place. Some services live inside the cluster, while others are exposed externally and consumed internally.

To make this work, I rely on a combination of:

- Cluster DNS (CoreDNS)
- Internal service names (`*.svc.cluster.local`)
- External service mappings when needed (NodePorts / Ingress)
- Consistent naming conventions across deployments

---

## Debugging DNS Issues

When things break in a cluster, DNS is usually one of the first suspects. Common issues include:

- Pod can’t resolve service name
- Wrong namespace reference
- CoreDNS crash or misconfiguration
- Network policy blocking traffic

Typical debugging tools:

- `kubectl get svc`
- `kubectl get endpoints`
- `nslookup` or `dig` inside a debug pod
- Checking CoreDNS logs

In a multi-node rack setup like mine, it’s also important to verify node networking, especially when mixing ARM nodes and a more powerful x86 machine.

---

## Why This Matters in My Architecture

As my system grows into a full ecosystem—Bible app, AI agents, game marketplace, CI/CD pipelines, and study tools—service discovery becomes the invisible layer that holds everything together.

Instead of manually wiring services, I can:

- Deploy a new microservice
- Let Kubernetes register it automatically
- Immediately have it accessible across the cluster

This is what allows the system to scale from a few containers into a full distributed platform without becoming unmanageable.

---

## Conclusion

DNS and service discovery are not just Kubernetes features—they are the foundation of how my entire homelab architecture communicates.

In my K3s rack setup, they allow a mix of Raspberry Pi nodes, a dedicated dev machine, and containerized services to behave like one unified system. Whether it’s AI workloads, CI/CD pipelines, or my Bible app backend, everything stays connected through simple service names instead of fragile infrastructure wiring.

As the system continues to grow, this layer will remain one of the most important pieces keeping the architecture stable, scalable, and easy to evolve.

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*