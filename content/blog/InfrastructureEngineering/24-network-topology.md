---
title: "Network Topology"
description: "How my homelab Kubernetes network is laid out — Pi and Jetson nodes on one LAN, the RTX 3090 box, pod networking, NodePorts, ingress, and planned VLANs."
date: 2025-11-22
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - networking
  - topology
draft: false
slug: network-topology
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/24-network-topology.jpg
---

# Network Topology

My homelab network is one flat private LAN. Seven K3s nodes (four Raspberry Pis and three Jetson Orin GPU workers) and one RTX 3090 workstation all hang off the same switch. On top of that, K3s's CNI handles pod-to-pod traffic, internal tools are exposed as NodePorts, and apps go through ingress. VLAN segmentation is planned, not done yet.

## Introduction

This document outlines the network topology of my homelab, which is built around a K3s Kubernetes cluster of Raspberry Pis and Jetson Orin boards, a dedicated rack setup, and a separate development machine with an RTX 3090 GPU running containerized AI workloads. The goal of this architecture is to create a flexible, self-hosted environment that supports application deployment, CI/CD workflows, AI experimentation, and distributed services.

The network is designed to prioritize reliability, low latency between nodes, and clear separation between development workloads, production-like Kubernetes services, and high-performance compute tasks running outside the cluster.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For how every node and service fits together, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

## Topology Overview

My homelab network is centered around a managed switch in my rack, which connects all core infrastructure components:

- Raspberry Pi nodes running a K3s Kubernetes cluster (pi-node1 control plane + pi-worker-1 to -3)
- Three Jetson Orin Nano Super GPU workers in the same cluster (gpu-worker-1 to -3)
- One Windows workstation with an RTX 3090 that hosts the large AI models and doubles as my development machine for building and pushing code
- A Gitea instance running inside the Kubernetes cluster for source control
- CI/CD runners deployed within the cluster for automated builds and deployments
- Storage and supporting services (databases, caches, and vector stores)

All devices communicate over a private LAN, with Kubernetes handling service-level networking between pods and nodes, while the switch handles physical routing between machines.

## Kubernetes Network Layer

Inside the cluster, K3s manages pod-to-pod communication using a lightweight CNI. Services are exposed internally through ClusterIP and externally via controlled ingress rules. This allows:

- Internal service discovery between microservices
- Isolated namespaces for different workloads
- Controlled exposure of applications like Gitea, dashboards, and APIs

Internal tools use NodePorts: Prometheus on 30909, Grafana on 30300, and Gitea on 32080. `LoadBalancer` services go through K3s's built-in ServiceLB (Klipper), where a node label decides which nodes publish the port. That label is easy to get wrong. It once [broke every LoadBalancer service in my cluster](/blog/infrastructureengineering/46-servicelb-node-label-broke-loadbalancers) through a port 8080 clash.

Pi workers handle distributed services, Jetson workers handle GPU inference, and the control plane manages scheduling and cluster state. Every node needs a fixed address — see [static IPs and networking](/blog/infrastructureengineering/04-static-ips-and-networking).

## Development and CI/CD Flow

My development workflow is tightly integrated into the network:

1. Code is written on my development machine
2. Changes are pushed to Gitea running in the cluster
3. CI runners automatically build and test the application
4. Successful builds are deployed into Kubernetes namespaces

This creates a self-hosted pipeline that reduces dependency on external CI services and keeps all deployment traffic within the local network.

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

## GPU Compute: Jetsons Inside, RTX 3090 Outside

GPU compute sits in two places on the network. The three Jetson Orin boards are regular K3s workers, so their services (image generation, speech, and the llama3.2:3b LLM) are reachable by cluster DNS like anything else.

The RTX 3090 machine runs separately from the Kubernetes cluster but is still part of the same network. It hosts large-model inference (Ornith-1.0-35B in Ollama), the sentence embedder for VerseHub in Docker, and LoRA training. Communication between the cluster and this machine happens over internal APIs and service endpoints on the LAN. More on the AI side of the network in [networking for AI clusters](/blog/ai-homelab-engineering/06-networking-for-ai-clusters).

::CtaContactWork
---
buttonText: "Let's Talk About Your Network Design"
supportingCopy: "Planning the network topology for your own cluster and rack? Let's talk through routing and segmentation."
destinationUrl: "/hire-me"
---
::

## Conclusion

This network topology is designed to scale from a simple homelab into a production-like distributed system. By combining a Kubernetes cluster of Raspberry Pis and Jetson GPU workers, a dedicated GPU compute machine, and a tightly integrated CI/CD pipeline using Gitea, the system functions as a unified development and deployment environment.

As the infrastructure evolves, the next steps include deeper network segmentation (VLANs) and tracing alongside the existing Prometheus, Grafana, and Loki monitoring.

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
  buttonText: "Read: Networking Issues"
  supportingCopy: "Continue with \"Networking Issues\" to see common problems that show up once this topology is running."
  destinationUrl: "/blog/infrastructureengineering/25-networking-issues"
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
  - label: "Network Topology — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Network_topology"
    type: "wikipedia"
    description: "According to this overview, network topology describes the physical and logical arrangement of network nodes — the design concept underlying the homelab's switch, uplink, and internal cluster traffic layout."
  - label: "Virtual LAN — Wikipedia"
    url: "https://en.wikipedia.org/wiki/VLAN"
    type: "wikipedia"
    description: "Overview of VLANs — the network segmentation technology planned for future expansion to isolate cluster traffic, storage replication, and ingress flows from each other."
  - label: "Kubernetes Networking — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes#Networking"
    type: "wikipedia"
    description: "According to this overview, Kubernetes networking gives every pod a unique IP and provides service-level DNS — the virtual network layer overlaid on the physical switch topology described in this article."
  - label: "Network Switch — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Network_switch"
    type: "wikipedia"
    description: "Overview of network switches — the central switching hardware connecting all Raspberry Pi nodes, the GPU development machine, and the router uplink into a single internal cluster network."
---
::

---

## Related reading

- [Installing Gitea in Kubernetes](/blog/infrastructureengineering/23-installing-gitea-in-kubernetes) — previous in the series
- [Networking Issues](/blog/infrastructureengineering/25-networking-issues) — next in the series
- [DNS and Service Discovery](/blog/infrastructureengineering/19-dns-and-service-discovery) — how services find each other on top of this network
- [Infrastructure systems overview](/systems/infrastructure) — the hub page for the whole rack: nodes, services, and how they connect
- [My Homelab Architecture for Agentic AI Development](/blog/ai-homelab-engineering/01-my-homelab-architecture-for-agentic-ai) — the AI workloads running across this network

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*