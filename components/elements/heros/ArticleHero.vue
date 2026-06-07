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

        <!-- ── MAIN GRID ───────────────────────────────────────────── -->
        <div class="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8 xl:gap-12 items-start">

          <!-- ── LEFT COLUMN ──────────────────────────────────────── -->
          <div class="flex flex-col">

            <!-- Badge -->
            <div
              v-if="badge"
              class="inline-flex items-center gap-2 px-3 py-1 rounded-md mb-5
                     bg-sky-100 dark:bg-sky-500/10
                     border border-sky-200 dark:border-sky-500/20
                     text-sky-700 dark:text-sky-300 text-xs font-medium self-start"
            >
              <Icon v-if="badgeIcon" :name="badgeIcon" class="text-sm" />
              {{ badge }}
            </div>

            <!-- Title -->
            <h1
              class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl
                     font-bold leading-tight
                     text-slate-900 dark:text-slate-100"
            >
              {{ title }}
              <span v-if="highlight" class="block text-sky-400 mt-1">
                {{ highlight }}
              </span>
            </h1>

            <!-- Short description -->
            <p
              v-if="description"
              class="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              {{ description }}
            </p>

            <!-- Overview block -->
            <div
              v-if="overviewDescription"
              class="mt-6 rounded-xl p-5
                     border border-slate-200 dark:border-slate-700/50
                     bg-slate-50/60 dark:bg-slate-800/20"
            >
              <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-5">
                {{ overviewDescription }}
              </p>

              <!-- Flow steps -->
              <div v-if="overviewSteps?.length">
                <div
                  v-for="(step, i) in overviewSteps"
                  :key="i"
                  class="flex gap-3"
                >
                  <div class="flex flex-col items-center flex-shrink-0">
                    <div
                      class="w-5 h-5 rounded-full flex items-center justify-center
                             text-[10px] font-bold
                             bg-sky-500/15 border border-sky-500/30 text-sky-400"
                    >
                      {{ i + 1 }}
                    </div>
                    <div
                      v-if="i < overviewSteps.length - 1"
                      class="w-px flex-1 my-1 bg-slate-200 dark:bg-slate-700"
                    />
                  </div>
                  <p class="text-sm text-slate-600 dark:text-slate-300 pb-3 pt-0.5 leading-relaxed">
                    {{ step }}
                  </p>
                </div>
              </div>

              <!-- Summary callout -->
              <div
                v-if="overviewSummary"
                class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/50"
              >
                <p class="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">
                  {{ overviewSummary }}
                </p>
              </div>
            </div>

            <!-- Default slot -->
            <div v-if="$slots.default" class="mt-6">
              <slot />
            </div>

          </div>

          <!-- ── RIGHT COLUMN ─────────────────────────────────────── -->
          <div
            v-if="$slots.right || frontend?.length || backend?.length || cloud?.length || ai?.length"
            class="rounded-2xl border border-slate-200 dark:border-slate-700/50"
          >

            <!-- Hero stat strip -->
            <div
              v-if="$slots.right"
              class="flex flex-wrap gap-3 justify-around px-5 py-5
                     rounded-t-2xl
                     border-b border-slate-200 dark:border-slate-700/50
                     bg-white/70 dark:bg-slate-800/40"
            >
              <slot name="right" />
            </div>

            <!-- System Snapshot -->
            <div
              v-if="frontend?.length || backend?.length || cloud?.length || ai?.length"
              class="p-5 bg-slate-50/60 dark:bg-slate-950/30"
              :class="$slots.right ? 'rounded-b-2xl' : 'rounded-2xl'"
            >

              <div class="flex items-center gap-3 mb-5">
                <span class="text-xs uppercase tracking-widest font-medium text-slate-400">
                  System Snapshot
                </span>
                <div class="flex-1 h-px bg-slate-200 dark:bg-slate-700/50" />
              </div>

              <div class="flex flex-wrap gap-x-5 gap-y-6">

                <div v-if="frontend?.length" class="snap-col">
                  <div class="text-[11px] font-semibold uppercase tracking-wider text-sky-400 mb-2">Frontend</div>
                  <ul class="space-y-1.5">
                    <li v-for="item in frontend" :key="item"
                        class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span class="w-1 h-1 rounded-full bg-sky-400 flex-shrink-0" />{{ item }}
                    </li>
                  </ul>
                </div>

                <div v-if="backend?.length" class="snap-col">
                  <div class="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 mb-2">Backend</div>
                  <ul class="space-y-1.5">
                    <li v-for="item in backend" :key="item"
                        class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span class="w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />{{ item }}
                    </li>
                  </ul>
                </div>

                <div v-if="cloud?.length" class="snap-col">
                  <div class="text-[11px] font-semibold uppercase tracking-wider text-purple-400 mb-2">Infrastructure</div>
                  <ul class="space-y-1.5">
                    <li v-for="item in cloud" :key="item"
                        class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span class="w-1 h-1 rounded-full bg-purple-400 flex-shrink-0" />{{ item }}
                    </li>
                  </ul>
                </div>

                <div v-if="ai?.length" class="snap-col">
                  <div class="text-[11px] font-semibold uppercase tracking-wider text-amber-400 mb-2">AI</div>
                  <ul class="space-y-1.5">
                    <li v-for="item in ai" :key="item"
                        class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span class="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />{{ item }}
                    </li>
                  </ul>
                </div>

              </div>

              <!-- Use Cases -->
              <div
                v-if="useCase?.length"
                class="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700/50"
              >
                <div class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Use Cases</div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="item in useCase" :key="item"
                    class="text-xs px-2.5 py-1 rounded-lg
                           bg-white dark:bg-slate-900/60
                           text-slate-600 dark:text-slate-300
                           border border-slate-200 dark:border-slate-700/50"
                  >{{ item }}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        <!-- ── PROJECT SCOPE (full width) ─────────────────────────── -->
        <div
          v-if="projectScope?.length"
          class="mt-8 pt-7 border-t border-slate-200 dark:border-slate-700/50"
        >
          <div class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Project Scope</div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="item in projectScope" :key="item"
              class="px-3 py-1 rounded-full text-xs font-medium
                     bg-sky-500/10 text-sky-600 dark:text-sky-300
                     border border-sky-500/20"
            >{{ item }}</span>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title:               String,
  highlight:           String,
  description:         String,
  badge:               String,
  badgeIcon:           String,
  overviewDescription: String,
  overviewSummary:     String,
  overviewSteps:       { type: Array, default: () => [] },
  useCase:             { type: Array, default: () => [] },
  projectScope:        { type: Array, default: () => [] },
  frontend:            { type: Array, default: () => [] },
  backend:             { type: Array, default: () => [] },
  cloud:               { type: Array, default: () => [] },
  ai:                  { type: Array, default: () => [] },
})
</script>

<style scoped>
:deep(.hero-stat) {
  flex: 1 1 110px;
  min-width: 100px;
  max-width: 160px;
  text-align: center;
}

.snap-col {
  flex: 1 1 130px;
  min-width: 120px;
}
</style>
