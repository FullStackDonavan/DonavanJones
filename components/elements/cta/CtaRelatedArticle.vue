<script setup lang="ts">
withDefaults(defineProps<{
  buttonText: string
  supportingCopy: string
  destinationUrl: string
  heading?: string
}>(), {
  heading: 'Continue reading',
})
</script>

<template>
  <NuxtLink
    :to="destinationUrl"
    class="group flex flex-col h-full rounded-2xl border
           border-slate-200 dark:border-slate-700/50
           bg-white dark:bg-slate-900/60 p-5 sm:p-6
           hover:border-sky-500/40 dark:hover:border-sky-500/30
           hover:shadow-lg hover:shadow-sky-500/5
           transition-all duration-200"
  >
    <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4
                bg-slate-100 dark:bg-slate-800">
      <Icon name="mdi:book-open-page-variant-outline" class="text-xl text-slate-400" />
    </div>

    <p class="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2">
      {{ heading }}
    </p>
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
      {{ supportingCopy }}
    </p>

    <span
      class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold
             text-sky-500 group-hover:translate-x-0.5 transition-transform duration-200"
    >
      {{ buttonText }}
      <Icon name="mdi:arrow-right" class="text-base" />
    </span>
  </NuxtLink>
</template>
