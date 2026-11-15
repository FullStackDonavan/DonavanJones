---
title: "Jetson Orin Tutorials"
description: "Jetson Orin Nano Super tutorial: flash JetPack 6 to NVMe, set MAXN_SUPER, install Ollama with GPU offload, and join the board to a k3s cluster."
date: 2026-11-04
lastUpdated: "2026-11-14"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - jetson-orin
draft: false
slug: jetson-orin-tutorials
author: Donavan Jones
excerptImage: /img/blog/ai-homelab-engineering/12-jetson-orin-tutorials.jpg
---

# Jetson Orin Tutorials

Getting a Jetson Orin Nano Super from bare metal to a working inference node takes four steps: flash JetPack, set the power mode and confirm the GPU works, install Ollama, and join the k3s cluster. This is the walkthrough I wish existed when I set up the first of my three boards — all of them now run headless from NVMe on JetPack 6.x (L4T R36.4) — without assuming prior embedded-Linux experience.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering). For the full system map, see the [AI homelab architecture hub](/systems/ai-homelab).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI homelab deep-dive in this series."
destinationUrl: "/categories/ai-homelab-engineering"
---
::

## Step 1: Flash JetPack

NVIDIA's JetPack SDK bundles the Linux kernel, CUDA, cuDNN, and TensorRT in one flashable image. Use the SDK Manager tool from a host PC to flash the board over USB — choose the NVMe drive as the target if you have one; it's far faster and more durable than an SD card:

```bash
# On the host PC, after installing NVIDIA SDK Manager:
# Connect the Jetson in recovery mode (hold the recovery button while powering on)
sdkmanager --cli install --logintype devzone \
  --product JETSON_ORIN_NANO --target-os Linux --version <jetpack-version>
```

## Step 2: Initial Setup and Power Mode

On first boot, run the standard Ubuntu setup, then switch the board to its highest power mode — on the Orin Nano Super that's MAXN_SUPER, which is what mine run in permanently. Check the current mode and list the available ones with `nvpmodel`:

```bash
sudo nvpmodel -q          # show the current power mode
sudo nvpmodel -m <id>     # set MAXN_SUPER (id listed in /etc/nvpmodel.conf)
```

Then confirm the GPU is actually visible before doing anything else:

```bash
sudo tegrastats
```

`tegrastats` is the Jetson-specific equivalent of `nvidia-smi` — it reports GPU utilization, memory, and thermal data in the format Jetson boards actually expose, and confirming this works before installing anything else avoids a lot of confusing downstream debugging.

## Step 3: Install Ollama with GPU Support

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama run llama3.2:3b  # confirm GPU offload with `tegrastats` running in another terminal
```

Watch `tegrastats` output while a model generates — GPU utilization should visibly climb, and `ollama ps` should report the model as 100% GPU. If it stays flat, the model fell back to CPU inference, almost always because of a JetPack/CUDA version mismatch with the installed inference runtime. For reference, llama3.2:3b on my board runs at 20.8 tok/s with a 5.1 s load; the [Jetson leaderboard](/jetson-leaderboard) compares other small models.

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

**Trusting `free -h`** — Jetson boards have 8 GB of unified memory shared by CPU and GPU (about 7.4 GiB usable), so there's no separate VRAM to fall back on. Worse, the CUDA allocator can't reclaim page cache, so a model can OOM during load even when `free -h` reports memory as "available." Stop the old model and run `sync; echo 3 > /proc/sys/vm/drop_caches` before loading a new one, and plan on one ~4-5 GB model per board. I learned this the hard way — details in [running multiple local models without melting your GPU](/blog/ai-homelab-engineering/09-running-multiple-local-models-without-melting-gpu).

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
  destinationUrl: "/blog/ai-homelab-engineering/13-local-ai-security-keeping-data-private"
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

::JetsonLeaderboardCard
---
metric: all
---
::

## Related reading

- [Local Image Generation, Speech, and LLMs in One Stack](/blog/ai-homelab-engineering/11-local-image-speech-llms-one-stack) — previous in the series: what each Jetson ends up running.
- [Local AI Security: Keeping Your Code and Data Private](/blog/ai-homelab-engineering/13-local-ai-security-keeping-data-private) — next: securing the cluster once the nodes are up.
- [AI Homelab architecture hub](/systems/ai-homelab) — the interactive system diagram.
- [ARM64 Considerations](/blog/infrastructureengineering/12-arm64-considerations) — building images that actually run on Jetson and Pi nodes.

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
