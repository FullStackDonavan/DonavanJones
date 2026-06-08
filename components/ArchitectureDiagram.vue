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

    <div v-show="!isLoading">
      <!-- VIEW TABS -->
      <div class="flex gap-2 mb-4 flex-wrap">
        <button
          v-for="v in views"
          :key="v.id"
          @click="activeView = v.id"
          class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          :class="activeView === v.id
            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
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
          <span
            class="w-5 inline-block"
            :style="{ height: '2px', background: item.color, opacity: item.dashed ? 0.6 : 1 }"
          />
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
const activeView       = ref('request-flow')

// ── Colour palette ─────────────────────────────────────────────────────────
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

// ── Views ──────────────────────────────────────────────────────────────────
const views = [
  { id: 'request-flow',   label: 'Request Flow' },
  { id: 'ai-pipeline',    label: 'AI Pipeline' },
  { id: 'infrastructure', label: 'Infrastructure' },
]

// ── Nodes per view ─────────────────────────────────────────────────────────
const allNodes = {
  'request-flow': [
    { id: 'user',    type: 'arch', position: { x: 0,    y: 210 },
      data: { label: 'Client',      icon: 'mdi:monitor',          color: 'slate',
              lines: ['Browser / mobile app', 'API consumer'] } },
    { id: 'ingress', type: 'arch', position: { x: 240,  y: 210 },
      data: { label: 'Ingress NGINX', icon: 'logos:nginx',         color: 'sky',
              lines: ['TLS via cert-manager', 'Domain routing', 'Rate limiting'] } },
    { id: 'fastapi', type: 'arch', position: { x: 480,  y: 210 },
      data: { label: 'Nitro / FastAPI', icon: 'simple-icons:nuxtdotjs', color: 'green',
              lines: ['REST + WebSocket', 'Zod validation', 'SSE streaming'] } },
    { id: 'postgres',type: 'arch', position: { x: 760,  y: 20  },
      data: { label: 'PostgreSQL',  icon: 'logos:postgresql',      color: 'emerald',
              lines: ['Primary datastore', 'Prisma ORM', 'AGE graph extension'] } },
    { id: 'redis',   type: 'arch', position: { x: 760,  y: 210 },
      data: { label: 'Redis',       icon: 'logos:redis',           color: 'amber',
              lines: ['Cache + sessions', 'BullMQ job backend', 'Pub/sub channels'] } },
    { id: 'ai',      type: 'arch', position: { x: 760,  y: 390 },
      data: { label: 'AI Compute',  icon: 'mdi:memory',            color: 'violet',
              lines: ['Llama 3.2 on RTX 3090', 'Embedding generation', 'Hybrid routing → OpenAI'] } },
    { id: 'minio',   type: 'arch', position: { x: 1040, y: 210 },
      data: { label: 'MinIO',       icon: 'simple-icons:minio',    color: 'blue',
              lines: ['S3-compatible storage', 'Pre-signed URL delivery', 'Model weights + media'] } },
  ],

  'ai-pipeline': [
    { id: 'api',      type: 'arch', position: { x: 0,    y: 180 },
      data: { label: 'API Server',       icon: 'simple-icons:nuxtdotjs', color: 'green',
              lines: ['Accepts AI request', 'Enqueues BullMQ job', 'Returns job ID'] } },
    { id: 'queue',    type: 'arch', position: { x: 260,  y: 180 },
      data: { label: 'BullMQ + Redis',   icon: 'logos:redis',            color: 'amber',
              lines: ['Job dispatch', 'Priority queues', 'Retry + backoff'] } },
    { id: 'orch',     type: 'arch', position: { x: 520,  y: 180 },
      data: { label: 'AI Orchestrator',  icon: 'mdi:brain',              color: 'violet',
              lines: ['Prompt construction', 'Model routing logic', 'Context window mgmt'] } },
    { id: 'llm',      type: 'arch', position: { x: 800,  y: 20  },
      data: { label: 'Llama 3.2 (Local)', icon: 'mdi:memory',           color: 'purple',
              lines: ['RTX 3090 inference', 'Private + fast', 'Fallback → OpenAI API'] } },
    { id: 'weaviate', type: 'arch', position: { x: 800,  y: 180 },
      data: { label: 'Weaviate',         icon: 'mdi:database-search',    color: 'sky',
              lines: ['Vector store', 'Hybrid BM25 + vector', 'RAG context retrieval'] } },
    { id: 'edge',     type: 'arch', position: { x: 800,  y: 360 },
      data: { label: 'Jetson Orin Nano', icon: 'mdi:chip',               color: 'cyan',
              lines: ['Edge AI inference', 'Vision / multimodal', 'Low-latency on-device'] } },
    { id: 'store',    type: 'arch', position: { x: 1080, y: 180 },
      data: { label: 'MinIO',            icon: 'simple-icons:minio',     color: 'blue',
              lines: ['Model artifacts', 'Processed outputs', 'Dataset storage'] } },
  ],

  'infrastructure': [
    { id: 'gitea',  type: 'arch', position: { x: 0,   y: 200 },
      data: { label: 'Gitea + Actions', icon: 'simple-icons:gitea',      color: 'orange',
              lines: ['Self-hosted Git', 'CI/CD runners', 'Docker build + push'] } },
    { id: 'k3s',    type: 'arch', position: { x: 270, y: 200 },
      data: { label: 'k3s — 8 × RPi 5', icon: 'logos:kubernetes',        color: 'sky',
              lines: ['ARM64 cluster', 'Pod scheduling', 'Rolling deployments'] } },
    { id: 'app',    type: 'arch', position: { x: 540, y: 20  },
      data: { label: 'App Pods',         icon: 'mdi:application-brackets',color: 'green',
              lines: ['Nuxt / FastAPI', 'BullMQ workers', 'WebSocket server'] } },
    { id: 'data',   type: 'arch', position: { x: 840, y: 200 },
      data: { label: 'Data Pods',        icon: 'mdi:database',            color: 'emerald',
              lines: ['PostgreSQL + Prisma', 'Redis', 'Weaviate + MinIO'] } },
    { id: 'ai-pod', type: 'arch', position: { x: 540, y: 380 },
      data: { label: 'AI Pods',          icon: 'mdi:memory',              color: 'violet',
              lines: ['RTX 3090 inference', 'Jetson Orin edge', 'GPU resource limits'] } },
    { id: 'obs',    type: 'arch', position: { x: 840, y: 20  },
      data: { label: 'Observability',    icon: 'logos:prometheus',        color: 'amber',
              lines: ['Prometheus metrics', 'Grafana dashboards', 'Alertmanager on-call'] } },
    { id: 'net',    type: 'arch', position: { x: 840, y: 390 },
      data: { label: 'Networking',       icon: 'mdi:network',             color: 'slate',
              lines: ['Ingress NGINX', 'cert-manager TLS', 'Internal service DNS'] } },
  ],
}

// ── Edges per view ─────────────────────────────────────────────────────────
const allEdges = {
  'request-flow': [
    { id: 'e1', source: 'user',    target: 'ingress',  animated: true, type: 'smoothstep', class: 'e-primary',
      markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },
    { id: 'e2', source: 'ingress', target: 'fastapi',  animated: true, type: 'smoothstep', class: 'e-primary',
      markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },
    { id: 'e3', source: 'fastapi', target: 'postgres',                 type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
    { id: 'e4', source: 'fastapi', target: 'redis',                    type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#f59e0b' } },
    { id: 'e5', source: 'fastapi', target: 'ai',                       type: 'smoothstep', class: 'e-ai',
      markerEnd: { type: 'arrowclosed', color: '#a855f7' } },
    { id: 'e6', source: 'ai',      target: 'minio',                    type: 'smoothstep', class: 'e-storage',
      markerEnd: { type: 'arrowclosed', color: '#3b82f6' } },
    { id: 'e7', source: 'redis',   target: 'minio',                    type: 'smoothstep', class: 'e-storage',
      markerEnd: { type: 'arrowclosed', color: '#3b82f6' } },
  ],
  'ai-pipeline': [
    { id: 'e1', source: 'api',      target: 'queue',    animated: true, type: 'smoothstep', class: 'e-queue',
      markerEnd: { type: 'arrowclosed', color: '#f97316' } },
    { id: 'e2', source: 'queue',    target: 'orch',     animated: true, type: 'smoothstep', class: 'e-queue',
      markerEnd: { type: 'arrowclosed', color: '#f97316' } },
    { id: 'e3', source: 'orch',     target: 'llm',                      type: 'smoothstep', class: 'e-ai',
      markerEnd: { type: 'arrowclosed', color: '#a855f7' } },
    { id: 'e4', source: 'orch',     target: 'weaviate',                 type: 'smoothstep', class: 'e-ai',
      markerStart: { type: 'arrowclosed', color: '#a855f7' },
      markerEnd:   { type: 'arrowclosed', color: '#a855f7' } },
    { id: 'e5', source: 'orch',     target: 'edge',                     type: 'smoothstep', class: 'e-ai',
      markerEnd: { type: 'arrowclosed', color: '#a855f7' } },
    { id: 'e6', source: 'llm',      target: 'store',                    type: 'smoothstep', class: 'e-storage',
      markerEnd: { type: 'arrowclosed', color: '#3b82f6' } },
    { id: 'e7', source: 'weaviate', target: 'store',                    type: 'smoothstep', class: 'e-storage',
      markerEnd: { type: 'arrowclosed', color: '#3b82f6' } },
  ],
  'infrastructure': [
    { id: 'e1', source: 'gitea', target: 'k3s',    animated: true, type: 'smoothstep', class: 'e-primary',
      markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },
    { id: 'e2', source: 'k3s',   target: 'app',                    type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
    { id: 'e3', source: 'k3s',   target: 'data',                   type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
    { id: 'e4', source: 'k3s',   target: 'ai-pod',                 type: 'smoothstep', class: 'e-ai',
      markerEnd: { type: 'arrowclosed', color: '#a855f7' } },
    { id: 'e5', source: 'k3s',   target: 'obs',                    type: 'smoothstep', class: 'e-support',
      markerEnd: { type: 'arrowclosed', color: '#94a3b8' } },
    { id: 'e6', source: 'k3s',   target: 'net',                    type: 'smoothstep', class: 'e-support',
      markerEnd: { type: 'arrowclosed', color: '#94a3b8' } },
  ],
}

const legends = {
  'request-flow': [
    { color: '#0ea5e9', label: 'HTTP request' },
    { color: '#10b981', label: 'Data ops' },
    { color: '#a855f7', label: 'AI inference' },
    { color: '#3b82f6', label: 'Storage' },
  ],
  'ai-pipeline': [
    { color: '#f97316', label: 'Job queue' },
    { color: '#a855f7', label: 'AI pipeline' },
    { color: '#3b82f6', label: 'Storage' },
  ],
  'infrastructure': [
    { color: '#0ea5e9', label: 'Deploy' },
    { color: '#10b981', label: 'Workloads' },
    { color: '#a855f7', label: 'AI workloads' },
    { color: '#94a3b8', label: 'Infra services', dashed: true },
  ],
}

const currentNodes  = computed(() => allNodes[activeView.value]  ?? [])
const currentEdges  = computed(() => allEdges[activeView.value]  ?? [])
const currentLegend = computed(() => legends[activeView.value]   ?? [])

// ── Mount VueFlow ──────────────────────────────────────────────────────────
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
    console.error('VueFlow not installed. Run: npm install @vue-flow/core')
  }
  isLoading.value = false
})
</script>

<style scoped>
/* ── Node card ────────────────────────────────────────────────────────────── */
:deep(.ad-node) {
  border: 1px solid;
  border-radius: 10px;
  padding: 10px 12px;
  min-width: 158px;
  max-width: 230px;
  box-sizing: border-box;
  cursor: default;
  @apply dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)];
}

:deep(.ad-node-head) {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

:deep(.ad-icon) {
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

:deep(.ad-label) {
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.2;
  color: #1e293b;
  @apply dark:text-slate-100;
}

:deep(.ad-lines) {
  list-style: none;
  margin: 0;
  padding: 0;
}

:deep(.ad-lines li) {
  font-size: 11px;
  color: #475569;
  line-height: 1.5;
  padding-left: 10px;
  position: relative;
  @apply dark:text-slate-300;
}

:deep(.ad-lines li::before) {
  content: '·';
  position: absolute;
  left: 2px;
  font-weight: bold;
  color: #94a3b8;
  @apply dark:text-slate-500;
}

/* ── Handles — invisible, edge routing only ───────────────────────────────── */
:deep(.ad-handle) {
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
:deep(.vue-flow__edge.e-ai      .vue-flow__edge-path) { stroke: #a855f7; stroke-width: 1.6px; }
:deep(.vue-flow__edge.e-storage .vue-flow__edge-path) { stroke: #3b82f6; stroke-width: 1.6px; }
:deep(.vue-flow__edge.e-support .vue-flow__edge-path) { stroke: #94a3b8; stroke-width: 1.4px; stroke-dasharray: 5 5; }

:deep(.vue-flow__edge-label) {
  font-size: 10px;
  fill: #94a3b8;
}

:deep(.vue-flow__background) {
  color: rgba(100,116,139,0.12);
}
</style>
