---
title: "Ingress Setup"
description: "How to configure Traefik ingress on a K3s Raspberry Pi cluster — routing external traffic, TLS termination, and deploying your first service."
date: 2025-10-13
category: "infrastructure-engineering"
tags:
  - ingress
  - kubernetes
draft: false
cluster: "infrastructure-engineering"
slug: ingress-setup
author: Donavan Jones
---

# Ingress Setup

## Introduction

This guide walks through setting up Ingress in a lightweight Kubernetes environment using K3s running on a Raspberry Pi homelab rack cluster. Your rack setup includes multiple Pi nodes, containerized services, and external compute workloads (like your RTX 3090 Docker AI machine) that work alongside the cluster.

Ingress acts as the **single routing layer** that connects all of these moving parts. Instead of exposing each service separately, you route everything through one controlled entry point. This is especially useful in your setup because you’re running:

- Kubernetes services on Raspberry Pi nodes
- AI workloads on a separate GPU machine
- CI/CD pipelines using Gitea inside the cluster
- Internal apps like your Bible app and dashboards

Ingress becomes the bridge between all of them.

*Part of the [Infrastructure Engineering series](/categories/infrastructure-engineering).*

---

## Prerequisites

Make sure:

- K3s is installed on your Pi cluster
- kubectl is working from your admin machine
- At least one service is deployed
- Cluster networking between nodes is healthy
- (Optional) MetalLB is installed for bare-metal IP exposure

---

## Installing an Ingress Controller

K3s ships with Traefik enabled by default.

To verify it is running, check system pods:

- kube-system namespace pods should include Traefik

If you want NGINX instead:

Install it using Helm:

helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx  
helm repo update  

helm install ingress-nginx ingress-nginx/ingress-nginx  
--namespace ingress-nginx  
--create-namespace  

---

## Creating an Ingress Resource

Once your controller is running, create an ingress rule like this:

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

Apply it:

kubectl apply -f ingress.yaml  

---

## DNS and Local Routing

In your rack setup, DNS is usually handled manually.

You can map:

- app.local → ingress IP

Using:

- /etc/hosts on your dev machine
- Router DNS rules
- Pi-hole inside your rack cluster

This is what makes Ingress actually reachable from your browser.

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

## Conclusion

Ingress is the “front door” of your Kubernetes rack.

In your setup—where you’re running a hybrid system of:

- Raspberry Pi K3s cluster
- GPU-powered AI Docker machine
- Gitea CI/CD pipelines
- Internal apps like your Bible platform

Ingress is what ties it all together into one clean routing system.

Once it is stable, you stop thinking in terms of individual nodes and start thinking in terms of **services behind a single unified gateway**, which is exactly what you want for scaling your architecture cleanly over time.

---

*[← Back to Infrastructure Engineering series](/categories/infrastructure-engineering)*