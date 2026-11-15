<script setup lang="ts">
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'
useSeoMeta({
  title: 'Infrastructure Engineering — Donavan Jones',
  description: 'Infrastructure engineering for a self-hosted 7-node K3s Kubernetes cluster — 4 Raspberry Pis + 3 NVIDIA Jetson Orin Nano Super — covering storage, networking, Prometheus/Grafana/Loki observability, Gitea CI/CD, and local AI inference.',
  ogTitle: 'Infrastructure Engineering — Donavan Jones',
  ogDescription: '7-node self-hosted K3s cluster (4 Raspberry Pis + 3 Jetson Orin Nano Super) — storage, networking, Prometheus + Grafana + Loki observability, Gitea CI/CD, and on-cluster AI inference.',
  ogType: 'website',
  ogImage: `${_SITE}/img/heroes/systems-infrastructure.jpg`,
  ogUrl: `${_SITE}/systems/infrastructure`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Infrastructure Engineering — Donavan Jones',
  twitterDescription: '7-node self-hosted K3s (ARM64 + CUDA) — Prometheus/Loki observability, Gitea CI/CD, MinIO storage, and local LLM inference on Jetson.',
  canonical: `${_SITE}/systems/infrastructure`,
})

// Curated entry points into this topic cluster (all URLs verified against published posts)
const startHere = [
  { to: '/blog/infrastructureengineering/13-cluster-architecture-homelab', title: 'Homelab cluster architecture', desc: 'How the Pi control plane, Pi workers, and Jetson GPU nodes fit together.' },
  { to: '/blog/infrastructureengineering/01-k3s-on-raspberry-pis', title: 'Running K3s on Raspberry Pis', desc: 'Why lightweight Kubernetes on ARM64 boards, and how the cluster starts.' },
  { to: '/blog/infrastructureengineering/12-arm64-considerations', title: 'ARM64 considerations for Kubernetes', desc: 'Image builds, architecture mismatches, and what breaks on ARM.' },
  { to: '/blog/infrastructureengineering/21-gitea-runners-pipeline', title: 'Self-hosted CI/CD with Gitea runners', desc: 'The push-to-main pipeline that builds and deploys every service.' },
  { to: '/blog/infrastructureengineering/41-prometheus-on-pi-cluster', title: 'Prometheus on a Pi K3s cluster', desc: 'Metrics collection for every node and pod.' },
  { to: '/blog/infrastructureengineering/43-loki-promtail-on-pi-cluster', title: 'Loki and Promtail log aggregation', desc: 'Cluster-wide logs shipped by a Promtail DaemonSet.' },
  { to: '/blog/infrastructureengineering/44-recovering-after-control-plane-ip-change', title: 'Recovering K3s after a control plane IP change', desc: 'A real outage and the steps that brought the cluster back.' },
  { to: '/blog/infrastructureengineering/46-servicelb-node-label-broke-loadbalancers', title: 'How one node label broke every LoadBalancer', desc: 'A K3s ServiceLB (Klipper) incident and its fix.' },
  { to: '/blog/infrastructureengineering/47-running-the-corpus-crawler-on-the-rack', title: 'Running batch Jobs on the Pi rack', desc: 'The VerseHub corpus crawler as a Kubernetes Job.' },
]

const relatedLinks = [
  { to: '/system-overview', label: 'Full system overview' },
  { to: '/systems/ai-homelab', label: 'AI Homelab Engineering' },
  { to: '/systems/backend', label: 'Backend Systems' },
  { to: '/systems/ai', label: 'AI Systems Engineering' },
  { to: '/projects/kingdom-tools', label: 'Kingdom Tools platform' },
  { to: '/projects/versehub', label: 'VerseHub case study' },
]

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
    title: 'General Compute', image: '/img/cards/infra-general-compute.jpg',
    desc: 'k3s on 4 Raspberry Pi ARM64 nodes — pi-node1 as control plane (Prometheus, Grafana, Gitea) and three Pi workers for app services, Redis, Temporal workers, and batch Jobs.',
    tags: ['k3s', 'Raspberry Pi', 'ARM64'],
  },
  {
    icon: 'mdi:chip', color: 'green',
    title: 'GPU / AI Tier', image: '/img/cards/infra-gpu-tier.jpg',
    desc: '3 NVIDIA Jetson Orin Nano Super 8GB nodes, one role each: LLM (llama3.2:3b pinned), speech (Kokoro TTS + Whisper STT), and image generation (Stable Diffusion). Only one ~4-5 GB model fits per board.',
    tags: ['Jetson Orin Nano Super', 'CUDA', '8GB unified memory'],
  },
  {
    icon: 'mdi:lan', color: 'purple',
    title: 'Networking', image: '/img/cards/infra-networking.jpg',
    desc: 'Flannel CNI for pod networking. Ingress NGINX for cluster routing. Cloudflare Tunnel for secure public ingress without open ports.',
    tags: ['Flannel CNI', 'Ingress NGINX', 'Cloudflare Tunnel'],
  },
  {
    icon: 'mdi:harddisk', color: 'emerald',
    title: 'Storage', image: '/img/cards/infra-storage.jpg',
    desc: 'MinIO S3-compatible object storage for assets and model weights. PostgreSQL + Apache AGE and Weaviate for structured and vector data.',
    tags: ['MinIO', 'PostgreSQL + AGE', 'Weaviate'],
  },
  {
    icon: 'mdi:source-branch', color: 'amber',
    title: 'CI/CD', image: '/img/cards/infra-cicd.jpg',
    desc: 'Self-hosted Gitea with Actions runners. Push to main builds an ARM64 image with docker buildx, imports it on each node with k3s ctr, and deploys.',
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
    title: 'Prometheus', image: '/img/cards/obs-prometheus.jpg',
    desc: 'Scrapes node, container, and application metrics across all seven nodes, including Jetson GPU load from a small custom /metrics agent.',
  },
  {
    icon: 'mdi:text-box-search-outline', color: 'purple',
    title: 'Loki', image: '/img/cards/obs-loki.jpg',
    desc: 'Log aggregation for all container workloads. Correlation IDs thread through API, worker, and AI service logs. Queried directly from Grafana.',
  },
  {
    icon: 'mdi:view-dashboard-outline', color: 'amber',
    title: 'Grafana', image: '/img/cards/obs-grafana.jpg',
    desc: 'Unified dashboard layer over Prometheus metrics and Loki logs. Custom boards for inference latency, queue throughput, and storage pressure.',
  },
  {
    icon: 'mdi:bell-alert-outline', color: 'emerald',
    title: 'Alertmanager', image: '/img/cards/obs-alertmanager.jpg',
    desc: 'Routes alerts from Prometheus rules. Notifies on sustained error rates, queue stalls, node resource pressure, and service health failures.',
  },
]

const kingdomTools = {
  features: [
    {
      icon: 'mdi:view-dashboard-variant', color: 'sky',
      title: 'Cluster Management', image: '/img/cards/kt-cluster-management.jpg',
      desc: 'View all nodes, pods, deployments, and services across every namespace. Restart or scale deployments and view pod logs in-browser.',
    },
    {
      icon: 'mdi:database-cog', color: 'emerald',
      title: 'Data Layer Management', image: '/img/cards/kt-data-layer.jpg',
      desc: 'PostgreSQL databases, MinIO buckets, Redis slots, and Weaviate collections — create, browse, and delete from one interface.',
    },
    {
      icon: 'mdi:clipboard-list', color: 'purple',
      title: 'Service Catalog', image: '/img/cards/kt-service-catalog.jpg',
      desc: 'Every service is registered with a declarative spec defining its database, bucket, Redis slot, Weaviate collection, and deployment config.',
    },
    {
      icon: 'mdi:rocket-launch', color: 'amber',
      title: 'One-Click Provisioning', image: '/img/cards/kt-provisioning.jpg',
      desc: '5 service templates (web-app, ai-agent, scraper, api-service, worker). Pick a template, hit provision — isolated resources created across all four data layers.',
    },
    {
      icon: 'mdi:shield-search', color: 'rose',
      title: 'Audit & Drift Detection', image: '/img/cards/kt-audit-drift.jpg',
      desc: 'Cross-references every resource against the catalog. Flags orphans and missing resources. Reconcile button fixes drift instantly.',
    },
    {
      icon: 'mdi:chart-box', color: 'sky',
      title: 'Observability Dashboard', image: '/img/cards/kt-observability-dashboard.jpg',
      desc: 'Stat cards for nodes, pods, deployments, databases, buckets, Redis slots, collections, and catalog count. Alerts panel for unhealthy pods.',
    },
  ],
  stack: ['Python', 'FastAPI', 'K8s API', 'PostgreSQL', 'MinIO', 'Redis', 'Weaviate', 'Prometheus', 'Loki'],
}

const stack = [
  'Kubernetes (k3s)', 'Raspberry Pi', 'NVIDIA Jetson Orin Nano Super', 'ARM64',
  'CUDA', 'Docker', 'Flannel CNI', 'Cloudflare Tunnel',
  'Ingress NGINX', 'cert-manager', 'MinIO', 'PostgreSQL + AGE',
  'Weaviate', 'Gitea', 'Actions Runners', 'Prometheus',
  'Loki', 'Grafana', 'Alertmanager', 'Kingdom Tools',
]

const faqs = [
  {
    question: 'What does your infrastructure look like?',
    answer: 'A 7-node self-hosted k3s Kubernetes cluster: 4 Raspberry Pi ARM64 nodes (one control plane, three workers) for general workloads and 3 NVIDIA Jetson Orin Nano Super 8GB nodes for GPU-accelerated AI, plus a separate RTX 3090 workstation for embeddings and training. It runs databases, APIs, media processing, CI/CD, and local LLM inference as a single unified deployment target.'
  },
  {
    question: 'What services do you self-host?',
    answer: 'PostgreSQL, Redis, MinIO object storage, Weaviate, Gitea, AI inference workloads (Llama 3.2), and custom applications including VerseHub.'
  },
  {
    question: 'How do you handle AI workloads on the cluster?',
    answer: 'AI runs on 3 NVIDIA Jetson Orin Nano Super 8GB nodes, each with one role: gpu-worker-3 keeps llama3.2:3b pinned in Ollama (~21 tok/s), gpu-worker-2 runs Kokoro TTS and Whisper STT, and gpu-worker-1 runs Stable Diffusion plus a shelf of small models, one at a time. The sentence embedder runs on the RTX 3090 workstation.'
  },
  {
    question: 'How is your storage architecture designed?',
    answer: 'MinIO provides S3-compatible object storage for model weights, media assets, and user uploads. PostgreSQL handles structured data with persistent volumes. Redis is in-memory only — no persistent storage for session or cache data.'
  },
  {
    question: 'How do you manage deployments?',
    answer: 'Gitea Actions runners trigger on push to main. Pipelines build ARM64 images with docker buildx, import them into each node with k3s ctr (imagePullPolicy: Never), and apply the Kubernetes manifests.'
  },
  {
    question: 'How do you monitor the cluster?',
    answer: 'Prometheus scrapes metrics from all nodes and pods. Loki aggregates container logs with correlation IDs across API, worker, and AI services. Grafana provides unified dashboards over both. Promtail runs as a DaemonSet to ship logs, and a small custom agent exposes Jetson GPU load.'
  },
  {
    question: 'Do you use cloud providers?',
    answer: 'Minimally. The cluster is self-hosted. Cloud is used only where it makes sense operationally — not as the primary runtime for workloads that can run locally.'
  },
  {
    question: 'What makes this architecture unique?',
    answer: 'It combines two distinct hardware tiers — ARM64 general compute (Raspberry Pi) and CUDA GPU nodes (Jetson Orin Nano Super) — under a single k3s control plane. Self-hosted AI inference, observability (Prometheus + Loki + Grafana), CI/CD (Gitea), and distributed storage (MinIO + Weaviate + PostgreSQL) all run on-cluster without cloud dependency.'
  },
  {
    question: 'What is Kingdom Tools?',
    answer: 'Kingdom Tools is an internal service control plane that manages the full lifecycle of microservices on the cluster. It combines a service catalog, one-click resource provisioning across PostgreSQL, MinIO, Redis, and Weaviate, automated drift detection that flags orphaned or missing resources, and a reconcile engine that fixes infrastructure drift in one pass. It also runs the AI side of the lab: managing models on the three Jetsons, benchmarks, a LoRA training lab on the 3090, sandboxes exposed as MCP servers, knowledge bases, a Robot Lab and a hands-on AI course. It runs as a Python FastAPI pod in the kingdom-tools namespace.'
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
          Designing and operating a 7-node self-hosted K3s cluster — 4× Raspberry Pi for the control plane and general workloads
          and 3× NVIDIA Jetson Orin Nano Super 8GB for GPU-accelerated AI — with distributed storage,
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
      <section class="relative isolate overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 mb-10">
        <HeroBackdrop lazy src="/img/sections/infra-layers.jpg" side="full" />
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-5">Infrastructure Layers</h2>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="layer in layers"
            :key="layer.title"
            class="group overflow-hidden rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60 flex flex-col gap-3
                   hover:border-sky-500/40 transition-all duration-200"
          >
              <div class="relative -mx-5 -mt-5 mb-1 aspect-[2/1] overflow-hidden border-b border-slate-200 dark:border-slate-800">
                <img :src="layer.image" alt="" width="600" height="315" loading="lazy" decoding="async"
                     class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <div data-icon-overlay class="absolute top-3 left-3 z-10 rounded-lg bg-white/90 dark:bg-slate-950/75 backdrop-blur-sm shadow-sm">
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
                </div>
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
      <section class="relative isolate overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 mb-10">
        <HeroBackdrop lazy src="/img/sections/infra-observability.jpg" side="full" />
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-5">Observability Stack</h2>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="obs in observability"
            :key="obs.title"
            class="group overflow-hidden rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60"
          >
              <div class="relative -mx-5 -mt-5 mb-1 aspect-[2/1] overflow-hidden border-b border-slate-200 dark:border-slate-800">
                <img :src="obs.image" alt="" width="600" height="315" loading="lazy" decoding="async"
                     class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <div data-icon-overlay class="absolute top-3 left-3 z-10 rounded-lg bg-white/90 dark:bg-slate-950/75 backdrop-blur-sm shadow-sm">
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
                </div>
              </div>
            <div class="flex items-center gap-3 mb-3">
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white">{{ obs.title }}</h3>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ obs.desc }}</p>
          </div>
        </div>
      </section>

      <!-- KINGDOM TOOLS -->
      <section class="relative isolate overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 mb-10">
        <HeroBackdrop lazy src="/img/sections/infra-kingdom.jpg" side="full" />
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
            class="group overflow-hidden rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60 flex flex-col gap-3"
          >
              <div class="relative -mx-5 -mt-5 mb-1 aspect-[2/1] overflow-hidden border-b border-slate-200 dark:border-slate-800">
                <img :src="feat.image" alt="" width="600" height="315" loading="lazy" decoding="async"
                     class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <div data-icon-overlay class="absolute top-3 left-3 z-10 rounded-lg bg-white/90 dark:bg-slate-950/75 backdrop-blur-sm shadow-sm">
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
                </div>
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

      <!-- START HERE -->
      <section class="relative isolate overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 mb-10">
        <HeroBackdrop lazy src="/img/sections/infra-start.jpg" side="full" />
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">Start Here: Key Infrastructure Engineering Articles</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-3xl leading-relaxed">The posts that explain how the cluster was built, wired for CI/CD and observability, and recovered when things broke.</p>
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
          to="/categories/infrastructure-engineering"
          class="relative isolate overflow-hidden flex items-center justify-between gap-6 rounded-2xl p-6
                 border border-sky-500/20 bg-sky-500/5
                 hover:border-sky-500/40 hover:bg-sky-500/10
                 transition-all duration-200 group"
        >
          <HeroBackdrop lazy src="/img/categories/infrastructure-engineering.jpg" />
          <div>
            <p class="text-xs font-medium text-sky-500 uppercase tracking-wider mb-1">Knowledge Base</p>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors">
              Explore the Infrastructure Engineering Articles
            </h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              47 articles covering K3s, Raspberry Pi clusters, Gitea CI/CD, networking, storage, and self-hosted infrastructure.
            </p>
          </div>
          <Icon name="mdi:arrow-right" class="flex-shrink-0 text-2xl text-sky-500 group-hover:translate-x-1 transition-transform duration-200" />
        </NuxtLink>
      </section>

    </div>
  </PatternSection>
</template>
