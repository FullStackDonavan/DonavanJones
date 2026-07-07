---
title: "Networking for AI Clusters"
description: "Networking design for a multi-node home AI cluster — static IPs, service discovery, and keeping inference traffic off the same segment as everything else."
date: 2026-02-18
lastUpdated: "2026-06-09"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - networking
draft: true
slug: networking-for-ai-clusters
author: Donavan Jones
---

# Networking for AI Clusters

Networking is the layer of a homelab cluster that's easy to get away with ignoring at first and expensive to retrofit later. Static addressing, sane service discovery, and segmentation decisions made early save real pain once the cluster has more than two or three nodes talking to each other constantly.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI homelab deep-dive in this series."
destinationUrl: "/categories/ai-homelab-engineering"
---
::

## Static IPs, Not DHCP Leases

Every cluster node gets a static IP reservation at the router level, keyed to its MAC address. A cluster where node IPs can silently change on DHCP lease renewal is a cluster where the k3s control plane's node registry, service configs, and any hardcoded references break unpredictably — and debugging "why did the cluster fall over overnight" is much worse than the ten minutes it takes to set static reservations up front.

## Internal Service Discovery

Within the cluster, Kubernetes' built-in DNS (CoreDNS) handles service-to-service discovery — a model-serving pod is reachable at `ollama-server.default.svc.cluster.local` regardless of which physical node it's scheduled on, which matters specifically because workloads move between nodes on restart or rescheduling and shouldn't depend on a fixed IP.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: ollama-server
spec:
  selector: {app: ollama}
  ports:
    - port: 11434
```

## Segmenting Cluster Traffic

The cluster's internal traffic — model inference requests, storage replication between MinIO nodes, agent-to-agent communication — sits on its own VLAN, separate from general home network traffic. This isn't primarily a security measure (though it helps); it's about not having a video call or a large file transfer on the general network segment introduce latency jitter into inference requests that are sensitive to it.

## Exposing Services Externally (Carefully)

Nothing in this cluster is directly exposed to the public internet. Access from outside the home network goes through a VPN (WireGuard) back into the home network first — inference endpoints are never bound to a public-facing interface, which closes off an entire category of exposure that "just open a port" setups create.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how networking fits into the full AI homelab architecture."
destinationUrl: "/systems/ai-homelab"
---
::

## Bandwidth Between Nodes

For the Jetson tier specifically, gigabit Ethernet (not wifi) between nodes matters more than it seems for anything involving distributed storage — MinIO's erasure coding replicates data across nodes, and a slow or unreliable link between them shows up as degraded read/write performance across the whole storage layer, not just on the affected node.

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Raspberry Pi AI Cluster Blueprint"
  supportingCopy: "Get the full networking topology and VLAN configuration ($39)."
  destinationUrl: "/products/raspberry-pi-ai-cluster-blueprint"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: MinIO and Distributed AI Storage"
  supportingCopy: "The storage layer that depends on this networking design."
  destinationUrl: "/blog/ai-homelab-engineering/minio-and-distributed-ai-storage"
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
  - label: "CoreDNS — Official Documentation"
    url: "https://coredns.io/manual/toc/"
    type: "external"
    description: "The DNS server providing internal service discovery for Kubernetes clusters, including k3s by default."
  - label: "WireGuard — Official Site"
    url: "https://www.wireguard.com/"
    type: "external"
    description: "The VPN protocol used for secure external access into the home network without exposing services directly."
---
::

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
