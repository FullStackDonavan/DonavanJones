<template>
  <div
    class="rounded-xl border border-slate-200 dark:border-slate-800
           bg-white dark:bg-slate-900/60 p-6
           flex flex-col gap-3"
  >
    <div class="text-xs font-semibold uppercase tracking-widest text-sky-400">
      {{ phase }}
    </div>

    <h3 class="text-base font-semibold text-slate-900 dark:text-white not-prose leading-snug">
      {{ title }}
    </h3>

    <div class="space-y-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed
                [&_ul]:space-y-1 [&_li]:flex [&_li]:items-start [&_li]:gap-2
                [&_li]:before:content-['·'] [&_li]:before:text-sky-400 [&_li]:before:font-bold [&_li]:before:flex-shrink-0">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  phase: { type: String, required: true },
  title: { type: String, required: true },
})
</script>
