<script setup lang="ts">
export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

withDefaults(defineProps<{ tone?: BadgeTone; dot?: boolean }>(), { tone: 'neutral', dot: false })

const TONES: Record<BadgeTone, { badge: string; dot: string }> = {
  neutral: { badge: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700', dot: 'bg-slate-400' },
  info: { badge: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/30', dot: 'bg-sky-500' },
  success: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30', dot: 'bg-emerald-500' },
  warning: { badge: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30', dot: 'bg-amber-500' },
  danger: { badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/30', dot: 'bg-rose-500' },
}
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium leading-5"
    :class="TONES[tone].badge"
  >
    <span v-if="dot" class="h-1.5 w-1.5 rounded-full" :class="TONES[tone].dot" aria-hidden="true" />
    <slot />
  </span>
</template>
