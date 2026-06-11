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

                <h1
                class="text-4xl md:text-5xl lg:text-6xl
                font-bold leading-tight
                text-slate-900 dark:text-slate-100"
                >
                Private Cloud
                <span class="block text-sky-400">
                    AI Platform
                </span>
                </h1>

                <p
                class="mt-6 max-w-2xl text-lg
                text-slate-700 dark:text-slate-300 leading-relaxed"
                >
                Distributed ARM64 Kubernetes cluster powering AI inference,
                vector search, object storage, CI/CD automation,
                and self-hosted backend services.
                </p>

                <!-- REQUEST LIFECYCLE -->
        <div class="mt-10">
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden">

            <!-- Card header -->
            <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <div class="flex gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
              </div>
              <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">request.lifecycle</span>
            </div>

            <!-- Flow -->
            <div class="px-5 py-4">
              <p class="text-[10px] uppercase tracking-widest text-sky-500 font-semibold mb-4">Request Lifecycle</p>
              <div class="flex flex-wrap items-center gap-2">

                <div class="flow-node">
                  <Icon name="mdi:account" class="text-sky-400 text-xl" />
                  <span>User</span>
                </div>
                <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />

                <div class="flow-node">
                  <Icon name="mdi:router-network" class="text-cyan-400 text-xl" />
                  <span>Ingress</span>
                </div>
                <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />

                <div class="flow-node">
                  <Icon name="mdi:api" class="text-blue-400 text-xl" />
                  <span>FastAPI</span>
                </div>
                <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />

                <div class="flow-node">
                  <Icon name="mdi:database" class="text-emerald-400 text-xl" />
                  <span>Redis / PostgreSQL</span>
                </div>
                <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />

                <div class="flow-node">
                  <Icon name="mdi:brain" class="text-purple-400 text-xl" />
                  <span>AI Layer</span>
                </div>
                <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />

                <div class="flow-node">
                  <Icon name="mdi:harddisk" class="text-amber-400 text-xl" />
                  <span>MinIO</span>
                </div>
                <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />

                <div class="flow-node">
                  <Icon name="mdi:reply" class="text-sky-400 text-xl" />
                  <span>Response</span>
                </div>

              </div>

              <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Requests enter through Kubernetes ingress, pass through FastAPI services,
                leverage Redis/PostgreSQL data stores, invoke AI workloads, persist artifacts
                to MinIO, and return results to the client.
              </div>
            </div>

          </div>
        </div>

            </div>
<!-- RIGHT -->
<div class="grid grid-cols-2 gap-4">

  <!-- CARD: Cluster -->
  <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5 group/sky">
    <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
      <div class="flex gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
      </div>
      <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">cluster.nodes</span>
    </div>
    <div class="px-4 py-3">
      <p class="text-[10px] uppercase tracking-widest text-sky-500 font-semibold mb-2 transition-colors duration-200 group-hover/sky:text-sky-600 dark:group-hover/sky:text-sky-400">Cluster</p>
      <div class="text-3xl font-bold text-slate-900 dark:text-white leading-none mb-1">8</div>
      <div class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Kubernetes Nodes</div>
      <div class="flex flex-wrap gap-1.5">
        <span v-for="t in ['k3s', 'Kubernetes', 'ARM64']" :key="t"
          class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-sky-500/10 hover:border-sky-500/40 hover:text-sky-600 dark:hover:text-sky-400">
          {{ t }}
        </span>
      </div>
    </div>
  </div>

  <!-- CARD: Compute -->
  <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5 group/purple">
    <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
      <div class="flex gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
      </div>
      <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">compute.config</span>
    </div>
    <div class="px-4 py-3">
      <p class="text-[10px] uppercase tracking-widest text-purple-500 font-semibold mb-2 transition-colors duration-200 group-hover/purple:text-purple-600 dark:group-hover/purple:text-purple-400">Compute</p>
      <div class="text-3xl font-bold text-slate-900 dark:text-white leading-none mb-1">ARM64</div>
      <div class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Raspberry Pi 5 Cluster</div>
      <div class="flex flex-wrap gap-1.5">
        <span v-for="t in ['Pi 5', '8 Nodes', 'ARM64']" :key="t"
          class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-purple-500/10 hover:border-purple-500/40 hover:text-purple-600 dark:hover:text-purple-400">
          {{ t }}
        </span>
      </div>
    </div>
  </div>

  <!-- CARD: Intelligence -->
  <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 group/emerald">
    <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
      <div class="flex gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
      </div>
      <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">ai.inference</span>
    </div>
    <div class="px-4 py-3">
      <p class="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold mb-2 transition-colors duration-200 group-hover/emerald:text-emerald-600 dark:group-hover/emerald:text-emerald-400">Intelligence</p>
      <div class="text-3xl font-bold text-slate-900 dark:text-white leading-none mb-1">AI</div>
      <div class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Inference + RAG + Embeddings</div>
      <div class="flex flex-wrap gap-1.5">
        <span v-for="t in ['Llama 3.2', 'Weaviate', 'RAG']" :key="t"
          class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400">
          {{ t }}
        </span>
      </div>
    </div>
  </div>

  <!-- CARD: Delivery -->
  <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 group/amber">
    <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
      <div class="flex gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
      </div>
      <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">ci.pipeline</span>
    </div>
    <div class="px-4 py-3">
      <p class="text-[10px] uppercase tracking-widest text-amber-500 font-semibold mb-2 transition-colors duration-200 group-hover/amber:text-amber-600 dark:group-hover/amber:text-amber-400">Delivery</p>
      <div class="text-3xl font-bold text-slate-900 dark:text-white leading-none mb-1">CI/CD</div>
      <div class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Automated Deployments</div>
      <div class="flex flex-wrap gap-1.5">
        <span v-for="t in ['Gitea', 'Runners', 'Prometheus']" :key="t"
          class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-amber-500/10 hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400">
          {{ t }}
        </span>
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