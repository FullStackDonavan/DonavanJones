<template>
  <div class="system-overview">
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
              v-if="title"
              class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight
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

            <!-- FLOW / LIFECYCLE -->
            <div v-if="flow?.length" class="mt-10">

              <div class="text-xs uppercase tracking-widest text-slate-500 mb-4">
                {{ flowTitle || 'Overview Flow' }}
              </div>

              <div class="space-y-3">
                <div
                  v-for="(step, i) in flow"
                  :key="i"
                  class="flex items-start gap-3"
                >
                  <div
                    class="mt-1 w-5 h-5 rounded-full
                           bg-sky-500/10 text-sky-500
                           flex items-center justify-center text-xs font-semibold"
                  >
                    {{ i + 1 }}
                  </div>

                  <div class="text-sm text-slate-700 dark:text-slate-200">
                    {{ step }}
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- RIGHT CARDS -->
          <div
            v-if="cards?.length"
            class="grid grid-cols-2 gap-4 p-4 rounded-2xl
                   border border-slate-300 dark:border-slate-800/60
                   bg-slate-50/80 dark:bg-slate-950/30"
          >

            <div
              v-for="card in cards"
              :key="card.title"
              class="rounded-xl p-4 border border-slate-300 dark:border-slate-800
                     bg-slate-100 dark:bg-slate-900/40"
            >
              <div class="flex items-center justify-between pb-3 border-b border-slate-800/20">

                <Icon v-if="card.icon" :name="card.icon" class="text-4xl" />

                <span class="text-xs uppercase tracking-widest text-slate-600 dark:text-slate-300">
                  {{ card.title }}
                </span>
              </div>

              <div class="mt-4">
                <div class="text-sm text-slate-700 dark:text-slate-200">
                  {{ card.value }}
                </div>
                <div class="text-xs text-slate-500 mt-1">
                  {{ card.subtitle }}
                </div>
              </div>
            </div>

          </div>

        </div>

        <!-- STACK -->
        <div
          v-if="stack?.length"
          class="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800"
        >
          <div class="text-xs uppercase tracking-widest text-slate-500 mb-4">
            Technology Stack
          </div>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="item in stack"
              :key="item"
              class="px-2 py-1 rounded-md text-xs
                     bg-slate-100 dark:bg-slate-800
                     text-slate-600 dark:text-slate-300"
            >
              {{ item }}
            </span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  highlight: String,
  description: String,

  badge: String,
  badgeIcon: String,

  flowTitle: String,
  flow: {
    type: Array,
    default: () => []
  },

  cards: {
    type: Array,
    default: () => []
  },

  stack: {
    type: Array,
    default: () => []
  }
})
</script>