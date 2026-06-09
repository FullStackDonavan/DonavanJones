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
                     bg-purple-500/10 text-purple-400 text-sm"
            >
              <Icon name="mdi:brain" />
              AI Systems Engineering
            </div>

            <h2
              class="mt-4 text-4xl md:text-5xl lg:text-6xl
                     font-bold leading-tight text-slate-900 dark:text-slate-100"
            >
              Production AI
              <span class="block text-sky-400">Architecture</span>
            </h2>

            <p class="mt-6 max-w-2xl text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              Scalable AI systems combining retrieval, reasoning, memory, evaluation,
              and tool-using agents built for real production workloads.
            </p>

            <!-- FLOW -->
            <div class="mt-10">

              <div class="flex items-center gap-3 mb-5">
                <div class="w-8 h-px bg-sky-500/50"></div>
                <div class="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-400">
                  <Icon name="mdi:source-branch" class="text-sky-400" />
                  AI Request Flow
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
                    <Icon name="mdi:api" class="text-blue-400 text-xl" />
                    <span>API Gateway</span>
                  </div>

                  <Icon name="mdi:chevron-right" class="text-slate-600 hidden sm:block" />

                  <div class="flow-node">
                    <Icon name="mdi:database-search" class="text-emerald-400 text-xl" />
                    <span>Retrieval</span>
                  </div>

                  <Icon name="mdi:chevron-right" class="text-slate-600 hidden sm:block" />

                  <div class="flow-node">
                    <Icon name="mdi:brain" class="text-purple-400 text-xl" />
                    <span>LLM Reasoning</span>
                  </div>

                  <Icon name="mdi:chevron-right" class="text-slate-600 hidden sm:block" />

                  <div class="flow-node">
                    <Icon name="mdi:tools" class="text-amber-400 text-xl" />
                    <span>Agents / Tools</span>
                  </div>

                  <Icon name="mdi:chevron-right" class="text-slate-600 hidden sm:block" />

                  <div class="flow-node">
                    <Icon name="mdi:reply" class="text-sky-400 text-xl" />
                    <span>Response</span>
                  </div>

                </div>

                <p class="mt-4 text-xs text-slate-500 border-t border-slate-800 pt-4">
                  AI requests pass through retrieval systems, LLM reasoning layers, tool execution,
                  memory stores, and structured response generation.
                </p>
              </div>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="grid grid-cols-2 gap-4 p-4 rounded-2xl
                      border border-slate-300 dark:border-slate-800/60
                      bg-slate-50/80 dark:bg-slate-950/30 backdrop-blur-sm">

            <!-- CARD -->
            <div class="group rounded-xl p-4 border border-slate-300 dark:border-slate-800
                        bg-slate-100 dark:bg-slate-900/40">

              <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/60">
                <Icon name="mdi:database-search" class="text-emerald-400 text-6xl shrink-0" />
                <span class="text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300 text-right">
                  Retrieval
                </span>
              </div>

              <div class="mt-4 text-sm text-slate-600 dark:text-slate-400">
                Vector DB, embeddings, hybrid search
              </div>
            </div>

            <!-- CARD -->
            <div class="group rounded-xl p-4 border border-slate-300 dark:border-slate-800
                        bg-slate-100 dark:bg-slate-900/40">

              <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/60">
                <Icon name="mdi:robot" class="text-blue-400 text-6xl shrink-0" />
                <span class="text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300 text-right">
                  Agents
                </span>
              </div>

              <div class="mt-4 text-sm text-slate-600 dark:text-slate-400">
                Tool use, planning loops, workflows
              </div>
            </div>

            <!-- CARD -->
            <div class="group rounded-xl p-4 border border-slate-300 dark:border-slate-800
                        bg-slate-100 dark:bg-slate-900/40">

              <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/60">
                <Icon name="mdi:brain" class="text-purple-400 text-6xl shrink-0" />
                <span class="text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300 text-right">
                  Memory
                </span>
              </div>

              <div class="mt-4 text-sm text-slate-600 dark:text-slate-400">
                Long-term context + summarization
              </div>
            </div>

            <!-- CARD -->
            <div class="group rounded-xl p-4 border border-slate-300 dark:border-slate-800
                        bg-slate-100 dark:bg-slate-900/40">

              <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/60">
                <Icon name="mdi:chart-box" class="text-amber-400 text-6xl shrink-0" />
                <span class="text-xs uppercase tracking-widest text-slate-700 dark:text-slate-300 text-right">
                  Evaluation
                </span>
              </div>

              <div class="mt-4 text-sm text-slate-600 dark:text-slate-400">
                Metrics, evals, hallucination tracking
              </div>
            </div>

          </div>
        </div>



        <!-- STACK -->
        <div class="mt-10 pt-8 border-t border-slate-800">

          <div class="text-xs uppercase tracking-widest text-slate-500 mb-4">
            AI Stack
          </div>

          <div class="flex flex-wrap gap-2">
            <span class="tech-badge">RAG</span>
            <span class="tech-badge">Vector DBs</span>
            <span class="tech-badge">LLMs</span>
            <span class="tech-badge">Embeddings</span>
            <span class="tech-badge">Agents</span>
            <span class="tech-badge">FastAPI</span>
            <span class="tech-badge">Redis</span>
            <span class="tech-badge">PostgreSQL</span>
            <span class="tech-badge">Weaviate</span>
            <span class="tech-badge">Observability</span>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>