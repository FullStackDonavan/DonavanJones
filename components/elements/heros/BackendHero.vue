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
               bg-gradient-to-r from-blue-200/20 via-sky-200/10 to-emerald-200/10
               dark:from-blue-500/5 dark:via-sky-500/5 dark:to-emerald-500/5"
      />

      <div class="relative p-8 lg:p-10">

        <div class="grid lg:grid-cols-[1.5fr_1fr] gap-10 items-start">

          <!-- LEFT -->
          <div>

            <!-- Badge -->
            <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full
                     bg-blue-500/10 text-blue-400 text-sm"
            >
              <Icon name="mdi:server" />
              Backend Systems Engineering
            </div>

            <h2
              class="mt-4 text-4xl md:text-5xl lg:text-6xl
                     font-bold leading-tight text-slate-900 dark:text-slate-100"
            >
              Production Backend
              <span class="block text-blue-400">Architecture</span>
            </h2>

            <p class="mt-6 max-w-2xl text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              Scalable backend systems built around APIs, distributed services,
              databases, queues, caching layers, and observability-first design.
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
                  <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">backend.request.flow</span>
                </div>

                <div class="px-5 py-4">
                  <p class="text-[10px] uppercase tracking-widest text-sky-500 font-semibold mb-4">Request Flow</p>
                  <div class="flex flex-wrap items-center gap-2 lg:gap-3">

                    <div class="flow-node">
                      <Icon name="mdi:account" class="text-blue-400 text-xl" />
                      <span>User</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />

                    <div class="flow-node">
                      <Icon name="mdi:router-network" class="text-cyan-400 text-xl" />
                      <span>Load Balancer</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />

                    <div class="flow-node">
                      <Icon name="mdi:api" class="text-sky-400 text-xl" />
                      <span>API Gateway</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />

                    <div class="flow-node">
                      <Icon name="mdi:cog" class="text-purple-400 text-xl" />
                      <span>Services</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />

                    <div class="flow-node">
                      <Icon name="mdi:database" class="text-emerald-400 text-xl" />
                      <span>DB / Cache</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />

                    <div class="flow-node">
                      <Icon name="mdi:queue-first-in-last-out" class="text-amber-400 text-xl" />
                      <span>Queue</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />

                    <div class="flow-node">
                      <Icon name="mdi:reply" class="text-blue-400 text-xl" />
                      <span>Response</span>
                    </div>

                  </div>

                  <p class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Requests flow through gateway services, backend APIs, distributed services,
                    databases, caches, and async queues before returning structured responses.
                  </p>
                </div>

              </div>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="grid grid-cols-2 gap-4">

            <!-- CARD: APIs -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5 group/sky">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">api.config</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-sky-500 font-semibold mb-2 transition-colors duration-200 group-hover/sky:text-sky-600 dark:group-hover/sky:text-sky-400">APIs</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">REST / GraphQL endpoints</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['FastAPI', 'REST', 'GraphQL']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-sky-500/10 hover:border-sky-500/40 hover:text-sky-600 dark:hover:text-sky-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

            <!-- CARD: Services -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5 group/purple">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">services.config</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-purple-500 font-semibold mb-2 transition-colors duration-200 group-hover/purple:text-purple-600 dark:group-hover/purple:text-purple-400">Services</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Microservices / modular backend</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['Node.js', 'Nitro', 'Modular']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-purple-500/10 hover:border-purple-500/40 hover:text-purple-600 dark:hover:text-purple-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

            <!-- CARD: Data -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 group/emerald">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">data.config</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold mb-2 transition-colors duration-200 group-hover/emerald:text-emerald-600 dark:group-hover/emerald:text-emerald-400">Data</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">PostgreSQL / Redis / storage</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['PostgreSQL', 'Redis', 'Prisma']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

            <!-- CARD: Async -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 group/amber">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">async.config</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-amber-500 font-semibold mb-2 transition-colors duration-200 group-hover/amber:text-amber-600 dark:group-hover/amber:text-amber-400">Async</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Queues / workers / events</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['BullMQ', 'Workers', 'Events']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-amber-500/10 hover:border-amber-500/40 hover:text-amber-600 dark:hover:text-amber-400">
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
              <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">backend.stack</span>
            </div>

            <div class="px-5 py-4">
              <p class="text-[10px] uppercase tracking-widest text-sky-500 font-semibold mb-3">Backend Stack</p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="t in ['FastAPI', 'Node.js', 'PostgreSQL', 'Redis', 'BullMQ', 'Docker', 'Kubernetes', 'Nginx', 'Observability']" :key="t"
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