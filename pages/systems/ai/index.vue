<script setup lang="ts">
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'
useSeoMeta({
  title: 'AI Systems Engineering — Donavan Jones',
  description: 'How I design production AI systems — RAG pipelines with Weaviate, agent frameworks, memory systems, hybrid LLM routing, and real-world inference architecture.',
  ogTitle: 'AI Systems Engineering — Donavan Jones',
  ogDescription: 'Production AI system patterns — RAG pipelines with Weaviate, agent frameworks, hybrid LLM routing, and evaluation architecture for real-world inference.',
  ogType: 'website',
  ogImage: `${_SITE}/img/heroes/systems-ai.jpg`,
  ogUrl: `${_SITE}/systems/ai`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'AI Systems Engineering — Donavan Jones',
  twitterDescription: 'Production AI systems — RAG pipelines, agent frameworks, hybrid LLM routing, and inference architecture.',
  canonical: `${_SITE}/systems/ai`,
})

// Curated entry points into this topic cluster (all URLs verified against published posts)
const startHere = [
  { to: '/blog/ai-engineering/17-retrieval-augmented-generation', title: 'Retrieval-augmented generation (RAG)', desc: 'How retrieval, context assembly, and generation fit together.' },
  { to: '/blog/ai-engineering/02-vector-databases', title: 'Vector databases', desc: 'Choosing and using a vector store such as Weaviate.' },
  { to: '/blog/ai-engineering/11-embedding-strategies', title: 'Embedding strategies', desc: 'Picking and running embedding models for retrieval.' },
  { to: '/blog/ai-engineering/13-citation-grounding', title: 'Citation grounding', desc: 'Tying every claim in an answer back to retrieved evidence.' },
  { to: '/blog/ai-engineering/14-hallucination-reduction', title: 'Hallucination reduction', desc: 'Practical ways to keep a model from inventing answers.' },
  { to: '/blog/ai-engineering/03-tool-calling', title: 'Tool calling', desc: 'Letting a model call functions safely and reliably.' },
  { to: '/blog/ai-engineering/04-agent-orchestration', title: 'Agent orchestration', desc: 'Coordinating multi-step AI work.' },
  { to: '/blog/ai-engineering/07-local-agent-systems', title: 'Local agent systems', desc: 'Running agents on your own hardware.' },
  { to: '/blog/ai-engineering/22-voice-narration-pipelines', title: 'Voice narration pipelines', desc: 'Local text-to-speech and speech-to-text in one pipeline.' },
  { to: '/blog/ai-engineering/25-tiny-tool-calling-model-34-to-98', title: 'Teaching a 0.6B model to call tools (34% to 98%)', desc: 'Fine-tuning a tiny model to run homelab tools.' },
]

const relatedLinks = [
  { to: '/systems/agentic-ai', label: 'Agentic AI Systems' },
  { to: '/systems/backend', label: 'Backend Systems' },
  { to: '/systems/ai-homelab', label: 'AI Homelab Engineering' },
  { to: '/systems/local-vibe-coding', label: 'Local Vibe Coding' },
  { to: '/projects/versehub', label: 'VerseHub case study' },
  { to: '/projects/kingdom-tools', label: 'Kingdom Tools platform' },
]

const principles = [
  { icon: 'mdi:layers-triple',    color: 'purple', text: 'Separate retrieval, reasoning, and generation into distinct layers' },
  { icon: 'mdi:eye-check',        color: 'sky',    text: 'Design for observability and evaluation before optimizing prompts' },
  { icon: 'mdi:alert-circle',     color: 'amber',  text: 'Treat LLM outputs as intermediate signals, not final truth' },
  { icon: 'mdi:puzzle',           color: 'emerald',text: 'Prefer composable pipeline stages over monolithic prompt chains' },
]

const areas = [
  {
    icon: 'mdi:database-search', color: 'purple',
    title: 'Retrieval', image: '/img/cards/ai-retrieval.jpg',
    desc: 'Vector search, hybrid retrieval, embedding models, and context window assembly.',
    tags: ['Weaviate', 'Embeddings', 'Hybrid Search'],
  },
  {
    icon: 'mdi:robot', color: 'sky',
    title: 'Agents', image: '/img/cards/ai-agents.jpg',
    desc: 'Tool calling, planning loops, multi-step task execution, and multi-agent workflows.',
    tags: ['Tool Use', 'Planning', 'Orchestration'],
  },
  {
    icon: 'mdi:brain', color: 'emerald',
    title: 'Memory', image: '/img/cards/ai-memory.jpg',
    desc: 'Long-term context, episodic memory, session summarization, and knowledge persistence.',
    tags: ['Redis', 'Weaviate', 'Summarization'],
  },
  {
    icon: 'mdi:chart-box', color: 'amber',
    title: 'Evaluation', image: '/img/cards/ai-evaluation.jpg',
    desc: 'Retrieval metrics, hallucination detection, latency tracing, and quality scoring.',
    tags: ['Tracing', 'Metrics', 'Observability'],
  },
]

const failures = [
  { icon: 'mdi:link-off',        color: 'rose',   text: 'Hallucinations caused by weak retrieval grounding or missing context' },
  { icon: 'mdi:loop',            color: 'amber',  text: 'Agent loops without proper termination or cycle-detection logic' },
  { icon: 'mdi:memory',          color: 'purple', text: 'Context window overflow and memory drift across long sessions' },
  { icon: 'mdi:swap-horizontal', color: 'sky',    text: 'Unstable tool execution ordering in parallel agent steps' },
]

const inferenceMetrics = [
  { value: '~21',    label: 'tok/s llama3.2:3b draft on a Jetson' },
  { value: '4',      label: 'Workflow stages: retrieve → score → generate → verify' },
  { value: '0.85 s', label: 'Kokoro TTS → Whisper STT round trip' },
  { value: '3',      label: 'Jetson Orin Nano Super 8GB nodes (CUDA)' },
]

const stack = [
  'Llama 3.2 3B', 'Ollama', 'OpenAI API', 'Weaviate', 'RAG Pipelines', 'Temporal',
  'NVIDIA Jetson Orin Nano Super', 'CUDA', 'FastAPI', 'Redis',
  'PostgreSQL', 'BullMQ', 'Whisper STT', 'Kokoro TTS',
  'Stable Diffusion', 'Prometheus', 'Loki',
]

const faqs = [
  {
    question: 'What AI systems do you build?',
    answer: 'I build AI-powered applications including RAG systems, chat assistants, knowledge bases, recommendation engines, workflow automation tools, and custom AI integrations for production use.'
  },
  {
    question: 'Do you work with local AI models?',
    answer: 'Yes. I deploy and manage local AI models (Llama 3.2, Ollama) on-cluster, allowing workloads to run privately without routing everything through external APIs.'
  },
  {
    question: 'How does your RAG pipeline work?',
    answer: 'Content is embedded into Weaviate. At query time, semantically relevant passages are retrieved and injected into the prompt before inference — grounding responses in actual source data rather than model memory.'
  },
  {
    question: 'How do you route between local and cloud AI models?',
    answer: 'In VerseHub, a fast draft comes from llama3.2:3b on a Jetson, then a Temporal workflow retrieves evidence, scores it, regenerates, and verifies citations. Hosted APIs are used where a task needs a stronger model; the split is a per-feature decision, not a black box.'
  },
  {
    question: 'Can AI be integrated into existing applications?',
    answer: 'Yes. I integrate AI capabilities into existing web applications, CRMs, internal tools, and business workflows via API without requiring a complete rebuild.'
  },
  {
    question: 'Do you build voice AI applications?',
    answer: 'Yes. VerseHub voice runs Kokoro-82M text-to-speech and whisper.cpp speech-to-text on a Jetson Orin Nano Super, with a measured 0.85 s round trip.'
  },
  {
    question: 'Can you deploy AI on private infrastructure?',
    answer: 'Yes. My 7-node K3s cluster includes 3 NVIDIA Jetson Orin Nano Super 8GB nodes for local LLM, speech, and image generation, and an RTX 3090 workstation runs the sentence embedder and larger models — no cloud required for those workloads.'
  },
  {
    question: 'Do you build AI agents and workflow automation?',
    answer: 'Yes. I build agents capable of retrieving information, calling tools, executing multi-step tasks, and automating business processes with proper termination and error handling.'
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
    <AiHero />
    <Breadcrumbs parentTitle="Systems" parentUrl="/system-overview" currentPageTitle="AI" />

    <div class="mx-auto max-w-7xl px-6 py-14">

      <!-- HEADER -->
      <div class="mb-12">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4
                 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm"
        >
          <Icon name="mdi:brain" class="text-sm" />
          AI Systems Engineering
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
          Building Production AI Systems
        </h1>
        <p class="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Practical patterns for designing scalable AI systems: RAG pipelines, agents, memory systems,
          evaluation frameworks, and real-world inference architecture.
        </p>
      </div>

      <!-- PRINCIPLES + GOALS -->
      <div class="grid md:grid-cols-2 gap-5 mb-10">

        <!-- Core Principles -->
        <div
          class="rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
          <div class="flex items-center gap-3 mb-5">
            <div class="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Icon name="mdi:compass" class="text-purple-400 text-lg" />
            </div>
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Core Principles</h2>
          </div>
          <ul class="space-y-3">
            <li v-for="p in principles" :key="p.text" class="flex items-start gap-3">
              <div
                class="mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 border"
                :class="{
                  'bg-purple-500/10 border-purple-500/20': p.color === 'purple',
                  'bg-sky-500/10 border-sky-500/20':       p.color === 'sky',
                  'bg-amber-500/10 border-amber-500/20':   p.color === 'amber',
                  'bg-emerald-500/10 border-emerald-500/20': p.color === 'emerald',
                }"
              >
                <Icon :name="p.icon" class="text-xs"
                  :class="{
                    'text-purple-400': p.color === 'purple',
                    'text-sky-400':    p.color === 'sky',
                    'text-amber-400':  p.color === 'amber',
                    'text-emerald-400':p.color === 'emerald',
                  }"
                />
              </div>
              <span class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ p.text }}</span>
            </li>
          </ul>
        </div>

        <!-- Failure Modes -->
        <div
          class="rounded-2xl p-6 border border-slate-200 dark:border-rose-500/20
                 bg-white dark:bg-slate-900/60"
        >
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

      <!-- ARCHITECTURE AREAS -->
      <section class="relative isolate overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 mb-10">
        <HeroBackdrop lazy src="/img/sections/ai-areas.jpg" side="full" />
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-5">System Architecture Areas</h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="area in areas"
            :key="area.title"
            class="group overflow-hidden rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60 flex flex-col gap-3
                   hover:border-purple-500/40 transition-all duration-200"
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
                      'bg-emerald-500/10 border-emerald-500/20': area.color === 'emerald',
                      'bg-amber-500/10 border-amber-500/20':   area.color === 'amber',
                    }"
                  >
                    <Icon :name="area.icon" class="text-xl"
                      :class="{
                        'text-purple-400': area.color === 'purple',
                        'text-sky-400':    area.color === 'sky',
                        'text-emerald-400':area.color === 'emerald',
                        'text-amber-400':  area.color === 'amber',
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

      <!-- PRODUCTION METRICS -->
      <section class="relative isolate overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 mb-10">
        <HeroBackdrop lazy src="/img/sections/ai-metrics.jpg" side="full" />
        <div class="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <Icon name="mdi:chip" class="text-green-400 text-lg" />
            </div>
            <div>
              <h2 class="text-base font-semibold text-slate-900 dark:text-white">Running in Production</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">3× NVIDIA Jetson Orin Nano Super 8GB on the 7-node K3s cluster, plus one RTX 3090 workstation</p>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div
              v-for="m in inferenceMetrics"
              :key="m.label"
              class="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-4 text-center"
            >
              <div class="text-2xl font-bold text-slate-900 dark:text-white">{{ m.value }}</div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-1">{{ m.label }}</div>
            </div>
          </div>
          <p class="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            VerseHub answers start with a fast draft from llama3.2:3b on a Jetson, then a Temporal ScholarWorkflow on the Pi workers
            retrieves from Weaviate, scores the evidence, regenerates, and checks every citation against the retrieved passages.
          </p>
        </div>
      </section>

      <!-- DIAGRAM -->
      <section class="mb-10">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-5">System Architecture Diagram</h2>
        <AiDiagram />
      </section>

      <!-- STACK -->
      <section
        class="mb-10 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50
               bg-white dark:bg-slate-900/60"
      >
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

      <!-- <FaqSection title="Frequently Asked Questions" :faqs="faqs" />
      <BibleVerseCaseStudy />
      <ClusterArticles cluster="ai-engineering" /> -->

      <!-- START HERE -->
      <section class="mb-10">
        <JetsonLeaderboardCard metric="tools" blurb="Tool-calling accuracy of small local models on a Jetson Orin Nano Super: right tool, right arguments, or no call when none fits." />
      </section>

      <section class="relative isolate overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 mb-10">
        <HeroBackdrop lazy src="/img/sections/ai-start.jpg" side="full" />
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">Start Here: Key AI Engineering Articles</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-3xl leading-relaxed">The core path through retrieval, grounding, agents, and running models locally.</p>
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

      <!-- CATEGORY LINK -->
      <section class="mb-10">
        <NuxtLink
          to="/categories/ai-engineering"
          class="relative isolate overflow-hidden flex items-center justify-between gap-6 rounded-2xl p-6
                 border border-sky-500/20 bg-sky-500/5
                 hover:border-sky-500/40 hover:bg-sky-500/10
                 transition-all duration-200 group"
        >
          <HeroBackdrop lazy src="/img/categories/ai-engineering.jpg" />
          <div>
            <p class="text-xs font-medium text-sky-500 uppercase tracking-wider mb-1">Knowledge Base</p>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors">
              Explore the AI Engineering Articles
            </h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              24 articles covering memory systems, RAG, vector databases, agents, and production AI patterns.
            </p>
          </div>
          <Icon name="mdi:arrow-right" class="flex-shrink-0 text-2xl text-sky-500 group-hover:translate-x-1 transition-transform duration-200" />
        </NuxtLink>
      </section>

    </div>
  </PatternSection>
</template>
