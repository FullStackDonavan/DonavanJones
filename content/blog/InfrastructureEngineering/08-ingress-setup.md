---
title: "Ingress Setup"
description: "How to configure Traefik ingress on a K3s Raspberry Pi cluster — routing external traffic, TLS termination, and deploying your first service."
date: 2025-10-13
lastUpdated: "2026-11-14"
category: "infrastructure-engineering"
tags:
  - ingress
  - kubernetes
draft: false
cluster: "infrastructure-engineering"
slug: ingress-setup
author: Donavan Jones
excerptImage: /img/blog/infrastructureengineering/08-ingress-setup.jpg
---

# Ingress Setup

K3s ships with the Traefik ingress controller already enabled, so ingress setup on a Pi cluster mostly comes down to writing an `Ingress` resource that maps a hostname to a Service, then pointing that hostname at the cluster in DNS or `/etc/hosts`. Add TLS with cert-manager or self-signed certs once routing works. K3s's built-in ServiceLB (Klipper) handles `LoadBalancer` services, so you don't need MetalLB to get started.

## Introduction

This guide walks through setting up Ingress in a lightweight Kubernetes environment using K3s running on a Raspberry Pi homelab rack cluster. A rack like mine has multiple Pi nodes, Jetson GPU workers, containerized services, and external compute (an RTX 3090 Docker machine) working alongside the cluster.

Ingress acts as the **single routing layer** that connects all of these moving parts. Instead of exposing each service separately, you route everything through one controlled entry point. This is especially useful in a setup that runs:

- Kubernetes services on Raspberry Pi nodes
- AI workloads on a separate GPU machine
- CI/CD pipelines using Gitea inside the cluster
- Internal apps like [VerseHub](/projects/versehub) and dashboards

Ingress becomes the bridge between all of them.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering). For how every node and service fits together, start with the [infrastructure systems overview](/systems/infrastructure).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every infrastructure engineering breakdown in this series."
destinationUrl: "/categories/infrastructure-engineering"
---
::

---

## Prerequisites

Make sure:

- K3s is installed on your Pi cluster
- kubectl is working from your admin machine
- At least one service is deployed
- Cluster networking between nodes is healthy
- (Optional) MetalLB, if you'd rather not use K3s's built-in ServiceLB for bare-metal IP exposure

---

## Installing an Ingress Controller

K3s ships with Traefik enabled by default.

To verify it is running, check system pods:

- kube-system namespace pods should include Traefik

If you want NGINX instead:

Install it using Helm:

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace
```

---

## Creating an Ingress Resource

Once your controller is running, create an ingress rule like this (the `rewrite-target` annotation only applies to NGINX; Traefik ignores it):

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: example-ingress
  namespace: default
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: app.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: example-service
                port:
                  number: 80
```

Apply it:

```bash
kubectl apply -f ingress.yaml
```

---

## DNS and Local Routing

In a homelab rack, DNS is usually handled manually.

You can map:

- app.local → ingress IP

Using:

- /etc/hosts on your dev machine
- Router DNS rules
- A local DNS server such as Pi-hole

This is what makes Ingress actually reachable from your browser. Inside the cluster, services find each other through CoreDNS instead — see [DNS and service discovery in K3s](/blog/infrastructureengineering/19-dns-and-service-discovery).

Not everything in my cluster goes through ingress, either. Internal tools like Prometheus (30909), Grafana (30300), and Gitea (32080) are exposed as plain NodePorts, which is simpler for LAN-only dashboards. For `LoadBalancer` services, K3s's ServiceLB decides which nodes publish ports based on a node label — and getting that label wrong once [broke every LoadBalancer service in my cluster](/blog/infrastructureengineering/46-servicelb-node-label-broke-loadbalancers).

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

## SSL (Recommended)

Even in a homelab, you should plan for TLS early.

Options:

- cert-manager + Let’s Encrypt (public services)
- Self-signed certs (internal rack services)

This matters later when you scale your Bible app or expose AI services externally.

---

## Troubleshooting

If Ingress is not working:

- Check ingress controller is running
- Confirm service exists and is reachable inside cluster
- Verify service name + port match exactly
- Check DNS resolves to ingress IP
- Look at ingress controller logs

In your Pi rack setup, most failures are usually:
- service discovery issues
- node networking mismatch
- wrong service port mapping

---

::CtaContactWork
---
buttonText: "Let's Talk About Your Ingress Setup"
supportingCopy: "Routing traffic into your own Kubernetes rack? Let's talk through the architecture."
destinationUrl: "/hire-me"
---
::

## Conclusion

Ingress is the “front door” of your Kubernetes rack.

In your setup—where you’re running a hybrid system of:

- Raspberry Pi K3s cluster
- GPU-powered AI Docker machine
- Gitea CI/CD pipelines
- Internal apps like your Bible platform

Ingress is what ties it all together into one clean routing system.

Once it is stable, you stop thinking in terms of individual nodes and start thinking in terms of **services behind a single unified gateway**, which is exactly what you want for scaling your architecture cleanly over time.

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
  buttonText: "Read: Persistent Volumes"
  supportingCopy: "Continue with \"Persistent Volumes\" to give the services now routed through ingress durable storage."
  destinationUrl: "/blog/infrastructureengineering/09-persistent-volumes"
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
  - label: "Nginx — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Nginx"
    type: "wikipedia"
    description: "According to this overview, nginx is a high-performance web server and reverse proxy — the software used as the Kubernetes ingress controller routing external traffic to cluster services."
  - label: "Reverse Proxy — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Reverse_proxy"
    type: "wikipedia"
    description: "Overview of reverse proxy architecture — the pattern that ingress controllers implement: a single entry point that routes incoming requests to the correct backend service based on hostname and path rules."
  - label: "Transport Layer Security — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Transport_Layer_Security"
    type: "wikipedia"
    description: "According to this overview, TLS encrypts network traffic between clients and servers — the protocol configured via cert-manager for services exposed through the cluster ingress."
  - label: "Domain Name System — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Domain_Name_System"
    type: "wikipedia"
    description: "Overview of DNS — the resolution layer that maps hostnames like app.local to the ingress IP, enabling browser access to cluster services by name rather than raw IP address."
---
::

---

## Related reading

- [Storage Setup](/blog/infrastructureengineering/07-storage-setup) — previous in the series
- [Persistent Volumes](/blog/infrastructureengineering/09-persistent-volumes) — next in the series
- [Installing Gitea in Kubernetes](/blog/infrastructureengineering/23-installing-gitea-in-kubernetes) — an ingress example for a real self-hosted service
- [Infrastructure systems overview](/systems/infrastructure) — the hub page for the whole rack: nodes, services, and how they connect
- [VerseHub Architecture](/blog/versehub-engineering/01-versehub-architecture) — the app most of this routing serves

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*