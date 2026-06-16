<script setup lang="ts">
withDefaults(defineProps<{
  buttonText: string
  supportingCopy: string
  destinationUrl: string
  heading?: string
}>(), {
  heading: 'Explore the series',
})

const isExternal = (url: string) => /^https?:\/\//.test(url)
</script>

<template>
  <div
    class="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border
           border-slate-200 dark:border-slate-700/50
           bg-slate-50 dark:bg-slate-900/60 p-5 sm:p-6"
  >
    <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                bg-sky-500/10 border border-sky-500/20">
      <Icon name="mdi:shape-outline" class="text-xl text-sky-400" />
    </div>

    <div class="flex-1">
      <p class="text-xs font-semibold uppercase tracking-wide text-sky-500 dark:text-sky-400 mb-1">
        {{ heading }}
      </p>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {{ supportingCopy }}
      </p>
    </div>

    <a
      v-if="isExternal(destinationUrl)"
      :href="destinationUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl
             text-sm font-semibold whitespace-nowrap bg-sky-500 text-white
             hover:bg-sky-600 transition-colors duration-200 flex-shrink-0"
    >
      {{ buttonText }}
      <Icon name="mdi:arrow-right" class="text-base" />
    </a>
    <NuxtLink
      v-else
      :to="destinationUrl"
      class="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl
             text-sm font-semibold whitespace-nowrap bg-sky-500 text-white
             hover:bg-sky-600 transition-colors duration-200 flex-shrink-0"
    >
      {{ buttonText }}
      <Icon name="mdi:arrow-right" class="text-base" />
    </NuxtLink>
  </div>
</template>
