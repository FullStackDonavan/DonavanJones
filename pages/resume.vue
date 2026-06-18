<script setup lang="ts">
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'

useSeoMeta({
  title: 'Resume — Donavan Jones | AI Systems Engineer',
  description: 'AI Systems Engineer with 20+ years building production RAG pipelines, local LLM inference on Kubernetes, full-stack SaaS platforms, and self-hosted cloud infrastructure.',
  ogTitle: 'Resume — Donavan Jones | AI Systems Engineer',
  ogDescription: 'AI Systems Engineer with 20+ years building production RAG pipelines, local LLM inference on Kubernetes, and full-stack SaaS platforms.',
  ogType: 'website',
  ogImage: `${_SITE}/img/logo.png`,
  ogUrl: `${_SITE}/resume`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Resume — Donavan Jones | AI Systems Engineer',
  twitterDescription: 'AI Systems Engineer — production RAG pipelines, Kubernetes-hosted LLMs, full-stack SaaS, 20+ years.',
  canonical: `${_SITE}/resume`,
})

const skills = {
  frontend: [
    'JavaScript / TypeScript', 'Nuxt 3 / Vue.js', 'React', 'Tailwind CSS',
    'Component Architecture', 'GSAP Animations',
  ],
  backend: [
    'Node.js', 'PHP 8+', 'Python', 'REST APIs',
    'MySQL / PostgreSQL', 'Prisma ORM', 'RBAC & Auth Systems',
  ],
  dataAi: [
    'RAG Pipelines', 'Weaviate (Vector DB)', 'Apache AGE (Graph)',
    'Redis', 'MinIO / S3', 'LLM Integration', 'Embeddings & Tool Use',
    'Agent Workflows',
  ],
  cloud: [
    'AWS (S3, EC2, IVS)', 'Linux Admin', 'Docker', 'Kubernetes',
    'Git / CI Workflows', 'Deployment Pipelines', 'Service Orchestration',
  ],
  systemDesign: [
    'SaaS Architecture', 'Multi-Tenant Systems', 'Event-Driven Architectures',
    'Media Streaming (WebRTC / IVS)', 'AI Application Architecture',
    'Microservice Experimentation',
  ],
}

const experience = [
  {
    company: 'Amerus Financial Group',
    title: 'Web Developer',
    location: 'Lakeland, FL',
    caseStudy: { label: 'View full case study →', to: '/projects/business-benefit-alliance' },
    points: [
      'Sole full-stack developer and architect — owned all decisions from database schema and API design to AWS infrastructure and deployment',
      'Automated end-to-end group insurance enrollment for 92 businesses and hundreds of employees — eliminating manual application handling, PDF assembly, and email-based document distribution',
      'Built invite-based onboarding that auto-links employees to their company on sign-up — zero manual admin assignment required',
      'Designed a 5-step enrollment state machine that enforces workflow sequence across multiple actors: no employee can skip steps, no owner can authorize payment before all applications are complete',
      'Eliminated manual PDF assembly: signed documents generated server-side per submission with digital signatures composited in; insurance cards delivered directly from the admin dashboard',
      'Collaborated directly with business stakeholders to translate real enrollment workflows into production features — requirements gathering, iteration, and production feedback loop',
    ],
  },
  {
    company: 'Web Instinct',
    title: 'Web Developer',
    location: 'Tampa, FL',
    points: [
      'Developed and maintained web applications using Concrete5 CMS',
      'Built custom client portals with performance-focused frontend architecture',
      'Created and extended WordPress themes and plugin functionality',
      'Collaborated with cross-functional teams to deliver scalable web solutions',
      'Performed debugging, testing, and performance optimization across multiple client projects',
    ],
  },
  {
    company: 'Florida Water Analysis',
    title: 'Web Developer',
    location: 'Florida',
    points: [
      'Built React-based web application for water treatment tracking and client management',
      'Developed and maintained multiple business websites and landing pages',
      'Implemented SEO strategies improving organic search performance',
      'Built automation and content systems supporting business workflows',
      'Managed digital campaign infrastructure and email marketing systems',
    ],
  },
  {
    company: 'Footbridge Media',
    title: 'Junior Web Developer',
    location: 'Pensacola, FL',
    points: [
      'Developed Laravel-based internal admin system for tracking client content workflows',
      'Maintained and extended enterprise WordPress theme framework across client sites',
      'Worked with design and layout teams to implement frontend updates',
      'Participated in team development planning and execution workflows',
    ],
  },
]

const homelabPoints = [
  'Designed and built a personal server rack environment for self-hosted development and distributed systems experimentation',
  'Runs multi-service infrastructure including databases, caching systems, object storage, and AI services',
  'Deployed and managed services including Redis, MinIO, vector databases, and backend APIs',
  'Built and tested AI workflows including RAG pipelines and retrieval systems',
  'Experimented with Kubernetes, networking, and service orchestration at scale',
  'Developed practical understanding of distributed systems, scalability, and infrastructure design patterns',
]

const projectSystems = [
  {
    label: 'Performance Outcomes',
    items: [
      '37,000+ Bible and Quran verses indexed in Weaviate',
      'RAG retrieval averaging under 200ms (hybrid BM25 + vector)',
      '80% of inference requests served by local Llama 3.2 on Jetson GPU nodes',
      '~70% inference cost reduction vs. full OpenAI API routing',
    ],
  },
  {
    label: 'Reliability Outcomes',
    items: [
      'Zero request-path blocking: FFmpeg transcoding fully decoupled via BullMQ',
      'Cross-instance WebSocket consistency via Redis pub/sub — no missed messages',
      '5 independently deployable bounded domains with no cross-domain coupling',
      'Circuit breaker on AI inference path — auto-routes to fallback on error threshold',
    ],
  },
  {
    label: 'Infrastructure',
    items: [
      'Self-hosted Kubernetes (k3s) on 12-node cluster — 8× Pi 5 + 4× Jetson Orin Nano Super',
      'MinIO S3-compatible object storage with signed URL delivery',
      'PostgreSQL + Apache AGE for relational and graph queries',
      'Prometheus + Loki + Grafana observability across all services',
    ],
  },
  {
    label: 'Architecture Decisions',
    items: [
      '3 async BullMQ queues — transcoding, notifications, AI batch — keep API non-blocking',
      'Prompt complexity classifier routes to local or cloud inference transparently',
      'Redis pub/sub for cross-instance real-time state — no sticky sessions required',
      'Domain-driven service modules: each domain owns its schema and data access',
    ],
  },
]
</script>

<template>
  <PatternSection>

    <!-- ── HERO ──────────────────────────────────────────────────────────── -->
    <div class="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 print:border-0">
      <div class="max-w-7xl mx-auto px-6 py-14 sm:py-20">

        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">

          <!-- Name + title -->
          <div class="flex items-start gap-5">
            <img
              src="/images/donavan.jpg"
              alt="Donavan Jones"
              class="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 flex-shrink-0 print:hidden"
            />
            <div>
            <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              Donavan Jones
            </h1>
            <p class="mt-2 text-lg font-medium text-sky-500">
              AI Systems Engineer &amp; Platform Builder
            </p>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Icon name="mdi:map-marker-outline" class="text-base" />
              Lakeland, FL &nbsp;·&nbsp; 20+ years software development experience
            </p>
            </div>
          </div>

          <!-- Download + Print buttons -->
          <div class="print:hidden self-start flex items-center gap-2">
            <a
              href="/pdf/Donavan-Jones-Resume-2026.pdf"
              download
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                     bg-sky-500 hover:bg-sky-600 text-white transition-colors duration-200"
            >
              <Icon name="mdi:download-outline" class="text-base" />
              Download PDF
            </a>
            <button
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                     border border-slate-200 dark:border-slate-700/50
                     bg-white dark:bg-slate-900
                     text-slate-600 dark:text-slate-300
                     hover:border-sky-500/40 hover:text-sky-500 transition-all duration-200"
              @click="() => typeof window !== 'undefined' && window.print()"
            >
              <Icon name="mdi:printer-outline" class="text-base" />
              Print
            </button>
          </div>

        </div>

        <!-- Contact strip -->
        <div class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
          <a href="mailto:donavanjones79@gmail.com" class="flex items-center gap-1.5 hover:text-sky-500 transition-colors">
            <Icon name="mdi:email-outline" class="text-base text-sky-400" />
            donavanjones79@gmail.com
          </a>
          <a href="tel:8633399964" class="flex items-center gap-1.5 hover:text-sky-500 transition-colors">
            <Icon name="mdi:phone-outline" class="text-base text-sky-400" />
            (863) 339-9964
          </a>
          <NuxtLink to="/" class="flex items-center gap-1.5 hover:text-sky-500 transition-colors">
            <Icon name="mdi:web" class="text-base text-sky-400" />
            donavanjones.com
          </NuxtLink>
          <a href="https://github.com/FullStackDonavan" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 hover:text-sky-500 transition-colors">
            <Icon name="mdi:github" class="text-base text-sky-400" />
            github.com/FullStackDonavan
          </a>
          <a href="https://linkedin.com/in/donavanjones" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 hover:text-sky-500 transition-colors">
            <Icon name="mdi:linkedin" class="text-base text-sky-400" />
            linkedin.com/in/donavanjones
          </a>
        </div>

      </div>
    </div>

    <!-- ── BODY ──────────────────────────────────────────────────────────── -->
    <div class="bg-slate-50 dark:bg-slate-950 py-10 print:bg-white print:py-4">
      <div class="max-w-7xl mx-auto px-6">

        <div class="grid lg:grid-cols-[280px_1fr] gap-8">

          <!-- ── LEFT SIDEBAR ──────────────────────────────────────────── -->
          <aside class="space-y-6">

            <!-- Summary -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden print:border-slate-300 print:rounded-none print:shadow-none">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">profile.md</span>
              </div>
              <div class="p-5 space-y-3">
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Self-directed AI Systems Engineer with 20+ years building production systems end-to-end — from bare-metal Kubernetes clusters running local LLMs to full-stack SaaS platforms with async job queues, vector search, and real-time features.
                </p>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Where I specialize: closing the gap between AI prototype and production system. I own the full stack — data model, API, AI pipeline, infrastructure, and observability — without needing a team to unblock me.
                </p>
              </div>
            </div>

            <!-- Skills -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden print:border-slate-300 print:rounded-none">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">skills.config</span>
              </div>
              <div class="p-3 space-y-0.5">

                <div class="rounded-xl px-3 py-3 transition-all duration-200 hover:bg-sky-500/10 dark:hover:bg-sky-500/8 group/sky">
                  <p class="text-[10px] uppercase tracking-widest text-sky-500 font-semibold mb-2 transition-colors duration-200 group-hover/sky:text-sky-600 dark:group-hover/sky:text-sky-400">Frontend</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="s in skills.frontend" :key="s" class="text-[11px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-sky-500/10 hover:border-sky-500/40 hover:text-sky-600 dark:hover:text-sky-400">{{ s }}</span>
                  </div>
                </div>

                <div class="rounded-xl px-3 py-3 transition-all duration-200 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/8 group/emerald">
                  <p class="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold mb-2 transition-colors duration-200 group-hover/emerald:text-emerald-600 dark:group-hover/emerald:text-emerald-400">Backend</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="s in skills.backend" :key="s" class="text-[11px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400">{{ s }}</span>
                  </div>
                </div>

                <div class="rounded-xl px-3 py-3 transition-all duration-200 hover:bg-purple-500/10 dark:hover:bg-purple-500/8 group/purple">
                  <p class="text-[10px] uppercase tracking-widest text-purple-500 font-semibold mb-2 transition-colors duration-200 group-hover/purple:text-purple-600 dark:group-hover/purple:text-purple-400">Data / AI / Search</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="s in skills.dataAi" :key="s" class="text-[11px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-purple-500/10 hover:border-purple-500/40 hover:text-purple-600 dark:hover:text-purple-400">{{ s }}</span>
                  </div>
                </div>

                <div class="rounded-xl px-3 py-3 transition-all duration-200 hover:bg-amber-500/10 dark:hover:bg-amber-500/8 group/amber">
                  <p class="text-[10px] uppercase tracking-widest text-amber-500 font-semibold mb-2 transition-colors duration-200 group-hover/amber:text-amber-600 dark:group-hover/amber:text-amber-400">Cloud / DevOps</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="s in skills.cloud" :key="s" class="text-[11px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-amber-500/10 hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400">{{ s }}</span>
                  </div>
                </div>

                <div class="rounded-xl px-3 py-3 transition-all duration-200 hover:bg-rose-500/10 dark:hover:bg-rose-500/8 group/rose">
                  <p class="text-[10px] uppercase tracking-widest text-rose-500 font-semibold mb-2 transition-colors duration-200 group-hover/rose:text-rose-600 dark:group-hover/rose:text-rose-400">System Design</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="s in skills.systemDesign" :key="s" class="text-[11px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-rose-500/10 hover:border-rose-500/40 hover:text-rose-600 dark:hover:text-rose-400">{{ s }}</span>
                  </div>
                </div>

              </div>
            </div>

            <!-- Open to -->
            <div class="rounded-2xl border border-green-500/20 bg-green-500/5 overflow-hidden print:hidden">
              <div class="px-4 py-3 border-b border-green-500/10 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span class="text-[10px] text-green-400 font-semibold uppercase tracking-widest ml-1">Currently Open To</span>
              </div>
              <div class="p-4 space-y-2">
                <div v-for="role in [
                  'Senior Full-Stack Engineer',
                  'Platform Engineering',
                  'AI Systems Engineer',
                  'Contract Opportunities',
                ]" :key="role" class="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Icon name="mdi:check-circle" class="text-green-400 text-sm flex-shrink-0" />
                  {{ role }}
                </div>
                <div class="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                  <a href="mailto:donavanjones79@gmail.com" class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-sky-400 transition-colors">
                    <Icon name="mdi:email-outline" class="text-sky-400 text-sm" />
                    donavanjones79@gmail.com
                  </a>
                  <a href="https://linkedin.com/in/donavanjones" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-sky-400 transition-colors">
                    <Icon name="mdi:linkedin" class="text-sky-400 text-sm" />
                    linkedin.com/in/donavanjones
                  </a>
                </div>
              </div>
            </div>

          </aside>

          <!-- ── MAIN CONTENT ──────────────────────────────────────────── -->
          <main class="space-y-6 min-w-0">

            <!-- Professional Experience -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden print:border-slate-300 print:rounded-none">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">experience.log</span>
              </div>

              <div class="divide-y divide-slate-100 dark:divide-slate-800">
                <div
                  v-for="job in experience"
                  :key="job.company"
                  class="px-6 py-5"
                >
                  <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                    <div>
                      <h3 class="text-base font-semibold text-slate-900 dark:text-white">{{ job.company }}</h3>
                      <p class="text-sm font-medium text-sky-500">{{ job.title }}</p>
                    </div>
                    <span class="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 shrink-0">
                      <Icon name="mdi:map-marker-outline" class="text-sm" />
                      {{ job.location }}
                    </span>
                  </div>
                  <ul class="space-y-1.5">
                    <li
                      v-for="point in job.points"
                      :key="point"
                      class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
                    >
                      <Icon name="mdi:circle-small" class="text-sky-400 text-lg flex-shrink-0 mt-0.5" />
                      {{ point }}
                    </li>
                  </ul>
                  <NuxtLink
                    v-if="job.caseStudy"
                    :to="job.caseStudy.to"
                    class="inline-flex items-center gap-1 mt-3 text-xs font-medium text-sky-500 hover:text-sky-400 transition-colors print:hidden"
                  >
                    {{ job.caseStudy.label }}
                    <Icon name="mdi:arrow-right" class="text-sm" />
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Infrastructure / Homelab -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden print:border-slate-300 print:rounded-none">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">homelab.config</span>
              </div>
              <div class="px-6 py-5">
                <ul class="space-y-1.5">
                  <li
                    v-for="point in homelabPoints"
                    :key="point"
                    class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
                  >
                    <Icon name="mdi:circle-small" class="text-emerald-400 text-lg flex-shrink-0 mt-0.5" />
                    {{ point }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Self-Taught Background -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden print:border-slate-300 print:rounded-none">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">education.md</span>
              </div>
              <div class="px-6 py-5 space-y-4">
                <div>
                  <h3 class="text-base font-semibold text-slate-900 dark:text-white">Self-Taught Engineer</h3>
                  <p class="text-sm font-medium text-amber-500 mt-0.5">20+ Years of Continuous Learning</p>
                  <p class="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Built my entire technical foundation through self-directed study — books, documentation, open-source projects, and two decades of building real production systems. Every skill listed on this resume was learned and applied hands-on, not in a classroom.
                  </p>
                  <ul class="mt-3 space-y-1.5">
                    <li v-for="point in [
                      'Deep expertise in modern JavaScript ecosystem — from early jQuery to Nuxt 3 and full TypeScript',
                      'Developed AI/ML engineering skills through independent research and building production RAG systems',
                      'Kubernetes and distributed systems knowledge built from hands-on homelab experimentation',
                      'Algorithm and data structure study through dedicated practice and technical writing',
                      'Consistent technical writing — 100+ published articles documenting engineering decisions and system design',
                    ]" :key="point" class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      <Icon name="mdi:circle-small" class="text-amber-400 text-lg flex-shrink-0 mt-0.5" />
                      {{ point }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Selected Projects -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden print:border-slate-300 print:rounded-none">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">projects.config</span>
              </div>

              <div class="px-6 py-5">

                <!-- Bible Logic -->
                <div class="mb-2">
                  <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                    <NuxtLink
                      to="/projects/bible-verse"
                      class="text-base font-semibold text-slate-900 dark:text-white hover:text-purple-400 transition-colors"
                    >
                      Bible Verse AI
                    </NuxtLink>
                    <span class="text-[11px] px-2 py-0.5 rounded-full border bg-purple-500/10 text-purple-400 border-purple-500/20 self-start sm:self-auto">
                      Full-Stack SaaS Platform — Founder &amp; Developer
                    </span>
                  </div>
                  <p class="text-sm text-slate-500 dark:text-slate-400 mb-3">
                    37K+ verses indexed · &lt;200ms RAG retrieval · 80% local inference · ~70% cost reduction · 5 bounded domains · Self-hosted Kubernetes
                  </p>
                  <NuxtLink
                    to="/projects/bible-verse"
                    class="inline-flex items-center gap-1 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors mb-4"
                  >
                    View project <Icon name="mdi:arrow-right" class="text-sm" />
                  </NuxtLink>
                </div>

                <div class="grid sm:grid-cols-2 gap-5">
                  <div
                    v-for="section in projectSystems"
                    :key="section.label"
                    class="rounded-xl p-4 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40"
                  >
                    <p class="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-2">{{ section.label }}</p>
                    <ul class="space-y-1">
                      <li
                        v-for="item in section.items"
                        :key="item"
                        class="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed"
                      >
                        <Icon name="mdi:circle-small" class="text-purple-400 text-base flex-shrink-0 mt-0.5" />
                        {{ item }}
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>

          </main>

        </div>

      </div>
    </div>

  </PatternSection>
</template>

<style>
@media print {
  header, nav, footer, .print\:hidden { display: none !important; }
  body, html { background: white !important; color: black !important; }
  .dark\:bg-slate-950 { background: white !important; }
  .dark\:bg-slate-900\/60 { background: white !important; }
  .dark\:text-white { color: black !important; }
  .dark\:text-slate-400 { color: #374151 !important; }
  .dark\:border-slate-700\/50 { border-color: #d1d5db !important; }
  a { text-decoration: none; color: inherit; }
  .rounded-2xl { border-radius: 0 !important; }
}
</style>
