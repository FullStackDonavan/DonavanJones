<template>
  <div
    class="relative w-full rounded-xl overflow-hidden
           border border-slate-200 dark:border-slate-500/20
           bg-slate-50 dark:from-[#0d0d1a] dark:via-[#111827] dark:to-[#0f1a24]
           dark:bg-gradient-to-br p-4 md:p-6"
  >
    <!-- LOADING -->
    <div v-if="isLoading" class="flex items-center justify-center h-[540px]">
      <div class="flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-4 border-slate-300/30 border-t-purple-400 rounded-full animate-spin" />
        <p class="text-slate-400 text-sm">Loading diagram…</p>
      </div>
    </div>

    <div v-show="!isLoading">
      <!-- VIEW TABS -->
      <div class="flex gap-2 mb-4 flex-wrap">
        <button
          v-for="v in views"
          :key="v.id"
          @click="activeView = v.id"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          :class="activeView === v.id
            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
            : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/40 hover:text-slate-700 dark:hover:text-slate-200'"
        >
          {{ v.label }}
        </button>
      </div>

      <!-- DIAGRAM -->
      <div
        v-if="vueFlowReady"
        class="w-full h-[520px] rounded-lg overflow-hidden
               border border-slate-200 dark:border-slate-700/40
               bg-white dark:bg-slate-900/50"
      >
        <component
          :key="activeView"
          :is="VueFlowComponent"
          :nodes="currentNodes"
          :edges="currentEdges"
          :nodeTypes="nodeTypes"
          :nodes-draggable="false"
          :nodes-connectable="false"
          :elements-selectable="false"
          :zoom-on-scroll="false"
          :pan-on-drag="true"
          :fit-view-on-init="true"
          :min-zoom="0.4"
          :max-zoom="1.6"
          class="w-full h-full"
        />
      </div>

      <div
        v-else
        class="h-40 flex items-center justify-center rounded-lg
               border border-rose-500/20 bg-rose-500/5 text-slate-400 text-sm"
      >
        Install <code class="mx-1 font-mono text-rose-400">@vue-flow/core</code> to render this diagram.
      </div>

      <!-- LEGEND -->
      <div
        class="mt-4 flex flex-wrap gap-x-5 gap-y-2 px-4 py-2.5 rounded-lg
               bg-white/80 dark:bg-slate-900/60
               border border-slate-200 dark:border-slate-700/40
               text-xs text-slate-500 dark:text-slate-400"
      >
        <div v-for="item in currentLegend" :key="item.label" class="flex items-center gap-1.5">
          <span class="w-5 inline-block" :style="{ height: '2px', background: item.color, opacity: item.dashed ? 0.6 : 1 }" />
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineComponent, h, resolveComponent } from 'vue'

const isLoading        = ref(true)
const VueFlowComponent = ref(null)
const vueFlowReady     = ref(false)
const nodeTypes        = ref({})
const activeView       = ref('rag-pipeline')

const palette = {
  sky:    { bg: 'rgba(14,165,233,0.10)',  border: 'rgba(14,165,233,0.30)',  icon: '#38bdf8' },
  slate:  { bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.30)', icon: '#94a3b8' },
  emerald:{ bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.30)',  icon: '#34d399' },
  amber:  { bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.30)',  icon: '#fbbf24' },
  purple: { bg: 'rgba(168,85,247,0.10)',  border: 'rgba(168,85,247,0.30)',  icon: '#c084fc' },
  cyan:   { bg: 'rgba(6,182,212,0.10)',   border: 'rgba(6,182,212,0.30)',   icon: '#22d3ee' },
  blue:   { bg: 'rgba(59,130,246,0.10)',  border: 'rgba(59,130,246,0.30)',  icon: '#60a5fa' },
  violet: { bg: 'rgba(139,92,246,0.10)',  border: 'rgba(139,92,246,0.30)',  icon: '#a78bfa' },
  green:  { bg: 'rgba(34,197,94,0.10)',   border: 'rgba(34,197,94,0.30)',   icon: '#4ade80' },
}

const views = [
  { id: 'rag-pipeline',   label: 'RAG Pipeline' },
  { id: 'agent-loop',     label: 'Agent Loop' },
  { id: 'model-routing',  label: 'Model Routing' },
]

const allNodes = {
  'rag-pipeline': [
    { id: 'query',    type: 'arch', position: { x: 0,    y: 200 },
      data: { label: 'Client Query',    icon: 'mdi:magnify',              color: 'slate',
              lines: ['User question', 'Search intent'] } },
    { id: 'embed',    type: 'arch', position: { x: 240,  y: 200 },
      data: { label: 'Embed Service',   icon: 'mdi:vector-polyline',      color: 'purple',
              lines: ['Text → vector', 'Embedding model'] } },
    { id: 'weaviate', type: 'arch', position: { x: 500,  y: 200 },
      data: { label: 'Weaviate',        icon: 'mdi:database-search',      color: 'sky',
              lines: ['Semantic search', 'Top-K retrieval', 'Hybrid BM25+vector'] } },
    { id: 'context',  type: 'arch', position: { x: 760,  y: 200 },
      data: { label: 'Context Builder', icon: 'mdi:text-box-multiple',    color: 'amber',
              lines: ['Passage assembly', 'Window packing', 'Token budget'] } },
    { id: 'postgres', type: 'arch', position: { x: 760,  y: 20  },
      data: { label: 'PostgreSQL',      icon: 'logos:postgresql',         color: 'emerald',
              lines: ['Metadata filter', 'Structured facts'] } },
    { id: 'llm',      type: 'arch', position: { x: 1040, y: 200 },
      data: { label: 'LLM',             icon: 'mdi:brain',                color: 'violet',
              lines: ['Grounded inference', 'Source-cited answer'] } },
  ],

  'agent-loop': [
    { id: 'input',    type: 'arch', position: { x: 0,    y: 200 },
      data: { label: 'User Input',      icon: 'mdi:account',              color: 'slate',
              lines: ['Natural language task'] } },
    { id: 'planner',  type: 'arch', position: { x: 240,  y: 200 },
      data: { label: 'Planner Agent',   icon: 'mdi:brain',                color: 'purple',
              lines: ['Task decomposition', 'Step planning', 'Goal tracking'] } },
    { id: 'memory',   type: 'arch', position: { x: 240,  y: 400 },
      data: { label: 'Memory Store',    icon: 'mdi:memory',               color: 'violet',
              lines: ['Session history', 'Long-term context', 'Redis + Weaviate'] } },
    { id: 'router',   type: 'arch', position: { x: 520,  y: 200 },
      data: { label: 'Tool Router',     icon: 'mdi:source-branch',        color: 'sky',
              lines: ['Tool selection', 'Parallel dispatch'] } },
    { id: 'search',   type: 'arch', position: { x: 800,  y: 60  },
      data: { label: 'Search Tool',     icon: 'mdi:magnify',              color: 'amber',
              lines: ['RAG retrieval', 'Web search'] } },
    { id: 'compute',  type: 'arch', position: { x: 800,  y: 220 },
      data: { label: 'Compute Tool',    icon: 'mdi:calculator',           color: 'emerald',
              lines: ['Code execution', 'Data analysis'] } },
    { id: 'generate', type: 'arch', position: { x: 800,  y: 380 },
      data: { label: 'Generate Tool',   icon: 'mdi:text-box-edit',        color: 'blue',
              lines: ['Draft / rewrite', 'Structured output'] } },
    { id: 'output',   type: 'arch', position: { x: 1060, y: 200 },
      data: { label: 'Response',        icon: 'mdi:check-circle',         color: 'green',
              lines: ['Final answer', 'Cited sources'] } },
  ],

  'model-routing': [
    { id: 'request',    type: 'arch', position: { x: 0,    y: 200 },
      data: { label: 'Inference Request', icon: 'mdi:api',               color: 'slate',
              lines: ['From API / worker', 'Prompt + context'] } },
    { id: 'classifier', type: 'arch', position: { x: 260,  y: 200 },
      data: { label: 'Query Classifier',  icon: 'mdi:filter-cog',        color: 'sky',
              lines: ['Complexity score', 'Domain check', 'Latency budget'] } },
    { id: 'llama',      type: 'arch', position: { x: 540,  y: 40  },
      data: { label: 'Llama 3.2 (Local)', icon: 'mdi:home-circle',       color: 'purple',
              lines: ['On-cluster', 'Private / fast', 'Standard queries'] } },
    { id: 'openai',     type: 'arch', position: { x: 540,  y: 200 },
      data: { label: 'OpenAI API',        icon: 'simple-icons:openai',   color: 'green',
              lines: ['Cloud fallback', 'Complex reasoning', 'High-confidence'] } },
    { id: 'jetson',     type: 'arch', position: { x: 540,  y: 360 },
      data: { label: 'Jetson Orin',       icon: 'mdi:chip',              color: 'cyan',
              lines: ['Edge inference', 'Vision models', 'Low-latency local'] } },
    { id: 'cache',      type: 'arch', position: { x: 820,  y: 200 },
      data: { label: 'Redis Cache',       icon: 'logos:redis',           color: 'amber',
              lines: ['Response cache', 'Dedup identical queries'] } },
    { id: 'response',   type: 'arch', position: { x: 1080, y: 200 },
      data: { label: 'Client Response',   icon: 'mdi:check-circle',      color: 'slate',
              lines: ['SSE / JSON', 'Streamed output'] } },
  ],
}

const allEdges = {
  'rag-pipeline': [
    { id: 'e1', source: 'query',    target: 'embed',    animated: true, type: 'smoothstep', class: 'e-ai',
      markerEnd: { type: 'arrowclosed', color: '#a855f7' } },
    { id: 'e2', source: 'embed',    target: 'weaviate', animated: true, type: 'smoothstep', class: 'e-ai',
      markerEnd: { type: 'arrowclosed', color: '#a855f7' } },
    { id: 'e3', source: 'weaviate', target: 'context',               type: 'smoothstep', class: 'e-primary',
      markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },
    { id: 'e4', source: 'postgres', target: 'context',               type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
    { id: 'e5', source: 'context',  target: 'llm',      animated: true, type: 'smoothstep', class: 'e-ai',
      markerEnd: { type: 'arrowclosed', color: '#a855f7' } },
  ],
  'agent-loop': [
    { id: 'e1', source: 'input',   target: 'planner',  animated: true, type: 'smoothstep', class: 'e-primary',
      markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },
    { id: 'e2', source: 'planner', target: 'memory',               type: 'smoothstep', class: 'e-support',
      markerStart: { type: 'arrowclosed', color: '#94a3b8' },
      markerEnd:   { type: 'arrowclosed', color: '#94a3b8' } },
    { id: 'e3', source: 'planner', target: 'router',               type: 'smoothstep', class: 'e-ai',
      markerEnd: { type: 'arrowclosed', color: '#a855f7' } },
    { id: 'e4', source: 'router',  target: 'search',               type: 'smoothstep', class: 'e-queue',
      markerEnd: { type: 'arrowclosed', color: '#f97316' } },
    { id: 'e5', source: 'router',  target: 'compute',              type: 'smoothstep', class: 'e-queue',
      markerEnd: { type: 'arrowclosed', color: '#f97316' } },
    { id: 'e6', source: 'router',  target: 'generate',             type: 'smoothstep', class: 'e-queue',
      markerEnd: { type: 'arrowclosed', color: '#f97316' } },
    { id: 'e7', source: 'search',  target: 'output',               type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
    { id: 'e8', source: 'compute', target: 'output',               type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
    { id: 'e9', source: 'generate',target: 'output',               type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
  ],
  'model-routing': [
    { id: 'e1', source: 'request',    target: 'classifier', animated: true, type: 'smoothstep', class: 'e-primary',
      markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },
    { id: 'e2', source: 'classifier', target: 'llama',                      type: 'smoothstep', class: 'e-ai',
      markerEnd: { type: 'arrowclosed', color: '#a855f7' } },
    { id: 'e3', source: 'classifier', target: 'openai',                     type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
    { id: 'e4', source: 'classifier', target: 'jetson',                     type: 'smoothstep', class: 'e-support',
      markerEnd: { type: 'arrowclosed', color: '#22d3ee' } },
    { id: 'e5', source: 'llama',      target: 'cache',                      type: 'smoothstep', class: 'e-queue',
      markerEnd: { type: 'arrowclosed', color: '#f97316' } },
    { id: 'e6', source: 'openai',     target: 'cache',                      type: 'smoothstep', class: 'e-queue',
      markerEnd: { type: 'arrowclosed', color: '#f97316' } },
    { id: 'e7', source: 'jetson',     target: 'cache',                      type: 'smoothstep', class: 'e-queue',
      markerEnd: { type: 'arrowclosed', color: '#f97316' } },
    { id: 'e8', source: 'cache',      target: 'response',   animated: true, type: 'smoothstep', class: 'e-primary',
      markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },
  ],
}

const legends = {
  'rag-pipeline': [
    { color: '#a855f7', label: 'Embedding / AI' },
    { color: '#0ea5e9', label: 'Retrieval flow' },
    { color: '#10b981', label: 'Metadata' },
  ],
  'agent-loop': [
    { color: '#0ea5e9', label: 'Input / Output' },
    { color: '#a855f7', label: 'Agent dispatch' },
    { color: '#f97316', label: 'Tool calls' },
    { color: '#10b981', label: 'Results' },
    { color: '#94a3b8', label: 'Memory read/write', dashed: true },
  ],
  'model-routing': [
    { color: '#0ea5e9', label: 'Request path' },
    { color: '#a855f7', label: 'Local inference' },
    { color: '#10b981', label: 'Cloud inference' },
    { color: '#22d3ee', label: 'Edge inference' },
    { color: '#f97316', label: 'Cache write' },
  ],
}

const currentNodes  = computed(() => allNodes[activeView.value]  ?? [])
const currentEdges  = computed(() => allEdges[activeView.value]  ?? [])
const currentLegend = computed(() => legends[activeView.value]   ?? [])

onMounted(async () => {
  try {
    const mod = await import('@vue-flow/core')
    await import('@vue-flow/core/dist/style.css')
    const { VueFlow, Handle, Position } = mod
    const IconComponent = resolveComponent('Icon')

    const ArchNode = defineComponent({
      props: ['id', 'data'],
      setup(props) {
        return () => {
          const c = palette[props.data.color] ?? palette.slate
          return h('div', {}, [
            h('div', { class: 'ad-node', style: { background: c.bg, borderColor: c.border } }, [
              h('div', { class: 'ad-node-head' }, [
                h('div', { class: 'ad-icon', style: { borderColor: c.border } }, [
                  h(IconComponent, { name: props.data.icon, style: { color: c.icon, fontSize: '24px' } }),
                ]),
                h('span', { class: 'ad-label' }, props.data.label),
              ]),
              props.data.lines?.length
                ? h('ul', { class: 'ad-lines' }, props.data.lines.map(l => h('li', l)))
                : null,
            ]),
            h(Handle, { type: 'target', position: Position.Left,   class: 'ad-handle' }),
            h(Handle, { type: 'source', position: Position.Right,  class: 'ad-handle' }),
            h(Handle, { id: 'top',    type: 'target', position: Position.Top,    class: 'ad-handle' }),
            h(Handle, { id: 'bottom', type: 'source', position: Position.Bottom, class: 'ad-handle' }),
          ])
        }
      },
    })

    VueFlowComponent.value = VueFlow
    nodeTypes.value = { arch: ArchNode }
    vueFlowReady.value = true
  } catch {
    console.error('VueFlow not installed.')
  }
  isLoading.value = false
})
</script>

<style scoped>
:deep(.ad-node) {
  border: 1px solid; border-radius: 10px; padding: 10px 12px;
  min-width: 158px; max-width: 230px; box-sizing: border-box; cursor: default;
  @apply dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)];
}
:deep(.ad-node-head) { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
:deep(.ad-icon) {
  width: 38px; height: 38px; border-radius: 6px; border: 1px solid;
  background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
:deep(.ad-label) { font-size: 12.5px; font-weight: 600; line-height: 1.2; color: #1e293b; @apply dark:text-slate-100; }
:deep(.ad-lines) { list-style: none; margin: 0; padding: 0; }
:deep(.ad-lines li) { font-size: 11px; color: #475569; line-height: 1.5; padding-left: 10px; position: relative; @apply dark:text-slate-300; }
:deep(.ad-lines li::before) { content: '·'; position: absolute; left: 2px; font-weight: bold; color: #94a3b8; @apply dark:text-slate-500; }
:deep(.ad-handle) { width: 6px !important; height: 6px !important; background: transparent !important; border: none !important; box-shadow: none !important; pointer-events: none !important; opacity: 0 !important; }
:deep(.vue-flow__pane)        { cursor: grab; }
:deep(.vue-flow__pane:active) { cursor: grabbing; }
:deep(.vue-flow__node.selected > *), :deep(.vue-flow__node:focus > *) { outline: none !important; box-shadow: none !important; }
:deep(.vue-flow__edge.e-primary .vue-flow__edge-path) { stroke: #0ea5e9; stroke-width: 1.8px; }
:deep(.vue-flow__edge.e-data    .vue-flow__edge-path) { stroke: #10b981; stroke-width: 1.6px; }
:deep(.vue-flow__edge.e-queue   .vue-flow__edge-path) { stroke: #f97316; stroke-width: 1.6px; }
:deep(.vue-flow__edge.e-ai      .vue-flow__edge-path) { stroke: #a855f7; stroke-width: 1.6px; }
:deep(.vue-flow__edge.e-support .vue-flow__edge-path) { stroke: #94a3b8; stroke-width: 1.4px; stroke-dasharray: 5 5; }
:deep(.vue-flow__background) { color: rgba(100,116,139,0.12); }
</style>
