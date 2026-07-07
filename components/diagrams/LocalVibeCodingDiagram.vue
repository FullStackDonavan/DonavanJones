<template>
  <div
    class="relative w-full rounded-xl overflow-hidden
           border border-slate-200 dark:border-slate-500/20
           bg-slate-50 dark:from-[#0d0d1a] dark:via-[#111827] dark:to-[#0f1a24]
           dark:bg-gradient-to-br p-4 md:p-6"
  >
    <div class="flex gap-2 mb-4 flex-wrap">
      <button
        v-for="v in views"
        :key="v.id"
        @click="activeView = v.id"
        class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        :class="activeView === v.id
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
          : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/40 hover:text-slate-700 dark:hover:text-slate-200'"
      >
        {{ v.label }}
      </button>
    </div>

    <div class="w-full min-h-[420px] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700/40 bg-white dark:bg-slate-900/50 p-6">
      <div class="flex flex-wrap items-stretch gap-4">
        <template v-for="(stage, i) in currentStages" :key="stage.label">
          <div
            class="stage-card"
            :style="{ background: palette[stage.color].bg, borderColor: palette[stage.color].border }"
          >
            <div class="stage-icon" :style="{ borderColor: palette[stage.color].border }">
              <Icon :name="stage.icon" :style="{ color: palette[stage.color].icon, fontSize: '22px' }" />
            </div>
            <p class="stage-label">{{ stage.label }}</p>
            <ul class="stage-lines">
              <li v-for="l in stage.lines" :key="l">{{ l }}</li>
            </ul>
          </div>
          <div v-if="i < currentStages.length - 1" class="flex items-center">
            <Icon name="mdi:arrow-right-thin" class="text-slate-400 dark:text-slate-600 text-2xl" />
          </div>
        </template>
      </div>
    </div>

    <div
      class="mt-4 flex flex-wrap gap-x-5 gap-y-2 px-4 py-2.5 rounded-lg
             bg-white/80 dark:bg-slate-900/60
             border border-slate-200 dark:border-slate-700/40
             text-xs text-slate-500 dark:text-slate-400"
    >
      <div v-for="item in currentLegend" :key="item.label" class="flex items-center gap-1.5">
        <span class="w-5 inline-block" :style="{ height: '2px', background: item.color }" />
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeView = ref('coding-loop')

const palette = {
  sky:     { bg: 'rgba(14,165,233,0.10)',  border: 'rgba(14,165,233,0.30)',  icon: '#38bdf8' },
  emerald: { bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.30)',  icon: '#34d399' },
  purple:  { bg: 'rgba(168,85,247,0.10)',  border: 'rgba(168,85,247,0.30)',  icon: '#c084fc' },
  amber:   { bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.30)',  icon: '#fbbf24' },
  rose:    { bg: 'rgba(244,63,94,0.10)',   border: 'rgba(244,63,94,0.30)',   icon: '#fb7185' },
  slate:   { bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.30)', icon: '#94a3b8' },
}

const views = [
  { id: 'coding-loop',  label: 'Coding Agent Loop' },
  { id: 'hardware-tier', label: 'Hardware Routing' },
]

const stages = {
  'coding-loop': [
    { label: 'Task', icon: 'mdi:account', color: 'slate', lines: ['Natural language request'] },
    { label: 'Codebase Retrieval', icon: 'mdi:magnify', color: 'emerald', lines: ['AST-chunked index', 'Semantic search'] },
    { label: 'Ornith-9B Draft', icon: 'mdi:brain', color: 'purple', lines: ['Q4_K_M, ~5.6GB', 'Jetson-hosted'] },
    { label: 'Ornith-1.0-35B Verify', icon: 'mdi:shield-check', color: 'rose', lines: ['3090-hosted', 'Pass or retry'] },
    { label: 'OpenClaw Diff', icon: 'mdi:file-edit', color: 'amber', lines: ['Confirmation gate', 'Shell + file tools'] },
    { label: 'Review / Apply', icon: 'mdi:check-circle', color: 'sky', lines: ['Human review', 'Applied to disk'] },
  ],
  'hardware-tier': [
    { label: 'Request', icon: 'mdi:api', color: 'slate', lines: ['Classified by type'] },
    { label: 'Jetson Cluster', icon: 'mdi:chip', color: 'emerald', lines: ['Ornith-9B draft', 'Embeddings'] },
    { label: 'RTX 3090', icon: 'mdi:expansion-card', color: 'purple', lines: ['Ornith-1.0-35B verify', 'Large-context checks'] },
    { label: 'Response', icon: 'mdi:reply', color: 'sky', lines: ['Streamed back to agent'] },
  ],
}

const legends = {
  'coding-loop': [
    { color: '#34d399', label: 'Retrieval' },
    { color: '#c084fc', label: 'Draft model' },
    { color: '#fb7185', label: 'Verify model' },
    { color: '#fbbf24', label: 'Tool execution' },
  ],
  'hardware-tier': [
    { color: '#34d399', label: 'Always-on edge tier (draft)' },
    { color: '#c084fc', label: 'Desktop GPU tier (verify)' },
  ],
}

const currentStages = computed(() => stages[activeView.value] ?? [])
const currentLegend = computed(() => legends[activeView.value] ?? [])
</script>

<style scoped>
.stage-card {
  border: 1px solid; border-radius: 10px; padding: 12px 14px;
  min-width: 150px; max-width: 220px; box-sizing: border-box;
}
.stage-icon {
  width: 36px; height: 36px; border-radius: 6px; border: 1px solid;
  background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; margin-bottom: 8px;
}
.stage-label { font-size: 12.5px; font-weight: 600; line-height: 1.2; color: #1e293b; @apply dark:text-slate-100; margin-bottom: 6px; }
.stage-lines { list-style: none; margin: 0; padding: 0; }
.stage-lines li { font-size: 11px; color: #475569; line-height: 1.5; padding-left: 10px; position: relative; @apply dark:text-slate-300; }
.stage-lines li::before { content: '·'; position: absolute; left: 2px; font-weight: bold; color: #94a3b8; @apply dark:text-slate-500; }
</style>
