<template>
  <div class="system-overview">
    <div
      class="relative z-10 mb-8 overflow-hidden rounded-2xl
             border border-slate-200 dark:border-emerald-500/20
             bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm"
    >
      <!-- Glow -->
      <div
        class="absolute inset-0
               bg-gradient-to-r from-emerald-200/20 via-sky-200/10 to-purple-200/10
               dark:from-emerald-500/5 dark:via-sky-500/5 dark:to-purple-500/5"
      />

      <div class="relative p-8 lg:p-10">

        <div class="grid lg:grid-cols-[1.5fr_1fr] gap-10 items-start">

          <!-- LEFT -->
          <div>

            <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full
                     bg-emerald-500/10 text-emerald-400 text-sm"
            >
              <Icon name="mdi:laptop" />
              Local Vibe Coding
            </div>

            <h2
              class="mt-4 text-4xl md:text-5xl lg:text-6xl
                     font-bold leading-tight text-slate-900 dark:text-slate-100"
            >
              AI Coding, Owned
              <span class="block text-emerald-400">End to End</span>
            </h2>

            <p class="mt-6 max-w-2xl text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              A local coding agent running on hardware I own — Ornith-9B drafting and
              Ornith-1.0-35B verifying on Ollama, a custom agent loop, and a hybrid
              Jetson/RTX 3090 tier, replacing most day-to-day hosted API usage.
            </p>

            <div class="mt-10">
              <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden">
                <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <div class="flex gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  </div>
                  <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">coding.agent.flow</span>
                </div>

                <div class="px-5 py-4">
                  <p class="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold mb-4">Local Coding Agent Flow</p>
                  <div class="flex flex-wrap items-center gap-2 lg:gap-3">
                    <div class="flow-node">
                      <Icon name="mdi:account" class="text-sky-400 text-xl" />
                      <span>Task</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />
                    <div class="flow-node">
                      <Icon name="mdi:magnify" class="text-emerald-400 text-xl" />
                      <span>Codebase Retrieval</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />
                    <div class="flow-node">
                      <Icon name="mdi:brain" class="text-purple-400 text-xl" />
                      <span>Ornith-9B Draft</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />
                    <div class="flow-node">
                      <Icon name="mdi:shield-check" class="text-rose-400 text-xl" />
                      <span>Ornith-1.0-35B Verify</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />
                    <div class="flow-node">
                      <Icon name="mdi:file-edit" class="text-amber-400 text-xl" />
                      <span>OpenClaw Diff</span>
                    </div>
                    <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600 hidden sm:block" />
                    <div class="flow-node">
                      <Icon name="mdi:check-circle" class="text-sky-400 text-xl" />
                      <span>Review</span>
                    </div>
                  </div>

                  <p class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    A local coding request flows through codebase retrieval, a locally-hosted
                    Ornith-9B draft, an Ornith-1.0-35B verification pass, and a confirmation-gated
                    diff before anything touches disk.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="grid grid-cols-2 gap-4">

            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 group/emerald">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">models.config</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold mb-2 transition-colors duration-200 group-hover/emerald:text-emerald-600 dark:group-hover/emerald:text-emerald-400">Models</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Ornith-9B drafts, Ornith-1.0-35B verifies, both quantized via Ollama</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['Ornith-9B', 'Ornith-1.0-35B', 'Ollama', 'GGUF']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400">
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
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">agent.config</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-sky-500 font-semibold mb-2 transition-colors duration-200 group-hover/sky:text-sky-600 dark:group-hover/sky:text-sky-400">Agent Loop</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">OpenClaw — tool calling, confirmation gates</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['OpenClaw', 'Tool Use', 'Diff Review']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-sky-500/10 hover:border-sky-500/40 hover:text-sky-600 dark:hover:text-sky-400">
                    {{ t }}
                  </span>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5 group/purple">
              <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">retrieval.config</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-purple-500 font-semibold mb-2 transition-colors duration-200 group-hover/purple:text-purple-600 dark:group-hover/purple:text-purple-400">Retrieval</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">Function/class-level codebase indexing</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['AST Chunking', 'Embeddings', 'File Watch']" :key="t"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-purple-500/10 hover:border-purple-500/40 hover:text-purple-600 dark:hover:text-purple-400">
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
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">hardware.config</span>
              </div>
              <div class="px-4 py-3">
                <p class="text-[10px] uppercase tracking-widest text-amber-500 font-semibold mb-2 transition-colors duration-200 group-hover/amber:text-amber-600 dark:group-hover/amber:text-amber-400">Hardware</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-3">RTX 3090 + Jetson Orin hybrid tier</p>
                <div class="flex flex-wrap gap-1.5">
                  <span v-for="t in ['RTX 3090', 'Jetson Orin', '24GB VRAM']" :key="t"
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
              <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">local.stack</span>
            </div>
            <div class="px-5 py-4">
              <p class="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold mb-3">Local Coding Stack</p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="t in ['Ornith-9B', 'Ornith-1.0-35B', 'Ollama', 'OpenClaw', 'RTX 3090', 'Jetson Orin', 'k3s', 'Python']" :key="t"
                  class="text-[11px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 cursor-default transition-all duration-150 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400">
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
