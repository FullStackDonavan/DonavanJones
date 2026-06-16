---
title: "Networking (Skill)"
description: "Networking skills I built through running a homelab — subnetting, DNS, VLANs, ingress routing, and diagnosing production cluster network issues."
date: 2025-11-30
lastUpdated: "2026-06-09"
category: "infrastructure-engineering"
tags:
  - networking
  - skills
draft: false
slug: networking-skill
author: Donavan Jones
---

# Networking (Skill)

## Introduction

Networking is one of the most important foundational skills in modern infrastructure and systems engineering. In my case, it wasn’t learned in isolation or just from theory—it was developed through building and maintaining a real homelab environment. Working with a Raspberry Pi-based K3s cluster, a custom rack setup, and multiple self-hosted services forced me to understand how data actually moves between systems, how services discover each other, and how failures propagate when networking is misconfigured.

Instead of simply studying concepts like DNS, subnets, routing, or NAT, I learned them through real-world debugging: pods not communicating across nodes, services failing due to incorrect cluster networking, and SSH access issues across machines in my rack. This hands-on environment made networking feel less like an abstract subject and more like the backbone of everything I build.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

---

## Core Networking Foundations

Through my homelab work, I developed practical understanding in several key areas:

- **IP Addressing & Subnetting**  
  Managing static and dynamic IP assignments across Raspberry Pi nodes and ensuring consistent addressing within my cluster network.

- **DNS & Service Discovery**  
  Understanding how services resolve each other inside Kubernetes and within local network environments.

- **Routing & NAT**  
  Configuring traffic flow between internal services and external access points, especially when exposing applications from my rack to external clients.

- **SSH & Secure Remote Access**  
  Using SSH keys and hardened access patterns to manage nodes in my rack without exposing unnecessary attack surfaces.

---

## Applied Learning in My Homelab Rack

A major part of my learning came from building and iterating on my physical rack setup, which runs a Raspberry Pi-based K3s cluster alongside other services and development tools.

Within this environment, networking became practical and unavoidable:

- Nodes in the K3s cluster must communicate reliably over the local network.
- Services deployed via CI/CD pipelines in Gitea depend on correct internal routing.
- Containers running AI workloads on my development machine need to interact with cluster services seamlessly.
- Misconfigured networking often results in real downtime, forcing me to debug issues at the packet and service level.

This setup effectively became a living lab where I could test infrastructure ideas in real time.

---

## Troubleshooting & Problem Solving

One of the most valuable parts of learning networking has been debugging.

Some common issues I’ve worked through include:

- Pods unable to reach each other due to misconfigured cluster networking
- DNS resolution failures inside Kubernetes services
- Port conflicts between local services running on the rack
- Latency and routing issues between nodes
- Authentication failures due to incorrect SSH or firewall rules

Each issue required breaking the system down layer by layer—starting from the application, down through containers, services, network interfaces, and finally physical connectivity.

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

## Integration with CI/CD and Infrastructure

Networking is also tightly connected to my CI/CD workflows.

Using Gitea and self-hosted runners in my cluster, I’ve built pipelines that:

- Deploy applications directly into the K3s environment
- Trigger container builds and updates across nodes
- Manage secrets and environment variables securely across services

This requires a stable and predictable network layer. Without proper networking, deployment pipelines break, services become unreachable, and automation fails.

::CtaContactWork
---
buttonText: "Let's Talk About Your Networking Skills Gap"
supportingCopy: "Building hands-on networking skills through your own homelab or cluster? Let's talk through what to tackle next."
destinationUrl: "/hire-me"
---
::

---

## Conclusion

Networking has become one of the most critical skills in my infrastructure journey. What started as simple curiosity has turned into a core competency shaped by real-world systems I actively maintain and depend on.

My homelab rack—built around a Raspberry Pi K3s cluster and connected services—continues to serve as a hands-on environment where I refine these skills daily. Every misconfiguration, outage, or deployment issue reinforces a deeper understanding of how modern distributed systems communicate.

Rather than treating networking as a theoretical subject, I now see it as the invisible structure holding every system together. It is the layer that makes everything else—from CI/CD pipelines to AI services—actually work.

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
  buttonText: "Read: Node Roles"
  supportingCopy: "Continue with \"Node Roles\" to see how these networking fundamentals map onto specific roles across the cluster."
  destinationUrl: "/blog/infrastructureengineering/27-node-roles"
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
  - label: "OSI Model — Wikipedia"
    url: "https://en.wikipedia.org/wiki/OSI_model"
    type: "wikipedia"
    description: "According to this overview, the OSI model provides a layered framework for understanding network communication — the mental model used to systematically debug issues across physical, IP, transport, and application layers."
  - label: "Computer Network — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Computer_network"
    type: "wikipedia"
    description: "Overview of computer networking — the foundational discipline whose practical mastery is the subject of this article, developed through hands-on management of the homelab rack's physical and virtual networking."
  - label: "Distributed Systems — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Distributed_computing"
    type: "wikipedia"
    description: "According to this overview, distributed systems communicate over networks with no shared memory — the context in which networking skill matters most, since every inter-service call depends on the network being correct and predictable."
  - label: "Kubernetes Networking — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Kubernetes#Networking"
    type: "wikipedia"
    description: "Overview of Kubernetes networking — the virtual network layer that application networking skill must understand to configure services, ingress, and CNI correctly across a multi-node cluster."
---
::

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*