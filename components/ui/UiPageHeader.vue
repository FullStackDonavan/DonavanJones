<script setup lang="ts">
// Compact page header: eyebrow, H1, one-paragraph lede, optional actions and
// breadcrumbs. Replaces full-viewport heroes on working pages (tools, lists).
defineProps<{
  eyebrow?: string
  title: string
  description?: string
  crumbs?: { label: string; to?: string }[]
  /** optional decorative hero art (see HeroBackdrop) */
  image?: string
}>()
</script>

<template>
  <header class="relative isolate overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
    <HeroBackdrop v-if="image" :src="image" />
    <div class="ds-container py-8 sm:py-10">
      <nav v-if="crumbs?.length" aria-label="Breadcrumb" class="mb-4">
        <ol class="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <li v-for="(c, i) in crumbs" :key="i" class="flex items-center gap-1.5">
            <NuxtLink v-if="c.to" :to="c.to" class="hover:text-slate-900 dark:hover:text-slate-200 ds-focus rounded-sm">{{ c.label }}</NuxtLink>
            <span v-else aria-current="page" class="text-slate-700 dark:text-slate-300">{{ c.label }}</span>
            <Icon v-if="i < crumbs.length - 1" name="mdi:chevron-right" class="text-sm opacity-60" aria-hidden="true" />
          </li>
        </ol>
      </nav>
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div class="max-w-3xl">
          <p v-if="eyebrow" class="ds-eyebrow mb-2">{{ eyebrow }}</p>
          <h1 class="ds-h1">{{ title }}</h1>
          <p v-if="description" class="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">{{ description }}</p>
        </div>
        <div v-if="$slots.actions" class="flex flex-wrap gap-2 shrink-0"><slot name="actions" /></div>
      </div>
      <slot />
    </div>
  </header>
</template>
