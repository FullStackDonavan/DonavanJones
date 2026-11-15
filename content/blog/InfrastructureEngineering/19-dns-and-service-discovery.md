---
title: "DNS and Service Discovery"
description: "How DNS and service discovery work inside a Kubernetes cluster — CoreDNS configuration, service naming, and resolving inter-pod communication issues."
date: 2025-11-10
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - kubernetes
  - dns
draft: false
slug: dns-and-service-discovery
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/19-dns-and-service-discovery.jpg
---

# DNS and Service Discovery

Kubernetes service discovery works through DNS. Every Service gets a stable name like `my-service.my-namespace.svc.cluster.local`, CoreDNS resolves it to the Service's cluster IP, and the Service forwards traffic to whichever pods currently match its label selector. Pods never need to know another pod's IP. K3s ships CoreDNS by default, so this works out of the box.

## Introduction

In a Kubernetes-based homelab, DNS and service discovery are what make the entire system feel “alive” instead of just a collection of isolated containers. In my own setup—running a K3s cluster across four Raspberry Pis and three Jetson Orin GPU workers, along with heavier workloads offloaded to a separate RTX 3090 development machine—service discovery is the backbone that allows everything to communicate without hardcoding IPs.

As the cluster grows to include services like my Bible app, Gitea CI runners, AI microservices, and backend APIs, DNS becomes essential for keeping communication stable even when pods restart, scale, or move between nodes. Instead of chasing IP addresses, services simply find each other by name.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For how every node and service fits together, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

---

## How Kubernetes DNS Works

Kubernetes uses CoreDNS (in most modern clusters, including K3s) to resolve service names inside the cluster. Every service gets a stable DNS entry automatically.

For example:

- `my-service.default.svc.cluster.local`
- Shortened inside the cluster to just `my-service`

This means any pod can reach another service using a consistent name instead of an unstable IP address.

In my homelab rack, this is especially useful because nodes can reboot and pods reschedule between Pi workers, and AI services live on specific Jetson GPU workers. DNS abstracts all of that complexity away.

---

## Service Discovery in Practice

Service discovery in Kubernetes happens through Services, Endpoints, and labels.

- **Services** act as stable entry points.
- **Labels & selectors** define which pods belong to which service.
- **Endpoints** update automatically when pods change.

In my setup, this is what allows things like:

- The [VerseHub](/projects/versehub) frontend talking to backend APIs without knowing where they are running
- Workers reaching Redis, PostgreSQL, Weaviate, and MinIO by service name, wherever those pods are scheduled
- AI services in Docker containers on my dev machine being reachable from cluster workloads when exposed properly
- CI/CD runners in Gitea picking up jobs and routing them correctly across nodes

Everything is loosely coupled but still deeply connected.

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

## DNS in a Hybrid Homelab (Rack + Dev Machine)

My setup isn’t a pure cloud-native cluster—it’s hybrid:

- K3s running on a small homelab rack (seven nodes: four Pis, three Jetsons)
- A separate development machine with an RTX 3090 running AI containers
- Gitea running inside the cluster acting as the glue for CI/CD
- Services deployed via manifests pushed through repositories

This makes DNS even more important because not everything is in one place. Some services live inside the cluster, while others are exposed externally and consumed internally.

To make this work, I rely on a combination of:

- Cluster DNS (CoreDNS)
- Internal service names (`*.svc.cluster.local`)
- External service mappings when needed (NodePorts / Ingress — Grafana, Prometheus, and Gitea are NodePorts in my cluster; the ingress side is in [ingress setup on K3s](/blog/infrastructureengineering/08-ingress-setup))
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

In a multi-node rack setup like mine, it’s also important to verify node networking underneath DNS, especially node IPs. Service names can't help if the nodes themselves can't find the server: my control plane's IP changed once, and the cluster needed a full recovery (see [recovering after a control plane IP change](/blog/infrastructureengineering/44-recovering-after-control-plane-ip-change)).

---

## Why This Matters in My Architecture

As my system grows into a full ecosystem—Bible app, AI agents, game marketplace, CI/CD pipelines, and study tools—service discovery becomes the invisible layer that holds everything together.

Instead of manually wiring services, I can:

- Deploy a new microservice
- Let Kubernetes register it automatically
- Immediately have it accessible across the cluster

This is what allows the system to scale from a few containers into a full distributed platform without becoming unmanageable.

::CtaContactWork
---
buttonText: "Let's Talk About Your Service Discovery Setup"
supportingCopy: "Debugging DNS or service discovery issues on your own cluster? Let's talk through CoreDNS and networking."
destinationUrl: "/hire-me"
---
::

---

## Conclusion

DNS and service discovery are not just Kubernetes features—they are the foundation of how my entire homelab architecture communicates.

In my K3s rack setup, they allow a mix of Raspberry Pi nodes, a dedicated dev machine, and containerized services to behave like one unified system. Whether it’s AI workloads, CI/CD pipelines, or my Bible app backend, everything stays connected through simple service names instead of fragile infrastructure wiring.

As the system continues to grow, this layer will remain one of the most important pieces keeping the architecture stable, scalable, and easy to evolve.

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
  buttonText: "Read: Future Expansion Plans"
  supportingCopy: "Continue with \"Future Expansion Plans\" to see where this DNS and service discovery layer is headed next."
  destinationUrl: "/blog/infrastructureengineering/20-future-expansion-plans"
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
  - label: "Domain Name System — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Domain_Name_System"
    type: "wikipedia"
    description: "According to this overview, DNS translates human-readable names to IP addresses — the protocol that Kubernetes CoreDNS extends to provide service name resolution within the cluster."
  - label: "Service Discovery — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Service_discovery"
    type: "wikipedia"
    description: "Overview of service discovery — the mechanism Kubernetes uses to automatically register services at predictable internal hostnames, allowing microservices to find each other without hardcoded IP addresses."
  - label: "CoreDNS — Wikipedia"
    url: "https://en.wikipedia.org/wiki/CoreDNS"
    type: "wikipedia"
    description: "According to this overview, CoreDNS is the default DNS server in Kubernetes — the cluster DNS that resolves *.svc.cluster.local names and whose health is critical to pod-to-pod communication."
  - label: "Kubernetes Networking — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes#Networking"
    type: "wikipedia"
    description: "Overview of Kubernetes networking principles — the model that underlies service discovery, with every service getting a stable cluster IP and DNS name regardless of which nodes its pods run on."
---
::

---

## Related reading

- [Cost vs Performance Tradeoffs](/blog/infrastructureengineering/18-cost-vs-performance-tradeoffs) — previous in the series
- [Future Expansion Plans](/blog/infrastructureengineering/20-future-expansion-plans) — next in the series
- [Networking Issues](/blog/infrastructureengineering/25-networking-issues) — networking failures I have actually debugged
- [Infrastructure systems overview](/systems/infrastructure) — the hub page for the whole rack: nodes, services, and how they connect
- [VerseHub Architecture](/blog/versehub-engineering/01-versehub-architecture) — the services that rely on this discovery layer

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*