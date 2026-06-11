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
    caseStudy: { label: 'View full case study →', to: '/projects/business-benefit-alliance' },
    points: [
      'Sole full-stack developer and architect — owned all decisions from database schema and API design to AWS infrastructure and deployment',
      'Built and launched Business Benefit Alliance, a production group insurance enrollment SaaS that has onboarded 92 businesses, processed hundreds of employee applications, and handles dozens of daily active users',
      'Designed and enforced a multi-step enrollment state machine covering application submission, digital signature capture, PDF generation, payment authorization, and admin fulfillment',
      'Architected a three-role system (business owner, employee, app admin) with role-scoped data access enforced at the service layer — not just route guards',
      'Designed and managed all AWS infrastructure including S3 object storage for signed PDFs and insurance card delivery',
      'Collaborated directly with business stakeholders — gathered requirements, asked clarifying questions, translated workflows into production features, and iterated based on real user feedback',
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
              Full-Stack / Platform Engineer
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
                  Full-stack engineer with 20+ years of development experience building web applications, SaaS platforms, CMS systems, and modern JavaScript-based systems.
                </p>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Strong background in system architecture, API design, database modeling, AI systems, and multi-role SaaS applications. Comfortable working across frontend, backend, data, and infrastructure layers.
                </p>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Experienced in building AI-integrated applications, self-hosted infrastructure, and distributed system prototypes using modern cloud and local environments.
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
                    Production-grade multi-system platform combining AI, streaming, search, and real-time communication features.
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
