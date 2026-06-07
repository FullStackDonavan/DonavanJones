<template>
  <section>
    <div
      class="relative overflow-hidden rounded-2xl
             border border-slate-200 dark:border-amber-500/20
             bg-white/80 dark:bg-slate-900/60"
    >
      <!-- Glow -->
      <div
        class="pointer-events-none absolute inset-0
               bg-gradient-to-r from-amber-500/5 via-red-500/5 to-purple-500/5"
      />

      <div class="relative p-8 lg:p-10">

        <!-- HEADER -->
        <div class="mb-10">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4
                   bg-amber-500/10 text-amber-400 text-sm"
          >
            <Icon name="mdi:architecture" />
            System Architecture
          </div>

          <h2 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white not-prose">
            Engineering
            <span class="block text-amber-400">Overview</span>
          </h2>

          <p class="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            {{ description }}
          </p>
        </div>

        <!-- Domain cards -->
        <div class="grid md:grid-cols-2 gap-5 mb-8">
          <div
            v-for="(item, i) in domains"
            :key="i"
            class="rounded-xl border border-slate-200 dark:border-slate-800
                   bg-white dark:bg-slate-900/60 p-6 flex flex-col gap-4"
          >
            <!-- Icon + title -->
            <div class="flex items-start gap-4">
              <div
                class="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 border"
                :class="[colors(item.color).bg, colors(item.color).border]"
              >
                <Icon :name="item.icon" class="text-2xl" :class="colors(item.color).icon" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-slate-900 dark:text-white leading-snug not-prose">
                  {{ item.title }}
                </h3>
                <p class="text-xs mt-0.5" :class="colors(item.color).icon">
                  {{ item.subtitle }}
                </p>
              </div>
            </div>

            <!-- Points -->
            <ul class="space-y-1.5">
              <li
                v-for="(point, idx) in item.points"
                :key="idx"
                class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
              >
                <span class="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" :class="colors(item.color).dot" />
                {{ point }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Technologies strip -->
        <div class="pt-8 border-t border-slate-200 dark:border-slate-800">
          <div class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Core Technologies
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tech in technologies"
              :key="tech"
              class="px-2.5 py-1 rounded-lg text-xs
                     bg-slate-100 dark:bg-slate-800
                     text-slate-600 dark:text-slate-300
                     border border-slate-200 dark:border-slate-700/50"
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
  description:  { type: String, default: '' },
  domains:      { type: Array,  default: () => [] },
  technologies: { type: Array,  default: () => [] },
})

const palette = {
  sky:    { bg: 'bg-sky-500/10',     border: 'border-sky-500/20',     icon: 'text-sky-400',     dot: 'bg-sky-400' },
  violet: { bg: 'bg-violet-500/10',  border: 'border-violet-500/20',  icon: 'text-violet-400',  dot: 'bg-violet-400' },
  cyan:   { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20',    icon: 'text-cyan-400',    dot: 'bg-cyan-400' },
  emerald:{ bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-400', dot: 'bg-emerald-400' },
  amber:  { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   icon: 'text-amber-400',   dot: 'bg-amber-400' },
  purple: { bg: 'bg-purple-500/10',  border: 'border-purple-500/20',  icon: 'text-purple-400',  dot: 'bg-purple-400' },
  blue:   { bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    icon: 'text-blue-400',    dot: 'bg-blue-400' },
  rose:   { bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    icon: 'text-rose-400',    dot: 'bg-rose-400' },
  slate:  { bg: 'bg-slate-500/10',   border: 'border-slate-500/20',   icon: 'text-slate-400',   dot: 'bg-slate-400' },
}

function colors(key) {
  return palette[key] ?? palette.slate
}
</script>
