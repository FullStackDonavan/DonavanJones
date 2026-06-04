<template>
  <section class="technical-challenges">

    <div
      class="relative overflow-hidden rounded-2xl
             border border-slate-200 dark:border-amber-500/20
             bg-white/80 dark:bg-slate-900/60"
    >

      <!-- Glow -->
      <div
        class="absolute inset-0
               bg-gradient-to-r from-amber-500/5 via-red-500/5 to-purple-500/5"
      />

      <div class="relative p-8 lg:p-10">

        <!-- HEADER -->
        <div class="mb-10">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full
                   bg-amber-500/10 text-amber-400 text-sm"
          >
            <Icon name="mdi:architecture" />
            System Architecture
          </div>

          <h2 class="mt-4 text-5xl font-bold text-slate-900 dark:text-white">
            Engineering
            <span class="block text-amber-400">Overview</span>
          </h2>

          <p class="mt-6 text-lg text-slate-600 dark:text-slate-300">
            {{ description }}
          </p>
        </div>

        <!-- CORE SYSTEM DOMAINS -->
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

          <div
            v-for="(item, i) in domains"
            :key="i"
            class="rounded-xl border border-slate-200 dark:border-slate-800
                   bg-slate-50/60 dark:bg-slate-950/30 p-5"
          >
            <Icon :name="item.icon" class="text-4xl mb-3" />

            <div class="text-lg font-semibold text-slate-900 dark:text-white">
              {{ item.title }}
            </div>

            <div class="text-xs text-slate-400 mt-1">
              {{ item.subtitle }}
            </div>

            <ul class="mt-4 space-y-1 text-sm text-slate-600 dark:text-slate-300">
              <li v-for="(point, idx) in item.points" :key="idx">
                • {{ point }}
              </li>
            </ul>
          </div>

        </div>

        <!-- STACK -->
        <div class="mt-10 pt-8 border-t border-slate-800">

          <div class="text-xs uppercase tracking-widest text-slate-500 mb-4">
            Core Technologies
          </div>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="tech in technologies"
              :key="tech"
              class="px-2 py-1 rounded-md text-xs
                     bg-slate-100 dark:bg-slate-800
                     text-slate-600 dark:text-slate-300"
            >
              {{ tech }}
            </span>
          </div>

        </div>

      </div>
    </div>

  </section>
</template>

<script setup>
defineProps({
  description: {
    type: String,
    default:
      "This system is designed around modular architecture with independent domains for AI, content, realtime systems, and infrastructure."
  },

  domains: {
    type: Array,
    default: () => []
  },

  technologies: {
    type: Array,
    default: () => []
  }
})
</script>