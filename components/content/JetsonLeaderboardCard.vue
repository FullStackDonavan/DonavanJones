<script setup lang="ts">
// Compact, data-driven teaser for /jetson-leaderboard. Usable in Vue pages and in Markdown (MDC):
//   ::JetsonLeaderboardCard
//   ---
//   metric: tools
//   ---
//   ::
// metric: 'all' (category winners) | 'tok_s' | 'quality' | 'tools' | 'code' (top 3 for that metric)
import board from '~/data/jetson-leaderboard.json'

type Row = (typeof board.models)[number]
type Metric = 'tok_s' | 'quality' | 'tools' | 'code'

const props = withDefaults(defineProps<{
  metric?: Metric | 'all'
  title?: string
  blurb?: string
}>(), { metric: 'all', title: '', blurb: '' })

const LABELS: Record<Metric, { label: string; icon: string; color: string; fmt: (r: Row) => string }> = {
  tok_s:   { label: 'Fastest',          icon: 'mdi:lightning-bolt',     color: 'text-sky-500',     fmt: r => `${r.tok_s} tok/s` },
  quality: { label: 'Best quality',     icon: 'mdi:check-decagram',     color: 'text-emerald-500', fmt: r => `${Math.round(r.quality!)}% · ${r.tok_s} tok/s` },
  tools:   { label: 'Best tool caller', icon: 'mdi:function-variant',   color: 'text-violet-500',  fmt: r => `${Math.round(r.tools!)}% · ${r.tok_s} tok/s` },
  code:    { label: 'Best coder',       icon: 'mdi:code-braces',        color: 'text-amber-500',   fmt: r => `${Math.round(r.code!)}% · ${r.tok_s} tok/s` },
}

// Same tie-break as the leaderboard page: metric, then quality, then speed, then smaller file.
function better(a: Row, b: Row, k: Metric) {
  return ((b[k] ?? -1) - (a[k] ?? -1))
    || (k === 'tok_s' ? 0 : (b.quality ?? -1) - (a.quality ?? -1))
    || ((b.tok_s ?? 0) - (a.tok_s ?? 0)) || ((a.size_gb ?? 0) - (b.size_gb ?? 0))
}
function ranked(k: Metric) {
  const best = new Map<string, Row>()
  for (const m of board.models) {
    if (m[k] == null) continue
    const cur = best.get(m.name)
    if (!cur || better(m, cur, k) < 0) best.set(m.name, m)
  }
  return [...best.values()].sort((a, b) => better(a, b, k))
}

const rows = computed(() => {
  if (props.metric === 'all') {
    return (Object.keys(LABELS) as Metric[])
      .map(k => ({ k, r: ranked(k)[0], tag: LABELS[k].label }))
      .filter(x => x.r)
  }
  const k = props.metric
  return ranked(k).slice(0, 3).map((r, i) => ({ k, r, tag: `#${i + 1}` }))
})

const modelCount = new Set(board.models.map(m => m.name)).size
const heading = computed(() => props.title || (props.metric === 'all'
  ? 'Which LLM runs best on a Jetson Orin Nano Super?'
  : `Top ${LABELS[props.metric].label.replace('Best ', '').replace('Fastest', 'speed')} on a Jetson Orin Nano Super`))
const sub = computed(() => props.blurb
  || `${modelCount} models and ${board.models.length} quantizations benchmarked on my own 8 GB boards with Ollama: speed, accuracy, tool calling and coding.`)
</script>

<template>
  <aside class="not-prose py-8 rounded-2xl border border-sky-500/30 bg-slate-50 dark:bg-slate-900/70 overflow-hidden">
    <div class="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs font-medium text-sky-600 dark:text-sky-400">
      <Icon name="mdi:chip" class="text-sm" />
      Jetson Orin Nano LLM Leaderboard · {{ board.runs }} benchmark runs
    </div>
    <div class="p-5">
      <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">{{ heading }}</h3>
      <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">{{ sub }}</p>
      <div class="grid gap-3" :class="rows.length > 3 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'">
        <div
          v-for="x in rows" :key="x.k + x.r.id"
          class="rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-3"
        >
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{{ x.tag }}</span>
            <Icon :name="LABELS[x.k].icon" :class="LABELS[x.k].color" />
          </div>
          <div class="mt-1 font-semibold text-slate-900 dark:text-white text-sm">{{ x.r.name }}</div>
          <div class="text-xs text-slate-500 dark:text-slate-400">{{ x.r.quant }} · {{ LABELS[x.k].fmt(x.r) }}</div>
        </div>
      </div>
      <NuxtLink
        to="/jetson-leaderboard"
        class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-500"
      >
        See the full leaderboard and filters
        <Icon name="mdi:arrow-right" />
      </NuxtLink>
    </div>
  </aside>
</template>
