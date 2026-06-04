<template>
  <div
    class="rounded-2xl
           border border-slate-200 dark:border-slate-800
           bg-white dark:bg-slate-900
           p-6"
  >
    <h3
      class="text-xl font-bold mb-4
             text-slate-900 dark:text-white"
    >
      {{ title }}
    </h3>

    <div
      class="text-slate-600 dark:text-slate-400"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>