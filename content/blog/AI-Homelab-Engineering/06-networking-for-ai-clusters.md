---
title: "Networking for AI Clusters"
description: "Networking for a home AI cluster: static IPs, k3s service discovery, ServiceLB pitfalls, segmentation, and keeping inference endpoints off the public internet."
date: 2026-09-13
lastUpdated: "2026-11-14"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - networking
draft: false
slug: networking-for-ai-clusters
author: Donavan Jones
excerptImage: /img/blog/ai-homelab-engineering/06-networking-for-ai-clusters.jpg
---

# Networking for AI Clusters

Networking for an AI cluster comes down to four decisions: give every node a static address, let cluster DNS handle service discovery, understand how your load balancer publishes ports, and keep inference endpoints off the public internet. It's the layer that's easy to ignore at first and expensive to retrofit — I've had to recover my k3s cluster after a control-plane IP change, so this is written from experience.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering). For the full system map, see the [AI homelab architecture hub](/systems/ai-homelab).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI homelab deep-dive in this series."
destinationUrl: "/categories/ai-homelab-engineering"
---
::

## Static IPs, Not DHCP Leases

Every cluster node gets a static IP reservation at the router level, keyed to its MAC address. A cluster where node IPs can silently change on DHCP lease renewal is a cluster where the k3s control plane's node registry, service configs, and any hardcoded references break unpredictably — and debugging "why did the cluster fall over overnight" is much worse than the ten minutes it takes to set static reservations up front. When my control plane's IP did change, recovering took real work — the steps are in [recovering a K3s cluster after a control plane IP change](/blog/infrastructureengineering/44-recovering-after-control-plane-ip-change).

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

## LoadBalancers and NodePorts in k3s

k3s ships ServiceLB (Klipper) for `LoadBalancer` services, and the node label `svccontroller.k3s.cattle.io/enablelb` decides which nodes publish those ports. Get that label wrong and services stop answering in confusing ways — it broke every LoadBalancer in my cluster once, via a port 8080 clash, which I wrote up in [how one node label broke every LoadBalancer service](/blog/infrastructureengineering/46-servicelb-node-label-broke-loadbalancers). For the admin tools I keep it simpler: Prometheus (:30909), Grafana (:30300), and Gitea (:32080) are plain NodePorts on the control plane, reachable from the LAN.

## Segmenting Cluster Traffic

A cluster's internal traffic — model inference requests, storage traffic, agent-to-agent communication — is worth putting on its own VLAN, separate from general home network traffic. This isn't primarily a security measure (though it helps); it's about not having a video call or a large file transfer on the general network segment introduce latency jitter into inference requests that are sensitive to it.

## Exposing Services Externally (Carefully)

Inference endpoints, dashboards, and admin tools should never be bound to a public-facing interface. Remote access goes through a VPN (WireGuard is the simple choice) back into the home network first, which closes off an entire category of exposure that "just open a port" setups create.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how networking fits into the full AI homelab architecture."
destinationUrl: "/systems/ai-homelab"
---
::

## Bandwidth Between Nodes

For the Jetson tier specifically, gigabit Ethernet (not wifi) between nodes matters more than it seems for anything involving distributed storage — if MinIO runs in distributed mode, erasure coding spreads data across nodes, and a slow or unreliable link between them shows up as degraded read/write performance across the whole storage layer, not just on the affected node.

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
  destinationUrl: "/blog/ai-homelab-engineering/07-minio-and-distributed-ai-storage"
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

## Related reading

- [Kubernetes for AI Workloads](/blog/ai-homelab-engineering/05-kubernetes-for-ai-workloads) — previous in the series: scheduling on top of this network.
- [MinIO and Distributed AI Storage](/blog/ai-homelab-engineering/07-minio-and-distributed-ai-storage) — next: the storage layer that depends on it.
- [AI Homelab architecture hub](/systems/ai-homelab) — the interactive system diagram.
- [Static IPs and Networking](/blog/infrastructureengineering/04-static-ips-and-networking) — the step-by-step Pi networking setup.
- [DNS and Service Discovery](/blog/infrastructureengineering/19-dns-and-service-discovery) — CoreDNS in more depth.

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
