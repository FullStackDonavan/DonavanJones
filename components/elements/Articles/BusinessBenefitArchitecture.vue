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
const activeView       = ref('system-overview')

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
  { id: 'system-overview',   label: 'System Overview'   },
  { id: 'invite-flow',       label: 'Invite Flow'       },
  { id: 'document-pipeline', label: 'Document Pipeline' },
]

// ── Nodes per view ─────────────────────────────────────────────────────────
const allNodes = {

  'system-overview': [
    { id: 'owner',    type: 'arch', position: { x: 0,   y: 100 },
      data: { label: 'Owner Dashboard',    icon: 'mdi:briefcase-account', color: 'sky',
              lines: ['Company overview', 'Employee list + soft delete', 'Enrollment progress'] } },
    { id: 'employee', type: 'arch', position: { x: 0,   y: 290 },
      data: { label: 'Employee Dashboard', icon: 'mdi:account-multiple',  color: 'purple',
              lines: ['Application step tracker', 'Plan selection + opt-ins', 'Insurance card download'] } },
    { id: 'admin',    type: 'arch', position: { x: 0,   y: 475 },
      data: { label: 'Admin Dashboard',    icon: 'mdi:shield-check',      color: 'amber',
              lines: ['All company enrollments', 'Fulfill enrollment', 'Upload insurance cards'] } },
    { id: 'nitro',    type: 'arch', position: { x: 280, y: 290 },
      data: { label: 'Nitro API',          icon: 'logos:nodejs-icon',     color: 'green',
              lines: ['Enrollment state machine', 'Role-scoped data access', 'Business code validation'] } },
    { id: 'postgres', type: 'arch', position: { x: 560, y: 60  },
      data: { label: 'PostgreSQL',         icon: 'logos:postgresql',      color: 'emerald',
              lines: ['Company + employee records', 'Application data', 'Audit log (append-only)'] } },
    { id: 'email',    type: 'arch', position: { x: 560, y: 290 },
      data: { label: 'Nodemailer',         icon: 'mdi:email-fast',        color: 'cyan',
              lines: ['Invite dispatch', 'Business code embedded', 'Employee sign-up link'] } },
    { id: 'pdf',      type: 'arch', position: { x: 560, y: 475 },
      data: { label: 'PDF Generator',      icon: 'mdi:file-pdf-box',      color: 'violet',
              lines: ['Server-side render', 'Signature composited', 'Application + payment auth'] } },
    { id: 's3',       type: 'arch', position: { x: 840, y: 290 },
      data: { label: 'AWS S3',             icon: 'mdi:cloud-upload',      color: 'orange',
              lines: ['Signed PDFs + audit exports', 'Insurance card storage', 'Pre-signed URL delivery'] } },
  ],

  // ── Invite flow ────────────────────────────────────────────────────────
  //
  //  Row 1 (invite dispatch):
  //    owner(0,180) → dispatch(260,180) → email(520,60) → employee(780,180)
  //
  //  Row 2 (sign-up validation):
  //    employee ↘ validate(260,370) → postgres(520,370)
  //
  'invite-flow': [
    { id: 'owner',    type: 'arch', position: { x: 0,   y: 180 },
      data: { label: 'Owner',       icon: 'mdi:briefcase-account', color: 'sky',
              lines: ['Sends invite from dashboard', 'Enters employee email', 'Business code auto-attached'] } },
    { id: 'dispatch', type: 'arch', position: { x: 260, y: 180 },
      data: { label: 'Nitro API',   icon: 'logos:nodejs-icon',     color: 'green',
              lines: ['Processes invite request', 'Generates unique business code', 'Dispatches Nodemailer job'] } },
    { id: 'email',    type: 'arch', position: { x: 520, y: 60  },
      data: { label: 'Nodemailer',  icon: 'mdi:email-fast',        color: 'cyan',
              lines: ['Dispatches invite email', 'Business code embedded in body', 'Sign-up link included'] } },
    { id: 'employee', type: 'arch', position: { x: 780, y: 180 },
      data: { label: 'Employee',    icon: 'mdi:account-multiple',  color: 'purple',
              lines: ['Receives invite email', 'Clicks sign-up link', 'Submits business code on register'] } },
    { id: 'validate', type: 'arch', position: { x: 260, y: 370 },
      data: { label: 'Nitro API',   icon: 'logos:nodejs-icon',     color: 'green',
              lines: ['Validates business code', 'Checks company match', 'Rejects expired or used codes'] } },
    { id: 'postgres', type: 'arch', position: { x: 520, y: 370 },
      data: { label: 'PostgreSQL',  icon: 'logos:postgresql',      color: 'emerald',
              lines: ['Employee record created', 'Linked to company account', 'Business code marked used'] } },
  ],

  // ── Document pipeline ──────────────────────────────────────────────────
  //
  //  form(0,200) → nitro(280,200) → pdf(560,60) → s3(840,60)
  //                    ↓                               ↓
  //              postgres(560,380) ←─────────────── s3 key
  //
  'document-pipeline': [
    { id: 'form',     type: 'arch', position: { x: 0,   y: 200 },
      data: { label: 'Application Form', icon: 'mdi:clipboard-text',  color: 'slate',
              lines: ['Multi-step form submission', 'Family info + plan selection', 'Signature pad captured'] } },
    { id: 'nitro',    type: 'arch', position: { x: 280, y: 200 },
      data: { label: 'Nitro API',        icon: 'logos:nodejs-icon',   color: 'green',
              lines: ['Zod schema validation', 'Enrollment step enforcement', 'Coordinates document pipeline'] } },
    { id: 'pdf',      type: 'arch', position: { x: 560, y: 60  },
      data: { label: 'PDF Generator',    icon: 'mdi:file-pdf-box',    color: 'violet',
              lines: ['Template rendered server-side', 'Signature composited into doc', 'Full signed document output'] } },
    { id: 's3',       type: 'arch', position: { x: 840, y: 60  },
      data: { label: 'AWS S3',           icon: 'mdi:cloud-upload',    color: 'orange',
              lines: ['PDF written to S3', 'Structured key path per company', 'Returns S3 object key'] } },
    { id: 'postgres', type: 'arch', position: { x: 560, y: 380 },
      data: { label: 'PostgreSQL',       icon: 'logos:postgresql',    color: 'emerald',
              lines: ['S3 key stored in DB record', 'Audit log entry written', 'Enrollment step advanced'] } },
  ],
}

// ── Edges per view ─────────────────────────────────────────────────────────
const allEdges = {

  'system-overview': [
    { id: 'e1', source: 'owner',    target: 'nitro',    animated: true, type: 'smoothstep', class: 'e-primary',
      markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },
    { id: 'e2', source: 'employee', target: 'nitro',    animated: true, type: 'smoothstep', class: 'e-primary',
      markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },
    { id: 'e3', source: 'admin',    target: 'nitro',    animated: true, type: 'smoothstep', class: 'e-queue',
      markerEnd: { type: 'arrowclosed', color: '#f97316' } },
    { id: 'e4', source: 'nitro',    target: 'postgres',                 type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
    { id: 'e5', source: 'nitro',    target: 'email',                    type: 'smoothstep', class: 'e-queue',
      markerEnd: { type: 'arrowclosed', color: '#f97316' } },
    { id: 'e6', source: 'nitro',    target: 'pdf',                      type: 'smoothstep', class: 'e-doc',
      markerEnd: { type: 'arrowclosed', color: '#a855f7' } },
    { id: 'e7', source: 'pdf',      target: 's3',                       type: 'smoothstep', class: 'e-storage',
      markerEnd: { type: 'arrowclosed', color: '#3b82f6' } },
    { id: 'e8', source: 'nitro',    target: 's3',                       type: 'smoothstep', class: 'e-storage',
      markerStart: { type: 'arrowclosed', color: '#3b82f6' },
      markerEnd:   { type: 'arrowclosed', color: '#3b82f6' } },
  ],

  'invite-flow': [
    { id: 'e1', source: 'owner',    target: 'dispatch', animated: true, type: 'smoothstep', class: 'e-primary',
      markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },
    { id: 'e2', source: 'dispatch', target: 'email',    animated: true, type: 'smoothstep', class: 'e-queue',
      markerEnd: { type: 'arrowclosed', color: '#f97316' } },
    { id: 'e3', source: 'email',    target: 'employee', animated: true, type: 'smoothstep', class: 'e-realtime',
      markerEnd: { type: 'arrowclosed', color: '#06b6d4' } },
    { id: 'e4', source: 'employee', target: 'validate', animated: true, type: 'smoothstep', class: 'e-primary',
      markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },
    { id: 'e5', source: 'validate', target: 'postgres',                 type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
  ],

  'document-pipeline': [
    { id: 'e1', source: 'form',     target: 'nitro',    animated: true, type: 'smoothstep', class: 'e-primary',
      markerEnd: { type: 'arrowclosed', color: '#0ea5e9' } },
    { id: 'e2', source: 'nitro',    target: 'pdf',      animated: true, type: 'smoothstep', class: 'e-doc',
      markerEnd: { type: 'arrowclosed', color: '#a855f7' } },
    { id: 'e3', source: 'pdf',      target: 's3',       animated: true, type: 'smoothstep', class: 'e-storage',
      markerEnd: { type: 'arrowclosed', color: '#3b82f6' } },
    { id: 'e4', source: 's3',       target: 'postgres',                 type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
    { id: 'e5', source: 'nitro',    target: 'postgres',                 type: 'smoothstep', class: 'e-data',
      markerEnd: { type: 'arrowclosed', color: '#10b981' } },
  ],
}

// ── Legends per view ───────────────────────────────────────────────────────
const legends = {
  'system-overview': [
    { color: '#0ea5e9', label: 'Client request' },
    { color: '#10b981', label: 'Data ops' },
    { color: '#f97316', label: 'Queue / email' },
    { color: '#a855f7', label: 'Document pipeline' },
    { color: '#3b82f6', label: 'Storage' },
  ],
  'invite-flow': [
    { color: '#0ea5e9', label: 'Client request' },
    { color: '#f97316', label: 'Email dispatch' },
    { color: '#06b6d4', label: 'Email delivery' },
    { color: '#10b981', label: 'Data ops' },
  ],
  'document-pipeline': [
    { color: '#0ea5e9', label: 'Form submission' },
    { color: '#a855f7', label: 'Document pipeline' },
    { color: '#3b82f6', label: 'Storage write' },
    { color: '#10b981', label: 'DB record + audit' },
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
            h('div', { class: 'bba-node', style: { background: c.bg, borderColor: c.border } }, [
              h('div', { class: 'bba-node-head' }, [
                h('div', { class: 'bba-icon', style: { borderColor: c.border } }, [
                  h(IconComponent, { name: props.data.icon, style: { color: c.icon, fontSize: '24px' } }),
                ]),
                h('span', { class: 'bba-label' }, props.data.label),
              ]),
              props.data.lines?.length
                ? h('ul', { class: 'bba-lines' }, props.data.lines.map(l => h('li', l)))
                : null,
            ]),
            h(Handle, { type: 'target', position: Position.Left,   class: 'bba-handle' }),
            h(Handle, { type: 'source', position: Position.Right,  class: 'bba-handle' }),
            h(Handle, { id: 'top',    type: 'target', position: Position.Top,    class: 'bba-handle' }),
            h(Handle, { id: 'bottom', type: 'source', position: Position.Bottom, class: 'bba-handle' }),
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
:deep(.bba-node) {
  border: 1px solid;
  border-radius: 10px;
  padding: 10px 12px;
  min-width: 158px;
  max-width: 230px;
  box-sizing: border-box;
  cursor: default;
  @apply dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)];
}

:deep(.bba-node-head) {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

:deep(.bba-icon) {
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

:deep(.bba-label) {
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.2;
  color: #1e293b;
  @apply dark:text-slate-100;
}

:deep(.bba-lines) {
  list-style: none;
  margin: 0;
  padding: 0;
}

:deep(.bba-lines li) {
  font-size: 11px;
  color: #475569;
  line-height: 1.5;
  padding-left: 10px;
  position: relative;
  @apply dark:text-slate-300;
}

:deep(.bba-lines li::before) {
  content: '·';
  position: absolute;
  left: 2px;
  font-weight: bold;
  color: #94a3b8;
  @apply dark:text-slate-500;
}

:deep(.bba-handle) {
  width: 6px !important;
  height: 6px !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  pointer-events: none !important;
  opacity: 0 !important;
}

:deep(.vue-flow__pane)        { cursor: grab; }
:deep(.vue-flow__pane:active) { cursor: grabbing; }

:deep(.vue-flow__node.selected > *),
:deep(.vue-flow__node:focus > *) {
  outline: none !important;
  box-shadow: none !important;
}

:deep(.vue-flow__edge.e-primary .vue-flow__edge-path) { stroke: #0ea5e9; stroke-width: 1.8px; }
:deep(.vue-flow__edge.e-data    .vue-flow__edge-path) { stroke: #10b981; stroke-width: 1.6px; }
:deep(.vue-flow__edge.e-queue   .vue-flow__edge-path) { stroke: #f97316; stroke-width: 1.6px; }
:deep(.vue-flow__edge.e-realtime .vue-flow__edge-path){ stroke: #06b6d4; stroke-width: 1.6px; }
:deep(.vue-flow__edge.e-doc     .vue-flow__edge-path) { stroke: #a855f7; stroke-width: 1.6px; }
:deep(.vue-flow__edge.e-storage .vue-flow__edge-path) { stroke: #3b82f6; stroke-width: 1.6px; }

:deep(.vue-flow__edge-label) {
  font-size: 10px;
  fill: #94a3b8;
}

:deep(.vue-flow__background) {
  color: rgba(100,116,139,0.12);
}
</style>
