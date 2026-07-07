<script setup lang="ts">
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'
useSeoMeta({
  title: 'AI Homelab Engineering — Donavan Jones',
  description: 'A production-ready AI homelab — a hybrid Jetson Orin / RTX 3090 cluster orchestrated with k3s, distributed MinIO storage, segmented networking, and real operational discipline.',
  ogTitle: 'AI Homelab Engineering — Donavan Jones',
  ogDescription: 'Hybrid GPU cluster architecture, k3s orchestration, MinIO storage, and the real security and cost tradeoffs of running AI infrastructure at home.',
  ogType: 'website',
  ogImage: `${_SITE}/img/logo.png`,
  ogUrl: `${_SITE}/systems/ai-homelab`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'AI Homelab Engineering — Donavan Jones',
  twitterDescription: 'A production-ready AI homelab — hybrid GPU tiers, k3s, MinIO, and real operational discipline.',
  canonical: `${_SITE}/systems/ai-homelab`,
})

const principles = [
  { icon: 'mdi:layers-triple',   color: 'amber',   text: 'Match hardware tier to workload — always-on low-power vs. bursty high-throughput' },
  { icon: 'mdi:kubernetes',      color: 'sky',      text: 'Orchestrate with Kubernetes once there is more than one node worth scheduling across' },
  { icon: 'mdi:shield-lock',     color: 'emerald',  text: 'No direct internet exposure — external access always routes through a VPN' },
  { icon: 'mdi:cash',            color: 'purple',   text: 'Treat electricity and hardware amortization as real, calculable costs, not hand-waving' },
]

const areas = [
  {
    icon: 'mdi:expansion-card', color: 'purple',
    title: 'Compute',
    desc: 'A hybrid RTX 3090 / Jetson Orin Nano Super tier, scheduled by workload profile.',
    tags: ['RTX 3090', 'Jetson Orin', 'CUDA'],
  },
  {
    icon: 'mdi:kubernetes', color: 'sky',
    title: 'Orchestration',
    desc: 'k3s across ARM64 and x86 nodes, with node affinity and priority-based scheduling.',
    tags: ['k3s', 'Affinity', 'Priority Classes'],
  },
  {
    icon: 'mdi:database', color: 'amber',
    title: 'Storage',
    desc: 'MinIO in distributed, erasure-coded mode for models, embeddings, and artifacts.',
    tags: ['MinIO', 'S3-Compatible', 'Erasure Coding'],
  },
  {
    icon: 'mdi:shield-check', color: 'emerald',
    title: 'Security',
    desc: 'Segmented VLANs, no public exposure, and WireGuard-gated remote access.',
    tags: ['VLANs', 'WireGuard', 'Patching'],
  },
]

const failures = [
  { icon: 'mdi:ip-network',      color: 'rose',   text: 'DHCP-assigned node IPs silently changing and breaking cluster registration' },
  { icon: 'mdi:content-save-off',color: 'amber',  text: 'Model-serving pods with no persistent volume, re-downloading on every restart' },
  { icon: 'mdi:thermometer-alert', color: 'purple', text: 'Insufficient cooling silently throttling performance under sustained load' },
  { icon: 'mdi:shield-alert',    color: 'sky',    text: 'An agent with unrestricted shell access and no confirmation gate' },
]

const clusterMetrics = [
  { value: '4',      label: 'Inference-capable nodes' },
  { value: '24GB',   label: 'VRAM on the heaviest tier' },
  { value: '~$19',   label: 'Illustrative monthly electricity (see cost breakdown)' },
  { value: '100Gi',  label: 'Distributed MinIO storage per node' },
]

const stack = [
  'k3s', 'RTX 3090', 'NVIDIA Jetson Orin Nano Super', 'Raspberry Pi', 'MinIO',
  'Redis', 'PostgreSQL', 'WireGuard', 'Prometheus', 'CUDA',
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

      <section class="mb-10">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-5">System Architecture Areas</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="area in areas"
            :key="area.title"
            class="rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60 flex flex-col gap-3
                   hover:border-amber-500/40 transition-all duration-200"
          >
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

      <section class="mb-10">
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
            Four inference-capable nodes under one k3s control plane, backed by distributed
            MinIO storage and segmented, VPN-gated networking — the same infrastructure
            this site's Local Vibe Coding and Agentic AI systems run on.
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

      <section class="mb-10">
        <NuxtLink
          to="/categories/ai-homelab-engineering"
          class="flex items-center justify-between gap-6 rounded-2xl p-6
                 border border-amber-500/20 bg-amber-500/5
                 hover:border-amber-500/40 hover:bg-amber-500/10
                 transition-all duration-200 group"
        >
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
