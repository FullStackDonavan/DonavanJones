<template>
  <section class="system-overview">
    <div
      class="relative z-10 mb-8 overflow-hidden rounded-2xl
             border border-slate-200 dark:border-sky-500/20
             bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm"
    >
      <!-- Glow -->
      <div
        class="absolute inset-0
               bg-gradient-to-r from-sky-200/20 via-purple-200/10 to-emerald-200/10
               dark:from-sky-500/5 dark:via-purple-500/5 dark:to-emerald-500/5"
      />

      <div class="relative p-8 lg:p-10">

        <div class="grid lg:grid-cols-[1.5fr_1fr] gap-10 items-start">

          <!-- LEFT -->
          <div>

            <!-- BADGE -->
            <div
              v-if="badge"
              class="inline-flex items-center gap-2 px-3 py-1 rounded-md mb-4
                     bg-sky-100 dark:bg-sky-500/10
                     border border-sky-200 dark:border-sky-500/20
                     text-sky-700 dark:text-sky-300 text-sm"
            >
              <Icon v-if="badgeIcon" :name="badgeIcon" />
              {{ badge }}
            </div>

            <!-- TITLE -->
            <h2
              class="text-4xl md:text-5xl lg:text-6xl
                     font-bold leading-tight
                     text-slate-900 dark:text-slate-100"
            >
              {{ title }}
              <span v-if="highlight" class="block text-sky-400">
                {{ highlight }}
              </span>
            </h2>

            <!-- DESCRIPTION -->
            <p
              v-if="description"
              class="mt-6 max-w-2xl text-lg
                     text-slate-700 dark:text-slate-300 leading-relaxed"
            >
              {{ description }}
            </p>

            <!-- 🔥 SYSTEM SNAPSHOT STRIP -->
            <div
              v-if="frontend?.length || backend?.length || cloud?.length || ai?.length"
              class="mt-8 rounded-xl border border-slate-200 dark:border-slate-800
                     bg-slate-50/60 dark:bg-slate-950/30
                     p-5 backdrop-blur"
            >

              <div class="text-xs uppercase tracking-widest text-slate-500 mb-4">
                System Snapshot
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">

                <div v-if="frontend?.length">
                  <div class="text-xs text-sky-400 mb-1">Frontend</div>
                  <div class="text-sm text-slate-700 dark:text-slate-200">
                    {{ frontend.join(' · ') }}
                  </div>
                </div>

                <div v-if="backend?.length">
                  <div class="text-xs text-emerald-400 mb-1">Backend</div>
                  <div class="text-sm text-slate-700 dark:text-slate-200">
                    {{ backend.join(' · ') }}
                  </div>
                </div>

                <div v-if="cloud?.length">
                  <div class="text-xs text-purple-400 mb-1">Infra</div>
                  <div class="text-sm text-slate-700 dark:text-slate-200">
                    {{ cloud.join(' · ') }}
                  </div>
                </div>

                <div v-if="ai?.length">
                  <div class="text-xs text-amber-400 mb-1">AI</div>
                  <div class="text-sm text-slate-700 dark:text-slate-200">
                    {{ ai.join(' · ') }}
                  </div>
                </div>

              </div>

            </div>

            <!-- SLOT -->
            <div v-if="$slots.default" class="mt-10">
              <slot />
            </div>

          </div>

          <!-- RIGHT (CARDS SLOT) -->
          <div
            v-if="$slots.right"
            class="grid grid-cols-2 gap-4 p-4
                   rounded-2xl border
                   border-slate-300 dark:border-slate-800/60
                   bg-slate-50/80 dark:bg-slate-950/30
                   backdrop-blur-sm"
          >
            <slot name="right" />
          </div>

        </div>

        <!-- STACK WRAPPER -->
        <div
          v-if="projectScope?.length"
          class="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800"
        >

          <div class="text-xs uppercase tracking-widest text-slate-500 mb-4">
            Project Scope
          </div>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="item in projectScope"
              :key="item"
              class="px-3 py-1 rounded-full text-xs font-medium
                     bg-sky-500/10 text-sky-300 border border-sky-500/20"
            >
              {{ item }}
            </span>
          </div>

        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: String,
  highlight: String,
  description: String,

  badge: String,
  badgeIcon: String,

  stack: {
    type: Array,
    default: () => []
  },

  projectScope: {
    type: Array,
    default: () => []
  },

  frontend: {
    type: Array,
    default: () => []
  },

  backend: {
    type: Array,
    default: () => []
  },

  cloud: {
    type: Array,
    default: () => []
  },

  ai: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.tech-pill {
  @apply px-2 py-1 rounded-md text-xs
         bg-slate-100 dark:bg-slate-800
         text-slate-600 dark:text-slate-300;
}
</style>