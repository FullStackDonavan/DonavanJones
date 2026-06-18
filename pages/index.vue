<script setup lang="ts">
const config = useRuntimeConfig()
const SITE = (config.public.appDomain as string) || 'https://donavanjones.com'

useSeoMeta({
  title: 'Donavan Jones — AI Systems Engineer',
  description:
    'AI Systems Engineer with 20+ years building production RAG pipelines, local LLM inference on Kubernetes, full-stack SaaS platforms, and self-hosted cloud infrastructure.',
  ogTitle: 'Donavan Jones — AI Systems Engineer',
  ogDescription:
    'AI Systems Engineer with 20+ years building production RAG pipelines, local LLM inference on Kubernetes, and full-stack SaaS platforms.',
  ogType: 'website',
  ogImage: `${SITE}/img/logo.png`,
  ogUrl: `${SITE}/`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Donavan Jones — AI Systems Engineer',
  twitterDescription:
    'AI Systems Engineer building production RAG pipelines, Kubernetes-hosted LLMs, and full-stack SaaS platforms.',
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
        name: 'Donavan Jones — Full-Stack / Platform Engineer',
        description:
          'Full-stack engineer with 20+ years building SaaS platforms, AI systems, self-hosted infrastructure, and production-grade web applications.',
        mainEntity: { '@id': `${SITE}/#person` },
        isPartOf: { '@id': `${SITE}/#website` },
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
          'Full-stack engineering and systems architecture — AI systems, SaaS platforms, self-hosted Kubernetes infrastructure, and production-grade web applications.',
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
          'Full-stack engineer and systems architect — writing and building in Nuxt, AI, Kubernetes, and distributed systems.',
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
        jobTitle: 'Full-Stack Engineer & Systems Architect',
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
    icon: 'mdi:layers-triple',
    color: 'sky',
    title: 'Full-Stack Engineering',
    desc: 'End-to-end product delivery — from Nuxt frontend architecture to Node.js APIs, database design, and deployment pipelines.',
  },
  {
    icon: 'mdi:brain',
    color: 'purple',
    title: 'AI Systems',
    desc: 'Production RAG pipelines, vector search, LLM integration, agent workflows, and on-cluster inference using Llama and Weaviate.',
  },
  {
    icon: 'mdi:kubernetes',
    color: 'emerald',
    title: 'Infrastructure',
    desc: 'Self-hosted Kubernetes on ARM64, CI/CD via Gitea, Prometheus observability, and distributed storage with MinIO.',
  },
  {
    icon: 'mdi:view-dashboard-outline',
    color: 'amber',
    title: 'SaaS Platforms',
    desc: 'Multi-role SaaS with RBAC, real-time features, async job queues, and modular service-oriented architecture.',
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
            <h1 class="text-4xl sm:text-5xl md:text-[3.5rem] font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white">
              AI Systems Engineer
              <span class="block text-sky-500 mt-2">& Platform Builder</span>
            </h1>

            <!-- Sub -->
            <p class="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
              I design and ship production AI systems end-to-end — RAG pipelines, local LLM inference
              on self-hosted Kubernetes, and full-stack SaaS platforms. 20+ years. No hand-holding required.
            </p>

            <!-- CTAs -->
            <div class="mt-7 flex flex-wrap gap-3">
              <NuxtLink
                to="/projects/overview"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm transition-colors duration-200"
              >
                <Icon name="mdi:code-braces" class="text-base" />
                View Projects
              </NuxtLink>
              <NuxtLink
                to="/blog/overview"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:border-sky-500/40 hover:text-sky-500 dark:hover:text-sky-400 font-medium text-sm transition-colors duration-200"
              >
                <Icon name="mdi:pencil-outline" class="text-base" />
                Read the Blog
              </NuxtLink>
              <NuxtLink
                to="/resume"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:border-sky-500/40 hover:text-sky-500 dark:hover:text-sky-400 font-medium text-sm transition-colors duration-200"
              >
                <Icon name="mdi:file-account-outline" class="text-base" />
                Resume
              </NuxtLink>
            </div>

            <!-- Featured Projects card -->
            <div class="mt-7 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden max-w-lg">

              <!-- Card header -->
              <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="flex gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  </div>
                  <span class="text-xs text-slate-400 dark:text-slate-500 ml-1">featured.projects</span>
                </div>
                <NuxtLink
                  to="/projects/overview"
                  class="text-[10px] text-sky-500 hover:text-sky-400 transition-colors font-medium"
                >
                  View all →
                </NuxtLink>
              </div>

              <!-- Project list -->
              <div class="divide-y divide-slate-100 dark:divide-slate-800">
                <NuxtLink
                  v-for="project in recentProjects"
                  :key="project._path"
                  :to="project._path"
                  class="group flex items-center gap-3 px-5 py-3 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div class="w-6 h-6 rounded-md bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon name="mdi:code-braces" class="text-sky-400 text-[10px]" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors truncate">
                      {{ project.title }}
                    </p>
                    <div v-if="project.frontend?.length || project.backend?.length" class="mt-0.5 flex flex-wrap gap-1">
                      <span
                        v-for="tag in [...(project.frontend || []), ...(project.backend || [])].slice(0, 3)"
                        :key="tag"
                        class="text-[9px] px-1.5 py-px rounded border bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700/50"
                      >{{ tag }}</span>
                    </div>
                  </div>
                  <Icon name="mdi:arrow-right" class="text-slate-300 dark:text-slate-600 group-hover:text-sky-400 text-xs flex-shrink-0 transition-colors" />
                </NuxtLink>
              </div>

            </div>

            <!-- Stat strip -->
            <div class="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-8">
              <div>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">20+</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Years engineering</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">12-Node</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Kubernetes cluster (Pi 5 + Jetson)</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">20k+</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Docs indexed for RAG</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">75+</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Technical articles</p>
              </div>
            </div>

          </div>

          <!-- RIGHT: Stack card -->
          <div>
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden">

              <!-- Card header -->
              <div class="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-xs text-slate-400 dark:text-slate-500 ml-1">stack.config</span>
              </div>

              <!-- Stack groups -->
              <div class="p-5 space-y-1">

                <div class="rounded-xl px-3 py-3 transition-all duration-200 hover:bg-sky-500/10 dark:hover:bg-sky-500/8 group/sky">
                  <p class="text-[10px] uppercase tracking-widest text-sky-500 font-semibold mb-2 transition-colors duration-200 group-hover/sky:text-sky-600 dark:group-hover/sky:text-sky-400">Cluster</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="t in ['k3s', 'Kubernetes', 'ARM64', 'Raspberry Pi 5', '8 Nodes']" :key="t"
                      class="text-[11px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-sky-500/10 hover:border-sky-500/40 hover:text-sky-600 dark:hover:text-sky-400">
                      {{ t }}
                    </span>
                  </div>
                </div>

                <div class="rounded-xl px-3 py-3 transition-all duration-200 hover:bg-purple-500/10 dark:hover:bg-purple-500/8 group/purple">
                  <p class="text-[10px] uppercase tracking-widest text-purple-500 font-semibold mb-2 transition-colors duration-200 group-hover/purple:text-purple-600 dark:group-hover/purple:text-purple-400">AI & ML</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="t in ['Llama 3.2', 'Weaviate', 'RAG', 'Embeddings', 'LLMs']" :key="t"
                      class="text-[11px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-purple-500/10 hover:border-purple-500/40 hover:text-purple-600 dark:hover:text-purple-400">
                      {{ t }}
                    </span>
                  </div>
                </div>

                <div class="rounded-xl px-3 py-3 transition-all duration-200 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/8 group/emerald">
                  <p class="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold mb-2 transition-colors duration-200 group-hover/emerald:text-emerald-600 dark:group-hover/emerald:text-emerald-400">Data Layer</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="t in ['PostgreSQL', 'Redis', 'Apache AGE', 'MinIO']" :key="t"
                      class="text-[11px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400">
                      {{ t }}
                    </span>
                  </div>
                </div>

                <div class="rounded-xl px-3 py-3 border-t border-slate-200 dark:border-slate-800 transition-all duration-200 hover:bg-amber-500/10 dark:hover:bg-amber-500/8 group/amber">
                  <p class="text-[10px] uppercase tracking-widest text-amber-500 font-semibold mb-2 transition-colors duration-200 group-hover/amber:text-amber-600 dark:group-hover/amber:text-amber-400">Platform</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="t in ['FastAPI', 'Gitea', 'Actions Runners', 'Prometheus', 'Grafana']" :key="t"
                      class="text-[11px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-amber-500/10 hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400">
                      {{ t }}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ── RECRUITER STRIP ───────────────────────────────────────────────── -->
    <section class="w-full bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
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

          <!-- Looking for -->
          <div>
            <p class="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold mb-3">Looking For</p>
            <ul class="space-y-2">
              <li v-for="role in ['Senior Full-Stack Engineer', 'Platform Engineer', 'AI Systems Engineer']" :key="role"
                class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <Icon name="mdi:check-circle" class="text-sky-400 text-base flex-shrink-0" />
                {{ role }}
              </li>
            </ul>
          </div>

          <!-- Preferred -->
          <div>
            <p class="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold mb-3">Preferred</p>
            <ul class="space-y-2">
              <li v-for="pref in ['Remote', 'U.S.-based', 'Individual contributor']" :key="pref"
                class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <Icon name="mdi:circle-small" class="text-slate-400 text-lg flex-shrink-0" />
                {{ pref }}
              </li>
            </ul>
          </div>

          <!-- Core strengths -->
          <div>
            <p class="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold mb-3">Core Strengths</p>
            <ul class="space-y-2">
              <li v-for="strength in ['End-to-end ownership', 'AI in production', 'Kubernetes & platform engineering', 'SaaS architecture']" :key="strength"
                class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <Icon name="mdi:circle-small" class="text-slate-400 text-lg flex-shrink-0" />
                {{ strength }}
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>

    <!-- ── WHAT I FOCUS ON ────────────────────────────────────────────────── -->
    <section class="bg-slate-50 dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">

        <div class="mb-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium">
            <Icon name="mdi:target" class="text-sm" />
            What I Focus On
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            End-to-end system thinking
          </h2>
          <p class="mt-2 text-slate-500 dark:text-slate-400 text-sm max-w-xl">
            I work across the full stack — from user interface to bare metal, from API design to AI pipelines.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="f in focuses"
            :key="f.title"
            class="rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 flex flex-col gap-3 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-200"
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
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white">{{ f.title }}</h3>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ f.desc }}</p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ── CURRENTLY BUILDING ─────────────────────────────────────────────── -->
    <section class="bg-white dark:bg-slate-900/30 py-12 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">

        <NuxtLink
          to="/projects/bible-verse"
          class="group block rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 p-6 sm:p-8 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-200"
        >
          <div class="flex flex-col sm:flex-row sm:items-start gap-6">

            <div class="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:hammer-wrench" class="text-purple-400 text-2xl" />
            </div>

            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span class="text-xs font-medium text-green-500 uppercase tracking-wider">Currently Building</span>
              </div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-sky-500 transition-colors">Bible Logic</h2>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                Production-grade multi-system SaaS platform combining AI Bible assistance, RAG-powered scripture search,
                real-time livestreaming via AWS IVS, WebRTC peer debate, and a fully modular content ecosystem.
                Built end-to-end as founder and sole engineer.
              </p>

              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="tag in ['Nuxt 3', 'Weaviate RAG', 'LLM', 'WebRTC', 'AWS IVS', 'PostgreSQL', 'Redis', 'MinIO']"
                  :key="tag"
                  class="text-[11px] px-2 py-0.5 rounded-md border bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/50"
                >{{ tag }}</span>
              </div>

              <div class="mt-5 flex items-center gap-1 text-xs font-medium text-sky-500 group-hover:gap-2 transition-all">
                View Project
                <Icon name="mdi:arrow-right" class="text-sm" />
              </div>
            </div>

          </div>
        </NuxtLink>

      </div>
    </section>

    <!-- ── SYSTEMS ────────────────────────────────────────────────────────── -->
    <section class="bg-slate-50 dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">

        <div class="flex items-center justify-between mb-8">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium">
              <Icon name="mdi:sitemap" class="text-sm" />
              System Architecture
            </div>
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Technical deep-dives</h2>
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
            class="group rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 flex flex-col gap-4 transition-all duration-200 hover:shadow-lg"
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

    <!-- ── RECENT PROJECTS ────────────────────────────────────────────────── -->
    <section v-if="recentProjects?.length" class="bg-white dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">

        <div class="flex items-center justify-between mb-8">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium">
              <Icon name="mdi:folder-multiple-outline" class="text-sm" />
              Portfolio
            </div>
            <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Recent Projects</h2>
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

    <!-- ── CONTACT CTA ────────────────────────────────────────────────────── -->
    <section id="contact" class="bg-white dark:bg-slate-950 py-16">
      <div class="max-w-7xl mx-auto px-6">

        <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 p-8 sm:p-12 text-center">

          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            Available for new projects
          </div>

          <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Let's build something together
          </h2>
          <p class="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            I'm open to full-time roles, contract work, and consulting on web applications, SaaS platforms, AI systems, and infrastructure projects.
          </p>

          <div class="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:donavanjones79@gmail.com"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-sky-500/20"
            >
              <Icon name="mdi:email-outline" class="text-base" />
              donavanjones79@gmail.com
            </a>
            <NuxtLink
              to="/resume"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-sky-500/40 hover:text-sky-500 font-medium text-sm transition-all duration-200"
            >
              <Icon name="mdi:file-account-outline" class="text-base" />
              View Resume
            </NuxtLink>
          </div>

        </div>
      </div>
    </section>

  </PatternSection>
</template>
