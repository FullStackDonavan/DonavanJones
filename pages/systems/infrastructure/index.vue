<script setup lang="ts">
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'
useSeoMeta({
  title: 'Infrastructure Engineering — Donavan Jones',
  description: 'Designing and operating a 12-node self-hosted Kubernetes cluster — 8× Raspberry Pi 5 + 4× NVIDIA Jetson Orin Nano Super — covering storage, networking, observability, CI/CD, and local AI inference.',
  ogTitle: 'Infrastructure Engineering — Donavan Jones',
  ogDescription: '12-node self-hosted Kubernetes cluster (8× Pi 5 + 4× Jetson Orin Nano Super) — distributed storage, networking, Prometheus + Loki observability, CI/CD, and on-cluster AI inference.',
  ogType: 'website',
  ogImage: `${_SITE}/img/logo.png`,
  ogUrl: `${_SITE}/systems/infrastructure`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Infrastructure Engineering — Donavan Jones',
  twitterDescription: '12-node self-hosted Kubernetes (ARM64 + CUDA) — Prometheus/Loki observability, Gitea CI/CD, MinIO storage, and local LLM inference on Jetson.',
  canonical: `${_SITE}/systems/infrastructure`,
})

const principles = [
  { icon: 'mdi:docker',            color: 'sky',    text: 'Everything runs as a containerized workload — no bare-metal service installs' },
  { icon: 'mdi:source-branch',     color: 'emerald',text: 'Infrastructure is declarative (GitOps-first) — config is code, reviewed like code' },
  { icon: 'mdi:shield-check',      color: 'amber',  text: 'Failure is expected and designed for — rescheduling, retries, and circuit breakers by default' },
  { icon: 'mdi:eye-check',         color: 'purple', text: 'Systems must be observable from day one — metrics, logs, and health checks before launch' },
  { icon: 'mdi:home-lightbulb',    color: 'rose',   text: 'Edge and local compute reduce cloud dependency, cost, and latency for internal workloads' },
]

const layers = [
  {
    icon: 'mdi:raspberry-pi', color: 'sky',
    title: 'General Compute',
    desc: 'k3s on 8 Raspberry Pi 5 ARM64 nodes — control plane + app services, databases, queues, CI/CD, and storage workloads.',
    tags: ['k3s', 'Raspberry Pi 5', 'ARM64'],
  },
  {
    icon: 'mdi:chip', color: 'green',
    title: 'GPU / AI Tier',
    desc: '4 NVIDIA Jetson Orin Nano Super nodes dedicated to local LLM inference, embedding generation, and RAG pipeline workers.',
    tags: ['Jetson Orin Nano Super', 'CUDA', '8GB LPDDR5'],
  },
  {
    icon: 'mdi:lan', color: 'purple',
    title: 'Networking',
    desc: 'Flannel CNI for pod networking. Ingress NGINX for cluster routing. Cloudflare Tunnel for secure public ingress without open ports.',
    tags: ['Flannel CNI', 'Ingress NGINX', 'Cloudflare Tunnel'],
  },
  {
    icon: 'mdi:harddisk', color: 'emerald',
    title: 'Storage',
    desc: 'MinIO S3-compatible object storage for assets and model weights. PostgreSQL + Apache AGE and Weaviate for structured and vector data.',
    tags: ['MinIO', 'PostgreSQL + AGE', 'Weaviate'],
  },
  {
    icon: 'mdi:source-branch', color: 'amber',
    title: 'CI/CD',
    desc: 'Self-hosted Gitea with Actions runners. Automated build, test, and deploy pipelines triggered on push.',
    tags: ['Gitea', 'Actions', 'GitOps'],
  },
]

const failures = [
  { icon: 'mdi:server-off',       color: 'rose',   text: 'Node failure without pod rescheduling policies — workloads go dark silently' },
  { icon: 'mdi:harddisk-remove',  color: 'amber',  text: 'Storage saturation across persistent volumes causing write failures mid-operation' },
  { icon: 'mdi:network-off',      color: 'purple', text: 'Network bottlenecks between services under burst load without pod-level limits' },
  { icon: 'mdi:eye-off',          color: 'sky',    text: 'Silent service degradation with no alerting — issues surface hours late' },
  { icon: 'mdi:puzzle-remove',    color: 'emerald',text: 'Cluster resource fragmentation preventing scheduling of new pods despite available nodes' },
]

const observability = [
  {
    icon: 'mdi:chart-line', color: 'sky',
    title: 'Prometheus',
    desc: 'Scrapes node, container, and application metrics. Surfaces CPU, memory, queue depth, and LLM inference latency across all cluster nodes.',
  },
  {
    icon: 'mdi:text-box-search-outline', color: 'purple',
    title: 'Loki',
    desc: 'Log aggregation for all container workloads. Correlation IDs thread through API, worker, and AI service logs. Queried directly from Grafana.',
  },
  {
    icon: 'mdi:view-dashboard-outline', color: 'amber',
    title: 'Grafana',
    desc: 'Unified dashboard layer over Prometheus metrics and Loki logs. Custom boards for inference latency, queue throughput, and storage pressure.',
  },
  {
    icon: 'mdi:bell-alert-outline', color: 'emerald',
    title: 'Alertmanager',
    desc: 'Routes alerts from Prometheus rules. Notifies on sustained error rates, queue stalls, node resource pressure, and service health failures.',
  },
]

const kingdomTools = {
  features: [
    {
      icon: 'mdi:view-dashboard-variant', color: 'sky',
      title: 'Cluster Management',
      desc: 'View all nodes, pods, deployments, and services across every namespace. Restart or scale deployments and view pod logs in-browser.',
    },
    {
      icon: 'mdi:database-cog', color: 'emerald',
      title: 'Data Layer Management',
      desc: 'PostgreSQL databases, MinIO buckets, Redis slots, and Weaviate collections — create, browse, and delete from one interface.',
    },
    {
      icon: 'mdi:clipboard-list', color: 'purple',
      title: 'Service Catalog',
      desc: 'Every service is registered with a declarative spec defining its database, bucket, Redis slot, Weaviate collection, and deployment config.',
    },
    {
      icon: 'mdi:rocket-launch', color: 'amber',
      title: 'One-Click Provisioning',
      desc: '5 service templates (web-app, ai-agent, scraper, api-service, worker). Pick a template, hit provision — isolated resources created across all four data layers.',
    },
    {
      icon: 'mdi:shield-search', color: 'rose',
      title: 'Audit & Drift Detection',
      desc: 'Cross-references every resource against the catalog. Flags orphans and missing resources. Reconcile button fixes drift instantly.',
    },
    {
      icon: 'mdi:chart-box', color: 'sky',
      title: 'Observability Dashboard',
      desc: 'Stat cards for nodes, pods, deployments, databases, buckets, Redis slots, collections, and catalog count. Alerts panel for unhealthy pods.',
    },
  ],
  stack: ['Python', 'FastAPI', 'K8s API', 'PostgreSQL', 'MinIO', 'Redis', 'Weaviate', 'Prometheus', 'Loki'],
}

const stack = [
  'Kubernetes (k3s)', 'Raspberry Pi 5', 'NVIDIA Jetson Orin Nano Super', 'ARM64',
  'CUDA', 'Docker', 'Flannel CNI', 'Cloudflare Tunnel',
  'Ingress NGINX', 'cert-manager', 'MinIO', 'PostgreSQL + AGE',
  'Weaviate', 'Gitea', 'Actions Runners', 'Prometheus',
  'Loki', 'Grafana', 'Alertmanager', 'Kingdom Tools',
]

const faqs = [
  {
    question: 'What does your infrastructure look like?',
    answer: 'A 12-node self-hosted k3s Kubernetes cluster: 8 Raspberry Pi 5 ARM64 nodes for general workloads and 4 NVIDIA Jetson Orin Nano Super nodes for GPU-accelerated AI inference. It runs databases, APIs, media processing, CI/CD, and local LLM inference as a single unified deployment target.'
  },
  {
    question: 'What services do you self-host?',
    answer: 'PostgreSQL, Redis, MinIO object storage, Weaviate, Gitea, AI inference workloads (Llama 3.2), and custom applications including the Bible Verse platform.'
  },
  {
    question: 'How do you handle AI workloads on the cluster?',
    answer: 'AI inference runs on 4 dedicated NVIDIA Jetson Orin Nano Super nodes with CUDA acceleration. Llama 3.2 handles ~80% of requests locally; the OpenAI API handles edge cases. Embedding generation, RAG pipeline workers, and multi-model routing are each pinned to separate Jetson pods via node selectors.'
  },
  {
    question: 'How is your storage architecture designed?',
    answer: 'MinIO provides S3-compatible object storage for model weights, media assets, and user uploads. PostgreSQL handles structured data with persistent volumes. Redis is in-memory only — no persistent storage for session or cache data.'
  },
  {
    question: 'How do you manage deployments?',
    answer: 'Gitea Actions runners trigger on push. Pipelines run lint, type check, and tests before building Docker images and applying Kubernetes manifests. Pending migrations block the deploy step.'
  },
  {
    question: 'How do you monitor the cluster?',
    answer: 'Prometheus scrapes metrics from all nodes and pods. Loki aggregates container logs with correlation IDs across API, worker, and AI services. Grafana provides unified dashboards over both. Alertmanager routes alerts on sustained error rates, queue stalls, or node resource pressure.'
  },
  {
    question: 'Do you use cloud providers?',
    answer: 'Minimally. The cluster is self-hosted. Cloud is used only where it makes sense operationally — not as the primary runtime for workloads that can run locally.'
  },
  {
    question: 'What makes this architecture unique?',
    answer: 'It combines two distinct hardware tiers — ARM64 general compute (Pi 5) and CUDA GPU nodes (Jetson Orin Nano Super) — under a single k3s control plane. Self-hosted AI inference, observability (Prometheus + Loki + Grafana), CI/CD (Gitea), and distributed storage (MinIO + Weaviate + PostgreSQL) all run on-cluster without cloud dependency.'
  },
  {
    question: 'What is Kingdom Tools?',
    answer: 'Kingdom Tools is an internal service control plane that manages the full lifecycle of microservices on the cluster. It combines a service catalog, one-click resource provisioning across PostgreSQL, MinIO, Redis, and Weaviate, automated drift detection that flags orphaned or missing resources, and a reconcile engine that fixes infrastructure drift in one pass. It runs as a Python FastAPI pod in the kingdom-tools namespace.'
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
    <InfraHero />
    <Breadcrumbs parentTitle="Systems" parentUrl="/system-overview" currentPageTitle="Infrastructure" />

    <div class="mx-auto max-w-7xl px-6 py-14">

      <!-- HEADER -->
      <div class="mb-12">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4
                 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm"
        >
          <Icon name="mdi:server-network" class="text-sm" />
          Infrastructure Engineering
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
          Building Private Cloud Infrastructure
        </h1>
        <p class="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Designing and operating a 12-node self-hosted Kubernetes cluster — 8× Raspberry Pi 5 for general workloads
          and 4× NVIDIA Jetson Orin Nano Super for GPU-accelerated AI inference — with distributed storage,
          Prometheus + Loki observability, Gitea CI/CD, and Cloudflare Tunnel ingress.
        </p>
      </div>

      <!-- PRINCIPLES + FAILURES -->
      <div class="grid md:grid-cols-2 gap-5 mb-10">

        <!-- Core Principles -->
        <div
          class="rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
          <div class="flex items-center gap-3 mb-5">
            <div class="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <Icon name="mdi:compass" class="text-sky-400 text-lg" />
            </div>
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Core Principles</h2>
          </div>
          <ul class="space-y-3">
            <li v-for="p in principles" :key="p.text" class="flex items-start gap-3">
              <div
                class="mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 border"
                :class="{
                  'bg-sky-500/10 border-sky-500/20':         p.color === 'sky',
                  'bg-emerald-500/10 border-emerald-500/20': p.color === 'emerald',
                  'bg-amber-500/10 border-amber-500/20':     p.color === 'amber',
                  'bg-purple-500/10 border-purple-500/20':   p.color === 'purple',
                  'bg-rose-500/10 border-rose-500/20':       p.color === 'rose',
                }"
              >
                <Icon :name="p.icon" class="text-xs"
                  :class="{
                    'text-sky-400':    p.color === 'sky',
                    'text-emerald-400':p.color === 'emerald',
                    'text-amber-400':  p.color === 'amber',
                    'text-purple-400': p.color === 'purple',
                    'text-rose-400':   p.color === 'rose',
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
            <h2 class="text-base font-semibold text-slate-900 dark:text-white">Infrastructure Failure Modes</h2>
          </div>
          <ul class="space-y-3">
            <li v-for="f in failures" :key="f.text" class="flex items-start gap-3">
              <div
                class="mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 border"
                :class="{
                  'bg-rose-500/10 border-rose-500/20':       f.color === 'rose',
                  'bg-amber-500/10 border-amber-500/20':     f.color === 'amber',
                  'bg-purple-500/10 border-purple-500/20':   f.color === 'purple',
                  'bg-sky-500/10 border-sky-500/20':         f.color === 'sky',
                  'bg-emerald-500/10 border-emerald-500/20': f.color === 'emerald',
                }"
              >
                <Icon :name="f.icon" class="text-xs"
                  :class="{
                    'text-rose-400':   f.color === 'rose',
                    'text-amber-400':  f.color === 'amber',
                    'text-purple-400': f.color === 'purple',
                    'text-sky-400':    f.color === 'sky',
                    'text-emerald-400':f.color === 'emerald',
                  }"
                />
              </div>
              <span class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ f.text }}</span>
            </li>
          </ul>
        </div>

      </div>

      <!-- INFRASTRUCTURE LAYERS -->
      <section class="mb-10">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-5">Infrastructure Layers</h2>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="layer in layers"
            :key="layer.title"
            class="rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60 flex flex-col gap-3
                   hover:border-sky-500/40 transition-all duration-200"
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center border"
              :class="{
                'bg-sky-500/10 border-sky-500/20':         layer.color === 'sky',
                'bg-green-500/10 border-green-500/20':     layer.color === 'green',
                'bg-purple-500/10 border-purple-500/20':   layer.color === 'purple',
                'bg-emerald-500/10 border-emerald-500/20': layer.color === 'emerald',
                'bg-amber-500/10 border-amber-500/20':     layer.color === 'amber',
              }"
            >
              <Icon :name="layer.icon" class="text-xl"
                :class="{
                  'text-sky-400':    layer.color === 'sky',
                  'text-green-400':  layer.color === 'green',
                  'text-purple-400': layer.color === 'purple',
                  'text-emerald-400':layer.color === 'emerald',
                  'text-amber-400':  layer.color === 'amber',
                }"
              />
            </div>
            <div>
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white">{{ layer.title }}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{{ layer.desc }}</p>
            </div>
            <div class="flex flex-wrap gap-1 mt-auto">
              <span
                v-for="tag in layer.tags" :key="tag"
                class="text-[11px] px-2 py-0.5 rounded-md border
                       bg-slate-100 dark:bg-slate-800
                       text-slate-500 dark:text-slate-400
                       border-slate-200 dark:border-slate-700/50"
              >{{ tag }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- OBSERVABILITY -->
      <section class="mb-10">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-5">Observability Stack</h2>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="obs in observability"
            :key="obs.title"
            class="rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60"
          >
            <div class="flex items-center gap-3 mb-3">
              <div
                class="w-9 h-9 rounded-lg flex items-center justify-center border"
                :class="{
                  'bg-sky-500/10 border-sky-500/20':         obs.color === 'sky',
                  'bg-purple-500/10 border-purple-500/20':   obs.color === 'purple',
                  'bg-amber-500/10 border-amber-500/20':     obs.color === 'amber',
                  'bg-emerald-500/10 border-emerald-500/20': obs.color === 'emerald',
                }"
              >
                <Icon :name="obs.icon" class="text-lg"
                  :class="{
                    'text-sky-400':    obs.color === 'sky',
                    'text-purple-400': obs.color === 'purple',
                    'text-amber-400':  obs.color === 'amber',
                    'text-emerald-400':obs.color === 'emerald',
                  }"
                />
              </div>
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white">{{ obs.title }}</h3>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ obs.desc }}</p>
          </div>
        </div>
      </section>

      <!-- KINGDOM TOOLS -->
      <section class="mb-10">
        <div class="mb-6">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3
                   bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium"
          >
            <Icon name="mdi:tools" class="text-sm" />
            Service Control Plane
          </div>
          <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Kingdom Tools</h2>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            An internal platform layer that combines cluster observability, resource provisioning, a service catalog,
            and drift detection into a single dashboard. It enforces the opinion that a service is a bundle of
            infrastructure resources — not just a deployment.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div
            v-for="feat in kingdomTools.features"
            :key="feat.title"
            class="rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60 flex flex-col gap-3"
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center border"
              :class="{
                'bg-sky-500/10 border-sky-500/20':         feat.color === 'sky',
                'bg-emerald-500/10 border-emerald-500/20': feat.color === 'emerald',
                'bg-purple-500/10 border-purple-500/20':   feat.color === 'purple',
                'bg-amber-500/10 border-amber-500/20':     feat.color === 'amber',
                'bg-rose-500/10 border-rose-500/20':       feat.color === 'rose',
              }"
            >
              <Icon :name="feat.icon" class="text-xl"
                :class="{
                  'text-sky-400':    feat.color === 'sky',
                  'text-emerald-400':feat.color === 'emerald',
                  'text-purple-400': feat.color === 'purple',
                  'text-amber-400':  feat.color === 'amber',
                  'text-rose-400':   feat.color === 'rose',
                }"
              />
            </div>
            <div>
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white">{{ feat.title }}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{{ feat.desc }}</p>
            </div>
          </div>
        </div>

        <div
          class="rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <Icon name="mdi:code-tags" class="text-sky-400 text-sm" />
            </div>
            <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Kingdom Tools Stack</h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="t in kingdomTools.stack" :key="t"
              class="text-[11px] px-2.5 py-1 rounded-lg border
                     bg-slate-100 dark:bg-slate-800
                     text-slate-600 dark:text-slate-300
                     border-slate-200 dark:border-slate-700/50"
            >{{ t }}</span>
          </div>
        </div>
      </section>

      <!-- DIAGRAM -->
      <section class="mb-10">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-5">System Architecture Diagram</h2>
        <InfraDiagram />
      </section>

      <!-- STACK -->
      <section
        class="mb-10 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50
               bg-white dark:bg-slate-900/60"
      >
        <h2 class="text-base font-semibold text-slate-900 dark:text-white mb-4">Infrastructure Stack</h2>
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
      <ClusterArticles cluster="infrastructure-engineering" /> -->

      <!-- CATEGORY LINK -->
      <section class="mb-10">
        <NuxtLink
          to="/categories/infrastructure-engineering"
          class="flex items-center justify-between gap-6 rounded-2xl p-6
                 border border-sky-500/20 bg-sky-500/5
                 hover:border-sky-500/40 hover:bg-sky-500/10
                 transition-all duration-200 group"
        >
          <div>
            <p class="text-xs font-medium text-sky-500 uppercase tracking-wider mb-1">Knowledge Base</p>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors">
              Explore the Infrastructure Engineering Articles
            </h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              40 articles covering K3s, Raspberry Pi clusters, Gitea CI/CD, networking, storage, and self-hosted infrastructure.
            </p>
          </div>
          <Icon name="mdi:arrow-right" class="flex-shrink-0 text-2xl text-sky-500 group-hover:translate-x-1 transition-transform duration-200" />
        </NuxtLink>
      </section>

    </div>
  </PatternSection>
</template>
