<script setup lang="ts">
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'
useSeoMeta({
  title: 'Local Vibe Coding — Donavan Jones',
  description: 'A local AI coding environment built on a draft/verify Ornith model pair, Ollama, and a custom agent (OpenClaw) — running on a hybrid Jetson Orin / RTX 3090 cluster instead of a hosted subscription.',
  ogTitle: 'Local Vibe Coding — Donavan Jones',
  ogDescription: 'Local AI coding patterns — Ornith-9B drafting and Ornith-1.0-35B verifying on Ollama, a custom agent loop, and hybrid GPU routing across a home AI cluster.',
  ogType: 'website',
  ogImage: `${_SITE}/img/logo.png`,
  ogUrl: `${_SITE}/systems/local-vibe-coding`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Local Vibe Coding — Donavan Jones',
  twitterDescription: 'Local AI coding — Ornith-9B/Ornith-1.0-35B, Ollama, a custom agent, and hybrid GPU routing.',
  canonical: `${_SITE}/systems/local-vibe-coding`,
})

const principles = [
  { icon: 'mdi:layers-triple',    color: 'emerald', text: 'Route by task type — pattern-following work stays local, hard reasoning goes hosted' },
  { icon: 'mdi:shield-check',     color: 'sky',     text: 'Confirmation-gate any destructive or hard-to-reverse tool call before it executes' },
  { icon: 'mdi:chip',             color: 'amber',   text: 'Match hardware tier to role — fast drafting on the always-on Jetson tier, heavier verification on the GPU with headroom' },
  { icon: 'mdi:lock',             color: 'purple',  text: 'Nothing leaves the network — privacy is a property of the whole stack, not just the model' },
]

const areas = [
  {
    icon: 'mdi:brain', color: 'purple',
    title: 'Models',
    desc: 'Ornith-9B drafts, Ornith-1.0-35B verifies — both quantized and served locally via Ollama.',
    tags: ['Ornith-9B', 'Ornith-1.0-35B', 'Ollama'],
  },
  {
    icon: 'mdi:robot', color: 'sky',
    title: 'Agent Loop',
    desc: 'OpenClaw — a from-scratch coding agent with tool calling and a confirmation-gated permission model.',
    tags: ['OpenClaw', 'Tool Use', 'Permissions'],
  },
  {
    icon: 'mdi:database-search', color: 'emerald',
    title: 'Retrieval',
    desc: 'Function/class-level codebase indexing so the agent has real project context, not just a training-time prior.',
    tags: ['AST Chunking', 'Embeddings', 'Search'],
  },
  {
    icon: 'mdi:expansion-card', color: 'amber',
    title: 'Hardware',
    desc: 'A hybrid RTX 3090 / Jetson Orin cluster, routed by workload latency and concurrency needs.',
    tags: ['RTX 3090', 'Jetson Orin', 'k3s'],
  },
]

const failures = [
  { icon: 'mdi:memory',          color: 'rose',   text: 'VRAM contention between interactive sessions and background jobs' },
  { icon: 'mdi:file-question',   color: 'amber',  text: 'Model reinventing utilities that already exist without codebase retrieval' },
  { icon: 'mdi:infinity',        color: 'purple', text: 'Agent loops that never terminate without a hard iteration cap' },
  { icon: 'mdi:shield-alert',    color: 'sky',     text: 'Ungated shell access executing a destructive command unattended' },
]

const usageMetrics = [
  { value: '~80%',  label: 'Coding requests handled locally' },
  { value: '24GB',  label: 'VRAM on the verification GPU' },
  { value: '9B/35B', label: 'Draft / verify model tiers' },
  { value: '3',     label: 'Jetson nodes in the always-on tier' },
]

const stack = [
  'Ornith-9B', 'Ornith-1.0-35B', 'Ollama', 'OpenClaw', 'RTX 3090', 'NVIDIA Jetson Orin Nano Super',
  'k3s', 'Python', 'CUDA', 'GGUF Quantization',
]

const faqs = [
  {
    question: 'Can a local model actually replace Claude Code?',
    answer: 'For high-volume, pattern-following coding work — yes, for a meaningful share of daily requests. For the hardest reasoning tasks, a hosted frontier model remains stronger, so the realistic setup is hybrid rather than a full replacement.'
  },
  {
    question: 'What hardware does this run on?',
    answer: 'A hybrid tier: a cluster of Jetson Orin Nano Super boards runs Ornith-9B for fast first-pass drafting plus retrieval and embeddings, while an RTX 3090 (24GB VRAM) runs Ornith-1.0-35B to verify each draft before it reaches a human.'
  },
  {
    question: 'Is this actually cheaper than a subscription?',
    answer: 'Over a 12-18 month horizon, for someone already using AI coding tools daily, yes — the hardware cost is amortized against displaced subscription/API spend, with electricity as the only meaningful ongoing cost.'
  },
  {
    question: 'What is OpenClaw?',
    answer: 'A custom-built coding agent — the same read-plan-edit-verify loop popularized by tools like Claude Code, but drafting with a small local model and verifying with a larger one before anything reaches a human, instead of a single hosted API call.'
  },
]

useHead({
  script: [
    {
      key: 'faq-jsonld',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }),
    },
  ],
})
</script>

<template>
  <PatternSection>
    <LocalVibeCodingHero />
    <Breadcrumbs parentTitle="Systems" parentUrl="/system-overview" currentPageTitle="Local Vibe Coding" />

    <div class="mx-auto max-w-7xl px-6 py-14">

      <!-- HEADER -->
      <div class="mb-12">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4
                 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm"
        >
          <Icon name="mdi:laptop" class="text-sm" />
          Local Vibe Coding
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
          A Local AI Coding Environment
        </h1>
        <p class="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Ornith-9B drafting and Ornith-1.0-35B verifying on Ollama, a custom agent loop, and a hybrid Jetson/RTX 3090 cluster —
          replacing most day-to-day hosted AI coding usage with infrastructure I own.
        </p>
      </div>

      <!-- PRINCIPLES + FAILURES -->
      <div class="grid md:grid-cols-2 gap-5 mb-10">

        <div
          class="rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
          <div class="flex items-center gap-3 mb-5">
            <div class="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Icon name="mdi:compass" class="text-emerald-400 text-lg" />
            </div>
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Core Principles</h2>
          </div>
          <ul class="space-y-3">
            <li v-for="p in principles" :key="p.text" class="flex items-start gap-3">
              <div
                class="mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 border"
                :class="{
                  'bg-emerald-500/10 border-emerald-500/20': p.color === 'emerald',
                  'bg-sky-500/10 border-sky-500/20':       p.color === 'sky',
                  'bg-amber-500/10 border-amber-500/20':   p.color === 'amber',
                  'bg-purple-500/10 border-purple-500/20': p.color === 'purple',
                }"
              >
                <Icon :name="p.icon" class="text-xs"
                  :class="{
                    'text-emerald-400': p.color === 'emerald',
                    'text-sky-400':    p.color === 'sky',
                    'text-amber-400':  p.color === 'amber',
                    'text-purple-400':p.color === 'purple',
                  }"
                />
              </div>
              <span class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ p.text }}</span>
            </li>
          </ul>
        </div>

        <div
          class="rounded-2xl p-6 border border-slate-200 dark:border-rose-500/20
                 bg-white dark:bg-slate-900/60"
        >
          <div class="flex items-center gap-3 mb-5">
            <div class="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <Icon name="mdi:alert-circle-outline" class="text-rose-400 text-lg" />
            </div>
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Common Failure Modes</h2>
          </div>
          <ul class="space-y-3">
            <li v-for="f in failures" :key="f.text" class="flex items-start gap-3">
              <div
                class="mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 border"
                :class="{
                  'bg-rose-500/10 border-rose-500/20':     f.color === 'rose',
                  'bg-amber-500/10 border-amber-500/20':   f.color === 'amber',
                  'bg-purple-500/10 border-purple-500/20': f.color === 'purple',
                  'bg-sky-500/10 border-sky-500/20':       f.color === 'sky',
                }"
              >
                <Icon :name="f.icon" class="text-xs"
                  :class="{
                    'text-rose-400':   f.color === 'rose',
                    'text-amber-400':  f.color === 'amber',
                    'text-purple-400': f.color === 'purple',
                    'text-sky-400':    f.color === 'sky',
                  }"
                />
              </div>
              <span class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ f.text }}</span>
            </li>
          </ul>
        </div>

      </div>

      <!-- ARCHITECTURE AREAS -->
      <section class="mb-10">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-5">System Architecture Areas</h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="area in areas"
            :key="area.title"
            class="rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60 flex flex-col gap-3
                   hover:border-emerald-500/40 transition-all duration-200"
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center border"
              :class="{
                'bg-purple-500/10 border-purple-500/20': area.color === 'purple',
                'bg-sky-500/10 border-sky-500/20':       area.color === 'sky',
                'bg-emerald-500/10 border-emerald-500/20': area.color === 'emerald',
                'bg-amber-500/10 border-amber-500/20':   area.color === 'amber',
              }"
            >
              <Icon :name="area.icon" class="text-xl"
                :class="{
                  'text-purple-400': area.color === 'purple',
                  'text-sky-400':    area.color === 'sky',
                  'text-emerald-400':area.color === 'emerald',
                  'text-amber-400':  area.color === 'amber',
                }"
              />
            </div>
            <div>
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white">{{ area.title }}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{{ area.desc }}</p>
            </div>
            <div class="flex flex-wrap gap-1 mt-auto">
              <span
                v-for="tag in area.tags" :key="tag"
                class="text-[11px] px-2 py-0.5 rounded-md border
                       bg-slate-100 dark:bg-slate-800
                       text-slate-500 dark:text-slate-400
                       border-slate-200 dark:border-slate-700/50"
              >{{ tag }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- USAGE METRICS -->
      <section class="mb-10">
        <div class="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <Icon name="mdi:chip" class="text-green-400 text-lg" />
            </div>
            <div>
              <h2 class="text-base font-semibold text-slate-900 dark:text-white">Running Daily</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">A hybrid RTX 3090 / Jetson Orin tier handling the bulk of daily coding requests</p>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              v-for="m in usageMetrics"
              :key="m.label"
              class="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-4 text-center"
            >
              <div class="text-2xl font-bold text-slate-900 dark:text-white">{{ m.value }}</div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-1">{{ m.label }}</div>
            </div>
          </div>
          <p class="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Most day-to-day coding volume runs locally through the Ornith-9B/Ornith-1.0-35B draft-verify pair and OpenClaw. A hosted
            frontier model is kept on hand for the hardest reasoning tasks — this is a hybrid
            setup, not a full replacement, and the split is deliberate.
          </p>
        </div>
      </section>

      <!-- DIAGRAM -->
      <section class="mb-10">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-5">System Architecture Diagram</h2>
        <LocalVibeCodingDiagram />
      </section>

      <!-- STACK -->
      <section
        class="mb-10 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50
               bg-white dark:bg-slate-900/60"
      >
        <h2 class="text-base font-semibold text-slate-900 dark:text-white mb-4">Implementation Stack</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="t in stack" :key="t"
            class="px-3 py-1.5 rounded-lg text-sm border
                   bg-slate-100 dark:bg-slate-800
                   text-slate-600 dark:text-slate-300
                   border-slate-200 dark:border-slate-700/50"
          >{{ t }}</span>
        </div>
      </section>

      <!-- CATEGORY LINK -->
      <section class="mb-10">
        <NuxtLink
          to="/categories/local-vibe-coding"
          class="flex items-center justify-between gap-6 rounded-2xl p-6
                 border border-emerald-500/20 bg-emerald-500/5
                 hover:border-emerald-500/40 hover:bg-emerald-500/10
                 transition-all duration-200 group"
        >
          <div>
            <p class="text-xs font-medium text-emerald-500 uppercase tracking-wider mb-1">Knowledge Base</p>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-400 transition-colors">
              Explore the Local Vibe Coding Articles
            </h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              13 articles covering local models, agent tooling, and the real cost/speed/privacy comparison against Claude Code.
            </p>
          </div>
          <Icon name="mdi:arrow-right" class="flex-shrink-0 text-2xl text-emerald-500 group-hover:translate-x-1 transition-transform duration-200" />
        </NuxtLink>
      </section>

    </div>
  </PatternSection>
</template>
