---
title: "Network Topology"
description: "How I designed the network topology for my homelab Kubernetes cluster — VLANs, subnet planning, node communication paths, and external access routing."
date: 2025-11-22
lastUpdated: "2026-06-09"
category: "infrastructure-engineering"
tags:
  - networking
  - topology
draft: false
slug: network-topology
author: Donavan Jones
---

# Network Topology

## Introduction

This document outlines the network topology of my homelab, which is built around a Raspberry Pi-based K3s Kubernetes cluster, a dedicated rack setup, and a separate development machine with an RTX 3090 GPU running containerized AI workloads. The goal of this architecture is to create a flexible, self-hosted environment that supports application deployment, CI/CD workflows, AI experimentation, and distributed services.

The network is designed to prioritize reliability, low latency between nodes, and clear separation between development workloads, production-like Kubernetes services, and high-performance compute tasks running outside the cluster.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

## Topology Overview

My homelab network is centered around a managed switch in my rack, which connects all core infrastructure components:

- Raspberry Pi nodes running a K3s Kubernetes cluster (control plane + worker nodes)
- A dedicated machine hosting containerized AI models (RTX 3090 GPU)
- A development machine used for building and pushing deployments
- A Gitea instance running inside the Kubernetes cluster for source control
- CI/CD runners deployed within the cluster for automated builds and deployments
- Storage and supporting services (databases, caches, and vector stores)

All devices communicate over a private LAN, with Kubernetes handling service-level networking between pods and nodes, while the switch handles physical routing between machines.

## Kubernetes Network Layer

Inside the cluster, K3s manages pod-to-pod communication using a lightweight CNI. Services are exposed internally through ClusterIP and externally via controlled ingress rules. This allows:

- Internal service discovery between microservices
- Isolated namespaces for different workloads
- Controlled exposure of applications like Gitea, dashboards, and APIs

Worker nodes (Raspberry Pis) handle distributed workloads, while the control plane manages scheduling and cluster state.

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

## GPU Compute Node (External to Cluster)

The RTX 3090 machine runs separately from the Kubernetes cluster but is still part of the same network. It hosts Docker containers for AI workloads, model inference, and experimentation. In future iterations, this node may be integrated into the cluster as a GPU-enabled worker.

Communication between the cluster and this node happens over internal APIs and service endpoints.

::CtaContactWork
---
buttonText: "Let's Talk About Your Network Design"
supportingCopy: "Planning the network topology for your own cluster and rack? Let's talk through routing and segmentation."
destinationUrl: "/hire-me"
---
::

## Conclusion

This network topology is designed to scale from a simple homelab into a production-like distributed system. By combining a Kubernetes-based Raspberry Pi cluster, a dedicated GPU compute machine, and a tightly integrated CI/CD pipeline using Gitea, the system functions as a unified development and deployment environment.

As the infrastructure evolves, the next steps include deeper network segmentation (VLANs), improved observability, and potential integration of the GPU node into the Kubernetes scheduling system for hybrid workloads.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Pi Cluster Blueprint"
  supportingCopy: "Get the Raspberry Pi AI Cluster Blueprint — hardware list, network diagram, node roles, folder structures, Kubernetes manifests, and a troubleshooting checklist ($19)."
  destinationUrl: "/products/raspberry-pi-ai-cluster-blueprint"
  price: "$19"
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

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*