<script setup lang="ts">
// Jetson Orin Nano LLM leaderboard. Data: data/jetson-leaderboard.json, exported from the
// homelab's benchmark database by scripts/export_jetson_leaderboard.py (one row per model + quant).
// Layout adapted from a sales leaderboard: totals strip, filters, podium rows with the gap to the
// next spot, and champion highlights.
import board from '~/data/jetson-leaderboard.json'

const _cfg = useRuntimeConfig()
const _SITE = (_cfg.public.appDomain as string) || 'https://donavanjones.com'
const TITLE = 'Jetson Orin Nano LLM Leaderboard'
const DESC = `Speed, quality, tool-calling and coding scores for ${new Set(board.models.map(m => m.name)).size} local LLMs and ${board.models.length} quantizations, measured on NVIDIA Jetson Orin Nano Super 8 GB boards with Ollama.`
useSeoMeta({
  title: TITLE,
  description: DESC,
  ogTitle: TITLE,
  ogDescription: DESC,
  ogType: 'website',
  ogUrl: `${_SITE}/jetson-leaderboard`,
  twitterCard: 'summary_large_image',
  twitterTitle: TITLE,
  twitterDescription: DESC,
  canonical: `${_SITE}/jetson-leaderboard`,
})

type Row = (typeof board.models)[number]
type Metric = 'tok_s' | 'quality' | 'tools' | 'code'

const METRICS: { key: Metric; label: string; unit: string; icon: string; help: string }[] = [
  { key: 'tok_s', label: 'Speed', unit: 'tok/s', icon: 'mdi:speedometer', help: 'Generation speed for a 200-token answer' },
  { key: 'quality', label: 'Quality', unit: '%', icon: 'mdi:check-decagram-outline', help: '24 short questions with one right answer' },
  { key: 'tools', label: 'Tool calling', unit: '%', icon: 'mdi:function-variant', help: '10 cases: right tool, right arguments, or no call when none fits' },
  { key: 'code', label: 'Coding', unit: '%', icon: 'mdi:code-braces', help: '12 HumanEval problems, tests run in a sandbox (coding models only)' },
]
const SIZES = [
  { key: 'all', label: 'All sizes', min: 0, max: Infinity },
  { key: 'tiny', label: 'Under 1B', min: 0, max: 1 },
  { key: 'small', label: '1–3B', min: 1, max: 3.3 },
  { key: 'mid', label: '3–5B', min: 3.3, max: 5 },
  { key: 'big', label: '5B+', min: 5, max: Infinity },
] as const

const rankBy = ref<Metric>('tok_s')
const size = ref<(typeof SIZES)[number]['key']>('all')
const bestQuantOnly = ref(true)
const search = ref('')

const metric = computed(() => METRICS.find(m => m.key === rankBy.value)!)

// Ties on the ranking metric go to the more accurate model (a 100% tool caller that gets 40% of
// simple questions wrong shouldn't win), then the faster one, then the smaller file.
function better(a: Row, b: Row, k: Metric) {
  return ((b[k] ?? -1) - (a[k] ?? -1))
    || (k === 'tok_s' ? 0 : (b.quality ?? -1) - (a.quality ?? -1))
    || ((b.tok_s ?? 0) - (a.tok_s ?? 0)) || ((a.size_gb ?? 0) - (b.size_gb ?? 0))
}

const leaders = computed(() => {
  const k = rankBy.value
  const s = SIZES.find(x => x.key === size.value)!
  const q = search.value.trim().toLowerCase()
  let rows = board.models.filter(m => m[k] != null
    && (m.params_b == null ? s.key === 'all' : m.params_b >= s.min && m.params_b < s.max)
    && (!q || `${m.name} ${m.quant}`.toLowerCase().includes(q)))
  if (bestQuantOnly.value) {
    const best = new Map<string, Row>()
    for (const m of rows) {
      const cur = best.get(m.name)
      if (!cur || better(m, cur, k) < 0) best.set(m.name, m)
    }
    rows = [...best.values()]
  }
  return rows.sort((a, b) => better(a, b, k)).map((m, i) => ({ ...m, rank: i + 1 }))
})

function fmt(v: number | null | undefined, k: Metric = rankBy.value) {
  if (v == null) return '–'
  return k === 'tok_s' ? v.toFixed(1) : `${Math.round(v)}%`
}
function gap(i: number) {
  if (i === 0) return ''
  const k = rankBy.value
  const d = (leaders.value[i - 1][k] ?? 0) - (leaders.value[i][k] ?? 0)
  if (d <= 0) return `Tied with #${i} on ${metric.value.label.toLowerCase()}`
  return k === 'tok_s' ? `${d.toFixed(1)} tok/s behind #${i}` : `${Math.round(d)} points behind #${i}`
}

const PODIUM = [
  { ring: 'border-amber-400 text-amber-500 dark:text-amber-300', row: 'border-amber-300/70 bg-amber-50/70 dark:border-amber-500/40 dark:bg-amber-500/5' },
  { ring: 'border-slate-400 text-slate-500 dark:text-slate-300', row: 'border-slate-300 dark:border-slate-600' },
  { ring: 'border-orange-500 text-orange-600 dark:text-orange-300', row: 'border-orange-300/60 dark:border-orange-500/30' },
]
const ringClass = (rank: number) => PODIUM[rank - 1]?.ring ?? 'border-sky-500/60 text-sky-600 dark:text-sky-400'
const rowClass = (rank: number) => PODIUM[rank - 1]?.row ?? 'border-slate-200 dark:border-slate-800'

function champ(k: Metric) {
  return [...board.models].filter(m => m[k] != null).sort((a, b) => better(a, b, k))[0]
}
const highlights = computed(() => [
  { title: 'Fastest', icon: 'mdi:lightning-bolt', color: 'text-sky-500', row: champ('tok_s'), value: (r: Row) => `${r.tok_s} tok/s` },
  { title: 'Best quality', icon: 'mdi:check-decagram', color: 'text-emerald-500', row: champ('quality'), value: (r: Row) => `${r.quality}% · ${r.tok_s} tok/s` },
  { title: 'Best tool caller', icon: 'mdi:function-variant', color: 'text-violet-500', row: champ('tools'), value: (r: Row) => `${r.tools}% · ${r.tok_s} tok/s` },
  { title: 'Best coder', icon: 'mdi:code-braces', color: 'text-amber-500', row: champ('code'), value: (r: Row) => `${r.code}% · ${r.tok_s} tok/s` },
].filter(h => h.row))

const totals = computed(() => [
  { value: new Set(board.models.map(m => m.name)).size, label: 'Models' },
  { value: board.models.length, label: 'Quantizations' },
  { value: board.runs, label: 'Benchmark runs' },
  { value: Math.max(...board.models.map(m => m.tok_s ?? 0)).toFixed(0), label: 'Top tok/s' },
])
const tested = new Date(`${board.generated}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-slate-950">
    <!-- Hero -->
    <section class="bg-slate-900 border-b border-slate-800">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium mb-6">
          <Icon name="mdi:chip" class="text-sm" />
          {{ board.hardware }}
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
          Which LLM runs best on a Jetson Orin Nano?
        </h1>
        <p class="text-lg text-slate-300 max-w-2xl">
          Every model I've run on my three Jetson boards, measured the same way: how fast it answers,
          how often it's right, whether it can call tools, and whether its code passes tests.
        </p>
        <p class="mt-3 text-sm text-slate-400">{{ board.runtime }} · last updated {{ tested }}</p>

        <dl class="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div v-for="t in totals" :key="t.label" class="rounded-xl border border-slate-700/80 bg-slate-800/50 px-5 py-4">
            <dd class="text-3xl font-bold text-white tabular-nums">{{ t.value }}</dd>
            <dt class="mt-1 text-sm text-slate-400">{{ t.label }}</dt>
          </div>
        </dl>
      </div>
    </section>

    <!-- Champions -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 pt-12">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-5">Category winners</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="h in highlights" :key="h.title" class="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-5">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ h.title }}</span>
            <Icon :name="h.icon" class="text-xl" :class="h.color" />
          </div>
          <div class="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{{ h.row!.name }}</div>
          <div class="text-sm text-slate-500 dark:text-slate-400">{{ h.row!.quant }} · {{ h.value(h.row!) }}</div>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 pt-12">
      <div class="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
        <div class="flex flex-wrap items-center gap-2" role="group" aria-label="Rank by">
          <span class="text-sm text-slate-500 dark:text-slate-400 mr-1">Rank by</span>
          <button
            v-for="m in METRICS" :key="m.key" type="button" :aria-pressed="rankBy === m.key" :title="m.help"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500"
            :class="rankBy === m.key ? 'bg-sky-500 border-sky-500 text-white' : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-400'"
            @click="rankBy = m.key"
          >
            <Icon :name="m.icon" class="text-base" />{{ m.label }}
          </button>
        </div>
        <div class="flex flex-wrap items-center gap-2" role="group" aria-label="Model size">
          <span class="text-sm text-slate-500 dark:text-slate-400 mr-1">Size</span>
          <button
            v-for="s in SIZES" :key="s.key" type="button" :aria-pressed="size === s.key"
            class="px-3 py-1.5 rounded-full text-sm border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500"
            :class="size === s.key ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900' : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'"
            @click="size = s.key"
          >{{ s.label }}</button>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center gap-3">
          <label class="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
            <input v-model="bestQuantOnly" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500">
            Best quantization of each model only
          </label>
          <label class="sm:ml-auto relative">
            <span class="sr-only">Search models</span>
            <Icon name="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              v-model="search" type="search" placeholder="Search, e.g. qwen or Q4_K_M"
              class="w-full sm:w-72 pl-9 pr-3 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
          </label>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400">{{ metric.label }}: {{ metric.help }}.</p>
      </div>
    </section>

    <!-- Board -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-8" aria-live="polite">
      <p v-if="!leaders.length" class="py-16 text-center text-slate-500 dark:text-slate-400">
        No model has a {{ metric.label.toLowerCase() }} score with these filters. Try another size or clear the search.
      </p>
      <ol v-else class="space-y-3">
        <li
          v-for="(r, i) in leaders" :key="r.id"
          class="rounded-xl border px-4 sm:px-6 py-4"
          :class="rowClass(r.rank)"
        >
          <div class="flex items-center gap-4">
            <div class="relative shrink-0">
              <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[3px] flex items-center justify-center font-bold text-lg tabular-nums bg-white dark:bg-slate-900" :class="ringClass(r.rank)">
                {{ r.rank }}
              </div>
              <Icon v-if="r.rank === 1" name="mdi:crown" class="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl text-amber-400" aria-hidden="true" />
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h3 class="font-semibold text-slate-900 dark:text-white truncate">{{ r.name }}</h3>
                <span class="px-2 py-0.5 rounded-md text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{{ r.quant }}</span>
                <span v-if="r.gpu_pct != null && r.gpu_pct < 100" class="px-2 py-0.5 rounded-md text-xs bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" :title="`Only ${r.gpu_pct}% of the model fit on the GPU; the rest ran on the CPU`">
                  {{ Math.round(r.gpu_pct) }}% on GPU
                </span>
              </div>
              <div class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                <span v-if="r.params_b">{{ r.params_b }}B params · </span>{{ r.size_gb }} GB<span v-if="gap(i)"> · {{ gap(i) }}</span>
              </div>
              <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span v-for="m in METRICS.filter(x => x.key !== rankBy && r[x.key] != null)" :key="m.key" :title="m.help">
                  {{ m.label }} <b class="font-semibold text-slate-700 dark:text-slate-200 tabular-nums">{{ fmt(r[m.key], m.key) }}</b>
                </span>
              </div>
            </div>

            <div class="text-right shrink-0">
              <div class="text-2xl sm:text-3xl font-bold tabular-nums" :class="r.rank === 1 ? 'text-amber-500 dark:text-amber-300' : 'text-slate-900 dark:text-white'">
                {{ fmt(r[rankBy]) }}
              </div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ rankBy === 'tok_s' ? 'tokens / s' : metric.label }}</div>
            </div>
          </div>
        </li>
      </ol>
    </section>

    <!-- Method -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
      <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 sm:p-8">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-4">How it's measured</h2>
        <div class="grid gap-6 sm:grid-cols-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <ul class="space-y-2">
            <li v-for="m in METRICS" :key="m.key"><b class="text-slate-900 dark:text-white">{{ m.label }}:</b> {{ m.help }}.</li>
          </ul>
          <ul class="space-y-2">
            <li>Each model is loaded on its own after the page cache is cleared, with a 4k context and temperature 0.</li>
            <li>The three boards are identical. Where a model ran on more than one, the board shows the average of each board's latest run.</li>
            <li>A model that doesn't fit in GPU memory spills layers to the CPU and slows down; those rows are marked.</li>
            <li>These are small, fixed test sets: good for comparing models and quants on this hardware, not a general ranking of the models.</li>
          </ul>
        </div>
      </div>

      <div class="mt-8 grid gap-4 sm:grid-cols-2">
        <NuxtLink to="/blog/ai-engineering/25-tiny-tool-calling-model-34-to-98" class="group rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-sky-400 transition-colors">
          <div class="text-sm text-slate-500 dark:text-slate-400">Read</div>
          <div class="mt-1 font-semibold text-slate-900 dark:text-white group-hover:text-sky-500">From 34% to 98%: teaching a 0.6B model to run my homelab</div>
        </NuxtLink>
        <NuxtLink to="/hire-me" class="group rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-sky-400 transition-colors">
          <div class="text-sm text-slate-500 dark:text-slate-400">Running models on your own hardware?</div>
          <div class="mt-1 font-semibold text-slate-900 dark:text-white group-hover:text-sky-500">Let's talk about your setup</div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
