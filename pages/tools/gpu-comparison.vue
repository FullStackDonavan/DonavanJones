<script setup lang="ts">
import { decodeCeilingTokPerSec, formatGiB, formatParams, formatTokens } from '~/utils/llmMemory'

const FAQ = [
  {
    q: 'Is an RTX 3090 or an RTX 3060 12GB better for local LLMs?',
    a: 'The 3090 has twice the memory (24 GB vs 12 GB) and about 2.6× the memory bandwidth (936 vs 360 GB/s). It fits 32B-class models at Q4 and generates tokens much faster. A 3060 12GB is a cost-effective card for 7B–14B models at Q4.',
  },
  {
    q: 'Does memory bandwidth matter more than compute for LLM inference?',
    a: 'For single-user generation, usually yes. Each new token reads every weight once, so tokens per second are capped near memory bandwidth ÷ model size. Compute matters more for prompt processing and for serving many requests at once.',
  },
  {
    q: 'Can I combine two GPUs to run a bigger model?',
    a: 'Yes. llama.cpp, Ollama, vLLM and ExLlamaV2 can split a model across cards, so two 24 GB GPUs hold roughly a 48 GB model. Each card keeps its own runtime overhead, and splitting adds some communication cost.',
  },
]

useToolSeo({
  title: 'GPU Comparison for Local LLMs: RTX 3090 vs 3080 vs 3060',
  description: 'Compare GPUs side by side for running a local LLM: VRAM fit, memory utilization, headroom, maximum context and a bandwidth-based tokens-per-second ceiling. Add custom GPU profiles and multi-GPU setups.',
  path: '/tools/gpu-comparison',
  name: 'LLM GPU Comparison',
  crumb: 'GPU comparison',
  faq: FAQ,
  image: '/img/cards/tool-gpu-comparison.jpg',
})

const { state, allGpus, estimate, analyzeGpu, quant, preset, validation, addCustomGpu, removeCustomGpu, reset } = useLlmCalculator()

const MAX_COMPARE = 6

const configs = computed(() =>
  state.value.compareIds
    .map((entry) => {
      const { id, count } = parseCompareEntry(entry)
      const g = allGpus.value.find((x) => x.id === id)
      if (!g) return null
      // Layer split (the llama.cpp / Ollama default) runs cards one after
      // another, so per-token bandwidth is one card's, not the sum.
      return { entry, ...analyzeGpu(g, count), ceiling: decodeCeilingTokPerSec(g.bandwidthGBs, estimate.value.weights) }
    })
    .filter((x): x is NonNullable<typeof x> => !!x),
)

/** Smallest total VRAM among configurations that fit; ties broken by bandwidth. */
const recommended = computed(() => {
  const fitting = configs.value.filter((c) => c.status === 'fits')
  if (!fitting.length) return null
  return [...fitting].sort((a, b) => a.total - b.total || b.gpu.bandwidthGBs - a.gpu.bandwidthGBs)[0].entry
})

const bestConfig = computed(() => configs.value.find((c) => c.entry === recommended.value))

const maxCtxScale = computed(() => Math.max(...configs.value.map((c) => c.maxContext), state.value.contextTokens, 1))

function isSelected(id: string) {
  return state.value.compareIds.some((e) => parseCompareEntry(e).id === id)
}
function toggle(id: string) {
  if (isSelected(id)) {
    if (state.value.compareIds.length > 1) state.value.compareIds = state.value.compareIds.filter((e) => parseCompareEntry(e).id !== id)
  } else if (state.value.compareIds.length < MAX_COMPARE) {
    state.value.compareIds = [...state.value.compareIds, id]
  }
}
function setCount(entry: string, count: number) {
  const { id } = parseCompareEntry(entry)
  state.value.compareIds = state.value.compareIds.map((e) => (e === entry ? (count > 1 ? `${id}:${count}` : id) : e))
}

// ── Custom GPU form
const form = reactive({ name: '', vramGiB: 16, bandwidthGBs: 500, reservedGiB: 0.5 })
const formError = ref('')
function submitCustom() {
  const name = form.name.trim()
  if (!name) { formError.value = 'Give the GPU a name.'; return }
  if (name.length > 40) { formError.value = 'Keep the name under 40 characters.'; return }
  if (state.value.customGpus.length >= 8) { formError.value = 'Up to 8 custom GPUs. Remove one first.'; return }
  formError.value = ''
  addCustomGpu({ name, vramGiB: form.vramGiB, bandwidthGBs: form.bandwidthGBs, reservedGiB: form.reservedGiB })
  form.name = ''
}
const countOptions = [1, 2, 4].map((n) => ({ value: n, label: `×${n}` }))
</script>

<template>
  <div class="bg-slate-50 dark:bg-slate-950 min-h-screen">
    <UiPageHeader
      image="/img/heroes/tools.jpg"
      eyebrow="AI tools"
      title="GPU comparison for local LLMs"
      description="Pick up to six GPU setups and see which run your model entirely in VRAM, how much headroom each leaves, how much context it allows, and the bandwidth ceiling on generation speed."
      :crumbs="[{ label: 'Home', to: '/' }, { label: 'AI tools', to: '/tools' }, { label: 'GPU comparison' }]"
    >
      <template #actions>
        <button type="button" class="ds-btn-secondary" @click="reset()"><Icon name="mdi:restore" aria-hidden="true" /> Reset</button>
      </template>
    </UiPageHeader>
    <CalcToolsNav />

    <div class="ds-container py-6 sm:py-8 grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <div class="space-y-6">
        <CalcModelPanel />
        <CalcContextPanel />

        <!-- GPU picker -->
        <section class="ds-surface p-4 sm:p-5 space-y-4" aria-labelledby="pick-h">
          <div class="flex items-baseline justify-between">
            <h2 id="pick-h" class="ds-h3">GPUs to compare</h2>
            <span class="ds-muted tabular-nums">{{ state.compareIds.length }}/{{ MAX_COMPARE }}</span>
          </div>
          <ul class="space-y-1.5">
            <li v-for="g in allGpus" :key="g.id" class="flex items-center gap-2">
              <label class="flex flex-1 cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-sky-600 focus:ring-sky-500 dark:bg-slate-900"
                  :checked="isSelected(g.id)"
                  :disabled="!isSelected(g.id) && state.compareIds.length >= MAX_COMPARE"
                  @change="toggle(g.id)"
                />
                <span class="flex-1 text-sm text-slate-800 dark:text-slate-200">{{ g.name }}</span>
                <span class="ds-muted tabular-nums">{{ g.bandwidthGBs }} GB/s</span>
              </label>
              <button
                v-if="g.custom"
                type="button"
                class="ds-btn-ghost h-7 px-2"
                :aria-label="`Remove ${g.name}`"
                @click="removeCustomGpu(g.id)"
              ><Icon name="mdi:close" aria-hidden="true" /></button>
            </li>
          </ul>

          <form class="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3" @submit.prevent="submitCustom">
            <h3 class="text-sm font-medium text-slate-800 dark:text-slate-200">Add a custom GPU</h3>
            <div>
              <label for="custom-name" class="ds-label">Name</label>
              <input id="custom-name" v-model="form.name" class="ds-input" placeholder="e.g. RTX A4000 16GB" maxlength="40" :aria-invalid="formError ? 'true' : 'false'" />
            </div>
            <div class="grid grid-cols-3 gap-2">
              <UiNumberField id="custom-vram" v-model="form.vramGiB" label="VRAM" unit="GB" :min="1" :max="512" />
              <UiNumberField id="custom-bw" v-model="form.bandwidthGBs" label="Bandwidth" unit="GB/s" :min="1" :max="20000" />
              <UiNumberField id="custom-res" v-model="form.reservedGiB" label="Reserved" unit="GB" :min="0" :max="64" step="0.1" />
            </div>
            <p v-if="formError" class="text-xs text-rose-600 dark:text-rose-400" role="alert">{{ formError }}</p>
            <div class="flex items-center justify-between gap-2">
              <p class="ds-muted">Saved in this browser only.</p>
              <button type="submit" class="ds-btn-primary"><Icon name="mdi:plus" aria-hidden="true" /> Add GPU</button>
            </div>
          </form>
        </section>
      </div>

      <div id="results" class="space-y-6 min-w-0 scroll-mt-16 focus:outline-none" aria-live="polite">
        <div v-if="!validation.ok" class="ds-surface p-4 text-sm text-rose-700 dark:text-rose-300" role="alert">
          Fix the highlighted architecture fields to see results.
        </div>
        <template v-else>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            <span class="font-medium text-slate-900 dark:text-slate-100">{{ preset?.name ?? formatParams(state.paramsB) + ' custom model' }}</span>
            at {{ quant.label }} with {{ formatTokens(state.contextTokens) }} context needs
            <span class="font-semibold tabular-nums text-slate-900 dark:text-white">{{ formatGiB(estimate.total) }}</span>.
          </p>

          <!-- Side-by-side cards -->
          <section class="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3" aria-label="GPU comparison">
            <article
              v-for="c in configs"
              :key="c.entry"
              class="ds-surface p-4 flex flex-col gap-4"
              :class="c.entry === recommended ? 'ring-1 ring-sky-500 border-sky-500/60' : ''"
            >
              <header class="flex items-start justify-between gap-2">
                <div>
                  <h3 class="ds-h3">{{ c.count > 1 ? c.count + '× ' : '' }}{{ c.gpu.name }}</h3>
                  <p class="ds-muted mt-0.5">{{ formatGiB(c.total, 0) }} total · {{ formatGiB(c.usable) }} usable</p>
                </div>
                <UiBadge v-if="c.entry === recommended" tone="info">Best fit</UiBadge>
              </header>

              <div>
                <div class="mb-1.5 flex items-center justify-between">
                  <CalcFitBadge :status="c.status" />
                  <span class="text-xs tabular-nums text-slate-600 dark:text-slate-400">{{ Number.isFinite(c.utilization) ? Math.round(c.utilization * 100) + '%' : '—' }}</span>
                </div>
                <CalcMemoryBar :est="estimate" :capacity="c.usable" compact :show-legend="false" />
              </div>

              <dl class="grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm">
                <div>
                  <dt class="ds-muted">{{ c.remaining >= 0 ? 'Remaining' : 'Over by' }}</dt>
                  <dd class="font-medium tabular-nums" :class="c.remaining >= 0 ? 'text-slate-900 dark:text-slate-100' : 'text-rose-600 dark:text-rose-400'">{{ formatGiB(Math.abs(c.remaining)) }}</dd>
                </div>
                <div>
                  <dt class="ds-muted">Max context</dt>
                  <dd class="font-medium tabular-nums text-slate-900 dark:text-slate-100">{{ c.maxContext ? formatTokens(c.maxContext) : '—' }}</dd>
                </div>
                <div>
                  <dt class="ds-muted">Decode ceiling</dt>
                  <dd class="font-medium tabular-nums text-slate-900 dark:text-slate-100">{{ Math.round(c.ceiling) }} tok/s</dd>
                </div>
                <div>
                  <dt class="ds-muted">{{ c.status === 'offload' ? 'Layers on GPU' : 'Max sequences' }}</dt>
                  <dd class="font-medium tabular-nums text-slate-900 dark:text-slate-100">
                    {{ c.status === 'offload' ? `${c.layersOnGpu} / ${state.layers}` : c.maxSequences }}
                  </dd>
                </div>
              </dl>

              <div v-if="!c.gpu.custom" class="mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                <span class="ds-muted">Cards</span>
                <UiSegmented :model-value="c.count" :options="countOptions" :label="`Number of ${c.gpu.name}`" size="sm" @update:model-value="setCount(c.entry, $event)" />
              </div>
            </article>
          </section>

          <!-- Context capacity chart -->
          <section class="ds-surface p-4 sm:p-5" aria-labelledby="cap-h">
            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="cap-h" class="ds-h3">Context capacity</h2>
              <p class="ds-muted flex items-center gap-1.5"><span class="inline-block h-3 w-0.5 bg-slate-900 dark:bg-white" aria-hidden="true" /> your context ({{ formatTokens(state.contextTokens) }})</p>
            </div>
            <p class="mt-1 ds-body">Longest context each setup can hold for {{ state.sequences }} sequence{{ state.sequences > 1 ? 's' : '' }} after weights and overhead.</p>
            <ul class="mt-4 space-y-3">
              <li v-for="c in configs" :key="c.entry">
                <div class="flex items-baseline justify-between gap-2 text-sm">
                  <span class="text-slate-800 dark:text-slate-200">{{ c.count > 1 ? c.count + '× ' : '' }}{{ c.gpu.name }}</span>
                  <span class="tabular-nums text-slate-700 dark:text-slate-300">{{ c.maxContext ? formatTokens(c.maxContext) + ' tokens' : 'Model doesn’t fit' }}</span>
                </div>
                <div class="relative mt-1 h-2.5 rounded bg-slate-100 dark:bg-slate-800">
                  <div
                    class="h-full rounded transition-[width] duration-300"
                    :class="c.maxContext >= state.contextTokens ? 'bg-emerald-500' : 'bg-amber-500'"
                    :style="{ width: (c.maxContext / maxCtxScale) * 100 + '%' }"
                  />
                  <div class="absolute -inset-y-1 w-0.5 bg-slate-900 dark:bg-white" :style="{ left: (state.contextTokens / maxCtxScale) * 100 + '%' }" aria-hidden="true" />
                </div>
              </li>
            </ul>
          </section>
        </template>
      </div>
    </div>

    <CalcMobileSummary
      target="results"
      label="Needs"
      :value="validation.ok ? formatGiB(estimate.total) : '—'"
      :detail="validation.ok ? (bestConfig ? `Best fit: ${bestConfig.count > 1 ? bestConfig.count + '× ' : ''}${bestConfig.gpu.name}` : 'None of these GPUs fit it fully') + ` · ${configs.filter((c) => c.status !== 'offload').length}/${configs.length} fit` : 'Fix the architecture fields'"
    />
    <CalcAssumptions focus="gpu" />
    <CalcFaq :items="FAQ" />
  </div>
</template>
