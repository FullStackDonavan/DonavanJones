<script setup lang="ts">
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'

useSeoMeta({
  title: 'Resume — Donavan Jones',
  description: 'Full-stack and platform engineer — 20+ years building production web apps, SaaS systems, AI pipelines, and self-hosted Kubernetes infrastructure.',
  ogTitle: 'Resume — Donavan Jones | Full-Stack / Platform Engineer',
  ogDescription: 'Full-stack and platform engineer — 20+ years building production web apps, SaaS systems, AI pipelines, and self-hosted Kubernetes infrastructure.',
  ogType: 'website',
  ogImage: `${_SITE}/img/logo.png`,
  ogUrl: `${_SITE}/resume`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Resume — Donavan Jones',
  twitterDescription: 'Full-stack and platform engineer — 20+ years across web apps, SaaS, AI systems, and Kubernetes infrastructure.',
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
    points: [
      'Built a production insurance enrollment SaaS platform using Nuxt and PostgreSQL',
      'Designed multi-role system with employee, employer, and admin dashboards',
      'Implemented secure onboarding flow using company-code based registration',
      'Integrated AWS S3 for file storage and asset management',
      'Developed backend logic for business enrollment workflows and user provisioning',
      'Worked directly with stakeholders to translate business requirements into production features',
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
    label: 'System Architecture',
    items: [
      'Modular full-stack SaaS platform with role-based dashboards',
      'Scalable Nuxt frontend architecture with API-driven backend',
      'Multi-role system (users, admins, moderators)',
    ],
  },
  {
    label: 'Core Features',
    items: [
      'AI Bible assistant powered by LLM integration',
      'Retrieval-Augmented Generation (RAG) system using Weaviate',
      'Scripture viewer and Quran comparison system',
      'Real-time livestreaming via AWS IVS and FFmpeg pipelines',
      'WebRTC-based peer-to-peer debate system',
    ],
  },
  {
    label: 'Infrastructure',
    items: [
      'AWS S3 + MinIO hybrid storage architecture',
      'PostgreSQL + Prisma data layer',
      'Redis caching and real-time state management',
      'Vector search and semantic retrieval pipelines',
    ],
  },
  {
    label: 'Advanced Systems',
    items: [
      'Game marketplace system',
      'Digital book publishing tools',
      'Achievement and user progression system',
      'Ad monetization and campaign system',
      'Moderation and content management tools',
      'AI-assisted content and workflow automation',
    ],
  },
]
</script>

<template>
  <PatternSection>

    <!-- ── HERO ──────────────────────────────────────────────────────────── -->
    <div class="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 print:border-0">
      <div class="max-w-5xl mx-auto px-6 py-14 sm:py-20">

        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">

          <!-- Name + title -->
          <div>
            <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
              Donavan Jones
            </h1>
            <p class="mt-2 text-lg font-medium text-sky-500">
              Full-Stack / Platform Engineer
            </p>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Icon name="mdi:map-marker-outline" class="text-base" />
              Lakeland, FL &nbsp;·&nbsp; 20+ years software development experience
            </p>
          </div>

          <!-- Download + Print buttons -->
          <div class="print:hidden self-start flex items-center gap-2">
            <a
              href="/pdf/Donavan-Jones-Resusme-2026.pdf"
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
        </div>

      </div>
    </div>

    <!-- ── BODY ──────────────────────────────────────────────────────────── -->
    <div class="bg-slate-50 dark:bg-slate-950 py-10 print:bg-white print:py-4">
      <div class="max-w-5xl mx-auto px-6">

        <div class="grid lg:grid-cols-[280px_1fr] gap-8">

          <!-- ── LEFT SIDEBAR ──────────────────────────────────────────── -->
          <aside class="space-y-6">

            <!-- Summary -->
            <div class="rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 print:border-slate-300 print:rounded-none print:shadow-none">
              <h2 class="text-sm font-semibold uppercase tracking-wider text-sky-500 mb-3">Summary</h2>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Full-stack engineer with 20+ years of development experience building web applications, SaaS platforms, CMS systems, and modern JavaScript-based systems.
              </p>
              <p class="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Strong background in system architecture, API design, database modeling, AI systems, and multi-role SaaS applications. Comfortable working across frontend, backend, data, and infrastructure layers.
              </p>
              <p class="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Experienced in building AI-integrated applications, self-hosted infrastructure, and distributed system prototypes using modern cloud and local environments.
              </p>
            </div>

            <!-- Skills -->
            <div class="rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 print:border-slate-300 print:rounded-none">
              <h2 class="text-sm font-semibold uppercase tracking-wider text-sky-500 mb-4">Core Skills</h2>

              <div class="space-y-5">

                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-5 h-5 rounded flex items-center justify-center bg-sky-500/10 border border-sky-500/20">
                      <Icon name="mdi:monitor" class="text-sky-400 text-[11px]" />
                    </div>
                    <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Frontend</span>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="s in skills.frontend" :key="s" class="text-[11px] px-2 py-0.5 rounded-md border bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50">{{ s }}</span>
                  </div>
                </div>

                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-5 h-5 rounded flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20">
                      <Icon name="mdi:server" class="text-emerald-400 text-[11px]" />
                    </div>
                    <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Backend</span>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="s in skills.backend" :key="s" class="text-[11px] px-2 py-0.5 rounded-md border bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50">{{ s }}</span>
                  </div>
                </div>

                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-5 h-5 rounded flex items-center justify-center bg-purple-500/10 border border-purple-500/20">
                      <Icon name="mdi:brain" class="text-purple-400 text-[11px]" />
                    </div>
                    <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Data / AI / Search</span>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="s in skills.dataAi" :key="s" class="text-[11px] px-2 py-0.5 rounded-md border bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50">{{ s }}</span>
                  </div>
                </div>

                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-5 h-5 rounded flex items-center justify-center bg-amber-500/10 border border-amber-500/20">
                      <Icon name="mdi:cloud-outline" class="text-amber-400 text-[11px]" />
                    </div>
                    <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Cloud / DevOps</span>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="s in skills.cloud" :key="s" class="text-[11px] px-2 py-0.5 rounded-md border bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50">{{ s }}</span>
                  </div>
                </div>

                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-5 h-5 rounded flex items-center justify-center bg-rose-500/10 border border-rose-500/20">
                      <Icon name="mdi:sitemap-outline" class="text-rose-400 text-[11px]" />
                    </div>
                    <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">System Design</span>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="s in skills.systemDesign" :key="s" class="text-[11px] px-2 py-0.5 rounded-md border bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50">{{ s }}</span>
                  </div>
                </div>

              </div>
            </div>

          </aside>

          <!-- ── MAIN CONTENT ──────────────────────────────────────────── -->
          <main class="space-y-6 min-w-0">

            <!-- Professional Experience -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 overflow-hidden print:border-slate-300 print:rounded-none">
              <div class="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 class="text-sm font-semibold uppercase tracking-wider text-sky-500 flex items-center gap-2">
                  <Icon name="mdi:briefcase-outline" class="text-base" />
                  Professional Experience
                </h2>
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
                </div>
              </div>
            </div>

            <!-- Infrastructure / Homelab -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 print:border-slate-300 print:rounded-none">
              <div class="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 class="text-sm font-semibold uppercase tracking-wider text-emerald-500 flex items-center gap-2">
                  <Icon name="mdi:raspberry-pi" class="text-base" />
                  Infrastructure / Homelab
                </h2>
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

            <!-- Selected Projects -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 print:border-slate-300 print:rounded-none">
              <div class="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 class="text-sm font-semibold uppercase tracking-wider text-purple-500 flex items-center gap-2">
                  <Icon name="mdi:code-braces" class="text-base" />
                  Selected Projects
                </h2>
              </div>

              <div class="px-6 py-5">

                <!-- Bible Logic -->
                <div class="mb-2">
                  <div class="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                    <h3 class="text-base font-semibold text-slate-900 dark:text-white">Bible Logic</h3>
                    <span class="text-[11px] px-2 py-0.5 rounded-full border bg-purple-500/10 text-purple-400 border-purple-500/20 self-start sm:self-auto">
                      Full-Stack SaaS Platform — Founder &amp; Developer
                    </span>
                  </div>
                  <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Production-grade multi-system platform combining AI, streaming, search, and real-time communication features.
                  </p>
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
