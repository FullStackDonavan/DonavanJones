---
title: "MinIO Storage Strategy"
description: "How VerseHub uses MinIO for media assets and generated artifacts, and the lifecycle rules that keep storage costs bounded."
date: 2026-08-12
lastUpdated: "2026-08-12"
category: "versehub-engineering"
tags:
  - versehub-engineering
  - minio
  - storage
draft: true
slug: minio-storage-strategy
author: Donavan Jones
---

# MinIO Storage Strategy

VerseHub's media processing pipeline — user-uploaded audio and video study content, transcoded via FFmpeg and queued through BullMQ — needs somewhere durable to land, and MinIO's S3-compatible object storage is that destination, running as part of the same self-hosted infrastructure covered throughout the [AI Homelab Engineering series](/categories/ai-homelab-engineering).

*Part of the [VerseHub Engineering series](/categories/versehub-engineering).*

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
destinationUrl: "/systems/versehub-engineering"
---
::

## Why Self-Hosted Object Storage Instead of a Cloud Provider

Running MinIO on owned infrastructure rather than a cloud object storage service avoids per-request and egress pricing that scales with usage in a way that's hard to predict for a growing user base, and keeps user-uploaded media (which can include personal recordings and study content) on infrastructure under direct control rather than a third party's, which matters for the same reasons privacy matters throughout this site's homelab work.

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
  destinationUrl: "/blog/ai-homelab-engineering/minio-and-distributed-ai-storage"
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

---

*[← Back to VerseHub Engineering](/categories/versehub-engineering)*
