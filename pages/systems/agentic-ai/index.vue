<script setup lang="ts">
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'
useSeoMeta({
  title: 'Agentic AI Systems — Donavan Jones',
  description: 'Agentic AI systems engineering — planning agents, durable orchestration with Temporal, memory architecture, and verifying agent output against evidence before it ships.',
  ogTitle: 'Agentic AI Systems — Donavan Jones',
  ogDescription: 'Agent orchestration patterns — planning, memory, Temporal-based durable workflows, and verification agents in production.',
  ogType: 'website',
  ogImage: `${_SITE}/img/heroes/systems-agentic-ai.jpg`,
  ogUrl: `${_SITE}/systems/agentic-ai`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Agentic AI Systems — Donavan Jones',
  twitterDescription: 'Production agent orchestration, memory, and verification patterns.',
  canonical: `${_SITE}/systems/agentic-ai`,
})

// Curated entry points into this topic cluster (all URLs verified against published posts)
const startHere = [
  { to: '/blog/agentic-ai-systems/01-single-agent-vs-multi-agent-systems', title: 'Single agent vs multi-agent systems', desc: 'When one well-designed agent is enough, and when it is not.' },
  { to: '/blog/agentic-ai-systems/02-planning-agents-explained', title: 'Planning agents explained', desc: 'Task decomposition and replanning instead of purely reactive loops.' },
  { to: '/blog/agentic-ai-systems/04-agent-memory-architectures', title: 'Agent memory architectures', desc: 'Working, session, and long-term memory scopes.' },
  { to: '/blog/agentic-ai-systems/03-teaching-ai-agents-about-your-project-with-rag', title: 'Teaching agents about your project with RAG', desc: 'Grounding an agent in your own code and documents.' },
  { to: '/blog/agentic-ai-systems/07-building-multi-agent-workflows-with-temporal', title: 'Multi-agent workflows with Temporal', desc: 'Durable, checkpointed orchestration for agent steps.' },
  { to: '/blog/agentic-ai-systems/09-long-running-agent-workflows', title: 'Long-running agent workflows', desc: 'Keeping agents alive across restarts, deploys, and timeouts.' },
  { to: '/blog/agentic-ai-systems/11-verification-agents-in-production', title: 'Verification agents in production', desc: 'Checking agent output against evidence before it ships.' },
  { to: '/blog/versehub-engineering/07-temporal-workflows-in-production', title: 'Temporal workflows in production (VerseHub)', desc: 'The real bugs: task timeouts, workflow fan-out, and streaming replay.' },
]

const relatedLinks = [
  { to: '/systems/ai', label: 'AI Systems Engineering' },
  { to: '/systems/backend', label: 'Backend Systems' },
  { to: '/systems/ai-homelab', label: 'AI Homelab Engineering' },
  { to: '/projects/versehub', label: 'VerseHub case study' },
  { to: '/projects/kingdom-tools', label: 'Kingdom Tools platform' },
  { to: '/services/local-ai-infrastructure', label: 'Local AI infrastructure consulting & research' },
]

const principles = [
  { icon: 'mdi:compass',        color: 'sky',     text: 'Default to a single well-designed agent; add agents only for a proven, specific reason' },
  { icon: 'mdi:content-save',   color: 'purple',  text: 'Separate working, session, and long-term memory rather than one unbounded context' },
  { icon: 'mdi:shield-check',   color: 'emerald', text: 'Verify output with an independent pass before treating it as final' },
  { icon: 'mdi:database-lock',  color: 'amber',   text: 'Use durable execution for any workflow that can outlive a single process' },
]

const areas = [
  {
    icon: 'mdi:clipboard-text', color: 'sky',
    title: 'Planning', image: '/img/cards/agentic-planning.jpg',
    desc: 'Task decomposition into ordered, revisable steps rather than pure reactive execution.',
    tags: ['Decomposition', 'Replanning', 'ReAct'],
  },
  {
    icon: 'mdi:memory', color: 'purple',
    title: 'Memory', image: '/img/cards/agentic-memory.jpg',
    desc: 'Working, session, and long-term memory scopes, each with its own storage and promotion path.',
    tags: ['Redis', 'Vector DB', 'Promotion'],
  },
  {
    icon: 'mdi:sitemap', color: 'amber',
    title: 'Orchestration', image: '/img/cards/agentic-orchestration.jpg',
    desc: 'Durable, checkpointed multi-step workflows on Temporal, with timeouts and retries set deliberately.',
    tags: ['Temporal', 'Timeouts', 'Retries'],
  },
  {
    icon: 'mdi:shield-check', color: 'emerald',
    title: 'Verification', image: '/img/cards/agentic-verification.jpg',
    desc: 'A separate agent checking output against explicit criteria before it reaches a user.',
    tags: ['Rubrics', 'Bounded Retry', 'Confirmation'],
  },
]

const failures = [
  { icon: 'mdi:infinity',        color: 'rose',   text: 'Multi-agent coordination overhead added before a single agent was proven insufficient' },
  { icon: 'mdi:crystal-ball',    color: 'amber',  text: 'Overconfident plans executed fully before a bad assumption surfaces' },
  { icon: 'mdi:database-alert',  color: 'purple', text: 'Unbounded memory storage degrading retrieval signal over time' },
  { icon: 'mdi:robot-confused',  color: 'sky',    text: 'Self-review confirming its own mistakes instead of catching them' },
]

const productionMetrics = [
  { value: '4',     label: 'Workflow stages: retrieve → score → generate → verify' },
  { value: '~21',   label: 'tok/s fast draft (llama3.2:3b on a Jetson)' },
  { value: '3',     label: 'Distinct memory scopes' },
  { value: '1',     label: 'Orchestration backbone (Temporal)' },
]

const stack = [
  'Temporal', 'Redis', 'Weaviate', 'Tool Calling',
  'RAG', 'Verification Agents', 'Python', 'PostgreSQL',
]

const faqs = [
  {
    question: 'When should I use multiple agents instead of one?',
    answer: 'Only after a single, well-designed agent demonstrably struggles — lost context on long tasks, conflicting system-prompt needs across sub-tasks, or genuine unrealized parallelism. Multi-agent coordination is a cost, not a default.'
  },
  {
    question: 'Why use Temporal instead of a simple loop?',
    answer: 'Durable execution — every step is persisted, so a crash or restart resumes exactly where the workflow left off instead of starting over. This matters once workflows run for minutes, hours, or need to survive a deploy.'
  },
  {
    question: 'How do you keep an autonomous agent safe to run unattended?',
    answer: 'Bounded blast radius on any action it can take, idempotent operations, a dead-man\'s-switch for silent failures, and an independent verification pass before higher-stakes output is treated as final.'
  },
  {
    question: 'What does a verification agent actually check?',
    answer: 'Concrete, checkable criteria from an explicit rubric — not a vague "is this good" judgment. A separate context and often a more skeptical prompt catches errors that self-review from the same reasoning tends to miss.'
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
    <AgenticAiHero />
    <Breadcrumbs parentTitle="Systems" parentUrl="/system-overview" currentPageTitle="Agentic AI" />

    <div class="mx-auto max-w-7xl px-6 py-14">

      <div class="mb-12">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4
                 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm"
        >
          <Icon name="mdi:robot" class="text-sm" />
          Agentic AI Systems
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
          Building Production AI Agents
        </h1>
        <p class="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Planning, memory, durable orchestration, and verification — the systems engineering
          that turns an agent demo into something safe to run unattended.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-5 mb-10">

        <div class="rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <Icon name="mdi:compass" class="text-sky-400 text-lg" />
            </div>
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Core Principles</h2>
          </div>
          <ul class="space-y-3">
            <li v-for="p in principles" :key="p.text" class="flex items-start gap-3">
              <div
                class="mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 border"
                :class="{
                  'bg-sky-500/10 border-sky-500/20':       p.color === 'sky',
                  'bg-purple-500/10 border-purple-500/20': p.color === 'purple',
                  'bg-emerald-500/10 border-emerald-500/20': p.color === 'emerald',
                  'bg-amber-500/10 border-amber-500/20':   p.color === 'amber',
                }"
              >
                <Icon :name="p.icon" class="text-xs"
                  :class="{
                    'text-sky-400':    p.color === 'sky',
                    'text-purple-400': p.color === 'purple',
                    'text-emerald-400':p.color === 'emerald',
                    'text-amber-400':  p.color === 'amber',
                  }"
                />
              </div>
              <span class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ p.text }}</span>
            </li>
          </ul>
        </div>

        <div class="rounded-2xl p-6 border border-slate-200 dark:border-rose-500/20 bg-white dark:bg-slate-900/60">
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

      <section class="relative isolate overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 mb-10">
        <HeroBackdrop lazy src="/img/sections/agentic-areas.jpg" side="full" />
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-5">System Architecture Areas</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="area in areas"
            :key="area.title"
            class="group overflow-hidden rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60 flex flex-col gap-3
                   hover:border-sky-500/40 transition-all duration-200"
          >
              <div class="relative -mx-5 -mt-5 mb-1 aspect-[2/1] overflow-hidden border-b border-slate-200 dark:border-slate-800">
                <img :src="area.image" alt="" width="600" height="315" loading="lazy" decoding="async"
                     class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <div data-icon-overlay class="absolute top-3 left-3 z-10 rounded-lg bg-white/90 dark:bg-slate-950/75 backdrop-blur-sm shadow-sm">
                  <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center border"
                    :class="{
                      'bg-sky-500/10 border-sky-500/20':       area.color === 'sky',
                      'bg-purple-500/10 border-purple-500/20': area.color === 'purple',
                      'bg-amber-500/10 border-amber-500/20':   area.color === 'amber',
                      'bg-emerald-500/10 border-emerald-500/20': area.color === 'emerald',
                    }"
                  >
                    <Icon :name="area.icon" class="text-xl"
                      :class="{
                        'text-sky-400':    area.color === 'sky',
                        'text-purple-400': area.color === 'purple',
                        'text-amber-400':  area.color === 'amber',
                        'text-emerald-400':area.color === 'emerald',
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

      <section class="relative isolate overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 mb-10">
        <HeroBackdrop lazy src="/img/sections/agentic-metrics.jpg" side="full" />
        <div class="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <Icon name="mdi:chip" class="text-green-400 text-lg" />
            </div>
            <div>
              <h2 class="text-base font-semibold text-slate-900 dark:text-white">Running in Production</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">Durable orchestration and verification patterns backing this site's agent workloads</p>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              v-for="m in productionMetrics"
              :key="m.label"
              class="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-4 text-center"
            >
              <div class="text-2xl font-bold text-slate-900 dark:text-white">{{ m.value }}</div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-1">{{ m.label }}</div>
            </div>
          </div>
          <p class="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            In VerseHub, a fast draft comes from llama3.2:3b on a Jetson, then a Temporal ScholarWorkflow on the
            Pi workers retrieves evidence from Weaviate, scores it, regenerates, and verifies every citation against
            the retrieved passages. Silent retrieval failures now raise instead of producing confident, evidence-free answers.
          </p>
        </div>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-5">System Architecture Diagram</h2>
        <AgenticAiDiagram />
      </section>

      <section class="mb-10 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60">
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
        <JetsonLeaderboardCard metric="tools" title="Which small models can drive an agent on edge hardware?" blurb="Agents live or die on tool calling. These are the most reliable tool callers I measured on an 8 GB Jetson Orin Nano Super." />
      </section>

      <section class="relative isolate overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 mb-10">
        <HeroBackdrop lazy src="/img/sections/agentic-start.jpg" side="full" />
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">Start Here: Key Agentic AI Articles</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-3xl leading-relaxed">The core reading path through agent design, memory, durable orchestration, and verification.</p>
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

      <section class="mb-10">
        <NuxtLink
          to="/categories/agentic-ai-systems"
          class="relative isolate overflow-hidden flex items-center justify-between gap-6 rounded-2xl p-6
                 border border-sky-500/20 bg-sky-500/5
                 hover:border-sky-500/40 hover:bg-sky-500/10
                 transition-all duration-200 group"
        >
          <HeroBackdrop lazy src="/img/categories/agentic-ai-systems.jpg" />
          <div>
            <p class="text-xs font-medium text-sky-500 uppercase tracking-wider mb-1">Knowledge Base</p>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors">
              Explore the Agentic AI Systems Articles
            </h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              11 articles covering planning, memory, Temporal orchestration, event-driven agents, and verification agents in production.
            </p>
          </div>
          <Icon name="mdi:arrow-right" class="flex-shrink-0 text-2xl text-sky-500 group-hover:translate-x-1 transition-transform duration-200" />
        </NuxtLink>
      </section>

    </div>
  </PatternSection>
</template>
