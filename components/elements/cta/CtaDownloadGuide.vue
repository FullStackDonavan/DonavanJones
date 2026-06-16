<script setup lang="ts">
withDefaults(defineProps<{
  buttonText: string
  supportingCopy: string
  destinationUrl: string
  heading?: string
  price?: string
}>(), {
  heading: 'Digital guide',
  price: 'FREE',
})

const isExternal = (url: string) => /^https?:\/\//.test(url)
</script>

<template>
  <div
    class="relative flex flex-col h-full rounded-2xl border
           border-amber-500/20 dark:border-amber-500/20
           bg-amber-50/60 dark:bg-amber-500/5 p-5 sm:p-6"
  >
    <span
      v-if="price"
      class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
      :class="price === 'FREE'
        ? 'bg-emerald-500 text-white'
        : 'bg-amber-500 text-white'"
    >
      {{ price }}
    </span>

    <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4
                bg-amber-500/10 border border-amber-500/20">
      <Icon name="mdi:file-download-outline" class="text-xl text-amber-500" />
    </div>

    <p class="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-2">
      {{ heading }}
    </p>
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
      {{ supportingCopy }}
    </p>

    <a
      v-if="isExternal(destinationUrl)"
      :href="destinationUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="mt-4 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl
             text-sm font-semibold bg-amber-500 text-white
             hover:bg-amber-600 transition-colors duration-200"
    >
      {{ buttonText }}
      <Icon name="mdi:download" class="text-base" />
    </a>
    <NuxtLink
      v-else
      :to="destinationUrl"
      class="mt-4 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl
             text-sm font-semibold bg-amber-500 text-white
             hover:bg-amber-600 transition-colors duration-200"
    >
      {{ buttonText }}
      <Icon name="mdi:download" class="text-base" />
    </NuxtLink>
  </div>
</template>
