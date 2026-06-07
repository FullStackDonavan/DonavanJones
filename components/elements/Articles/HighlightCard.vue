<template>
  <div
    class="rounded-xl border border-slate-200 dark:border-slate-800
           bg-white dark:bg-slate-900/60 p-6
           flex flex-col gap-4"
  >
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
               bg-sky-500/10 border border-sky-500/20"
      >
        <Icon :name="icon" class="text-sky-400 text-xl" />
      </div>
      <h3 class="text-base font-semibold text-slate-900 dark:text-white not-prose leading-snug">
        {{ title }}
      </h3>
    </div>

    <div class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed [&_p]:mt-0 [&_p]:mb-0">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: 'mdi:code-braces' },
  title: { type: String, required: true },
})
</script>
