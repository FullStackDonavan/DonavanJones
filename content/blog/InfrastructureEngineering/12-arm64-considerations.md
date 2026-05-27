---
title: "ARM64 Considerations"
description: "Considerations for running infrastructure on ARM64 hardware."
date: 2026-05-26
tags:
  - infrastructure
  - arm64
  - hardware
draft: true
slug: arm64-considerations
author: Donavan Jones
---

# ARM64 Considerations

As I continue building out my homelab rack and Kubernetes infrastructure, ARM64 hardware has become a major part of my workflow. From Raspberry Pi nodes running K3s to lightweight backend services and CI/CD workloads, ARM64 offers a balance of low power consumption, affordability, and scalability that makes it attractive for self-hosted infrastructure. Running ARM64 in a mixed environment alongside x86 systems and GPU machines also introduces important considerations around compatibility, performance, container images, and deployment strategy.

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

In my rack setup, I separate lightweight infrastructure services onto ARM64 nodes while heavier AI models and GPU workloads remain on dedicated x86 hardware with NVIDIA GPUs. This keeps the cluster efficient while still allowing high-performance workloads where needed.

## Power Efficiency

One of ARM64’s biggest advantages is power consumption.

Benefits include:
- Lower electricity costs
- Less heat generation
- Smaller cooling requirements
- Quiet operation
- Easier scaling at home

This becomes especially valuable when running multiple nodes 24/7 in a homelab or rack environment. A cluster of Raspberry Pis or ARM mini PCs can provide enough compute for development, automation, and infrastructure services without dramatically increasing power usage.

## Kubernetes Considerations

Running K3s or Kubernetes on ARM64 generally works well, but there are a few important things to plan for:

### Multi-Architecture Images

Use multi-arch images whenever possible. Tools like Docker Buildx make this easier.

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t myapp:latest .
```

### Node Scheduling

You may want to separate workloads between ARM64 and x86 nodes using:
- Node selectors
- Taints and tolerations
- Affinity rules

This is especially useful in hybrid clusters where ARM nodes handle infrastructure while GPU systems handle AI or compute-heavy services.

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

However, large models still benefit heavily from dedicated GPUs. In my setup, ARM64 nodes support the surrounding infrastructure while AI containers and models run separately on more powerful hardware.

## Conclusion

ARM64 has become an important part of modern self-hosted infrastructure because it enables efficient, scalable, and affordable deployments without requiring enterprise hardware. Whether running K3s clusters, CI/CD pipelines, APIs, or lightweight backend services, ARM64 hardware can handle far more than many people expect. In hybrid environments like my rack setup, combining ARM64 nodes for infrastructure workloads with dedicated x86 GPU systems for AI and heavy compute creates a flexible architecture that balances performance, cost, and power efficiency. As software support continues improving across the ecosystem, ARM64 will likely become even more common in homelabs, edge computing, and production-ready infrastructure.