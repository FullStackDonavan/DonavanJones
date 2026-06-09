<script setup lang="ts">
defineProps<{
  pillars: string[]
}>()

const { data: counts } = await useFetch<Record<string, number>>('/api/category-counts', {
  key: 'category-counts',
})

const CATEGORY_META: Record<string, {
  title: string
  icon: string
  color: 'purple' | 'sky' | 'emerald' | 'amber'
  description: string
  to: string
}> = {
  'ai-engineering': {
    title: 'AI Engineering',
    icon: 'mdi:brain',
    color: 'purple',
    description: 'Memory systems, RAG, vector databases, agents, and production AI patterns.',
    to: '/categories/ai-engineering',
  },
  'backend-engineering': {
    title: 'Backend Engineering',
    icon: 'mdi:api',
    color: 'sky',
    description: 'Service architecture, embeddings, inference, streaming, and async workers.',
    to: '/categories/backend-engineering',
  },
  'infrastructure-engineering': {
    title: 'Infrastructure Engineering',
    icon: 'mdi:server-network',
    color: 'emerald',
    description: 'K3s, Raspberry Pi clusters, Gitea CI/CD, networking, and self-hosted systems.',
    to: '/categories/infrastructure-engineering',
  },
  'algorithms': {
    title: 'Algorithms & Data Structures',
    icon: 'mdi:graph-outline',
    color: 'amber',
    description: 'Binary search, sliding window, recursion, and core problem-solving patterns.',
    to: '/categories/algorithms',
  },
}
</script>

<template>
  <div v-if="pillars?.length" class="mt-12">

    <div class="mb-5">
      <p class="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Engineering Domains</p>
      <h2 class="text-lg font-bold text-slate-900 dark:text-white">
        This project demonstrates expertise in
      </h2>
    </div>

    <div class="grid sm:grid-cols-3 gap-4">
      <NuxtLink
        v-for="slug in pillars"
        :key="slug"
        :to="CATEGORY_META[slug]?.to ?? `/categories/${slug}`"
        class="group flex flex-col gap-3 rounded-2xl p-5 border transition-all duration-200"
        :class="{
          'border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40 hover:bg-purple-500/10': CATEGORY_META[slug]?.color === 'purple',
          'border-sky-500/20 bg-sky-500/5 hover:border-sky-500/40 hover:bg-sky-500/10':           CATEGORY_META[slug]?.color === 'sky',
          'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 hover:bg-emerald-500/10': CATEGORY_META[slug]?.color === 'emerald',
          'border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40 hover:bg-amber-500/10': CATEGORY_META[slug]?.color === 'amber',
          'border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 hover:border-sky-500/40': !CATEGORY_META[slug],
        }"
      >
        <!-- Icon -->
        <div
          class="w-9 h-9 rounded-lg flex items-center justify-center border"
          :class="{
            'bg-purple-500/10 border-purple-500/20': CATEGORY_META[slug]?.color === 'purple',
            'bg-sky-500/10 border-sky-500/20':       CATEGORY_META[slug]?.color === 'sky',
            'bg-emerald-500/10 border-emerald-500/20': CATEGORY_META[slug]?.color === 'emerald',
            'bg-amber-500/10 border-amber-500/20':   CATEGORY_META[slug]?.color === 'amber',
          }"
        >
          <Icon
            :name="CATEGORY_META[slug]?.icon ?? 'mdi:tag-outline'"
            class="text-lg"
            :class="{
              'text-purple-400': CATEGORY_META[slug]?.color === 'purple',
              'text-sky-400':    CATEGORY_META[slug]?.color === 'sky',
              'text-emerald-400':CATEGORY_META[slug]?.color === 'emerald',
              'text-amber-400':  CATEGORY_META[slug]?.color === 'amber',
            }"
          />
        </div>

        <!-- Body -->
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors mb-1">
            {{ CATEGORY_META[slug]?.title ?? slug }}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {{ CATEGORY_META[slug]?.description }}
          </p>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between">
          <span class="text-[11px] text-slate-400 dark:text-slate-500">
            {{ counts?.[slug] ?? '—' }} articles
          </span>
          <span class="inline-flex items-center gap-1 text-xs font-medium text-sky-500 group-hover:translate-x-1 transition-transform duration-200">
            Explore <Icon name="mdi:arrow-right" class="text-sm" />
          </span>
        </div>
      </NuxtLink>
    </div>

  </div>
</template>
