<template>
  <div class="my-8 space-y-3">

    <!-- Header -->
    <div class="flex items-center gap-2 mb-4">
      <div class="w-6 h-6 rounded-md flex items-center justify-center bg-sky-500/10 border border-sky-500/20">
        <Icon name="mdi:shield-star-outline" class="text-sky-400 text-sm" />
      </div>
      <span class="text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400">
        {{ title || 'Sources' }}
      </span>
    </div>

    <!-- Inline citation blockquotes -->
    <blockquote
      v-for="(link, i) in links"
      :key="link.url"
      class="not-prose relative pl-4 border-l-2 border-sky-500/30 py-1"
    >
      <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <span class="text-slate-400 dark:text-slate-500 font-mono text-xs mr-1.5">[{{ i + 1 }}]</span>
        <span class="text-slate-500 dark:text-slate-400 italic">According to </span>
        <a
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium text-sky-600 dark:text-sky-400 hover:underline"
        >{{ link.label }}</a>
        <span
          class="ml-1.5 inline-flex items-center px-1.5 py-px rounded text-[9px] font-bold uppercase tracking-wider border align-middle"
          :class="typeMeta[link.type]?.badge ?? typeMeta.default.badge"
        >{{ typeMeta[link.type]?.label ?? link.type }}</span>
        <span v-if="link.description" class="text-slate-500 dark:text-slate-400"> — {{ link.description }}</span>
      </p>
    </blockquote>

    <!-- Footer note -->
    <p class="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed pt-1">
      {{ note || 'Source: external links open authoritative third-party references cited for research support.' }}
    </p>

  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  note?: string
  links: Array<{
    label: string
    url: string
    type: 'gov' | 'edu' | 'wikipedia' | 'doi' | 'pubmed' | string
    description?: string
  }>
}>()

const typeMeta: Record<string, { label: string; badge: string }> = {
  gov: {
    label: '.gov',
    badge: 'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400',
  },
  edu: {
    label: '.edu',
    badge: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
  },
  wikipedia: {
    label: 'Wikipedia',
    badge: 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400',
  },
  doi: {
    label: 'DOI',
    badge: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
  },
  pubmed: {
    label: 'PubMed',
    badge: 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400',
  },
  default: {
    label: 'Ref',
    badge: 'bg-slate-500/10 border-slate-500/30 text-slate-500 dark:text-slate-400',
  },
}
</script>
