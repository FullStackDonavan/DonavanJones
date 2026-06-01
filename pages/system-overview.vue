<template>
  <PatternSection>
    <!-- SYSTEM HERO -->
    <SystemOverview />



<section
  class="relative w-full overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300"
>
  <!-- Background glow -->
  <div class="absolute inset-0 -z-10">
    <div
      class="absolute top-[-120px] left-1/2 -translate-x-1/2
             w-[500px] h-[500px] rounded-full blur-3xl opacity-30
             bg-blue-200 dark:bg-blue-900"
    />
    <div
      class="absolute bottom-[-120px] right-[-80px]
             w-[400px] h-[400px] rounded-full blur-3xl opacity-20
             bg-purple-200 dark:bg-purple-900"
    />
  </div>

  <div class="max-w-7xl mx-auto px-6 relative">

    <!-- HERO SUMMARY -->
    <div class="text-center mt-16 mb-12">
      <div
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full
               bg-sky-500/10 text-sky-400"
      >
        <Icon name="mdi:kubernetes" />
        Private Cloud AI Infrastructure
      </div>

      <h2 class="mt-4 text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
        System Overview
      </h2>

      <p class="mt-4 max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
        A self-hosted distributed platform combining Kubernetes, AI inference,
        data systems, storage, and automation on ARM64 infrastructure.
      </p>
    </div>

    <!-- CORE SERVICES -->
    <section class="py-12">
      <div class="grid lg:grid-cols-3 gap-6">

        <div class="glass-card">
          <Icon name="mdi:brain" class="text-purple-500 text-4xl" />
          <h3 class="mt-4 text-xl font-semibold">AI Systems</h3>
          <ul class="mt-4 space-y-2 text-sm">
            <li>LLM Inference</li>
            <li>Embeddings</li>
            <li>RAG Pipelines</li>
            <li>Agent Workflows</li>
            <li>Model Training</li>
          </ul>
        </div>

        <div class="glass-card">
          <Icon name="mdi:database" class="text-emerald-500 text-4xl" />
          <h3 class="mt-4 text-xl font-semibold">Data Layer</h3>
          <ul class="mt-4 space-y-2 text-sm">
            <li>PostgreSQL</li>
            <li>Redis</li>
            <li>Apache AGE</li>
            <li>Weaviate</li>
            <li>Search & Caching</li>
          </ul>
        </div>

        <div class="glass-card">
          <Icon name="mdi:harddisk" class="text-amber-500 text-4xl" />
          <h3 class="mt-4 text-xl font-semibold">Storage</h3>
          <ul class="mt-4 space-y-2 text-sm">
            <li>MinIO</li>
            <li>Model Artifacts</li>
            <li>Datasets</li>
            <li>Media Assets</li>
            <li>Backups</li>
          </ul>
        </div>

      </div>
    </section>



    <!-- INFRASTRUCTURE GRID -->
    <section class="py-12">
      <div class="grid lg:grid-cols-4 gap-6">

        <div class="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
          <Icon name="mdi:raspberry-pi" class="text-sky-500 text-4xl" />
          <h3 class="mt-4 font-semibold">ARM64 Cluster</h3>
          <p class="text-sm mt-2 text-gray-600 dark:text-gray-400">
            8 Raspberry Pi 5 nodes running k3s Kubernetes.
          </p>
        </div>

        <div class="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
          <Icon name="mdi:kubernetes" class="text-purple-500 text-4xl" />
          <h3 class="mt-4 font-semibold">Orchestration</h3>
          <p class="text-sm mt-2 text-gray-600 dark:text-gray-400">
            Scheduling, service discovery, scaling, networking.
          </p>
        </div>

        <div class="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
          <Icon name="mdi:source-branch" class="text-emerald-500 text-4xl" />
          <h3 class="mt-4 font-semibold">CI/CD</h3>
          <p class="text-sm mt-2 text-gray-600 dark:text-gray-400">
            Gitea + runners for automated deployments.
          </p>
        </div>

        <div class="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
          <Icon name="mdi:chart-line" class="text-amber-500 text-4xl" />
          <h3 class="mt-4 font-semibold">Observability</h3>
          <p class="text-sm mt-2 text-gray-600 dark:text-gray-400">
            Metrics, logs, dashboards, alerts.
          </p>
        </div>

      </div>
    </section>

    <!-- ARCHITECTURE DIAGRAM -->
    <section class="py-12">
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 text-sky-400">
          <Icon name="mdi:sitemap" />
          Architecture Visualization
        </div>

        <h2 class="mt-4 text-4xl font-bold text-gray-900 dark:text-white">
          System Architecture Diagram
        </h2>

        <p class="mt-4 max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
          Visual representation of services, compute, storage, and AI layers.
        </p>
      </div>

      <ArchitectureDiagram />
    </section>

    <!-- METRICS -->
    <!-- <section class="py-12">
      <div class="grid md:grid-cols-4 gap-4 text-center">

        <div class="metric-card">
          <div class="metric-value">8</div>
          <div class="metric-label">Pi Nodes</div>
        </div>

        <div class="metric-card">
          <div class="metric-value">64GB+</div>
          <div class="metric-label">Cluster RAM</div>
        </div>

        <div class="metric-card">
          <div class="metric-value">10+</div>
          <div class="metric-label">Core Services</div>
        </div>

        <div class="metric-card">
          <div class="metric-value">24/7</div>
          <div class="metric-label">Automation</div>
        </div>

      </div>
    </section> -->

    <!-- FOOTER -->
    <div class="my-12 text-center text-sm text-gray-500 dark:text-gray-400">
      A self-hosted distributed system combining Kubernetes, AI inference,
      and backend services running on a personal homelab infrastructure.
    </div>

  </div>
</section>

  </PatternSection>
</template>

<script>
import { ref } from "vue";
import Hero from "@/components/sections/HomePage/Hero.vue";
import ArchitectureDiagram from "@/components/ArchitectureDiagram.vue";

export default {
  components: {
    Hero,
    ArchitectureDiagram,
  },
};
</script>






