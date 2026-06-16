<template>
  <section class="mb-8">
    <div
      class="relative overflow-hidden rounded-2xl
             border border-slate-200 dark:border-sky-500/20
             bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm"
    >
      <!-- Ambient glow -->
      <div
        class="pointer-events-none absolute inset-0
               bg-gradient-to-br from-sky-200/20 via-purple-200/10 to-emerald-200/10
               dark:from-sky-500/5 dark:via-purple-500/5 dark:to-emerald-500/5"
      />

      <div class="relative p-5 sm:p-7 lg:p-10">
        <div class="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8 xl:gap-12 items-start">

          <!-- ── LEFT COLUMN ──────────────────────────────────────── -->
          <div class="flex flex-col">

            <!-- Badge + price -->
            <div class="flex items-center gap-3 mb-5 flex-wrap">
              <div
                v-if="badge"
                class="inline-flex items-center gap-2 px-3 py-1 rounded-md
                       bg-sky-100 dark:bg-sky-500/10
                       border border-sky-200 dark:border-sky-500/20
                       text-sky-700 dark:text-sky-300 text-xs font-medium"
              >
                <Icon v-if="badgeIcon" :name="badgeIcon" class="text-sm" />
                {{ badge }}
              </div>

              <div
                v-if="price"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold
                       bg-emerald-50 dark:bg-emerald-500/10
                       border border-emerald-200 dark:border-emerald-500/25
                       text-emerald-700 dark:text-emerald-400"
              >
                <Icon name="mdi:tag-outline" class="text-sm" />
                {{ price }} one-time
              </div>
            </div>

            <!-- Title -->
            <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-slate-900 dark:text-slate-100">
              {{ title }}
              <span v-if="tagline" class="block text-sky-400 mt-1 text-2xl sm:text-3xl lg:text-4xl">
                {{ tagline }}
              </span>
            </h1>

            <!-- Description -->
            <p v-if="description" class="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ description }}
            </p>

            <!-- Features -->
            <div v-if="features?.length" class="mt-6 rounded-xl p-5 border border-slate-200 dark:border-slate-700/50 bg-slate-50/60 dark:bg-slate-800/20">
              <div class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">What's Inside</div>
              <ul class="space-y-2.5">
                <li v-for="(item, i) in features" :key="i" class="flex gap-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <Icon name="mdi:check-circle-outline" class="text-emerald-500 text-base flex-shrink-0 mt-0.5" />
                  {{ item }}
                </li>
              </ul>
            </div>

            <!-- CTA -->
            <div class="mt-6">
              <NuxtLink
                :to="ctaUrl || '/hire-me'"
                class="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold
                       bg-sky-500 text-white hover:bg-sky-400 transition-colors duration-150"
              >
                {{ ctaButtonText || "Let's Talk" }}
                <Icon name="mdi:arrow-right" class="text-base" />
              </NuxtLink>
            </div>

            <!-- Default slot -->
            <div v-if="$slots.default" class="mt-6">
              <slot />
            </div>

          </div>

          <!-- ── RIGHT COLUMN ─────────────────────────────────────── -->
          <div
            v-if="$slots.right || format || relatedCategoryLabel"
            class="rounded-2xl border border-slate-200 dark:border-slate-700/50"
          >
            <div
              v-if="$slots.right"
              class="flex flex-wrap gap-3 justify-around px-5 py-5
                     rounded-t-2xl border-b border-slate-200 dark:border-slate-700/50
                     bg-white/70 dark:bg-slate-800/40"
            >
              <slot name="right" />
            </div>

            <div
              v-if="format || relatedCategoryLabel"
              class="p-5 bg-slate-50/60 dark:bg-slate-950/30"
              :class="$slots.right ? 'rounded-b-2xl' : 'rounded-2xl'"
            >
              <div class="flex items-center gap-3 mb-5">
                <span class="text-xs uppercase tracking-widest font-medium text-slate-400">Details</span>
                <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700/50" />
              </div>

              <ul class="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <li v-if="format" class="flex items-center gap-2.5">
                  <Icon name="mdi:package-variant-closed" class="text-sky-400 flex-shrink-0" />
                  Delivered as {{ format }}
                </li>
                <li v-if="relatedCategoryLabel" class="flex items-center gap-2.5">
                  <Icon name="mdi:book-open-page-variant-outline" class="text-sky-400 flex-shrink-0" />
                  Based on the
                  <NuxtLink :to="relatedCategoryUrl || '/categories'" class="text-sky-500 hover:text-sky-400 font-medium">
                    {{ relatedCategoryLabel }}
                  </NuxtLink>
                  series
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title:                String,
  tagline:               String,
  description:           String,
  badge:                  String,
  badgeIcon:              String,
  price:                  String,
  format:                 String,
  ctaButtonText:          String,
  ctaUrl:                 String,
  relatedCategoryLabel:   String,
  relatedCategoryUrl:     String,
  features:               { type: Array, default: () => [] },
})
</script>

<style scoped>
:deep(.hero-stat) {
  flex: 1 1 110px;
  min-width: 100px;
  max-width: 160px;
  text-align: center;
}
</style>
