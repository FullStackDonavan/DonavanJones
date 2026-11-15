---
title: "ARM64 Considerations"
description: "Key considerations for running Kubernetes and production workloads on ARM64 hardware — image compatibility, build pipelines, and performance tradeoffs."
date: 2025-10-24
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - arm64
  - hardware
draft: false
cluster: "infrastructure-engineering"
slug: arm64-considerations
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/12-arm64-considerations.jpg
---

# ARM64 Considerations

Running Kubernetes on ARM64 works well as long as every image you deploy is built for `linux/arm64`, you schedule heavy work onto nodes that can handle it, and you use SSDs or NVMe instead of SD cards for anything stateful. Image compatibility is where most of the friction is. Every node in my seven-node K3s cluster is ARM64, including the three Jetson Orin GPU workers, so I build everything with `docker buildx --platform linux/arm64`.

As I continue building out my homelab rack and Kubernetes infrastructure, ARM64 hardware has become a major part of my workflow. From Raspberry Pi nodes running K3s to lightweight backend services and CI/CD workloads, ARM64 offers a balance of low power consumption, affordability, and scalability that makes it attractive for self-hosted infrastructure. Running ARM64 in a mixed environment alongside x86 systems and GPU machines also introduces important considerations around compatibility, performance, container images, and deployment strategy.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For how every node and service fits together, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

What to consider when running infrastructure on ARM64 hardware.

## Compatibility

One of the first things to verify is whether your software stack supports ARM64. Many modern tools and containers now publish multi-architecture images, but some projects still target x86_64 first. Before deploying workloads to ARM nodes, check:

- Docker image availability
- Native package support
- Kubernetes compatibility
- Third-party binaries
- Database and AI tooling support

If an image does not support ARM64, you may need to:
- Build the container manually
- Use emulation with QEMU
- Replace the software entirely

## Performance Expectations

ARM64 systems can be extremely efficient, but they behave differently than traditional server hardware.

Good workloads for ARM64:
- APIs
- Web services
- Reverse proxies
- CI/CD runners
- Redis
- Lightweight databases
- Monitoring stacks
- Edge workloads

Less ideal workloads:
- Heavy AI inference
- Large-scale vector processing
- GPU-intensive tasks
- Video transcoding

That list is about CPU-only boards like the Raspberry Pi. ARM64 with a GPU is a different story: my three Jetson Orin Nano Super boards are ARM64 too, and they run CUDA inference inside the cluster. One of them keeps llama3.2:3b loaded permanently and generates about 20.8 tokens per second. In my rack, lightweight infrastructure services go on the Pis, small-model inference, speech, and image generation go on the Jetsons, and only the largest models run on the one x86 machine, an RTX 3090 workstation outside the cluster.

## Power Efficiency

One of ARM64’s biggest advantages is power consumption.

Benefits include:
- Lower electricity costs
- Less heat generation
- Smaller cooling requirements
- Quiet operation
- Easier scaling at home

This becomes especially valuable when running multiple nodes 24/7 in a homelab or rack environment. A cluster of Raspberry Pis or ARM mini PCs can provide enough compute for development, automation, and infrastructure services without dramatically increasing power usage.

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

## Kubernetes Considerations

Running K3s or Kubernetes on ARM64 generally works well, but there are a few important things to plan for:

### Multi-Architecture Images

Use multi-arch images whenever possible. Tools like Docker Buildx make this easier.

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t myapp:latest .
```

Since my cluster is ARM64-only, I build just `--platform linux/arm64`, export the image, and import it on each node with `k3s ctr images import`, using `imagePullPolicy: Never` so pods use the local copy. The full flow is in [deploying an app on the rack](/blog/infrastructureengineering/45-deploying-an-app-on-the-rack).

### Node Scheduling

You may want to separate workloads between ARM64 and x86 nodes using:
- Node selectors
- Taints and tolerations
- Affinity rules

This is especially useful in hybrid clusters where ARM nodes handle infrastructure while GPU systems handle AI or compute-heavy services. In my cluster every node is ARM64, so I separate by role instead of architecture: Pi workers versus Jetson GPU workers (see [control plane taints](/blog/infrastructureengineering/16-control-plane-taints) for the scheduling side).

### Storage

Some storage solutions behave differently on ARM devices, especially when using SD cards. For production-like reliability:
- Prefer SSDs over SD cards
- Use powered USB hubs if needed
- Monitor disk health regularly

## Development Workflow

ARM64 changes the development workflow slightly:
- Local builds may differ from production builds
- Some dependencies compile differently
- CI pipelines should test multiple architectures

This is one reason I like using self-hosted CI runners in my cluster. It allows me to test ARM64 workloads directly on the target architecture instead of relying entirely on emulation.

## AI and ARM64

ARM64 is improving rapidly for AI-related workloads, especially with:
- Edge inference
- Lightweight local models
- Retrieval systems
- Automation agents

However, large models still benefit heavily from dedicated GPUs with more memory. In my setup, the Pis support the surrounding infrastructure, the Jetsons handle models small enough for 8 GB of unified memory (about one 4–5 GB model per board), and bigger models like Ornith-1.0-35B run on the RTX 3090. Memory is the real limit on the Jetsons. The CUDA allocator can't reclaim page cache, so a model can OOM even when `free -h` shows memory available. I cover that in my [Jetson Orin tutorials](/blog/ai-homelab-engineering/12-jetson-orin-tutorials).

::CtaContactWork
---
buttonText: "Let's Talk About Your ARM64 Workloads"
supportingCopy: "Deciding what to run on ARM64 vs. dedicated GPU hardware? Let's talk through the architecture."
destinationUrl: "/hire-me"
---
::

## Conclusion

ARM64 has become an important part of modern self-hosted infrastructure because it enables efficient, scalable, and affordable deployments without requiring enterprise hardware. Whether running K3s clusters, CI/CD pipelines, APIs, or lightweight backend services, ARM64 hardware can handle far more than many people expect. In hybrid environments like my rack setup, combining ARM64 Pi nodes for infrastructure, ARM64 Jetson boards for edge inference, and a single x86 GPU workstation for the heaviest compute creates a flexible architecture that balances performance, cost, and power efficiency. As software support continues improving across the ecosystem, ARM64 will likely become even more common in homelabs, edge computing, and production-ready infrastructure.

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
  buttonText: "Read: Cluster Architecture (Homelab)"
  supportingCopy: "Continue with \"Cluster Architecture (Homelab)\" to see how these ARM64 nodes fit into the broader rack design."
  destinationUrl: "/blog/infrastructureengineering/13-cluster-architecture-homelab"
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
  - label: "ARM Architecture Family — Wikipedia"
    url: "https://en.wikipedia.org/wiki/ARM_architecture_family"
    type: "wikipedia"
    description: "According to this overview, ARM is a RISC instruction set architecture — the CPU design used by Raspberry Pi hardware that determines compatibility, image requirements, and performance characteristics for K3s workloads."
  - label: "Cross Compilation — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Cross_compiler"
    type: "wikipedia"
    description: "Overview of cross-compilation — the process of building software on one architecture (x86) for execution on another (ARM64), relevant when developing on a desktop machine and deploying to Raspberry Pi nodes."
  - label: "Multi-Architecture Container Images — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Docker_(software)"
    type: "wikipedia"
    description: "According to this overview, Docker Buildx enables multi-architecture image builds — the tool used to produce containers that run identically on both ARM64 cluster nodes and x86 development machines."
  - label: "Edge Computing — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Edge_computing"
    type: "wikipedia"
    description: "Overview of edge computing — the deployment context in which ARM64 advantages (low power, small form factor, affordable scaling) are most compelling for always-on homelab infrastructure."
---
::

---

## Related reading

- [Architecture Diagrams](/blog/infrastructureengineering/11-architecture-diagrams) — previous in the series
- [Cluster Architecture (Homelab)](/blog/infrastructureengineering/13-cluster-architecture-homelab) — next in the series
- [Infrastructure systems overview](/systems/infrastructure) — the hub page for the whole rack: nodes, services, and how they connect
- [Using Three Jetson Orin Nano Supers as an AI Cluster](/blog/ai-homelab-engineering/02-three-jetson-orin-nano-supers-as-ai-cluster) — what the ARM64 GPU workers actually run
- [Model Loading Strategies](/blog/backendengineering/16-model-loading-strategies) — how models get loaded on memory-constrained nodes

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*