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

              <div class="flex items-center gap-3 mb-5">
                <div class="w-8 h-px bg-sky-500/50"></div>
                <div class="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-400">
                  <Icon name="mdi:source-branch" class="text-sky-400" />
                  Infrastructure Flow
                </div>
              </div>

              <div
                class="rounded-2xl border border-slate-200 dark:border-slate-800
                       bg-white/70 dark:bg-slate-950/40 backdrop-blur-sm p-5"
              >
                <div class="flex flex-wrap items-center gap-2 lg:gap-3">

                  <div class="flow-node">
                    <Icon name="mdi:account" class="text-sky-400 text-xl" />
                    <span>User</span>
                  </div>

                  <Icon name="mdi:chevron-right" class="text-slate-600 hidden sm:block" />

                  <div class="flow-node">
                    <Icon name="mdi:router-network" class="text-cyan-400 text-xl" />
                    <span>Ingress</span>
                  </div>

                  <Icon name="mdi:chevron-right" class="text-slate-600 hidden sm:block" />

                  <div class="flow-node">
                    <Icon name="mdi:kubernetes" class="text-blue-400 text-xl" />
                    <span>Kubernetes</span>
                  </div>

                  <Icon name="mdi:chevron-right" class="text-slate-600 hidden sm:block" />

                  <div class="flow-node">
                    <Icon name="mdi:database" class="text-emerald-400 text-xl" />
                    <span>Services</span>
                  </div>

                  <Icon name="mdi:chevron-right" class="text-slate-600 hidden sm:block" />

                  <div class="flow-node">
                    <Icon name="mdi:harddisk" class="text-amber-400 text-xl" />
                    <span>Storage</span>
                  </div>

                  <Icon name="mdi:chevron-right" class="text-slate-600 hidden sm:block" />

                  <div class="flow-node">
                    <Icon name="mdi:chart-timeline-variant" class="text-purple-400 text-xl" />
                    <span>Observability</span>
                  </div>

                </div>

                <p class="mt-4 text-xs text-slate-500 border-t border-slate-800 pt-4">
                  Requests flow through ingress controllers into Kubernetes workloads,
                  backed by distributed storage, databases, and full observability stacks.
                </p>
              </div>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="grid grid-cols-2 gap-4 p-4 rounded-2xl
                      border border-slate-300 dark:border-slate-800/60
                      bg-slate-50/80 dark:bg-slate-950/30 backdrop-blur-sm">

            <!-- Cluster -->
            <div class="group rounded-xl p-4 border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40">
              <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/60">
                <Icon name="mdi:kubernetes" class="text-sky-400 text-6xl shrink-0" />
                <span class="text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300 text-right">
                  Cluster
                </span>
              </div>
              <div class="mt-4 text-sm text-slate-600 dark:text-slate-400">
                k3s ARM64 nodes (Pi 5 cluster)
              </div>
            </div>

            <!-- Compute -->
            <div class="group rounded-xl p-4 border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40">
              <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/60">
                <Icon name="mdi:cpu-64-bit" class="text-purple-400 text-6xl shrink-0" />
                <span class="text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300 text-right">
                  Compute
                </span>
              </div>
              <div class="mt-4 text-sm text-slate-600 dark:text-slate-400">
                ARM64 workloads + GPU offload
              </div>
            </div>

            <!-- Storage -->
            <div class="group rounded-xl p-4 border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40">
              <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/60">
                <Icon name="mdi:harddisk" class="text-emerald-400 text-6xl shrink-0" />
                <span class="text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300 text-right">
                  Storage
                </span>
              </div>
              <div class="mt-4 text-sm text-slate-600 dark:text-slate-400">
                MinIO + persistent volumes
              </div>
            </div>

            <!-- CI/CD -->
            <div class="group rounded-xl p-4 border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40">
              <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/60">
                <Icon name="mdi:source-branch" class="text-amber-400 text-6xl shrink-0" />
                <span class="text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300 text-right">
                  CI/CD
                </span>
              </div>
              <div class="mt-4 text-sm text-slate-600 dark:text-slate-400">
                Gitea + runners + automation
              </div>
            </div>

            <!-- Databases -->
            <div class="group rounded-xl p-4 border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40">
              <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/60">
                <Icon name="mdi:database" class="text-blue-400 text-6xl shrink-0" />
                <span class="text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300 text-right">
                  Data
                </span>
              </div>
              <div class="mt-4 text-sm text-slate-600 dark:text-slate-400">
                PostgreSQL + Redis + Weaviate
              </div>
            </div>

            <!-- Observability -->
            <div class="group rounded-xl p-4 border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40">
              <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/60">
                <Icon name="mdi:chart-timeline-variant" class="text-purple-400 text-6xl shrink-0" />
                <span class="text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300 text-right">
                  Observability
                </span>
              </div>
              <div class="mt-4 text-sm text-slate-600 dark:text-slate-400">
                Metrics, logs, tracing
              </div>
            </div>

          </div>
        </div>



        <!-- STACK -->
        <div class="mt-10 pt-8 border-t border-slate-800">

          <div class="text-xs uppercase tracking-widest text-slate-500 mb-4">
            Infrastructure Stack
          </div>

          <div class="flex flex-wrap gap-2">
            <span class="tech-badge">k3s</span>
            <span class="tech-badge">Kubernetes</span>
            <span class="tech-badge">Raspberry Pi 5</span>
            <span class="tech-badge">MinIO</span>
            <span class="tech-badge">PostgreSQL</span>
            <span class="tech-badge">Redis</span>
            <span class="tech-badge">Weaviate</span>
            <span class="tech-badge">Gitea</span>
            <span class="tech-badge">Actions Runners</span>
            <span class="tech-badge">Prometheus</span>
            <span class="tech-badge">Grafana</span>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>