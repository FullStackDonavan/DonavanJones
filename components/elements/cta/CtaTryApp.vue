<script setup lang="ts">
withDefaults(defineProps<{
  buttonText: string
  supportingCopy: string
  destinationUrl: string
  heading?: string
}>(), {
  heading: 'Live demo',
})

const isExternal = (url: string) => /^https?:\/\//.test(url)
</script>

<template>
  <div
    class="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border
           border-emerald-500/20 dark:border-emerald-500/20
           bg-emerald-50/60 dark:bg-emerald-500/5 p-5 sm:p-6"
  >
    <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                bg-emerald-500/10 border border-emerald-500/20">
      <Icon name="mdi:rocket-launch-outline" class="text-xl text-emerald-400" />
    </div>

    <div class="flex-1">
      <p class="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-1">
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
             text-sm font-semibold whitespace-nowrap bg-emerald-500 text-white
             hover:bg-emerald-600 transition-colors duration-200 flex-shrink-0"
    >
      {{ buttonText }}
      <Icon name="mdi:open-in-new" class="text-base" />
    </a>
    <NuxtLink
      v-else
      :to="destinationUrl"
      class="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl
             text-sm font-semibold whitespace-nowrap bg-emerald-500 text-white
             hover:bg-emerald-600 transition-colors duration-200 flex-shrink-0"
    >
      {{ buttonText }}
      <Icon name="mdi:arrow-right" class="text-base" />
    </NuxtLink>
  </div>
</template>
