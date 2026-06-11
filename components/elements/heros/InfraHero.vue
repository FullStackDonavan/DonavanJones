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
      />

      <div class="relative p-8 lg:p-10">

        <div class="grid lg:grid-cols-[1.5fr_1fr] gap-10 items-start">

          <!-- LEFT -->
          <div>

            <!-- Badge -->
            <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full
                     bg-sky-500/10 text-sky-300 text-sm"
            >
              <Icon name="mdi:server-network" />
              Infrastructure Systems Engineering
            </div>

            <h2
              class="mt-4 text-4xl md:text-5xl lg:text-6xl
                     font-bold leading-tight text-slate-900 dark:text-slate-100"
            >
              Private Cloud
              <span class="block text-sky-400">Infrastructure</span>
            </h2>

            <p class="mt-6 max-w-2xl text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              Self-hosted Kubernetes cluster powering storage, compute, CI/CD, observability,
              and distributed services across ARM64 homelab nodes.
            </p>

            <!-- FLOW -->
            <div class="mt-10">
              <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden">

                <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <div class="flex gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  </div>
                  <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">infra.request.flow</span>
                </div>

                <div class="px-5 py-4">
                  <p class="text-[10px] uppercase tracking-widest text-sky-500 font-semibold mb-4">Infrastructure Flow</p>
                  <div class="flex flex-wrap items-center gap-2 lg:gap-3">

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
                      <Icon name="mdi:kubernetes" class="text-blue-400 text-xl" />
                      <span>Kubernetes</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />

                    <div class="flow-node">
                      <Icon name="mdi:database" class="text-emerald-400 text-xl" />
                      <span>Services</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />

                    <div class="flow-node">
                      <Icon name="mdi:harddisk" class="text-amber-400 text-xl" />
                      <span>Storage</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />

                    <div class="flow-node">
                      <Icon name="mdi:chart-timeline-variant" class="text-purple-400 text-xl" />
                      <span>Observability</span>
                    </div>

                  </div>

                  <p class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Requests flow through ingress controllers into Kubernetes workloads,
                    backed by distributed storage, databases, and full observability stacks.
                  </p>
                </div>

              </div>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="grid grid-cols-2 gap-4">

            <!-- CARD: Cluster -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5 group/cluster">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">cluster.config</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-sky-500 font-semibold mb-2 transition-colors duration-200 group-hover/cluster:text-sky-600 dark:group-hover/cluster:text-sky-400">Cluster</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">k3s ARM64 nodes (Pi 5 cluster)</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['k3s', 'ARM64', 'Pi 5']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-sky-500/10 hover:border-sky-500/40 hover:text-sky-600 dark:hover:text-sky-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

            <!-- CARD: Compute -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5 group/compute">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">compute.config</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-purple-500 font-semibold mb-2 transition-colors duration-200 group-hover/compute:text-purple-600 dark:group-hover/compute:text-purple-400">Compute</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">ARM64 workloads + GPU offload</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['ARM64', 'Kubernetes', 'GPU']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-purple-500/10 hover:border-purple-500/40 hover:text-purple-600 dark:hover:text-purple-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

            <!-- CARD: Storage -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 group/storage">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">storage.config</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold mb-2 transition-colors duration-200 group-hover/storage:text-emerald-600 dark:group-hover/storage:text-emerald-400">Storage</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">MinIO + persistent volumes</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['MinIO', 'S3', 'PVCs']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

            <!-- CARD: CI/CD -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 group/cicd">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">ci.pipeline</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-amber-500 font-semibold mb-2 transition-colors duration-200 group-hover/cicd:text-amber-600 dark:group-hover/cicd:text-amber-400">CI/CD</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Gitea + runners + automation</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['Gitea', 'Runners', 'Actions']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-amber-500/10 hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

            <!-- CARD: Data -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5 group/data">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">data.config</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-sky-500 font-semibold mb-2 transition-colors duration-200 group-hover/data:text-sky-600 dark:group-hover/data:text-sky-400">Data</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">PostgreSQL + Redis + Weaviate</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['PostgreSQL', 'Redis', 'Weaviate']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-sky-500/10 hover:border-sky-500/40 hover:text-sky-600 dark:hover:text-sky-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

            <!-- CARD: Observability -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-rose-500/40 hover:shadow-lg hover:shadow-rose-500/5 group/obs">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">observability.config</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-rose-500 font-semibold mb-2 transition-colors duration-200 group-hover/obs:text-rose-600 dark:group-hover/obs:text-rose-400">Observability</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Metrics, logs, tracing</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['Prometheus', 'Grafana', 'Tracing']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-rose-500/10 hover:border-rose-500/40 hover:text-rose-600 dark:hover:text-rose-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>



        <!-- STACK -->
        <div class="mt-10">
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden">

            <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <div class="flex gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
              </div>
              <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">infra.stack</span>
            </div>

            <div class="px-5 py-4">
              <p class="text-[10px] uppercase tracking-widest text-sky-500 font-semibold mb-3">Infrastructure Stack</p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="t in ['k3s', 'Kubernetes', 'Raspberry Pi 5', 'MinIO', 'PostgreSQL', 'Redis', 'Weaviate', 'Gitea', 'Actions Runners', 'Prometheus', 'Grafana']" :key="t"
                  class="text-[11px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-sky-500/10 hover:border-sky-500/40 hover:text-sky-600 dark:hover:text-sky-400">
                  {{ t }}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>