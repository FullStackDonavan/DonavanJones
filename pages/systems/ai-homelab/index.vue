<script setup lang="ts">
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'
useSeoMeta({
  title: 'AI Homelab Engineering — Donavan Jones',
  description: 'AI homelab engineering — a 7-node K3s cluster (4 Raspberry Pis + 3 Jetson Orin Nano Super 8GB) plus an RTX 3090 workstation, model scheduling under tight memory, MinIO storage, and real cost tradeoffs.',
  ogTitle: 'AI Homelab Engineering — Donavan Jones',
  ogDescription: 'Jetson Orin Nano Super + RTX 3090 homelab architecture, k3s orchestration, MinIO storage, and the real security and cost tradeoffs of running AI infrastructure at home.',
  ogType: 'website',
  ogImage: `${_SITE}/img/heroes/systems-ai-homelab.jpg`,
  ogUrl: `${_SITE}/systems/ai-homelab`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'AI Homelab Engineering — Donavan Jones',
  twitterDescription: 'A production-ready AI homelab — hybrid GPU tiers, k3s, MinIO, and real operational discipline.',
  canonical: `${_SITE}/systems/ai-homelab`,
})

// Curated entry points into this topic cluster (all URLs verified against published posts)
const startHere = [
  { to: '/blog/ai-homelab-engineering/01-my-homelab-architecture-for-agentic-ai', title: 'My homelab architecture for agentic AI', desc: 'The full layout: Pis, Jetsons, the 3090, and what runs where.' },
  { to: '/blog/ai-homelab-engineering/02-three-jetson-orin-nano-supers-as-ai-cluster', title: 'Three Jetson Orin Nano Supers as an AI cluster', desc: 'One role per 8GB board: LLM, speech, image generation.' },
  { to: '/blog/ai-homelab-engineering/03-rtx-3090-jetson-orin-hybrid-architecture', title: 'RTX 3090 + Jetson Orin hybrid architecture', desc: 'Splitting work between one big GPU and small edge boards.' },
  { to: '/blog/ai-homelab-engineering/09-running-multiple-local-models-without-melting-gpu', title: 'Running multiple local models without melting your GPU', desc: 'Model scheduling and swapping under tight memory.' },
  { to: '/blog/ai-homelab-engineering/04-kubernetes-for-ai-developers-k3s', title: 'Kubernetes for AI developers with k3s', desc: 'Deploying local models onto a lightweight cluster.' },
  { to: '/blog/ai-homelab-engineering/15-biggest-mistakes-building-ai-homelab', title: 'The biggest mistakes building my AI homelab', desc: 'What went wrong and what I would do differently.' },
  { to: '/blog/ai-homelab-engineering/16-complete-guide-production-ready-local-ai-platform', title: 'Building a production-ready local AI platform', desc: 'The complete guide, end to end.' },
  { to: '/blog/ai-cost-optimization/07-local-ai-stack-vs-year-of-claude-max', title: 'A local AI stack vs a year of Claude Max', desc: 'Hardware cost compared with a hosted subscription.' },
  { to: '/blog/ai-cost-optimization/05-when-to-buy-a-gpu-instead-of-api-fees', title: 'When to buy a GPU instead of paying API fees', desc: 'A break-even framework for local hardware.' },
  { to: '/blog/ai-cost-optimization/03-electricity-vs-api-pricing', title: 'Electricity vs API pricing', desc: 'How to estimate running costs for always-on AI hardware.' },
]

const relatedLinks = [
  { to: '/categories/ai-cost-optimization', label: 'All AI cost optimization articles' },
  { to: '/systems/infrastructure', label: 'Infrastructure Engineering' },
  { to: '/systems/local-vibe-coding', label: 'Local Vibe Coding' },
  { to: '/systems/ai', label: 'AI Systems Engineering' },
  { to: '/systems/agentic-ai', label: 'Agentic AI Systems' },
  { to: '/jetson-leaderboard', label: 'Jetson Orin Nano LLM leaderboard' },
  { to: '/projects/kingdom-tools', label: 'Kingdom Tools platform' },
  { to: '/projects/versehub', label: 'VerseHub case study' },
  { to: '/services/local-ai-infrastructure', label: 'Local AI infrastructure consulting & research' },
]

const principles = [
  { icon: 'mdi:layers-triple',   color: 'amber',   text: 'Match hardware tier to workload — always-on low-power vs. bursty high-throughput' },
  { icon: 'mdi:kubernetes',      color: 'sky',      text: 'Orchestrate with Kubernetes once there is more than one node worth scheduling across' },
  { icon: 'mdi:shield-lock',     color: 'emerald',  text: 'No direct internet exposure — external access always routes through a VPN' },
  { icon: 'mdi:cash',            color: 'purple',   text: 'Treat electricity and hardware amortization as real, calculable costs, not hand-waving' },
]

const areas = [
  {
    icon: 'mdi:expansion-card', color: 'purple',
    title: 'Compute', image: '/img/cards/homelab-compute.jpg',
    desc: 'Three Jetson Orin Nano Super 8GB boards (LLM, speech, image generation) plus one RTX 3090 24GB workstation for embeddings, LoRA training, and Ornith-1.0-35B.',
    tags: ['RTX 3090', 'Jetson Orin', 'CUDA'],
  },
  {
    icon: 'mdi:kubernetes', color: 'sky',
    title: 'Orchestration', image: '/img/cards/homelab-orchestration.jpg',
    desc: 'k3s across 7 ARM64 nodes (4 Raspberry Pis + 3 Jetsons), with node labels and selectors pinning each AI role to its board.',
    tags: ['k3s', 'Node Labels', 'ARM64'],
  },
  {
    icon: 'mdi:database', color: 'amber',
    title: 'Storage', image: '/img/cards/homelab-storage.jpg',
    desc: 'MinIO object storage for models, training datasets, and artifacts, alongside PostgreSQL, Redis, and Weaviate in-cluster.',
    tags: ['MinIO', 'S3-Compatible', 'Datasets'],
  },
  {
    icon: 'mdi:shield-check', color: 'emerald',
    title: 'Security', image: '/img/cards/homelab-security.jpg',
    desc: 'Keep cluster services off the public internet, segment the network, and gate remote access.',
    tags: ['Segmentation', 'Private Access', 'Patching'],
  },
]

const failures = [
  { icon: 'mdi:ip-network',      color: 'rose',   text: 'DHCP-assigned node IPs silently changing and breaking cluster registration' },
  { icon: 'mdi:content-save-off',color: 'amber',  text: 'Model-serving pods with no persistent volume, re-downloading on every restart' },
  { icon: 'mdi:thermometer-alert', color: 'purple', text: 'Insufficient cooling silently throttling performance under sustained load' },
  { icon: 'mdi:shield-alert',    color: 'sky',    text: 'An agent with unrestricted shell access and no confirmation gate' },
]

const clusterMetrics = [
  { value: '7',      label: 'K3s nodes (4 Raspberry Pis + 3 Jetsons)' },
  { value: '8GB',    label: 'Unified memory per Jetson (~7.4 GiB usable)' },
  { value: '~21',    label: 'tok/s llama3.2:3b on a Jetson, 100% on GPU' },
  { value: '24GB',   label: 'VRAM on the single RTX 3090 workstation' },
]

const stack = [
  'k3s', 'RTX 3090', 'NVIDIA Jetson Orin Nano Super', 'Raspberry Pi', 'MinIO',
  'Redis', 'PostgreSQL', 'Ollama', 'Prometheus', 'Grafana', 'Loki', 'CUDA',
]

const faqs = [
  {
    question: 'What hardware do you need for a real AI homelab?',
    answer: 'One capable GPU (24GB-class) for the heaviest inference work, plus low-power always-on nodes for background tasks, tied together with k3s so workloads get scheduled deliberately rather than everything running on whatever machine happens to be on.'
  },
  {
    question: 'Is Kubernetes overkill for a homelab?',
    answer: 'For a single machine, yes. Past one node, it starts solving real problems — automatic restart, consistent deployment across different hardware architectures, and resource-aware scheduling.'
  },
  {
    question: 'How much does it cost to run this 24/7?',
    answer: 'Electricity is the dominant ongoing cost and scales with utilization, not just rated hardware wattage. The full worked calculation is in the AI Homelab Engineering article series.'
  },
  {
    question: 'Is it safe to run AI infrastructure at home?',
    answer: 'With deliberate network segmentation, no direct internet exposure, and normal patching discipline, yes — treating it like a small production deployment rather than a hobby project is the operative mindset.'
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
    <AiHomelabHero />
    <Breadcrumbs parentTitle="Systems" parentUrl="/system-overview" currentPageTitle="AI Homelab" />

    <div class="mx-auto max-w-7xl px-6 py-14">

      <div class="mb-12">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4
                 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm"
        >
          <Icon name="mdi:server-network" class="text-sm" />
          AI Homelab Engineering
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
          A Production-Ready AI Homelab
        </h1>
        <p class="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Hybrid GPU tiers, Kubernetes orchestration, distributed storage, and real security
          and cost discipline — infrastructure built to be depended on daily, not a weekend project.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-5 mb-10">

        <div class="rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Icon name="mdi:compass" class="text-amber-400 text-lg" />
            </div>
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Core Principles</h2>
          </div>
          <ul class="space-y-3">
            <li v-for="p in principles" :key="p.text" class="flex items-start gap-3">
              <div
                class="mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 border"
                :class="{
                  'bg-amber-500/10 border-amber-500/20':   p.color === 'amber',
                  'bg-sky-500/10 border-sky-500/20':       p.color === 'sky',
                  'bg-emerald-500/10 border-emerald-500/20': p.color === 'emerald',
                  'bg-purple-500/10 border-purple-500/20': p.color === 'purple',
                }"
              >
                <Icon :name="p.icon" class="text-xs"
                  :class="{
                    'text-amber-400':  p.color === 'amber',
                    'text-sky-400':    p.color === 'sky',
                    'text-emerald-400':p.color === 'emerald',
                    'text-purple-400': p.color === 'purple',
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
        <HeroBackdrop lazy src="/img/sections/homelab-areas.jpg" side="full" />
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-5">System Architecture Areas</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="area in areas"
            :key="area.title"
            class="group overflow-hidden rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60 flex flex-col gap-3
                   hover:border-amber-500/40 transition-all duration-200"
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
                      'bg-amber-500/10 border-amber-500/20':   area.color === 'amber',
                      'bg-emerald-500/10 border-emerald-500/20': area.color === 'emerald',
                    }"
                  >
                    <Icon :name="area.icon" class="text-xl"
                      :class="{
                        'text-purple-400': area.color === 'purple',
                        'text-sky-400':    area.color === 'sky',
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
        <HeroBackdrop lazy src="/img/sections/homelab-metrics.jpg" side="full" />
        <div class="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <Icon name="mdi:chip" class="text-green-400 text-lg" />
            </div>
            <div>
              <h2 class="text-base font-semibold text-slate-900 dark:text-white">Running in Production</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">The hybrid cluster backing this site's local AI and coding-agent workloads</p>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              v-for="m in clusterMetrics"
              :key="m.label"
              class="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-4 text-center"
            >
              <div class="text-2xl font-bold text-slate-900 dark:text-white">{{ m.value }}</div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-1">{{ m.label }}</div>
            </div>
          </div>
          <p class="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Seven nodes under one k3s control plane: four Raspberry Pis plus three Jetson Orin Nano Supers, each Jetson
            owning one role because only one ~4-5 GB model fits per board. Jetson's CUDA allocator cannot reclaim page cache,
            so models are swapped deliberately (stop, drop caches, load). An RTX 3090 workstation sits beside the cluster —
            the same infrastructure this site's Local Vibe Coding and Agentic AI systems run on.
          </p>
        </div>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-5">System Architecture Diagram</h2>
        <AiHomelabDiagram />
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
        <JetsonLeaderboardCard metric="all" />
      </section>

      <section class="relative isolate overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 mb-10">
        <HeroBackdrop lazy src="/img/sections/homelab-start.jpg" side="full" />
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">Start Here: Key AI Homelab & Cost Articles</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-3xl leading-relaxed">How the Jetson + RTX 3090 homelab is put together, how models share tight memory, and what local AI really costs compared with APIs.</p>
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
          to="/categories/ai-homelab-engineering"
          class="relative isolate overflow-hidden flex items-center justify-between gap-6 rounded-2xl p-6
                 border border-amber-500/20 bg-amber-500/5
                 hover:border-amber-500/40 hover:bg-amber-500/10
                 transition-all duration-200 group"
        >
          <HeroBackdrop lazy src="/img/categories/ai-homelab-engineering.jpg" />
          <div>
            <p class="text-xs font-medium text-amber-500 uppercase tracking-wider mb-1">Knowledge Base</p>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-400 transition-colors">
              Explore the AI Homelab Engineering Articles
            </h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              16 articles covering cluster architecture, Kubernetes, storage, networking, security, cost, and the mistakes made building it.
            </p>
          </div>
          <Icon name="mdi:arrow-right" class="flex-shrink-0 text-2xl text-amber-500 group-hover:translate-x-1 transition-transform duration-200" />
        </NuxtLink>
      </section>

    </div>
  </PatternSection>
</template>
