<script setup lang="ts">
// "At a glance" facts for a project page: status, activity, source,
// deployments and docs (the stack is already in the hero's system snapshot). Public URLs are links; homelab-only URLs (network:
// private) are shown as text, since they only resolve on the home network.
const props = defineProps<{ doc: Record<string, any> }>()

const STATUS_TONE: Record<string, 'success' | 'warning' | 'info' | 'neutral'> = {
  Active: 'success',
  Live: 'success',
  Completed: 'info',
  'In Progress': 'warning',
  Archived: 'neutral',
}

const links = computed(() => {
  const out: { label: string; url: string; private: boolean; icon: string }[] = []
  if (props.doc.liveSite) out.push({ label: 'Live site', url: props.doc.liveSite, private: false, icon: 'mdi:open-in-new' })
  if (props.doc.github) out.push({ label: 'GitHub', url: props.doc.github, private: false, icon: 'mdi:github' })
  for (const d of props.doc.deployments || []) {
    out.push({ label: d.label, url: d.url, private: d.network === 'private', icon: 'mdi:server-network' })
  }
  if (props.doc.repository) out.push({ label: props.doc.repositoryHost || 'Repository', url: props.doc.repository, private: /^https?:\/\/(192\.168|10\.|localhost)/.test(props.doc.repository), icon: 'mdi:source-repository' })
  return out
})

function fmtDate(d?: string) {
  if (!d) return ''
  const t = new Date(d)
  return Number.isNaN(t.getTime()) ? d : t.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
}
const lastActivity = computed(() => props.doc.lastCommit || props.doc.lastUpdated)
</script>

<template>
  <section class="ds-surface overflow-hidden" aria-labelledby="facts-h">
    <h2 id="facts-h" class="sr-only">Project facts</h2>
    <dl class="grid divide-y divide-slate-200 dark:divide-slate-800 md:grid-cols-2 md:divide-y-0 md:divide-x">
      <!-- Status & activity -->
      <div class="p-5 space-y-4">
        <div>
          <dt class="ds-muted mb-1.5">Status</dt>
          <dd class="flex flex-wrap items-center gap-2">
            <UiBadge v-if="doc.status" :tone="STATUS_TONE[doc.status] ?? 'neutral'" dot>{{ doc.status }}</UiBadge>
            <span v-if="doc.projectType" class="text-sm text-slate-600 dark:text-slate-400">{{ doc.projectType }}</span>
          </dd>
        </div>
        <div v-if="lastActivity">
          <dt class="ds-muted mb-1">{{ doc.lastCommit ? 'Last commit' : 'Last updated' }}</dt>
          <dd class="text-sm text-slate-900 dark:text-slate-100 tabular-nums">
            <time :datetime="lastActivity">{{ fmtDate(lastActivity) }}</time>
            <span v-if="doc.commitCount" class="text-slate-500 dark:text-slate-400"> · {{ doc.commitCount }} commits since {{ fmtDate(doc.firstCommit) }}</span>
          </dd>
        </div>
        <div v-if="doc.localPath">
          <dt class="ds-muted mb-1">Local checkout</dt>
          <dd><code class="text-xs break-all text-slate-700 dark:text-slate-300">{{ doc.localPath }}</code></dd>
        </div>
      </div>

      <!-- Links & docs -->
      <div class="p-5 space-y-4">
        <div v-if="links.length">
          <dt class="ds-muted mb-2">Links &amp; deployments</dt>
          <dd>
            <ul class="space-y-2">
              <li v-for="l in links" :key="l.url" class="flex items-start gap-2 text-sm">
                <Icon :name="l.icon" class="mt-0.5 shrink-0 text-slate-400" aria-hidden="true" />
                <div class="min-w-0">
                  <a v-if="!l.private" :href="l.url" target="_blank" rel="noopener noreferrer" class="ds-link font-medium">{{ l.label }}</a>
                  <span v-else class="font-medium text-slate-800 dark:text-slate-200">{{ l.label }}</span>
                  <div v-if="l.private" class="flex flex-wrap items-center gap-1.5 mt-0.5">
                    <code class="text-xs text-slate-500 dark:text-slate-400 break-all">{{ l.url.replace(/^https?:\/\//, '') }}</code>
                    <UiBadge tone="neutral">Private network</UiBadge>
                  </div>
                </div>
              </li>
            </ul>
          </dd>
        </div>
        <div v-if="doc.docs?.length">
          <dt class="ds-muted mb-2">Documentation (in the repository)</dt>
          <dd>
            <ul class="space-y-1">
              <li v-for="d in doc.docs" :key="d.path" class="text-sm text-slate-700 dark:text-slate-300">
                <code class="text-xs text-slate-500 dark:text-slate-400">{{ d.path }}</code> — {{ d.title }}
              </li>
            </ul>
          </dd>
        </div>
      </div>
    </dl>
  </section>
</template>
