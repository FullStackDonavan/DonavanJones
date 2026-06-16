<script setup lang="ts">
withDefaults(defineProps<{
  buttonText: string
  supportingCopy: string
  destinationUrl: string
  heading?: string
  variant?: 'banner' | 'card'
}>(), {
  heading: 'Portfolio',
  variant: 'banner',
})
</script>

<template>
  <div
    v-if="variant === 'card'"
    class="flex flex-col h-full rounded-2xl border
           border-teal-500/20 dark:border-teal-500/20
           bg-teal-50/60 dark:bg-teal-500/5 p-5 sm:p-6"
  >
    <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4
                bg-teal-500/10 border border-teal-500/20">
      <Icon name="mdi:briefcase-outline" class="text-xl text-teal-500" />
    </div>

    <p class="text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400 mb-2">
      {{ heading }}
    </p>
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
      {{ supportingCopy }}
    </p>

    <NuxtLink
      :to="destinationUrl"
      class="mt-4 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl
             text-sm font-semibold bg-teal-500 text-white
             hover:bg-teal-600 transition-colors duration-200"
    >
      {{ buttonText }}
      <Icon name="mdi:arrow-right" class="text-base" />
    </NuxtLink>
  </div>

  <div
    v-else
    class="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border
           border-teal-500/20 dark:border-teal-500/20
           bg-teal-50/60 dark:bg-teal-500/5 p-5 sm:p-6"
  >
    <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                bg-teal-500/10 border border-teal-500/20">
      <Icon name="mdi:briefcase-outline" class="text-xl text-teal-500" />
    </div>

    <div class="flex-1">
      <p class="text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400 mb-1">
        {{ heading }}
      </p>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {{ supportingCopy }}
      </p>
    </div>

    <NuxtLink
      :to="destinationUrl"
      class="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl
             text-sm font-semibold whitespace-nowrap bg-teal-500 text-white
             hover:bg-teal-600 transition-colors duration-200 flex-shrink-0"
    >
      {{ buttonText }}
      <Icon name="mdi:arrow-right" class="text-base" />
    </NuxtLink>
  </div>
</template>
