<template>
    <div class="system-overview">
        <div
            class="relative z-10 mb-8 overflow-hidden rounded-2xl
                    border border-slate-200 dark:border-sky-500/20
                    bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm"
            >
        <!-- Glow -->
        <div
            class="absolute inset-0
                    bg-gradient-to-r from-sky-200/20 via-purple-200/10 to-emerald-200/10
                    dark:from-sky-500/5 dark:via-purple-500/5 dark:to-emerald-500/5"
            ></div>



        <div class="relative p-8 lg:p-10">

            <div class="grid lg:grid-cols-[1.5fr_1fr] gap-10 items-start">

            <!-- LEFT -->
            <div>

                <div
                class="bg-sky-100 dark:bg-sky-500/10
                border border-sky-200 dark:border-sky-500/20
                text-sky-700 dark:text-sky-300"
                >
                <Icon name="mdi:kubernetes" />
                Self-Hosted Kubernetes Infrastructure
                </div>

                <h2
                class="text-4xl md:text-5xl lg:text-6xl
                font-bold leading-tight
                text-slate-900 dark:text-slate-100"
                >
                Private Cloud
                <span class="block text-sky-400">
                    AI Platform
                </span>
                </h2>

                <p
                class="mt-6 max-w-2xl text-lg
                text-slate-700 dark:text-slate-300 leading-relaxed"
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
            class="rounded-2xl border
       border-slate-200 dark:border-slate-800
       bg-white/70 dark:bg-slate-950/40
       backdrop-blur-sm p-5"
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
<div
  class="grid grid-cols-2 gap-4 p-4 rounded-2xl
         border border-slate-300 dark:border-slate-800/60
         bg-slate-50/80 dark:bg-slate-950/30
         backdrop-blur-sm"
>

  <!-- CARD -->
  <div class="group rounded-xl p-4
              border border-slate-300 dark:border-slate-800
              bg-slate-100 dark:bg-slate-900/40
              hover:border-sky-400 dark:hover:border-sky-500/30
              transition-all duration-200">

    <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/60">

      <Icon
        name="mdi:server-network"
        class="text-sky-400 text-5xl shrink-0"
      />

      <span class="text-xs font-semibold uppercase tracking-widest text-slate-700 dark:text-slate-300 text-right">
        Cluster
      </span>

    </div>

    <div class="mt-4">
      <div class="text-4xl font-bold text-slate-900 dark:text-white leading-none">
        8
      </div>
      <div class="text-xs text-slate-600 dark:text-slate-400 mt-1">
        Kubernetes Nodes
      </div>
    </div>
  </div>

  <!-- CARD -->
  <div class="group rounded-xl p-4
              border border-slate-300 dark:border-slate-800
              bg-slate-100 dark:bg-slate-900/40
              hover:border-sky-400 dark:hover:border-sky-500/30
              transition-all duration-200">

    <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/60">

      <Icon
        name="mdi:cpu-64-bit"
        class="text-purple-400 text-5xl shrink-0"
      />

      <span class="text-xs font-semibold uppercase tracking-widest text-slate-700 dark:text-slate-300 text-right">
        Compute
      </span>

    </div>

    <div class="mt-4">
      <div class="text-3xl font-bold text-slate-900 dark:text-white leading-none">
        ARM64
      </div>
      <div class="text-xs text-slate-600 dark:text-slate-400 mt-1">
        Raspberry Pi 5 Cluster
      </div>
    </div>
  </div>

  <!-- CARD -->
  <div class="group rounded-xl p-4
              border border-slate-300 dark:border-slate-800
              bg-slate-100 dark:bg-slate-900/40
              hover:border-sky-400 dark:hover:border-sky-500/30
              transition-all duration-200">

    <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/60">

      <Icon
        name="mdi:brain"
        class="text-emerald-400 text-5xl shrink-0"
      />

      <span class="text-xs font-semibold uppercase tracking-widest text-slate-700 dark:text-slate-300 text-right">
        Intelligence
      </span>

    </div>

    <div class="mt-4">
      <div class="text-4xl font-bold text-slate-900 dark:text-white leading-none">
        AI
      </div>
      <div class="text-xs text-slate-600 dark:text-slate-400 mt-1">
        Inference + RAG + Embeddings
      </div>
    </div>
  </div>

  <!-- CARD -->
  <div class="group rounded-xl p-4
              border border-slate-300 dark:border-slate-800
              bg-slate-100 dark:bg-slate-900/40
              hover:border-sky-400 dark:hover:border-sky-500/30
              transition-all duration-200">

    <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/60">

      <Icon
        name="mdi:source-branch"
        class="text-amber-400 text-5xl shrink-0"
      />

      <span class="text-xs font-semibold uppercase tracking-widest text-slate-700 dark:text-slate-300 text-right">
        Delivery
      </span>

    </div>

    <div class="mt-4">
      <div class="text-3xl font-bold text-slate-900 dark:text-white leading-none">
        CI/CD
      </div>
      <div class="text-xs text-slate-600 dark:text-slate-400 mt-1">
        Automated Deployments
      </div>
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
    </div>
</template>