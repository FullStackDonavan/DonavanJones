<template>
  <div
    class="relative w-full rounded-xl overflow-hidden
           border border-slate-200 dark:border-slate-500/20
           bg-slate-50 dark:from-[#0d0d1a] dark:via-[#111827] dark:to-[#0f1a24]
           dark:bg-gradient-to-br p-4 md:p-6"
  >
    <div v-if="isLoading" class="flex items-center justify-center h-[540px]">
      <div class="flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-4 border-slate-300/30 border-t-emerald-400 rounded-full animate-spin" />
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
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
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
const activeView       = ref('cluster')

const palette = {
  sky:    { bg: 'rgba(14,165,233,0.10)',  border: 'rgba(14,165,233,0.30)',  icon: '#38bdf8' },
  slate:  { bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.30)', icon: '#94a3b8' },
  emerald:{ bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.30)',  icon: '#34d399' },
  amber:  { bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.30)',  icon: '#fbbf24' },
  orange: { bg: 'rgba(249,115,22,0.10)',  border: 'rgba(249,115,22,0.30)',  icon: '#fb923c' },
  purple: { bg: 'rgba(168,85,247,0.10)',  border: 'rgba(168,85,247,0.30)',  icon: '#c084fc' },
  blue:   { bg: 'rgba(59,130,246,0.10)',  border: 'rgba(59,130,246,0.30)',  icon: '#60a5fa' },
  violet: { bg: 'rgba(139,92,246,0.10)',  border: 'rgba(139,92,246,0.30)',  icon: '#a78bfa' },
  rose:   { bg: 'rgba(244,63,94,0.10)',   border: 'rgba(244,63,94,0.30)',   icon: '#fb7185' },
  green:  { bg: 'rgba(34,197,94,0.10)',   border: 'rgba(34,197,94,0.30)',   icon: '#4ade80' },
}

const views = [
  { id: 'cluster',       label: 'Cluster Layout' },
  { id: 'deploy',        label: 'Deploy Pipeline' },
  { id: 'observability', label: 'Observability' },
]

const allNodes = {
  'cluster': [
    { id: 'control', type: 'arch', position: { x: 0,    y: 220 },
      data: { label: 'Control Plane',   icon: 'logos:kubernetes',          color: 'sky',
              lines: ['k3s master', 'API server', 'Scheduler'] } },
    { id: 'wn-app',  type: 'arch', position: { x: 280,  y: 60  },
      data: { label: 'Workers (App)',   icon: 'mdi:raspberry-pi',          color: 'slate',
              lines: ['3 × RPi 5', 'App workloads', 'Rolling updates'] } },
    { id: 'wn-data', type: 'arch', position: { x: 280,  y: 220 },
      data: { label: 'Workers (Data)',  icon: 'mdi:raspberry-pi',          color: 'slate',
              lines: ['3 × RPi 5', 'Stateful pods', 'PVC binding'] } },
    { id: 'wn-ai',   type: 'arch', position: { x: 280,  y: 380 },
      data: { label: 'Workers (AI)',    icon: 'mdi:chip',                  color: 'slate',
              lines: ['RTX 3090 node', 'Jetson Orin', 'GPU scheduling'] } },
    { id: 'app',     type: 'arch', position: { x: 580,  y: 60  },
      data: { label: 'App Pods',        icon: 'mdi:application-brackets',  color: 'green',
              lines: ['Nuxt / FastAPI', 'BullMQ workers', 'WebSocket server'] } },
    { id: 'data',    type: 'arch', position: { x: 580,  y: 220 },
      data: { label: 'Data Pods',       icon: 'mdi:database',              color: 'emerald',
              lines: ['PostgreSQL', 'Redis', 'Weaviate', 'MinIO'] } },
    { id: 'ai',      type: 'arch', position: { x: 580,  y: 380 },
      data: { label: 'AI Pods',         icon: 'mdi:brain',                 color: 'violet',
              lines: ['Llama inference', 'Embedding gen', 'Vision models'] } },
    { id: 'ingress', type: 'arch', position: { x: 880,  y: 60  },
      data: { label: 'Ingress NGINX',   icon: 'logos:nginx',               color: 'sky',
              lines: ['Cluster edge', 'cert-manager TLS', 'Domain routing'] } },
    { id: 'storage', type: 'arch', position: { x: 880,  y: 280 },
      data: { label: 'MinIO Storage',   icon: 'simple-icons:minio',        color: 'blue',
              lines: ['S3-compatible', 'Model weights', 'Media assets'] } },
  ],

  'deploy': [
    { id: 'push',     type: 'arch', position: { x: 0,    y: 200 },
      data: { label: 'Git Push',        icon: 'simple-icons:gitea',        color: 'orange',
              lines: ['Gitea repo', 'Branch trigger', 'PR merge'] } },
    { id: 'runner',   type: 'arch', position: { x: 260,  y: 200 },
      data: { label: 'Actions Runner',  icon: 'mdi:run',                   color: 'orange',
              lines: ['Self-hosted', 'Gitea Actions', 'Parallel steps'] } },
    { id: 'lint',     type: 'arch', position: { x: 520,  y: 60  },
      data: { label: 'Lint + Types',    icon: 'mdi:check-all',             color: 'emerald',
              lines: ['ESLint', 'tsc --noEmit', 'Fail fast'] } },
    { id: 'build',    type: 'arch', position: { x: 520,  y: 200 },
      data: { label: 'Docker Build',    icon: 'logos:docker-icon',         color: 'sky',
              lines: ['Multi-stage', 'ARM64 target', 'Layer caching'] } },
    { id: 'test',     type: 'arch', position: { x: 520,  y: 340 },
      data: { label: 'Tests',           icon: 'mdi:test-tube',             color: 'purple',
              lines: ['Unit + integration', 'Block on fail'] } },
    { id: 'registry', type: 'arch', position: { x: 780,  y: 60  },
      data: { label: 'Registry',        icon: 'mdi:package-variant',       color: 'blue',
              lines: ['Gitea packages', 'Versioned image', 'Tag + SHA'] } },
    { id: 'manifest', type: 'arch', position: { x: 780,  y: 220 },
      data: { label: 'K8s Manifests',   icon: 'logos:kubernetes',          color: 'sky',
              lines: ['Deployment YAML', 'Migration job', 'Config maps'] } },
    { id: 'cluster',  type: 'arch', position: { x: 1060, y: 200 },
      data: { label: 'k3s Cluster',     icon: 'mdi:server-network',        color: 'emerald',
              lines: ['kubectl apply', 'Rolling update', 'Health check'] } },
  ],

  'observability': [
    { id: 'cluster',  type: 'arch', position: { x: 0,    y: 220 },
      data: { label: 'k3s Cluster',     icon: 'logos:kubernetes',          color: 'sky',
              lines: ['Nodes + pods', 'App metrics', 'Container logs'] } },
    { id: 'prom',     type: 'arch', position: { x: 280,  y: 220 },
      data: { label: 'Prometheus',      icon: 'logos:prometheus',          color: 'amber',
              lines: ['Metric scrape', 'Node exporter', 'App /metrics'] } },
    { id: 'alert',    type: 'arch', position: { x: 560,  y: 60  },
      data: { label: 'Alertmanager',    icon: 'mdi:bell-alert',            color: 'rose',
              lines: ['Alert rules', 'Dedup + silence', 'On-call routing'] } },
    { id: 'grafana',  type: 'arch', position: { x: 560,  y: 220 },
      data: { label: 'Grafana',         icon: 'logos:grafana',             color: 'orange',
              lines: ['Dashboards', 'Queue depth', 'Inference latency'] } },
    { id: 'logs',     type: 'arch', position: { x: 560,  y: 380 },
      data: { label: 'Log Aggregator',  icon: 'mdi:text-box-search',       color: 'purple',
              lines: ['Structured JSON', 'Correlation IDs', 'Error tracing'] } },
    { id: 'notify',   type: 'arch', position: { x: 840,  y: 60  },
      data: { label: 'Alert Channels',  icon: 'mdi:bell-ring',             color: 'rose',
              lines: ['Email / webhook', 'Slack notify', 'PagerDuty'] } },
    { id: 'dash',     type: 'arch', position: { x: 840,  y: 280 },
      data: { label: 'Live Dashboards', icon: 'mdi:monitor-dashboard',     color: 'orange',
              lines: ['Pod health', 'GPU utilization', 'Request rates'] } },
  ],
}

const allEdges = {
  'cluster': [
    { id: 'e1', source: 'control', target: 'wn-app',  animated: true, type: 'smoothstep', class: 'e-primary',
      markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },
    { id: 'e2', source: 'control', target: 'wn-data', animated: true, type: 'smoothstep', class: 'e-primary',
      markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },
    { id: 'e3', source: 'control', target: 'wn-ai',   animated: true, type: 'smoothstep', class: 'e-primary',
      markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },
    { id: 'e4', source: 'wn-app',  target: 'app',                     type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
    { id: 'e5', source: 'wn-data', target: 'data',                    type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
    { id: 'e6', source: 'wn-ai',   target: 'ai',                      type: 'smoothstep', class: 'e-ai',
      markerEnd: { type: 'arrowclosed', color: '#a855f7' } },
    { id: 'e7', source: 'app',     target: 'ingress',                 type: 'smoothstep', class: 'e-support',
      markerEnd: { type: 'arrowclosed', color: '#94a3b8' } },
    { id: 'e8', source: 'data',    target: 'storage',                 type: 'smoothstep', class: 'e-storage',
      markerEnd: { type: 'arrowclosed', color: '#3b82f6' } },
    { id: 'e9', source: 'ai',      target: 'storage',                 type: 'smoothstep', class: 'e-storage',
      markerEnd: { type: 'arrowclosed', color: '#3b82f6' } },
  ],
  'deploy': [
    { id: 'e1', source: 'push',     target: 'runner',   animated: true, type: 'smoothstep', class: 'e-queue',
      markerEnd: { type: 'arrowclosed', color: '#f97316' } },
    { id: 'e2', source: 'runner',   target: 'lint',                     type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
    { id: 'e3', source: 'runner',   target: 'build',                    type: 'smoothstep', class: 'e-primary',
      markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },
    { id: 'e4', source: 'runner',   target: 'test',                     type: 'smoothstep', class: 'e-ai',
      markerEnd: { type: 'arrowclosed', color: '#a855f7' } },
    { id: 'e5', source: 'build',    target: 'registry',                 type: 'smoothstep', class: 'e-storage',
      markerEnd: { type: 'arrowclosed', color: '#3b82f6' } },
    { id: 'e6', source: 'lint',     target: 'manifest',                 type: 'smoothstep', class: 'e-support',
      markerEnd: { type: 'arrowclosed', color: '#94a3b8' } },
    { id: 'e7', source: 'test',     target: 'manifest',                 type: 'smoothstep', class: 'e-support',
      markerEnd: { type: 'arrowclosed', color: '#94a3b8' } },
    { id: 'e8', source: 'registry', target: 'manifest',                 type: 'smoothstep', class: 'e-storage',
      markerEnd: { type: 'arrowclosed', color: '#3b82f6' } },
    { id: 'e9', source: 'manifest', target: 'cluster',  animated: true, type: 'smoothstep', class: 'e-primary',
      markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },
  ],
  'observability': [
    { id: 'e1', source: 'cluster', target: 'prom',    animated: true, type: 'smoothstep', class: 'e-queue',
      markerEnd: { type: 'arrowclosed', color: '#f97316' } },
    { id: 'e2', source: 'cluster', target: 'logs',                    type: 'smoothstep', class: 'e-support',
      markerEnd: { type: 'arrowclosed', color: '#94a3b8' } },
    { id: 'e3', source: 'prom',    target: 'alert',                   type: 'smoothstep', class: 'e-queue',
      markerEnd: { type: 'arrowclosed', color: '#f97316' } },
    { id: 'e4', source: 'prom',    target: 'grafana',                 type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
    { id: 'e5', source: 'alert',   target: 'notify',                  type: 'smoothstep', class: 'e-ai',
      markerEnd: { type: 'arrowclosed', color: '#fb7185' } },
    { id: 'e6', source: 'grafana', target: 'dash',                    type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
  ],
}

const legends = {
  'cluster': [
    { color: '#0ea5e9', label: 'Scheduling' },
    { color: '#10b981', label: 'App workloads' },
    { color: '#a855f7', label: 'AI workloads' },
    { color: '#3b82f6', label: 'Storage' },
    { color: '#94a3b8', label: 'Ingress routing', dashed: true },
  ],
  'deploy': [
    { color: '#f97316', label: 'Trigger' },
    { color: '#0ea5e9', label: 'Build / deploy' },
    { color: '#3b82f6', label: 'Registry' },
    { color: '#10b981', label: 'Lint / test' },
    { color: '#94a3b8', label: 'Gate (pass required)', dashed: true },
  ],
  'observability': [
    { color: '#f97316', label: 'Metric scrape' },
    { color: '#10b981', label: 'Dashboard data' },
    { color: '#fb7185', label: 'Alert fire' },
    { color: '#94a3b8', label: 'Log stream', dashed: true },
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
