<template>
    
  <div
    class="relative w-full bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#0f1f2e]
           p-4 md:p-8 lg:p-10 rounded-xl overflow-hidden border border-sky-500/20"
  >
    <!-- Background effects -->
    <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl opacity-15 bg-sky-400 pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-24 w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl opacity-10 bg-purple-500 pointer-events-none"></div>

    <!-- HEADER -->
    <!-- <div class="relative z-10 text-center mb-10">
      <h2 class="text-2xl md:text-3xl font-bold text-sky-300">
        Private Cloud AI System Architecture
      </h2>
      <p class="text-slate-400 text-sm md:text-base mt-2">
        Distributed Kubernetes + AI inference + data infrastructure system
      </p>
    </div> -->



    <!-- LOADING -->
    <div
      v-if="isLoading"
      class="relative z-10 flex items-center justify-center min-h-96"
    >
      <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-sky-500/30 border-t-sky-400 rounded-full animate-spin"></div>
        <p class="text-slate-400 text-sm">Loading architecture diagram...</p>
      </div>
    </div>

    <!-- DIAGRAM -->
    <div v-show="!isLoading" class="relative z-10 mb-10">
      <div
        v-if="vueFlowReady"
        class="w-full h-[520px] rounded-lg border border-sky-500/10 bg-slate-900/40 overflow-hidden"
      >
        <component
          :is="VueFlowComponent"
          :nodes="nodes"
          :edges="edges"
          :nodeTypes="nodeTypes"
          class="w-full h-full"
        />
      </div>

      <div
        v-else
        class="p-6 bg-slate-900/60 rounded-lg border border-rose-500/10 text-center text-slate-300"
      >
        VueFlow not available. Install:
        <span class="font-mono">npm install @vue-flow/core</span>
      </div>
    </div>

    
    <!-- LEGEND -->
    <div
      class="relative z-10 flex flex-wrap gap-4 justify-center p-4 bg-slate-900/50 rounded-lg border border-sky-500/10"
    >
      <div class="flex items-center gap-2 text-xs text-slate-300">
        <div class="w-3 h-3 bg-sky-500 rounded"></div>
        User / Flow
      </div>
      <div class="flex items-center gap-2 text-xs text-slate-300">
        <div class="w-3 h-3 bg-purple-500 rounded"></div>
        AI Systems
      </div>
      <div class="flex items-center gap-2 text-xs text-slate-300">
        <div class="w-3 h-3 bg-emerald-500 rounded"></div>
        Infrastructure
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineComponent, h } from 'vue'
// Note: this component uses VueFlow — install the package before running:
// npm install @vue-flow/core

const isLoading = ref(true)
const VueFlowComponent = ref(null)
const nodes = ref([
  // Main flow (left -> right)
  { id: 'user', type: 'custom', position: { x: 0, y: 200 }, data: { label: 'User Requests', icon: 'mdi:laptop' }, class: 'arch-node' },
  { id: 'ingress', type: 'custom', position: { x: 260, y: 100 }, data: { label: 'Ingress Controller', icon: 'mdi:server-network', lines: ['TLS termination', 'Domain routing', 'Rate limiting', 'Auth (optional)'] }, class: 'arch-node ingress-node' },
  { id: 'fastapi', type: 'custom', position: { x: 520, y: 100 }, data: { label: 'FastAPI', icon: 'mdi:api', lines: ['API Gateway', 'Validation', 'Background Tasks'] }, class: 'arch-node' },

  // Data layer
  { id: 'data-layer', type: 'cluster', position: { x: 820, y: 100 }, data: { label: 'Data Layer', icon: 'mdi:database', lines: ['Redis — Cache / Sessions / Queues', 'Postgres — Primary Relational DB'] }, class: 'arch-cluster' },

  // AI compute (grouped)
  { id: 'ai-layer', type: 'cluster', position: { x: 1160, y: 110 }, data: { label: 'AI Layer', icon: 'mdi:cpu-64-bit', lines: ['RTX 3090 — LLM inference · Embeddings · RAG · Batch processing', 'Jetson Orin Nano — Edge AI · Vision · Lightweight inference'] }, class: 'arch-cluster' },

  // Individual AI nodes (GPU + Edge)
 {
  id: 'ai-compute',
  type: 'custom',
  position: { x: 1300, y: 110 },
  class: 'arch-node arch-ai',
  data: {
    label: 'AI Compute Layer',
    icon: 'mdi:chip',
    lines: [
      'RTX 3090 → LLM inference, embeddings, RAG, batch processing',
      'Jetson Orin Nano → Edge AI, vision models, lightweight inference',
    ],
  },
},

  // Storage
  { id: 'minio', type: 'custom', position: { x: 1680, y: 120 }, data: { label: 'MinIO', icon: 'mdi:database', lines: ['Model artifacts', 'Datasets', 'Documents', 'Media files', 'Backups'] }, class: 'arch-node' },

  // Supporting infra (bottom row)
  { id: 'k3s', type: 'custom', position: { x: 480, y: 360 }, data: { label: 'Kubernetes on ARM64', icon: 'mdi:raspberry-pi', lines: ['Raspberry Pi 5 k3s cluster', 'Orchestration · Scheduling · LB'] }, class: 'arch-node' },
  { id: 'ci', type: 'custom', position: { x: 120, y: 360 }, data: { label: 'CI/CD', icon: 'mdi:git', lines: ['Gitea → Runner → Docker → Deploy'] }, class: 'arch-node' },
  { id: 'observability', type: 'custom', position: { x: 840, y: 360 }, data: { label: 'Observability', icon: 'mdi:chart-line', lines: ['Prometheus · Grafana · Alerts · Logs'] }, class: 'arch-node' },
  { id: 'networking', type: 'custom', position: { x: 1200, y: 360 }, data: { label: 'Networking', icon: 'mdi:network', lines: ['Internal DNS', 'Service mesh (planned)', 'Private overlay', 'Firewall'] }, class: 'arch-node' },
])

// Custom node renderers
const CustomNode = defineComponent({
  props: ['id', 'data'],
  setup(props) {
    return () => h('div', { class: 'custom-node p-2 text-left' }, [
      h('div', { class: 'flex items-center gap-3' }, [
        h('div', { class: 'w-8 h-8 rounded bg-slate-800/40 flex items-center justify-center border border-sky-500/10' }, [
          h('Icon', { name: props.data.icon, class: 'w-5 h-5 text-sky-300' })
        ]),
        h('div', { class: 'font-semibold text-sky-100' }, props.data.label)
      ]),
      props.data.lines ? h('ul', { class: 'mt-2 text-xs text-slate-300 list-disc list-inside' }, props.data.lines.map(line => h('li', line))) : null
    ])
  }
})

const ClusterNode = defineComponent({
  props: ['id', 'data'],
  setup(props) {
    return () => h('div', { class: 'cluster-node p-3' }, [
      h('div', { class: 'flex items-center gap-3 mb-2' }, [
        h('div', { class: 'w-8 h-8 rounded bg-slate-800/30 flex items-center justify-center border border-sky-500/8' }, [
          h('Icon', { name: props.data.icon, class: 'w-5 h-5 text-emerald-300' })
        ]),
        h('div', { class: 'font-semibold text-sky-100' }, props.data.label)
      ]),
      props.data.lines ? h('div', { class: 'text-sm text-slate-300' }, props.data.lines.join('\n')) : null
    ])
  }
})

const edges = ref([
  // Main request lifecycle
  {
    id: 'e-user-ingress',
    source: 'user',
    target: 'ingress',
    animated: true,
    class: 'edge-primary',
    type: 'smoothstep',
    markerStart: { type: 'arrowclosed', color: 'rgba(14,165,233,0.95)' },
    markerEnd: { type: 'arrowclosed', color: 'rgba(14,165,233,0.95)' },
  },

  {
    id: 'e-ingress-fastapi',
    source: 'ingress',
    target: 'fastapi',
    animated: true,
    class: 'edge-primary',
    type: 'smoothstep',
    markerStart: { type: 'arrowclosed', color: 'rgba(14,165,233,0.95)' },
    markerEnd: { type: 'arrowclosed', color: 'rgba(14,165,233,0.95)' },
  },

  // FastAPI -> Data (grouped)
  {
    id: 'e-fastapi-data',
    source: 'fastapi',
    target: 'data-layer',
    animated: false,
    class: 'edge-data',
    type: 'smoothstep',
    markerStart: { type: 'arrowclosed', color: 'rgba(34,197,94,0.9)' },
    markerEnd: { type: 'arrowclosed', color: 'rgba(34,197,94,0.9)' },
  },

  // User bottom -> Data bottom
  {
    id: 'e-user-data-bottom',
    source: 'user',
    sourceHandle: 'bottom',
    target: 'data-layer',
    targetHandle: 'bottom',
    animated: false,
    class: 'edge-data',
    type: 'smoothstep',
    markerEnd: { type: 'arrowclosed', color: 'rgba(34,197,94,0.95)' },
  },

  // User bottom -> AI bottom
  {
    id: 'e-user-ai-bottom',
    source: 'user',
    sourceHandle: 'bottom',
    target: 'ai-layer',
    targetHandle: 'bottom',
    animated: false,
    class: 'edge-data',
    type: 'smoothstep',
    markerEnd: { type: 'arrowclosed', color: 'rgba(168,85,247,0.95)' },
  },

  // User bottom -> MinIO bottom
  {
    id: 'e-user-minio-bottom',
    source: 'user',
    sourceHandle: 'bottom',
    target: 'minio',
    targetHandle: 'bottom',
    animated: false,
    class: 'edge-storage',
    type: 'smoothstep',
    markerEnd: { type: 'arrowclosed', color: 'rgba(96,165,250,0.95)' },
  },

  // Data ↔ AI (bidirectional)
  {
    id: 'e-data-ai',
    source: 'data-layer',
    target: 'ai-layer',
    animated: false,
    class: 'edge-data',
    type: 'smoothstep',
    markerStart: { type: 'arrowclosed', color: 'rgba(34,197,94,0.9)' },
    markerEnd: { type: 'arrowclosed', color: 'rgba(34,197,94,0.9)' },
  },

  // AI ↔ MinIO
  {
    id: 'e-ai-minio',
    source: 'ai-layer',
    target: 'minio',
    animated: false,
    class: 'edge-storage',
    markerStart: { type: 'arrowclosed', color: 'rgba(96,165,250,0.9)' },
    markerEnd: { type: 'arrowclosed', color: 'rgba(96,165,250,0.9)' },
  },

  // CI ↔ K3s
  {
    id: 'e-ci-k3s',
    source: 'ci',
    target: 'k3s',
    animated: false,
    class: 'edge-support',
    markerStart: { type: 'arrowclosed', color: 'rgba(148,163,184,0.6)' },
    markerEnd: { type: 'arrowclosed', color: 'rgba(148,163,184,0.6)' },
  },

  // K3s ↔ Networking
  {
    id: 'e-k3s-network',
    source: 'k3s',
    target: 'networking',
    animated: false,
    class: 'edge-support',
    markerStart: { type: 'arrowclosed', color: 'rgba(148,163,184,0.6)' },
    markerEnd: { type: 'arrowclosed', color: 'rgba(148,163,184,0.6)' },
  },
])

// allow nodeTypes to be injected after VueFlow import (so we can include Handle)
const nodeTypes = ref({})

const vueFlowReady = ref(false)

onMounted(async () => {
  // dynamic import so SSR doesn't break and so package can be optional until installed
  try {
    const mod = await import('@vue-flow/core')
    // import CSS separately
    await import('@vue-flow/core/dist/style.css')
    const { VueFlow, Handle, Position } = mod

    // create node components that include connection handles on sides and bottom only
    const CustomNodeWithHandles = defineComponent({
      props: ['id', 'data'],
      setup(props) {
        return () => h('div', { class: 'custom-node p-2 text-left' }, [
          h('div', { class: 'flex items-center gap-3' }, [
            h('div', { class: 'w-8 h-8 rounded bg-slate-800/40 flex items-center justify-center border border-sky-500/10' }, [
              h('Icon', { name: props.data.icon, class: 'w-5 h-5 text-sky-300' })
            ]),
            h('div', { class: 'font-semibold text-sky-100' }, props.data.label)
          ]),
          props.data.lines ? h('ul', { class: 'mt-2 text-xs text-slate-300 list-disc list-inside' }, props.data.lines.map(line => h('li', line))) : null,
          // left and right handles (both target/source)
          h(Handle, { type: 'target', position: Position.Left }),
          h(Handle, { type: 'source', position: Position.Right }),
          // bottom handle (source) — add id so edges can target this handle
          h(Handle, { id: 'bottom', type: 'source', position: Position.Bottom, style: { bottom: '-8px' } })
        ])
      }
    })

    const ClusterNodeWithHandles = defineComponent({
      props: ['id', 'data'],
      setup(props) {
        return () => h('div', { class: 'cluster-node p-3' }, [
          h('div', { class: 'flex items-center gap-3 mb-2' }, [
            h('div', { class: 'w-8 h-8 rounded bg-slate-800/30 flex items-center justify-center border border-sky-500/8' }, [
              h('Icon', { name: props.data.icon, class: 'w-5 h-5 text-emerald-300' })
            ]),
            h('div', { class: 'font-semibold text-sky-100' }, props.data.label)
          ]),
          props.data.lines ? h('div', { class: 'text-sm text-slate-300' }, props.data.lines.join('\n')) : null,
          h(Handle, { type: 'target', position: Position.Left }),
          h(Handle, { type: 'source', position: Position.Right }),
          h(Handle, { id: 'bottom', type: 'source', position: Position.Bottom })
        ])
      }
    })

    // register the component and node types
    VueFlowComponent.value = VueFlow
    nodeTypes.value = { custom: CustomNodeWithHandles, cluster: ClusterNodeWithHandles }
    vueFlowReady.value = true
  } catch (err) {
    // If package is not installed, log an instruction and fall back to showing nothing
    // User should run: npm install @vue-flow/core
    // Keep the spinner hidden and show a helpful message
    console.error('VueFlow not installed. Run: npm install @vue-flow/core')
  }
  isLoading.value = false
})
</script>

<style scoped>
/* Mermaid diagram styling */
.mermaid-container {
  background: linear-gradient(135deg, rgba(15, 15, 30, 0.8) 0%, rgba(26, 26, 46, 0.8) 100%);
  border-radius: 12px;
  border: 1px solid rgba(14, 165, 233, 0.2);
  padding: 20px;
  overflow-x: auto;
  min-height: 400px;
}

:deep(.mermaid) {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.mermaid svg) {
  max-width: 100%;
  height: auto;
}

:deep(.mermaid text) {
  fill: #e0e7ff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
}

:deep(.mermaid .nodeLabel) {
  background-color: transparent;
  color: #f0f9ff;
  font-size: 16px;
  font-weight: 700;
}

:deep(.mermaid .node rect) {
  stroke-width: 3px;
}

:deep(.mermaid .cluster rect) {
  stroke-width: 1.5px;
  opacity: 0.8;
}

:deep(.mermaid .edgeLabel) {
  background-color: rgba(15, 15, 30, 0.9);
  color: #cbd5e1;
  padding: 2px 4px;
  border-radius: 4px;
}

:deep(.mermaid path) {
  stroke-width: 3px;
  stroke: rgba(14,165,233,0.9);
}

:deep(.mermaid .arrowheadPath) {
  stroke-width: 2px;
}

:deep(.mermaid .dashed-line) {
  stroke-dasharray: 5, 5;
}

/* Responsive */
@media (max-width: 768px) {
  .mermaid-container {
    padding: 12px;
    min-height: 300px;
  }

  :deep(.mermaid text) {
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .mermaid-container {
    padding: 8px;
    min-height: 250px;
  }

  :deep(.mermaid text) {
    font-size: 9px;
  }
}

/* VueFlow custom node styles */
:deep(.vue-flow__node.arch-node) {
  border-radius: 10px;
  padding: 10px 12px;
  background: linear-gradient(90deg, rgba(4,6,23,0.85), rgba(3,9,30,0.9));
  border: 1px solid rgba(14,165,233,0.12);
  box-shadow: 0 6px 22px rgba(14,165,233,0.03), 0 1px 0 rgba(255,255,255,0.02) inset;
}

:deep(.vue-flow__node.arch-node .vue-flow__node-body) {
  color: #e6f7ff;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1.15;
}

:deep(.vue-flow__node.arch-node .vue-flow__node-label) {
  color: #cfeffd;
}

/* Cluster / group styling */
:deep(.vue-flow__node.arch-cluster) {
  background: linear-gradient(180deg, rgba(8,10,20,0.45), rgba(6,8,18,0.35));
  border: 1px solid rgba(148,163,184,0.06);
  box-shadow: 0 10px 30px rgba(2,6,23,0.6) inset;
  border-radius: 12px;
}

:deep(.vue-flow__node.arch-cluster .vue-flow__node-body) {
  color: #9fbcd8;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 12px 14px;
}

:deep(.vue-flow__node.ingress-node .vue-flow__node-body) {
  white-space: pre-line;
  font-size: 13px;
  line-height: 1.2;
  text-align: left;
}

/* Edge styling (neon strokes and subtle glow) */
:deep(.vue-flow__edge.path) {
  filter: drop-shadow(0 6px 14px rgba(14,165,233,0.06));
}

:deep(.vue-flow__edge.edge-primary .vue-flow__edge-path) {
  stroke: rgba(14,165,233,0.95);
  stroke-width: 1.6px;
  stroke-linecap: round;
  filter: drop-shadow(0 6px 18px rgba(14,165,233,0.22));
}

:deep(.vue-flow__edge.edge-ai .vue-flow__edge-path) {
  stroke: rgba(168,85,247,0.9);
  stroke-width: 2.5px;
  filter: drop-shadow(0 6px 18px rgba(168,85,247,0.18));
}

:deep(.vue-flow__edge.edge-data .vue-flow__edge-path) {
  stroke: rgba(34,197,94,0.9);
  stroke-width: 2px;
  filter: drop-shadow(0 6px 14px rgba(34,197,94,0.12));
}

:deep(.vue-flow__edge.edge-storage .vue-flow__edge-path) {
  stroke: rgba(96,165,250,0.9);
  stroke-width: 2px;
}

:deep(.vue-flow__edge.edge-support .vue-flow__edge-path) {
  stroke: rgba(148,163,184,0.6);
  stroke-dasharray: 6 6;
}

/* Custom node content sizing */
:deep(.custom-node) {
  min-width: 140px;
  max-width: 320px;
  padding: 10px;
  box-sizing: border-box;
}

:deep(.custom-node .w-8) {
  min-width: 32px;
  min-height: 32px;
}

:deep(.cluster-node) {
  display: block;
  min-width: 240px;
  max-width: 520px;
  padding: 12px;
  box-sizing: border-box;
}

:deep(.cluster-node .text-sm) {
  white-space: pre-line;
}

/* Connection handles styled as neon circles */
:deep(.vue-flow__handle) {
  width: 12px;
  height: 12px;
  border-radius: 9999px;
  background: rgba(14,165,233,0.95);
  border: 2px solid rgba(255,255,255,0.06);
  box-shadow: 0 6px 14px rgba(14,165,233,0.16);
  transform: translate(-50%, -50%);
  z-index: 40;
}

:deep(.vue-flow__handle:hover) {
  transform: translate(-50%, -50%) scale(1.25);
}

/* Per-node-type handle colors */
:deep(.vue-flow__node.arch-cluster .vue-flow__handle) {
  background: rgba(34,197,94,0.95);
  box-shadow: 0 6px 14px rgba(34,197,94,0.12);
}

:deep(.vue-flow__node.arch-node .vue-flow__handle) {
  background: rgba(14,165,233,0.95);
  box-shadow: 0 6px 14px rgba(14,165,233,0.16);
}

:deep(.vue-flow__node.ingress-node .vue-flow__handle) {
  background: rgba(168,85,247,0.9);
  box-shadow: 0 6px 14px rgba(168,85,247,0.12);
}

:deep(.vue-flow__handle.source) {
  border-color: rgba(255,255,255,0.08);
}

:deep(.vue-flow__handle.target) {
  border-color: rgba(0,0,0,0.2);
}
</style>
