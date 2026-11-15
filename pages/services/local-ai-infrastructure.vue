<script setup lang="ts">
import { ctaImage } from '~/utils/ctaImage'
const config = useRuntimeConfig()
const SITE = (config.public.appDomain as string) || 'https://donavanjones.com'
const PAGE = `${SITE}/services/local-ai-infrastructure`

const title = 'Local AI Infrastructure & Agent Systems Engineer'
const description =
  'I operate a 7-node local AI cluster (Jetson Orin Nano Super, Raspberry Pi, RTX 3090) running RAG, voice and agent workloads. Available for AI hardware and agent-runtime teams: research interviews, advisory, contract work.'

useSeoMeta({
  title,
  description,
  ogTitle: `${title} | Donavan Jones`,
  ogDescription: description,
  ogType: 'website',
  ogImage: `${SITE}/img/heroes/services-local-ai-infrastructure.jpg`,
  ogUrl: PAGE,
  twitterCard: 'summary_large_image',
  twitterTitle: `${title} | Donavan Jones`,
  twitterDescription: description,
  canonical: PAGE,
})

const operate = [
  { value: '7', label: 'K3s nodes', detail: '4 Raspberry Pis (control plane + workers) and 3 Jetson Orin Nano Super 8GB GPU workers' },
  { value: '8 GB', label: 'unified memory per Jetson', detail: 'One large model or service per board, so every load is a scheduling decision' },
  { value: '24 GB', label: 'RTX 3090 workstation', detail: 'Runs Ornith-1.0-35B (MoE, Q4_K_M) at about 64 tok/s, plus embeddings and LoRA training' },
  { value: '20.8', label: 'tok/s on a Jetson', detail: 'llama3.2:3b pinned in memory as the always-on draft model, with a 5.1 s cold load' },
]

const lessons = [
  {
    icon: 'mdi:memory',
    title: 'Memory, not compute, is the limit',
    body: 'On unified-memory Jetsons, CUDA allocations cannot reclaim page cache. Models crash with out-of-memory even when free -h says memory is available. Swapping models means stopping the old one, dropping caches, then loading. My own tooling does this per device.',
    link: { to: '/blog/ai-homelab-engineering/09-running-multiple-local-models-without-melting-gpu', text: 'Running multiple local models' },
  },
  {
    icon: 'mdi:check-decagram-outline',
    title: 'Agents claim success they did not earn',
    body: 'In VerseHub a retrieval failure returned an empty list, and the model produced confident answers with no evidence behind them. Now a failure raises an error, and every cited reference is checked against the evidence that was actually retrieved.',
    link: { to: '/blog/agentic-ai-systems/11-verification-agents-in-production', text: 'Verification agents in production' },
  },
  {
    icon: 'mdi:timer-sand',
    title: 'Long-running work needs durable orchestration',
    body: 'Answer refinement runs as a Temporal workflow: retrieve, score, generate, verify. Default timeouts, three workflows per question, and replayed streams caused real failures. I traced each one and fixed it.',
    link: { to: '/blog/versehub-engineering/07-temporal-workflows-in-production', text: 'Temporal workflows in production' },
  },
  {
    icon: 'mdi:chart-timeline-variant',
    title: 'You cannot trust what you cannot see',
    body: 'Prometheus, Grafana, Loki and Promtail cover the cluster. Jetson GPU load had no exporter, so I wrote a small agent that exposes it as metrics. Per-device model benchmarks record load time, tok/s and GPU %.',
    link: { to: '/blog/infrastructureengineering/41-prometheus-on-pi-cluster', text: 'Observability on a Pi K3s cluster' },
  },
  {
    icon: 'mdi:swap-horizontal',
    title: 'Local first, cloud when it earns it',
    body: 'Small models on the Jetsons handle the fast, always-on path. The 3090 takes the heavy reasoning, and cloud models fill the gaps. Cost, latency and privacy trade-offs are measured, not assumed.',
    link: { to: '/blog/local-vibe-coding/10-local-ai-vs-claude-code-30-days', text: 'Local AI vs Claude Code' },
  },
  {
    icon: 'mdi:tools',
    title: 'The control plane matters as much as the models',
    body: 'Kingdom Tools is my internal platform. It provisions Postgres, MinIO, Redis and Weaviate per service, detects drift, loads, unloads and benchmarks models on each device, and runs LoRA training jobs.',
    link: { to: '/projects/kingdom-tools', text: 'Kingdom Tools' },
  },
]

const engagements = [
  {
    icon: 'mdi:account-voice',
    title: 'User research & expert interviews', image: '/img/cards/engage-user-research.jpg',
    body: 'Product teams building local AI hardware, agent operating systems, or inference runtimes: I can share how a real heterogeneous setup is used day to day, what breaks, and what I would pay for.',
  },
  {
    icon: 'mdi:handshake-outline',
    title: 'Design partner & early hardware tester', image: '/img/cards/engage-design-partner.jpg',
    body: 'I can run pre-release hardware or software against real workloads: RAG, voice (TTS/STT), image generation, coding agents, and multi-step agent workflows. Feedback is written up with measurements.',
  },
  {
    icon: 'mdi:lightbulb-on-outline',
    title: 'Technical advisory', image: '/img/cards/engage-technical-advisory.jpg',
    body: 'Model scheduling under tight memory, multi-model serving behind OpenAI-compatible APIs, agent verification and approval points, observability for inference, ARM64 deployment pipelines.',
  },
  {
    icon: 'mdi:code-braces',
    title: 'Contract engineering', image: '/img/cards/engage-contract-engineering.jpg',
    body: 'Full-stack and platform work: Nuxt/Vue, Node.js, Python/FastAPI, Kubernetes (K3s), Temporal, PostgreSQL, Redis, Weaviate, MinIO, and local LLM serving with Ollama.',
  },
]

const reading = [
  { to: '/blog/ai-homelab-engineering/01-my-homelab-architecture-for-agentic-ai', text: 'My homelab architecture for agentic AI' },
  { to: '/blog/ai-homelab-engineering/02-three-jetson-orin-nano-supers-as-ai-cluster', text: 'Using three Jetson Orin Nano Supers as an AI cluster' },
  { to: '/blog/ai-homelab-engineering/03-rtx-3090-jetson-orin-hybrid-architecture', text: 'RTX 3090 + Jetson Orin hybrid architecture' },
  { to: '/blog/ai-engineering/25-tiny-tool-calling-model-34-to-98', text: 'Teaching a 0.6B model to run my homelab (34% → 98%)' },
  { to: '/blog/agentic-ai-systems/09-long-running-agent-workflows', text: 'Long-running agent workflows' },
  { to: '/blog/versehub-engineering/06-verification-pipeline-for-ai-outputs', text: 'A verification pipeline for AI outputs' },
  { to: '/blog/infrastructureengineering/46-servicelb-node-label-broke-loadbalancers', text: 'How one node label broke every LoadBalancer' },
  { to: '/blog/ai-homelab-engineering/16-complete-guide-production-ready-local-ai-platform', text: 'Building a production-ready local AI platform' },
]

const hubs = [
  { to: '/systems/ai-homelab', text: 'AI Homelab' },
  { to: '/systems/agentic-ai', text: 'Agentic AI Systems' },
  { to: '/systems/infrastructure', text: 'Infrastructure' },
  { to: '/systems/local-vibe-coding', text: 'Local Vibe Coding' },
  { to: '/system-overview', text: 'Full system overview' },
  { to: '/jetson-leaderboard', text: 'Jetson model leaderboard' },
]

const faqs = [
  {
    q: 'What hardware does Donavan Jones run for local AI?',
    a: 'A 7-node K3s cluster: four Raspberry Pis (one control plane, three workers) and three NVIDIA Jetson Orin Nano Super 8GB boards used as GPU workers for LLMs, speech (Kokoro TTS and Whisper STT) and Stable Diffusion. A separate RTX 3090 workstation runs larger models, embeddings and LoRA training.',
  },
  {
    q: 'What runs on the cluster in production?',
    a: 'VerseHub, a Bible study platform. A small model on a Jetson writes a fast draft answer, then a Temporal workflow retrieves scripture from Weaviate, scores it, regenerates the answer and checks every citation. Redis caches responses. Gitea Actions builds and deploys ARM64 images, and Prometheus, Grafana and Loki provide observability.',
  },
  {
    q: 'Is he available for research interviews or advisory work with AI hardware companies?',
    a: 'Yes. He takes user-research interviews, design-partner and early-tester arrangements, technical advisory, and contract engineering with teams building local AI hardware, agent runtimes, or inference software. Reach out through the contact form on the hire-me page.',
  },
  {
    q: 'What has running local models on 8GB Jetsons taught him?',
    a: 'Memory is the binding constraint. Only one large model fits per board, page cache must be dropped before CUDA loads, and a 9B model that technically fits (about 5.3 GB, 4K context, around 3 tok/s) was not worth keeping. Small pinned models such as llama3.2:3b at about 21 tok/s are what make an always-on tier practical.',
  },
]

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'ProfessionalService',
            '@id': `${PAGE}#service`,
            name: title,
            description,
            url: PAGE,
            provider: { '@id': `${SITE}/#person` },
            areaServed: { '@type': 'Place', name: 'Worldwide (remote)' },
            serviceType: [
              'Local AI infrastructure consulting',
              'Edge AI inference',
              'AI agent orchestration',
              'User research interviews',
              'Technical advisory',
            ],
          },
          {
            '@type': 'FAQPage',
            '@id': `${PAGE}#faq`,
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
              { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE}/services` },
              { '@type': 'ListItem', position: 3, name: title, item: PAGE },
            ],
          },
        ],
      }),
    },
  ],
})
</script>

<template>
  <PatternSection>

    <!-- Hero -->
    <section class="relative isolate overflow-hidden w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <HeroBackdrop src="/img/heroes/services-local-ai-infrastructure.jpg" side="full" />
      <div class="max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <Icon name="mdi:chip" class="text-sm" />
          For AI hardware, agent-runtime &amp; inference teams
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
          I run local AI in production<br class="hidden sm:block" />
          <span class="text-emerald-500">on hardware with real limits.</span>
        </h1>

        <p class="max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
          I'm Donavan Jones, a full-stack and AI systems engineer in Lakeland, Florida. I built and operate a
          7-node Kubernetes cluster of Raspberry Pis and Jetson Orin Nano Supers, plus an RTX 3090 workstation.
          It serves RAG, voice, image generation and agent workflows for a live product. If you're building local AI
          hardware, an agent OS, or an inference runtime, I can tell you what users like me actually need.
        </p>

        <div class="flex flex-wrap justify-center gap-3">
          <NuxtLink
            to="/hire-me#contact"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors duration-200 shadow-lg shadow-emerald-500/20"
          >
            <Icon name="mdi:email-outline" class="text-base" />
            Start a conversation
          </NuxtLink>
          <NuxtLink
            to="/system-overview"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500/40 hover:text-emerald-500 transition-colors duration-200"
          >
            <Icon name="mdi:sitemap-outline" class="text-base" />
            See the full system
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- What I operate -->
    <section class="relative isolate overflow-hidden bg-slate-50 dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
      <HeroBackdrop lazy src="/img/sections/lai-operate.jpg" side="full" />
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">What I operate today</h2>
          <p class="text-slate-500 dark:text-slate-400">Measured on my own hardware, not taken from spec sheets.</p>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="item in operate"
            :key="item.label"
            class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-5"
          >
            <p class="text-3xl font-bold text-emerald-500 mb-1">{{ item.value }}</p>
            <p class="text-sm font-semibold text-slate-900 dark:text-white mb-2">{{ item.label }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ item.detail }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Leaderboard -->
    <section class="bg-slate-50 dark:bg-slate-950 pb-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-6xl mx-auto px-6 pt-16">
        <JetsonLeaderboardCard
          title="Benchmarks from my own boards"
          blurb="I keep a public leaderboard of every model I run on the Jetsons: generation speed, short-answer accuracy, tool calling and HumanEval-style coding, per quantization."
        />
      </div>
    </section>

    <!-- Lessons -->
    <section class="relative isolate overflow-hidden bg-white dark:bg-slate-900/30 py-16 border-b border-slate-200 dark:border-slate-800">
      <HeroBackdrop lazy src="/img/sections/lai-lessons.jpg" side="full" />
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">What running it has taught me</h2>
          <p class="text-slate-500 dark:text-slate-400">The problems that matter if you're designing a local AI system or agent runtime.</p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="lesson in lessons"
            :key="lesson.title"
            class="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 p-5 flex flex-col"
          >
            <!-- Art of the article each lesson links to -->
            <NuxtLink :to="lesson.link.to" tabindex="-1" aria-hidden="true" class="relative group -mx-5 -mt-5 mb-4 block aspect-[2/1] overflow-hidden border-b border-slate-200 dark:border-slate-800">
              <img :src="ctaImage(lesson.link.to)" alt="" width="600" height="315" loading="lazy" decoding="async"
                   class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              <div data-icon-overlay class="absolute top-3 left-3 z-10 rounded-xl bg-white/90 dark:bg-slate-950/75 backdrop-blur-sm shadow-sm">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20">
                  <Icon :name="lesson.icon" class="text-xl text-emerald-400" />
                </div>
              </div>
            </NuxtLink>
            <h3 class="font-bold text-slate-900 dark:text-white mb-2">{{ lesson.title }}</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 flex-1">{{ lesson.body }}</p>
            <NuxtLink :to="lesson.link.to" class="text-sm font-medium text-emerald-500 hover:text-emerald-400">
              {{ lesson.link.text }} →
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Engagements -->
    <section class="relative isolate overflow-hidden bg-slate-50 dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
      <HeroBackdrop lazy src="/img/sections/lai-engagements.jpg" side="full" />
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">How I work with product teams</h2>
          <p class="text-slate-500 dark:text-slate-400">Remote, async-friendly, and happy to start with an email exchange.</p>
        </div>
        <div class="grid sm:grid-cols-2 gap-5">
          <div
            v-for="e in engagements"
            :key="e.title"
            class="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-5"
          >
              <div class="relative -mx-5 -mt-5 mb-4 aspect-[2/1] overflow-hidden border-b border-slate-200 dark:border-slate-800">
                <img :src="e.image" alt="" width="600" height="315" loading="lazy" decoding="async"
                     class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <div data-icon-overlay class="absolute top-3 left-3 z-10 rounded-xl bg-white/90 dark:bg-slate-950/75 backdrop-blur-sm shadow-sm">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20">
                    <Icon :name="e.icon" class="text-xl text-emerald-400" />
                  </div>
                </div>
              </div>
            <div class="flex items-center gap-3 mb-3">
              <h3 class="font-bold text-slate-900 dark:text-white">{{ e.title }}</h3>
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{{ e.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Reading -->
    <section class="bg-white dark:bg-slate-900/30 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-5xl mx-auto px-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 text-center">Start with these write-ups</h2>
        <ul class="grid sm:grid-cols-2 gap-3 mb-8">
          <li v-for="r in reading" :key="r.to">
            <NuxtLink
              :to="r.to"
              class="flex items-start gap-2 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:border-emerald-500/40 hover:text-emerald-500 transition-colors"
            >
              <Icon name="mdi:file-document-outline" class="text-base mt-0.5 flex-shrink-0" />
              {{ r.text }}
            </NuxtLink>
          </li>
        </ul>
        <div class="flex flex-wrap justify-center gap-2">
          <NuxtLink
            v-for="h in hubs"
            :key="h.to"
            :to="h.to"
            class="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-emerald-500 hover:border-emerald-500/40"
          >
            {{ h.text }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="bg-slate-50 dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-3xl mx-auto px-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Questions</h2>
        <div class="space-y-4">
          <div
            v-for="f in faqs"
            :key="f.q"
            class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-5"
          >
            <h3 class="font-semibold text-slate-900 dark:text-white mb-2">{{ f.q }}</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{{ f.a }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="relative isolate overflow-hidden bg-white dark:bg-slate-900/30 py-16">
      <HeroBackdrop lazy src="/img/cards/cta-contact.jpg" side="full" />
      <div class="max-w-3xl mx-auto px-6 text-center">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">Building something for people like me?</h2>
        <p class="text-slate-600 dark:text-slate-400 mb-8">
          Tell me what you're researching. I'm glad to start with a couple of emails and go deeper on a call if it's useful.
        </p>
        <NuxtLink
          to="/hire-me#contact"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors duration-200"
        >
          <Icon name="mdi:email-outline" class="text-base" />
          Get in touch
        </NuxtLink>
      </div>
    </section>

  </PatternSection>
</template>
