---
title: "OCR Pipelines"
description: "OCR pipeline design for AI microservices."
date: 2026-03-22
category: "backend-engineering"
tags:
  - ocr
  - ai
draft: false
slug: ocr-pipelines
author: Donavan Jones
---

# OCR Pipelines

A Bible study platform that only handles digital text is missing a significant portion of its users' actual workflows. People study from physical Bibles, annotated margins, handwritten journals, printed sermon notes, and scanned pages from centuries-old commentaries. Ignoring that content means the platform cannot surface insights from a user's most personal study material.

OCR — Optical Character Recognition — is how the platform ingests this content. A user photographs a page from their study Bible or uploads a scan of a 19th-century commentary, and the pipeline converts that image to text that can be searched, embedded, and referenced alongside everything else.

This article covers how the OCR pipeline is designed, what makes it reliable, how it handles the specific challenges of religious and historical texts, and how it connects to the rest of the backend.

## The Pipeline Overview

OCR is not a single operation — it is a sequence of steps, each of which can fail or produce degraded output that compounds errors downstream:

```
Upload → Preprocessing → OCR Engine → Post-processing → Validation → Storage → Indexing
```

Each step is a discrete stage in an async pipeline. An image uploaded by the user enters at the left and exits as indexed, searchable text. The pipeline is built around a job queue — every uploaded image becomes a job record, and each stage updates the job's status as it progresses.

This matters for reliability. If the OCR engine call fails at stage three, the job is retried from stage three — not from the beginning. Preprocessing does not run again. Progress is preserved across failures.

## Input Handling and Preprocessing

Images arrive in many states. A photo taken with a phone in good lighting is easy. A photo taken at an angle under yellow lamplight is hard. A 300 DPI archival scan of an 1891 commentary is somewhere in between. The preprocessing stage's job is to normalize inputs before they reach the OCR engine.

Preprocessing steps in order:

**Format normalization.** Input images can be JPEG, PNG, HEIC, TIFF, or PDF. All are converted to PNG at a consistent DPI (300 minimum) before further processing. PDFs are split into per-page images.

**Orientation correction.** Documents photographed sideways or upside down produce garbage OCR. I use an automatic orientation detection step that reads EXIF rotation metadata and, when that is absent, runs a lightweight ML-based orientation classifier. Pages are rotated before any other processing.

**Deskewing.** Documents that are slightly rotated (a phone photo taken at a small angle) cause OCR accuracy to drop significantly. Deskewing detects the text baseline angle and rotates the image to align it. Most consumer photos need 1–5 degrees of correction; scans are usually already aligned.

**Binarization.** OCR engines work best on black text on a white background. Color photographs with varying lighting, shadows, and paper tones need to be converted to clean binary (black/white) images. Adaptive thresholding handles uneven lighting better than a global threshold — it computes the threshold locally for each region of the image.

**Noise removal.** Old documents and low-quality scans have speckling, bleed-through from the reverse side of the page, and crease shadows. A denoising pass removes small artifacts without blurring text edges.

These steps run sequentially using Sharp (Node.js image processing) for format handling and a Python sidecar process for the ML-based orientation and deskewing steps. The preprocessed image is stored to object storage before the OCR stage — this is the input the OCR engine will actually see, and retaining it means failed OCR jobs can be retried without rerunning preprocessing.

## OCR Engine Selection

The choice of OCR engine depends on the content type:

**Standard printed text** — modern Bible editions, typeset books, printed sermon notes. I use Google Cloud Vision OCR for this category. It handles multiple fonts, varying sizes, and moderate image quality well, and its API makes it easy to get word-level bounding boxes (needed for layout reconstruction).

**Historical and archival documents** — 19th and early 20th century commentaries, old lexicons, manuscripts. These often use typefaces that modern general-purpose OCR engines handle poorly (long-s characters, ligatures, inconsistent spacing). For this category I use Tesseract with a fine-tuned model trained on historical religious texts. The fine-tuned model outperforms the default Tesseract model by roughly 15% on character error rate for 19th-century English religious typography.

**Handwriting** — personal journal entries, margin annotations. Handwriting recognition is significantly harder than printed text OCR. I use Google Cloud Vision's handwriting mode, which handles legible handwriting reasonably well. Illegible handwriting is flagged with a low confidence score and returned to the user with a warning rather than silently producing poor output.

The pipeline determines which engine to use from the document metadata the user provides at upload time: document type (modern book, historical, handwritten) plus a rough date if known. Users can override the automatic selection if the default produces poor results.

## Post-Processing

Raw OCR output is noisy. Even a good engine running on clean input produces errors: misread characters, spurious line breaks, merged words, incorrectly split words. Post-processing corrects the most common errors before the text enters the rest of the pipeline.

### Domain Dictionary Correction

Religious texts have a high density of specialized vocabulary that general OCR engines handle poorly: transliterated Hebrew and Greek words, proper names from scripture (Nebuchadnezzar, Bartholomew, Thessalonians), archaic English terms (propitiation, imprecatory, eschatological), and book abbreviations.

I maintain a domain dictionary of ~15,000 terms. After OCR, each word is checked against the dictionary. Words not found in the dictionary or standard English lexicon are run through a fuzzy match against the domain dictionary — if the OCR output "Ncbuchadnezzar" is within edit distance 2 of "Nebuchadnezzar" and no other dictionary word is closer, it is corrected.

This is a targeted intervention, not a spell-checker. General spell-checking would aggressively "correct" transliterated Greek and Hebrew terms that are correctly OCR'd but absent from standard dictionaries. The domain dictionary approach only fires on low-confidence words and only substitutes from the religious vocabulary list.

### Layout Reconstruction

OCR engines return text in reading order, but "reading order" breaks down for multi-column layouts, footnotes, sidebars, and margin annotations — all common in study Bibles and academic commentaries.

I use the word-level bounding boxes returned by the OCR engine to reconstruct layout structure. The algorithm:

1. Cluster words into lines by y-coordinate proximity
2. Cluster lines into columns by x-coordinate separation
3. Sort columns left-to-right, lines top-to-bottom within each column
4. Identify footnotes by font size metadata (smaller text at page bottom)
5. Reconstruct the main body text, then append footnotes separately

This is not perfect for complex layouts, but it handles the most common study Bible format (two columns with footnotes) reliably. Margin annotations are extracted as a separate text block with a `source: margin` tag, which lets the platform distinguish the user's handwritten notes from the printed text.

### Confidence Scoring

Every word returned by the OCR engine carries a confidence score. I compute a page-level confidence score as the weighted average of word-level confidence:

```typescript
function pageConfidence(words: OcrWord[]): number {
  const total = words.reduce((sum, w) => sum + w.confidence * w.text.length, 0);
  const chars = words.reduce((sum, w) => sum + w.text.length, 0);
  return total / chars; // length-weighted average
}
```

Length-weighting ensures that a single low-confidence short word does not drag down the score for an otherwise clean page. Pages below 0.75 confidence are flagged for user review before being indexed — the user sees a side-by-side of the original image and the extracted text and can correct errors before they propagate into search.

## Handling Multi-Page Documents

Most uploaded documents are more than one page. PDFs and multi-page TIFFs are split at the upload stage — each page becomes an independent OCR job. This serves two purposes: failed pages can be retried individually without reprocessing the whole document, and multiple pages can be processed in parallel by different workers.

After all pages complete, a reassembly job runs that:
- Orders pages by their sequence index
- Merges the text with page number metadata
- Detects and handles duplicate pages (common with scanned documents where the user accidentally photographed a page twice)
- Generates the document-level metadata (estimated word count, detected language, document structure summary)

The reassembled document is stored as a single structured document in the database. The per-page OCR jobs are retained for audit and for handling reruns if a specific page needs to be reprocessed.

## Connecting to the Rest of the Backend

Once text extraction is complete, the OCR pipeline hands off to the embedding service. Extracted text is chunked using the same rules as commentary content (512-token chunks, 64-token overlap, sentence-boundary splits) and submitted to the embedding service for indexing.

After indexing, the document is searchable alongside all other platform content. A user who scanned their annotated study Bible margins can search "my notes about covenant" and get results from their handwritten margin notes, their saved digital notes, and retrieved scripture passages — all in the same search result.

The handoff uses the same async job pattern as the rest of the pipeline:

```typescript
async function completeOcrJob(jobId: string, extractedText: string) {
  await db.ocrJobs.update(jobId, { status: "completed", text: extractedText });

  // Fire and forget — embedding runs asynchronously
  await queue.publish("embedding.requested", {
    sourceType: "ocr_document",
    sourceId: jobId,
    text: extractedText,
    userId: job.userId,
  });
}
```

The OCR pipeline does not wait for embedding to finish. Its job ends when clean text is written to the database. Embedding picks up from there.

## Error Handling and User Feedback

OCR is lossy by nature — some inputs produce poor output regardless of how good the pipeline is. The platform has to communicate this honestly rather than silently indexing garbage.

I surface four outcome states to users after an OCR job:

**Success** — confidence above 0.85, no flagged issues. Text is indexed and searchable immediately.

**Success with warnings** — confidence 0.75–0.85, or specific low-confidence regions detected. Text is indexed but the user is shown the extracted text for review. Common cause: mixed fonts, moderate image quality.

**Needs review** — confidence below 0.75. Text is extracted but not indexed until the user reviews and confirms (or corrects) it. The review UI shows the original image alongside the extracted text with low-confidence words highlighted.

**Failed** — the OCR engine could not extract meaningful text. Causes include: images that are too blurry, documents in unsupported scripts, or images that contain no text at all. The user receives an explanation and, where possible, a suggestion (increase image resolution, use flatbed scanner for bound documents).

The "needs review" state is the most important one to get right. Silently indexing low-quality OCR output poisons search results with noise — the user searches for a passage and gets garbage results because a poorly-OCR'd page happened to contain similar-looking character sequences. Making the user confirm before indexing keeps the quality bar high.

## Performance

OCR is CPU-intensive and slower than most other pipeline stages. Target times per page:

| Content Type | Preprocessing | OCR | Post-processing | Total |
|---|---|---|---|---|
| Clean printed text | 0.5s | 1–2s | 0.3s | ~2–3s |
| Historical document | 0.8s | 3–5s | 0.5s | ~4–6s |
| Handwriting | 0.5s | 2–4s | 0.3s | ~3–5s |

A 20-page PDF takes 40–120 seconds end-to-end with pages processed in parallel across four workers. Users are not waiting at a spinner — this is an async job with a notification on completion — so the latency is acceptable.

Workers scale horizontally. During bulk upload events (a user uploading a stack of scanned commentaries), the worker pool expands automatically. Peak load is bounded by the Google Cloud Vision API rate limit, not by local compute.

OCR pipelines are not glamorous infrastructure. Nobody writes blog posts about the adaptive thresholding step. But for a platform where significant user content lives in physical form, it is the difference between a product that meets users where they are and one that requires them to change how they study to use it.
