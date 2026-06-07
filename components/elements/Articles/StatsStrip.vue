<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="rounded-xl border border-slate-200 dark:border-slate-700/50
             bg-white dark:bg-slate-900/50 px-4 py-3 flex flex-col gap-1"
    >
      <div class="text-xl font-bold text-slate-900 dark:text-white leading-none">
        {{ stat.value }}
      </div>
      <div class="text-xs font-medium text-slate-500 dark:text-slate-400">
        {{ stat.label }}
      </div>
      <div v-if="stat.sub" class="text-[11px] text-slate-400 dark:text-slate-500">
        {{ stat.sub }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: { type: Array, default: () => [] },
})
</script>
