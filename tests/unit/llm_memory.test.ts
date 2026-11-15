import { describe, it, expect } from 'vitest'
import {
  GiB,
  QUANT_FORMATS,
  MODEL_PRESETS,
  GPU_PRESETS,
  getQuant,
  weightBytes,
  kvBytesPerToken,
  kvCacheBytes,
  overheadBytes,
  estimateMemory,
  usableBytes,
  fitStatus,
  recommendedVramGiB,
  maxContextTokens,
  maxSequences,
  gpuLayersThatFit,
  decodeCeilingTokPerSec,
  attentionKind,
  validateArch,
  clampNumber,
  formatGiB,
  formatTokens,
  formatParams,
} from '../../utils/llmMemory'

const llama8b = MODEL_PRESETS.find((m) => m.id === 'llama-3.1-8b')!
const rtx3090 = GPU_PRESETS.find((g) => g.id === 'rtx-3090')!
const rtx3060 = GPU_PRESETS.find((g) => g.id === 'rtx-3060-12')!

describe('weightBytes', () => {
  it('FP16 is 2 bytes per parameter', () => {
    expect(weightBytes(7, 16)).toBe(14e9)
  })
  it('uses effective, not nominal, bits for GGUF formats', () => {
    const q4 = getQuant('Q4_K_M')
    expect(q4.nominalBits).toBe(4)
    expect(q4.effectiveBits).toBeGreaterThan(4)
    // 8.03B × 4.85 / 8 = 4.868 GB (decimal) = 4.53 GiB
    expect(weightBytes(8.03, q4.effectiveBits) / GiB).toBeCloseTo(4.534, 2)
  })
  it('Q2_K is well above 2 bits per weight', () => {
    expect(getQuant('Q2_K').effectiveBits).toBeGreaterThan(3)
  })
  it('every format has effective ≥ nominal bits', () => {
    for (const q of QUANT_FORMATS) expect(q.effectiveBits).toBeGreaterThanOrEqual(q.nominalBits)
  })
  it('unknown quant id falls back to Q4_K_M', () => {
    expect(getQuant('nope').id).toBe('Q4_K_M')
  })
})

describe('KV cache', () => {
  it('Llama 3.1 8B (GQA, 8 KV heads) uses 128 KiB per token at FP16', () => {
    // 2 × 32 layers × 8 kv heads × 128 dim × 2 bytes = 131072
    expect(kvBytesPerToken(llama8b, 2)).toBe(131072)
  })
  it('8K context at FP16 is exactly 1 GiB for Llama 3.1 8B', () => {
    expect(kvCacheBytes(llama8b, 2, 8192, 1)).toBe(GiB)
  })
  it('scales linearly with sequences and halves with FP8', () => {
    expect(kvCacheBytes(llama8b, 2, 8192, 4)).toBe(4 * GiB)
    expect(kvCacheBytes(llama8b, 1, 8192, 1)).toBe(0.5 * GiB)
  })
  it('GQA uses heads/kvHeads times less KV than MHA with the same shape', () => {
    const mha = { ...llama8b, kvHeads: llama8b.heads }
    expect(kvBytesPerToken(mha, 2) / kvBytesPerToken(llama8b, 2)).toBe(4)
  })
  it('MQA (1 KV head) is the minimum', () => {
    const mqa = { ...llama8b, kvHeads: 1 }
    expect(kvBytesPerToken(mqa, 2)).toBe(2 * 32 * 1 * 128 * 2)
  })
})

describe('attentionKind', () => {
  it('classifies MHA, GQA and MQA', () => {
    expect(attentionKind(32, 32)).toBe('MHA')
    expect(attentionKind(32, 8)).toBe('GQA')
    expect(attentionKind(32, 1)).toBe('MQA')
  })
})

describe('estimateMemory', () => {
  it('sums weights, KV and overhead', () => {
    const est = estimateMemory({
      paramsB: 8,
      bitsPerWeight: 16,
      arch: llama8b,
      kvBytesPerElem: 2,
      contextTokens: 8192,
      sequences: 1,
      overhead: { overheadPct: 10, runtimeGiB: 0.5 },
    })
    expect(est.weights).toBe(16e9)
    expect(est.kv).toBe(GiB)
    expect(est.overhead).toBe(1.6e9 + 0.5 * GiB)
    expect(est.total).toBe(est.weights + est.kv + est.overhead)
  })
  it('overhead with 0 % and 0 GiB is zero', () => {
    expect(overheadBytes(1e9, { overheadPct: 0, runtimeGiB: 0 })).toBe(0)
  })
})

describe('fit and capacity', () => {
  it('usable memory subtracts the reserve and multiplies by GPU count', () => {
    expect(usableBytes(rtx3090) / GiB).toBe(23.5)
    expect(usableBytes(rtx3090, 2) / GiB).toBe(47)
    expect(usableBytes({ vramGiB: 1, reservedGiB: 2 })).toBe(0)
  })
  it('fitStatus thresholds', () => {
    expect(fitStatus(8 * GiB, 10 * GiB)).toBe('fits')
    expect(fitStatus(9.5 * GiB, 10 * GiB)).toBe('tight')
    expect(fitStatus(10 * GiB, 10 * GiB)).toBe('tight')
    expect(fitStatus(10.1 * GiB, 10 * GiB)).toBe('offload')
    expect(fitStatus(1, 0)).toBe('offload')
  })
  it('recommends the smallest tier with 10 % headroom', () => {
    expect(recommendedVramGiB(7 * GiB)).toBe(8)
    expect(recommendedVramGiB(7.5 * GiB)).toBe(10) // 8.25 needed
    expect(recommendedVramGiB(22 * GiB)).toBe(32) // 24.2 needed
    expect(recommendedVramGiB(500 * GiB)).toBeNull()
  })
  it('max context: Llama 3.1 8B Q4_K_M on a 3090', () => {
    const weights = weightBytes(8.03, 4.85)
    const overhead = overheadBytes(weights, { overheadPct: 10, runtimeGiB: 0.5 })
    const tokens = maxContextTokens({
      usable: usableBytes(rtx3090),
      weights,
      overhead,
      perTokenBytes: kvBytesPerToken(llama8b, 2),
      sequences: 1,
    })
    // (23.5 − 4.534 − 0.453 − 0.5) GiB / 128 KiB ≈ 147.5K tokens
    expect(tokens).toBeGreaterThan(145_000)
    expect(tokens).toBeLessThan(150_000)
  })
  it('max context halves with two sequences and is 0 when weights do not fit', () => {
    const args = { usable: 10 * GiB, weights: 4 * GiB, overhead: 0, perTokenBytes: 131072 }
    const one = maxContextTokens({ ...args, sequences: 1 })
    expect(maxContextTokens({ ...args, sequences: 2 })).toBe(Math.floor(one / 2))
    expect(maxContextTokens({ ...args, weights: 11 * GiB, sequences: 1 })).toBe(0)
    expect(maxContextTokens({ ...args, sequences: 0 })).toBe(0)
  })
  it('max sequences at a fixed context', () => {
    // 6 GiB free / 1 GiB per 8K sequence = 6
    expect(maxSequences({ usable: 10 * GiB, weights: 4 * GiB, overhead: 0, perTokenBytes: 131072, contextTokens: 8192 })).toBe(6)
    expect(maxSequences({ usable: 1 * GiB, weights: 4 * GiB, overhead: 0, perTokenBytes: 131072, contextTokens: 8192 })).toBe(0)
  })
  it('70B FP16 does not fit a 3060 and only a few layers would', () => {
    const est = estimateMemory({
      paramsB: 70.6, bitsPerWeight: 16, arch: { layers: 80, kvHeads: 8, headDim: 128 },
      kvBytesPerElem: 2, contextTokens: 4096, sequences: 1, overhead: { overheadPct: 10, runtimeGiB: 0.5 },
    })
    expect(fitStatus(est.total, usableBytes(rtx3060))).toBe('offload')
    const layers = gpuLayersThatFit({ usable: usableBytes(rtx3060), est, layers: 80 })
    expect(layers).toBeGreaterThan(0)
    expect(layers).toBeLessThan(10)
  })
  it('gpuLayersThatFit caps at the layer count', () => {
    const est = { weights: GiB, kv: 0, overhead: 0, fixedOverhead: 0, total: GiB }
    expect(gpuLayersThatFit({ usable: 100 * GiB, est, layers: 32 })).toBe(32)
    expect(gpuLayersThatFit({ usable: 100 * GiB, est, layers: 0 })).toBe(0)
  })
  it('decode ceiling is bandwidth / weight bytes', () => {
    expect(decodeCeilingTokPerSec(936, 4.68e9)).toBeCloseTo(200, 5)
    expect(decodeCeilingTokPerSec(936, 0)).toBe(0)
  })
})

describe('validation', () => {
  it('accepts every preset', () => {
    for (const m of MODEL_PRESETS) expect(validateArch(m).ok, m.id).toBe(true)
  })
  it('rejects KV heads that do not divide heads', () => {
    const v = validateArch({ heads: 32, kvHeads: 6 })
    expect(v.ok).toBe(false)
    expect(v.errors.kvHeads).toMatch(/multiple/)
  })
  it('rejects KV heads above heads, zero and fractional values', () => {
    expect(validateArch({ heads: 8, kvHeads: 16 }).errors.kvHeads).toBeTruthy()
    expect(validateArch({ layers: 0 }).errors.layers).toBeTruthy()
    expect(validateArch({ layers: 2.5 }).errors.layers).toBeTruthy()
    expect(validateArch({ headDim: -1 }).errors.headDim).toBeTruthy()
    expect(validateArch({ paramsB: 0 }).errors.paramsB).toBeTruthy()
  })
  it('clampNumber handles text, NaN and bounds', () => {
    expect(clampNumber('12', 1, 10, 5)).toBe(10)
    expect(clampNumber('abc', 1, 10, 5)).toBe(5)
    expect(clampNumber(-3, 0, 10, 5)).toBe(0)
    expect(clampNumber(Infinity, 0, 10, 5)).toBe(5)
  })
})

describe('formatting', () => {
  it('formats sizes, tokens and params', () => {
    expect(formatGiB(GiB)).toBe('1.0 GB')
    expect(formatGiB(50 * 1024 ** 2)).toBe('50 MB')
    expect(formatTokens(131072)).toBe('128K')
    expect(formatTokens(512)).toBe('512')
    expect(formatTokens(1024 * 1024 * 1.5)).toBe('1.5M')
    expect(formatParams(0.27)).toBe('270M')
    expect(formatParams(8.03)).toBe('8.03B')
    expect(formatParams(70)).toBe('70B')
  })
})
