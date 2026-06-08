<template>
  <div class="mt-12 rounded-2xl border border-purple-500/20 bg-white dark:bg-slate-900/60 overflow-hidden">

    <!-- Header bar -->
    <div class="px-6 py-3 bg-purple-500/10 border-b border-purple-500/20 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Icon name="mdi:briefcase-outline" class="text-purple-400 text-sm" />
        <h3 class="text-xs font-semibold text-purple-400 uppercase tracking-wider">Case Study</h3>
      </div>
      <span class="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border bg-green-500/10 border-green-500/20 text-green-400">
        <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
        In Progress
      </span>
    </div>

    <div class="p-6 sm:p-8">

      <!-- Title row -->
      <div class="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
        <div class="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
          <Icon name="mdi:book-open-page-variant" class="text-purple-400 text-2xl" />
        </div>
        <div>
          <p class="text-xl font-bold text-slate-900 dark:text-white mb-0.5">Bible Verse — Case Study</p>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Production SaaS Platform · Full-Stack · Founder &amp; Sole Engineer
          </p>
        </div>
      </div>

      <!-- Description -->
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
        A domain-driven SaaS platform with five independently scalable system boundaries: scripture
        content delivery, RAG-backed AI study, real-time community interaction, async media
        processing, and infrastructure services — built and operated end-to-end.
      </p>

      <!-- Our Results -->
      <div class="mb-6">
        <h4 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Our Results</h4>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 p-3 text-center"
          >
            <div class="text-lg font-bold text-slate-900 dark:text-white">{{ stat.value }}</div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- How We Solved It -->
      <div class="mb-6">
        <h4 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">How We Built It</h4>
        <ul class="space-y-2">
          <li
            v-for="challenge in challenges"
            :key="challenge.text"
            class="flex items-start gap-2.5"
          >
            <div
              class="mt-0.5 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border"
              :class="challenge.colorClasses"
            >
              <Icon :name="challenge.icon" class="text-[10px]" />
            </div>
            <span class="text-sm text-slate-600 dark:text-slate-400 leading-snug">{{ challenge.text }}</span>
          </li>
        </ul>
      </div>

      <!-- Lessons Learned -->
      <div class="mb-6 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/40 p-4">
        <h4 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Lessons Learned</h4>
        <ul class="space-y-1.5">
          <li
            v-for="lesson in lessons"
            :key="lesson"
            class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
          >
            <Icon name="mdi:lightbulb-outline" class="text-amber-400 text-base flex-shrink-0 mt-0.5" />
            {{ lesson }}
          </li>
        </ul>
      </div>

      <!-- Tech stack -->
      <div class="mb-6">
        <h4 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Stack</h4>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="tag in stack"
            :key="tag"
            class="text-[11px] px-2 py-0.5 rounded-md border bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/50"
          >{{ tag }}</span>
        </div>
      </div>

      <!-- CTA -->
      <NuxtLink
        to="/projects/bible-verse"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
               bg-purple-500/10 border border-purple-500/20 text-purple-400
               hover:bg-purple-500/20 hover:border-purple-500/40 transition-all duration-200"
      >
        <Icon name="mdi:arrow-right-circle-outline" class="text-base" />
        View Full Case Study
      </NuxtLink>

    </div>
  </div>
</template>

<script setup lang="ts">
const stats = [
  { value: '37K+', label: 'Verses Indexed' },
  { value: '5',    label: 'AI Models' },
  { value: '5',    label: 'Bounded Domains' },
  { value: '3',    label: 'Job Queues' },
]

const challenges = [
  {
    icon: 'mdi:database-search',
    text: 'RAG pipeline grounding AI responses in actual scripture rather than model memory',
    colorClasses: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  },
  {
    icon: 'mdi:brain',
    text: 'Hybrid Llama / OpenAI routing — local inference for cost, API fallback for quality at the edge',
    colorClasses: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
  },
  {
    icon: 'mdi:swap-horizontal',
    text: 'Non-blocking media processing — FFmpeg jobs enqueued via BullMQ, API never waits on transcoding',
    colorClasses: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  },
  {
    icon: 'mdi:access-point',
    text: 'Cross-instance real-time consistency via Redis pub/sub behind WebSocket and WebRTC layers',
    colorClasses: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  },
]

const lessons = [
  'Domain boundaries enforced at the service layer prevent coupling long before scale demands microservices.',
  'RAG retrieval quality matters more than model size — better embeddings outperform a larger model on poor context.',
  'Async queue design should be first-class, not bolted on; BullMQ worker isolation saved the request path repeatedly.',
]

const stack = [
  'Nuxt 3', 'TypeScript', 'Nitro', 'PostgreSQL', 'Prisma',
  'Redis', 'BullMQ', 'Weaviate', 'MinIO', 'FFmpeg',
  'WebRTC', 'WebSockets', 'Llama 3.2', 'OpenAI API', 'Kubernetes',
]
</script>
