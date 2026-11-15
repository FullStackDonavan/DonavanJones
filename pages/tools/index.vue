<script setup lang="ts">
import { GPU_PRESETS, MODEL_PRESETS, formatGiB, getQuant, estimateMemory, DEFAULT_OVERHEAD, usableBytes, fitStatus } from '~/utils/llmMemory'

useToolSeo({
  title: 'Local LLM Hardware Calculators: VRAM, KV Cache, GPU Comparison',
  description: 'Free calculators for running LLMs on your own hardware: GPU memory by model and quantization, KV cache by context length, and side-by-side GPU comparisons for RTX 3090, 3080, 3060 and custom cards.',
  path: '/tools',
  name: 'Local LLM hardware calculators',
  crumb: 'AI tools',
})

const TOOLS = [
  {
    to: '/tools/vram-calculator',
    image: '/img/cards/tool-vram.jpg',
    icon: 'mdi:memory',
    title: 'VRAM calculator',
    body: 'Weights, KV cache and overhead for any model at FP32 through Q2, with the smallest GPU that runs it and a per-precision fit table.',
  },
  {
    to: '/tools/kv-cache-calculator',
    image: '/img/cards/tool-kv-cache.jpg',
    icon: 'mdi:text-box-multiple-outline',
    title: 'Context / KV cache calculator',
    body: 'KV cache by context length, batch size and KV precision. Handles GQA and MQA, and finds the longest context and most concurrent requests a GPU allows.',
  },
  {
    to: '/tools/gpu-comparison',
    image: '/img/cards/tool-gpu-comparison.jpg',
    icon: 'mdi:compare-horizontal',
    title: 'GPU comparison',
    body: 'Up to six GPU setups side by side: fit, utilization, headroom, context capacity and a bandwidth-based speed ceiling. Add your own cards.',
  },
]

// A server-rendered reference grid: popular models at Q4_K_M, 8K context.
const q4 = getQuant('Q4_K_M')
const GRID_MODELS = ['llama-3.2-3b', 'llama-3.1-8b', 'qwen2.5-14b', 'qwen2.5-32b', 'llama-3.3-70b'].map((id) => MODEL_PRESETS.find((m) => m.id === id)!)
const GRID_GPUS = ['rtx-3060-12', 'rtx-3080-12', 'rtx-3090'].map((id) => GPU_PRESETS.find((g) => g.id === id)!)
const grid = GRID_MODELS.map((m) => {
  const est = estimateMemory({ paramsB: m.paramsB, bitsPerWeight: q4.effectiveBits, arch: m, kvBytesPerElem: 2, contextTokens: 8192, sequences: 1, overhead: DEFAULT_OVERHEAD })
  return { m, est, fits: GRID_GPUS.map((g) => fitStatus(est.total, usableBytes(g))) }
})
const FIT_LABEL = { fits: 'Fits', tight: 'Tight', offload: 'Offload' } as const
const FIT_TONE = { fits: 'success', tight: 'warning', offload: 'danger' } as const
</script>

<template>
  <div class="bg-slate-50 dark:bg-slate-950 min-h-screen">
    <UiPageHeader
      image="/img/heroes/tools.jpg"
      eyebrow="AI tools"
      title="Local LLM hardware calculators"
      description="Plan what runs on which GPU before you download 40 GB of weights. The math is the same I use to place models across an RTX 3090 and three Jetson Orin Nanos in my homelab."
      :crumbs="[{ label: 'Home', to: '/' }, { label: 'AI tools' }]"
    />

    <div class="ds-container py-8 space-y-10">
      <section class="grid gap-4 md:grid-cols-3" aria-label="Calculators">
        <NuxtLink
          v-for="t in TOOLS"
          :key="t.to"
          :to="t.to"
          class="group ds-surface p-5 flex flex-col gap-3 overflow-hidden transition-colors hover:border-sky-500/50 ds-focus"
        >
          <div class="relative -mx-5 -mt-5 mb-2 aspect-[2/1] overflow-hidden border-b border-slate-200 dark:border-slate-800">
            <img
              :src="t.image"
              alt=""
              width="600"
              height="315"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div data-icon-overlay class="absolute top-3 left-3 z-10 rounded-lg bg-white/90 dark:bg-slate-950/75 backdrop-blur-sm shadow-sm">
              <span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Icon :name="t.icon" class="text-xl" aria-hidden="true" />
              </span>
            </div>
          </div>
          <h2 class="ds-h3">{{ t.title }}</h2>
          <p class="ds-body flex-1">{{ t.body }}</p>
          <span class="inline-flex items-center gap-1 text-sm font-medium text-sky-600 dark:text-sky-400">
            Open <Icon name="mdi:arrow-right" class="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </NuxtLink>
      </section>

      <section class="ds-surface overflow-hidden" aria-labelledby="ref-h">
        <div class="px-4 sm:px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 id="ref-h" class="ds-h3">Quick reference: Q4_K_M, 8K context</h2>
          <p class="mt-1 ds-muted">Estimated total memory and fit on common 12–24 GB cards. Open a calculator to change any assumption.</p>
        </div>
        <div class="overflow-x-auto">
          <table class="ds-table w-full">
            <caption class="sr-only">Estimated VRAM for popular models at Q4_K_M with 8K context</caption>
            <thead class="bg-slate-50 dark:bg-slate-900/80">
              <tr>
                <th scope="col">Model</th>
                <th scope="col" class="text-right">Total VRAM</th>
                <th v-for="g in GRID_GPUS" :key="g.id" scope="col">{{ g.name }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in grid" :key="r.m.id">
                <th scope="row" class="px-3 py-2 text-left text-sm font-medium text-slate-900 dark:text-slate-100">
                  <NuxtLink :to="{ path: '/tools/vram-calculator', query: { m: r.m.id } }" class="hover:text-sky-600 dark:hover:text-sky-400">{{ r.m.name }}</NuxtLink>
                </th>
                <td class="text-right font-medium">{{ formatGiB(r.est.total) }}</td>
                <td v-for="(f, i) in r.fits" :key="i"><UiBadge :tone="FIT_TONE[f]" dot>{{ FIT_LABEL[f] }}</UiBadge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-2" aria-label="Related">
        <NuxtLink to="/jetson-leaderboard" class="ds-surface p-5 flex items-start gap-4 hover:border-sky-500/50 transition-colors ds-focus">
          <Icon name="mdi:trophy-outline" class="mt-0.5 text-2xl text-amber-500 shrink-0" aria-hidden="true" />
          <div>
            <h2 class="ds-h3">Jetson Orin Nano LLM leaderboard</h2>
            <p class="mt-1 ds-body">Measured speed, quality and tool-calling scores for 17 models on an 8 GB edge board: real numbers to check these estimates against.</p>
          </div>
        </NuxtLink>
        <NuxtLink to="/systems/ai-homelab" class="ds-surface p-5 flex items-start gap-4 hover:border-sky-500/50 transition-colors ds-focus">
          <Icon name="mdi:server-network" class="mt-0.5 text-2xl text-sky-500 shrink-0" aria-hidden="true" />
          <div>
            <h2 class="ds-h3">AI homelab engineering</h2>
            <p class="mt-1 ds-body">How the cluster behind these numbers is built: K3s, Jetsons, an RTX 3090, model routing and observability.</p>
          </div>
        </NuxtLink>
      </section>
    </div>
  </div>
</template>
