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

              <div class="flex items-center gap-3 mb-5">
                <div class="w-8 h-px bg-blue-500/50"></div>
                <div class="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-400">
                  <Icon name="mdi:source-branch" class="text-blue-400" />
                  Request Flow
                </div>
              </div>

              <div
                class="rounded-2xl border border-slate-200 dark:border-slate-800
                       bg-white/70 dark:bg-slate-950/40 backdrop-blur-sm p-5"
              >
                <div class="flex flex-wrap items-center gap-2 lg:gap-3">

                  <div class="flow-node">
                    <Icon name="mdi:account" class="text-blue-400 text-xl" />
                    <span>User</span>
                  </div>

                  <Icon name="mdi:chevron-right" class="text-slate-600 hidden sm:block" />

                  <div class="flow-node">
                    <Icon name="mdi:router-network" class="text-cyan-400 text-xl" />
                    <span>Load Balancer</span>
                  </div>

                  <Icon name="mdi:chevron-right" class="text-slate-600 hidden sm:block" />

                  <div class="flow-node">
                    <Icon name="mdi:api" class="text-sky-400 text-xl" />
                    <span>API Gateway</span>
                  </div>

                  <Icon name="mdi:chevron-right" class="text-slate-600 hidden sm:block" />

                  <div class="flow-node">
                    <Icon name="mdi:cog" class="text-purple-400 text-xl" />
                    <span>Services</span>
                  </div>

                  <Icon name="mdi:chevron-right" class="text-slate-600 hidden sm:block" />

                  <div class="flow-node">
                    <Icon name="mdi:database" class="text-emerald-400 text-xl" />
                    <span>DB / Cache</span>
                  </div>

                  <Icon name="mdi:chevron-right" class="text-slate-600 hidden sm:block" />

                  <div class="flow-node">
                    <Icon name="mdi:queue-first-in-last-out" class="text-amber-400 text-xl" />
                    <span>Queue</span>
                  </div>

                  <Icon name="mdi:chevron-right" class="text-slate-600 hidden sm:block" />

                  <div class="flow-node">
                    <Icon name="mdi:reply" class="text-blue-400 text-xl" />
                    <span>Response</span>
                  </div>

                </div>

                <p class="mt-4 text-xs text-slate-500 border-t border-slate-800 pt-4">
                  Requests flow through gateway services, backend APIs, distributed services,
                  databases, caches, and async queues before returning structured responses.
                </p>
              </div>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="grid grid-cols-2 gap-4 p-4 rounded-2xl
                      border border-slate-300 dark:border-slate-800/60
                      bg-slate-50/80 dark:bg-slate-950/30 backdrop-blur-sm">

            <!-- APIs -->
            <div class="group rounded-xl p-4 border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40">
              <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/60">
                <Icon name="mdi:api" class="text-sky-400 text-6xl" />
                <span class="text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300 text-right">
                  APIs
                </span>
              </div>
              <div class="mt-4 text-sm text-slate-600 dark:text-slate-400">
                REST / GraphQL endpoints
              </div>
            </div>

            <!-- Services -->
            <div class="group rounded-xl p-4 border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40">
              <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/60">
                <Icon name="mdi:cog" class="text-purple-400 text-6xl" />
                <span class="text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300 text-right">
                  Services
                </span>
              </div>
              <div class="mt-4 text-sm text-slate-600 dark:text-slate-400">
                Microservices / modular backend
              </div>
            </div>

            <!-- Database -->
            <div class="group rounded-xl p-4 border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40">
              <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/60">
                <Icon name="mdi:database" class="text-emerald-400 text-6xl" />
                <span class="text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300 text-right">
                  Data
                </span>
              </div>
              <div class="mt-4 text-sm text-slate-600 dark:text-slate-400">
                PostgreSQL / Redis / storage
              </div>
            </div>

            <!-- Async -->
            <div class="group rounded-xl p-4 border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40">
              <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/60">
                <Icon name="mdi:swap-horizontal" class="text-amber-400 text-6xl" />
                <span class="text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300 text-right">
                  Async
                </span>
              </div>
              <div class="mt-4 text-sm text-slate-600 dark:text-slate-400">
                Queues / workers / events
              </div>
            </div>

          </div>
        </div>

        <!-- IMAGES -->
        <div class="mt-10 grid md:grid-cols-4 gap-4">

          <img src="https://placehold.co/600x400?text=API+Gateway" class="rounded-xl border border-slate-700" alt="API Gateway diagram" />
          <img src="https://placehold.co/600x400?text=Microservices" class="rounded-xl border border-slate-700" alt="Microservices architecture diagram" />
          <img src="https://placehold.co/600x400?text=PostgreSQL+DB" class="rounded-xl border border-slate-700" alt="PostgreSQL database diagram" />
          <img src="https://placehold.co/600x400?text=Queue+System" class="rounded-xl border border-slate-700" alt="Queue System diagram" />

        </div>

        <!-- STACK -->
        <div class="mt-10 pt-8 border-t border-slate-800">

          <div class="text-xs uppercase tracking-widest text-slate-500 mb-4">
            Backend Stack
          </div>

          <div class="flex flex-wrap gap-2">
            <span class="tech-badge">FastAPI</span>
            <span class="tech-badge">Node.js</span>
            <span class="tech-badge">PostgreSQL</span>
            <span class="tech-badge">Redis</span>
            <span class="tech-badge">Kafka / Queues</span>
            <span class="tech-badge">Docker</span>
            <span class="tech-badge">Kubernetes</span>
            <span class="tech-badge">Nginx</span>
            <span class="tech-badge">Observability</span>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>