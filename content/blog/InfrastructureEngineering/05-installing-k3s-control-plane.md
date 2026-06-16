---
title: "Installing K3s Control Plane"
description: "Step-by-step guide to installing the K3s control plane on a Raspberry Pi, including kubeconfig setup and validating the cluster is healthy."
date: 2025-09-30
lastUpdated: "2026-06-09"
category: "infrastructure-engineering"
tags:
  - k3s
  - kubernetes
draft: false
slug: installing-k3s-control-plane
author: Donavan Jones
---

# Installing K3s Control Plane

## Introduction

A small Kubernetes cluster is a strong fit for a homelab, especially when it is built from low-power hardware like Raspberry Pis in a rack. K3s keeps the control plane lightweight while still giving you the core Kubernetes features needed to manage workloads, services, secrets, storage, and deployments. In this guide, we will set up the K3s control plane in a way that is practical for a home rack environment, with an eye toward stability, simplicity, and easy expansion later.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

## Prerequisites

Before you begin, make sure you have:

* A Raspberry Pi cluster ready to use in your rack
* A fresh Raspberry Pi OS or other Linux installation on the control plane node
* Static or reserved IP addressing for the node
* `sudo` access on the machine
* Network access between all nodes in the cluster

## Install K3s on the First Control Plane Node

On the first server node, install K3s with the built-in install script:

```bash
curl -sfL https://get.k3s.io | sh -
```

After the installation finishes, verify that the service is running:

```bash
sudo systemctl status k3s
```

Check that the node joined successfully:

```bash
sudo kubectl get nodes
```

If you prefer using `kubectl` without typing `sudo` every time, copy the kubeconfig into your home directory and update the permissions:

```bash
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $(id -u):$(id -g) ~/.kube/config
```

Then test access again:

```bash
kubectl get nodes
```

## Verify the Cluster

Once the control plane is installed, check the cluster components and make sure the node is ready:

```bash
kubectl get pods -A
kubectl get nodes -o wide
```

You should see the control plane node listed and the system pods moving into a ready state.

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

## Optional: Add More Nodes Later

If your rack grows and you want to add more Pi nodes, you can join them to the cluster as agents or additional servers. K3s makes it straightforward to expand without the overhead of a full upstream Kubernetes installation. That is one of the reasons it works so well in a homelab where simplicity matters.

::CtaContactWork
---
buttonText: "Let's Talk About Your Control Plane"
supportingCopy: "Setting up a K3s control plane for your own cluster? Let's talk through the architecture."
destinationUrl: "/hire-me"
---
::

## Conclusion

K3s is one of the easiest ways to get a reliable Kubernetes control plane running on a Raspberry Pi cluster. For a rack-based homelab, it gives you a good balance of lightweight performance and real Kubernetes functionality, which makes it a solid foundation for apps, databases, CI/CD, and other services. With the control plane in place, you can move on to deploying workloads, setting up storage, and building out the rest of your home infrastructure.

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
  buttonText: "Read: Joining Worker Nodes"
  supportingCopy: "Continue with \"Joining Worker Nodes\" to expand the control plane into a full multi-node cluster."
  destinationUrl: "/blog/infrastructureengineering/06-joining-worker-nodes"
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
  - label: "K3s — Wikipedia"
    url: "https://en.wikipedia.org/wiki/K3s"
    type: "wikipedia"
    description: "According to this overview, K3s is a lightweight, certified Kubernetes distribution — the software installed on the Raspberry Pi control plane node described in this article."
  - label: "Kubernetes — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes"
    type: "wikipedia"
    description: "Overview of Kubernetes and its control plane components — understanding the upstream project helps clarify why K3s bundles etcd, the API server, and the scheduler into a single binary."
  - label: "Systemd — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Systemd"
    type: "wikipedia"
    description: "According to this overview, systemd is the init system that manages Linux services — K3s registers as a systemd service so the control plane starts automatically on boot and restarts on failure."
  - label: "Container Orchestration — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes#Architecture"
    type: "wikipedia"
    description: "Overview of container orchestration architecture — the scheduling, health-checking, and API-serving roles handled by the control plane node that this article installs."
---
::

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*
