---
title: "Network Topology"
description: "Network topology design for my homelab and Kubernetes cluster."
date: 2026-05-26
tags:
  - infrastructure
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

## GPU Compute Node (External to Cluster)

The RTX 3090 machine runs separately from the Kubernetes cluster but is still part of the same network. It hosts Docker containers for AI workloads, model inference, and experimentation. In future iterations, this node may be integrated into the cluster as a GPU-enabled worker.

Communication between the cluster and this node happens over internal APIs and service endpoints.

## Conclusion

This network topology is designed to scale from a simple homelab into a production-like distributed system. By combining a Kubernetes-based Raspberry Pi cluster, a dedicated GPU compute machine, and a tightly integrated CI/CD pipeline using Gitea, the system functions as a unified development and deployment environment.

As the infrastructure evolves, the next steps include deeper network segmentation (VLANs), improved observability, and potential integration of the GPU node into the Kubernetes scheduling system for hybrid workloads.