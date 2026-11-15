---
title: "MinIO Storage Strategy"
description: "VerseHub's MinIO storage strategy: self-hosted S3-compatible buckets for raw uploads, transcoded media, and AI artifacts, with lifecycle rules to bound storage."
date: 2026-10-13
lastUpdated: "2026-11-14"
category: "versehub-engineering"
tags:
  - versehub-engineering
  - minio
  - storage
draft: false
slug: minio-storage-strategy
author: Donavan Jones
excerptImage: /img/blog/versehub-engineering/08-minio-storage-strategy.jpg
---

# MinIO Storage Strategy

VerseHub stores media and generated artifacts in MinIO, a self-hosted, S3-compatible object store, using separate buckets for raw uploads, processed output, and AI artifacts, each with its own lifecycle rule. The media pipeline — user-uploaded audio and video, transcoded via FFmpeg and queued through BullMQ — needs somewhere durable to land, and MinIO runs in-cluster on the same self-hosted infrastructure covered throughout the [AI Homelab Engineering series](/systems/ai-homelab).

*Part of the [VerseHub Engineering series](/categories/versehub-engineering). For the project overview, see the [VerseHub project page](/projects/versehub).*

::CtaCategoryPillar
---
buttonText: "Browse More Like This"
supportingCopy: "See every VerseHub engineering deep-dive in this series."
destinationUrl: "/categories/versehub-engineering"
---
::

## What's Stored in MinIO

**Original media uploads** — the raw audio/video files a user uploads, kept until transcoding completes successfully, at which point the original can be safely removed per the lifecycle policy below.

**Transcoded outputs** — the FFmpeg-processed, web-deliverable versions of uploaded media, which are what the application actually serves to users.

**AI-generated study artifacts** — any generated images, formatted study guides, or exportable content the AI study domain produces, referenced by the application but stored as objects rather than inline in the relational database.

The same MinIO deployment serves the rest of the cluster too, including a bucket for training datasets used by the LoRA work on my RTX 3090 — see [MinIO and Distributed AI Storage](/blog/ai-homelab-engineering/07-minio-and-distributed-ai-storage) for that side.

## The Upload-to-Serve Pipeline

```
1. User uploads media → written to MinIO (raw/ bucket)
2. Upload event → BullMQ job queued
3. Worker picks up job → FFmpeg transcodes to web-optimized format
4. Transcoded output → written to MinIO (processed/ bucket)
5. Database record updated with the processed object's reference
6. Raw upload becomes eligible for lifecycle expiration
```

## Bucket Structure and Lifecycle Rules

Separate buckets for raw uploads, processed output, and AI-generated artifacts, each with its own lifecycle policy — raw uploads expire once transcoding confirms success (no reason to keep the pre-processed original indefinitely), while processed output and user-facing artifacts are retained without automatic expiration since they're actively served.

```bash
mc ilm add --expiry-days 7 minio/versehub-raw-uploads
```

The 7-day window on raw uploads is a safety buffer — long enough to recover from a failed transcoding job by re-queuing against the original, short enough that storage doesn't accumulate indefinitely on files that are only ever needed transiently.

::CtaSystemArchitecture
---
buttonText: "See The Full System"
supportingCopy: "See how storage fits into VerseHub's full production architecture."
destinationUrl: "/projects/versehub"
---
::

## Why Self-Hosted Object Storage Instead of a Cloud Provider

Running MinIO on owned infrastructure rather than a cloud object storage service avoids per-request and egress pricing that scales with usage in a way that's hard to predict for a growing user base, and keeps user-uploaded media (which can include personal recordings and study content) on infrastructure under direct control rather than a third party's, which matters for the same reasons privacy matters throughout this site's homelab work (see [Local AI Security](/blog/ai-homelab-engineering/13-local-ai-security-keeping-data-private)). For how storage is laid out across the Pi cluster itself, see [Storage Strategy](/blog/infrastructureengineering/34-storage-strategy).

::CtaCardRow
  :::CtaTryApp
  ---
  buttonText: "Try VerseHub"
  supportingCopy: "See this storage architecture running in production."
  destinationUrl: "https://versehub.app/"
  ---
  :::

  :::CtaRelatedArticle
  ---
  buttonText: "Read: MinIO and Distributed AI Storage"
  supportingCopy: "The general MinIO architecture this strategy is built on."
  destinationUrl: "/blog/ai-homelab-engineering/07-minio-and-distributed-ai-storage"
  ---
  :::

  :::CtaNewsletter
  ---
  buttonText: "Get New Posts By Email"
  supportingCopy: "Get new VerseHub engineering breakdowns delivered before they're public."
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
    description: "Official documentation for the object storage system used throughout VerseHub's media pipeline."
  - label: "FFmpeg — Official Documentation"
    url: "https://ffmpeg.org/documentation.html"
    type: "external"
    description: "Documentation for the media transcoding tool used in the upload-to-serve pipeline."
---
::

## Related reading

- [Temporal Workflows in Production](/blog/versehub-engineering/07-temporal-workflows-in-production) — previous in the series: durable AI workflows.
- [Scaling VerseHub with Local AI Infrastructure](/blog/versehub-engineering/09-scaling-versehub-with-local-ai-infrastructure) — next: how the platform scales on owned hardware.
- [VerseHub project page](/projects/versehub) — overview and architecture diagram.
- [Persistent Volumes](/blog/infrastructureengineering/09-persistent-volumes) — the Kubernetes storage layer underneath MinIO.

---

*[← Back to VerseHub Engineering](/categories/versehub-engineering)*
