---
title: "MinIO and Distributed AI Storage"
description: "Using MinIO as S3-compatible object storage in a home AI cluster: distributed mode on k3s, what to store (datasets, models, artifacts), and lifecycle rules."
date: 2026-09-28
lastUpdated: "2026-11-14"
category: "ai-homelab-engineering"
tags:
  - ai-homelab-engineering
  - minio
  - storage
draft: false
slug: minio-and-distributed-ai-storage
author: Donavan Jones
excerptImage: /img/blog/ai-homelab-engineering/07-minio-and-distributed-ai-storage.jpg
---

# MinIO and Distributed AI Storage

MinIO is the simplest way to give a home AI cluster S3-compatible object storage without depending on a cloud provider. Training datasets, model files, generated images, embedding snapshots — an AI homelab accumulates a lot of binary data that needs one shared endpoint every service can reach. In my k3s cluster MinIO is part of the in-cluster data layer alongside PostgreSQL, Redis, and Weaviate.

*Part of the [AI Homelab Engineering series](/categories/ai-homelab-engineering). For the full system map, see the [AI homelab architecture hub](/systems/ai-homelab).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every AI homelab deep-dive in this series."
destinationUrl: "/categories/ai-homelab-engineering"
---
::

## Why Object Storage Instead of Plain Filesystem

Local model files could just live on each node's disk directly, but that means a node failure loses whatever was stored there, and there's no single place for other services (the RAG pipeline, the image generation service, the agent's artifact output) to reliably fetch shared assets. MinIO gives a single S3-compatible endpoint the whole cluster talks to, and in distributed mode the data underneath is erasure-coded across multiple nodes.

## Deploying MinIO in Distributed Mode

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: minio
spec:
  serviceName: minio
  replicas: 4
  selector:
    matchLabels: {app: minio}
  template:
    metadata:
      labels: {app: minio}
    spec:
      containers:
        - name: minio
          image: minio/minio:latest
          args:
            - server
            - http://minio-{0...3}.minio.default.svc.cluster.local/data
          volumeMounts:
            - {name: data, mountPath: /data}
  volumeClaimTemplates:
    - metadata: {name: data}
      spec:
        accessModes: ["ReadWriteOnce"]
        resources: {requests: {storage: 100Gi}}
```

Four replicas with erasure coding means the cluster tolerates a node going down without losing data or availability — a meaningful property for a homelab where a node is more likely to need an unplanned reboot than a managed cloud instance. The tradeoff is four volumes' worth of disk and enough network bandwidth between nodes; on small boards, a single-instance MinIO on reliable storage is a perfectly reasonable starting point.

## What Belongs in MinIO

**Training datasets** — my cluster has a dedicated bucket for them, so fine-tuning work has one known place to pull data from instead of a copy on some laptop.

**Model weights** — the actual quantized model files, so a new node or a redeployed pod pulls from internal storage instead of re-downloading from the internet every time.

**Embeddings and vector indexes** — persisted snapshots, so a vector store rebuild doesn't require re-embedding an entire corpus from scratch.

**Generated artifacts** — images, audio, and agent-produced files that need to be retrievable after the job that created them has finished.

Rather than hand-creating buckets, I let [Kingdom Tools](/projects/kingdom-tools), my internal platform, provision MinIO storage per service alongside its Postgres, Redis, and Weaviate resources. How VerseHub uses it specifically is covered in [MinIO storage strategy](/blog/versehub-engineering/08-minio-storage-strategy).

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how storage fits into the full AI homelab architecture."
destinationUrl: "/systems/ai-homelab"
---
::

## Lifecycle Policies

Not everything belongs in storage forever. MinIO's bucket lifecycle rules automatically expire transient artifacts (a generated image reviewed once and no longer needed) after a set retention window, so storage usage doesn't grow unbounded on data nobody's coming back for.

```bash
mc ilm add --expiry-days 30 myminio/generated-artifacts
```

::CtaCardRow
  :::CtaDownloadGuide
  ---
  buttonText: "Get The Raspberry Pi AI Cluster Blueprint"
  supportingCopy: "Get working MinIO configs and the full storage architecture ($39)."
  destinationUrl: "/products/raspberry-pi-ai-cluster-blueprint"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: Raspberry Pi AI Cluster Setup"
  supportingCopy: "Extending this cluster with lower-cost ARM64 nodes."
  destinationUrl: "/blog/ai-homelab-engineering/08-raspberry-pi-ai-cluster-setup"
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
  - label: "MinIO — Official Documentation"
    url: "https://min.io/docs/minio/linux/index.html"
    type: "external"
    description: "Official documentation for the distributed object storage system covered throughout this article."
  - label: "Erasure Coding — Wikipedia"
    url: "https://en.wikipedia.org/wiki/Erasure_code"
    type: "wikipedia"
    description: "Background on the erasure coding scheme MinIO uses for fault-tolerant distributed storage."
---
::

## Related reading

- [Networking for AI Clusters](/blog/ai-homelab-engineering/06-networking-for-ai-clusters) — previous in the series: the network distributed storage depends on.
- [Raspberry Pi AI Cluster Setup](/blog/ai-homelab-engineering/08-raspberry-pi-ai-cluster-setup) — next: the Pi nodes that run the control plane and utility services.
- [AI Homelab architecture hub](/systems/ai-homelab) — the interactive system diagram.
- [Persistent Volumes](/blog/infrastructureengineering/09-persistent-volumes) — the Kubernetes storage primitives under MinIO's volumes.

---

*[← Back to AI Homelab Engineering](/categories/ai-homelab-engineering)*
