/**
 * LLM inference memory model.
 *
 * Pure functions, no Vue/Nuxt imports, so they can be unit tested and reused by
 * every calculator page. All sizes are bytes internally; GiB (1024³) is used
 * for display because that is what GPUs and nvidia-smi report ("24 GB" on an
 * RTX 3090 is 24 GiB).
 *
 * Total inference memory = weights + KV cache + runtime overhead, where
 *   weights        = parameters × bits-per-weight / 8
 *   KV cache       = 2 (K and V) × layers × kvHeads × headDim × bytes/elem × tokens × sequences
 *   runtime        = weights × overhead% (activations / compute buffers) + fixed runtime context
 */

export const GiB = 1024 ** 3

// ── Precision / quantization ────────────────────────────────────────────────

export interface QuantFormat {
  id: string
  label: string
  /** Nominal bits per weight (what the name suggests). */
  nominalBits: number
  /**
   * Effective bits per weight measured on real model files, including block
   * scales/mins and the tensors a format keeps at higher precision. GGUF k-quant
   * figures are llama.cpp's published averages for Llama-architecture models.
   */
  effectiveBits: number
  family: 'float' | 'int' | 'gguf'
  note: string
}

export const QUANT_FORMATS: QuantFormat[] = [
  { id: 'FP32', label: 'FP32', nominalBits: 32, effectiveBits: 32, family: 'float', note: 'Full precision. Training / reference only.' },
  { id: 'FP16', label: 'FP16', nominalBits: 16, effectiveBits: 16, family: 'float', note: 'Half precision; the usual unquantized inference format.' },
  { id: 'BF16', label: 'BF16', nominalBits: 16, effectiveBits: 16, family: 'float', note: 'Same size as FP16, wider exponent range. Most released checkpoints.' },
  { id: 'INT8', label: 'INT8', nominalBits: 8, effectiveBits: 8.0, family: 'int', note: 'Per-channel INT8 (e.g. bitsandbytes LLM.int8, TensorRT). Scales add < 0.1 bit.' },
  { id: 'Q8_0', label: 'Q8 (Q8_0)', nominalBits: 8, effectiveBits: 8.5, family: 'gguf', note: 'GGUF: one FP16 scale per 32 weights → 8.5 bpw.' },
  { id: 'Q6_K', label: 'Q6 (Q6_K)', nominalBits: 6, effectiveBits: 6.56, family: 'gguf', note: 'GGUF k-quant, 6.5625 bpw. Near-lossless.' },
  { id: 'Q5_K_M', label: 'Q5 (Q5_K_M)', nominalBits: 5, effectiveBits: 5.69, family: 'gguf', note: 'GGUF k-quant mix; some tensors kept at Q6_K.' },
  { id: 'Q4_K_M', label: 'Q4 (Q4_K_M)', nominalBits: 4, effectiveBits: 4.85, family: 'gguf', note: 'GGUF k-quant mix; the common default (Ollama, LM Studio).' },
  { id: 'Q3_K_M', label: 'Q3 (Q3_K_M)', nominalBits: 3, effectiveBits: 3.91, family: 'gguf', note: 'GGUF k-quant mix. Noticeable quality loss on small models.' },
  { id: 'Q2_K', label: 'Q2 (Q2_K)', nominalBits: 2, effectiveBits: 3.35, family: 'gguf', note: 'GGUF. Far above 2 bits: attention/output tensors stay at higher precision.' },
]

export function getQuant(id: string): QuantFormat {
  return QUANT_FORMATS.find((q) => q.id === id) ?? QUANT_FORMATS.find((q) => q.id === 'Q4_K_M')!
}

export type KvPrecision = 'FP16' | 'BF16' | 'FP8' | 'INT8' | 'Q4'
export const KV_PRECISION_BYTES: Record<KvPrecision, number> = {
  FP16: 2,
  BF16: 2,
  FP8: 1,
  INT8: 1,
  // llama.cpp q4_0 KV: 4.5 bits per element including scales
  Q4: 4.5 / 8,
}
export const KV_PRECISIONS: KvPrecision[] = ['FP16', 'BF16', 'FP8', 'INT8', 'Q4']

// ── Model architectures ─────────────────────────────────────────────────────

export interface ModelArch {
  id: string
  name: string
  /** Total parameters, in billions. */
  paramsB: number
  layers: number
  heads: number
  kvHeads: number
  headDim: number
  /** Native context window, in tokens. */
  maxContext: number
  /** Caveat shown next to the KV estimate (sliding-window layers, etc.). */
  kvNote?: string
}

// Values from each model's published config.json.
export const MODEL_PRESETS: ModelArch[] = [
  { id: 'gemma-3-270m', name: 'Gemma 3 270M', paramsB: 0.27, layers: 18, heads: 4, kvHeads: 1, headDim: 256, maxContext: 32768, kvNote: 'Gemma 3 uses sliding-window attention on most layers; real KV use is lower at long context.' },
  { id: 'llama-3.2-1b', name: 'Llama 3.2 1B', paramsB: 1.24, layers: 16, heads: 32, kvHeads: 8, headDim: 64, maxContext: 131072 },
  { id: 'qwen2.5-1.5b', name: 'Qwen2.5 1.5B', paramsB: 1.54, layers: 28, heads: 12, kvHeads: 2, headDim: 128, maxContext: 32768 },
  { id: 'qwen2.5-3b', name: 'Qwen2.5 3B', paramsB: 3.09, layers: 36, heads: 16, kvHeads: 2, headDim: 128, maxContext: 32768 },
  { id: 'llama-3.2-3b', name: 'Llama 3.2 3B', paramsB: 3.21, layers: 28, heads: 24, kvHeads: 8, headDim: 128, maxContext: 131072 },
  { id: 'phi-3-mini', name: 'Phi-3 Mini 4K 3.8B', paramsB: 3.82, layers: 32, heads: 32, kvHeads: 32, headDim: 96, maxContext: 4096 },
  { id: 'mistral-7b', name: 'Mistral 7B v0.3', paramsB: 7.25, layers: 32, heads: 32, kvHeads: 8, headDim: 128, maxContext: 32768 },
  { id: 'qwen2.5-7b', name: 'Qwen2.5 7B', paramsB: 7.62, layers: 28, heads: 28, kvHeads: 4, headDim: 128, maxContext: 32768, kvNote: 'Native window is 32K; 128K needs YaRN rope scaling.' },
  { id: 'llama-3.1-8b', name: 'Llama 3.1 8B', paramsB: 8.03, layers: 32, heads: 32, kvHeads: 8, headDim: 128, maxContext: 131072 },
  { id: 'gemma-2-9b', name: 'Gemma 2 9B', paramsB: 9.24, layers: 42, heads: 16, kvHeads: 8, headDim: 256, maxContext: 8192, kvNote: 'Gemma 2 alternates sliding-window (4K) and global layers; real KV use is lower.' },
  { id: 'mistral-nemo-12b', name: 'Mistral Nemo 12B', paramsB: 12.2, layers: 40, heads: 32, kvHeads: 8, headDim: 128, maxContext: 131072 },
  { id: 'qwen2.5-14b', name: 'Qwen2.5 14B', paramsB: 14.7, layers: 48, heads: 40, kvHeads: 8, headDim: 128, maxContext: 32768, kvNote: 'Native window is 32K; 128K needs YaRN rope scaling.' },
  { id: 'qwen2.5-32b', name: 'Qwen2.5 32B', paramsB: 32.8, layers: 64, heads: 40, kvHeads: 8, headDim: 128, maxContext: 32768, kvNote: 'Native window is 32K; 128K needs YaRN rope scaling.' },
  { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', paramsB: 70.6, layers: 80, heads: 64, kvHeads: 8, headDim: 128, maxContext: 131072 },
  { id: 'qwen2.5-72b', name: 'Qwen2.5 72B', paramsB: 72.7, layers: 80, heads: 64, kvHeads: 8, headDim: 128, maxContext: 32768, kvNote: 'Native window is 32K; 128K needs YaRN rope scaling.' },
]

export const PARAM_SIZES_B = [0.27, 1, 3, 7, 8, 9, 14, 32, 70, 72]

export const CONTEXT_SIZES = [1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144]

export type AttentionKind = 'MHA' | 'GQA' | 'MQA'
export function attentionKind(heads: number, kvHeads: number): AttentionKind {
  if (kvHeads === 1) return 'MQA'
  if (kvHeads === heads) return 'MHA'
  return 'GQA'
}

// ── GPUs ────────────────────────────────────────────────────────────────────

export interface GpuProfile {
  id: string
  name: string
  vramGiB: number
  /** Memory bandwidth, GB/s (decimal, as vendors quote it). */
  bandwidthGBs: number
  /** Memory the OS/driver/display typically holds before a model loads. */
  reservedGiB: number
  unified?: boolean
  custom?: boolean
}

export const GPU_PRESETS: GpuProfile[] = [
  { id: 'rtx-3090', name: 'RTX 3090 24GB', vramGiB: 24, bandwidthGBs: 936, reservedGiB: 0.5 },
  { id: 'rtx-3080-12', name: 'RTX 3080 12GB', vramGiB: 12, bandwidthGBs: 912, reservedGiB: 0.5 },
  { id: 'rtx-3060-12', name: 'RTX 3060 12GB', vramGiB: 12, bandwidthGBs: 360, reservedGiB: 0.5 },
  { id: 'rtx-4060ti-16', name: 'RTX 4060 Ti 16GB', vramGiB: 16, bandwidthGBs: 288, reservedGiB: 0.5 },
  { id: 'rtx-4090', name: 'RTX 4090 24GB', vramGiB: 24, bandwidthGBs: 1008, reservedGiB: 0.5 },
  { id: 'rtx-5090', name: 'RTX 5090 32GB', vramGiB: 32, bandwidthGBs: 1792, reservedGiB: 0.5 },
  // Unified memory shared with the OS; ~1.5 GiB is gone before a model loads (headless).
  { id: 'jetson-orin-nano-8', name: 'Jetson Orin Nano Super 8GB', vramGiB: 7.4, bandwidthGBs: 102, reservedGiB: 1.5, unified: true },
]

// Common VRAM tiers used for the "minimum recommended GPU" suggestion.
export const VRAM_TIERS_GIB = [4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 141, 192]

// ── Core formulas ───────────────────────────────────────────────────────────

/** Weight memory in bytes. */
export function weightBytes(paramsB: number, bitsPerWeight: number): number {
  return paramsB * 1e9 * bitsPerWeight / 8
}

/** KV cache bytes for one token of one sequence (all layers, K and V). */
export function kvBytesPerToken(a: Pick<ModelArch, 'layers' | 'kvHeads' | 'headDim'>, kvBytesPerElem: number): number {
  return 2 * a.layers * a.kvHeads * a.headDim * kvBytesPerElem
}

/** KV cache bytes for `tokens` of context across `sequences` concurrent sequences. */
export function kvCacheBytes(
  a: Pick<ModelArch, 'layers' | 'kvHeads' | 'headDim'>,
  kvBytesPerElem: number,
  tokens: number,
  sequences = 1,
): number {
  return kvBytesPerToken(a, kvBytesPerElem) * tokens * sequences
}

export interface OverheadOptions {
  /** Activations / compute buffers as a % of weight memory. */
  overheadPct: number
  /** Fixed runtime cost: CUDA context, cuBLAS workspace, allocator slack (GiB). */
  runtimeGiB: number
}

export const DEFAULT_OVERHEAD: OverheadOptions = { overheadPct: 10, runtimeGiB: 0.5 }

export function overheadBytes(weights: number, o: OverheadOptions): number {
  return weights * (o.overheadPct / 100) + o.runtimeGiB * GiB
}

export interface MemoryEstimate {
  weights: number
  kv: number
  overhead: number
  /** The fixed part of `overhead` (runtime context), which stays on the GPU. */
  fixedOverhead: number
  total: number
}

export function estimateMemory(input: {
  paramsB: number
  bitsPerWeight: number
  arch: Pick<ModelArch, 'layers' | 'kvHeads' | 'headDim'>
  kvBytesPerElem: number
  contextTokens: number
  sequences: number
  overhead: OverheadOptions
}): MemoryEstimate {
  const weights = weightBytes(input.paramsB, input.bitsPerWeight)
  const kv = kvCacheBytes(input.arch, input.kvBytesPerElem, input.contextTokens, input.sequences)
  const overhead = overheadBytes(weights, input.overhead)
  const fixedOverhead = input.overhead.runtimeGiB * GiB
  return { weights, kv, overhead, fixedOverhead, total: weights + kv + overhead }
}

export function usableBytes(gpu: Pick<GpuProfile, 'vramGiB' | 'reservedGiB'>, count = 1): number {
  return Math.max(0, (gpu.vramGiB - gpu.reservedGiB) * count) * GiB
}

export type FitStatus = 'fits' | 'tight' | 'offload'

/** fits: ≤ 90 % of usable memory; tight: 90–100 %; offload: needs CPU offload. */
export function fitStatus(totalBytes: number, usable: number): FitStatus {
  if (usable <= 0 || totalBytes > usable) return 'offload'
  if (totalBytes > usable * 0.9) return 'tight'
  return 'fits'
}

/** Smallest common VRAM tier that holds `totalBytes` with 10 % headroom. */
export function recommendedVramGiB(totalBytes: number): number | null {
  const need = (totalBytes * 1.1) / GiB
  return VRAM_TIERS_GIB.find((t) => t >= need) ?? null
}

/** Longest context (tokens, per sequence) that fits beside the weights + overhead. */
export function maxContextTokens(input: {
  usable: number
  weights: number
  overhead: number
  perTokenBytes: number
  sequences: number
}): number {
  const free = input.usable - input.weights - input.overhead
  if (free <= 0 || input.perTokenBytes <= 0 || input.sequences <= 0) return 0
  return Math.floor(free / (input.perTokenBytes * input.sequences))
}

/** How many sequences of `contextTokens` fit beside the weights + overhead. */
export function maxSequences(input: {
  usable: number
  weights: number
  overhead: number
  perTokenBytes: number
  contextTokens: number
}): number {
  const free = input.usable - input.weights - input.overhead
  if (free <= 0 || input.perTokenBytes <= 0 || input.contextTokens <= 0) return 0
  return Math.floor(free / (input.perTokenBytes * input.contextTokens))
}

/**
 * When a model doesn't fit: roughly how many of its layers can stay on the GPU
 * (llama.cpp `-ngl`). Assumes weights, KV and compute buffers are spread evenly
 * across layers; only the fixed runtime context stays on the GPU regardless.
 */
export function gpuLayersThatFit(input: { usable: number; est: MemoryEstimate; layers: number }): number {
  const { usable, est, layers } = input
  if (layers <= 0) return 0
  const perLayer = (est.weights + est.kv + est.overhead - est.fixedOverhead) / layers
  const room = usable - est.fixedOverhead
  if (room <= 0 || perLayer <= 0) return 0
  return Math.min(layers, Math.floor(room / perLayer))
}

/**
 * Upper bound for single-stream decode speed: every generated token reads all
 * weights once, so tokens/s ≤ bandwidth / weight bytes. Real numbers land at
 * roughly 50–80 % of this.
 */
export function decodeCeilingTokPerSec(bandwidthGBs: number, weights: number): number {
  if (weights <= 0) return 0
  return (bandwidthGBs * 1e9) / weights
}

// ── Validation & formatting ─────────────────────────────────────────────────

export interface ArchValidation {
  ok: boolean
  errors: Partial<Record<'layers' | 'heads' | 'kvHeads' | 'headDim' | 'paramsB', string>>
}

export function validateArch(a: Partial<ModelArch>): ArchValidation {
  const errors: ArchValidation['errors'] = {}
  const posInt = (v: unknown) => Number.isInteger(v) && (v as number) > 0
  if (a.paramsB !== undefined && !(typeof a.paramsB === 'number' && a.paramsB > 0 && a.paramsB <= 2000)) errors.paramsB = 'Enter 0.01–2000 billion parameters.'
  if (a.layers !== undefined && !(posInt(a.layers) && a.layers! <= 512)) errors.layers = 'Layers must be a whole number from 1 to 512.'
  if (a.heads !== undefined && !(posInt(a.heads) && a.heads! <= 512)) errors.heads = 'Heads must be a whole number from 1 to 512.'
  if (a.kvHeads !== undefined && !posInt(a.kvHeads)) errors.kvHeads = 'KV heads must be a whole number ≥ 1.'
  else if (a.kvHeads !== undefined && a.heads !== undefined && posInt(a.heads)) {
    if (a.kvHeads! > a.heads!) errors.kvHeads = 'KV heads can’t exceed attention heads.'
    else if (a.heads! % a.kvHeads! !== 0) errors.kvHeads = 'Attention heads must be a multiple of KV heads.'
  }
  if (a.headDim !== undefined && !(posInt(a.headDim) && a.headDim! <= 1024)) errors.headDim = 'Head dimension must be a whole number from 1 to 1024.'
  return { ok: Object.keys(errors).length === 0, errors }
}

/** Clamp a user-entered number into [min, max]; NaN falls back to `fallback`. */
export function clampNumber(v: unknown, min: number, max: number, fallback: number): number {
  const n = typeof v === 'number' ? v : parseFloat(String(v))
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

export function formatGiB(bytes: number, digits = 1): string {
  const g = bytes / GiB
  if (g > 0 && g < 0.1) return `${(bytes / 1024 ** 2).toFixed(0)} MB`
  return `${g.toFixed(digits)} GB`
}

export function formatTokens(n: number): string {
  if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)}M`
  if (n >= 1024) return `${Math.floor(n / 1024)}K`
  return String(n)
}

export function formatParams(b: number): string {
  return b < 1 ? `${Math.round(b * 1000)}M` : `${+b.toFixed(2)}B`
}
