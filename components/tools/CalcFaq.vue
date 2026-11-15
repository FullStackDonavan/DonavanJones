<script setup lang="ts">
// Visible FAQ; the same items are passed to useToolSeo for FAQPage JSON-LD.
defineProps<{ items: { q: string; a: string }[] }>()
</script>

<template>
  <section class="ds-container pb-16" aria-labelledby="faq-h">
    <h2 id="faq-h" class="ds-h2 mb-4">Questions</h2>
    <div class="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
      <details v-for="f in items" :key="f.q" class="group py-4">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-slate-900 dark:text-slate-100 ds-focus rounded">
          {{ f.q }}
          <Icon name="mdi:plus" class="shrink-0 text-lg text-slate-400 transition-transform group-open:rotate-45" aria-hidden="true" />
        </summary>
        <p class="mt-2 max-w-3xl ds-body">{{ f.a }}</p>
      </details>
    </div>
  </section>
</template>
