<script setup lang="ts">
// Tab bar shared by the three calculators. Links keep the current query so a
// configured model/GPU carries across tools.
const route = useRoute()
const TABS = [
  { to: '/tools/vram-calculator', label: 'VRAM', long: 'VRAM calculator', icon: 'mdi:memory' },
  { to: '/tools/kv-cache-calculator', label: 'KV cache', long: 'Context / KV cache', icon: 'mdi:text-box-multiple-outline' },
  { to: '/tools/gpu-comparison', label: 'GPUs', long: 'GPU comparison', icon: 'mdi:compare-horizontal' },
]
</script>

<template>
  <nav aria-label="Calculators" class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-30">
    <div class="ds-container flex gap-1 overflow-x-auto">
      <NuxtLink
        v-for="t in TABS"
        :key="t.to"
        :to="{ path: t.to, query: route.query }"
        class="relative inline-flex items-center gap-2 px-3 py-3 text-sm font-medium whitespace-nowrap ds-focus"
        :class="route.path === t.to
          ? 'text-slate-900 dark:text-white after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-sky-500'
          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'"
        :aria-current="route.path === t.to ? 'page' : undefined"
      >
        <Icon :name="t.icon" class="text-base" aria-hidden="true" />
        <span class="sm:hidden">{{ t.label }}</span>
        <span class="hidden sm:inline">{{ t.long }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
