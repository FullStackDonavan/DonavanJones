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
              <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden">

                <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <div class="flex gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  </div>
                  <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">ai.request.flow</span>
                </div>

                <div class="px-5 py-4">
                  <p class="text-[10px] uppercase tracking-widest text-purple-500 font-semibold mb-4">AI Request Flow</p>
                  <div class="flex flex-wrap items-center gap-2 lg:gap-3">

                    <div class="flow-node">
                      <Icon name="mdi:account" class="text-sky-400 text-xl" />
                      <span>User</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />

                    <div class="flow-node">
                      <Icon name="mdi:api" class="text-blue-400 text-xl" />
                      <span>API Gateway</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />

                    <div class="flow-node">
                      <Icon name="mdi:database-search" class="text-emerald-400 text-xl" />
                      <span>Retrieval</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />

                    <div class="flow-node">
                      <Icon name="mdi:brain" class="text-purple-400 text-xl" />
                      <span>LLM Reasoning</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />

                    <div class="flow-node">
                      <Icon name="mdi:tools" class="text-amber-400 text-xl" />
                      <span>Agents / Tools</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />

                    <div class="flow-node">
                      <Icon name="mdi:reply" class="text-sky-400 text-xl" />
                      <span>Response</span>
                    </div>

                  </div>

                  <p class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    AI requests pass through retrieval systems, LLM reasoning layers, tool execution,
                    memory stores, and structured response generation.
                  </p>
                </div>

              </div>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="grid grid-cols-2 gap-4">

            <!-- CARD: Retrieval -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 group/emerald">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">retrieval.config</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold mb-2 transition-colors duration-200 group-hover/emerald:text-emerald-600 dark:group-hover/emerald:text-emerald-400">Retrieval</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Vector DB, embeddings, hybrid search</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['Weaviate', 'Embeddings', 'Hybrid']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

            <!-- CARD: Agents -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5 group/sky">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">agents.config</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-sky-500 font-semibold mb-2 transition-colors duration-200 group-hover/sky:text-sky-600 dark:group-hover/sky:text-sky-400">Agents</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Tool use, planning loops, workflows</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['Tool Use', 'Planning', 'BullMQ']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-sky-500/10 hover:border-sky-500/40 hover:text-sky-600 dark:hover:text-sky-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

            <!-- CARD: Memory -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5 group/purple">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">memory.config</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-purple-500 font-semibold mb-2 transition-colors duration-200 group-hover/purple:text-purple-600 dark:group-hover/purple:text-purple-400">Memory</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Long-term context + summarization</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['Redis', 'Weaviate', 'Sessions']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-purple-500/10 hover:border-purple-500/40 hover:text-purple-600 dark:hover:text-purple-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

            <!-- CARD: Evaluation -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 group/amber">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">eval.config</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-amber-500 font-semibold mb-2 transition-colors duration-200 group-hover/amber:text-amber-600 dark:group-hover/amber:text-amber-400">Evaluation</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Metrics, evals, hallucination tracking</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['Tracing', 'Metrics', 'Prometheus']" :key="t"
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
              <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">ai.stack</span>
            </div>

            <div class="px-5 py-4">
              <p class="text-[10px] uppercase tracking-widest text-purple-500 font-semibold mb-3">AI Stack</p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="t in ['RAG', 'Vector DBs', 'LLMs', 'Embeddings', 'Agents', 'FastAPI', 'Redis', 'PostgreSQL', 'Weaviate', 'Observability']" :key="t"
                  class="text-[11px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-purple-500/10 hover:border-purple-500/40 hover:text-purple-600 dark:hover:text-purple-400">
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