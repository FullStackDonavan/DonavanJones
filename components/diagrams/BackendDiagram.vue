<template>
  <div
    class="relative w-full rounded-xl overflow-hidden
           border border-slate-200 dark:border-slate-500/20
           bg-slate-50 dark:from-[#0d0d1a] dark:via-[#111827] dark:to-[#0f1a24]
           dark:bg-gradient-to-br p-4 md:p-6"
  >
    <div v-if="isLoading" class="flex items-center justify-center h-[540px]">
      <div class="flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-4 border-slate-300/30 border-t-sky-400 rounded-full animate-spin" />
        <p class="text-slate-400 text-sm">Loading diagram…</p>
      </div>
    </div>

    <div v-show="!isLoading">
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

      <div v-else class="h-40 flex items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/5 text-slate-400 text-sm">
        Install <code class="mx-1 font-mono text-rose-400">@vue-flow/core</code> to render this diagram.
      </div>

      <div class="mt-4 flex flex-wrap gap-x-5 gap-y-2 px-4 py-2.5 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/40 text-xs text-slate-500 dark:text-slate-400">
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
const activeView       = ref('api-layer')

const palette = {
  sky:    { bg: 'rgba(14,165,233,0.10)',  border: 'rgba(14,165,233,0.30)',  icon: '#38bdf8' },
  slate:  { bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.30)', icon: '#94a3b8' },
  emerald:{ bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.30)',  icon: '#34d399' },
  amber:  { bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.30)',  icon: '#fbbf24' },
  orange: { bg: 'rgba(249,115,22,0.10)',  border: 'rgba(249,115,22,0.30)',  icon: '#fb923c' },
  purple: { bg: 'rgba(168,85,247,0.10)',  border: 'rgba(168,85,247,0.30)',  icon: '#c084fc' },
  blue:   { bg: 'rgba(59,130,246,0.10)',  border: 'rgba(59,130,246,0.30)',  icon: '#60a5fa' },
  violet: { bg: 'rgba(139,92,246,0.10)',  border: 'rgba(139,92,246,0.30)',  icon: '#a78bfa' },
  green:  { bg: 'rgba(34,197,94,0.10)',   border: 'rgba(34,197,94,0.30)',   icon: '#4ade80' },
}

const views = [
  { id: 'api-layer',   label: 'API Layer' },
  { id: 'async-queue', label: 'Async Queue' },
  { id: 'data-layer',  label: 'Data Layer' },
]

const allNodes = {
  'api-layer': [
    { id: 'client',  type: 'arch', position: { x: 0,    y: 200 },
      data: { label: 'Client',            icon: 'mdi:monitor',             color: 'slate',
              lines: ['Browser / mobile', 'API consumer'] } },
    { id: 'ingress', type: 'arch', position: { x: 240,  y: 200 },
      data: { label: 'Ingress',           icon: 'logos:nginx',             color: 'sky',
              lines: ['TLS termination', 'Rate limiting', 'Domain routing'] } },
    { id: 'nitro',   type: 'arch', position: { x: 480,  y: 200 },
      data: { label: 'Nitro API',         icon: 'simple-icons:nuxtdotjs',  color: 'green',
              lines: ['REST / WS endpoints', 'SSE streaming', 'Typed handlers'] } },
    { id: 'auth',    type: 'arch', position: { x: 740,  y: 60  },
      data: { label: 'Auth Middleware',   icon: 'mdi:shield-key',          color: 'amber',
              lines: ['JWT validation', 'Rate limit', 'Session check'] } },
    { id: 'zod',     type: 'arch', position: { x: 740,  y: 220 },
      data: { label: 'Zod Validation',    icon: 'mdi:check-decagram',      color: 'purple',
              lines: ['Schema parsing', 'Type narrowing', 'Error formatting'] } },
    { id: 'service', type: 'arch', position: { x: 740,  y: 380 },
      data: { label: 'Service Layer',     icon: 'mdi:hexagon-multiple',    color: 'sky',
              lines: ['Domain logic', 'DB calls', 'Queue dispatch'] } },
    { id: 'db',      type: 'arch', position: { x: 1020, y: 220 },
      data: { label: 'PostgreSQL',        icon: 'logos:postgresql',        color: 'emerald',
              lines: ['Prisma ORM', 'Typed queries', 'Migrations'] } },
  ],

  'async-queue': [
    { id: 'api',          type: 'arch', position: { x: 0,    y: 200 },
      data: { label: 'API / Server',      icon: 'simple-icons:nuxtdotjs',  color: 'sky',
              lines: ['Enqueues jobs', 'Returns job ID'] } },
    { id: 'bullmq',       type: 'arch', position: { x: 260,  y: 200 },
      data: { label: 'BullMQ',            icon: 'mdi:swap-horizontal',     color: 'orange',
              lines: ['Job scheduling', 'Priority queues', 'Retry / backoff'] } },
    { id: 'redis',        type: 'arch', position: { x: 520,  y: 200 },
      data: { label: 'Redis',             icon: 'logos:redis',             color: 'amber',
              lines: ['Queue backend', 'Job state', 'Dead-letter queue'] } },
    { id: 'ai-worker',    type: 'arch', position: { x: 780,  y: 60  },
      data: { label: 'AI Worker',         icon: 'mdi:brain',               color: 'violet',
              lines: ['Inference jobs', 'RAG processing', 'Embedding gen'] } },
    { id: 'media-worker', type: 'arch', position: { x: 780,  y: 220 },
      data: { label: 'Media Worker',      icon: 'mdi:video-processing',    color: 'emerald',
              lines: ['FFmpeg transcode', 'Thumbnail gen', 'MinIO upload'] } },
    { id: 'email-worker', type: 'arch', position: { x: 780,  y: 380 },
      data: { label: 'Notify Worker',     icon: 'mdi:bell-ring',           color: 'blue',
              lines: ['Email dispatch', 'Push / WebSocket', 'Webhook calls'] } },
    { id: 'results',      type: 'arch', position: { x: 1060, y: 200 },
      data: { label: 'Result Store',      icon: 'logos:postgresql',        color: 'emerald',
              lines: ['Job results', 'Status updates', 'WS client notify'] } },
  ],

  'data-layer': [
    { id: 'app',      type: 'arch', position: { x: 0,    y: 230 },
      data: { label: 'Application',       icon: 'simple-icons:nuxtdotjs',  color: 'sky',
              lines: ['Service layer', 'All data access here'] } },
    { id: 'prisma',   type: 'arch', position: { x: 300,  y: 80  },
      data: { label: 'Prisma ORM',        icon: 'simple-icons:prisma',     color: 'emerald',
              lines: ['Typed queries', 'Schema migrations', 'Relations'] } },
    { id: 'postgres', type: 'arch', position: { x: 600,  y: 80  },
      data: { label: 'PostgreSQL',        icon: 'logos:postgresql',        color: 'emerald',
              lines: ['Primary datastore', 'ACID transactions', 'AGE extension'] } },
    { id: 'redis',    type: 'arch', position: { x: 300,  y: 230 },
      data: { label: 'Redis',             icon: 'logos:redis',             color: 'amber',
              lines: ['Cache layer', 'Sessions', 'Pub/sub channels'] } },
    { id: 'weaviate', type: 'arch', position: { x: 600,  y: 230 },
      data: { label: 'Weaviate',          icon: 'mdi:database-search',     color: 'sky',
              lines: ['Vector store', 'Semantic search', 'RAG retrieval'] } },
    { id: 'minio',    type: 'arch', position: { x: 600,  y: 380 },
      data: { label: 'MinIO',             icon: 'simple-icons:minio',      color: 'blue',
              lines: ['Object storage', 'S3-compatible', 'Signed URLs'] } },
    { id: 's3client', type: 'arch', position: { x: 300,  y: 380 },
      data: { label: 'S3 Client',         icon: 'mdi:cloud-upload',        color: 'blue',
              lines: ['Pre-signed upload', 'Media delivery'] } },
  ],
}

const allEdges = {
  'api-layer': [
    { id: 'e1', source: 'client',  target: 'ingress', animated: true, type: 'smoothstep', class: 'e-primary',
      markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },
    { id: 'e2', source: 'ingress', target: 'nitro',   animated: true, type: 'smoothstep', class: 'e-primary',
      markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },
    { id: 'e3', source: 'nitro',   target: 'auth',                    type: 'smoothstep', class: 'e-queue',
      markerEnd: { type: 'arrowclosed', color: '#f97316' } },
    { id: 'e4', source: 'nitro',   target: 'zod',                     type: 'smoothstep', class: 'e-ai',
      markerEnd: { type: 'arrowclosed', color: '#a855f7' } },
    { id: 'e5', source: 'nitro',   target: 'service',                 type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
    { id: 'e6', source: 'service', target: 'db',                      type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
  ],
  'async-queue': [
    { id: 'e1', source: 'api',          target: 'bullmq',       animated: true, type: 'smoothstep', class: 'e-queue',
      markerEnd: { type: 'arrowclosed', color: '#f97316' } },
    { id: 'e2', source: 'bullmq',       target: 'redis',                        type: 'smoothstep', class: 'e-queue',
      markerEnd: { type: 'arrowclosed', color: '#f97316' } },
    { id: 'e3', source: 'redis',        target: 'ai-worker',    animated: true, type: 'smoothstep', class: 'e-ai',
      markerEnd: { type: 'arrowclosed', color: '#a855f7' } },
    { id: 'e4', source: 'redis',        target: 'media-worker', animated: true, type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
    { id: 'e5', source: 'redis',        target: 'email-worker', animated: true, type: 'smoothstep', class: 'e-primary',
      markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },
    { id: 'e6', source: 'ai-worker',    target: 'results',                      type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
    { id: 'e7', source: 'media-worker', target: 'results',                      type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
    { id: 'e8', source: 'email-worker', target: 'results',                      type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
  ],
  'data-layer': [
    { id: 'e1', source: 'app',      target: 'prisma',   type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
    { id: 'e2', source: 'prisma',   target: 'postgres', type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
    { id: 'e3', source: 'app',      target: 'redis',    type: 'smoothstep', class: 'e-queue',
      markerEnd: { type: 'arrowclosed', color: '#f97316' } },
    { id: 'e4', source: 'app',      target: 's3client', type: 'smoothstep', class: 'e-storage',
      markerEnd: { type: 'arrowclosed', color: '#3b82f6' } },
    { id: 'e5', source: 's3client', target: 'minio',    type: 'smoothstep', class: 'e-storage',
      markerEnd: { type: 'arrowclosed', color: '#3b82f6' } },
    { id: 'e6', source: 'redis',    target: 'weaviate', type: 'smoothstep', class: 'e-primary',
      markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },
  ],
}

const legends = {
  'api-layer': [
    { color: '#0ea5e9', label: 'HTTP flow' },
    { color: '#f97316', label: 'Auth / middleware' },
    { color: '#a855f7', label: 'Validation' },
    { color: '#10b981', label: 'Data access' },
  ],
  'async-queue': [
    { color: '#f97316', label: 'Job enqueue' },
    { color: '#a855f7', label: 'AI jobs' },
    { color: '#10b981', label: 'Media / notify jobs' },
    { color: '#0ea5e9', label: 'Results / notify' },
  ],
  'data-layer': [
    { color: '#10b981', label: 'Relational (Prisma)' },
    { color: '#f97316', label: 'Cache / pub-sub' },
    { color: '#3b82f6', label: 'Object storage' },
    { color: '#0ea5e9', label: 'Vector store' },
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
:deep(.ad-node) { border: 1px solid; border-radius: 10px; padding: 10px 12px; min-width: 158px; max-width: 230px; box-sizing: border-box; cursor: default; @apply dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)]; }
:deep(.ad-node-head) { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
:deep(.ad-icon) { width: 38px; height: 38px; border-radius: 6px; border: 1px solid; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
:deep(.ad-label) { font-size: 12.5px; font-weight: 600; line-height: 1.2; color: #1e293b; @apply dark:text-slate-100; }
:deep(.ad-lines) { list-style: none; margin: 0; padding: 0; }
:deep(.ad-lines li) { font-size: 11px; color: #475569; line-height: 1.5; padding-left: 10px; position: relative; @apply dark:text-slate-300; }
:deep(.ad-lines li::before) { content: '·'; position: absolute; left: 2px; font-weight: bold; color: #94a3b8; @apply dark:text-slate-500; }
:deep(.ad-handle) { width: 6px !important; height: 6px !important; background: transparent !important; border: none !important; box-shadow: none !important; pointer-events: none !important; opacity: 0 !important; }
:deep(.vue-flow__pane) { cursor: grab; }
:deep(.vue-flow__pane:active) { cursor: grabbing; }
:deep(.vue-flow__node.selected > *), :deep(.vue-flow__node:focus > *) { outline: none !important; box-shadow: none !important; }
:deep(.vue-flow__edge.e-primary .vue-flow__edge-path) { stroke: #0ea5e9; stroke-width: 1.8px; }
:deep(.vue-flow__edge.e-data    .vue-flow__edge-path) { stroke: #10b981; stroke-width: 1.6px; }
:deep(.vue-flow__edge.e-queue   .vue-flow__edge-path) { stroke: #f97316; stroke-width: 1.6px; }
:deep(.vue-flow__edge.e-ai      .vue-flow__edge-path) { stroke: #a855f7; stroke-width: 1.6px; }
:deep(.vue-flow__edge.e-storage .vue-flow__edge-path) { stroke: #3b82f6; stroke-width: 1.6px; }
:deep(.vue-flow__edge.e-support .vue-flow__edge-path) { stroke: #94a3b8; stroke-width: 1.4px; stroke-dasharray: 5 5; }
:deep(.vue-flow__background) { color: rgba(100,116,139,0.12); }
</style>
