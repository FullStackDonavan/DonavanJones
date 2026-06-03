<template>
  <PatternSection>
    <InfraHero />
    <Breadcrumbs
      parentTitle="Systems"
      parentUrl="/system-overview"
      currentPageTitle="Infrastructure"
    />
    <div class="mx-auto max-w-6xl px-6 py-14">

      <!-- HEADER -->
      <div class="mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full
                    bg-sky-500/10 text-sky-400 text-sm">
          <Icon name="mdi:server-network" />
          Infrastructure Engineering
        </div>

        <h1 class="mt-4 text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Building Private Cloud Infrastructure
        </h1>

        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
          Designing and operating self-hosted Kubernetes clusters, distributed storage,
          networking layers, observability stacks, and automation pipelines across ARM64 systems.
        </p>
      </div>

      <!-- SECTION 1 (CORE PRINCIPLES) -->
      <section class="mb-12 grid md:grid-cols-2 gap-8 items-center
                      rounded-2xl border border-gray-200 dark:border-gray-800
                      bg-white dark:bg-gray-900 p-6">

        <div>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
            Core Infrastructure Principles
          </h2>

          <ul class="mt-4 space-y-3 text-gray-700 dark:text-gray-300 list-disc pl-5">
            <li>Everything runs as a containerized workload</li>
            <li>Infrastructure is declarative (GitOps-first)</li>
            <li>Failure is expected and designed for</li>
            <li>Systems must be observable by default</li>
            <li>Edge + local compute > cloud dependency</li>
          </ul>
        </div>

        <img
          src="https://placehold.co/600x400/png?text=Kubernetes+Cluster+Overview"
          class="rounded-xl border border-gray-200 dark:border-gray-800"
        />
      </section>

      <!-- SECTION 2 (ARCHITECTURE AREAS) -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Infrastructure Layers
        </h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

          <!-- Cluster -->
          <div class="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <img src="https://placehold.co/400x200/png?text=Kubernetes+Cluster" />
            <div class="p-4">
              <div class="flex items-center gap-2 text-sky-400 font-semibold">
                <Icon name="mdi:kubernetes" />
                Compute Cluster
              </div>
              <p class="text-sm mt-2 text-gray-600 dark:text-gray-400">
                k3s on ARM64 Raspberry Pi nodes with workload scheduling.
              </p>
            </div>
          </div>

          <!-- Networking -->
          <div class="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <img src="https://placehold.co/400x200/png?text=Networking" />
            <div class="p-4">
              <div class="flex items-center gap-2 text-purple-400 font-semibold">
                <Icon name="mdi:lan" />
                Networking
              </div>
              <p class="text-sm mt-2 text-gray-600 dark:text-gray-400">
                Ingress controllers, service mesh patterns, internal routing.
              </p>
            </div>
          </div>

          <!-- Storage -->
          <div class="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <img src="https://placehold.co/400x200/png?text=Storage+Layer" />
            <div class="p-4">
              <div class="flex items-center gap-2 text-emerald-400 font-semibold">
                <Icon name="mdi:harddisk" />
                Storage
              </div>
              <p class="text-sm mt-2 text-gray-600 dark:text-gray-400">
                MinIO object storage, persistent volumes, backups.
              </p>
            </div>
          </div>

          <!-- CI/CD -->
          <div class="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <img src="https://placehold.co/400x200/png?text=CI%2FCD+Automation" />
            <div class="p-4">
              <div class="flex items-center gap-2 text-amber-400 font-semibold">
                <Icon name="mdi:source-branch" />
                CI/CD
              </div>
              <p class="text-sm mt-2 text-gray-600 dark:text-gray-400">
                Gitea runners, automated builds, GitOps deployments.
              </p>
            </div>
          </div>

        </div>
      </section>

      <!-- SECTION 3 (2 COLS FAILURE MODES) -->
      <section class="mb-12 grid md:grid-cols-2 gap-8 items-center
                      rounded-2xl border border-gray-200 dark:border-gray-800
                      bg-white dark:bg-gray-900 p-6">

        <img
          src="https://placehold.co/600x400/png?text=Failure+Modes+Diagram"
          class="rounded-xl border border-gray-200 dark:border-gray-800"
        />

        <div>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
            Infrastructure Failure Modes
          </h2>

          <ul class="mt-4 space-y-3 text-gray-700 dark:text-gray-300 list-disc pl-5">
            <li>Node failure without proper pod rescheduling</li>
            <li>Storage saturation across persistent volumes</li>
            <li>Network bottlenecks between services</li>
            <li>Unobserved silent service degradation</li>
            <li>Cluster resource fragmentation</li>
          </ul>
        </div>
      </section>

      <!-- OBSERVABILITY SECTION -->
      <section class="mb-12 rounded-2xl border border-gray-200 dark:border-gray-800
                      bg-white dark:bg-gray-900 p-6">

        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Observability Stack
        </h2>

        <div class="mt-6 grid md:grid-cols-3 gap-5">

          <div class="p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
            <div class="flex items-center gap-2 text-sky-400 font-semibold">
              <Icon name="mdi:chart-line" />
              Metrics
            </div>
            <p class="text-sm mt-2 text-gray-600 dark:text-gray-300">
              System metrics, node health, CPU/memory usage tracking.
            </p>
          </div>

          <div class="p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
            <div class="flex items-center gap-2 text-purple-400 font-semibold">
              <Icon name="mdi:file-document" />
              Logs
            </div>
            <p class="text-sm mt-2 text-gray-600 dark:text-gray-300">
              Centralized logging across services and containers.
            </p>
          </div>

          <div class="p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
            <div class="flex items-center gap-2 text-emerald-400 font-semibold">
              <Icon name="mdi:eye" />
              Tracing
            </div>
            <p class="text-sm mt-2 text-gray-600 dark:text-gray-300">
              Request tracing across distributed services.
            </p>
          </div>

        </div>
      </section>

      <!-- STACK -->
      <section class="rounded-2xl border border-gray-200 dark:border-gray-800
                      bg-white dark:bg-gray-900 p-6">

        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Infrastructure Stack
        </h2>

        <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">Kubernetes (k3s)</span>
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">Raspberry Pi 5</span>
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">Docker</span>
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">Ingress NGINX</span>
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">MinIO</span>
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">Gitea</span>
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">Prometheus</span>
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">Grafana</span>
        </div>
      </section>

      <!-- FOOTER -->
      <div class="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        Infrastructure is about resilience, observability, and deterministic failure handling.
      </div>
      <FaqSection
        title="Frequently Asked Questions"
        :faqs="faqs"
      />
<ClusterArticles cluster="infrastructure-engineering" />
    </div>
  </PatternSection>
</template>

<script setup lang="ts">
 const faqs = [
  {
    question: "What does your infrastructure look like?",
    answer:
      "I run a self-hosted distributed system built on a k3s Kubernetes cluster using Raspberry Pi 5 nodes and ARM64 workloads. It supports AI services, databases, APIs, and media processing across multiple machines."
  },
  {
    question: "What services do you self-host?",
    answer:
      "I self-host databases (PostgreSQL, MySQL), caching (Redis), object storage (MinIO), Git services (Gitea), AI workloads, and custom applications including my Bible app and automation tools."
  },
  {
    question: "How do you handle AI workloads?",
    answer:
      "AI workloads run across GPU and CPU nodes, including LLM inference, embeddings, RAG pipelines, Whisper transcription, and Stable Diffusion image generation. Heavy tasks are distributed based on node capability."
  },
  {
    question: "How is your storage architecture designed?",
    answer:
      "I use a combination of S3-compatible MinIO for object storage, PostgreSQL/MySQL for structured data, and distributed volumes for Kubernetes workloads. Media assets and user uploads are stored in S3-compatible buckets."
  },
  {
    question: "How do you manage deployments?",
    answer:
      "I use containerized deployments with Docker and Kubernetes (k3s). CI/CD pipelines deploy services automatically, including backend APIs, frontend apps, and AI services."
  },
  {
    question: "Do you use cloud providers?",
    answer:
      "Yes, I combine cloud services (AWS S3, compute resources) with self-hosted infrastructure to balance scalability, cost efficiency, and control over data and services."
  },
  {
    question: "How do you handle real-time features like livestreaming?",
    answer:
      "I use WebRTC for peer-to-peer communication and AWS IVS or custom RTMP pipelines with FFmpeg for livestreaming. Streams are processed, recorded, and optionally stored for replay."
  },
  {
    question: "How do your AI systems communicate?",
    answer:
      "AI services communicate through internal APIs, message queues, and RAG pipelines. Models like Ollama run locally, while external APIs are used for specialized tasks when needed."
  },
  {
    question: "What makes your system architecture unique?",
    answer:
      "It combines homelab infrastructure, Kubernetes orchestration, GPU AI workloads, and full-stack application development into a unified ecosystem that supports real production applications."
  }
]
</script>