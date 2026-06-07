<template>
  <div
    class="rounded-xl border border-slate-200 dark:border-slate-800
           bg-white dark:bg-slate-900/60 overflow-hidden"
  >
    <!-- Title bar -->
    <div class="px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
      <h3 class="text-base font-semibold text-slate-900 dark:text-white not-prose">
        {{ title }}
      </h3>
    </div>

    <!-- Problem -->
    <div class="px-6 pt-4 pb-3">
      <div class="text-xs font-semibold uppercase tracking-widest text-rose-400 mb-2">
        Problem
      </div>
      <div class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed not-prose">
        <slot name="problem" />
      </div>
    </div>

    <!-- Solution -->
    <div class="px-6 pt-3 pb-5 bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800">
      <div class="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-2">
        Solution
      </div>
      <div class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed not-prose">
        <slot name="solution" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
})
</script>
