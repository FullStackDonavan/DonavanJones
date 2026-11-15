<script setup lang="ts">
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'
useSeoMeta({
  title: 'Local Vibe Coding — Donavan Jones',
  description: 'Local vibe coding: a local AI coding environment built on Ornith-1.0-35B in Ollama on one RTX 3090, a draft/verify agent loop (OpenClaw), and small models on Jetson Orin Nano Supers — alongside hosted tools.',
  ogTitle: 'Local Vibe Coding — Donavan Jones',
  ogDescription: 'Local AI coding patterns — Ornith-1.0-35B on an RTX 3090 (~64 tok/s), a draft/verify agent loop, and what did and did not fit on 8GB Jetsons.',
  ogType: 'website',
  ogImage: `${_SITE}/img/heroes/systems-local-vibe-coding.jpg`,
  ogUrl: `${_SITE}/systems/local-vibe-coding`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Local Vibe Coding — Donavan Jones',
  twitterDescription: 'Local AI coding — Ornith-1.0-35B on one RTX 3090, Ollama, a custom agent loop, and Jetson small models.',
  canonical: `${_SITE}/systems/local-vibe-coding`,
})

// Curated entry points into this topic cluster (all URLs verified against published posts)
const startHere = [
  { to: '/blog/local-vibe-coding/01-vibe-coding-locally-2026-setup', title: 'Vibe coding locally: my 2026 setup', desc: 'Jetson Orin and an RTX 3090 as a local coding stack.' },
  { to: '/blog/local-vibe-coding/02-running-ornith-locally-with-ollama', title: 'Running Ornith-1.0-35B locally with Ollama', desc: 'Install, quantization, and VRAM on a single 3090.' },
  { to: '/blog/local-vibe-coding/03-best-local-models-for-coding', title: 'Best local models for coding', desc: 'Which models are worth running for code.' },
  { to: '/blog/local-vibe-coding/06-first-offline-ai-coding-agent', title: 'Building an offline AI coding agent', desc: 'A coding agent that runs with no internet connection.' },
  { to: '/blog/local-vibe-coding/07-connecting-ornith-to-your-codebase', title: 'Connecting Ornith to your own codebase', desc: 'Giving a local model real project context.' },
  { to: '/blog/local-vibe-coding/10-local-ai-vs-claude-code-30-days', title: 'Local AI vs Claude Code after 30 days', desc: 'Cost, speed, and privacy compared.' },
  { to: '/blog/local-vibe-coding/11-ornith-vs-claude-code', title: 'Ornith-1.0-35B vs Claude Code', desc: 'Where the local model holds up and where it does not.' },
  { to: '/blog/local-vibe-coding/13-when-to-buy-a-gpu-vs-api-fees', title: 'When to buy a GPU vs pay API fees', desc: 'The break-even math for local coding hardware.' },
]

const relatedLinks = [
  { to: '/systems/ai-homelab', label: 'AI Homelab Engineering' },
  { to: '/systems/ai', label: 'AI Systems Engineering' },
  { to: '/systems/agentic-ai', label: 'Agentic AI Systems' },
  { to: '/jetson-leaderboard', label: 'Jetson Orin Nano LLM leaderboard' },
  { to: '/categories/ai-cost-optimization', label: 'AI cost optimization articles' },
  { to: '/projects/kingdom-tools', label: 'Kingdom Tools platform' },
]

const principles = [
  { icon: 'mdi:layers-triple',    color: 'emerald', text: 'Route by task type — pattern-following work stays local, hard reasoning goes hosted' },
  { icon: 'mdi:shield-check',     color: 'sky',     text: 'Confirmation-gate any destructive or hard-to-reverse tool call before it executes' },
  { icon: 'mdi:chip',             color: 'amber',   text: 'Match hardware tier to role — small models on 8GB Jetsons, the 35B model on the 24GB RTX 3090, and measure before assuming a model fits' },
  { icon: 'mdi:lock',             color: 'purple',  text: 'Nothing leaves the network — privacy is a property of the whole stack, not just the model' },
]

const areas = [
  {
    icon: 'mdi:brain', color: 'purple',
    title: 'Models', image: '/img/cards/lvc-models.jpg',
    desc: 'Ornith-1.0-35B (MoE, Q4_K_M) verifies on the RTX 3090 via Ollama. An Ornith-9B drafter on a Jetson barely fit (~3 tok/s, 4K context) and was retired.',
    tags: ['Ornith-9B', 'Ornith-1.0-35B', 'Ollama'],
  },
  {
    icon: 'mdi:robot', color: 'sky',
    title: 'Agent Loop', image: '/img/cards/lvc-agent-loop.jpg',
    desc: 'OpenClaw — a from-scratch coding agent with tool calling and a confirmation-gated permission model.',
    tags: ['OpenClaw', 'Tool Use', 'Permissions'],
  },
  {
    icon: 'mdi:database-search', color: 'emerald',
    title: 'Retrieval', image: '/img/cards/lvc-retrieval.jpg',
    desc: 'Function/class-level codebase indexing so the agent has real project context, not just a training-time prior.',
    tags: ['AST Chunking', 'Embeddings', 'Search'],
  },
  {
    icon: 'mdi:expansion-card', color: 'amber',
    title: 'Hardware', image: '/img/cards/lvc-hardware.jpg',
    desc: 'One RTX 3090 (24GB) for the 35B model, plus Jetson Orin Nano Supers in the k3s cluster for small always-on models.',
    tags: ['RTX 3090', 'Jetson Orin', 'Ollama'],
  },
]

const failures = [
  { icon: 'mdi:memory',          color: 'rose',   text: 'VRAM contention between interactive sessions and background jobs' },
  { icon: 'mdi:file-question',   color: 'amber',  text: 'Model reinventing utilities that already exist without codebase retrieval' },
  { icon: 'mdi:infinity',        color: 'purple', text: 'Agent loops that never terminate without a hard iteration cap' },
  { icon: 'mdi:shield-alert',    color: 'sky',     text: 'Ungated shell access executing a destructive command unattended' },
]

const usageMetrics = [
  { value: '~64',   label: 'tok/s Ornith-1.0-35B on one RTX 3090' },
  { value: '21.2GB', label: 'VRAM used by the 35B Q4_K_M model' },
  { value: '~3',    label: 'tok/s Ornith-9B on a Jetson (retired)' },
  { value: '~42',   label: 'Small models sweep-tested on the Jetsons' },
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
    answer: 'Ornith-1.0-35B runs in Ollama on a single RTX 3090 (24GB VRAM, ~21 GB used, ~64 tok/s). I tried drafting with Ornith-9B on a Jetson Orin Nano Super, but it barely fit in 8GB at ~3 tok/s, so I retired it; the Jetsons now run smaller models.'
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
          Ornith-1.0-35B on Ollama on one RTX 3090, a custom draft/verify agent loop, and small models on Jetson Orin Nano Supers —
          moving a share of day-to-day AI coding onto infrastructure I own, with hosted tools still in the mix.
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
      <section class="relative isolate overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 mb-10">
        <HeroBackdrop lazy src="/img/sections/lvc-areas.jpg" side="full" />
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-5">System Architecture Areas</h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="area in areas"
            :key="area.title"
            class="group overflow-hidden rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60 flex flex-col gap-3
                   hover:border-emerald-500/40 transition-all duration-200"
          >
              <div class="relative -mx-5 -mt-5 mb-1 aspect-[2/1] overflow-hidden border-b border-slate-200 dark:border-slate-800">
                <img :src="area.image" alt="" width="600" height="315" loading="lazy" decoding="async"
                     class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <div data-icon-overlay class="absolute top-3 left-3 z-10 rounded-lg bg-white/90 dark:bg-slate-950/75 backdrop-blur-sm shadow-sm">
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
                </div>
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
      <section class="relative isolate overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 mb-10">
        <HeroBackdrop lazy src="/img/sections/lvc-metrics.jpg" side="full" />
        <div class="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <Icon name="mdi:chip" class="text-green-400 text-lg" />
            </div>
            <div>
              <h2 class="text-base font-semibold text-slate-900 dark:text-white">Running Daily</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">One RTX 3090 for the big model, Jetsons for small always-on models</p>
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
            Routine coding work can run locally through Ornith-1.0-35B and OpenClaw. Ollama does not report native tool
            capability for Ornith, so tool use goes through a JSON-in-content protocol. A hosted
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

      <!-- START HERE -->
      <section class="mb-10">
        <JetsonLeaderboardCard metric="code" blurb="Which small coding models actually pass tests on an 8 GB Jetson, and how fast they run. Measured on my own boards." />
      </section>

      <section class="relative isolate overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 mb-10">
        <HeroBackdrop lazy src="/img/sections/lvc-start.jpg" side="full" />
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">Start Here: Key Local Vibe Coding Articles</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-3xl leading-relaxed">Setting up local coding models, wiring them into an agent loop, and an honest comparison with Claude Code on cost, speed, and privacy.</p>
        <div class="grid sm:grid-cols-2 gap-3">
          <NuxtLink
            v-for="post in startHere" :key="post.to" :to="post.to"
            class="group flex items-start gap-3 rounded-xl p-3 border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60 hover:border-sky-500/40 transition-all duration-200"
          >
            <div class="w-24 shrink-0 aspect-[3/2] overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
              <img :src="`/img${post.to}.jpg`" alt="" width="600" height="315" loading="lazy" decoding="async"
                   class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div class="min-w-0">
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">{{ post.title }}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{{ post.desc }}</p>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- RELATED SYSTEMS & PROJECTS -->
      <section class="mb-10">
        <h2 class="text-base font-semibold text-slate-900 dark:text-white mb-4">Related Systems &amp; Projects</h2>
        <div class="flex flex-wrap gap-2">
          <NuxtLink
            v-for="r in relatedLinks" :key="r.to" :to="r.to"
            class="px-3 py-1.5 rounded-lg text-sm border
                   bg-slate-100 dark:bg-slate-800
                   text-slate-600 dark:text-slate-300
                   border-slate-200 dark:border-slate-700/50
                   hover:border-sky-500/40 hover:text-sky-500 transition-colors"
          >{{ r.label }}</NuxtLink>
        </div>
      </section>

      <!-- CATEGORY LINK -->
      <section class="mb-10">
        <NuxtLink
          to="/categories/local-vibe-coding"
          class="relative isolate overflow-hidden flex items-center justify-between gap-6 rounded-2xl p-6
                 border border-emerald-500/20 bg-emerald-500/5
                 hover:border-emerald-500/40 hover:bg-emerald-500/10
                 transition-all duration-200 group"
        >
          <HeroBackdrop lazy src="/img/categories/local-vibe-coding.jpg" />
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
