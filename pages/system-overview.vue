<script setup lang="ts">
// ArchitectureDiagram is registered globally via Nuxt auto-imports
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'
useSeoMeta({ canonical: `${_SITE}/system-overview` })
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
