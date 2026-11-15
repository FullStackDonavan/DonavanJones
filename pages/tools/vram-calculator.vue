<script setup lang="ts">
import {
  QUANT_FORMATS,
  fitStatus,
  formatGiB,
  formatParams,
  formatTokens,
  maxContextTokens,
  weightBytes,
} from '~/utils/llmMemory'

const FAQ = [
  {
    q: 'How much VRAM does a 7B or 8B model need?',
    a: 'About 4.5–5 GB for the weights at Q4_K_M, plus the KV cache (1 GB per 8K tokens for Llama 3.1 8B at FP16) and roughly 1 GB of runtime overhead. A 12 GB card runs it comfortably; FP16 weights alone are about 16 GB, which needs a 24 GB card.',
  },
  {
    q: 'Why is a Q4 model bigger than 4 bits per parameter?',
    a: 'GGUF k-quants store a scale (and often a minimum) for every block of weights, and keep sensitive tensors such as embeddings and the output layer at higher precision. Q4_K_M averages about 4.85 bits per weight; Q2_K is about 3.35, not 2.',
  },
  {
    q: 'What happens when a model doesn’t fit in VRAM?',
    a: 'llama.cpp and Ollama can keep some layers on the GPU and run the rest on the CPU (the -ngl / num_gpu setting). It works, but every offloaded layer is limited by system RAM bandwidth, so generation can be several times slower.',
  },
]

useToolSeo({
  title: 'LLM VRAM Calculator: GPU Memory by Model & Quantization',
  description: 'Estimate the GPU memory a local LLM needs: weights at FP16, INT8 and GGUF Q8–Q2 using real bits per weight, KV cache, runtime overhead, and whether it fits on an RTX 3090, 3080, 3060 or your own GPU.',
  path: '/tools/vram-calculator',
  name: 'LLM VRAM Calculator',
  crumb: 'VRAM calculator',
  faq: FAQ,
  image: '/img/cards/tool-vram.jpg',
})

const { state, quant, estimate, selected, recommendedGiB, gpu, estimateFor, perToken, validation, reset } = useLlmCalculator()

const nominalWeights = computed(() => weightBytes(state.value.paramsB, quant.value.nominalBits))

const quantRows = computed(() =>
  QUANT_FORMATS.map((q) => {
    const est = estimateFor(q.effectiveBits)
    const usable = selected.value.usable
    return {
      q,
      est,
      status: fitStatus(est.total, usable),
      maxCtx: maxContextTokens({ usable, weights: est.weights, overhead: est.overhead, perTokenBytes: perToken.value, sequences: state.value.sequences }),
    }
  }),
)

const verdict = computed(() => {
  const s = selected.value
  const where = `${state.value.gpuCount > 1 ? state.value.gpuCount + '× ' : ''}${gpu.value.name}`
  if (s.status === 'fits') return `Fits on ${where} with ${formatGiB(s.remaining)} to spare.`
  if (s.status === 'tight') return `Fits on ${where}, but only ${formatGiB(Math.max(0, s.remaining))} is left. Expect out-of-memory errors with longer prompts.`
  return `Doesn’t fit on ${where}: ${formatGiB(-s.remaining)} over. About ${s.layersOnGpu} of ${state.value.layers} layers would stay on the GPU.`
})
</script>

<template>
  <div class="bg-slate-50 dark:bg-slate-950 min-h-screen">
    <UiPageHeader
      image="/img/heroes/tools.jpg"
      eyebrow="AI tools"
      title="LLM VRAM calculator"
      description="How much GPU memory a model needs at a given precision and context, and whether it fits on your card. Results update as you type; the link in your address bar reproduces them."
      :crumbs="[{ label: 'Home', to: '/' }, { label: 'AI tools', to: '/tools' }, { label: 'VRAM calculator' }]"
    >
      <template #actions>
        <button type="button" class="ds-btn-secondary" @click="reset()">
          <Icon name="mdi:restore" aria-hidden="true" /> Reset
        </button>
      </template>
    </UiPageHeader>
    <CalcToolsNav />

    <div class="ds-container py-6 sm:py-8 grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <div class="space-y-6">
        <CalcModelPanel />
        <CalcContextPanel />
        <CalcGpuPanel />
      </div>

      <div id="results" class="space-y-6 min-w-0 scroll-mt-16 focus:outline-none" aria-live="polite">
        <div v-if="!validation.ok" class="ds-surface border-rose-300 dark:border-rose-500/40 p-4 text-sm text-rose-700 dark:text-rose-300" role="alert">
          Fix the highlighted architecture fields to see results.
        </div>

        <template v-else>
          <!-- Headline -->
          <section class="ds-surface p-5 sm:p-6" aria-labelledby="result-h">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 id="result-h" class="ds-muted font-medium uppercase tracking-wider">Estimated VRAM</h2>
                <p class="mt-1 text-4xl font-semibold tracking-tight tabular-nums text-slate-900 dark:text-white">{{ formatGiB(estimate.total) }}</p>
                <p class="mt-1 ds-muted">
                  {{ formatParams(state.paramsB) }} params · {{ quant.label }} · {{ formatTokens(state.contextTokens) }} context<span v-if="state.sequences > 1"> × {{ state.sequences }} sequences</span>
                </p>
              </div>
              <div class="flex flex-col items-start sm:items-end gap-2">
                <CalcFitBadge :status="selected.status" />
                <p v-if="recommendedGiB" class="text-sm text-slate-600 dark:text-slate-400">
                  Minimum recommended: <span class="font-semibold text-slate-900 dark:text-white tabular-nums">{{ recommendedGiB }} GB</span> GPU
                </p>
                <p v-else class="text-sm text-slate-600 dark:text-slate-400">Needs a multi-GPU server.</p>
              </div>
            </div>

            <div class="mt-6">
              <div class="mb-2 flex items-baseline justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{{ state.gpuCount > 1 ? state.gpuCount + '× ' : '' }}{{ gpu.name }} · {{ formatGiB(selected.usable) }} usable</span>
                <span class="tabular-nums">{{ Number.isFinite(selected.utilization) ? Math.round(selected.utilization * 100) : '—' }}% used</span>
              </div>
              <CalcMemoryBar :est="estimate" :capacity="selected.usable" />
            </div>
            <p class="mt-4 text-sm text-slate-700 dark:text-slate-300">{{ verdict }}</p>
          </section>

          <!-- Breakdown -->
          <section class="grid grid-cols-2 xl:grid-cols-4 gap-3" aria-label="Memory breakdown">
            <div class="ds-surface p-4">
              <p class="ds-muted">Weights (effective)</p>
              <p class="mt-1 text-xl font-semibold tabular-nums text-slate-900 dark:text-white">{{ formatGiB(estimate.weights) }}</p>
              <p class="mt-1 ds-muted">Theoretical at {{ quant.nominalBits }}-bit: {{ formatGiB(nominalWeights) }}</p>
            </div>
            <div class="ds-surface p-4">
              <p class="ds-muted">KV cache</p>
              <p class="mt-1 text-xl font-semibold tabular-nums text-slate-900 dark:text-white">{{ formatGiB(estimate.kv) }}</p>
              <p class="mt-1 ds-muted">{{ state.kvPrecision }}, {{ formatTokens(state.contextTokens * state.sequences) }} tokens</p>
            </div>
            <div class="ds-surface p-4">
              <p class="ds-muted">Overhead</p>
              <p class="mt-1 text-xl font-semibold tabular-nums text-slate-900 dark:text-white">{{ formatGiB(estimate.overhead) }}</p>
              <p class="mt-1 ds-muted">{{ state.overheadPct }}% + {{ state.runtimeGiB }} GB runtime</p>
            </div>
            <div class="ds-surface p-4">
              <p class="ds-muted">{{ selected.remaining >= 0 ? 'Remaining' : 'Over by' }}</p>
              <p class="mt-1 text-xl font-semibold tabular-nums" :class="selected.remaining >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'">
                {{ formatGiB(Math.abs(selected.remaining)) }}
              </p>
              <p class="mt-1 ds-muted">Max context here: {{ formatTokens(selected.maxContext) }}</p>
            </div>
          </section>

          <!-- Quantization comparison -->
          <section class="ds-surface overflow-hidden" aria-labelledby="quant-h">
            <div class="flex flex-wrap items-baseline justify-between gap-2 px-4 sm:px-5 py-4 border-b border-slate-200 dark:border-slate-800">
              <h2 id="quant-h" class="ds-h3">Every precision on this GPU</h2>
              <p class="ds-muted">Same model, context and overhead. Click a row to select it.</p>
            </div>
            <div class="overflow-x-auto">
              <table class="ds-table w-full">
                <caption class="sr-only">Memory by weight precision for {{ formatParams(state.paramsB) }} parameters on {{ gpu.name }}</caption>
                <thead class="bg-slate-50 dark:bg-slate-900/80">
                  <tr>
                    <th scope="col">Precision</th>
                    <th scope="col" class="text-right">Bits/weight</th>
                    <th scope="col" class="text-right">Weights</th>
                    <th scope="col" class="text-right">Total</th>
                    <th scope="col" class="text-right">Max context</th>
                    <th scope="col">On {{ gpu.name.replace(/ \d+GB$/, '') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="r in quantRows"
                    :key="r.q.id"
                    class="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    :class="r.q.id === state.quantId ? 'bg-sky-50/70 dark:bg-sky-500/5' : ''"
                    :aria-selected="r.q.id === state.quantId"
                    @click="state.quantId = r.q.id"
                  >
                    <td>
                      <button type="button" class="font-medium text-slate-900 dark:text-slate-100 ds-focus rounded" @click.stop="state.quantId = r.q.id">{{ r.q.label }}</button>
                    </td>
                    <td class="text-right">{{ r.q.effectiveBits }}</td>
                    <td class="text-right">{{ formatGiB(r.est.weights) }}</td>
                    <td class="text-right font-medium text-slate-900 dark:text-slate-100">{{ formatGiB(r.est.total) }}</td>
                    <td class="text-right">{{ r.maxCtx ? formatTokens(r.maxCtx) : '—' }}</td>
                    <td><CalcFitBadge :status="r.status" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </template>
      </div>
    </div>

    <CalcMobileSummary
      target="results"
      label="VRAM"
      :value="validation.ok ? formatGiB(estimate.total) : '—'"
      :detail="`${state.gpuCount > 1 ? state.gpuCount + '× ' : ''}${gpu.name} · ${quant.label} · ${formatTokens(state.contextTokens)} ctx`"
      :status="validation.ok ? selected.status : undefined"
      :est="validation.ok ? estimate : undefined"
      :capacity="selected.usable"
    />
    <CalcAssumptions focus="vram" />
    <CalcFaq :items="FAQ" />
  </div>
</template>
