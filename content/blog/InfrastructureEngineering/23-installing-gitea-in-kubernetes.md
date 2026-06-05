---
title: "Installing Gitea in Kubernetes"
description: "How to install Gitea in a Kubernetes cluster for CI/CD."
date: 2025-11-20
category: "infrastructure-engineering"
tags:
  - gitea
  - kubernetes
  - ci-cd
draft: false
slug: installing-gitea-in-kubernetes
author: Donavan Jones
---

# Installing Gitea in Kubernetes

## Introduction

Gitea is a lightweight, self-hosted Git service that fits well in a Kubernetes-based homelab or production-style rack. In my setup, it makes sense to keep Git close to the rest of the infrastructure so source control, CI/CD, and deployment workflows all live in the same environment. That keeps everything easier to manage from the cluster side, whether the workload is running on ARM64 nodes, Raspberry Pi-based systems, or a mixed homelab rack.

This guide walks through installing Gitea in Kubernetes with a clean, repeatable setup. It also calls out a common formatting issue that can break setup docs and copied commands: unfinished code fences. A missing closing triple backtick can cause bash blocks to swallow YAML, break rendering, or make a copied command fail in ways that are easy to miss.

## Prerequisites

Before you begin, make sure you have:

* A working Kubernetes cluster
* `kubectl` configured to talk to the cluster
* A storage class available for persistent volumes
* Ingress configured, if you want external access
* `Helm` installed, if you plan to deploy Gitea with a chart

## Create a namespace

Start by creating a dedicated namespace for Gitea.

```bash
kubectl create namespace gitea
```

## Example persistent storage

Gitea needs persistent storage for repositories, attachments, and configuration. In a homelab rack, this is usually backed by local storage, SSD-backed volumes, or a networked storage solution depending on how the cluster is designed.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: gitea-data
  namespace: gitea
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## Example deployment

A basic deployment might look like this:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gitea
  namespace: gitea
spec:
  replicas: 1
  selector:
    matchLabels:
      app: gitea
  template:
    metadata:
      labels:
        app: gitea
    spec:
      containers:
        - name: gitea
          image: gitea/gitea:latest
          ports:
            - containerPort: 3000
          volumeMounts:
            - name: gitea-data
              mountPath: /data
      volumes:
        - name: gitea-data
          persistentVolumeClaim:
            claimName: gitea-data
```

## Example service

Expose Gitea inside the cluster with a service:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: gitea
  namespace: gitea
spec:
  selector:
    app: gitea
  ports:
    - name: http
      port: 3000
      targetPort: 3000
```

## Example ingress

If you use ingress, point a hostname at Gitea so it is easy to reach from your network.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: gitea
  namespace: gitea
spec:
  rules:
    - host: gitea.example.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: gitea
                port:
                  number: 3000
```

## Applying the manifests

Once the files are ready, apply them in order.

```bash
kubectl apply -f pvc.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
```

## Checking the deployment

Verify that the pod is running and the service is available.

```bash
kubectl get pods -n gitea
kubectl get svc -n gitea
kubectl get ingress -n gitea
```

## Avoiding broken code fences

One of the easiest ways for a Markdown article to break is a missing closing code fence. For example, this is invalid because the block never closes properly:

```bash
kubectl create namespace gitea
```

Always make sure every code block starts and ends cleanly, especially when mixing Bash, YAML, and long rendered articles. This matters even more when copy/pasting into editors or when a UI splits the response across sections.

## Conclusion

Installing Gitea in Kubernetes is a solid fit for a homelab rack because it keeps source control, automation, and deployment workflows close together. With a namespace, persistent storage, a deployment, a service, and optional ingress, you can stand up a reliable self-hosted Git platform that supports your CI/CD pipeline and grows with the rest of your cluster. The key is keeping the Markdown clean, the YAML valid, and every code fence properly closed so the document renders correctly from start to finish.
