<template>
  <div class="system-overview">
    <div
      class="relative z-10 mb-8 overflow-hidden rounded-2xl
             border border-slate-200 dark:border-amber-500/20
             bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm"
    >
      <div
        class="absolute inset-0
               bg-gradient-to-r from-amber-200/20 via-emerald-200/10 to-sky-200/10
               dark:from-amber-500/5 dark:via-emerald-500/5 dark:to-sky-500/5"
      />

      <div class="relative p-8 lg:p-10">

        <div class="grid lg:grid-cols-[1.5fr_1fr] gap-10 items-start">

          <div>
            <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full
                     bg-amber-500/10 text-amber-400 text-sm"
            >
              <Icon name="mdi:server-network" />
              AI Homelab Engineering
            </div>

            <h2
              class="mt-4 text-4xl md:text-5xl lg:text-6xl
                     font-bold leading-tight text-slate-900 dark:text-slate-100"
            >
              A Production-Ready
              <span class="block text-amber-400">AI Homelab</span>
            </h2>

            <p class="mt-6 max-w-2xl text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              A hybrid Jetson Orin / RTX 3090 cluster on k3s — real orchestration, storage,
              networking, and security, not a single desktop running one script.
            </p>

            <div class="mt-10">
              <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden">
                <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <div class="flex gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  </div>
                  <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">cluster.topology</span>
                </div>

                <div class="px-5 py-4">
                  <p class="text-[10px] uppercase tracking-widest text-amber-500 font-semibold mb-4">Cluster Topology</p>
                  <div class="flex flex-wrap items-center gap-2 lg:gap-3">
                    <div class="flow-node">
                      <Icon name="mdi:expansion-card" class="text-purple-400 text-xl" />
                      <span>RTX 3090</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />
                    <div class="flow-node">
                      <Icon name="mdi:chip" class="text-emerald-400 text-xl" />
                      <span>3× Jetson Orin</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />
                    <div class="flow-node">
                      <Icon name="mdi:kubernetes" class="text-sky-400 text-xl" />
                      <span>k3s Control Plane</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />
                    <div class="flow-node">
                      <Icon name="mdi:database" class="text-amber-400 text-xl" />
                      <span>MinIO Storage</span>
                    </div>
                  </div>

                  <p class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Two hardware tiers, one control plane — workloads scheduled by resource
                    profile across ARM64 and x86 nodes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">

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
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Hybrid GPU tiers, routed by workload</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['RTX 3090', 'Jetson Orin', 'CUDA']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-purple-500/10 hover:border-purple-500/40 hover:text-purple-600 dark:hover:text-purple-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5 group/sky">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">orchestration.config</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-sky-500 font-semibold mb-2 transition-colors duration-200 group-hover/sky:text-sky-600 dark:group-hover/sky:text-sky-400">Orchestration</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">k3s across ARM64 and x86 nodes</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['k3s', 'Scheduling', 'Affinity']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-sky-500/10 hover:border-sky-500/40 hover:text-sky-600 dark:hover:text-sky-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 group/amber">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">storage.config</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-amber-500 font-semibold mb-2 transition-colors duration-200 group-hover/amber:text-amber-600 dark:group-hover/amber:text-amber-400">Storage</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Distributed, erasure-coded object storage</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['MinIO', 'Erasure Coding', 'S3-Compatible']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-amber-500/10 hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 group/emerald">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">security.config</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold mb-2 transition-colors duration-200 group-hover/emerald:text-emerald-600 dark:group-hover/emerald:text-emerald-400">Security</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Segmented VLANs, VPN-gated access</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['VLANs', 'WireGuard', 'No Public Exposure']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="mt-10">
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden">
            <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <div class="flex gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
              </div>
              <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">homelab.stack</span>
            </div>
            <div class="px-5 py-4">
              <p class="text-[10px] uppercase tracking-widest text-amber-500 font-semibold mb-3">Homelab Stack</p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="t in ['k3s', 'RTX 3090', 'Jetson Orin Nano Super', 'Raspberry Pi', 'MinIO', 'Redis', 'PostgreSQL', 'WireGuard', 'Prometheus']" :key="t"
                  class="text-[11px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-amber-500/10 hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400">
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

<style scoped>
.flow-node {
  @apply flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium
         bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50
         text-slate-600 dark:text-slate-300;
}
</style>
