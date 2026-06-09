---
title: "Infrastructure Engineering"
slug: "infrastructure-engineering"
tagline: "Build and operate real Kubernetes infrastructure — from Raspberry Pi rack to GPU compute, fully self-hosted"
description:
  - "Infrastructure engineering at the homelab level teaches you things cloud platforms abstract away: how Kubernetes actually schedules workloads across real nodes, how storage behaves under real I/O, and what it costs to run a distributed system you fully own."
  - "This series documents 40 articles from building a real homelab rack — a Raspberry Pi K3s cluster, a dedicated RTX 3090 development machine, and a self-hosted Gitea CI/CD system running entirely inside the cluster. Every article comes from building, breaking, and iterating on infrastructure running actual workloads."
  - "Understanding what sits beneath cloud abstractions — what a pod scheduler does, what persistent volumes mean at the storage layer, what ingress controllers do to network packets — makes you a better engineer at every level of the stack."
featuredArticles:
  - path: "/blog/infrastructureengineering/01-k3s-on-raspberry-pis"
    label: "Start Here"
    reason: "The foundation of the entire homelab stack"
  - path: "/blog/infrastructureengineering/13-cluster-architecture-homelab"
    label: "Architecture Overview"
    reason: "How all the pieces fit together as a system"
  - path: "/blog/infrastructureengineering/21-gitea-runners-pipeline"
    label: "CI/CD Setup"
    reason: "Self-hosted pipelines inside the K3s cluster"
learningPath:
  - phase: "Hardware & Setup"
    description: "Physical infrastructure first — what hardware to buy, how to flash and configure Raspberry Pi nodes, and how to establish stable networking before any software is installed."
    articles:
      - "Hardware List and Costs"
      - "Flashing Raspberry Pi OS"
      - "Static IPs and Networking"
      - "Cooling and Power Setup"
      - "Physical Organization"
      - "Rack Overview"
  - phase: "Cluster Bootstrap"
    description: "Installing K3s, joining worker nodes, and establishing the core Kubernetes control plane on ARM64 hardware."
    articles:
      - "K3s on Raspberry Pis"
      - "Installing K3s Control Plane"
      - "Joining Worker Nodes"
      - "ARM64 Considerations"
      - "Node Roles"
      - "Control Plane Taints"
  - phase: "Storage & Networking"
    description: "Persistent volumes, ingress configuration, DNS, and service discovery — the infrastructure layer that connects workloads to each other and the outside world."
    articles:
      - "Storage Setup"
      - "Persistent Volumes"
      - "Ingress Setup"
      - "DNS and Service Discovery"
      - "Network Topology"
      - "Storage Strategy"
  - phase: "Observability & Operations"
    description: "Monitoring, troubleshooting, and the operational discipline required to run real workloads on homelab infrastructure."
    articles:
      - "Monitoring and Troubleshooting"
      - "Troubleshooting Skill"
      - "Networking Issues"
      - "Systems Thinking"
  - phase: "CI/CD & Workloads"
    description: "Self-hosted Git, CI/CD pipelines with Gitea runners, and the real workloads running across the cluster."
    articles:
      - "Installing Gitea in Kubernetes"
      - "Gitea Runners Pipeline"
      - "Real Deployed Workloads"
      - "Why Self-Hosted Git"
      - "Separation of Workloads"
      - "Pod Layouts"
faqs:
  - question: "What is K3s and why use it instead of full Kubernetes?"
    answer: "K3s is a lightweight Kubernetes distribution from Rancher that removes optional components and compiles to a single binary. It runs on ARM64 hardware (Raspberry Pi), uses significantly less RAM than upstream Kubernetes, starts faster, and is easier to manage on small clusters. The tradeoff is reduced extensibility and some differences in internal architecture. For homelab and edge environments, K3s is usually the right choice over full Kubernetes — it gives you all the essential Kubernetes capabilities (pods, services, ingress, persistent volumes) with a footprint that fits the hardware."
  - question: "Can I actually run Kubernetes on Raspberry Pi hardware?"
    answer: "Yes, with caveats. Raspberry Pi 4 (4GB or 8GB) and Pi 5 are capable cluster nodes for lightweight to moderate workloads. The ARM64 architecture is fully supported by K3s and most container images. The main constraints are RAM (4GB per node limits how many pods run simultaneously), SD card I/O (use SSDs for production workloads), and power delivery stability. A 4-node Pi cluster running K3s can handle CI/CD pipelines, APIs, databases, vector search services, and internal tools without issue. GPU-heavy AI workloads should run on a separate machine."
  - question: "What is a homelab and why build one as a software engineer?"
    answer: "A homelab is a personal computing environment — typically server hardware, a small rack, or repurposed machines — where you build and run real infrastructure that you fully own. For software engineers, homelab infrastructure teaches things cloud providers abstract away: how Kubernetes actually schedules workloads, what persistent volumes and ingress really do at the network level, how CI/CD pipelines connect code to deployed services, and what it costs (in time and money) to run systems at different scales. You break things without production consequences, which builds a depth of understanding that managed cloud services don't provide."
  - question: "How do I set up self-hosted CI/CD with Gitea?"
    answer: "Install Gitea inside your K3s cluster as a Kubernetes deployment with persistent storage. Then deploy Gitea Actions runners as pods that connect back to the Gitea instance. Runners execute pipeline jobs triggered by pushes and pull requests to your Gitea repos. The full loop: code push → Gitea webhook → runner picks up job → builds container → deploys to K3s cluster. Because everything runs inside the same cluster, pipeline jobs can access internal services directly without exposing them publicly, and there are no external CI minute limits."
  - question: "How should I separate AI workloads from Kubernetes services in a homelab?"
    answer: "Run GPU-intensive AI inference on a dedicated machine (not inside the K3s cluster) and expose it as a service the cluster can call. The Kubernetes cluster handles orchestration, routing, and lightweight services. The dedicated GPU machine handles model loading and inference. This separation mirrors production cloud architecture: a GPU compute pool separate from the general workload cluster. Connect them through internal DNS or a Kubernetes ExternalName service so cluster workloads can reach the GPU machine transparently."
---

Infrastructure engineering at the homelab level teaches you things cloud platforms abstract away: how Kubernetes actually schedules workloads across real nodes, how storage behaves under production-like I/O, what networking really does between physical machines, and what it costs — in hardware, power, and operational time — to run a real distributed system.

This series documents 40 articles from building and operating a real homelab rack: a Raspberry Pi-based K3s cluster as the orchestration layer, a dedicated development machine with an RTX 3090 running GPU workloads in Docker containers, and a self-hosted Gitea instance handling CI/CD pipelines entirely inside the cluster. Every article comes from building, breaking, and iterating on infrastructure that runs actual production workloads.

**Why homelab infrastructure matters for engineers who use the cloud:** AWS, GCP, and Azure hide their complexity behind managed services. When you click "create cluster" or "provision volume," an enormous amount of infrastructure scaffolding happens invisibly. Understanding what sits beneath those abstractions — what a pod scheduler actually does, what persistent volume claims mean at the storage layer, what ingress controllers do to your network packets — makes you a better engineer at every level. You make better architectural decisions, diagnose production issues faster, and understand cost drivers more clearly.

## What This Series Covers

**Hardware and Physical Setup** — Before any software runs, the hardware has to be right. These articles cover hardware selection, Raspberry Pi configuration, power and cooling, physical rack organization, and the networking setup that everything else depends on.

**Kubernetes Cluster Bootstrap** — Installing K3s on ARM64 hardware, joining worker nodes, configuring the control plane, and understanding the node roles and taints that determine workload placement. These articles take you from bare metal to a running cluster.

**Storage and Networking** — Persistent volumes, storage strategies, ingress controllers, DNS, and service discovery. These are the infrastructure primitives that connect workloads to each other and the outside world. Getting them wrong creates reliability problems that are hard to debug later.

**Operations and Observability** — Monitoring, troubleshooting methodology, and the systems thinking required to reason about distributed systems under real load. Infrastructure without observability is infrastructure you can't maintain.

**CI/CD and Deployed Workloads** — Self-hosted Gitea, pipeline runners inside Kubernetes, and the real workloads — AI services, Bible app backend, vector search — running across the cluster. This is where the infrastructure becomes a development platform, not just an experiment.
