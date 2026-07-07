---
title: "Jetson Orin Tutorials"
description: "A practical, step-by-step reference for getting a Jetson Orin board from bare metal to a working cluster node running local inference."
date: 2026-04-01
lastUpdated: "2026-06-09"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - jetson-orin
draft: true
slug: jetson-orin-tutorials
author: Donavan Jones
---

# Jetson Orin Tutorials

This is the reference walkthrough I wish existed when I set up the first Jetson Orin Nano Super board — the concrete steps from unboxing to a working, cluster-joined inference node, without assuming prior embedded-Linux experience.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI homelab deep-dive in this series."
destinationUrl: "/categories/ai-homelab-engineering"
---
::

## Step 1: Flash JetPack

NVIDIA's JetPack SDK bundles the Linux kernel, CUDA, cuDNN, and TensorRT in one flashable image. Use the SDK Manager tool from a host PC to flash the board over USB:

```bash
# On the host PC, after installing NVIDIA SDK Manager:
# Connect the Jetson in recovery mode (hold the recovery button while powering on)
sdkmanager --cli install --logintype devzone \
  --product JETSON_ORIN_NANO --target-os Linux --version <jetpack-version>
```

## Step 2: Initial Setup

On first boot, run the standard Ubuntu setup, then confirm CUDA is actually available before doing anything else:

```bash
nvidia-smi  # or, on Jetson specifically:
sudo tegrastats
```

`tegrastats` is the Jetson-specific equivalent of `nvidia-smi` — it reports GPU utilization, memory, and thermal data in the format Jetson boards actually expose, and confirming this works before installing anything else avoids a lot of confusing downstream debugging.

## Step 3: Install Ollama with GPU Support

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama run hermes3:8b  # confirm GPU offload with `tegrastats` running in another terminal
```

Watch `tegrastats` output while a model generates — GPU utilization should visibly climb. If it stays flat, the model fell back to CPU inference, almost always because of a JetPack/CUDA version mismatch with the installed inference runtime.

## Step 4: Join the k3s Cluster

```bash
curl -sfL https://get.k3s.io | K3S_URL=https://<control-plane-ip>:6443 \
  K3S_TOKEN=<node-token> sh -
```

Confirm the node registered and can be scheduled to:

```bash
kubectl get nodes -o wide
kubectl label node <jetson-node-name> gpu-tier=jetson
```

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how Jetson nodes fit into the full AI homelab architecture."
destinationUrl: "/systems/ai-homelab"
---
::

## Common Setup Mistakes

**Wrong JetPack/CUDA version for the inference runtime** — the single most common cause of silent CPU fallback. Check the runtime's documented compatible CUDA version before flashing, not after.

**Insufficient cooling for sustained load** — Jetson boards throttle under sustained inference without adequate airflow; a passive heatsink that's fine for light workloads isn't enough for a board running continuously as a cluster node.

**Forgetting swap configuration** — Jetson boards have limited RAM relative to a desktop, and larger models can hit out-of-memory errors during load without swap configured as a buffer, even when VRAM itself would technically be sufficient.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Raspberry Pi AI Cluster Blueprint"
  supportingCopy: "Get the full step-by-step build guide with exact hardware and configs ($39)."
  destinationUrl: "/products/raspberry-pi-ai-cluster-blueprint"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Local AI Security"
  supportingCopy: "Securing the cluster once every node is up and running."
  destinationUrl: "/blog/ai-homelab-engineering/local-ai-security-keeping-data-private"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get new homelab breakdowns delivered before they're public."
  ---
  :::
::

## Further Reading

::AuthoritativeLinks
---
title: "Authoritative Sources"
links:
  - label: "NVIDIA JetPack SDK — Official Documentation"
    url: "https://developer.nvidia.com/embedded/jetpack"
    type: "external"
    description: "Official documentation for flashing and configuring Jetson boards."
  - label: "NVIDIA SDK Manager — Official Documentation"
    url: "https://docs.nvidia.com/sdk-manager/"
    type: "external"
    description: "The host-side flashing tool used to install JetPack onto a Jetson board."
---
::

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
