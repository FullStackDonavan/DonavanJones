<script setup lang="ts">
import {
  KV_PRECISION_BYTES,
  fitStatus,
  formatGiB,
  formatTokens,
  kvBytesPerToken,
  maxSequences,
} from '~/utils/llmMemory'

const FAQ = [
  {
    q: 'How do I calculate KV cache size?',
    a: 'Multiply 2 (keys and values) × number of layers × number of KV heads × head dimension × bytes per element × context tokens × concurrent sequences. For Llama 3.1 8B at FP16 that is 2 × 32 × 8 × 128 × 2 = 128 KB per token, or 1 GB for 8K tokens.',
  },
  {
    q: 'Why do GQA and MQA models use less KV cache?',
    a: 'Grouped-query attention shares each key/value head across several query heads, so only the KV heads are cached. Llama 3.1 8B has 32 query heads but 8 KV heads, which cuts its KV cache by 4× compared with full multi-head attention. MQA goes to a single KV head.',
  },
  {
    q: 'Does quantizing the KV cache help?',
    a: 'Yes. An FP8 or INT8 KV cache halves its size compared with FP16, and llama.cpp’s q4_0 cache uses about 4.5 bits per element. Quality impact is usually small at 8 bits and more noticeable at 4 bits, especially for long-context retrieval.',
  },
]

useToolSeo({
  title: 'KV Cache Calculator: LLM Context Length Memory (GQA/MQA)',
  description: 'Calculate KV cache memory for any context length, batch size and KV precision. Handles GQA and MQA correctly and shows the longest context and most concurrent sequences your GPU can hold.',
  path: '/tools/kv-cache-calculator',
  name: 'LLM KV Cache Calculator',
  crumb: 'KV cache calculator',
  faq: FAQ,
  image: '/img/cards/tool-kv-cache.jpg',
})

const { state, estimate, selected, gpu, perToken, attention, validation, estimateFor, quant, contextSizes, reset } = useLlmCalculator()

const freeForKv = computed(() => selected.value.usable - estimate.value.weights - estimate.value.overhead)

const contextRows = computed(() => {
  const usable = selected.value.usable
  return contextSizes.map((ctx) => {
    const est = estimateFor(quant.value.effectiveBits, ctx, state.value.sequences)
    return {
      ctx,
      est,
      status: fitStatus(est.total, usable),
      seqs: maxSequences({ usable, weights: est.weights, overhead: est.overhead, perTokenBytes: perToken.value, contextTokens: ctx }),
    }
  })
})
const maxKvInTable = computed(() => Math.max(...contextRows.value.map((r) => r.est.kv), freeForKv.value, 1))

const attentionCompare = computed(() => {
  const s = state.value
  const b = KV_PRECISION_BYTES[s.kvPrecision]
  const tokens = s.contextTokens * s.sequences
  const rows = [
    { kind: 'MHA', kv: s.heads, label: `${s.heads} KV heads (one per query head)` },
    { kind: 'GQA', kv: s.kvHeads === s.heads || s.kvHeads === 1 ? Math.max(1, Math.floor(s.heads / 4)) : s.kvHeads, label: '' },
    { kind: 'MQA', kv: 1, label: '1 shared KV head' },
  ]
  rows[1].label = `${rows[1].kv} KV heads (groups of ${Math.round(s.heads / rows[1].kv)})`
  return rows.map((r) => ({ ...r, bytes: kvBytesPerToken({ layers: s.layers, kvHeads: r.kv, headDim: s.headDim }, b) * tokens, current: r.kind === attention.value }))
})
const maxAttn = computed(() => Math.max(...attentionCompare.value.map((r) => r.bytes), 1))
</script>

<template>
  <div class="bg-slate-50 dark:bg-slate-950 min-h-screen">
    <UiPageHeader
      image="/img/heroes/tools.jpg"
      eyebrow="AI tools"
      title="Context length & KV cache calculator"
      description="Every token in the context window keeps a key and a value per layer in GPU memory. See how much that costs, how far your GPU can stretch the context, and how many requests it can serve at once."
      :crumbs="[{ label: 'Home', to: '/' }, { label: 'AI tools', to: '/tools' }, { label: 'KV cache calculator' }]"
    >
      <template #actions>
        <button type="button" class="ds-btn-secondary" @click="reset()"><Icon name="mdi:restore" aria-hidden="true" /> Reset</button>
      </template>
    </UiPageHeader>
    <CalcToolsNav />

    <div class="ds-container py-6 sm:py-8 grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <div class="space-y-6">
        <CalcContextPanel />
        <CalcModelPanel arch-open />
        <CalcGpuPanel />
      </div>

      <div id="results" class="space-y-6 min-w-0 scroll-mt-16 focus:outline-none" aria-live="polite">
        <div v-if="!validation.ok" class="ds-surface p-4 text-sm text-rose-700 dark:text-rose-300" role="alert">
          Fix the highlighted architecture fields to see results.
        </div>
        <template v-else>
          <section class="grid grid-cols-2 xl:grid-cols-3 gap-3" aria-label="KV cache results">
            <div class="ds-surface p-4 col-span-2 xl:col-span-1">
              <p class="ds-muted">KV cache</p>
              <p class="mt-1 text-3xl font-semibold tabular-nums text-slate-900 dark:text-white">{{ formatGiB(estimate.kv, 2) }}</p>
              <p class="mt-1 ds-muted">{{ formatTokens(state.contextTokens) }} × {{ state.sequences }} seq · {{ (perToken / 1024).toFixed(perToken < 10240 ? 1 : 0) }} KB per token</p>
            </div>
            <div class="ds-surface p-4">
              <p class="ds-muted">Total inference memory</p>
              <p class="mt-1 text-xl font-semibold tabular-nums text-slate-900 dark:text-white">{{ formatGiB(estimate.total) }}</p>
              <p class="mt-1 ds-muted">Weights {{ formatGiB(estimate.weights) }} + overhead {{ formatGiB(estimate.overhead) }}</p>
            </div>
            <div class="ds-surface p-4">
              <p class="ds-muted">Available for KV on {{ gpu.name.replace(/ \d+(\.\d+)?GB$/, '') }}</p>
              <p class="mt-1 text-xl font-semibold tabular-nums" :class="freeForKv > 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'">
                {{ freeForKv > 0 ? formatGiB(freeForKv) : 'None' }}
              </p>
              <p class="mt-1 ds-muted">After weights and overhead</p>
            </div>
            <div class="ds-surface p-4">
              <p class="ds-muted">Max context ({{ state.sequences }} seq)</p>
              <p class="mt-1 text-xl font-semibold tabular-nums text-slate-900 dark:text-white">{{ selected.maxContext ? formatTokens(selected.maxContext) : '—' }}</p>
              <p class="mt-1 ds-muted">{{ selected.maxContext.toLocaleString('en-US') }} tokens</p>
            </div>
            <div class="ds-surface p-4">
              <p class="ds-muted">Max concurrent at {{ formatTokens(state.contextTokens) }}</p>
              <p class="mt-1 text-xl font-semibold tabular-nums text-slate-900 dark:text-white">{{ selected.maxSequences }}</p>
              <p class="mt-1 ds-muted">sequences</p>
            </div>
            <div class="ds-surface p-4 col-span-2 xl:col-span-1 flex flex-col justify-between gap-3">
              <div class="flex items-center justify-between">
                <p class="ds-muted">Current setting</p>
                <CalcFitBadge :status="selected.status" />
              </div>
              <CalcMemoryBar :est="estimate" :capacity="selected.usable" compact :show-legend="false" />
            </div>
          </section>

          <!-- Context capacity -->
          <section class="ds-surface overflow-hidden" aria-labelledby="ctx-h">
            <div class="flex flex-wrap items-baseline justify-between gap-2 px-4 sm:px-5 py-4 border-b border-slate-200 dark:border-slate-800">
              <h2 id="ctx-h" class="ds-h3">Context capacity on {{ state.gpuCount > 1 ? state.gpuCount + '× ' : '' }}{{ gpu.name }}</h2>
              <p class="ds-muted flex items-center gap-1.5">
                <span class="inline-block h-3 w-0.5 bg-emerald-500" aria-hidden="true" /> memory left for KV
              </p>
            </div>
            <div class="overflow-x-auto">
              <table class="ds-table w-full">
                <caption class="sr-only">KV cache and total memory by context length</caption>
                <thead class="bg-slate-50 dark:bg-slate-900/80">
                  <tr>
                    <th scope="col">Context</th>
                    <th scope="col" class="w-1/3 min-w-[140px]">KV cache</th>
                    <th scope="col" class="text-right">Total</th>
                    <th scope="col" class="text-right">Max seqs</th>
                    <th scope="col">Fit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="r in contextRows"
                    :key="r.ctx"
                    class="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    :class="r.ctx === state.contextTokens ? 'bg-sky-50/70 dark:bg-sky-500/5' : ''"
                    @click="state.contextTokens = r.ctx"
                  >
                    <td>
                      <button type="button" class="font-medium text-slate-900 dark:text-slate-100 ds-focus rounded" @click.stop="state.contextTokens = r.ctx">{{ formatTokens(r.ctx) }}</button>
                    </td>
                    <td>
                      <div class="flex items-center gap-2">
                        <div class="relative h-2 flex-1 rounded bg-slate-100 dark:bg-slate-800">
                          <div class="absolute inset-y-0 left-0 rounded bg-violet-500" :style="{ width: (r.est.kv / maxKvInTable) * 100 + '%' }" />
                          <div
                            v-if="freeForKv > 0"
                            class="absolute -inset-y-1 w-0.5 bg-emerald-500"
                            :style="{ left: (freeForKv / maxKvInTable) * 100 + '%' }"
                            aria-hidden="true"
                          />
                        </div>
                        <span class="w-16 text-right">{{ formatGiB(r.est.kv) }}</span>
                      </div>
                    </td>
                    <td class="text-right font-medium text-slate-900 dark:text-slate-100">{{ formatGiB(r.est.total) }}</td>
                    <td class="text-right">{{ r.seqs }}</td>
                    <td><CalcFitBadge :status="r.status" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Attention comparison -->
          <section class="ds-surface p-4 sm:p-5" aria-labelledby="attn-h">
            <h2 id="attn-h" class="ds-h3">Why KV heads matter</h2>
            <p class="mt-1 ds-body">The same {{ state.layers }}-layer, {{ state.heads }}-head shape at {{ formatTokens(state.contextTokens * state.sequences) }} tokens with different attention layouts. This model uses <strong class="text-slate-900 dark:text-slate-100">{{ attention }}</strong>.</p>
            <ul class="mt-4 space-y-3">
              <li v-for="r in attentionCompare" :key="r.kind">
                <div class="flex items-baseline justify-between gap-2 text-sm">
                  <span class="text-slate-900 dark:text-slate-100 font-medium">{{ r.kind }} <span class="font-normal ds-muted">· {{ r.label }}</span></span>
                  <span class="tabular-nums text-slate-700 dark:text-slate-300">{{ formatGiB(r.bytes, 2) }}</span>
                </div>
                <div class="mt-1 h-2 rounded bg-slate-100 dark:bg-slate-800">
                  <div class="h-full rounded" :class="r.current ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-600'" :style="{ width: Math.max(0.5, (r.bytes / maxAttn) * 100) + '%' }" />
                </div>
              </li>
            </ul>
          </section>
        </template>
      </div>
    </div>

    <CalcMobileSummary
      target="results"
      label="KV cache"
      :value="validation.ok ? formatGiB(estimate.kv, 2) : '—'"
      :detail="validation.ok ? `Total ${formatGiB(estimate.total)} · max ${selected.maxContext ? formatTokens(selected.maxContext) : '—'} ctx · ${selected.maxSequences} seqs at ${formatTokens(state.contextTokens)}` : 'Fix the architecture fields'"
      :status="validation.ok ? selected.status : undefined"
      :est="validation.ok ? estimate : undefined"
      :capacity="selected.usable"
    />
    <CalcAssumptions focus="kv" />
    <CalcFaq :items="FAQ" />
  </div>
</template>
