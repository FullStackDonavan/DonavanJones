---
title: "Voice Narration Pipelines"
description: "Voice narration pipelines for AI-driven Bible study."
date: 2026-07-09
lastUpdated: "2026-06-09"
category: "ai-engineering"
tags:
  - ai-engineering
  - voice
  - pipelines
draft: true
slug: voice-narration-pipelines
author: Donavan Jones
---

# Voice Narration Pipelines

Bible study has always had an oral dimension. Scripture was read aloud in synagogues and churches before most believers could read it themselves. Liturgical traditions build entire worship forms around the spoken word. Even in private study, many readers find that hearing a passage changes how they receive it — the rhythm of the language, the pauses, the weight of individual phrases.

Voice narration on this platform serves two distinct use cases. The first is audio Bible reading: generating high-quality narration of scripture passages for listening during commutes, workouts, or any context where reading is not practical. The second is narrated study content: converting AI-generated study responses, commentary summaries, and word studies into audio format for extended listening sessions. Each use case has different requirements and a different pipeline.

*Part of the [AI Engineering series](/categories/ai-engineering).*

## The Core TTS Pipeline

Both use cases share a common text-to-speech foundation. The platform uses ElevenLabs for primary narration, with Amazon Polly as a fallback for lower-priority content and cost management.

The basic pipeline:

```
Text → Preprocessing → SSML Generation → TTS API → 
  Audio Post-processing → Delivery
```

Each stage has non-trivial work to do. Raw theological text fed directly to a TTS engine produces serviceable but often poor audio — mispronounced proper names, wrong stress on Greek transliterations, pauses in the wrong places, a flat affect that does not reflect the literary character of the passage.

## Stage 1: Text Preprocessing

Before any TTS call, the input text is cleaned and normalized:

```typescript
async function preprocessForNarration(
  text: string,
  contentType: "scripture" | "commentary" | "study_response"
): Promise<string> {
  let processed = text;

  // Expand abbreviations common in theological writing
  processed = expandAbbreviations(processed);

  // Normalize verse references for spoken form
  // "Rom. 8:28" → "Romans chapter 8 verse 28"
  processed = expandVerseReferences(processed);

  // Handle citation markers — remove [CITE: ref] before narration
  processed = removeCitationMarkers(processed);

  // Expand special characters
  processed = processed
    .replace(/&/g, "and")
    .replace(/\//g, " or ")
    .replace(/–|—/g, ", ");  // em/en dashes → brief pause

  // Scripture-specific: remove footnote markers
  if (contentType === "scripture") {
    processed = removeFootnoteMarkers(processed);
  }

  return processed;
}

function expandVerseReferences(text: string): string {
  return text
    .replace(/\b(\d?\s*[A-Z][a-z]+)\.?\s+(\d+):(\d+)(?:-(\d+))?\b/g,
      (_, book, ch, vs, endVs) => {
        const bookName = expandBookAbbreviation(book);
        const range = endVs
          ? `chapter ${ch}, verses ${vs} through ${endVs}`
          : `chapter ${ch} verse ${vs}`;
        return `${bookName} ${range}`;
      }
    );
}
```

The abbreviation expansion is extensive for theological text. "v." should expand to "verse," "vv." to "verses," "cf." to "compare," "ibid." to "the same source," "op. cit." should be omitted entirely (it makes no sense spoken). The glossary covers the 60-odd abbreviations that appear regularly in biblical commentary.

## Stage 2: Proper Name Pronunciation

This is the stage that makes or breaks theological audio. TTS engines trained on general web text have poor coverage of biblical names and places. "Nebuchadnezzar" pronounced incorrectly, "Melchizedek" with stress on the wrong syllable, "Gethsemane" mispronounced — these immediately break the listener's engagement.

The platform maintains a pronunciation dictionary that feeds directly into SSML phoneme tags:

```typescript
const pronunciationDictionary: Record<string, string> = {
  // People
  "Melchizedek":    "mel-KIZ-eh-dek",
  "Methuselah":     "meh-THOO-zeh-lah",
  "Nebuchadnezzar": "neb-uh-kud-NEZ-er",
  "Bartholomew":    "bar-THOL-oh-myoo",
  "Bartholomaeus":  "bar-thol-oh-MAY-us",

  // Places
  "Gethsemane":     "geth-SEM-uh-nee",
  "Capernaum":      "kuh-PER-nee-um",
  "Caesarea Philippi": "sez-uh-REE-uh fih-LIP-eye",
  "Thessalonica":   "thes-uh-loh-NYE-kuh",

  // Greek terms (transliterated)
  "agape":          "ah-GAH-pay",
  "logos":          "LOH-gos",
  "pneuma":         "NYOO-mah",
  "parousia":       "pah-ROO-zee-uh",
  "dikaiosyne":     "dik-eye-oh-SOO-nay",
  "propitiation":   "proh-pish-ee-AY-shun",
  "eschaton":       "ES-kuh-ton",

  // Hebrew terms
  "hesed":          "KHE-sed",
  "shalom":         "shah-LOHM",
  "Torah":          "TOH-rah",
  "YHWH":           "the LORD",   // never pronounced; always substituted
};

function applyPronunciationDictionary(text: string): string {
  let result = text;
  for (const [term, pronunciation] of Object.entries(pronunciationDictionary)) {
    const regex = new RegExp(`\\b${escapeRegex(term)}\\b`, "gi");
    result = result.replace(regex,
      `<phoneme alphabet="ipa" ph="${toIPA(pronunciation)}">${term}</phoneme>`
    );
  }
  return result;
}
```

"YHWH" is a special case. The divine name is never pronounced in Jewish tradition; in Christian usage it is conventionally rendered "the LORD." The system substitutes this at preprocessing rather than trying to generate a pronunciation — which matches how it would be read aloud in any liturgical or study setting.

The dictionary has 340 entries covering biblical names, places, Greek and Hebrew terms, and theological vocabulary. Gaps are discovered when users report mispronunciations via the feedback mechanism; new entries are added to the dictionary and the affected audio is regenerated.

## Stage 3: SSML Generation

Plain text input to TTS produces flat, monotone audio. SSML (Speech Synthesis Markup Language) allows precise control over pace, emphasis, pauses, and prosody — essential for theological content where the literary structure of the text is part of its meaning.

```typescript
function generateSSML(
  text: string,
  contentType: "scripture" | "commentary" | "study_response",
  options: NarrationOptions
): string {
  let ssml = `<speak>`;

  if (contentType === "scripture") {
    ssml += generateScriptureSSML(text, options);
  } else {
    ssml += generateProseSSML(text, options);
  }

  ssml += `</speak>`;
  return ssml;
}

function generateScriptureSSML(
  text: string,
  options: NarrationOptions
): string {
  // Scripture gets a measured, slightly slower pace
  // with pauses at verse boundaries and after important phrases
  return `
    <prosody rate="90%" pitch="-2%">
      ${insertScripturePauses(text)}
    </prosody>
  `;
}

function insertScripturePauses(text: string): string {
  return text
    // Pause after verse numbers
    .replace(/\[(\d+)\]/g, '<break time="400ms"/>$1<break time="200ms"/>')
    // Longer pause at period + capital (sentence break)
    .replace(/\.\s+(?=[A-Z])/g, '.<break time="600ms"/> ')
    // Pause at semicolons
    .replace(/;\s+/g, ';<break time="400ms"/> ')
    // Pause at colons (common in scripture)
    .replace(/:\s+/g, ':<break time="300ms"/> ')
    // Emphasis on quoted speech
    .replace(/"([^"]+)"/g, '<emphasis level="moderate">"$1"</emphasis>');
}
```

Scripture narration runs at 90% of normal TTS speed. The measured pace matches how scripture is read in liturgical settings and gives listeners time to absorb individual phrases. Prose commentary runs closer to normal speed — listeners are processing information, not receiving poetry.

Emphasis tags are applied to direct speech (quotation marks) throughout both scripture and commentary. In scripture, this highlights the words of Jesus, prophets, and characters. In commentary, it marks direct quotes from the text being discussed.

---

*Explore more articles in the [AI Engineering series](/categories/ai-engineering).*

---

## Stage 4: TTS API Call and Chunking

ElevenLabs has a character limit per API call (5,000 characters for standard voices). Long texts are chunked before submission:

```typescript
async function generateAudio(
  ssml: string,
  voiceConfig: VoiceConfig
): Promise<Buffer> {
  const chunks = splitSSMLForAPI(ssml, 4500); // leave buffer under limit

  const audioChunks = await Promise.all(
    chunks.map(chunk =>
      elevenLabsClient.textToSpeech({
        text: chunk,
        voice_id: voiceConfig.voiceId,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.85,
          style: voiceConfig.style ?? 0.3,
          use_speaker_boost: true,
        },
      })
    )
  );

  // Concatenate audio buffers with brief silence between chunks
  return concatenateAudioWithSilence(audioChunks, 200); // 200ms silence
}
```

The chunk split must respect SSML structure — splitting inside a `<prosody>` tag would produce malformed XML that the API rejects. The splitter finds split points at sentence boundaries that are also outside any open SSML tags.

The `stability` setting (0.75) and `similarity_boost` (0.85) are tuned for theological narration: high enough consistency that the voice sounds reliably like the same reader across long passages, without the robotic consistency that comes from maxing both settings. The `style` parameter at 0.3 adds slight expressiveness appropriate for engaged reading without veering into dramatization.

## Stage 5: Audio Post-Processing

Generated audio undergoes post-processing before storage:

```typescript
async function postProcessAudio(
  audioBuffer: Buffer,
  contentType: "scripture" | "commentary" | "study_response"
): Promise<ProcessedAudio> {
  // Normalize volume to consistent -16 LUFS
  const normalized = await normalizeAudioLevel(audioBuffer, -16);

  // Light compression for consistent dynamic range
  const compressed = await applyCompression(normalized, {
    threshold: -20,
    ratio: 3,
    attack: 10,
    release: 150,
  });

  // Trim leading/trailing silence
  const trimmed = trimSilence(compressed, { threshold: -50, minDuration: 100 });

  // Generate waveform data for UI visualization
  const waveform = generateWaveformData(trimmed, 200); // 200 data points

  return {
    audio: trimmed,
    duration: getAudioDuration(trimmed),
    waveform,
    format: "mp3",
    bitrate: 128,
  };
}
```

Volume normalization to -16 LUFS ensures consistent playback level across different content — a short verse reading and a 20-minute study guide should both play at the same apparent volume. The compression pass evens out the dynamic range, which helps for mobile listening in variable environments.

Waveform data is generated as a 200-point array of amplitude values, used by the front end to render the audio waveform visualization that lets users scrub to specific points in long audio.

## Delivery and Caching

Generated audio is stored in S3 with a CDN in front. Cache keys are content hashes — the same scripture passage with the same voice configuration produces the same hash and hits the same cached file:

```typescript
function computeAudioCacheKey(
  text: string,
  voiceConfig: VoiceConfig,
  translation: string
): string {
  const content = JSON.stringify({ text, voiceConfig, translation });
  return crypto.createHash("sha256").update(content).digest("hex");
}

async function getOrGenerateAudio(
  text: string,
  voiceConfig: VoiceConfig,
  translation: string
): Promise<string> { // returns CDN URL
  const key = computeAudioCacheKey(text, voiceConfig, translation);
  const cached = await s3.headObject({ Bucket: AUDIO_BUCKET, Key: key })
    .catch(() => null);

  if (cached) {
    return `${CDN_BASE_URL}/${key}.mp3`;
  }

  const audio = await generateAndPostProcess(text, voiceConfig);
  await s3.putObject({
    Bucket: AUDIO_BUCKET,
    Key: `${key}.mp3`,
    Body: audio.audio,
    ContentType: "audio/mpeg",
    CacheControl: "public, max-age=31536000", // 1 year — content is immutable
  });

  return `${CDN_BASE_URL}/${key}.mp3`;
}
```

Scripture verses are pre-generated at ingest time for the most common voice configuration. The 31,000+ verse corpus produces a large audio library, but the request-time experience is instant — the user presses play and the audio is already in the CDN. AI-generated study responses are generated on demand and cached for 30 days.

## Streaming for Long Content

For long-form content (full chapter narrations, extended study guides), audio is streamed rather than delivered as a complete file. This gets the first chunk of audio to the user in under two seconds while the rest is still generating:

```typescript
async function* streamAudioGeneration(
  segments: TextSegment[],
  voiceConfig: VoiceConfig
): AsyncGenerator<Buffer> {
  for (const segment of segments) {
    const processed = await preprocessForNarration(segment.text, segment.type);
    const ssml = generateSSML(processed, segment.type, { streaming: true });
    const audio = await generateAudio(ssml, voiceConfig);
    yield audio;
  }
}
```

The client receives audio segments over a WebSocket connection and plays them sequentially, buffering one segment ahead. This pattern makes the first-byte latency for a 30-minute study guide the same as for a 30-second verse reading — the user is never waiting for the full generation to complete before audio begins.

## Voice Configuration and User Preference

The platform offers four voice configurations:

| Voice | Character | Best for |
|---|---|---|
| Standard Male | Clear, neutral, measured | General use |
| Standard Female | Warm, clear, unhurried | Devotional content |
| Liturgical | Slightly formal, resonant | Scripture reading |
| Study | Conversational, engaged | Commentary and responses |

Users set a default voice in preferences; individual pieces of content can override the default. The Liturgical voice uses different SSML settings — slower pace, longer pauses between verses, slightly more formal prosody — than the Study voice, which reads at conversational speed with less structural pause.

Voice preference is stored in procedural memory and respected across sessions. A user who prefers the Liturgical voice for scripture but the Study voice for commentary does not have to set this repeatedly.

## Quality Monitoring

Audio quality issues that escape the automated pipeline surface through user feedback. The feedback mechanisms:

**Thumbs down on specific audio**: the user can flag individual audio clips as having pronunciation errors, pacing problems, or quality issues. Flagged clips enter a review queue.

**Pronunciation report**: a specific feedback path for pronunciation errors that captures the term, the clip, and optionally the user's description of the correct pronunciation. High-frequency reports on the same term trigger automatic dictionary updates.

**Quality metrics**: the audio generation pipeline emits metrics to the monitoring system: generation latency, API error rate, chunk count per request, post-processing duration. Elevated error rates (ElevenLabs API errors, post-processing failures) trigger alerts.

The combination of user feedback and automated metrics keeps the narration quality at a level where users actually use the feature. Voice narration that mispronounces "Gethsemane" or "propitiation" will be trusted less than audio that gets these right — and trust, once lost, is not easily regained. Getting the preprocessing and pronunciation right is the work that makes the feature usable for the users it is built to serve.

---

*[← Back to AI Engineering](/categories/ai-engineering)*
