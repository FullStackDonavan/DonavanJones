<template>
  <PatternSection>

  <section
    class="relative w-full py-24 md:py-32 overflow-hidden
           bg-white dark:bg-gray-900 transition-colors duration-300"
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

    <div class="max-w-5xl mx-auto px-6 relative">

      <!-- TITLE -->
      <h1
        class="text-4xl md:text-6xl font-bold leading-tight tracking-tight
               text-gray-900 dark:text-white"
      >
        My Private Cloud System
        <span class="text-blue-600 dark:text-blue-400">Architecture</span>
      </h1>

      <!-- SUBTITLE -->
      <p
        class="mt-6 text-lg md:text-xl max-w-2xl
               text-gray-600 dark:text-gray-300"
      >
        I design and operate a distributed computing environment using Kubernetes,
        ARM64 clusters, GPU inference systems, and self-hosted backend services.
      </p>

      <!-- SYSTEM STACK -->
      <div class="mt-10 grid md:grid-cols-2 gap-6">

        <div class="p-5 rounded-xl border border-gray-200 dark:border-gray-800">
          <h3 class="font-semibold text-gray-900 dark:text-white">Infrastructure Layer</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">
            k3s Kubernetes cluster running on Raspberry Pi 5 nodes with ARM64 workloads,
            service load balancing, and edge scheduling.
          </p>
        </div>

        <div class="p-5 rounded-xl border border-gray-200 dark:border-gray-800">
          <h3 class="font-semibold text-gray-900 dark:text-white">AI Compute Layer</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">
            RTX 3090 GPU node and Jetson Orin Nano handling LLM inference, embeddings,
            and RAG-based systems.
          </p>
        </div>

        <div class="p-5 rounded-xl border border-gray-200 dark:border-gray-800">
          <h3 class="font-semibold text-gray-900 dark:text-white">Backend Systems</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">
            FastAPI services, Redis caching, Postgres databases, and internal tooling
            deployed as Kubernetes services.
          </p>
        </div>

        <div class="p-5 rounded-xl border border-gray-200 dark:border-gray-800">
          <h3 class="font-semibold text-gray-900 dark:text-white">Observability Layer</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Monitoring and system tracking using Prometheus and Grafana (planned/in progress)
            for cluster health and performance.
          </p>
        </div>

      </div>

        <!-- CTA -->
        <div class="mt-10 flex flex-wrap gap-4">

        <NuxtLink
            to="/projects/overview"
            class="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium
                hover:bg-blue-700 transition"
        >
            View Projects
        </NuxtLink>

        <NuxtLink
            to="/blog/overview"
            class="px-6 py-3 rounded-xl border
                border-gray-300 dark:border-gray-700
                text-gray-800 dark:text-gray-200
                hover:border-gray-500 transition"
        >
            Explore Knowledge Base
        </NuxtLink>

        <NuxtLink
            to="/"
            class="px-6 py-3 rounded-xl text-gray-700 dark:text-gray-300
                hover:text-black dark:hover:text-white transition"
        >
            Back Home
        </NuxtLink>

        </div>

      <!-- FOOTER LINE -->
      <div class="mt-10 text-sm text-gray-500 dark:text-gray-400">
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

export default {
  components: {
    Hero,
  },
};
</script>






