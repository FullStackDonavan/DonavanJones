<script setup lang="ts">
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'
useSeoMeta({
  title: 'AI Systems Engineering — Donavan Jones',
  description: 'How I design production AI systems — RAG pipelines with Weaviate, agent frameworks, memory systems, hybrid LLM routing, and real-world inference architecture.',
  ogTitle: 'AI Systems Engineering — Donavan Jones',
  ogDescription: 'Production AI system patterns — RAG pipelines with Weaviate, agent frameworks, hybrid LLM routing, and evaluation architecture for real-world inference.',
  ogType: 'website',
  ogImage: `${_SITE}/img/logo.png`,
  ogUrl: `${_SITE}/systems/ai`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'AI Systems Engineering — Donavan Jones',
  twitterDescription: 'Production AI systems — RAG pipelines, agent frameworks, hybrid LLM routing, and inference architecture.',
  canonical: `${_SITE}/systems/ai`,
})

const principles = [
  { icon: 'mdi:layers-triple',    color: 'purple', text: 'Separate retrieval, reasoning, and generation into distinct layers' },
  { icon: 'mdi:eye-check',        color: 'sky',    text: 'Design for observability and evaluation before optimizing prompts' },
  { icon: 'mdi:alert-circle',     color: 'amber',  text: 'Treat LLM outputs as intermediate signals, not final truth' },
  { icon: 'mdi:puzzle',           color: 'emerald',text: 'Prefer composable pipeline stages over monolithic prompt chains' },
]

const areas = [
  {
    icon: 'mdi:database-search', color: 'purple',
    title: 'Retrieval',
    desc: 'Vector search, hybrid retrieval, embedding models, and context window assembly.',
    tags: ['Weaviate', 'Embeddings', 'Hybrid Search'],
  },
  {
    icon: 'mdi:robot', color: 'sky',
    title: 'Agents',
    desc: 'Tool calling, planning loops, multi-step task execution, and multi-agent workflows.',
    tags: ['Tool Use', 'Planning', 'Orchestration'],
  },
  {
    icon: 'mdi:brain', color: 'emerald',
    title: 'Memory',
    desc: 'Long-term context, episodic memory, session summarization, and knowledge persistence.',
    tags: ['Redis', 'Weaviate', 'Summarization'],
  },
  {
    icon: 'mdi:chart-box', color: 'amber',
    title: 'Evaluation',
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

const stack = [
  'Llama 3.2 8B', 'OpenAI API', 'Weaviate', 'RAG Pipelines',
  'FastAPI', 'Redis', 'PostgreSQL', 'BullMQ',
  'Whisper STT', 'ElevenLabs TTS', 'Stable Diffusion', 'Prometheus',
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
    answer: 'A custom orchestration layer classifies query complexity before inference. Standard queries route to Llama locally. Complex or low-confidence cases escalate to the OpenAI API. The routing is transparent to the user.'
  },
  {
    question: 'Can AI be integrated into existing applications?',
    answer: 'Yes. I integrate AI capabilities into existing web applications, CRMs, internal tools, and business workflows via API without requiring a complete rebuild.'
  },
  {
    question: 'Do you build voice AI applications?',
    answer: 'Yes. I integrate Whisper for speech-to-text, ElevenLabs for text-to-speech, and custom conversational pipelines for voice-driven experiences.'
  },
  {
    question: 'Can you deploy AI on private infrastructure?',
    answer: 'Yes. I specialize in self-hosted AI deployments using Kubernetes, ARM64 clusters, and GPU nodes — giving full control over privacy, cost, and inference latency.'
  },
  {
    question: 'Do you build AI agents and workflow automation?',
    answer: 'Yes. I build agents capable of retrieving information, calling tools, executing multi-step tasks, and automating business processes with proper termination and error handling.'
  },
]

useHead({
  script: [
    {
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
      <section class="mb-10">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-5">System Architecture Areas</h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="area in areas"
            :key="area.title"
            class="rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60 flex flex-col gap-3
                   hover:border-purple-500/40 transition-all duration-200"
          >
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

      <FaqSection title="Frequently Asked Questions" :faqs="faqs" />
      <ClusterArticles cluster="ai-engineering" />

    </div>
  </PatternSection>
</template>
