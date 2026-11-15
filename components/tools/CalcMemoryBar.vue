<script setup lang="ts">
// Stacked memory bar: weights / KV cache / overhead against usable capacity.
// When the total exceeds capacity, the bar is scaled to the total and a marker
// shows where capacity ends, so overflow is visible rather than clipped.
import { formatGiB, type MemoryEstimate } from '~/utils/llmMemory'

const props = withDefaults(defineProps<{ est: MemoryEstimate; capacity: number; compact?: boolean; showLegend?: boolean }>(), {
  compact: false,
  showLegend: true,
})

const scale = computed(() => Math.max(props.capacity, props.est.total) || 1)
const pct = (b: number) => `${Math.max(0, (b / scale.value) * 100)}%`
const capacityPct = computed(() => (props.capacity / scale.value) * 100)
const over = computed(() => props.est.total > props.capacity)

const SEGMENTS = computed(() => [
  { key: 'weights', label: 'Weights', bytes: props.est.weights, cls: 'bg-sky-500' },
  { key: 'kv', label: 'KV cache', bytes: props.est.kv, cls: 'bg-violet-500' },
  { key: 'overhead', label: 'Overhead', bytes: props.est.overhead, cls: 'bg-slate-400 dark:bg-slate-500' },
])
const summary = computed(() =>
  `${SEGMENTS.value.map((s) => `${s.label} ${formatGiB(s.bytes)}`).join(', ')}; total ${formatGiB(props.est.total)} of ${formatGiB(props.capacity)} usable`,
)
</script>

<template>
  <div>
    <div
      class="relative w-full overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800"
      :class="compact ? 'h-2.5' : 'h-4'"
      role="img"
      :aria-label="summary"
    >
      <div class="absolute inset-y-0 left-0 flex w-full">
        <div
          v-for="s in SEGMENTS"
          :key="s.key"
          class="h-full transition-[width] duration-300 ease-out first:rounded-l-md"
          :class="s.cls"
          :style="{ width: pct(s.bytes) }"
        />
      </div>
      <!-- capacity marker when over -->
      <div
        v-if="over"
        class="absolute inset-y-0 w-0.5 bg-rose-500 ring-2 ring-white dark:ring-slate-900"
        :style="{ left: `calc(${capacityPct}% - 1px)` }"
        aria-hidden="true"
      />
      <div
        v-if="over"
        class="absolute inset-y-0 right-0 bg-[repeating-linear-gradient(135deg,transparent_0_4px,rgba(244,63,94,.35)_4px_8px)]"
        :style="{ left: `${capacityPct}%` }"
        aria-hidden="true"
      />
    </div>
    <ul v-if="showLegend" class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
      <li v-for="s in SEGMENTS" :key="s.key" class="inline-flex items-center gap-1.5">
        <span class="h-2 w-2 rounded-sm" :class="s.cls" aria-hidden="true" />
        {{ s.label }} <span class="tabular-nums text-slate-900 dark:text-slate-200">{{ formatGiB(s.bytes) }}</span>
      </li>
      <li class="inline-flex items-center gap-1.5">
        <span class="h-2 w-2 rounded-sm bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-300 dark:ring-slate-600" aria-hidden="true" />
        {{ over ? 'Usable' : 'Free' }}
        <span class="tabular-nums text-slate-900 dark:text-slate-200">{{ over ? formatGiB(capacity) : formatGiB(capacity - est.total) }}</span>
      </li>
    </ul>
  </div>
</template>
