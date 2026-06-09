---
title: "Real Deployed Workloads"
description: "Real workloads I run in my homelab Kubernetes cluster — Gitea, Weaviate, BullMQ workers, MinIO, and AI inference nodes running in production."
date: 2026-01-02
category: "infrastructure-engineering"
tags:
  - workloads
  - homelab
draft: false
slug: real-deployed-workloads
author: Donavan Jones
---

# Real Deployed Workloads

## Introduction

This article documents real workloads currently running in my homelab environment. My setup is built around a Raspberry Pi-based K3s Kubernetes cluster integrated with a separate development machine running an RTX 3090 GPU inside Docker containers for AI workloads. Together, they form a hybrid system where lightweight services run on the cluster while compute-heavy AI tasks are offloaded to the GPU machine.

The goal of this environment is to simulate production-grade infrastructure at home—covering CI/CD pipelines, distributed services, AI inference workloads, and persistent storage systems. This setup also integrates Gitea for source control and self-hosted automation pipelines using Kubernetes runners.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

---

# Cluster Overview

My homelab rack is composed of:

- A Raspberry Pi K3s cluster (control plane + worker nodes)
- A dedicated development machine with RTX 3090 GPU (AI + model inference)
- Docker-based service isolation for AI workloads
- Gitea self-hosted Git platform
- CI/CD runners deployed inside Kubernetes
- External storage for persistent workloads and backups

This architecture allows me to separate concerns:
- Kubernetes handles orchestration and service reliability
- The GPU machine handles compute-heavy AI inference
- CI/CD pipelines automate deployment from code push to cluster

---

# Real Deployed Workloads

## 1. Gitea Self-Hosted Git Platform

I run a fully self-hosted Git service using Gitea inside my Kubernetes cluster.

**Purpose:**
- Source control for all projects
- Hosting private repositories for infrastructure, AI pipelines, and app development
- Integration point for CI/CD workflows

**Why it matters:**
This replaces GitHub for internal workflows and allows full control over deployment automation.

---

## 2. CI/CD Automation System (Gitea Runners)

I use Kubernetes-based runners connected to Gitea to automate deployments.

**Flow:**
1. Push code to repository
2. Trigger CI pipeline
3. Build Docker images
4. Deploy updated workloads to K3s cluster

**Use cases:**
- FastAPI backend deployments
- AI service updates
- Infrastructure changes (Helm / YAML manifests)

This is essentially the glue between development and production inside my homelab.

---

## 3. FastAPI Microservices Layer

Several backend services run as containerized FastAPI applications.

**Examples:**
- Authentication service
- Bible app APIs (core logic layer)
- AI routing service (decides when to call local GPU models vs API models)

**Why FastAPI:**
- Lightweight and fast
- Easy integration with Kubernetes
- Works well with async workloads

---

## 4. AI Inference Layer (RTX 3090 Docker Node)

My GPU machine runs AI models in isolated Docker containers.

**Capabilities:**
- Local LLM inference
- Embedding generation for semantic search
- Image generation pipelines (DALL·E-style or diffusion models)
- Experimental LoRA fine-tuning workflows

**Integration:**
Kubernetes services route requests to this machine when GPU compute is required.

This effectively turns the homelab into a small distributed AI system.

---

*Explore more articles in the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

---

## 5. Vector Search + Retrieval Systems

I run retrieval systems for semantic search across theological and study content.

**Stack includes:**
- Vector database (for embeddings)
- Ingestion pipelines for Bible/Quran/text datasets
- API layer for query retrieval

**Use case:**
Powering AI-assisted Bible study features inside my application ecosystem.

---

## 6. Database Layer (PostgreSQL + Supporting Services)

A centralized database layer supports most applications.

**Responsibilities:**
- User accounts and authentication data
- Posts, debates, and community content
- AI metadata and logs

This is deployed in a persistent Kubernetes volume setup with backup strategies tied to CI/CD workflows.

---

## 7. Media and Content Services

I also run supporting services for user-generated content:

- Image uploads (stored on S3-compatible storage)
- Video handling for livestream and recorded content
- Ad creative storage system for in-app monetization

These services support the social and media features of the Bible app ecosystem.

---

## 8. Experimental Services

This is where I test new systems before production deployment:

- WebRTC peer-to-peer debate system
- Livestream routing through AWS IVS
- Game marketplace backend logic
- AI narration pipelines using ElevenLabs-style voice generation

These workloads often move into production once stabilized.

---

# System Design Philosophy

This entire infrastructure is designed around three principles:

**1. Separation of compute**
- Kubernetes = orchestration + lightweight services
- GPU machine = AI inference + heavy compute

**2. Self-host everything possible**
- Git (Gitea)
- CI/CD runners
- APIs and backend services
- Data pipelines

**3. Production simulation at home**
The system mirrors real-world cloud architecture:
- microservices
- container orchestration
- CI/CD automation
- distributed compute routing

---

## Conclusion

This homelab is not just a collection of services—it’s a full production-style infrastructure environment running locally. The combination of a Raspberry Pi K3s cluster, a GPU-powered AI node, and self-hosted CI/CD pipelines creates a system capable of supporting real applications at scale.

As the system evolves, the focus is shifting toward tighter AI integration, improved workload routing, and more autonomous deployment pipelines. The end goal is a fully self-sustaining infrastructure where development, deployment, and AI inference all operate seamlessly across the cluster and GPU nodes.

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*