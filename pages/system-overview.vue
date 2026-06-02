<template>
  <PatternSection>
    <!-- SYSTEM HERO -->
    <SystemOverview />



<section
  class="relative w-full overflow-hidden
         bg-gradient-to-b from-white via-slate-50 to-slate-100
         dark:from-gray-950 dark:via-gray-950 dark:to-gray-900
         transition-colors duration-300"
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

    <!-- HERO -->
    <div class="text-center pt-20 pb-14">
      <div
        class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
               bg-sky-500/10 text-sky-600 dark:text-sky-400
               border border-sky-200/40 dark:border-sky-500/10"
      >
        <Icon name="mdi:kubernetes" />
        Private Cloud AI Infrastructure
      </div>

      <h2 class="mt-5 text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
        System Overview
      </h2>

      <p class="mt-4 max-w-3xl mx-auto text-slate-600 dark:text-slate-400">
        A self-hosted distributed platform combining Kubernetes, AI inference,
        data systems, storage, and automation on ARM64 infrastructure.
      </p>
    </div>

    <!-- CORE SYSTEM CARDS -->
    <section class="pb-16">
      <div class="grid md:grid-cols-3 gap-6">

        <div class="rounded-4xl p-6 transition
                    bg-white dark:bg-slate-900
                    border border-slate-200 dark:border-slate-800
                    hover:shadow-lg hover:-translate-y-1">

          <div class="flex items-center gap-2 text-slate-900 dark:text-white">
            <Icon name="mdi:brain" class="text-purple-500 text-5xl" />
            <h3 class="text-2xl font-semibold">AI Systems</h3>
          </div>

          <p class="text-sm mt-3 text-slate-600 dark:text-slate-400">
            LLM inference, embeddings, RAG pipelines, and agent workflows.
          </p>
        </div>

        <div class="rounded-4xl p-6 transition
                    bg-white dark:bg-slate-900
                    border border-slate-200 dark:border-slate-800
                    hover:shadow-lg hover:-translate-y-1">

          <div class="flex items-center gap-2 text-slate-900 dark:text-white">
            <Icon name="mdi:database" class="text-emerald-500 text-5xl" />
            <h3 class="text-2xl font-semibold">Data Layer</h3>
          </div>

          <p class="text-sm mt-3 text-slate-600 dark:text-slate-400">
            PostgreSQL, Redis, Weaviate, search indexing, caching systems.
          </p>
        </div>

        <div class="rounded-4xl p-6 transition
                    bg-white dark:bg-slate-900
                    border border-slate-200 dark:border-slate-800
                    hover:shadow-lg hover:-translate-y-1">

          <div class="flex items-center gap-2 text-slate-900 dark:text-white">
            <Icon name="mdi:harddisk" class="text-amber-500 text-5xl" />
            <h3 class="text-2xl font-semibold">Storage</h3>
          </div>

          <p class="text-sm mt-3 text-slate-600 dark:text-slate-400">
            MinIO object storage, datasets, models, and media assets.
          </p>
        </div>

      </div>
    </section>

    <!-- INFRASTRUCTURE -->
    <section class="pb-16">
      <div class="grid md:grid-cols-4 gap-6">

        <div class="rounded-4xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-2 text-slate-900 dark:text-white">
            <Icon name="mdi:raspberry-pi" class="text-sky-500 text-5xl" />
            <h3 class="text-2xl font-semibold">ARM64 Cluster</h3>
          </div>
          <p class="text-sm mt-2 text-slate-600 dark:text-slate-400">
            8 Raspberry Pi 5 nodes running k3s.
          </p>
        </div>

        <div class="rounded-4xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-2 text-slate-900 dark:text-white">
            <Icon name="mdi:kubernetes" class="text-purple-500 text-5xl" />
            <h3 class="text-2xl font-semibold">Orchestration</h3>
          </div>
          <p class="text-sm mt-2 text-slate-600 dark:text-slate-400">
            Scheduling, networking, scaling, service discovery.
          </p>
        </div>

        <div class="rounded-4xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-2 text-slate-900 dark:text-white">
            <Icon name="mdi:source-branch" class="text-emerald-500 text-5xl" />
            <h3 class="text-2xl font-semibold">CI/CD</h3>
          </div>
          <p class="text-sm mt-2 text-slate-600 dark:text-slate-400">
            Automated builds and deployments via Gitea runners.
          </p>
        </div>

        <div class="rounded-4xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-2 text-slate-900 dark:text-white">
            <Icon name="mdi:chart-line" class="text-amber-500 text-5xl" />
            <h3 class="text-2xl font-semibold">Observability</h3>
          </div>
          <p class="text-sm mt-2 text-slate-600 dark:text-slate-400">
            Metrics, logs, dashboards, and alerting.
          </p>
        </div>

      </div>
    </section>

    <!-- ARCHITECTURE -->
    <section class="pb-16">
      <div class="text-center mb-10">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                    bg-sky-500/10 text-sky-600 dark:text-sky-400">
          <Icon name="mdi:sitemap" />
          Architecture Visualization
        </div>

        <h2 class="mt-5 text-2xl md:text-4xl font-bold text-slate-900 dark:text-white">
          System Architecture Diagram
        </h2>

        <p class="mt-3 max-w-4xl mx-auto text-slate-600 dark:text-slate-400">
          Visual representation of compute, storage, AI, and backend layers.
        </p>
      </div>

      <div class="rounded-4xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <ArchitectureDiagram />
      </div>
    </section>

    <!-- FOOTER -->
    <div class="pb-16 text-center text-sm text-slate-500 dark:text-slate-400">
      A self-hosted distributed system combining Kubernetes, AI inference,
      and backend services running on a personal homelab infrastructure.
    </div>

  </div>
</section>

<section
  class="relative w-full overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300"
>
  <div class="max-w-7xl mx-auto px-6 py-12 relative">

    <!-- TITLE -->
    <div class="mb-8 text-center">
      <h2 class="text-4xl md:text-3xl font-bold text-slate-900 dark:text-white">
        Systems Overview
      </h2>
      <p class="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-4xl mx-auto">
        A breakdown of the core architecture powering AI, backend services, and infrastructure.
        Each system is modular, scalable, and designed for distributed execution.
      </p>
    </div>

    <!-- CARDS -->
    <div class="flex flex-col md:flex-row gap-4">

      <!-- AI Systems -->
      <NuxtLink
        to="/systems/ai"
        class="flex-1 rounded-xl overflow-hidden
               bg-slate-100 dark:bg-slate-800/30
               hover:bg-slate-200 dark:hover:bg-slate-800/60
               transition"
      >
        <img
          src="https://picsum.photos/400/200?random=1"
          class="w-full h-32 object-cover"
        />

        <div class="p-4">
          <div class="font-semibold text-slate-900 dark:text-white">
            AI Systems
          </div>
          <div class="text-xs text-slate-600 dark:text-slate-400 mt-1">
            RAG, agents, semantic retrieval, inference
          </div>

          <div class="mt-3 text-sm text-sky-600 dark:text-sky-400 font-medium">
            Read more →
          </div>
        </div>
      </NuxtLink>

      <!-- Backend Systems -->
      <NuxtLink
        to="/systems/backend"
        class="flex-1 rounded-xl overflow-hidden
               bg-slate-100 dark:bg-slate-800/30
               hover:bg-slate-200 dark:hover:bg-slate-800/60
               transition"
      >
        <img
          src="https://picsum.photos/400/200?random=2"
          class="w-full h-32 object-cover"
        />

        <div class="p-4">
          <div class="font-semibold text-slate-900 dark:text-white">
            Backend Systems
          </div>
          <div class="text-xs text-slate-600 dark:text-slate-400 mt-1">
            APIs, async systems, services, databases
          </div>

          <div class="mt-3 text-sm text-sky-600 dark:text-sky-400 font-medium">
            Read more →
          </div>
        </div>
      </NuxtLink>

      <!-- Infrastructure Systems -->
      <NuxtLink
        to="/systems/infrastructure"
        class="flex-1 rounded-xl overflow-hidden
               bg-slate-100 dark:bg-slate-800/30
               hover:bg-slate-200 dark:hover:bg-slate-800/60
               transition"
      >
        <img
          src="https://picsum.photos/400/200?random=3"
          class="w-full h-32 object-cover"
        />

        <div class="p-4">
          <div class="font-semibold text-slate-900 dark:text-white">
            Infrastructure Systems
          </div>
          <div class="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Kubernetes, ARM64, homelab, GPU nodes
          </div>

          <div class="mt-3 text-sm text-sky-600 dark:text-sky-400 font-medium">
            Read more →
          </div>
        </div>
      </NuxtLink>

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






