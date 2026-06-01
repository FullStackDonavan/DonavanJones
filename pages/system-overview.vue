<template>
  <PatternSection>
    <!-- SYSTEM HERO -->
<div
  class="relative z-10 mb-8 overflow-hidden rounded-2xl
         border border-sky-500/20 bg-slate-900/60 backdrop-blur-sm"
>
  <!-- Glow -->
  <div class="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-purple-500/5 to-emerald-500/5"></div>



 <div class="relative p-8 lg:p-10">

  <div class="grid lg:grid-cols-[1.5fr_1fr] gap-10 items-start">

    <!-- LEFT -->
    <div>

      <div
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full
               bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-medium"
      >
        <Icon name="mdi:kubernetes" />
        Self-Hosted Kubernetes Infrastructure
      </div>

      <h2
        class="mt-6 text-4xl md:text-5xl lg:text-6xl
               font-bold leading-tight text-white"
      >
        Private Cloud
        <span class="block text-sky-400">
          AI Platform
        </span>
      </h2>

      <p
        class="mt-6 max-w-2xl text-lg
               text-slate-300 leading-relaxed"
      >
        Distributed ARM64 Kubernetes cluster powering AI inference,
        vector search, object storage, CI/CD automation,
        and self-hosted backend services.
      </p>

      <!-- Lifecycle -->
     <!-- REQUEST LIFECYCLE -->
<div class="mt-10">

  <div class="flex items-center gap-3 mb-5">
    <div class="w-8 h-px bg-sky-500/50"></div>

    <div
      class="flex items-center gap-2 text-xs uppercase tracking-[0.25em]
             text-slate-400"
    >
      <Icon name="mdi:source-branch" class="text-sky-400" />
      Request Lifecycle
    </div>
  </div>

  <div
    class="rounded-2xl border border-slate-800
           bg-slate-950/40 backdrop-blur-sm
           p-5"
  >
    <div
      class="flex flex-wrap items-center
             gap-2 lg:gap-3"
    >

      <div class="flow-node">
        <Icon name="mdi:account" class="text-sky-400 text-xl" />
        <span>User</span>
      </div>

      <Icon
        name="mdi:chevron-right"
        class="text-slate-600 hidden sm:block"
      />

      <div class="flow-node">
        <Icon
          name="mdi:router-network"
          class="text-cyan-400 text-xl"
        />
        <span>Ingress</span>
      </div>

      <Icon
        name="mdi:chevron-right"
        class="text-slate-600 hidden sm:block"
      />

      <div class="flow-node">
        <Icon
          name="mdi:api"
          class="text-blue-400 text-xl"
        />
        <span>FastAPI</span>
      </div>

      <Icon
        name="mdi:chevron-right"
        class="text-slate-600 hidden sm:block"
      />

      <div class="flow-node">
        <Icon
          name="mdi:database"
          class="text-emerald-400 text-xl"
        />
        <span>Redis / PostgreSQL</span>
      </div>

      <Icon
        name="mdi:chevron-right"
        class="text-slate-600 hidden sm:block"
      />

      <div class="flow-node">
        <Icon
          name="mdi:brain"
          class="text-purple-400 text-xl"
        />
        <span>AI Layer</span>
      </div>

      <Icon
        name="mdi:chevron-right"
        class="text-slate-600 hidden sm:block"
      />

      <div class="flow-node">
        <Icon
          name="mdi:harddisk"
          class="text-amber-400 text-xl"
        />
        <span>MinIO</span>
      </div>

      <Icon
        name="mdi:chevron-right"
        class="text-slate-600 hidden sm:block"
      />

      <div class="flow-node">
        <Icon
          name="mdi:reply"
          class="text-sky-400 text-xl"
        />
        <span>Response</span>
      </div>

    </div>

    <div
      class="mt-4 text-xs text-slate-500
             border-t border-slate-800 pt-4"
    >
      Requests enter through Kubernetes ingress, pass through FastAPI services,
      leverage Redis/PostgreSQL data stores, invoke AI workloads, persist artifacts
      to MinIO, and return results to the client.
    </div>
  </div>

</div>

    </div>

    <!-- RIGHT -->
    <div class="grid grid-cols-2 gap-4">

      <div class="status-card">
        <Icon
          name="mdi:server-network"
          class="text-sky-400 text-2xl"
        />

        <div class="text-3xl font-bold text-white mt-3">
          8
        </div>

        <div class="text-xs text-slate-400">
          Cluster Nodes
        </div>
      </div>

      <div class="status-card">
        <Icon
          name="mdi:cpu-64-bit"
          class="text-purple-400 text-2xl"
        />

        <div class="text-3xl font-bold text-white mt-3">
          ARM64
        </div>

        <div class="text-xs text-slate-400">
          Architecture
        </div>
      </div>

      <div class="status-card">
        <Icon
          name="mdi:brain"
          class="text-emerald-400 text-2xl"
        />

        <div class="text-3xl font-bold text-white mt-3">
          AI
        </div>

        <div class="text-xs text-slate-400">
          Inference Stack
        </div>
      </div>

      <div class="status-card">
        <Icon
          name="mdi:source-branch"
          class="text-amber-400 text-2xl"
        />

        <div class="text-3xl font-bold text-white mt-3">
          CI/CD
        </div>

        <div class="text-xs text-slate-400">
          Automated Deployments
        </div>
      </div>

    </div>

  </div>

  <!-- STACK -->
  <div
    class="mt-10 pt-8 border-t border-slate-800"
  >

    <div
      class="flex items-center gap-2 mb-4 text-xs uppercase tracking-widest text-slate-500"
    >
      Technology Stack
    </div>

    <div class="flex flex-wrap gap-2">

      <span class="tech-badge">Kubernetes</span>
      <span class="tech-badge">k3s</span>
      <span class="tech-badge">Raspberry Pi 5</span>
      <span class="tech-badge">FastAPI</span>
      <span class="tech-badge">Redis</span>
      <span class="tech-badge">PostgreSQL</span>
      <span class="tech-badge">Apache AGE</span>
      <span class="tech-badge">Weaviate</span>
      <span class="tech-badge">MinIO</span>
      <span class="tech-badge">Gitea</span>
      <span class="tech-badge">Actions Runners</span>
      <span class="tech-badge">LLMs</span>

    </div>

  </div>

</div>



</div>



  <section
    class="relative w-full overflow-hidden
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

    <div class="max-w-7xl mx-auto px-6 relative">


      <section class="py-12">

  <div class="grid lg:grid-cols-4 gap-6">

    <!-- AI -->
    <div
      class="rounded-3xl p-6
             bg-white dark:bg-slate-900
             border border-gray-200 dark:border-slate-800"
    >
      <Icon
        name="mdi:brain"
        class="text-purple-500 text-4xl"
      />

      <h3 class="mt-4 text-lg font-semibold">
        AI Platform
      </h3>

      <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
        Local inference, embeddings, RAG pipelines,
        agent workflows and model experimentation.
      </p>
    </div>

    <!-- DATA -->
    <div
      class="rounded-3xl p-6
             bg-white dark:bg-slate-900
             border border-gray-200 dark:border-slate-800"
    >
      <Icon
        name="mdi:database"
        class="text-emerald-500 text-4xl"
      />

      <h3 class="mt-4 text-lg font-semibold">
        Data Services
      </h3>

      <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
        Redis caching, PostgreSQL persistence,
        graph relationships and vector search.
      </p>
    </div>

    <!-- STORAGE -->
    <div
      class="rounded-3xl p-6
             bg-white dark:bg-slate-900
             border border-gray-200 dark:border-slate-800"
    >
      <Icon
        name="mdi:harddisk"
        class="text-amber-500 text-4xl"
      />

      <h3 class="mt-4 text-lg font-semibold">
        Storage
      </h3>

      <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
        MinIO object storage for datasets,
        models, backups, media and artifacts.
      </p>
    </div>

    <!-- INFRA -->
    <div
      class="rounded-3xl p-6
             bg-white dark:bg-slate-900
             border border-gray-200 dark:border-slate-800"
    >
      <Icon
        name="mdi:kubernetes"
        class="text-sky-500 text-4xl"
      />

      <h3 class="mt-4 text-lg font-semibold">
        Infrastructure
      </h3>

      <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
        ARM64 Kubernetes cluster,
        CI/CD automation and observability.
      </p>
    </div>

  </div>

</section>



      

      <!-- ARCHITECTURE DIAGRAM -->
      <div class="">
        <div class="text-center mt-16 mb-8">

  <div
    class="inline-flex items-center gap-2
           px-4 py-2 rounded-full
           bg-sky-500/10 text-sky-400"
  >
    <Icon name="mdi:sitemap" />
    Architecture Visualization
  </div>

  <h2
    class="mt-4 text-4xl font-bold
           text-gray-900 dark:text-white"
  >
    System Architecture Diagram
  </h2>

  <p
    class="mt-4 max-w-2xl mx-auto
           text-gray-600 dark:text-gray-400"
  >
    Visual representation of the platform showing
    how requests, services, storage, and AI workloads
    interact throughout the system.
  </p>

</div>

<ArchitectureDiagram />
      </div>


      <!-- FOOTER LINE -->
      <div class="my-10 text-sm text-gray-500 dark:text-gray-400">
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






