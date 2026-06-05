---
title: "Rack Overview"
description: "Overview of my homelab rack and its components."
date: 2025-12-22
category: "infrastructure-engineering"
tags:
  - homelab
  - rack
  - kubernetes
  - gitea
  - ci-cd
  - ai
draft: false
slug: rack-overview
author: Donavan Jones
---

# Rack Overview

## Introduction

My homelab rack is the foundation of my entire infrastructure ecosystem. It is designed not just for experimentation, but as a production-grade learning environment where I build, deploy, and test real systems. The goal is to combine Kubernetes orchestration, CI/CD automation, and AI workloads into a unified environment that mirrors real-world engineering stacks at scale.

At the core of this setup is a Raspberry Pi-based K3s Kubernetes cluster, which handles container orchestration and service deployment. Supporting this is a dedicated development machine equipped with an RTX 3090 GPU running AI models in Docker containers. Together, these systems form a hybrid edge-and-local compute architecture that allows me to develop, test, and deploy seamlessly across environments.

---

## Rack Architecture Overview

The rack is organized into three main layers:

- **Compute Layer (Kubernetes Cluster)**
- **Development & AI Layer (GPU Workstation)**
- **CI/CD & Source Control Layer (Gitea + Runners)**

Each layer plays a specific role in the overall system design.

---

## Kubernetes Cluster (Raspberry Pi K3s)

The heart of the rack is a lightweight Kubernetes cluster built using K3s running on multiple Raspberry Pi nodes.

Key responsibilities:
- Running containerized applications
- Hosting microservices for my Bible app ecosystem
- Managing deployments via manifests and Helm charts
- Providing a sandbox for infrastructure testing

What makes this setup powerful is its simplicity and flexibility. K3s reduces overhead while still providing a fully functional Kubernetes experience. This allows me to simulate production deployments without requiring expensive infrastructure.

---

## CI/CD System (Gitea + Runners)

My Git and deployment pipeline is built around a self-hosted Gitea instance running inside the cluster.

Key features:
- Source control for all infrastructure and application code
- Automated CI/CD pipelines using self-hosted runners
- Deployment automation directly into the Kubernetes cluster

Workflow:
1. Push code to Gitea repository
2. CI pipeline triggers build via runner
3. Container images are built and stored
4. Deployment manifests are applied to the cluster

This setup acts as the “glue” between development and production, allowing fast iteration without losing control of deployment stability.

---

## AI Development Machine (RTX 3090 Workstation)

Outside the cluster, I maintain a dedicated development machine equipped with an RTX 3090 GPU.

This machine runs:
- Dockerized AI models
- Experimental inference pipelines
- Local testing environments for AI agents
- Model prototyping before production deployment

Rather than overloading the Kubernetes cluster with GPU workloads, I offload heavy AI computation to this system. This creates a clear separation between infrastructure services and compute-heavy ML tasks.

---

## Application Ecosystem

Built on top of this rack is a growing ecosystem of applications, including:

- Bible study and comparison tools
- Devotional and journaling systems
- Social features (posts, reactions, debates)
- Game marketplace and interactive learning tools
- Ad system with creatives and bidding mechanics
- Livestreaming infrastructure using WebRTC and AWS IVS

All of these services are designed to be modular and deployed independently through Kubernetes.

---

## Networking & Deployment Flow

The system follows a simple but powerful flow:

- Development happens locally or on the GPU machine
- Code is pushed to Gitea
- CI/CD pipelines build and test artifacts
- Kubernetes handles deployment and scaling
- Services communicate internally within the cluster network

This architecture ensures repeatability, scalability, and isolation between services.

---

## Future Expansion

Planned improvements to the rack include:

- Expanding the Kubernetes cluster with additional nodes
- Adding GPU nodes directly into the cluster
- Improving observability (Prometheus + Grafana dashboards)
- Introducing service mesh for advanced traffic control
- Expanding AI inference services into cluster-native deployments

---

## Conclusion

This homelab rack is more than just a collection of hardware—it is a full engineering platform. It combines distributed systems, CI/CD automation, and AI development into a unified environment that mirrors real-world infrastructure.

By integrating Kubernetes, Gitea, and a dedicated GPU workstation, the system allows me to move from idea to deployment quickly while still maintaining control over scalability and reliability. As it continues to evolve, the rack will serve as the backbone for increasingly complex applications, especially in AI, backend systems, and interactive platform development.