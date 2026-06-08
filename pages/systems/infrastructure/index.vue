<script setup lang="ts">
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'
useSeoMeta({
  title: 'Infrastructure Engineering — Donavan Jones',
  description: 'Designing and operating a self-hosted Kubernetes cluster with distributed storage, networking, observability, CI/CD automation, and AI workloads on ARM64 nodes.',
  ogTitle: 'Infrastructure Engineering — Donavan Jones',
  ogDescription: 'Self-hosted Kubernetes on ARM64: distributed storage, networking, observability, CI/CD, and AI workloads.',
  ogType: 'website',
  ogImage: `${_SITE}/img/logo.png`,
  ogUrl: `${_SITE}/systems/infrastructure`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Infrastructure Engineering — Donavan Jones',
  twitterDescription: 'Self-hosted Kubernetes on ARM64: storage, networking, observability, and CI/CD.',
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
    title: 'Compute Cluster',
    desc: 'k3s on 8 Raspberry Pi 5 ARM64 nodes. Workload scheduling, resource quotas, and pod autoscaling.',
    tags: ['k3s', 'Raspberry Pi 5', 'ARM64'],
  },
  {
    icon: 'mdi:lan', color: 'purple',
    title: 'Networking',
    desc: 'Ingress NGINX for cluster-edge routing. Internal DNS, service mesh patterns, and cert management.',
    tags: ['Ingress NGINX', 'cert-manager', 'DNS'],
  },
  {
    icon: 'mdi:harddisk', color: 'emerald',
    title: 'Storage',
    desc: 'MinIO S3-compatible object storage for assets and model weights. Persistent volumes for stateful workloads.',
    tags: ['MinIO', 'PVC', 'S3-Compatible'],
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
    title: 'Metrics',
    desc: 'Prometheus scrapes node, container, and application metrics. Grafana dashboards surface CPU, memory, queue depth, and inference latency.',
  },
  {
    icon: 'mdi:file-document-outline', color: 'purple',
    title: 'Logs',
    desc: 'Centralized structured logging across all containers. Correlation IDs thread through API, worker, and AI service logs.',
  },
  {
    icon: 'mdi:eye', color: 'emerald',
    title: 'Tracing',
    desc: 'Request tracing across distributed services. Health check endpoints polled by the load balancer per dependency.',
  },
]

const stack = [
  'Kubernetes (k3s)', 'Raspberry Pi 5', 'Docker', 'ARM64',
  'Ingress NGINX', 'cert-manager', 'MinIO', 'Gitea',
  'Actions Runners', 'Prometheus', 'Grafana', 'Alertmanager',
]

const faqs = [
  {
    question: 'What does your infrastructure look like?',
    answer: 'A self-hosted k3s Kubernetes cluster running on 8 Raspberry Pi 5 ARM64 nodes. It supports AI inference, databases, APIs, media processing, and CI/CD pipelines across a single unified deployment target.'
  },
  {
    question: 'What services do you self-host?',
    answer: 'PostgreSQL, Redis, MinIO object storage, Weaviate, Gitea, AI inference workloads (Llama 3.2), and custom applications including the Bible Verse platform.'
  },
  {
    question: 'How do you handle AI workloads on ARM64?',
    answer: 'AI workloads run as containerized pods scheduled to capable nodes. LLM inference and embedding generation run on dedicated pods with resource limits. Heavy batch jobs are enqueued via BullMQ and processed asynchronously.'
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
    answer: 'Prometheus scrapes metrics from nodes, pods, and applications. Grafana dashboards surface queue depth, inference latency, and memory pressure. Alertmanager notifies on sustained error rates or queue stalls.'
  },
  {
    question: 'Do you use cloud providers?',
    answer: 'Minimally. The cluster is self-hosted. Cloud is used only where it makes sense operationally — not as the primary runtime for workloads that can run locally.'
  },
  {
    question: 'What makes this architecture unique?',
    answer: 'It combines ARM64 homelab hardware, Kubernetes orchestration, self-hosted AI inference, and full-stack application deployment into a single unified ecosystem supporting real production applications.'
  },
]
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
          Designing and operating a self-hosted Kubernetes cluster with distributed storage,
          networking, observability, CI/CD automation, and AI workloads on ARM64 nodes.
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

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                'bg-purple-500/10 border-purple-500/20':   layer.color === 'purple',
                'bg-emerald-500/10 border-emerald-500/20': layer.color === 'emerald',
                'bg-amber-500/10 border-amber-500/20':     layer.color === 'amber',
              }"
            >
              <Icon :name="layer.icon" class="text-xl"
                :class="{
                  'text-sky-400':    layer.color === 'sky',
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

        <div class="grid md:grid-cols-3 gap-4">
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
                  'bg-emerald-500/10 border-emerald-500/20': obs.color === 'emerald',
                }"
              >
                <Icon :name="obs.icon" class="text-lg"
                  :class="{
                    'text-sky-400':    obs.color === 'sky',
                    'text-purple-400': obs.color === 'purple',
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

      <FaqSection title="Frequently Asked Questions" :faqs="faqs" />
      <ClusterArticles cluster="infrastructure-engineering" />

    </div>
  </PatternSection>
</template>
