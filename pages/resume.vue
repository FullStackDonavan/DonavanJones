<script setup lang="ts">
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'

useSeoMeta({
  title: 'Resume — Donavan Jones | AI Systems Engineer',
  description: 'AI Systems Engineer with 20+ years building production RAG pipelines, local LLM inference on Kubernetes, full-stack SaaS platforms, and self-hosted cloud infrastructure.',
  ogTitle: 'Resume — Donavan Jones | AI Systems Engineer',
  ogDescription: 'AI Systems Engineer with 20+ years building production RAG pipelines, local LLM inference on Kubernetes, and full-stack SaaS platforms.',
  ogType: 'website',
  ogImage: `${_SITE}/img/heroes/resume.jpg`,
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
    company: 'NBBA (Business Benefit Alliance)',
    title: 'Web Developer',
    location: 'Lakeland, FL',
    dates: 'Aug 2025 – Present',
    caseStudy: { label: 'View full case study →', to: '/projects/business-benefit-alliance' },
    points: [
      'Sole architect and lead developer of the company’s production insurance platform: 10,588 user accounts, 1,859 licensed agents, about 2,000 monthly and 200 daily active users. Gather requirements from leadership and present architecture tradeoffs to non-technical stakeholders',
      'Built card and ACH premium billing on ePayPolicy that has processed $10.8M across 9,632 successful charges since July 2026. Recurring-charge, polling, and ACH-settlement cron jobs use atomic charge locks so a policy is never charged twice',
      'Took 8,490 enrollment applications (7,073 signed, 4,654 active paid policies, 2,880 dependents) through an explicit application state machine. 15,706 signed PDFs are generated with pdf-lib and stored in S3 behind short-lived signed URLs',
      'Built the agent hierarchy and a rule-based commission engine with overrides, point-in-time snapshots, and statement PDFs, plus leaderboards, bonus contests, and 1,888 agent contracting submissions',
      'Integrated carriers and partners: Marpai 834 EDI over SFTP, IHQ TPA exports every 15 minutes, a group quoting and underwriting pipeline (83 groups, 758 census lives), GoHighLevel, AgencyBloc, Dropbox, Google Sheets, and Microsoft Graph',
      'Rolled out field-level encryption for SSNs, bank accounts, and underwriting data, with masked API responses and audit-logged reveals. The append-only audit trail has 47,800 entries. Diagnosed and fixed Postgres connection-exhaustion incidents on Vercel serverless',
      'Scaled the codebase to about 180K lines: 686 API endpoints, 93 Prisma models, 245 additive-only migrations, 8 Vercel cron jobs, and 95 test files. Shipped an in-app support desk (2,659 tickets) and a training library with AI-generated lesson video',
    ],
  },
  {
    company: 'Web Instinct',
    title: 'Web Developer',
    location: 'Tampa, FL',
    dates: 'Aug 2024 – Feb 2025',
    points: [
      'Developed and maintained web applications using Concrete5 CMS',
      'Built custom client portals with performance-focused frontend architecture',
      'Created and extended WordPress themes and plugin functionality',
      'Collaborated with cross-functional teams to deliver scalable web solutions',
      'Performed debugging, testing, and performance optimization across multiple client projects',
    ],
  },
  {
    company: 'Amerus Financial Group',
    title: 'Web Developer',
    location: 'Lakeland, FL',
    dates: 'Dec 2020 – Jul 2024',
    points: [
      'Designed and built the agency’s employee management system in Vue.js — owned the feature set from requirements through deployment',
      'Developed custom WordPress themes and plugins powering the agency’s public web presence and marketing pages',
      'Served as the technical point of contact for management — translated the development process into plain-English status, scope, and tradeoff decisions',
      'Led troubleshooting and issue resolution across the agency’s web properties and internal systems',
    ],
  },
  {
    company: 'Florida Water Analysis',
    title: 'Web Developer',
    location: 'Florida',
    dates: 'Jul 2018 – May 2024',
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
    dates: 'Nov 2013 – Mar 2018',
    points: [
      'Developed Laravel-based internal admin system for tracking client content workflows',
      'Maintained and extended enterprise WordPress theme framework across client sites',
      'Worked with design and layout teams to implement frontend updates',
      'Participated in team development planning and execution workflows',
    ],
  },
]

const homelabPoints = [
  'Designed and operate a 7-node self-hosted Kubernetes cluster (k3s): 4× Raspberry Pi ARM64 nodes (control plane + workers) + 3× NVIDIA Jetson Orin Nano Super 8GB GPU nodes for local AI, plus an RTX 3090 (24GB) workstation for embeddings, LoRA training, and Ornith-1.0-35B (~64 tok/s)',
  'Runs production workloads: VerseHub SaaS platform, PostgreSQL + Apache AGE, Redis, MinIO S3-compatible object storage, Weaviate vector database, and Gitea CI/CD',
  'Full observability stack: Prometheus metrics, Loki + Promtail log aggregation, Grafana dashboards, and a custom /metrics agent for Jetson GPU load — monitoring all cluster nodes and application services',
  'Model scheduling under 8GB unified memory: one role per Jetson — llama3.2:3b pinned in Ollama (20.8 tok/s, 100% on GPU), Kokoro TTS + Whisper STT (0.85 s round trip), and Stable Diffusion plus ~42 sweep-tested small models swapped one at a time',
  'Built Kingdom Tools, an internal platform (FastAPI): per-service provisioning of PostgreSQL, MinIO, Redis, and Weaviate, a service catalog with drift detection, Jetson model load/unload/benchmarking, and a LoRA Lab',
  'Automated CI/CD via self-hosted Gitea Actions: ARM64 images built with docker buildx, imported on each node with k3s ctr, and deployed on every push to main',
  'Cloudflare Tunnel ingress — secure public routing without exposed ports; Flannel CNI for pod networking across heterogeneous hardware tiers',
]

const projectSystems = [
  {
    label: 'AI Pipeline',
    items: [
      'Fast first answer: llama3.2:3b draft on a Jetson Orin Nano Super at ~21 tok/s',
      'Temporal ScholarWorkflow on the Pi workers refines it: retrieve → score → generate → verify',
      'Weaviate retrieval (verses + Church Fathers) with all-MiniLM-L6-v2 embeddings',
      'Citation verification checks every cited reference against retrieved evidence',
    ],
  },
  {
    label: 'Reliability Outcomes',
    items: [
      'Silent retrieval failures now raise instead of producing confident, evidence-free answers',
      'Fixed a scripture search path that never sent the query vector to Weaviate',
      'Fixed Temporal’s default 10 s task timeout and Redis pub/sub replay interleaving streamed text',
      'Cut three workflows per question to one by moving helper calls to a direct quick-LLM endpoint',
    ],
  },
  {
    label: 'Infrastructure',
    items: [
      'Self-hosted Kubernetes (k3s) on a 7-node cluster — 4× Raspberry Pi + 3× Jetson Orin Nano Super 8GB',
      'MinIO S3-compatible object storage with signed URL delivery',
      'PostgreSQL + Apache AGE for relational and graph queries',
      'Prometheus + Loki + Grafana observability across all services',
    ],
  },
  {
    label: 'Architecture Decisions',
    items: [
      '3 async BullMQ queues — transcoding, notifications, AI batch — keep API non-blocking',
      'Fast local draft first, durable Temporal refinement second — users see an answer immediately',
      'Redis pub/sub for cross-instance real-time state — no sticky sessions required',
      'Domain-driven service modules: each domain owns its schema and data access',
    ],
  },
]
</script>

<template>
  <PatternSection>

    <!-- ── HERO ──────────────────────────────────────────────────────────── -->
    <div class="relative isolate overflow-hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 print:border-0">
      <HeroBackdrop src="/img/heroes/resume.jpg" />
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
                  AI Systems Engineer with 20+ years of end-to-end ownership — from gathering requirements with business stakeholders through architecture decisions, implementation, and production operations. Currently sole architect and lead developer of a production insurance platform with 1,859 agents and about 2,000 monthly active users. It has taken 8,490 enrollment applications and processed $10.8M in card and ACH premium payments, and it runs commissions, group quoting, and 834 EDI carrier feeds.
                </p>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Also building and operating a self-hosted AI platform: a 7-node K3s cluster (4 Raspberry Pis + 3 NVIDIA Jetson Orin Nano Super 8GB) plus an RTX 3090 workstation, Temporal-orchestrated RAG with citation verification for VerseHub, the Kingdom Tools internal platform, and full Prometheus + Loki + Grafana observability. I work best when I own the full problem — from first stakeholder conversation to production deployment.
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
                    <div class="flex flex-col sm:items-end gap-0.5 shrink-0">
                      <span class="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Icon name="mdi:calendar-range" class="text-sm" />
                        {{ job.dates }}
                      </span>
                      <span class="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <Icon name="mdi:map-marker-outline" class="text-sm" />
                        {{ job.location }}
                      </span>
                    </div>
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

                <!-- VerseHub -->
                <div class="mb-2">
                  <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                    <NuxtLink
                      to="/projects/versehub"
                      class="text-base font-semibold text-slate-900 dark:text-white hover:text-purple-400 transition-colors"
                    >
                      VerseHub
                    </NuxtLink>
                    <span class="text-[11px] px-2 py-0.5 rounded-full border bg-purple-500/10 text-purple-400 border-purple-500/20 self-start sm:self-auto">
                      Full-Stack SaaS Platform — Founder &amp; Developer
                    </span>
                  </div>
                  <p class="text-sm text-slate-500 dark:text-slate-400 mb-3">
                    Jetson llama3.2:3b fast draft · Temporal RAG workflow (retrieve → score → generate → verify) · Citation verification · Kokoro + Whisper voice · Self-hosted Kubernetes
                  </p>
                  <NuxtLink
                    to="/projects/versehub"
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
