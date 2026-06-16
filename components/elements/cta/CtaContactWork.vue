<script setup lang="ts">
withDefaults(defineProps<{
  buttonText: string
  supportingCopy: string
  destinationUrl?: string
  heading?: string
}>(), {
  destinationUrl: '/hire-me',
  heading: 'Work with me',
})
</script>

<template>
  <div
    class="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border
           border-rose-500/20 dark:border-rose-500/20
           bg-rose-50/60 dark:bg-rose-500/5 p-5 sm:p-6"
  >
    <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                bg-rose-500/10 border border-rose-500/20">
      <Icon name="mdi:handshake-outline" class="text-xl text-rose-500" />
    </div>

    <div class="flex-1">
      <p class="text-xs font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400 mb-1">
        {{ heading }}
      </p>
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {{ supportingCopy }}
      </p>
    </div>

    <NuxtLink
      :to="destinationUrl"
      class="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl
             text-sm font-semibold whitespace-nowrap bg-rose-500 text-white
             hover:bg-rose-600 transition-colors duration-200 flex-shrink-0"
    >
      {{ buttonText }}
      <Icon name="mdi:arrow-right" class="text-base" />
    </NuxtLink>
  </div>
</template>
