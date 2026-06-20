<script setup lang="ts">
// ArchitectureDiagram is registered globally via Nuxt auto-imports
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'
useSeoMeta({
  title: 'Private AI Cloud — Donavan Jones | System Architecture',
  description: 'How I designed and operate a private AI cloud: 8-node ARM64 Kubernetes cluster running LLM inference, RAG pipelines, Prometheus, Loki, Grafana monitoring, Gitea CI/CD, and self-hosted storage.',
  ogTitle: 'Private AI Cloud — Donavan Jones | System Architecture',
  ogDescription: 'Architecture deep-dive: 8-node ARM64 Kubernetes cluster with LLM inference, RAG pipelines, Prometheus, Loki, Grafana, Gitea CI/CD, MinIO, and Weaviate vector search.',
  ogType: 'website',
  ogImage: `${_SITE}/img/logo.png`,
  ogUrl: `${_SITE}/system-overview`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Private AI Cloud — Donavan Jones',
  twitterDescription: '8-node ARM64 Kubernetes cluster: LLM inference, RAG pipelines, Grafana, Gitea CI/CD, MinIO, and Weaviate — all self-hosted.',
  canonical: `${_SITE}/system-overview`,
})
</script>

<template>
  <PatternSection>

    <!-- ── HERO ─────────────────────────────────────────────────────── -->
    <SystemOverview />

    <!-- ── CORE SYSTEMS ──────────────────────────────────────────────── -->
    <section class="relative w-full bg-slate-50 dark:bg-slate-950 py-16">
      <div class="max-w-7xl mx-auto px-6">

        <div class="text-center mb-10">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4
                   bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium"
          >
            <Icon name="mdi:layers-triple" class="text-sm" />
            System Architecture
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Core Systems
          </h2>
          <p class="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm">
            A self-hosted distributed platform combining Kubernetes, AI inference,
            data systems, storage, and automation on ARM64 infrastructure.
          </p>
        </div>

        <!-- Primary 3-col -->
        <div class="grid md:grid-cols-3 gap-5 mb-5">

          <div
            class="rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60 hover:border-purple-500/40
                   transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/5"
          >
            <div
              class="w-11 h-11 rounded-lg flex items-center justify-center mb-4
                     bg-purple-500/10 border border-purple-500/20"
            >
              <Icon name="mdi:brain" class="text-purple-400 text-2xl" />
            </div>
            <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-2">AI Systems</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              LLM inference, embeddings, RAG pipelines, and agent workflows running on-cluster.
            </p>
            <div class="mt-4 flex flex-wrap gap-1.5">
              <span v-for="t in ['Llama 3.2', 'Weaviate', 'RAG', 'Embeddings']" :key="t"
                class="text-[11px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {{ t }}
              </span>
            </div>
          </div>

          <div
            class="rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60 hover:border-emerald-500/40
                   transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/5"
          >
            <div
              class="w-11 h-11 rounded-lg flex items-center justify-center mb-4
                     bg-emerald-500/10 border border-emerald-500/20"
            >
              <Icon name="mdi:database" class="text-emerald-400 text-2xl" />
            </div>
            <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-2">Data Layer</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              PostgreSQL, Redis, Weaviate vector search, Apache AGE graph engine, and search indexing.
            </p>
            <div class="mt-4 flex flex-wrap gap-1.5">
              <span v-for="t in ['PostgreSQL', 'Redis', 'Weaviate', 'Apache AGE']" :key="t"
                class="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {{ t }}
              </span>
            </div>
          </div>

          <div
            class="rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60 hover:border-amber-500/40
                   transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/5"
          >
            <div
              class="w-11 h-11 rounded-lg flex items-center justify-center mb-4
                     bg-amber-500/10 border border-amber-500/20"
            >
              <Icon name="mdi:harddisk" class="text-amber-400 text-2xl" />
            </div>
            <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-2">Storage</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              MinIO S3-compatible object storage for datasets, model weights, and media assets.
            </p>
            <div class="mt-4 flex flex-wrap gap-1.5">
              <span v-for="t in ['MinIO', 'S3-Compatible', 'Pre-signed URLs']" :key="t"
                class="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {{ t }}
              </span>
            </div>
          </div>

        </div>

        <!-- Infrastructure 4-col -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">

          <div
            v-for="node in [
              { icon: 'mdi:raspberry-pi',   color: 'sky',    label: 'ARM64 Cluster',  sub: '8 Raspberry Pi 5 nodes running k3s' },
              { icon: 'mdi:kubernetes',      color: 'purple', label: 'Orchestration',  sub: 'Scheduling, networking, autoscaling' },
              { icon: 'mdi:source-branch',   color: 'emerald',label: 'CI/CD',          sub: 'Automated builds via Gitea runners' },
              { icon: 'mdi:chart-line',      color: 'rose',   label: 'Observability',  sub: 'Metrics, logs, dashboards, alerting' },
            ]"
            :key="node.label"
            class="rounded-2xl p-5 border transition-all duration-200"
            :class="{
              'border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60': true,
            }"
          >
            <Icon :name="node.icon" class="text-3xl mb-3"
              :class="{
                'text-sky-400':    node.color === 'sky',
                'text-purple-400': node.color === 'purple',
                'text-emerald-400':node.color === 'emerald',
                'text-rose-400':   node.color === 'rose',
              }"
            />
            <div class="text-sm font-semibold text-slate-900 dark:text-white">{{ node.label }}</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{{ node.sub }}</div>
          </div>

        </div>

      </div>
    </section>

    <!-- ── ARCHITECTURE DIAGRAM ──────────────────────────────────────── -->
    <section class="w-full bg-white dark:bg-slate-900/30 py-16 border-t border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">

        <div class="text-center mb-10">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4
                   bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium"
          >
            <Icon name="mdi:sitemap" class="text-sm" />
            Architecture Visualization
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            System Architecture Diagram
          </h2>
          <p class="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm">
            Visual representation of compute, storage, AI, and backend layers across the cluster.
          </p>
        </div>

        <div class="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <ArchitectureDiagram />
        </div>

      </div>
    </section>

    <!-- ── NARRATIVE ──────────────────────────────────────────────────── -->
    <section class="w-full bg-white dark:bg-slate-900/30 py-16 border-t border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">

        <div class="grid lg:grid-cols-[1fr_420px] gap-12 items-center">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
              <Icon name="mdi:account-hard-hat" class="text-sm" />
              How I built it
            </div>
            <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-5">
              Most engineers talk about Kubernetes.<br />
              <span class="text-sky-500">I run one.</span>
            </h2>
            <div class="space-y-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              <p>
                This isn't a cloud-managed cluster where someone else handles the control plane.
                Every node was physically racked, flashed, and joined by hand. Every service was
                deployed, broken, debugged, and redeployed. I designed the network topology,
                wrote the CI/CD pipelines, and wired up the monitoring from scratch.
              </p>
              <p>
                The platform runs production AI workloads — LLM inference with Llama 3.2, RAG
                pipelines backed by Weaviate, async job queues, and multi-model routing. The cluster
                is heterogeneous by design: 8 Raspberry Pi 5 nodes handle general services, while
                4 NVIDIA Jetson Orin Nano Supers run GPU-accelerated inference with CUDA. No vendor
                lock-in. No managed services. Just documented decisions and real operational experience.
              </p>
              <p>
                This page is a technical walkthrough of the architecture, not a demo. If you want
                to know how it actually works, everything is documented below.
              </p>
            </div>
          </div>

          <!-- Spec card -->
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden">
            <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <div class="flex gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
              </div>
              <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">cluster.specs</span>
            </div>
            <div class="p-5 space-y-4">
              <div v-for="spec in [
                { label: 'General Nodes', value: '8× Raspberry Pi 5 (ARM64)', color: 'sky' },
                { label: 'GPU Nodes', value: '4× Jetson Orin Nano Super', color: 'green' },
                { label: 'Total Nodes', value: '12 (1 control plane + 11 workers)', color: 'sky' },
                { label: 'Orchestration', value: 'k3s — Lightweight Kubernetes', color: 'purple' },
                { label: 'Networking', value: 'Flannel CNI · Cloudflare Tunnel', color: 'purple' },
                { label: 'AI Inference', value: 'Llama 3.2 · CUDA · Weaviate · RAG', color: 'green' },
                { label: 'Storage', value: 'MinIO S3 · PostgreSQL · Redis', color: 'emerald' },
                { label: 'Observability', value: 'Prometheus · Loki · Grafana', color: 'rose' },
                { label: 'CI/CD', value: 'Gitea · Actions Runners · Auto Deploy', color: 'amber' },
              ]" :key="spec.label" class="flex items-start justify-between gap-4 text-sm">
                <span class="text-slate-500 dark:text-slate-400 shrink-0">{{ spec.label }}</span>
                <span class="text-right font-medium text-slate-900 dark:text-white text-xs leading-relaxed">{{ spec.value }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ── CLUSTER TOPOLOGY ─────────────────────────────────────────── -->
    <section class="w-full bg-slate-50 dark:bg-slate-950 py-16 border-t border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">

        <div class="mb-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium">
            <Icon name="mdi:lan" class="text-sm" />
            Network &amp; Cluster Topology
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Cluster Node Layout</h2>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            12-node heterogeneous cluster: 8 Raspberry Pi 5 nodes handle general workloads, and
            4 NVIDIA Jetson Orin Nano Supers run GPU-accelerated AI inference. All nodes communicate
            over a private LAN; external traffic enters through a Cloudflare Tunnel.
          </p>
        </div>

        <!-- Network flow -->
        <div class="mb-8 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 overflow-hidden">
          <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <div class="flex gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
            </div>
            <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">network.topology</span>
          </div>
          <div class="px-5 py-5">
            <div class="flex flex-wrap items-center gap-2 text-sm">
              <div v-for="(step, i) in [
                { icon: 'mdi:web', label: 'Internet', color: 'text-slate-400' },
                { icon: 'mdi:shield-check', label: 'Cloudflare Tunnel', color: 'text-orange-400' },
                { icon: 'mdi:router-network', label: 'Ingress Controller', color: 'text-sky-400' },
                { icon: 'mdi:kubernetes', label: 'k3s Control Plane', color: 'text-purple-400' },
                { icon: 'mdi:server', label: '7 Worker Nodes', color: 'text-emerald-400' },
                { icon: 'mdi:brain', label: 'AI / Data Services', color: 'text-rose-400' },
              ]" :key="step.label" class="flex items-center gap-2">
                <div class="flex flex-col items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 min-w-[80px] text-center">
                  <Icon :name="step.icon" class="text-lg" :class="step.color" />
                  <span class="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{{ step.label }}</span>
                </div>
                <Icon v-if="i < 5" name="mdi:arrow-right" class="text-slate-300 dark:text-slate-700 hidden sm:block" />
              </div>
            </div>
          </div>
        </div>

        <!-- ── Raspberry Pi 5 tier ── -->
        <p class="text-[10px] uppercase tracking-widest text-sky-500 font-semibold mb-3">
          Raspberry Pi 5 — General Workers
        </p>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <!-- Control plane -->
          <div class="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-5">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Icon name="mdi:kubernetes" class="text-purple-400 text-sm" />
              </div>
              <div>
                <p class="text-xs font-semibold text-slate-900 dark:text-white">Control Plane</p>
                <p class="text-[10px] text-purple-400">node-00</p>
              </div>
            </div>
            <div class="space-y-1.5 text-[11px]">
              <div class="flex justify-between gap-2">
                <span class="text-slate-500 dark:text-slate-400 shrink-0">Role</span>
                <span class="text-slate-700 dark:text-slate-300 font-medium text-right">API Server · Scheduler · etcd</span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-slate-500 dark:text-slate-400 shrink-0">Hardware</span>
                <span class="text-slate-700 dark:text-slate-300 font-medium text-right">Raspberry Pi 5</span>
              </div>
              <div class="flex justify-between gap-2">
                <span class="text-slate-500 dark:text-slate-400 shrink-0">Arch</span>
                <span class="text-slate-700 dark:text-slate-300 font-medium text-right">ARM64</span>
              </div>
            </div>
          </div>

          <!-- Pi worker nodes -->
          <div v-for="n in [
            { id: 'node-01', workload: 'FastAPI · Nitro · App Services' },
            { id: 'node-02', workload: 'PostgreSQL · Redis · Apache AGE' },
            { id: 'node-03', workload: 'MinIO Object Storage' },
            { id: 'node-04', workload: 'Weaviate · Vector Search' },
            { id: 'node-05', workload: 'Gitea · Actions Runners' },
            { id: 'node-06', workload: 'Prometheus · Loki · Grafana · Alerts' },
            { id: 'node-07', workload: 'General Worker · Overflow' },
          ]" :key="n.id"
            class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-5"
          >
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                <Icon name="mdi:raspberry-pi" class="text-sky-400 text-sm" />
              </div>
              <div>
                <p class="text-xs font-semibold text-slate-900 dark:text-white">Worker Node</p>
                <p class="text-[10px] text-sky-400">{{ n.id }}</p>
              </div>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{{ n.workload }}</p>
          </div>

        </div>

        <!-- ── Jetson Orin Nano Super tier ── -->
        <div class="flex items-center gap-3 mb-3">
          <p class="text-[10px] uppercase tracking-widest text-green-500 font-semibold">
            NVIDIA Jetson Orin Nano Super — GPU / AI Workers
          </p>
          <span class="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 font-medium">
            <Icon name="mdi:gpu" class="text-xs" />
            CUDA · 1024 cores
          </span>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="n in [
            { id: 'jetson-01', workload: 'Llama 3.2 · LLM Inference' },
            { id: 'jetson-02', workload: 'Embeddings · Model Serving' },
            { id: 'jetson-03', workload: 'RAG Pipeline Worker · AI Tasks' },
            { id: 'jetson-04', workload: 'Multi-model Routing · Overflow' },
          ]" :key="n.id"
            class="rounded-2xl border border-green-500/30 bg-green-500/5 p-5"
          >
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Icon name="mdi:chip" class="text-green-400 text-sm" />
              </div>
              <div>
                <p class="text-xs font-semibold text-slate-900 dark:text-white">Jetson Orin Nano Super</p>
                <p class="text-[10px] text-green-400">{{ n.id }}</p>
              </div>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">{{ n.workload }}</p>
            <div class="flex flex-wrap gap-1">
              <span class="text-[9px] px-1.5 py-0.5 rounded border border-green-500/20 bg-green-500/10 text-green-400">ARM64</span>
              <span class="text-[9px] px-1.5 py-0.5 rounded border border-green-500/20 bg-green-500/10 text-green-400">GPU</span>
              <span class="text-[9px] px-1.5 py-0.5 rounded border border-green-500/20 bg-green-500/10 text-green-400">8GB LPDDR5</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── MONITORING STACK ─────────────────────────────────────────── -->
    <section class="w-full bg-white dark:bg-slate-900/30 py-16 border-t border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">

        <div class="mb-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            <Icon name="mdi:chart-line" class="text-sm" />
            Observability
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Monitoring Stack</h2>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Full observability across the cluster: Prometheus for metrics, Loki for log aggregation,
            Grafana for unified dashboards, and Alertmanager for alert routing. Every node, pod,
            and service is instrumented.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div v-for="tool in [
            {
              icon: 'mdi:chart-scatter-plot', color: 'rose',
              name: 'Prometheus',
              role: 'Metrics collection & time-series storage',
              details: ['Scrape interval: 15s', 'Node exporter on every Pi', 'kube-state-metrics', 'Custom service metrics'],
            },
            {
              icon: 'mdi:text-box-search-outline', color: 'sky',
              name: 'Loki',
              role: 'Log aggregation & querying',
              details: ['Cluster-wide log collection', 'Promtail agent on each node', 'LogQL query language', 'Grafana log explorer'],
            },
            {
              icon: 'mdi:view-dashboard', color: 'amber',
              name: 'Grafana',
              role: 'Unified dashboards & visualization',
              details: ['Cluster resource dashboards', 'AI inference latency panels', 'Log + metrics correlation', 'Storage utilization tracking'],
            },
            {
              icon: 'mdi:bell-ring-outline', color: 'emerald',
              name: 'Alertmanager',
              role: 'Alert routing & notifications',
              details: ['Node memory thresholds', 'Pod crash-loop detection', 'Service availability alerts', 'Disk pressure warnings'],
            },
          ]" :key="tool.name"
            class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden"
          >
            <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg flex items-center justify-center border"
                :class="{
                  'bg-rose-500/10 border-rose-500/20': tool.color === 'rose',
                  'bg-sky-500/10 border-sky-500/20': tool.color === 'sky',
                  'bg-amber-500/10 border-amber-500/20': tool.color === 'amber',
                  'bg-emerald-500/10 border-emerald-500/20': tool.color === 'emerald',
                }"
              >
                <Icon :name="tool.icon" class="text-sm"
                  :class="{
                    'text-rose-400': tool.color === 'rose',
                    'text-sky-400': tool.color === 'sky',
                    'text-amber-400': tool.color === 'amber',
                    'text-emerald-400': tool.color === 'emerald',
                  }"
                />
              </div>
              <span class="text-xs font-semibold text-slate-900 dark:text-white">{{ tool.name }}</span>
            </div>
            <div class="p-5">
              <p class="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{{ tool.role }}</p>
              <ul class="space-y-1.5">
                <li v-for="d in tool.details" :key="d" class="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <Icon name="mdi:check" class="text-emerald-400 text-sm flex-shrink-0" />
                  {{ d }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Screenshot: Grafana -->
        <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
          <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="flex gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-red-400/70"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-yellow-400/70"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-green-400/70"></span>
              </div>
              <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">grafana — Cluster Overview</span>
            </div>
            <span class="text-[10px] text-slate-400 uppercase tracking-widest">Live Dashboard</span>
          </div>
          <div class="relative bg-slate-900">
            <NuxtImg src="/img/screenshots/grafana-dashboard.PNG" alt="Grafana Dashboard Screenshot" class="w-full object-cover" />
          </div>
        </div>

      </div>
    </section>

    <!-- ── CI/CD PIPELINE ───────────────────────────────────────────── -->
    <section class="w-full bg-slate-50 dark:bg-slate-950 py-16 border-t border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">

        <div class="mb-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <Icon name="mdi:source-branch" class="text-sm" />
            Delivery
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">CI/CD Pipeline</h2>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Self-hosted Gitea runs the version control and pipeline orchestration. On push to main, an
            Actions runner inside the cluster picks up the job, builds the container image, pushes to
            the private registry, and rolls out the new deployment — zero manual steps.
          </p>
        </div>

        <!-- Pipeline stages -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          <div v-for="(stage, i) in [
            { icon: 'mdi:source-commit', color: 'sky', step: '01', title: 'Code Push', body: 'Push to main branch in self-hosted Gitea' },
            { icon: 'mdi:play-circle', color: 'emerald', step: '02', title: 'Pipeline Triggered', body: 'Actions runner picks up the workflow job' },
            { icon: 'mdi:docker', color: 'sky', step: '03', title: 'Build Image', body: 'Multi-stage Dockerfile builds ARM64 container' },
            { icon: 'mdi:package-variant', color: 'purple', step: '04', title: 'Push Registry', body: 'Image pushed to private cluster registry' },
            { icon: 'mdi:rocket-launch', color: 'amber', step: '05', title: 'Rolling Deploy', body: 'Kubernetes rolls out new pods, zero downtime' },
          ]" :key="stage.step"
            class="relative rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-5"
          >
            <div class="flex items-center gap-2 mb-3">
              <span class="text-[10px] font-bold text-slate-400 dark:text-slate-600 tabular-nums">{{ stage.step }}</span>
              <div class="w-7 h-7 rounded-lg flex items-center justify-center border"
                :class="{
                  'bg-sky-500/10 border-sky-500/20': stage.color === 'sky',
                  'bg-emerald-500/10 border-emerald-500/20': stage.color === 'emerald',
                  'bg-purple-500/10 border-purple-500/20': stage.color === 'purple',
                  'bg-amber-500/10 border-amber-500/20': stage.color === 'amber',
                }"
              >
                <Icon :name="stage.icon" class="text-sm"
                  :class="{
                    'text-sky-400': stage.color === 'sky',
                    'text-emerald-400': stage.color === 'emerald',
                    'text-purple-400': stage.color === 'purple',
                    'text-amber-400': stage.color === 'amber',
                  }"
                />
              </div>
              <Icon v-if="i < 4" name="mdi:arrow-right" class="text-slate-300 dark:text-slate-700 text-sm absolute -right-2 top-1/2 -translate-y-1/2 hidden lg:block z-10" />
            </div>
            <p class="text-xs font-semibold text-slate-900 dark:text-white mb-1">{{ stage.title }}</p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{{ stage.body }}</p>
          </div>
        </div>

        <!-- Screenshot: Gitea -->
        <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
          <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <div class="flex gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-red-400/70"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-yellow-400/70"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-green-400/70"></span>
            </div>
            <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">gitea — Actions Pipeline</span>
          </div>
          <div class="relative bg-slate-900 min-h-[220px] flex items-center justify-center">
            <div class="text-center py-14 px-6">
              <Icon name="mdi:monitor-screenshot" class="text-slate-600 text-5xl mb-3" />
              <p class="text-sm font-medium text-slate-400">Gitea Actions Pipeline Screenshot</p>
              <p class="text-xs text-slate-600 mt-1">Add screenshot to <code class="text-sky-500">public/img/screenshots/gitea-pipeline.png</code></p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ── STORAGE ARCHITECTURE ─────────────────────────────────────── -->
    <section class="w-full bg-white dark:bg-slate-900/30 py-16 border-t border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">

        <div class="mb-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
            <Icon name="mdi:database" class="text-sm" />
            Data &amp; Storage
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Storage Architecture</h2>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Four separate storage layers, each purpose-built. No single data system handles everything —
            the right store for the right access pattern.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 gap-5">
          <div v-for="store in [
            {
              icon: 'mdi:harddisk', color: 'amber', name: 'MinIO', role: 'Object Storage',
              desc: 'S3-compatible object storage for model weights, media assets, document uploads, and AI pipeline artifacts. Pre-signed URLs for secure client access.',
              tags: ['S3-Compatible', 'Pre-signed URLs', 'Multi-bucket', 'ARM64 Native'],
              screenshot: 'minio-dashboard.png',
            },
            {
              icon: 'mdi:database', color: 'emerald', name: 'PostgreSQL + Apache AGE', role: 'Relational + Graph',
              desc: 'Primary application data store with Prisma ORM. Apache AGE extension adds graph traversal for relationship-heavy workloads — no separate graph database needed.',
              tags: ['Prisma ORM', 'Apache AGE', 'Graph Queries', 'JSONB'],
              screenshot: null,
            },
            {
              icon: 'mdi:lightning-bolt', color: 'rose', name: 'Redis', role: 'Cache + Queue',
              desc: 'Session caching, API rate limiting, and BullMQ job queue backing store. Handles high-frequency reads that would otherwise hit PostgreSQL on every request.',
              tags: ['BullMQ', 'Session Cache', 'Rate Limiting', 'Pub/Sub'],
              screenshot: null,
            },
            {
              icon: 'mdi:vector-arrange-above', color: 'purple', name: 'Weaviate', role: 'Vector Database',
              desc: 'Stores and retrieves dense vector embeddings for RAG pipelines. Hybrid search combines vector similarity with BM25 keyword search for best retrieval quality.',
              tags: ['Vector Search', 'Hybrid BM25', 'Embeddings', 'Schema-based'],
              screenshot: 'weaviate-dashboard.png',
            },
          ]" :key="store.name"
            class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden"
          >
            <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div class="w-7 h-7 rounded-lg flex items-center justify-center border"
                :class="{
                  'bg-amber-500/10 border-amber-500/20': store.color === 'amber',
                  'bg-emerald-500/10 border-emerald-500/20': store.color === 'emerald',
                  'bg-rose-500/10 border-rose-500/20': store.color === 'rose',
                  'bg-purple-500/10 border-purple-500/20': store.color === 'purple',
                }"
              >
                <Icon :name="store.icon" class="text-sm"
                  :class="{
                    'text-amber-400': store.color === 'amber',
                    'text-emerald-400': store.color === 'emerald',
                    'text-rose-400': store.color === 'rose',
                    'text-purple-400': store.color === 'purple',
                  }"
                />
              </div>
              <div>
                <span class="text-xs font-semibold text-slate-900 dark:text-white">{{ store.name }}</span>
                <span class="ml-2 text-[10px] text-slate-400">{{ store.role }}</span>
              </div>
            </div>
            <div class="p-5">
              <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{{ store.desc }}</p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="tag in store.tags" :key="tag"
                  class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/50">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ── SCREENSHOTS GALLERY ──────────────────────────────────────── -->
    <section class="w-full bg-slate-50 dark:bg-slate-950 py-16 border-t border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">

        <div class="mb-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium">
            <Icon name="mdi:camera" class="text-sm" />
            System Screenshots
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Live Platform Views</h2>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Actual dashboards and interfaces running on the cluster.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="shot in [
            { tool: 'Grafana', desc: 'Cluster resource dashboard', file: 'grafana-dashboard.png', color: 'amber', icon: 'mdi:view-dashboard' },
            { tool: 'Prometheus', desc: 'Metrics explorer & query UI', file: 'prometheus-metrics.png', color: 'rose', icon: 'mdi:chart-scatter-plot' },
            { tool: 'Loki', desc: 'Log aggregation & LogQL explorer', file: 'loki-logs.png', color: 'sky', icon: 'mdi:text-box-search-outline' },
            { tool: 'Gitea Pipelines', desc: 'CI/CD Actions pipeline run', file: 'gitea-pipeline.png', color: 'emerald', icon: 'mdi:source-branch' },
            { tool: 'Kubernetes', desc: 'k3s dashboard / node view', file: 'kubernetes-dashboard.png', color: 'sky', icon: 'mdi:kubernetes' },
            { tool: 'MinIO', desc: 'Object storage bucket browser', file: 'minio-dashboard.png', color: 'amber', icon: 'mdi:harddisk' },
            { tool: 'Weaviate', desc: 'Vector database & schema view', file: 'weaviate-dashboard.png', color: 'purple', icon: 'mdi:vector-arrange-above' },
          ]" :key="shot.tool"
            class="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden bg-white dark:bg-slate-900/60"
          >
            <!-- Chrome header -->
            <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <div class="flex gap-1.5">
                <span class="w-2 h-2 rounded-full bg-red-400/70"></span>
                <span class="w-2 h-2 rounded-full bg-yellow-400/70"></span>
                <span class="w-2 h-2 rounded-full bg-green-400/70"></span>
              </div>
              <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">{{ shot.tool.toLowerCase().replace(/\s+/g, '-') }}</span>
            </div>

            <!-- Placeholder (replace div with img once screenshot exists) -->
            <div class="relative bg-slate-900 aspect-video flex items-center justify-center">
              <div class="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center border"
                  :class="{
                    'bg-amber-500/10 border-amber-500/20': shot.color === 'amber',
                    'bg-rose-500/10 border-rose-500/20': shot.color === 'rose',
                    'bg-emerald-500/10 border-emerald-500/20': shot.color === 'emerald',
                    'bg-sky-500/10 border-sky-500/20': shot.color === 'sky',
                    'bg-purple-500/10 border-purple-500/20': shot.color === 'purple',
                  }"
                >
                  <Icon :name="shot.icon" class="text-lg"
                    :class="{
                      'text-amber-400': shot.color === 'amber',
                      'text-rose-400': shot.color === 'rose',
                      'text-emerald-400': shot.color === 'emerald',
                      'text-sky-400': shot.color === 'sky',
                      'text-purple-400': shot.color === 'purple',
                    }"
                  />
                </div>
                <p class="text-xs font-medium text-slate-300">{{ shot.tool }}</p>
                <p class="text-[10px] text-slate-600">{{ shot.desc }}</p>
                <code class="text-[9px] text-slate-700 mt-1">public/img/screenshots/{{ shot.file }}</code>
              </div>
            </div>
            <!-- Once screenshot exists, replace the div above with:
              <img :src="`/img/screenshots/${shot.file}`" :alt="`${shot.tool} screenshot`" class="w-full h-full object-cover" />
            -->

            <!-- Caption -->
            <div class="px-4 py-3">
              <p class="text-xs font-medium text-slate-900 dark:text-white">{{ shot.tool }}</p>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">{{ shot.desc }}</p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ── SYSTEM CATEGORIES ─────────────────────────────────────────── -->
    <section class="w-full bg-slate-50 dark:bg-slate-950 py-16 border-t border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">

        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Explore by System
          </h2>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Each domain is independently documented with architecture, design decisions, and component details.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-5">

          <NuxtLink
            v-for="sys in [
              {
                to: '/systems/ai',
                icon: 'mdi:brain',
                color: 'purple',
                title: 'AI Systems',
                sub: 'RAG · Agents · Inference · Embeddings',
                desc: 'LLM inference pipeline, vector retrieval, semantic search, and agent orchestration on-cluster.',
                tags: ['Llama 3.2', 'Weaviate', 'RAG Pipeline', 'Embeddings'],
              },
              {
                to: '/systems/backend',
                icon: 'mdi:api',
                color: 'sky',
                title: 'Backend Systems',
                sub: 'APIs · Async · Services · Databases',
                desc: 'FastAPI services, Redis caching, PostgreSQL with Apache AGE graph extension, job queues.',
                tags: ['FastAPI', 'PostgreSQL', 'Redis', 'BullMQ'],
              },
              {
                to: '/systems/infrastructure',
                icon: 'mdi:kubernetes',
                color: 'emerald',
                title: 'Infrastructure',
                sub: 'Kubernetes · ARM64 · Homelab · CI/CD',
                desc: 'k3s cluster across 8 Raspberry Pi 5 nodes with Gitea CI/CD, Prometheus, and Grafana.',
                tags: ['k3s', 'Raspberry Pi 5', 'Gitea', 'Prometheus'],
              },
            ]"
            :key="sys.to"
            :to="sys.to"
            class="group flex flex-col rounded-2xl border transition-all duration-200
                   border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60
                   hover:shadow-lg"
            :class="{
              'hover:border-purple-500/40 hover:shadow-purple-500/5': sys.color === 'purple',
              'hover:border-sky-500/40 hover:shadow-sky-500/5':       sys.color === 'sky',
              'hover:border-emerald-500/40 hover:shadow-emerald-500/5': sys.color === 'emerald',
            }"
          >
            <div class="p-6 flex flex-col flex-1">

              <div
                class="w-11 h-11 rounded-lg flex items-center justify-center mb-4 border"
                :class="{
                  'bg-purple-500/10 border-purple-500/20': sys.color === 'purple',
                  'bg-sky-500/10 border-sky-500/20':       sys.color === 'sky',
                  'bg-emerald-500/10 border-emerald-500/20': sys.color === 'emerald',
                }"
              >
                <Icon :name="sys.icon" class="text-2xl"
                  :class="{
                    'text-purple-400': sys.color === 'purple',
                    'text-sky-400':    sys.color === 'sky',
                    'text-emerald-400':sys.color === 'emerald',
                  }"
                />
              </div>

              <div class="mb-3">
                <h3 class="text-base font-semibold text-slate-900 dark:text-white
                           group-hover:text-sky-400 transition-colors">
                  {{ sys.title }}
                </h3>
                <p class="text-xs font-medium mt-0.5"
                  :class="{
                    'text-purple-400': sys.color === 'purple',
                    'text-sky-400':    sys.color === 'sky',
                    'text-emerald-400':sys.color === 'emerald',
                  }"
                >
                  {{ sys.sub }}
                </p>
              </div>

              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                {{ sys.desc }}
              </p>

              <div class="mt-4 flex flex-wrap gap-1.5">
                <span
                  v-for="tag in sys.tags"
                  :key="tag"
                  class="text-[11px] px-2 py-0.5 rounded-md border
                         bg-slate-100 dark:bg-slate-800
                         text-slate-500 dark:text-slate-400
                         border-slate-200 dark:border-slate-700/50"
                >
                  {{ tag }}
                </span>
              </div>

            </div>

            <div class="px-6 pb-5 pt-0 border-t border-slate-100 dark:border-slate-800 mt-auto">
              <span class="inline-flex items-center gap-1 text-sm font-medium text-sky-500
                           group-hover:translate-x-1 transition-transform duration-200 pt-4">
                Explore system
                <Icon name="mdi:arrow-right" class="text-base" />
              </span>
            </div>

          </NuxtLink>

        </div>

      </div>
    </section>

  </PatternSection>
</template>
