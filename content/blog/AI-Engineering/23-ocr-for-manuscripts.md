---
title: "OCR for Manuscripts"
description: "Using OCR for digitizing and analyzing religious manuscripts."
date: 2026-07-12
category: "ai-engineering"
tags:
  - ai-engineering
  - ocr
  - manuscripts
draft: true
slug: ocr-for-manuscripts
author: Donavan Jones
---

# OCR for Manuscripts

The bulk of the platform's source corpus — Bible translations, lexicons, modern commentaries — arrived in clean digital form. But the theological library that matters most to serious study was written before digitization existed. Augustine's *City of God*, Calvin's *Institutes*, Luther's commentaries, the Church Fathers in their original Latin and Greek — this material exists in scanned PDFs, photographed manuscripts, and aged print editions that no clean digital text has fully captured.

Getting this content into the platform's knowledge base requires optical character recognition. And OCR on theological manuscripts is not the same problem as OCR on printed English text. The scripts are harder. The layouts are unusual. The vocabulary is rare. The errors that standard OCR engines produce on this content — misread Greek letters, collapsed abbreviations, broken words at line ends — propagate into the embedding pipeline, degrade retrieval quality, and ultimately reach users as malformed citations and truncated passages.

This article covers how the manuscript OCR pipeline is built, what makes theological manuscripts specifically hard, and the post-processing layers that convert noisy OCR output into clean, indexed text.

*Part of the [AI Engineering series](/categories/ai-engineering).*

## What Makes Theological Manuscripts Hard

Standard OCR engines are trained primarily on modern, typeset Latin-script text. They perform well on printed books from the last century and poorly on everything else. Theological manuscripts pile up every dimension of difficulty:

**Multiple scripts in one document.** A page from a critical commentary might contain English prose, inline Greek (Koine, uncial, or Byzantine minuscule), Hebrew (with vowel points), Latin quotations, and transliterated terms using diacritical marks. A Tesseract configuration tuned for English will fail on the Greek; one tuned for Greek will fail on the English. Mixed-script pages require multi-pass recognition.

**Archaic typography.** Latin editions from the 16th and 17th centuries use long-s (ſ), ligatures (æ, œ, ﬁ, ﬂ), abbreviation marks, and typefaces that modern engines have poor coverage for. Early printed books also use irregular spacing that confuses word segmentation.

**Damaged and aged physical media.** Scanned manuscript pages have foxing (age spots), water damage, bleed-through from the reverse side, and fading that reduces ink contrast. These degrade the input image quality before OCR has a chance to read the text.

**Domain vocabulary.** Theological terminology includes proper names, Greek transliterations, and technical terms that are rare in general OCR training data. When a recognition model is uncertain, it substitutes a visually similar word from its training distribution. "Pneumatology" becomes "Pneumatology" — fine. "Parousia" becomes "Paronsia" or "Parousia" — subtle errors that break word lookup and retrieval.

**Column and marginalia layouts.** Critical editions use multi-column layouts with marginal references and footnotes. Page segmentation must correctly identify the main text, marginal notes, and footnotes as separate text regions, each requiring independent recognition.

## Pipeline Architecture

The OCR pipeline has five stages, each addressing a specific failure mode:

```
Raw image/PDF
     │
     ▼
┌─────────────────┐
│  Preprocessing  │  — image quality, geometry correction
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Segmentation   │  — page layout analysis, region detection
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Recognition    │  — per-region OCR with appropriate engine/config
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Post-processing│  — error correction, domain dictionary, normalization
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validation     │  — confidence scoring, human review routing
└────────┬────────┘
         │
         ▼
Clean text output
```

## Stage 1: Preprocessing

Image quality is the foundation everything else builds on. A blurry, skewed, or low-contrast image produces poor OCR regardless of how good the recognition engine is.

```typescript
async function preprocessManuscriptImage(
  imagePath: string,
  options: PreprocessOptions = {}
): Promise<PreprocessedImage> {
  const image = await loadImage(imagePath);

  // Step 1: Deskew — correct page rotation
  const deskewAngle = await detectSkewAngle(image);
  const deskewed = Math.abs(deskewAngle) > 0.5
    ? rotateImage(image, -deskewAngle)
    : image;

  // Step 2: Despeckle — remove noise while preserving ink strokes
  const despeckled = await morphologicalDespeckle(deskewed, {
    kernelSize: 2,
    iterations: 1,
  });

  // Step 3: Binarization — convert to black/white with adaptive threshold
  // Adaptive threshold handles uneven lighting across the page
  const binarized = await adaptiveBinarize(despeckled, {
    blockSize: 35,
    c: 10, // offset below mean
  });

  // Step 4: Bleed-through removal — suppress reversed text from other side
  const cleaned = options.hasBleedthrough
    ? await removeBleedthrough(binarized)
    : binarized;

  // Step 5: Resolution normalization — ensure minimum 300 DPI for OCR
  const normalized = image.dpi < 300
    ? await upsample(cleaned, 300 / image.dpi)
    : cleaned;

  const quality = await assessImageQuality(normalized);
  return { image: normalized, quality, dpi: Math.max(image.dpi, 300) };
}
```

Adaptive binarization (Sauvola or Niblack methods) handles uneven illumination across the page — a problem that fixed-threshold binarization fails on because different regions of the page have different background brightness. The block size of 35 pixels is calibrated for manuscript text at 300 DPI; too small and it amplifies noise, too large and it loses the adaptive advantage.

Bleed-through removal uses a background estimation approach: model the reverse-side text as a smooth low-frequency component and subtract it. This is computationally expensive and only applied to pages flagged as having bleed-through during the quality assessment.

## Stage 2: Page Segmentation

After preprocessing, the page layout is analyzed to identify distinct text regions:

```typescript
interface PageRegion {
  id: string;
  type: "main_text" | "footnote" | "marginalia" | "header" | "caption" | "image";
  boundingBox: BoundingBox;
  column: number | null;
  script: "latin" | "greek" | "hebrew" | "mixed";
  detectedLanguage: string;
  readingOrder: number;
}

async function segmentPage(
  image: PreprocessedImage
): Promise<PageRegion[]> {
  // Use Google Cloud Vision for layout detection — it handles
  // complex column layouts better than pure geometric analysis
  const visionResult = await cloudVision.documentTextDetection(image.image);

  const regions = visionResult.pages[0].blocks.map(block => ({
    boundingBox: convertBoundingBox(block.boundingBox),
    rawText: extractBlockText(block),
    confidence: block.confidence,
  }));

  // Classify each region by type
  const classified = await Promise.all(
    regions.map(r => classifyRegion(r, image))
  );

  // Detect script type per region
  const withScript = classified.map(r => ({
    ...r,
    script: detectScript(r.rawText),
  }));

  // Assign reading order (column-aware: top-to-bottom within each column,
  // left-to-right across columns)
  return assignReadingOrder(withScript);
}
```

Reading order is non-trivial for multi-column critical editions. The standard assumption — left-to-right, top-to-bottom — fails for two-column layouts where a footnote at the bottom of column one should be read after the main text in column one, not after the main text of column two. The `assignReadingOrder` function uses a column-first ordering: it groups regions by column before applying top-to-bottom ordering within each column.

Marginalia detection is based on position (narrow strips at the left or right edge of the page) and text density. Marginal references in critical editions are typically right-aligned single references ("Rom. 8.28") separated from the main text.

## Stage 3: Recognition

Each page region gets the recognition configuration appropriate to its script:

```typescript
async function recognizeRegions(
  regions: PageRegion[],
  image: PreprocessedImage
): Promise<RecognizedRegion[]> {
  return Promise.all(regions.map(async region => {
    const croppedImage = cropRegion(image.image, region.boundingBox);

    let text: string;
    let confidence: number;

    switch (region.script) {
      case "greek":
        ({ text, confidence } = await recognizeGreek(croppedImage));
        break;

      case "hebrew":
        ({ text, confidence } = await recognizeHebrew(croppedImage));
        break;

      case "mixed":
        ({ text, confidence } = await recognizeMixed(croppedImage));
        break;

      case "latin":
      default:
        ({ text, confidence } = await recognizeLatin(croppedImage, region));
        break;
    }

    return { ...region, text, confidence };
  }));
}
```

**Latin recognition** uses Tesseract with the appropriate language model. For modern typeset Latin-script text (20th century and later), the default English model works well. For 16th–17th century Latin editions, a specialized model fine-tuned on early modern fonts handles long-s and archaic ligatures.

**Greek recognition** is the hardest problem. Ancient Greek manuscripts use polytonic characters — accents (acute, grave, circumflex), breathings (smooth, rough), iota subscript — that many OCR engines represent poorly or drop entirely. The difference between ἁ and ἀ (rough vs. smooth breathing over alpha) is theologically significant: *ἁμαρτία* (sin) vs. *ἀμαρτία* would be a different word. The pipeline uses Google Cloud Vision for Greek regions, which has substantially better polytonic Greek coverage than Tesseract, supplemented by a post-processing validation step against a Greek lexicon.

**Hebrew recognition** uses a dedicated Hebrew OCR model (trained on BHS and similar sources). The challenge is the vowel pointing system: *niqqud* (vowel marks below and above consonants) must be correctly associated with their consonants. Recognition errors that displace vowel marks produce valid-looking Hebrew that means something different from the original.

```typescript
async function recognizeGreek(image: ImageBuffer): Promise<RecognitionResult> {
  // Primary: Google Cloud Vision with Greek language hint
  const visionResult = await cloudVision.textDetection(image, {
    languageHints: ["el"],
    textDetectionParams: { enableTextDetectionConfidenceScore: true },
  });

  const text = visionResult.textAnnotations[0]?.description ?? "";
  const confidence = computeGreekConfidence(visionResult);

  // Validate Greek characters are well-formed
  const normalized = normalizeGreekDiacritics(text);
  const valid = validateGreekText(normalized);

  return {
    text: normalized,
    confidence: valid ? confidence : confidence * 0.7, // penalize invalid Greek
  };
}
```

---

*Explore more articles in the [AI Engineering series](/categories/ai-engineering).*

---

## Stage 4: Post-Processing

Raw OCR output contains errors. The post-processing stage uses domain knowledge to correct the most common ones.

### Domain Dictionary Correction

The first correction pass checks every word against the domain dictionary and applies corrections for near-misses:

```typescript
async function applyDomainCorrections(
  text: string,
  script: "latin" | "greek" | "hebrew"
): Promise<CorrectedText> {
  const dictionary = await getDomainDictionary(script);
  const words = tokenize(text, script);
  const corrections: WordCorrection[] = [];

  for (const word of words) {
    if (dictionary.has(word.normalized)) continue; // known word, skip

    const candidates = dictionary.findSimilar(word.normalized, {
      maxDistance: 2,
      maxCandidates: 3,
    });

    if (candidates.length > 0 && candidates[0].confidence >= 0.85) {
      corrections.push({
        original: word.text,
        corrected: candidates[0].word,
        confidence: candidates[0].confidence,
        type: "dictionary_correction",
      });
    }
  }

  return applyCorrections(text, corrections);
}
```

The domain dictionary for theological Latin has 28,000 entries covering biblical names, theological terms, ecclesiastical vocabulary, and common Latin words in theological usage. For Greek, it covers the full New Testament lexicon (BDAG entries) plus common patristic vocabulary. Dictionary similarity uses a combination of edit distance and character-level confusion model — an OCR that mistakes "rn" for "m" (a common error) should produce corrections that account for this confusion pattern.

### Archaic Abbreviation Expansion

Medieval and early modern theological texts use abbreviation conventions that OCR engines produce inconsistently:

```typescript
const LATIN_ABBREVIATIONS: Record<string, string> = {
  // Common scribal abbreviations
  "dn̄s":  "dominus",
  "ihs":   "Iesus",
  "xps":   "Christus",
  "scs":   "sanctus",
  "eps":   "episcopus",
  "pb̃r":  "presbyter",
  "q́":    "que",      // q with acute = -que suffix
  "p̄":    "per",
  "p̃":    "pro",
  "q̃":    "quam",

  // Common theological abbreviations
  "v.":    "vide",     // cf. / see
  "cf.":   "confer",
  "ibid.": "ibidem",
  "op.cit.": "opere citato",
  "loc.cit.": "loco citato",
};
```

These are applied after initial recognition because OCR may represent the abbreviation mark (the overline or special character) inconsistently — sometimes capturing it, sometimes dropping it. The correction pass looks for partial matches and applies expansions when the context supports them.

### Line Break Reconstruction

Scanned text has physical line breaks that do not correspond to sentence or word boundaries. Hyphenated words split across lines need reconstruction:

```typescript
function reconstructLineBreaks(text: string): string {
  // Standard hyphenation: "theo-\nlogical" → "theological"
  let result = text.replace(/(\w+)-\s*\n\s*(\w+)/g, "$1$2");

  // Soft hyphen from OCR — treat same as explicit hyphen
  result = result.replace(/(\w+)­\s*\n\s*(\w+)/g, "$1$2");

  // Join wrapped lines that are not natural paragraph breaks
  // (A natural paragraph break has more vertical space than line spacing)
  result = result.replace(/([^.!?:])\n(?!\n)([a-z])/g, "$1 $2");

  return result;
}
```

The last replacement — joining wrapped lines where the first line does not end with terminal punctuation and the second begins with lowercase — is a heuristic that handles the majority of soft wraps. It fails on single-word lines and verse-initial words that happen to be lowercase, but these cases are rare enough that the rule produces a net improvement.

## Stage 5: Validation and Confidence Scoring

After post-processing, each recognized region receives a confidence score:

```typescript
interface RecognitionConfidence {
  ocrConfidence: number;        // raw engine confidence (0–1)
  dictionaryCoverage: number;   // fraction of words in domain dictionary
  scriptValidity: number;       // fraction of characters valid for script
  correctionRate: number;       // fraction of words requiring correction
  overallConfidence: number;    // weighted composite
}

function computeOverallConfidence(scores: RecognitionConfidence): number {
  return (
    scores.ocrConfidence * 0.35 +
    scores.dictionaryCoverage * 0.30 +
    scores.scriptValidity * 0.25 +
    (1 - scores.correctionRate) * 0.10
  );
}
```

Documents below the confidence threshold are routed to review queues:

| Confidence | Action |
|---|---|
| ≥ 0.90 | Auto-accept, index immediately |
| 0.75–0.89 | Accept with low-confidence flag; surface in citations |
| 0.60–0.74 | Queue for human spot-check before indexing |
| < 0.60 | Flag for full human review; do not index automatically |

The low-confidence flag propagates to the knowledge base. When a chunk retrieved from a low-confidence source appears in a response, the citation includes a note: "This text was digitized from a scanned manuscript and may contain transcription errors. Verify against the original source for precision work."

This transparency is important. A user doing casual commentary reading does not need to know about OCR confidence. A researcher checking a specific textual claim in a manuscript source deserves to know that the text they are reading was digitized automatically and may contain errors.

## Handling Greek Manuscripts Specifically

Greek manuscript OCR deserves its own section because it is the hardest problem and the most consequential for the platform.

The New Testament manuscript tradition includes over 5,800 Greek manuscripts — papyri, uncials, minuscules, and lectionaries — spanning 1,800 years of copying history. These vary from clear, professional scribal hands to damaged and barely legible fragments. Even the most legible uncial manuscripts (Codex Sinaiticus, Codex Vaticanus, Codex Alexandrinus) present challenges for standard OCR:

- Scriptio continua (no spaces between words) in the oldest manuscripts
- Nomina sacra (contracted sacred names: ΙΗΣ for Ἰησοῦς, ΧΣ for Χριστός)
- Ligatures where two letters share strokes
- Variant letterforms between scribal hands

The platform does not currently attempt automated OCR of manuscript Greek at the level of primary textual criticism — that work requires specialist paleographic training and careful human review. What the pipeline handles is printed critical editions (NA28, UBS5, BHQ) and scholarly works that contain Greek quotations typeset in modern Unicode-compatible Greek fonts.

For these, the Google Cloud Vision path with polytonic Greek support works well (>90% character accuracy on modern typeset Greek). The remaining errors cluster on ambiguous character pairs: ε/ο confusion, ν/υ confusion, ι/ν/υ in minuscule fonts.

A post-recognition pass validates Greek words against the BDAG lexical database — if a word does not appear in BDAG, it checks the lexicon for similar entries within edit distance 1. This catches the most common character-level errors without requiring character-by-character checking:

```typescript
async function validateGreekWords(
  text: string
): Promise<ValidationResult> {
  const words = tokenizeGreek(text);
  const unknown: string[] = [];
  const corrected: WordCorrection[] = [];

  for (const word of words) {
    const lemma = stripDiacritics(word.text).toLowerCase();
    if (await bdag.hasEntry(lemma)) continue;

    const near = await bdag.findSimilar(lemma, { maxDistance: 1 });
    if (near.length > 0) {
      corrected.push({
        original: word.text,
        suggested: near[0].headword,
        confidence: near[0].similarity,
      });
    } else {
      unknown.push(word.text);
    }
  }

  return {
    wordCount: words.length,
    unknownCount: unknown.length,
    correctionCount: corrected.length,
    unknownWords: unknown,
    corrections: corrected,
  };
}
```

The unknown word list surfaces candidates for dictionary addition — new terms not yet in the lexical validation set. Over time, this feedback loop expands the domain dictionary and improves recognition quality for subsequent documents.

## Integration with the Knowledge Base

Validated OCR output flows into the same ingest pipeline as native digital text: chunking (article 10), embedding, and indexing into Qdrant. The only difference is the provenance metadata:

```typescript
interface OCRChunkMetadata {
  sourceType: "ocr_manuscript";
  originalFile: string;
  pageRange: string;
  ocrConfidence: number;
  recognitionDate: string;
  engineConfig: string;
  humanReviewed: boolean;
  reviewDate: string | null;
}
```

This metadata is carried through to the retrieval layer. Citation rendering uses it to mark OCR-derived passages appropriately and to link to the original scanned page when available.

The manuscript OCR pipeline is slow and expensive relative to processing clean digital text. A 400-page Calvin commentary takes 2–4 hours of compute time, including preprocessing, multi-pass recognition, and post-processing. This is a batch operation run overnight, not a request-time operation. The result — the accumulated contents of theological libraries that existed only in physical form — justifies the investment. The most important scholarship on the texts the platform serves was written before the digital age. Getting it into a form that can be retrieved and reasoned over is what makes the knowledge base worth building.

---

*[← Back to AI Engineering](/categories/ai-engineering)*
