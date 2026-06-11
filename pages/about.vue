<script setup lang="ts">
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'

useSeoMeta({
  title: 'About Me — Donavan Jones',
  description: 'Donavan Jones is a full-stack engineer and systems architect. Learn about his work building production AI, SaaS platforms, and Kubernetes infrastructure.',
  ogTitle: 'About Me — Donavan Jones',
  ogDescription: 'Full-stack engineer and systems architect building production AI, SaaS platforms, and Kubernetes infrastructure. Learn the story behind the work.',
  ogType: 'profile',
  ogImage: `${_SITE}/img/logo.png`,
  ogUrl: `${_SITE}/about`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'About Me — Donavan Jones',
  twitterDescription: 'Full-stack engineer and systems architect — AI systems, SaaS platforms, and Kubernetes infrastructure.',
  canonical: `${_SITE}/about`,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        '@id': `${_SITE}/about`,
        url: `${_SITE}/about`,
        name: 'About Donavan Jones',
        mainEntity: {
          '@type': 'Person',
          '@id': `${_SITE}/#person`,
          name: 'Donavan Jones',
          url: _SITE,
          jobTitle: 'Full-Stack Engineer & Systems Architect',
          description: 'Full-stack engineer specializing in production AI systems, SaaS platforms, backend architecture, and Kubernetes infrastructure.',
          worksFor: { '@id': `${_SITE}/#organization` },
          knowsAbout: [
            'Nuxt 3', 'Vue 3', 'TypeScript', 'Node.js', 'FastAPI',
            'RAG Pipelines', 'LLM Integration', 'Kubernetes', 'PostgreSQL',
            'Redis', 'BullMQ', 'Weaviate', 'Docker', 'Infrastructure',
          ],
          sameAs: [
            'https://github.com/FullStackDonavan',
            'https://linkedin.com/in/donavanjones',
            'https://twitter.com/jack_fullstack',
          ],
        },
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${_SITE}/#organization`,
        name: 'Donavan Jones',
        url: _SITE,
        logo: {
          '@type': 'ImageObject',
          '@id': `${_SITE}/#logo`,
          url: `${_SITE}/img/logo.png`,
          contentUrl: `${_SITE}/img/logo.png`,
          caption: 'Donavan Jones',
        },
        description: 'Full-stack engineering practice specializing in production AI systems, SaaS platforms, backend architecture, and self-hosted Kubernetes infrastructure.',
        founder: { '@id': `${_SITE}/#person` },
        foundingDate: '2020',
        knowsAbout: [
          'AI Systems Engineering', 'Full-Stack Development', 'Backend Architecture',
          'Kubernetes Infrastructure', 'RAG Pipelines', 'SaaS Platforms',
        ],
        sameAs: [
          'https://github.com/FullStackDonavan',
          'https://linkedin.com/in/donavanjones',
          'https://twitter.com/jack_fullstack',
        ],
      }),
    },
  ],
})

const focuses = [
  {
    icon: 'mdi:brain',
    color: 'purple',
    title: 'AI Systems',
    desc: 'RAG pipelines, LLM orchestration, agent frameworks, hybrid model routing, and production inference infrastructure.',
    tags: ['Weaviate', 'Llama 3.2', 'OpenAI', 'RAG', 'Agents'],
    link: '/systems/ai',
  },
  {
    icon: 'mdi:server',
    color: 'sky',
    title: 'Backend Engineering',
    desc: 'Scalable APIs, async job queues, domain-driven service layers, and typed data pipelines in Node.js and FastAPI.',
    tags: ['Nuxt 3', 'BullMQ', 'Prisma', 'PostgreSQL', 'Redis'],
    link: '/systems/backend',
  },
  {
    icon: 'mdi:cloud-braces',
    color: 'emerald',
    title: 'Infrastructure',
    desc: 'Self-hosted Kubernetes on ARM64, CI/CD with GitHub Actions, MinIO object storage, and secure Cloudflare routing.',
    tags: ['Kubernetes', 'Docker', 'GitHub Actions', 'MinIO'],
    link: '/systems/infrastructure',
  },
  {
    icon: 'mdi:view-dashboard',
    color: 'amber',
    title: 'Full-Stack SaaS',
    desc: 'End-to-end product development — from data model and auth to UI, real-time features, and payments.',
    tags: ['Vue 3', 'Nuxt 3', 'Stripe', 'WebSockets', 'Auth'],
    link: '/projects/overview',
  },
]

const techStack = {
  'Frontend': ['Vue 3', 'Nuxt 3', 'TypeScript', 'Tailwind CSS', 'Pinia'],
  'Backend': ['Node.js', 'Nitro', 'FastAPI', 'Zod', 'BullMQ'],
  'Data': ['PostgreSQL', 'Prisma', 'Redis', 'Weaviate', 'MinIO'],
  'AI': ['Llama 3.2', 'OpenAI API', 'Whisper', 'ElevenLabs', 'Stable Diffusion'],
  'Infrastructure': ['Kubernetes', 'Docker', 'GitHub Actions', 'Cloudflare', 'ARM64'],
}

const milestones = [
  {
    year: '2024–Now',
    title: 'Building Bible Verse AI',
    desc: 'Full-stack AI platform indexing 37K+ Bible verses across 5 bounded domains with RAG retrieval, 5 AI models, and BullMQ job queues.',
    color: 'purple',
  },
  {
    year: '2023–Now',
    title: 'Self-Hosted Kubernetes Cluster',
    desc: 'Designed and deployed a private ARM64 Kubernetes cluster running production AI workloads, CI/CD pipelines, and object storage.',
    color: 'emerald',
  },
  {
    year: '2022–Now',
    title: 'Full-Stack Content Platform',
    desc: 'Built this site from scratch — video tutorials, blog, pro membership, AI search, and real-time features on a Nuxt 3 stack.',
    color: 'sky',
  },
  {
    year: '2020+',
    title: 'Production SaaS & AI Integration',
    desc: 'Shipped multiple client projects integrating LLMs, WebRTC video, Stripe billing, and complex auth flows into production systems.',
    color: 'amber',
  },
]

const socials = [
  { label: 'GitHub',   href: 'https://github.com/FullStackDonavan',        icon: 'mdi:github' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/donavanjones',       icon: 'mdi:linkedin' },
]

const { data: projects } = await useFetch('/api/projects-list', { key: 'about-projects-list' })
</script>

<template>
  <PatternSection>
    <div class="mx-auto max-w-7xl px-6 py-14">

      <!-- HERO -->
      <div class="mb-16 grid lg:grid-cols-5 gap-10 items-start">
        <div class="lg:col-span-3">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5
                      bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium">
            <Icon name="mdi:account-circle" class="text-sm" />
            About Me
          </div>

          <div class="flex items-center gap-5 mb-4">
            <img
              src="/images/donavan.jpg"
              alt="Donavan Jones"
              class="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 flex-shrink-0"
            />
            <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Donavan Jones
            </h1>
          </div>
          <p class="mt-2 text-lg font-medium text-sky-500 dark:text-sky-400">
            Full-Stack Engineer &amp; Systems Architect
          </p>

          <p class="mt-5 text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            I build production systems at the intersection of AI, backend engineering, and infrastructure.
            My work spans RAG pipelines, async job queues, self-hosted Kubernetes clusters, and full-stack
            SaaS platforms — always with a focus on correctness, observability, and production-readiness.
          </p>
          <p class="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Currently deep in building
            <NuxtLink to="/projects/bible-verse" class="text-purple-400 hover:text-purple-300 font-medium transition-colors">Bible Verse AI</NuxtLink>
            — a multi-domain platform that indexes 37,000+ Bible verses with semantic search, five AI models,
            and a fully async processing pipeline.
          </p>

          <!-- Socials + Resume -->
          <div class="mt-6 flex flex-wrap gap-3">
            <a
              v-for="s in socials"
              :key="s.label"
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                     border border-slate-200 dark:border-slate-700/60
                     bg-white dark:bg-slate-900/60
                     text-slate-600 dark:text-slate-300
                     hover:border-sky-500/40 hover:text-sky-400
                     transition-all duration-200"
            >
              <Icon :name="s.icon" class="text-base" />
              {{ s.label }}
            </a>
            <NuxtLink
              to="/resume"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                     border border-slate-200 dark:border-slate-700/60
                     bg-white dark:bg-slate-900/60
                     text-slate-600 dark:text-slate-300
                     hover:border-sky-500/40 hover:text-sky-400
                     transition-all duration-200"
            >
              <Icon name="mdi:file-account-outline" class="text-base" />
              Resume
            </NuxtLink>
          </div>
        </div>

        <!-- Stats card -->
        <div class="lg:col-span-2">
          <div class="grid grid-cols-2 gap-4">

            <!-- CARD: Verses -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5 group/verses">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">verses.indexed</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-purple-500 font-semibold mb-2 transition-colors duration-200 group-hover/verses:text-purple-600 dark:group-hover/verses:text-purple-400">Bible Logic</p>
                <div class="text-3xl font-bold text-slate-900 dark:text-white leading-none mb-1">37K+</div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Verses Indexed</div>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['RAG', 'Weaviate', 'Search']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-purple-500/10 hover:border-purple-500/40 hover:text-purple-600 dark:hover:text-purple-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

            <!-- CARD: AI Models -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5 group/models">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">ai.models</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-sky-500 font-semibold mb-2 transition-colors duration-200 group-hover/models:text-sky-600 dark:group-hover/models:text-sky-400">AI Models</p>
                <div class="text-3xl font-bold text-slate-900 dark:text-white leading-none mb-1">5</div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">In Production</div>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['Llama', 'OpenAI', 'Whisper']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-sky-500/10 hover:border-sky-500/40 hover:text-sky-600 dark:hover:text-sky-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

            <!-- CARD: Kubernetes -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 group/k8s">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">cluster.config</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold mb-2 transition-colors duration-200 group-hover/k8s:text-emerald-600 dark:group-hover/k8s:text-emerald-400">Cluster</p>
                <div class="text-3xl font-bold text-slate-900 dark:text-white leading-none mb-1">K8s</div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Self-Hosted</div>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['k3s', 'ARM64', 'Pi 5']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

            <!-- CARD: Experience -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 group/exp">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">experience.years</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-amber-500 font-semibold mb-2 transition-colors duration-200 group-hover/exp:text-amber-600 dark:group-hover/exp:text-amber-400">Experience</p>
                <div class="text-3xl font-bold text-slate-900 dark:text-white leading-none mb-1">20+</div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Years Building</div>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['Full-Stack', 'SaaS', 'Remote']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-amber-500/10 hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- WHAT I BUILD -->
      <section class="mb-14">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">What I Build</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Systems designed to run in production, not just demos.
        </p>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NuxtLink
            v-for="f in focuses"
            :key="f.title"
            :to="f.link"
            class="group flex flex-col rounded-2xl p-5 border
                   border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60
                   hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5
                   transition-all duration-200"
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center border mb-4"
              :class="{
                'bg-purple-500/10 border-purple-500/20': f.color === 'purple',
                'bg-sky-500/10 border-sky-500/20':       f.color === 'sky',
                'bg-emerald-500/10 border-emerald-500/20': f.color === 'emerald',
                'bg-amber-500/10 border-amber-500/20':   f.color === 'amber',
              }"
            >
              <Icon :name="f.icon" class="text-xl"
                :class="{
                  'text-purple-400': f.color === 'purple',
                  'text-sky-400':    f.color === 'sky',
                  'text-emerald-400':f.color === 'emerald',
                  'text-amber-400':  f.color === 'amber',
                }"
              />
            </div>
            <h3 class="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors">
              {{ f.title }}
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed flex-1">
              {{ f.desc }}
            </p>
            <div class="flex flex-wrap gap-1 mt-4">
              <span
                v-for="tag in f.tags" :key="tag"
                class="text-[11px] px-2 py-0.5 rounded-md border
                       bg-slate-100 dark:bg-slate-800
                       text-slate-500 dark:text-slate-400
                       border-slate-200 dark:border-slate-700/50"
              >{{ tag }}</span>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- TECH STACK -->
      <section class="mb-14">
        <div class="rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50
                    bg-white dark:bg-slate-900/60">
          <h2 class="text-base font-semibold text-slate-900 dark:text-white mb-5">Technology Stack</h2>
          <div class="space-y-4">
            <div v-for="(tags, category) in techStack" :key="category" class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-medium text-slate-500 dark:text-slate-500 w-24 flex-shrink-0">
                {{ category }}
              </span>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="tag in tags" :key="tag"
                  class="px-2.5 py-1 rounded-lg text-xs border
                         bg-slate-100 dark:bg-slate-800
                         text-slate-600 dark:text-slate-300
                         border-slate-200 dark:border-slate-700/50"
                >{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- TIMELINE -->
      <section class="mb-14">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Notable Work</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">
          Projects and systems that defined my engineering approach.
        </p>
        <div class="relative space-y-0">
          <div
            v-for="(m, i) in milestones"
            :key="i"
            class="relative flex gap-6 pb-8 last:pb-0"
          >
            <!-- Timeline line -->
            <div class="flex flex-col items-center flex-shrink-0">
              <div
                class="w-3 h-3 rounded-full border-2 mt-1"
                :class="{
                  'bg-purple-500 border-purple-400': m.color === 'purple',
                  'bg-sky-500 border-sky-400':       m.color === 'sky',
                  'bg-emerald-500 border-emerald-400':m.color === 'emerald',
                  'bg-amber-500 border-amber-400':   m.color === 'amber',
                }"
              />
              <div v-if="i < milestones.length - 1"
                   class="w-px flex-1 mt-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <!-- Content -->
            <div class="flex-1 pb-2">
              <span class="text-xs font-medium text-slate-400 dark:text-slate-500">{{ m.year }}</span>
              <h3 class="text-base font-semibold text-slate-900 dark:text-white mt-0.5">{{ m.title }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{{ m.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- PROJECTS I BUILT -->
      <section v-if="projects?.length" class="mb-14">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Projects I Built</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Production systems shipped from concept to deployment.
        </p>
        <div class="grid sm:grid-cols-2 gap-5">
          <NuxtLink
            v-for="p in projects"
            :key="p.slug"
            :to="`/projects/${p.slug}`"
            class="group flex flex-col rounded-2xl border overflow-hidden
                   border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60
                   hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5
                   transition-all duration-200"
          >
            <!-- Image -->
            <div v-if="p.excerptImage" class="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                :src="p.excerptImage"
                :alt="p.title"
                class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
              />
            </div>
            <div v-else class="h-44 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
              <Icon name="mdi:code-braces" class="text-5xl text-slate-300 dark:text-slate-600" />
            </div>

            <!-- Body -->
            <div class="flex flex-col flex-1 p-5">
              <!-- Highlight badge -->
              <div v-if="p.highlight" class="mb-3">
                <span class="text-[11px] px-2 py-0.5 rounded-md font-medium
                             bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  {{ p.highlight }}
                </span>
              </div>

              <h3 class="text-base font-semibold text-slate-900 dark:text-white
                         group-hover:text-sky-400 transition-colors mb-2">
                {{ p.title }}
              </h3>
              <p v-if="p.description" class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1 line-clamp-3">
                {{ p.description }}
              </p>

              <!-- Footer -->
              <div class="mt-4 flex items-center justify-between">
                <div class="flex gap-2">
                  <a
                    v-if="p.github"
                    :href="p.github"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border
                           border-slate-200 dark:border-slate-700/50
                           text-slate-500 dark:text-slate-400
                           hover:text-sky-400 hover:border-sky-500/40
                           transition-colors"
                    @click.stop
                  >
                    <Icon name="mdi:github" class="text-sm" /> GitHub
                  </a>
                  <a
                    v-if="p.liveSite"
                    :href="p.liveSite"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border
                           border-slate-200 dark:border-slate-700/50
                           text-slate-500 dark:text-slate-400
                           hover:text-emerald-400 hover:border-emerald-500/40
                           transition-colors"
                    @click.stop
                  >
                    <Icon name="mdi:open-in-new" class="text-sm" /> Live Site
                  </a>
                </div>
                <span class="inline-flex items-center gap-1 text-xs font-medium text-sky-500
                             group-hover:translate-x-1 transition-transform duration-200">
                  View project <Icon name="mdi:arrow-right" class="text-sm" />
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- CTA -->
      <section>
        <div class="rounded-2xl p-8 border border-sky-500/20 bg-sky-500/5 text-center">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Want to see the work in depth?
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-lg mx-auto">
            Explore the projects, read the articles, or follow along with what I'm currently building.
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            <NuxtLink
              to="/projects/overview"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                     bg-sky-500 hover:bg-sky-400 text-white transition-colors duration-200"
            >
              <Icon name="mdi:folder-multiple-outline" class="text-base" />
              View Projects
            </NuxtLink>
            <NuxtLink
              to="/blog/overview"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                     border border-slate-200 dark:border-slate-700/60
                     bg-white dark:bg-slate-900/60
                     text-slate-600 dark:text-slate-300
                     hover:border-sky-500/40 hover:text-sky-400
                     transition-all duration-200"
            >
              <Icon name="mdi:text-box-multiple-outline" class="text-base" />
              Read the Blog
            </NuxtLink>
          </div>
        </div>
      </section>

    </div>
  </PatternSection>
</template>
