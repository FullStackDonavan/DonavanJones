---
title: "Installing K3s Control Plane"
description: "Guide to installing the K3s control plane on a Raspberry Pi cluster."
date: 2025-09-30
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

## Optional: Add More Nodes Later

If your rack grows and you want to add more Pi nodes, you can join them to the cluster as agents or additional servers. K3s makes it straightforward to expand without the overhead of a full upstream Kubernetes installation. That is one of the reasons it works so well in a homelab where simplicity matters.

## Conclusion

K3s is one of the easiest ways to get a reliable Kubernetes control plane running on a Raspberry Pi cluster. For a rack-based homelab, it gives you a good balance of lightweight performance and real Kubernetes functionality, which makes it a solid foundation for apps, databases, CI/CD, and other services. With the control plane in place, you can move on to deploying workloads, setting up storage, and building out the rest of your home infrastructure.
