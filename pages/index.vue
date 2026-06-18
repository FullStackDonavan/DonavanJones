<script setup lang="ts">
const config = useRuntimeConfig()
const SITE = (config.public.appDomain as string) || 'https://donavanjones.com'

useSeoMeta({
  title: 'Donavan Jones — AI Automation & Custom Software for Small Businesses',
  description:
    'I help small businesses build AI-powered systems, automation, and modern web apps that save time and increase revenue. AI lead capture, SaaS platforms, and workflow automation — built and handed over.',
  ogTitle: 'Donavan Jones — AI Automation & Custom Software for Small Businesses',
  ogDescription:
    'AI lead capture, workflow automation, and custom SaaS development. Production systems delivered end-to-end for small businesses.',
  ogType: 'website',
  ogImage: `${SITE}/img/logo.png`,
  ogUrl: `${SITE}/`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Donavan Jones — AI Automation & Custom Software',
  twitterDescription:
    'AI automation and custom software for small businesses. Built, deployed, and handed over.',
  canonical: `${SITE}/`,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        '@id': `${SITE}/`,
        url: `${SITE}/`,
        name: 'Donavan Jones — AI Automation & Custom Software',
        description:
          'AI automation, custom web applications, and business software for small businesses. 20+ years of engineering experience.',
        mainEntity: { '@id': `${SITE}/#person` },
        isPartOf: { '@id': `${SITE}/#website` },
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        '@id': `${SITE}/#service`,
        name: 'Donavan Jones',
        url: SITE,
        description:
          'AI automation and custom software for small businesses — lead capture, SaaS platforms, workflow automation, and production AI systems.',
        provider: { '@id': `${SITE}/#person` },
        areaServed: [
          { '@type': 'City', name: 'Lakeland', containedInPlace: { '@type': 'State', name: 'Florida' } },
          { '@type': 'State', name: 'Florida' },
          { '@type': 'Country', name: 'United States' },
        ],
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${SITE}/#organization`,
        name: 'Donavan Jones',
        url: SITE,
        logo: {
          '@type': 'ImageObject',
          '@id': `${SITE}/#logo`,
          url: `${SITE}/img/logo.png`,
          contentUrl: `${SITE}/img/logo.png`,
          caption: 'Donavan Jones',
        },
        image: { '@id': `${SITE}/#logo` },
        description:
          'AI automation and custom software for small businesses — production AI systems, SaaS platforms, and workflow automation.',
        founder: { '@id': `${SITE}/#person` },
        sameAs: [
          'https://github.com/FullStackDonavan',
          'https://linkedin.com/in/donavanjones',
        ],
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: SITE,
        name: 'Donavan Jones',
        description:
          'AI automation and custom software engineer — building production systems for small businesses.',
        inLanguage: 'en-US',
        publisher: { '@id': `${SITE}/#organization` },
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${SITE}/#person`,
        name: 'Donavan Jones',
        url: SITE,
        jobTitle: 'AI Systems Engineer & Software Developer',
        worksFor: { '@id': `${SITE}/#organization` },
        knowsAbout: [
          'Nuxt 3', 'Vue 3', 'TypeScript', 'Node.js', 'PostgreSQL',
          'Redis', 'Kubernetes', 'RAG Pipelines', 'LLM Integration',
          'WebRTC', 'BullMQ', 'Weaviate', 'Docker', 'CI/CD',
        ],
        sameAs: [
          'https://github.com/FullStackDonavan',
          'https://linkedin.com/in/donavanjones',
        ],
      }),
    },
  ],
})

const { data: recentPosts } = await useAsyncData('home-posts', () =>
  queryContent('/blog')
    .where({ draft: { $ne: true } })
    .limit(3)
    .find()
)

const { data: recentProjects } = await useAsyncData('home-projects', () =>
  queryContent('/projects')
    .where({ draft: { $ne: true } })
    .limit(3)
    .find()
)

const focuses = [
  {
    icon: 'mdi:robot-outline',
    color: 'sky',
    title: 'AI Lead Capture & Automation',
    desc: 'AI answers calls, captures leads, books appointments, and sends follow-ups — 24/7, without extra staff.',
    to: '/services/ai-automation',
  },
  {
    icon: 'mdi:code-braces',
    color: 'purple',
    title: 'Custom Web Apps & SaaS',
    desc: 'Full-stack web applications with dashboards, billing, auth, and real-time features — built from scratch and handed over.',
    to: '/services/web-development',
  },
  {
    icon: 'mdi:cog-sync-outline',
    color: 'amber',
    title: 'Workflow & Admin Automation',
    desc: 'Automate quote generation, intake processing, follow-up emails, and review requests — no more manual busywork.',
    to: '/services/ai-automation',
  },
  {
    icon: 'mdi:server-network',
    color: 'emerald',
    title: 'Infrastructure & Deployment',
    desc: 'Kubernetes, CI/CD, cloud deployment, and production monitoring — your system runs reliably from day one.',
    to: '/services/web-development',
  },
]

const systems = [
  {
    to: '/categories/ai-engineering',
    icon: 'mdi:brain',
    color: 'purple',
    title: 'AI Systems',
    tags: ['RAG', 'Weaviate', 'Llama 3.2', 'Agents'],
  },
  {
    to: '/categories/backend-engineering',
    icon: 'mdi:api',
    color: 'sky',
    title: 'Backend',
    tags: ['Nitro', 'FastAPI', 'BullMQ', 'PostgreSQL'],
  },
  {
    to: '/categories/infrastructure-engineering',
    icon: 'mdi:server-network',
    color: 'emerald',
    title: 'Infrastructure',
    tags: ['k3s', 'Raspberry Pi 5', 'Gitea', 'Prometheus'],
  },
]

function truncate(text: string, max = 110): string {
  if (!text) return ''
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <PatternSection>

    <!-- ── HERO ──────────────────────────────────────────────────────────── -->
    <section class="w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6 py-20 md:py-28">

        <div class="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-center">

          <!-- LEFT: Text -->
          <div>

            <!-- Name + availability -->
            <div class="flex items-center gap-3 mb-5">
              <span class="text-sm font-medium text-slate-500 dark:text-slate-400">Donavan Jones</span>
              <span class="w-px h-4 bg-slate-300 dark:bg-slate-700"></span>
              <span class="inline-flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium">
                <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Available for new projects
              </span>
            </div>

            <!-- Headline -->
            <h1 class="text-4xl sm:text-5xl md:text-[3.5rem] font-bold leading-[1.15] tracking-tight text-slate-900 dark:text-white">
              I build AI-powered systems
              <span class="block text-sky-500 mt-2">that save your business time &amp; generate revenue</span>
            </h1>

            <!-- Sub -->
            <p class="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
              Whether you need an AI lead capture system, a custom SaaS platform, or workflow automation —
              I build it, connect it to your business, and hand it over. No subscriptions, no platform lock-in.
              20+ years of engineering. Full ownership from concept to production.
            </p>

            <!-- CTAs (dual-path) -->
            <div class="mt-7 flex flex-wrap items-center gap-3">
              <NuxtLink
                to="/services"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm transition-colors duration-200"
              >
                <Icon name="mdi:cog-outline" class="text-base" />
                See Services
              </NuxtLink>
              <NuxtLink
                to="/projects/overview"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:border-sky-500/40 hover:text-sky-500 dark:hover:text-sky-400 font-medium text-sm transition-colors duration-200"
              >
                <Icon name="mdi:briefcase-outline" class="text-base" />
                View Case Studies
              </NuxtLink>
              <NuxtLink
                to="/resume"
                class="text-sm text-slate-400 dark:text-slate-500 hover:text-sky-500 dark:hover:text-sky-400 font-medium transition-colors duration-200"
              >
                Hiring? View Resume →
              </NuxtLink>
            </div>

            <!-- Stat strip -->
            <div class="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-8">
              <div>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">20+</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Years engineering</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">92</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Businesses served</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">3</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Production AI systems</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">75+</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Technical articles</p>
              </div>
            </div>

          </div>

          <!-- RIGHT: Outcomes card -->
          <div>
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden">

              <!-- Card header -->
              <div class="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-xs text-slate-400 dark:text-slate-500 ml-1">outcomes.results</span>
              </div>

              <!-- Outcomes list -->
              <div class="p-5 space-y-4">

                <div class="rounded-xl px-4 py-3 border border-sky-500/20 bg-sky-500/5">
                  <p class="text-[10px] uppercase tracking-widest text-sky-500 font-semibold mb-1">Client Platform</p>
                  <p class="text-2xl font-bold text-slate-900 dark:text-white leading-none">92 Businesses</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Automated enrollment platform</p>
                </div>

                <div class="rounded-xl px-4 py-3 border border-emerald-500/20 bg-emerald-500/5">
                  <p class="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold mb-1">Time Saved</p>
                  <p class="text-2xl font-bold text-slate-900 dark:text-white leading-none">Hours → Minutes</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Enrollment workflow automation</p>
                </div>

                <div class="rounded-xl px-4 py-3 border border-purple-500/20 bg-purple-500/5">
                  <p class="text-[10px] uppercase tracking-widest text-purple-500 font-semibold mb-1">AI Performance</p>
                  <p class="text-2xl font-bold text-slate-900 dark:text-white leading-none">37K+ Docs Indexed</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">RAG retrieval under 200ms</p>
                </div>

                <div class="rounded-xl px-4 py-3 border border-amber-500/20 bg-amber-500/5">
                  <p class="text-[10px] uppercase tracking-widest text-amber-500 font-semibold mb-1">Cost Reduction</p>
                  <p class="text-2xl font-bold text-slate-900 dark:text-white leading-none">70% Savings</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Local inference vs. cloud routing</p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ── WHAT I BUILD FOR CLIENTS ──────────────────────────────────────── -->
    <section class="bg-slate-50 dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">

        <div class="mb-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium">
            <Icon name="mdi:target" class="text-sm" />
            Services
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            What I build for clients
          </h2>
          <p class="mt-2 text-slate-500 dark:text-slate-400 text-sm max-w-xl">
            Production systems delivered end-to-end — from requirements to deployment. You own everything.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NuxtLink
            v-for="f in focuses"
            :key="f.title"
            :to="f.to"
            class="group rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 flex flex-col gap-3 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-200"
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center border"
              :class="{
                'bg-sky-500/10 border-sky-500/20':     f.color === 'sky',
                'bg-purple-500/10 border-purple-500/20': f.color === 'purple',
                'bg-emerald-500/10 border-emerald-500/20': f.color === 'emerald',
                'bg-amber-500/10 border-amber-500/20': f.color === 'amber',
              }"
            >
              <Icon :name="f.icon" class="text-xl"
                :class="{
                  'text-sky-400':    f.color === 'sky',
                  'text-purple-400': f.color === 'purple',
                  'text-emerald-400':f.color === 'emerald',
                  'text-amber-400':  f.color === 'amber',
                }"
              />
            </div>
            <div>
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors">{{ f.title }}</h3>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ f.desc }}</p>
            </div>
            <div class="flex items-center gap-1 text-xs font-medium text-sky-500 group-hover:gap-2 transition-all mt-auto">
              Learn more <Icon name="mdi:arrow-right" class="text-sm" />
            </div>
          </NuxtLink>
        </div>

      </div>
    </section>

    <!-- ── LOCAL BUSINESS AI ────────────────────────────────────────────────── -->
    <section class="bg-white dark:bg-slate-900/30 py-14 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">
        <div class="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-7 sm:p-10">
          <div class="flex flex-col lg:flex-row lg:items-center gap-8">

            <div class="flex-1">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-medium">
                <Icon name="mdi:store-outline" class="text-sm" />
                For Local Businesses · Central Florida
              </div>
              <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                AI that gets you more leads.<br class="hidden sm:block" />
                Automation that gives you your time back.
              </h2>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mb-5">
                I build AI lead capture systems, after-hours agents, and workflow automation for local businesses in
                Lakeland, Tampa, Orlando, and across Central Florida — roofing, HVAC, law firms, med spas, and more.
                You get the system built and handed over. No platform subscriptions.
              </p>
              <NuxtLink
                to="/services/local-business-ai"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors duration-200 shadow-lg shadow-amber-500/20"
              >
                <Icon name="mdi:arrow-right-circle-outline" class="text-base" />
                See Local Business AI Services
              </NuxtLink>
            </div>

            <div class="grid grid-cols-2 gap-2 lg:w-64 shrink-0">
              <div
                v-for="outcome in [
                  { icon: 'mdi:phone-missed', text: 'Stop losing leads after hours' },
                  { icon: 'mdi:chat-processing-outline', text: '24/7 AI sales assistant' },
                  { icon: 'mdi:cog-sync-outline', text: 'Admin & follow-ups automated' },
                  { icon: 'mdi:account-off-outline', text: 'No extra staff needed' },
                ]"
                :key="outcome.text"
                class="flex items-start gap-2 p-3 rounded-xl border border-amber-500/15 bg-white dark:bg-slate-900/60"
              >
                <Icon :name="outcome.icon" class="text-amber-400 text-sm flex-shrink-0 mt-0.5" />
                <span class="text-xs text-slate-600 dark:text-slate-400 leading-snug">{{ outcome.text }}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- ── TRUST BLOCK ──────────────────────────────────────────────────── -->
    <TrustBlock variant="full" />

    <!-- ── FEATURED CASE STUDY ────────────────────────────────────────────── -->
    <section class="bg-slate-50 dark:bg-slate-950 py-12 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">

        <NuxtLink
          to="/projects/business-benefit-alliance"
          class="group block rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-6 sm:p-8 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-200"
        >
          <div class="flex flex-col sm:flex-row sm:items-start gap-6">

            <div class="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:domain" class="text-sky-400 text-2xl" />
            </div>

            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-[11px] px-2 py-0.5 rounded-md font-medium bg-sky-500/10 border border-sky-500/20 text-sky-400">
                  Case Study
                </span>
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-sky-500 transition-colors">Business Benefit Alliance</h2>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                Full-stack group insurance enrollment platform. 92 businesses onboarded. Enrollment workflows
                reduced from hours to minutes. Multi-role dashboards, digital signature capture, automated PDF
                generation, and audit trails. Built end-to-end as sole developer and architect.
              </p>

              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="tag in ['Nuxt 3', 'PostgreSQL', 'AWS S3', 'Prisma', 'PDF Generation', 'Digital Signatures']"
                  :key="tag"
                  class="text-[11px] px-2 py-0.5 rounded-md border bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/50"
                >{{ tag }}</span>
              </div>

              <div class="mt-5 flex items-center gap-1 text-xs font-medium text-sky-500 group-hover:gap-2 transition-all">
                View full case study
                <Icon name="mdi:arrow-right" class="text-sm" />
              </div>
            </div>

            <div class="sm:text-right flex-shrink-0">
              <div class="space-y-3">
                <div>
                  <p class="text-xs text-slate-400 dark:text-slate-500">Businesses</p>
                  <p class="text-lg font-bold text-slate-900 dark:text-white">92</p>
                </div>
                <div>
                  <p class="text-xs text-slate-400 dark:text-slate-500">Enrollment Time</p>
                  <p class="text-lg font-bold text-emerald-500">Hours → Min</p>
                </div>
              </div>
            </div>

          </div>
        </NuxtLink>

      </div>
    </section>

    <!-- ── RECENT CASE STUDIES ────────────────────────────────────────────── -->
    <section v-if="recentProjects?.length" class="bg-white dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">

        <div class="flex items-center justify-between mb-8">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium">
              <Icon name="mdi:folder-multiple-outline" class="text-sm" />
              Client Work
            </div>
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Case Studies</h2>
          </div>
          <NuxtLink
            to="/projects/overview"
            class="hidden sm:inline-flex items-center gap-1 text-sm text-sky-500 hover:text-sky-400 transition-colors"
          >
            All projects
            <Icon name="mdi:arrow-right" class="text-base" />
          </NuxtLink>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <NuxtLink
            v-for="project in recentProjects"
            :key="project._path"
            :to="project._path"
            class="group flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-200"
          >
            <div class="relative overflow-hidden h-40 bg-slate-100 dark:bg-slate-800">
              <img
                v-if="project.excerptImage"
                :src="project.excerptImage"
                :alt="project.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <Icon name="mdi:code-braces" class="text-5xl text-slate-300 dark:text-slate-600" />
              </div>
              <div v-if="project.status"
                class="absolute top-3 right-3 text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm border border-white/10"
              >
                {{ project.status }}
              </div>
            </div>
            <div class="flex flex-col flex-1 p-5">
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors">
                {{ project.title }}
              </h3>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                {{ truncate(project.description) }}
              </p>
              <div v-if="project.frontend?.length || project.backend?.length" class="mt-3 flex flex-wrap gap-1">
                <span
                  v-for="tag in [...(project.frontend || []), ...(project.backend || [])].slice(0, 4)"
                  :key="tag"
                  class="text-[10px] px-1.5 py-0.5 rounded border bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/50"
                >{{ tag }}</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div class="mt-6 sm:hidden">
          <NuxtLink to="/projects/overview" class="inline-flex items-center gap-1 text-sm text-sky-500 hover:text-sky-400 transition-colors">
            All projects <Icon name="mdi:arrow-right" class="text-base" />
          </NuxtLink>
        </div>

      </div>
    </section>

    <!-- ── RECENT WRITING ─────────────────────────────────────────────────── -->
    <section v-if="recentPosts?.length" class="bg-slate-50 dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">

        <div class="flex items-center justify-between mb-8">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium">
              <Icon name="mdi:pencil-outline" class="text-sm" />
              Writing
            </div>
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Recent Articles</h2>
          </div>
          <NuxtLink
            to="/blog/overview"
            class="hidden sm:inline-flex items-center gap-1 text-sm text-sky-500 hover:text-sky-400 transition-colors"
          >
            All articles
            <Icon name="mdi:arrow-right" class="text-base" />
          </NuxtLink>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <NuxtLink
            v-for="post in recentPosts"
            :key="post._path"
            :to="post._path"
            class="group flex flex-col rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-200"
          >
            <div class="relative overflow-hidden h-40 bg-slate-100 dark:bg-slate-800">
              <img
                v-if="post.excerptImage"
                :src="post.excerptImage"
                :alt="post.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <Icon name="mdi:text-box-outline" class="text-5xl text-slate-300 dark:text-slate-600" />
              </div>
              <div v-if="post.category"
                class="absolute top-3 right-3 text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm border border-white/10"
              >
                {{ post.category }}
              </div>
            </div>
            <div class="flex flex-col flex-1 p-5">
              <p v-if="post.date" class="text-[11px] text-slate-400 dark:text-slate-500 mb-1">
                {{ formatDate(post.date) }}
              </p>
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors leading-snug flex-1">
                {{ post.title }}
              </h3>
              <p class="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ truncate(post.description) }}
              </p>
            </div>
          </NuxtLink>
        </div>

        <div class="mt-6 sm:hidden">
          <NuxtLink to="/blog/overview" class="inline-flex items-center gap-1 text-sm text-sky-500 hover:text-sky-400 transition-colors">
            All articles <Icon name="mdi:arrow-right" class="text-base" />
          </NuxtLink>
        </div>

      </div>
    </section>

    <!-- ── SYSTEMS (Technical Deep-Dives) ────────────────────────────────── -->
    <section class="bg-white dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">

        <div class="flex items-center justify-between mb-8">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium">
              <Icon name="mdi:sitemap" class="text-sm" />
              Under the Hood
            </div>
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Technical deep-dives</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">The infrastructure behind the systems I build for clients.</p>
          </div>
          <NuxtLink
            to="/system-overview"
            class="hidden sm:inline-flex items-center gap-1 text-sm text-sky-500 hover:text-sky-400 transition-colors"
          >
            Full overview
            <Icon name="mdi:arrow-right" class="text-base" />
          </NuxtLink>
        </div>

        <div class="grid sm:grid-cols-3 gap-4">
          <NuxtLink
            v-for="sys in systems"
            :key="sys.to"
            :to="sys.to"
            class="group rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 flex flex-col gap-4 transition-all duration-200 hover:shadow-lg"
            :class="{
              'hover:border-purple-500/40 hover:shadow-purple-500/5': sys.color === 'purple',
              'hover:border-sky-500/40 hover:shadow-sky-500/5':       sys.color === 'sky',
              'hover:border-emerald-500/40 hover:shadow-emerald-500/5': sys.color === 'emerald',
            }"
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center border"
              :class="{
                'bg-purple-500/10 border-purple-500/20': sys.color === 'purple',
                'bg-sky-500/10 border-sky-500/20':       sys.color === 'sky',
                'bg-emerald-500/10 border-emerald-500/20': sys.color === 'emerald',
              }"
            >
              <Icon :name="sys.icon" class="text-xl"
                :class="{
                  'text-purple-400': sys.color === 'purple',
                  'text-sky-400':    sys.color === 'sky',
                  'text-emerald-400':sys.color === 'emerald',
                }"
              />
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors">
                {{ sys.title }}
              </h3>
              <div class="mt-2 flex flex-wrap gap-1">
                <span
                  v-for="tag in sys.tags"
                  :key="tag"
                  class="text-[10px] px-1.5 py-0.5 rounded border"
                  :class="{
                    'bg-purple-500/10 text-purple-400 border-purple-500/20': sys.color === 'purple',
                    'bg-sky-500/10 text-sky-400 border-sky-500/20':           sys.color === 'sky',
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20': sys.color === 'emerald',
                  }"
                >{{ tag }}</span>
              </div>
            </div>
            <div class="flex items-center gap-1 text-xs font-medium text-sky-500 group-hover:translate-x-1 transition-transform duration-200">
              Explore <Icon name="mdi:arrow-right" class="text-sm" />
            </div>
          </NuxtLink>
        </div>

      </div>
    </section>

    <!-- ── RECRUITER STRIP (condensed) ───────────────────────────────────── -->
    <section class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6 py-8">

        <div class="flex flex-wrap items-center gap-2 mb-5">
          <span class="inline-flex items-center gap-1.5 text-xs text-green-500 font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            Open to new roles
          </span>
          <span class="w-px h-3.5 bg-slate-300 dark:bg-slate-700"></span>
          <NuxtLink to="/hire-me" class="text-xs text-sky-500 hover:text-sky-400 transition-colors font-medium">
            View full details →
          </NuxtLink>
        </div>

        <div class="grid sm:grid-cols-3 gap-6">

          <div>
            <p class="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold mb-3">Looking For</p>
            <ul class="space-y-2">
              <li v-for="role in ['AI Systems Engineer', 'Founding Engineer', 'Senior Full-Stack Engineer', 'Platform Engineer']" :key="role"
                class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <Icon name="mdi:check-circle" class="text-sky-400 text-base flex-shrink-0" />
                {{ role }}
              </li>
            </ul>
          </div>

          <div>
            <p class="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold mb-3">Preferred</p>
            <ul class="space-y-2">
              <li v-for="pref in ['Remote', 'U.S.-based', 'Strong IC · comfortable owning technical direction']" :key="pref"
                class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <Icon name="mdi:circle-small" class="text-slate-400 text-lg flex-shrink-0" />
                {{ pref }}
              </li>
            </ul>
          </div>

          <div>
            <p class="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold mb-3">Core Strengths</p>
            <ul class="space-y-2">
              <li v-for="strength in ['Stakeholder to production', 'AI systems in production', 'Kubernetes platform engineering', 'Full-stack SaaS ownership']" :key="strength"
                class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <Icon name="mdi:circle-small" class="text-slate-400 text-lg flex-shrink-0" />
                {{ strength }}
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>

    <!-- ── DUAL CTA ──────────────────────────────────────────────────────── -->
    <section id="contact" class="bg-white dark:bg-slate-950 py-16">
      <div class="max-w-7xl mx-auto px-6">

        <div class="grid md:grid-cols-2 gap-5">

          <!-- Freelance CTA -->
          <div class="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-8 sm:p-10 text-center">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              Available for projects
            </div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Ready to automate your business?
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Tell me what you're trying to build. I'll follow up within one business day with a plain-English proposal.
            </p>
            <div class="flex flex-wrap justify-center gap-3">
              <NuxtLink
                to="/hire-me#contact"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm transition-colors duration-200 shadow-lg shadow-sky-500/20"
              >
                <Icon name="mdi:email-outline" class="text-base" />
                Request a Quote
              </NuxtLink>
              <NuxtLink
                to="/services"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-sky-500/30 text-sky-500 hover:bg-sky-500/10 font-medium text-sm transition-colors duration-200"
              >
                <Icon name="mdi:cog-outline" class="text-base" />
                See Services
              </NuxtLink>
            </div>
          </div>

          <!-- Recruiter CTA -->
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 p-8 sm:p-10 text-center">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              Open to new roles
            </div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Looking to hire?
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Senior IC roles in AI engineering, platform engineering, or full-stack development. Remote. U.S.-based.
            </p>
            <div class="flex flex-wrap justify-center gap-3">
              <NuxtLink
                to="/resume"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-sky-500/40 hover:text-sky-500 font-medium text-sm transition-all duration-200"
              >
                <Icon name="mdi:file-account-outline" class="text-base" />
                View Resume
              </NuxtLink>
              <a
                href="https://linkedin.com/in/donavanjones"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-sky-500/40 hover:text-sky-500 font-medium text-sm transition-all duration-200"
              >
                <Icon name="mdi:linkedin" class="text-base" />
                LinkedIn
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>

  </PatternSection>
</template>
