<script setup lang="ts">
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'
useSeoMeta({
  title: 'Backend Systems Engineering — Donavan Jones',
  description: 'Practical backend architecture for APIs, distributed services, async job queues, data layers, and production-grade infrastructure design.',
  ogTitle: 'Backend Systems Engineering — Donavan Jones',
  ogDescription: 'APIs, distributed services, async job queues, data layers, and production-grade backend architecture.',
  ogType: 'website',
  ogImage: `${_SITE}/img/logo.png`,
  ogUrl: `${_SITE}/systems/backend`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Backend Systems Engineering — Donavan Jones',
  twitterDescription: 'APIs, distributed services, async job queues, and production-grade backend architecture.',
  canonical: `${_SITE}/systems/backend`,
})

const principles = [
  { icon: 'mdi:arrow-decision',   color: 'sky',    text: 'Design stateless APIs wherever possible — state lives in the store, not the server' },
  { icon: 'mdi:layers-triple',    color: 'purple', text: 'Separate compute, storage, and messaging into distinct service layers' },
  { icon: 'mdi:timer-sand',       color: 'amber',  text: 'Prefer async processing for heavy workloads — never block the request path' },
  { icon: 'mdi:eye-check',        color: 'emerald',text: 'Make systems observable and failure-tolerant by default, not as an afterthought' },
]

const areas = [
  {
    icon: 'mdi:api', color: 'sky',
    title: 'APIs',
    desc: 'REST and event-driven endpoints, Zod schema validation, authentication middleware, and typed service contracts.',
    tags: ['Nitro', 'FastAPI', 'Zod', 'JWT'],
  },
  {
    icon: 'mdi:hexagon-multiple', color: 'purple',
    title: 'Services',
    desc: 'Domain-driven service modules, typed interfaces across boundaries, modular monolith patterns.',
    tags: ['DDD', 'Prisma', 'Service Layer'],
  },
  {
    icon: 'mdi:database', color: 'emerald',
    title: 'Databases',
    desc: 'PostgreSQL with Prisma ORM, Redis for caching and sessions, Weaviate for vector search.',
    tags: ['PostgreSQL', 'Redis', 'Weaviate'],
  },
  {
    icon: 'mdi:swap-horizontal', color: 'amber',
    title: 'Async Systems',
    desc: 'BullMQ job queues, dedicated workers, dead-letter queues, exponential backoff, and event-driven flows.',
    tags: ['BullMQ', 'Workers', 'Dead-letter'],
  },
]

const failures = [
  { icon: 'mdi:database-alert',   color: 'rose',   text: 'N+1 query problems causing database overload under moderate traffic' },
  { icon: 'mdi:timer-alert',      color: 'amber',  text: 'Race conditions in distributed services without proper locking or idempotency' },
  { icon: 'mdi:tray-full',        color: 'purple', text: 'Queue backlog and worker starvation when jobs outpace processing capacity' },
  { icon: 'mdi:lightning-bolt',   color: 'sky',    text: 'Uncached hot endpoints causing latency spikes under burst load' },
]

const stack = [
  'Nuxt 3 / Nitro', 'FastAPI', 'Node.js', 'TypeScript',
  'PostgreSQL', 'Prisma', 'Redis', 'BullMQ',
  'Weaviate', 'MinIO', 'Zod', 'Docker',
]

const faqs = [
  {
    question: 'What backend technologies do you use?',
    answer: 'My primary stack is Nuxt 3 / Nitro with TypeScript, PostgreSQL via Prisma, Redis for caching and sessions, and BullMQ for async job queues. I also work with FastAPI (Python) for AI service endpoints.'
  },
  {
    question: 'How do you design scalable backend systems?',
    answer: 'I use domain-driven service boundaries, containerization, and async job queues to keep the request path non-blocking. Stateless APIs with Redis-backed sessions scale horizontally without sticky sessions.'
  },
  {
    question: 'How do you handle databases?',
    answer: 'PostgreSQL with Prisma for typed, migrated schemas. Redis for caching, rate limiting, and pub/sub. Weaviate for vector search. No cross-domain direct table access — each domain owns its own data layer.'
  },
  {
    question: 'How do you handle authentication?',
    answer: 'JWT access tokens with short TTLs and Redis-backed refresh token rotation. Server-side session revocation via Redis. Rate limiting applied at the middleware layer before any handler executes.'
  },
  {
    question: 'Do you work with real-time features?',
    answer: 'Yes. WebSockets for message sync and event broadcasting. WebRTC for peer video via a Nitro signaling server. Redis pub/sub for cross-instance event routing so state stays consistent regardless of which node a client hits.'
  },
  {
    question: 'How do you manage file storage and media?',
    answer: 'Uploads go to MinIO via pre-signed URLs. BullMQ dispatches FFmpeg transcoding jobs. Processed output is written back to MinIO; the client is notified via WebSocket on completion.'
  },
  {
    question: 'How do you ensure type safety?',
    answer: 'Strict TypeScript across frontend, Nitro server, and shared utilities. Zod schemas at API boundaries generate both runtime validation and inferred TypeScript types. Prisma types flow from the schema migrations.'
  },
  {
    question: 'Do you integrate AI into backend systems?',
    answer: 'Yes. Backend services dispatch to Llama (on-cluster) or OpenAI via a custom orchestration layer, with BullMQ queuing AI batch jobs. Results stream back to the client via SSE.'
  },
]
</script>

<template>
  <PatternSection>
    <BackendHero />
    <Breadcrumbs parentTitle="Systems" parentUrl="/system-overview" currentPageTitle="Backend" />

    <div class="mx-auto max-w-7xl px-6 py-14">

      <!-- HEADER -->
      <div class="mb-12">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4
                 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm"
        >
          <Icon name="mdi:server" class="text-sm" />
          Backend Systems Engineering
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
          Building Scalable Backend Systems
        </h1>
        <p class="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Practical backend architecture for APIs, distributed services, async job queues, data layers,
          and production-grade infrastructure design.
        </p>
      </div>

      <!-- PRINCIPLES + FAILURES -->
      <div class="grid md:grid-cols-2 gap-5 mb-10">

        <!-- Core Principles -->
        <div
          class="rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
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
                  'bg-amber-500/10 border-amber-500/20':   p.color === 'amber',
                  'bg-emerald-500/10 border-emerald-500/20': p.color === 'emerald',
                }"
              >
                <Icon :name="p.icon" class="text-xs"
                  :class="{
                    'text-sky-400':    p.color === 'sky',
                    'text-purple-400': p.color === 'purple',
                    'text-amber-400':  p.color === 'amber',
                    'text-emerald-400':p.color === 'emerald',
                  }"
                />
              </div>
              <span class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ p.text }}</span>
            </li>
          </ul>
        </div>

        <!-- Failure Modes -->
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
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-5">Backend Architecture Areas</h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="area in areas"
            :key="area.title"
            class="rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60 flex flex-col gap-3
                   hover:border-sky-500/40 transition-all duration-200"
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center border"
              :class="{
                'bg-sky-500/10 border-sky-500/20':         area.color === 'sky',
                'bg-purple-500/10 border-purple-500/20':   area.color === 'purple',
                'bg-emerald-500/10 border-emerald-500/20': area.color === 'emerald',
                'bg-amber-500/10 border-amber-500/20':     area.color === 'amber',
              }"
            >
              <Icon :name="area.icon" class="text-xl"
                :class="{
                  'text-sky-400':    area.color === 'sky',
                  'text-purple-400': area.color === 'purple',
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

      <!-- DIAGRAM -->
      <section class="mb-10">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-5">System Architecture Diagram</h2>
        <BackendDiagram />
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

      <FaqSection title="Frequently Asked Questions" :faqs="faqs" />
      <ClusterArticles cluster="backend-engineering" />

    </div>
  </PatternSection>
</template>
