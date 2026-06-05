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

           
<!-- ARTICLE OVERVIEW HERO -->
<div
  v-if="overviewDescription"
  class="rounded-2xl mt-8"
>


  <!-- MAIN DESCRIPTION -->
  <p class="text-base md:text-lg text-slate-700 dark:text-slate-200 leading-relaxed mb-5">
    {{ overviewDescription }}
  </p>

  <!-- FLOW STEPS -->
  <div v-if="overviewSteps?.length" class="space-y-3 mb-5">

    <div
      v-for="(step, i) in overviewSteps"
      :key="i"
      class="flex items-start gap-3"
    >
      <div class="mt-1 w-5 h-5 rounded-full bg-sky-500/10 text-sky-500
                  flex items-center justify-center text-xs font-semibold">
        {{ i + 1 }}
      </div>

      <div class="text-sm text-slate-700 dark:text-slate-200">
        {{ step }}
      </div>
    </div>

  </div>

  <!-- EMPTY STATE -->
  <div v-else>
    <p class="text-sm text-slate-500 italic">
      No steps defined.
    </p>
  </div>

  <!-- SUMMARY -->
  <div
    v-if="overviewSummary"
    class="pt-4 border-t border-slate-200 dark:border-slate-800"
  >
    <p class="text-sm text-slate-600 dark:text-slate-300 italic">
      {{ overviewSummary }}
    </p>
  </div>

</div>


            <!-- SLOT -->
            <div v-if="$slots.default" class="mt-10">
              <slot />
            </div>

          </div>
<div
  v-if="$slots.right || frontend?.length || backend?.length || cloud?.length || ai?.length"
  class="flex flex-col"
>

  <!-- HEADER STRIP -->
  <div
    v-if="$slots.right"
    class="flex items-center justify-between w-full px-5 py-4
           rounded-t-2xl
           border border-b-0
           border-slate-300 dark:border-slate-800
           bg-gradient-to-r
           from-slate-100 to-slate-50
           dark:from-slate-900 dark:to-slate-950
           backdrop-blur-sm"
  >
    <slot name="right" />
  </div>

<!-- SYSTEM SNAPSHOT -->
<div
  v-if="frontend?.length || backend?.length || cloud?.length || ai?.length"
  class="rounded-b-2xl
         border border-slate-300 dark:border-slate-800
         bg-slate-50/60 dark:bg-slate-950/30
         p-5 backdrop-blur"
>

  <!-- HEADER -->
  <div class="flex items-center justify-between mb-4">
    <div class="text-xs uppercase tracking-widest text-slate-500">
      System Snapshot
    </div>

    <div class="h-px flex-1 ml-4 bg-slate-200 dark:bg-slate-800"></div>
  </div>

  <!-- MAIN GRID -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-6">

    <!-- Frontend -->
    <div v-if="frontend?.length">
      <div class="text-xs font-medium text-sky-400 mb-2">
        Frontend
      </div>
      <ul class="space-y-1">
        <li
          v-for="item in frontend"
          :key="item"
          class="text-sm text-slate-700 dark:text-slate-200 before:content-['•'] before:mr-2 before:text-slate-400"
        >
          {{ item }}
        </li>
      </ul>
    </div>

    <!-- Backend -->
    <div v-if="backend?.length">
      <div class="text-xs font-medium text-emerald-400 mb-2">
        Backend
      </div>
      <ul class="space-y-1">
        <li
          v-for="item in backend"
          :key="item"
          class="text-sm text-slate-700 dark:text-slate-200 before:content-['•'] before:mr-2 before:text-slate-400"
        >
          {{ item }}
        </li>
      </ul>
    </div>

    <!-- Infra -->
    <div v-if="cloud?.length">
      <div class="text-xs font-medium text-purple-400 mb-2">
        Infrastructure
      </div>
      <ul class="space-y-1">
        <li
          v-for="item in cloud"
          :key="item"
          class="text-sm text-slate-700 dark:text-slate-200 before:content-['•'] before:mr-2 before:text-slate-400"
        >
          {{ item }}
        </li>
      </ul>
    </div>

    <!-- AI -->
    <div v-if="ai?.length">
      <div class="text-xs font-medium text-amber-400 mb-2">
        AI
      </div>
      <ul class="space-y-1">
        <li
          v-for="item in ai"
          :key="item"
          class="text-sm text-slate-700 dark:text-slate-200 before:content-['•'] before:mr-2 before:text-slate-400"
        >
          {{ item }}
        </li>
      </ul>
    </div>

  </div>

  <!-- FOOTER: USE CASES STRIP -->
  <div
    v-if="useCase?.length"
    class="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800"
  >
    <div class="text-xs uppercase tracking-widest text-slate-500 mb-3">
      Use Cases
    </div>

    <div class="flex flex-wrap gap-2">
      <span
        v-for="item in useCase"
        :key="item"
        class="text-xs px-2 py-1 rounded-md
               bg-slate-100 dark:bg-slate-900
               text-slate-600 dark:text-slate-300
               border border-slate-200 dark:border-slate-800"
      >
        {{ item }}
      </span>
    </div>
  </div>

</div>


  

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
  overviewDescription: String,
  overviewSummary: String,
  overviewSteps: {
    type: Array,
    default: () => []
  },


 useCase: {
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