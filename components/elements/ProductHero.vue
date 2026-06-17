<script setup lang="ts">
defineProps<{
  title: string
  tagline?: string
  description: string
  badge?: string
  badgeIcon?: string
  price?: string
  format?: string
  ctaButtonText?: string
  ctaUrl?: string
  relatedCategoryLabel?: string
  relatedCategoryUrl?: string
  features?: string[]
  stripePriceId?: string
}>()

const route = useRoute()
const guideUrl = computed(() => `${route.path}/guide`)
</script>

<template>
  <div class="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-6 py-16 sm:py-24">

      <!-- Breadcrumb -->
      <nav class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500 mb-8">
        <NuxtLink to="/products/overview" class="hover:text-sky-400 transition-colors">Products</NuxtLink>
        <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600" />
        <span class="text-slate-700 dark:text-slate-300 truncate max-w-xs">{{ title }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

        <!-- ── Left: product info ──────────────────────────────────── -->
        <div>
          <div
            v-if="badge"
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5
                   bg-sky-500/10 border border-sky-500/20 text-sky-500 dark:text-sky-400 text-xs font-medium"
          >
            <Icon :name="badgeIcon || 'mdi:package-variant-closed'" class="text-sm" />
            {{ badge }}
          </div>

          <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            {{ title }}
          </h1>

          <p v-if="tagline" class="mt-3 text-lg font-medium text-sky-500 dark:text-sky-400">
            {{ tagline }}
          </p>

          <p class="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed text-base">
            {{ description }}
          </p>

          <!-- Features -->
          <ul v-if="features && features.length" class="mt-7 space-y-2.5">
            <li
              v-for="feature in features"
              :key="feature"
              class="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300"
            >
              <Icon name="mdi:check-circle-outline" class="text-emerald-400 shrink-0 mt-0.5 text-base" />
              {{ feature }}
            </li>
          </ul>
        </div>

        <!-- ── Right: CTA card + stat cards ───────────────────────── -->
        <div class="space-y-4">

          <!-- CTA card -->
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50
                      bg-slate-50 dark:bg-slate-900/60 overflow-hidden">

            <!-- Terminal chrome header -->
            <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <div class="flex gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
              <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">
                {{ title.toLowerCase().replace(/\s+/g, '.') }}.guide
              </span>
            </div>

            <div class="p-6">
              <div class="flex items-center gap-3 mb-5">
                <div class="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-sky-500/10">
                  <Icon :name="badgeIcon || 'mdi:package-variant-closed'" class="text-xl text-sky-400" />
                </div>
                <p class="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                  {{ tagline }}
                </p>
              </div>
              <NuxtLink
                :to="guideUrl"
                class="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl
                       font-semibold text-sm text-white bg-sky-500 hover:bg-sky-400
                       transition-colors duration-150"
              >
                <Icon name="mdi:arrow-right" class="text-base" />
                View the Guide
              </NuxtLink>
            </div>
          </div>

          <!-- Hero stat cards from slot -->
          <div class="grid grid-cols-2 gap-3">
            <slot name="right" />
          </div>

        </div>

      </div>
    </div>
  </div>
</template>
