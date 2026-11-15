import {
  CONTEXT_SIZES,
  DEFAULT_OVERHEAD,
  GPU_PRESETS,
  KV_PRECISIONS,
  KV_PRECISION_BYTES,
  MODEL_PRESETS,
  QUANT_FORMATS,
  attentionKind,
  clampNumber,
  estimateMemory,
  fitStatus,
  getQuant,
  gpuLayersThatFit,
  kvBytesPerToken,
  maxContextTokens,
  maxSequences,
  recommendedVramGiB,
  usableBytes,
  validateArch,
  type GpuProfile,
  type KvPrecision,
} from '~/utils/llmMemory'

export interface LlmCalcState {
  modelId: string // preset id or 'custom'
  paramsB: number
  layers: number
  heads: number
  kvHeads: number
  headDim: number
  quantId: string
  overheadPct: number
  runtimeGiB: number
  kvPrecision: KvPrecision
  contextTokens: number
  sequences: number
  gpuId: string
  gpuCount: number
  compareIds: string[]
  customGpus: GpuProfile[]
}

const DEFAULT_MODEL = MODEL_PRESETS.find((m) => m.id === 'llama-3.1-8b')!

function defaults(): LlmCalcState {
  return {
    modelId: DEFAULT_MODEL.id,
    paramsB: DEFAULT_MODEL.paramsB,
    layers: DEFAULT_MODEL.layers,
    heads: DEFAULT_MODEL.heads,
    kvHeads: DEFAULT_MODEL.kvHeads,
    headDim: DEFAULT_MODEL.headDim,
    quantId: 'Q4_K_M',
    overheadPct: DEFAULT_OVERHEAD.overheadPct,
    runtimeGiB: DEFAULT_OVERHEAD.runtimeGiB,
    kvPrecision: 'FP16',
    contextTokens: 8192,
    sequences: 1,
    gpuId: 'rtx-3090',
    gpuCount: 1,
    compareIds: ['rtx-3090', 'rtx-3080-12', 'rtx-3060-12'],
    customGpus: [],
  }
}

/**
 * Comparison entries are "gpuId" or "gpuId:count" (e.g. "rtx-3090:2").
 * Only preset GPUs go in the URL; custom ones live in localStorage.
 */
export function parseCompareEntry(entry: string): { id: string; count: number } {
  const [id, n] = entry.split(':')
  const count = Math.round(clampNumber(n ?? 1, 1, 8, 1))
  return { id, count }
}
function isPresetEntry(entry: string) {
  const { id } = parseCompareEntry(entry)
  return GPU_PRESETS.some((g) => g.id === id)
}

const CUSTOM_GPU_KEY = 'dj-llm-custom-gpus'

/** Query-string keys, short so shared links stay readable. */
const Q = {
  modelId: 'm', paramsB: 'p', layers: 'L', heads: 'H', kvHeads: 'KV', headDim: 'D',
  quantId: 'q', overheadPct: 'oh', runtimeGiB: 'rt', kvPrecision: 'kv',
  contextTokens: 'ctx', sequences: 'n', gpuId: 'gpu', gpuCount: 'gc', compareIds: 'cmp',
} as const

export function useLlmCalculator() {
  const state = useState<LlmCalcState>('llm-calc', defaults)
  const route = useRoute()
  const router = useRouter()

  // ── Read shared link (works during SSR, so the first paint is already right)
  const hydrated = useState('llm-calc-hydrated-' + route.path, () => false)
  if (!hydrated.value) {
    applyQuery(route.query as Record<string, string>)
    hydrated.value = true
  }

  function applyQuery(q: Record<string, string>) {
    const s = state.value
    if (q[Q.modelId]) {
      const preset = MODEL_PRESETS.find((m) => m.id === q[Q.modelId])
      if (preset) selectModel(preset.id)
      else if (q[Q.modelId] === 'custom') s.modelId = 'custom'
    }
    if (s.modelId === 'custom') {
      if (q[Q.paramsB]) s.paramsB = clampNumber(q[Q.paramsB], 0.01, 2000, s.paramsB)
      if (q[Q.layers]) s.layers = Math.round(clampNumber(q[Q.layers], 1, 512, s.layers))
      if (q[Q.heads]) s.heads = Math.round(clampNumber(q[Q.heads], 1, 512, s.heads))
      if (q[Q.kvHeads]) s.kvHeads = Math.round(clampNumber(q[Q.kvHeads], 1, 512, s.kvHeads))
      if (q[Q.headDim]) s.headDim = Math.round(clampNumber(q[Q.headDim], 1, 1024, s.headDim))
    }
    if (q[Q.quantId] && QUANT_FORMATS.some((f) => f.id === q[Q.quantId])) s.quantId = q[Q.quantId]
    if (q[Q.overheadPct]) s.overheadPct = clampNumber(q[Q.overheadPct], 0, 100, s.overheadPct)
    if (q[Q.runtimeGiB]) s.runtimeGiB = clampNumber(q[Q.runtimeGiB], 0, 8, s.runtimeGiB)
    if (q[Q.kvPrecision] && (KV_PRECISIONS as string[]).includes(q[Q.kvPrecision])) s.kvPrecision = q[Q.kvPrecision] as KvPrecision
    if (q[Q.contextTokens]) s.contextTokens = Math.round(clampNumber(q[Q.contextTokens], 128, 2_097_152, s.contextTokens))
    if (q[Q.sequences]) s.sequences = Math.round(clampNumber(q[Q.sequences], 1, 256, s.sequences))
    if (q[Q.gpuId] && GPU_PRESETS.some((g) => g.id === q[Q.gpuId])) s.gpuId = q[Q.gpuId]
    if (q[Q.gpuCount]) s.gpuCount = Math.round(clampNumber(q[Q.gpuCount], 1, 8, s.gpuCount))
    if (q[Q.compareIds]) {
      const ids = String(q[Q.compareIds]).split(',').filter(isPresetEntry)
      if (ids.length) s.compareIds = ids.slice(0, 6)
    }
  }

  function toQuery(): Record<string, string> {
    const s = state.value
    const d = defaults()
    const out: Record<string, string> = {}
    const put = (k: keyof typeof Q, v: unknown, dv: unknown) => {
      const str = Array.isArray(v) ? v.join(',') : String(v)
      const dstr = Array.isArray(dv) ? dv.join(',') : String(dv)
      if (str !== dstr) out[Q[k]] = str
    }
    put('modelId', s.modelId, d.modelId)
    if (s.modelId === 'custom') {
      out[Q.paramsB] = String(s.paramsB)
      out[Q.layers] = String(s.layers)
      out[Q.heads] = String(s.heads)
      out[Q.kvHeads] = String(s.kvHeads)
      out[Q.headDim] = String(s.headDim)
    }
    put('quantId', s.quantId, d.quantId)
    put('overheadPct', s.overheadPct, d.overheadPct)
    put('runtimeGiB', s.runtimeGiB, d.runtimeGiB)
    put('kvPrecision', s.kvPrecision, d.kvPrecision)
    put('contextTokens', s.contextTokens, d.contextTokens)
    put('sequences', s.sequences, d.sequences)
    if (GPU_PRESETS.some((g) => g.id === s.gpuId)) put('gpuId', s.gpuId, d.gpuId)
    put('gpuCount', s.gpuCount, d.gpuCount)
    put('compareIds', s.compareIds.filter(isPresetEntry), d.compareIds)
    return out
  }

  // ── Write inputs back to the URL (client only, debounced, no history spam)
  if (import.meta.client) {
    let t: ReturnType<typeof setTimeout> | undefined
    watch(
      () => JSON.stringify(toQuery()),
      () => {
        clearTimeout(t)
        t = setTimeout(() => {
          router.replace({ query: toQuery(), hash: route.hash }).catch(() => {})
        }, 250)
      },
    )
    onMounted(() => {
      try {
        const raw = localStorage.getItem(CUSTOM_GPU_KEY)
        if (raw && !state.value.customGpus.length) {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) {
            state.value.customGpus = parsed
              .filter((g) => g && typeof g.name === 'string' && typeof g.vramGiB === 'number')
              .slice(0, 8)
          }
        }
      } catch { /* storage unavailable: custom GPUs just won't persist */ }
    })
    watch(
      () => state.value.customGpus,
      (v) => { try { localStorage.setItem(CUSTOM_GPU_KEY, JSON.stringify(v)) } catch { /* ignore */ } },
      { deep: true },
    )
  }

  // ── Actions
  function selectModel(id: string) {
    const s = state.value
    s.modelId = id
    const preset = MODEL_PRESETS.find((m) => m.id === id)
    if (!preset) return
    s.paramsB = preset.paramsB
    s.layers = preset.layers
    s.heads = preset.heads
    s.kvHeads = preset.kvHeads
    s.headDim = preset.headDim
  }

  /** Editing any architecture field turns the model into "custom". */
  function editArch<K extends 'paramsB' | 'layers' | 'heads' | 'kvHeads' | 'headDim'>(key: K, value: number) {
    state.value[key] = value
    if (state.value.modelId !== 'custom') {
      const preset = MODEL_PRESETS.find((m) => m.id === state.value.modelId)
      if (preset && preset[key] !== value) state.value.modelId = 'custom'
    }
  }

  function addCustomGpu(g: { name: string; vramGiB: number; bandwidthGBs: number; reservedGiB: number }) {
    const id = 'custom-' + Date.now().toString(36)
    state.value.customGpus.push({ id, custom: true, ...g })
    if (state.value.compareIds.length < 6) state.value.compareIds.push(id)
    return id
  }

  function removeCustomGpu(id: string) {
    state.value.customGpus = state.value.customGpus.filter((g) => g.id !== id)
    state.value.compareIds = state.value.compareIds.filter((x) => parseCompareEntry(x).id !== id)
    if (state.value.gpuId === id) state.value.gpuId = 'rtx-3090'
  }

  function reset() {
    const custom = state.value.customGpus
    state.value = { ...defaults(), customGpus: custom }
  }

  // ── Derived values
  const allGpus = computed<GpuProfile[]>(() => [...GPU_PRESETS, ...state.value.customGpus])
  const gpu = computed(() => allGpus.value.find((g) => g.id === state.value.gpuId) ?? GPU_PRESETS[0])
  const quant = computed(() => getQuant(state.value.quantId))
  const preset = computed(() => MODEL_PRESETS.find((m) => m.id === state.value.modelId))
  const validation = computed(() => validateArch(state.value))
  const kvBytesPerElem = computed(() => KV_PRECISION_BYTES[state.value.kvPrecision])
  const attention = computed(() => attentionKind(state.value.heads, state.value.kvHeads))
  const overhead = computed(() => ({ overheadPct: state.value.overheadPct, runtimeGiB: state.value.runtimeGiB }))

  const perToken = computed(() => (validation.value.ok ? kvBytesPerToken(state.value, kvBytesPerElem.value) : 0))

  function estimateFor(quantBits: number, contextTokens = state.value.contextTokens, sequences = state.value.sequences) {
    return estimateMemory({
      paramsB: state.value.paramsB,
      bitsPerWeight: quantBits,
      arch: state.value,
      kvBytesPerElem: kvBytesPerElem.value,
      contextTokens,
      sequences,
      overhead: overhead.value,
    })
  }

  const estimate = computed(() => estimateFor(quant.value.effectiveBits))

  /** Everything a results panel needs for one GPU configuration. */
  function analyzeGpu(g: GpuProfile, count = 1) {
    const est = estimate.value
    const usable = usableBytes(g, count)
    const total = g.vramGiB * count * 1024 ** 3
    return {
      gpu: g,
      count,
      usable,
      total,
      status: fitStatus(est.total, usable),
      remaining: usable - est.total,
      utilization: usable > 0 ? est.total / usable : Infinity,
      maxContext: maxContextTokens({ usable, weights: est.weights, overhead: est.overhead, perTokenBytes: perToken.value, sequences: state.value.sequences }),
      maxSequences: maxSequences({ usable, weights: est.weights, overhead: est.overhead, perTokenBytes: perToken.value, contextTokens: state.value.contextTokens }),
      layersOnGpu: gpuLayersThatFit({ usable, est, layers: state.value.layers }),
    }
  }

  const selected = computed(() => analyzeGpu(gpu.value, state.value.gpuCount))
  const recommendedGiB = computed(() => recommendedVramGiB(estimate.value.total))

  return {
    state,
    allGpus,
    gpu,
    quant,
    preset,
    validation,
    attention,
    perToken,
    estimate,
    estimateFor,
    analyzeGpu,
    selected,
    recommendedGiB,
    selectModel,
    editArch,
    addCustomGpu,
    removeCustomGpu,
    reset,
    contextSizes: CONTEXT_SIZES,
  }
}
