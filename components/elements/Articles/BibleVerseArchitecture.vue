<template>
  <div
    class="relative w-full rounded-xl overflow-hidden
           border border-slate-200 dark:border-slate-500/20
           bg-gradient-to-br from-slate-50 to-slate-100
           dark:from-[#0d0d1a] dark:via-[#111827] dark:to-[#0f1a24]
           p-4 md:p-6"
  >
    <!-- LOADING -->
    <div v-if="isLoading" class="flex items-center justify-center h-[540px]">
      <div class="flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-4 border-slate-300/30 border-t-sky-400 rounded-full animate-spin" />
        <p class="text-slate-400 text-sm">Loading diagram…</p>
      </div>
    </div>

    <!-- DIAGRAM -->
    <div v-show="!isLoading">
      <div
        v-if="vueFlowReady"
        class="w-full h-[580px] rounded-lg overflow-hidden
               border border-slate-200 dark:border-slate-700/40
               bg-white dark:bg-slate-900/50"
      >
        <component
          :is="VueFlowComponent"
          :nodes="nodes"
          :edges="edges"
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
        <div class="flex items-center gap-1.5">
          <span class="w-5 h-px bg-sky-400 inline-block" style="height:2px" />
          Client request
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-5 inline-block" style="height:2px;background:#10b981" />
          Data ops
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-5 inline-block" style="height:2px;background:#f97316" />
          Queue dispatch
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-5 inline-block" style="height:2px;background:#06b6d4" />
          Real-time
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-5 inline-block" style="height:2px;background:#a855f7" />
          AI pipeline
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-5 inline-block" style="height:2px;background:#3b82f6" />
          Storage
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineComponent, h, resolveComponent } from 'vue'

const isLoading   = ref(true)
const VueFlowComponent = ref(null)
const vueFlowReady = ref(false)
const nodeTypes   = ref({})

// ── Colour palette (inline styles – avoids Tailwind purge issues) ──────────
const palette = {
  sky:    { bg: 'rgba(14,165,233,0.10)',  border: 'rgba(14,165,233,0.30)',  icon: '#38bdf8' },
  slate:  { bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.30)', icon: '#94a3b8' },
  emerald:{ bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.30)',  icon: '#34d399' },
  amber:  { bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.30)',  icon: '#fbbf24' },
  orange: { bg: 'rgba(249,115,22,0.10)',  border: 'rgba(249,115,22,0.30)',  icon: '#fb923c' },
  purple: { bg: 'rgba(168,85,247,0.10)',  border: 'rgba(168,85,247,0.30)',  icon: '#c084fc' },
  cyan:   { bg: 'rgba(6,182,212,0.10)',   border: 'rgba(6,182,212,0.30)',   icon: '#22d3ee' },
  blue:   { bg: 'rgba(59,130,246,0.10)',  border: 'rgba(59,130,246,0.30)',  icon: '#60a5fa' },
  violet: { bg: 'rgba(139,92,246,0.10)',  border: 'rgba(139,92,246,0.30)',  icon: '#a78bfa' },
  green:  { bg: 'rgba(34,197,94,0.10)',   border: 'rgba(34,197,94,0.30)',   icon: '#4ade80' },
}

// ── Nodes ──────────────────────────────────────────────────────────────────
//
//  Layout (avoids edge crossings):
//
//  ai-orch(280,10) ─────────────────────── weaviate(560,185)
//       │(vertical)                              ↕ bidirectional
//  client(0,270) → nitro(280,270) → postgres(560,20)
//                                  → redis(560,350)   → websocket(840,270)
//                                  → bullmq(560,475)  → ffmpeg(840,475) → minio(1120,475)
//
//  AI chain (exits ai-orch right, clears col-3 by routing above postgres):
//  ai-orch → llama(1120,5)  / openai(1120,145)
//
const nodes = ref([

  // ── Client ───────────────────────────────────────────────────────────────
  { id: 'client', type: 'arch', position: { x: 0, y: 270 },
    data: { label: 'Nuxt 3 Client', icon: 'logos:nuxt-icon', color: 'sky',
            lines: ['Vue 3 + TypeScript', 'SSR / SPA hybrid', 'Composable data layer'] } },

  // ── API gateway (nitro + ai-orch share same x column) ────────────────────
  { id: 'nitro', type: 'arch', position: { x: 280, y: 270 },
    data: { label: 'Nitro Server', icon: 'logos:nodejs-icon', color: 'slate',
            lines: ['REST API endpoints', 'Domain orchestration', 'Job + event dispatch'] } },

  // ai-orch sits directly above nitro → edge goes straight up, zero crossings
  { id: 'ai-orch', type: 'arch', position: { x: 280, y: 10 },
    data: { label: 'AI Orchestration', icon: 'mdi:brain', color: 'violet',
            lines: ['Prompt construction', 'Complexity routing', 'Context window mgmt', 'SSE streaming'] } },

  // ── Data column (col 3, x=560) ───────────────────────────────────────────
  { id: 'postgres', type: 'arch', position: { x: 560, y: -120 },
    data: { label: 'PostgreSQL', icon: 'logos:postgresql', color: 'emerald',
            lines: ['Prisma ORM', 'Users, content, progress', 'Relational schema'] } },

  { id: 'weaviate', type: 'arch', position: { x: 560, y: 185 },
    data: { label: 'Weaviate', icon: 'mdi:vector-polyline', color: 'purple',
            lines: ['Scripture vector index', 'RAG retrieval', 'Cross-corpus search'] } },

  { id: 'redis', type: 'arch', position: { x: 560, y: 350 },
    data: { label: 'Redis', icon: 'logos:redis', color: 'amber',
            lines: ['Session + rate-limit cache', 'Cross-instance pub/sub'] } },

  { id: 'bullmq', type: 'arch', position: { x: 560, y: 475 },
    data: { label: 'BullMQ', icon: 'mdi:layers-triple', color: 'orange',
            lines: ['Audio transcoding queue', 'Notification dispatch', 'AI inference batching'] } },

  // ── Col 4: real-time + media ─────────────────────────────────────────────
  { id: 'websocket', type: 'arch', position: { x: 840, y: 270 },
    data: { label: 'WebSocket + WebRTC', icon: 'simple-icons:socketdotio', color: 'cyan',
            lines: ['Chat + reaction sync', 'Livestream signaling', 'Redis-backed broadcast'] } },

  { id: 'ffmpeg', type: 'arch', position: { x: 840, y: 475 },
    data: { label: 'FFmpeg Worker', icon: 'simple-icons:ffmpeg', color: 'blue',
            lines: ['Format transcoding', 'Audio extraction', 'Resolution scaling'] } },

  // ── Col 5: AI models + storage ───────────────────────────────────────────
  { id: 'llama', type: 'arch', position: { x: 1120, y: 5 },
    data: { label: 'Llama 3.2 8B', icon: 'logos:meta-icon', color: 'violet',
            lines: ['Primary inference', 'Local execution', 'Cost-optimised path'] } },

  { id: 'openai', type: 'arch', position: { x: 1120, y: 145 },
    data: { label: 'OpenAI API', icon: 'simple-icons:openai', color: 'green',
            lines: ['Fallback inference', 'High-complexity routing', 'Confidence threshold'] } },

  { id: 'minio', type: 'arch', position: { x: 1120, y: 475 },
    data: { label: 'MinIO', icon: 'simple-icons:minio', color: 'blue',
            lines: ['Object storage', 'Signed URL delivery', 'Raw + processed assets'] } },
])

// ── Edges ──────────────────────────────────────────────────────────────────
const edges = ref([
  // Client ↔ Nitro  (animated, bidirectional)
  { id: 'e1', source: 'client', target: 'nitro',
    animated: true, type: 'smoothstep', class: 'e-primary',
    markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },

  // Nitro → data services
  { id: 'e2', source: 'nitro', target: 'postgres',
    type: 'smoothstep', class: 'e-data',
    markerEnd: { type: 'arrowclosed', color: '#10b981' } },
  { id: 'e3', source: 'nitro', target: 'redis',
    type: 'smoothstep', class: 'e-data',
    markerEnd: { type: 'arrowclosed', color: '#f59e0b' } },
  { id: 'e4', source: 'nitro', target: 'bullmq',
    type: 'smoothstep', class: 'e-queue',
    markerEnd: { type: 'arrowclosed', color: '#f97316' } },

  // Nitro ↔ WebSocket  (animated, bidirectional)
  { id: 'e5', source: 'nitro', target: 'websocket',
    animated: true, type: 'smoothstep', class: 'e-realtime',
    markerStart: { type: 'arrowclosed', color: '#06b6d4' },
    markerEnd:   { type: 'arrowclosed', color: '#06b6d4' } },

  // Redis → WebSocket  (pub/sub broadcast)
  { id: 'e6', source: 'redis', target: 'websocket',
    type: 'smoothstep', class: 'e-realtime',
    markerEnd: { type: 'arrowclosed', color: '#06b6d4' } },

  // Nitro → AI Orchestration
  { id: 'e7', source: 'nitro', target: 'ai-orch',
    type: 'smoothstep', class: 'e-ai',
    markerEnd: { type: 'arrowclosed', color: '#a855f7' } },

  // AI Orch ↔ Weaviate  (RAG retrieval, bidirectional)
  { id: 'e8', source: 'ai-orch', target: 'weaviate',
    type: 'smoothstep', class: 'e-ai',
    markerStart: { type: 'arrowclosed', color: '#a855f7' },
    markerEnd:   { type: 'arrowclosed', color: '#a855f7' } },

  // AI Orch → models
  { id: 'e9',  source: 'ai-orch', target: 'llama',
    type: 'smoothstep', class: 'e-ai',
    markerEnd: { type: 'arrowclosed', color: '#a855f7' } },
  { id: 'e10', source: 'ai-orch', target: 'openai',
    type: 'smoothstep', class: 'e-ai', label: 'fallback',
    markerEnd: { type: 'arrowclosed', color: '#a855f7' } },

  // Media pipeline: BullMQ → FFmpeg → MinIO
  { id: 'e11', source: 'bullmq', target: 'ffmpeg',
    type: 'smoothstep', class: 'e-queue',
    markerEnd: { type: 'arrowclosed', color: '#f97316' } },
  { id: 'e12', source: 'ffmpeg', target: 'minio',
    type: 'smoothstep', class: 'e-storage',
    markerEnd: { type: 'arrowclosed', color: '#3b82f6' } },
])

// ── Custom node renderer ───────────────────────────────────────────────────
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
            h('div', {
              class: 'bva-node',
              style: { background: c.bg, borderColor: c.border },
            }, [
              h('div', { class: 'bva-node-head' }, [
                h('div', { class: 'bva-icon', style: { borderColor: c.border } }, [
                  h(IconComponent, { name: props.data.icon, style: { color: c.icon, fontSize: '24px' } }),
                ]),
                h('span', { class: 'bva-label' }, props.data.label),
              ]),
              props.data.lines?.length
                ? h('ul', { class: 'bva-lines' },
                    props.data.lines.map(l => h('li', l)))
                : null,
            ]),
            // Invisible handles for edge routing only
            h(Handle, { type: 'target', position: Position.Left,   class: 'bva-handle' }),
            h(Handle, { type: 'source', position: Position.Right,  class: 'bva-handle' }),
            h(Handle, { id: 'top',    type: 'target', position: Position.Top,    class: 'bva-handle' }),
            h(Handle, { id: 'bottom', type: 'source', position: Position.Bottom, class: 'bva-handle' }),
          ])
        }
      },
    })

    VueFlowComponent.value = VueFlow
    nodeTypes.value = { arch: ArchNode }
    vueFlowReady.value = true
  } catch {
    console.error('VueFlow not installed. Run: npm install @vue-flow/core')
  }
  isLoading.value = false
})
</script>

<style scoped>
/* ── Node card ────────────────────────────────────────────────────────────── */
:deep(.bva-node) {
  border: 1px solid;
  border-radius: 10px;
  padding: 10px 12px;
  min-width: 158px;
  max-width: 230px;
  box-sizing: border-box;
  cursor: default;
  @apply dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)];
}

:deep(.bva-node-head) {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

:deep(.bva-icon) {
  width: 38px;
  height: 38px;
  border-radius: 6px;
  border: 1px solid;
  background: rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

:deep(.bva-label) {
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.2;
  color: #1e293b;
  @apply dark:text-slate-100;
}

:deep(.bva-lines) {
  list-style: none;
  margin: 0;
  padding: 0;
}

:deep(.bva-lines li) {
  font-size: 11px;
  color: #475569;
  line-height: 1.5;
  padding-left: 10px;
  position: relative;
  @apply dark:text-slate-300;
}

:deep(.bva-lines li::before) {
  content: '·';
  position: absolute;
  left: 2px;
  font-weight: bold;
  color: #94a3b8;
  @apply dark:text-slate-500;
}

/* ── Handles — invisible, edge-routing only ───────────────────────────────── */
:deep(.bva-handle) {
  width: 6px !important;
  height: 6px !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  pointer-events: none !important;
  opacity: 0 !important;
}

/* ── VueFlow canvas ───────────────────────────────────────────────────────── */
:deep(.vue-flow__pane)        { cursor: grab; }
:deep(.vue-flow__pane:active) { cursor: grabbing; }

:deep(.vue-flow__node.selected > *),
:deep(.vue-flow__node:focus > *) {
  outline: none !important;
  box-shadow: none !important;
}

/* ── Edges ────────────────────────────────────────────────────────────────── */
:deep(.vue-flow__edge.e-primary .vue-flow__edge-path) { stroke: #0ea5e9; stroke-width: 1.8px; }
:deep(.vue-flow__edge.e-data    .vue-flow__edge-path) { stroke: #10b981; stroke-width: 1.6px; }
:deep(.vue-flow__edge.e-queue   .vue-flow__edge-path) { stroke: #f97316; stroke-width: 1.6px; }
:deep(.vue-flow__edge.e-realtime.vue-flow__edge-path) { stroke: #06b6d4; stroke-width: 1.6px; }
:deep(.vue-flow__edge.e-ai      .vue-flow__edge-path) { stroke: #a855f7; stroke-width: 1.6px; }
:deep(.vue-flow__edge.e-storage .vue-flow__edge-path) { stroke: #3b82f6; stroke-width: 1.6px; }

/* fallback label */
:deep(.vue-flow__edge-label) {
  font-size: 10px;
  fill: #94a3b8;
}

/* dot grid background */
:deep(.vue-flow__background) {
  color: rgba(100,116,139,0.12);
}
</style>
