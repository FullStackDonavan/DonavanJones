<script setup lang="ts">
// Projects index: searchable, filterable list of every project in
// content/projects. Filters live in the URL (?q=&status=&category=&tech=&sort=&view=)
// so a filtered view can be shared, and the server renders the same view.
const route = useRoute()
const router = useRouter()
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'

const DESCRIPTION = 'Full-stack projects by Donavan Jones: AI pipelines and agent platforms, multi-tenant SaaS for trades and health plans, and the self-hosted Kubernetes infrastructure they run on.'
useSeoMeta({
  title: 'Projects — Donavan Jones',
  description: DESCRIPTION,
  ogTitle: 'Projects — Donavan Jones',
  ogDescription: DESCRIPTION,
  ogType: 'website',
  ogImage: `${_SITE}/img/heroes/projects.jpg`,
  twitterImage: `${_SITE}/img/heroes/projects.jpg`,
  ogUrl: `${_SITE}/projects/overview`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Projects — Donavan Jones',
  twitterDescription: DESCRIPTION,
})

interface ProjectDoc {
  _path: string
  title: string
  description?: string
  highlight?: string
  status?: string
  category?: string
  tags?: string[]
  excerptImage?: string
  liveSite?: string
  projectType?: string
  lastCommit?: string
  lastUpdated?: string
  date?: string
  badgeIcon?: string
  deployments?: { label: string; url: string; network?: string }[]
  frontend?: string[]
  backend?: string[]
  cloud?: string[]
  ai?: string[]
}

const { data: projects, pending, error } = await useAsyncData('projects-all', () =>
  queryContent<ProjectDoc>('/projects')
    .where({ draft: { $ne: true } })
    .only(['_path', 'title', 'description', 'highlight', 'status', 'category', 'tags', 'excerptImage', 'liveSite', 'projectType', 'lastCommit', 'lastUpdated', 'date', 'badgeIcon', 'deployments', 'frontend', 'backend', 'cloud', 'ai'])
    .find(),
)

// Structured data: the list of projects as an ItemList on a CollectionPage.
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: computed(() => JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${_SITE}/projects/overview`,
      name: 'Projects',
      description: DESCRIPTION,
      isPartOf: { '@id': `${_SITE}/#website` },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: (projects.value || []).map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${_SITE}${p._path}`, name: p.title })),
      },
    })),
  }],
})

// ── Filters (URL-backed)
const q = (k: string) => (typeof route.query[k] === 'string' ? (route.query[k] as string) : '')
const search = ref(q('q'))
const status = ref(q('status'))
const category = ref(q('category'))
const tech = ref(q('tech'))
const sort = ref<'recent' | 'name'>(q('sort') === 'name' ? 'name' : 'recent')
const view = ref<'cards' | 'table'>(q('view') === 'table' ? 'table' : 'cards')

watch([search, status, category, tech, sort, view], () => {
  const query: Record<string, string> = {}
  if (search.value.trim()) query.q = search.value.trim()
  if (status.value) query.status = status.value
  if (category.value) query.category = category.value
  if (tech.value) query.tech = tech.value
  if (sort.value !== 'recent') query.sort = sort.value
  if (view.value !== 'cards') query.view = view.value
  router.replace({ query }).catch(() => {})
})

const activity = (p: ProjectDoc) => p.lastCommit || p.lastUpdated || p.date || ''
const time = (d: string) => (d ? new Date(d).getTime() || 0 : 0)
const stackOf = (p: ProjectDoc) => [...(p.frontend || []), ...(p.backend || []), ...(p.cloud || []), ...(p.ai || [])]

const all = computed(() => projects.value || [])
const statuses = computed(() => countBy(all.value.map((p) => p.status).filter(Boolean) as string[]))
const categories = computed(() => countBy(all.value.map((p) => p.category).filter(Boolean) as string[]))
const techs = computed(() => countBy(all.value.flatMap((p) => p.tags || [])).filter((t) => t.count > 1))

function countBy(values: string[]) {
  const m = new Map<string, number>()
  for (const v of values) m.set(v, (m.get(v) || 0) + 1)
  return [...m.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count || a.value.localeCompare(b.value))
}

const filtered = computed(() => {
  const needle = search.value.trim().toLowerCase()
  const list = all.value.filter((p) => {
    if (status.value && p.status !== status.value) return false
    if (category.value && p.category !== category.value) return false
    if (tech.value && !(p.tags || []).includes(tech.value)) return false
    if (!needle) return true
    const hay = [p.title, p.description, p.highlight, p.category, ...(p.tags || []), ...stackOf(p)].join(' ').toLowerCase()
    return needle.split(/\s+/).every((w) => hay.includes(w))
  })
  return [...list].sort((a, b) => (sort.value === 'name' ? a.title.localeCompare(b.title) : time(activity(b)) - time(activity(a))))
})

const hasFilters = computed(() => !!(search.value || status.value || category.value || tech.value))
function clearFilters() {
  search.value = ''
  status.value = ''
  category.value = ''
  tech.value = ''
}

const STATUS_TONE: Record<string, 'success' | 'warning' | 'info' | 'neutral'> = {
  Active: 'success', Live: 'success', Completed: 'info', 'In Progress': 'warning', Archived: 'neutral',
}
function fmtDate(d: string) {
  if (!d) return ''
  const t = new Date(d)
  return Number.isNaN(t.getTime()) ? d : t.toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' })
}
function deploymentLabel(p: ProjectDoc) {
  if (p.liveSite) return { text: 'Live', tone: 'success' as const }
  if (p.deployments?.length) return { text: 'Homelab', tone: 'neutral' as const }
  return null
}
const viewOptions = [{ value: 'cards' as const, label: 'Cards' }, { value: 'table' as const, label: 'Table' }]
</script>

<template>
  <div class="bg-slate-50 dark:bg-slate-950 min-h-screen">
    <UiPageHeader
      image="/img/heroes/projects.jpg"
      eyebrow="Portfolio"
      title="Projects"
      description="Systems I’ve designed and built end to end: AI pipelines, multi-tenant SaaS, and the self-hosted infrastructure they run on."
      :crumbs="[{ label: 'Home', to: '/' }, { label: 'Projects' }]"
    >
      <dl class="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <div class="flex items-baseline gap-2"><dt class="ds-muted">Projects</dt><dd class="font-semibold tabular-nums text-slate-900 dark:text-white">{{ all.length }}</dd></div>
        <div v-for="s in statuses" :key="s.value" class="flex items-baseline gap-2"><dt class="ds-muted">{{ s.value }}</dt><dd class="font-semibold tabular-nums text-slate-900 dark:text-white">{{ s.count }}</dd></div>
      </dl>
    </UiPageHeader>

    <div class="ds-container py-6 sm:py-8">
      <!-- Toolbar -->
      <div class="ds-surface p-3 sm:p-4 flex flex-col gap-3" role="search" aria-label="Filter projects">
        <div class="flex flex-col gap-3 md:flex-row md:items-center">
          <div class="relative flex-1">
            <label for="project-search" class="sr-only">Search projects</label>
            <Icon name="mdi:magnify" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input id="project-search" v-model="search" type="search" class="ds-input pl-9" placeholder="Search by name, stack or keyword" autocomplete="off" />
          </div>
          <div class="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <label class="sr-only" for="project-category">Category</label>
            <select id="project-category" v-model="category" class="ds-input sm:w-40">
              <option value="">All categories</option>
              <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.value }} ({{ c.count }})</option>
            </select>
            <label class="sr-only" for="project-tech">Technology</label>
            <select id="project-tech" v-model="tech" class="ds-input sm:w-40">
              <option value="">Any technology</option>
              <option v-for="t in techs" :key="t.value" :value="t.value">{{ t.value }} ({{ t.count }})</option>
            </select>
            <label class="sr-only" for="project-sort">Sort</label>
            <select id="project-sort" v-model="sort" class="ds-input sm:w-40">
              <option value="recent">Recent activity</option>
              <option value="name">Name</option>
            </select>
            <UiSegmented v-model="view" :options="viewOptions" label="View" size="sm" class="justify-self-start" />
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-1.5" role="group" aria-label="Status">
          <button
            v-for="s in [{ value: '', count: all.length }, ...statuses]"
            :key="s.value || 'all'"
            type="button"
            class="rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ds-focus"
            :class="status === s.value
              ? 'border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-300'
              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'"
            :aria-pressed="status === s.value"
            @click="status = s.value"
          >
            {{ s.value || 'All' }} <span class="tabular-nums opacity-70">{{ s.count }}</span>
          </button>
          <button v-if="hasFilters" type="button" class="ml-auto ds-btn-ghost h-7 px-2 text-xs" @click="clearFilters">
            <Icon name="mdi:close" aria-hidden="true" /> Clear filters
          </button>
        </div>
      </div>

      <p class="mt-4 mb-3 ds-muted" aria-live="polite">
        {{ filtered.length }} of {{ all.length }} project{{ all.length === 1 ? '' : 's' }}
      </p>

      <!-- States -->
      <div v-if="pending && !projects" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
        <div v-for="i in 6" :key="i" class="ds-surface h-80 animate-pulse" />
      </div>
      <div v-else-if="error" class="ds-surface p-8 text-center" role="alert">
        <p class="ds-h3">Projects couldn’t be loaded</p>
        <p class="mt-1 ds-body">Refresh the page to try again.</p>
      </div>
      <div v-else-if="!filtered.length" class="ds-surface p-10 text-center">
        <Icon name="mdi:folder-search-outline" class="text-4xl text-slate-300 dark:text-slate-600" aria-hidden="true" />
        <p class="mt-2 ds-h3">No projects match these filters</p>
        <p class="mt-1 ds-body">Try a different search term or clear the filters.</p>
        <button type="button" class="mt-4 ds-btn-secondary" @click="clearFilters">Clear filters</button>
      </div>

      <!-- Cards -->
      <ul v-else-if="view === 'cards'" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="(p, i) in filtered" :key="p._path">
          <NuxtLink :to="p._path" class="group ds-surface flex h-full flex-col overflow-hidden transition-colors hover:border-sky-500/50 ds-focus">
            <div class="relative aspect-[16/9] overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
              <img
                v-if="p.excerptImage"
                :src="p.excerptImage"
                :alt="p.title"
                :loading="i < 3 ? 'eager' : 'lazy'"
                :fetchpriority="i === 0 ? 'high' : undefined"
                decoding="async"
                width="1440"
                height="810"
                class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div v-else class="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.12),transparent_60%)]">
                <Icon :name="p.badgeIcon || 'mdi:code-braces'" class="text-5xl text-slate-300 dark:text-slate-700" aria-hidden="true" />
              </div>
            </div>
            <div class="flex flex-1 flex-col p-4">
              <div class="flex flex-wrap items-center gap-1.5">
                <UiBadge v-if="p.status" :tone="STATUS_TONE[p.status] ?? 'neutral'" dot>{{ p.status }}</UiBadge>
                <UiBadge v-if="p.category">{{ p.category }}</UiBadge>
              </div>
              <h2 class="mt-3 ds-h3 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{{ p.title }}</h2>
              <p v-if="p.highlight" class="mt-0.5 text-xs font-medium text-sky-700 dark:text-sky-400 line-clamp-1">{{ p.highlight }}</p>
              <div class="mt-2 flex-1"><p class="ds-body line-clamp-3">{{ p.description }}</p></div>
              <ul v-if="stackOf(p).length" class="mt-3 flex flex-wrap gap-1" aria-label="Technology">
                <li v-for="t in stackOf(p).slice(0, 4)" :key="t" class="rounded border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 text-[11px] text-slate-600 dark:text-slate-400">{{ t }}</li>
                <li v-if="stackOf(p).length > 4" class="px-1 py-0.5 text-[11px] text-slate-400">+{{ stackOf(p).length - 4 }}</li>
              </ul>
              <div class="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
                <span class="text-slate-500 dark:text-slate-400 tabular-nums">
                  <template v-if="activity(p)">Updated {{ fmtDate(activity(p)) }}</template>
                </span>
                <UiBadge v-if="deploymentLabel(p)" :tone="deploymentLabel(p)!.tone">{{ deploymentLabel(p)!.text }}</UiBadge>
              </div>
            </div>
          </NuxtLink>
        </li>
      </ul>

      <!-- Table -->
      <div v-else class="ds-surface overflow-x-auto">
        <table class="ds-table w-full">
          <caption class="sr-only">Projects</caption>
          <thead class="bg-slate-50 dark:bg-slate-900/80">
            <tr>
              <th scope="col">Project</th>
              <th scope="col">Status</th>
              <th scope="col">Category</th>
              <th scope="col">Stack</th>
              <th scope="col">Updated</th>
              <th scope="col">Deployment</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filtered" :key="p._path" class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <th scope="row" class="px-3 py-2.5 text-left">
                <NuxtLink :to="p._path" class="text-sm font-medium text-slate-900 dark:text-slate-100 hover:text-sky-600 dark:hover:text-sky-400 ds-focus rounded">{{ p.title }}</NuxtLink>
                <p class="max-w-xs truncate text-xs font-normal text-slate-500 dark:text-slate-400">{{ p.highlight }}</p>
              </th>
              <td><UiBadge v-if="p.status" :tone="STATUS_TONE[p.status] ?? 'neutral'" dot>{{ p.status }}</UiBadge></td>
              <td>{{ p.category }}</td>
              <td class="max-w-[16rem] truncate text-xs">{{ stackOf(p).slice(0, 4).join(', ') }}</td>
              <td>{{ fmtDate(activity(p)) }}</td>
              <td>
                <a v-if="p.liveSite" :href="p.liveSite" target="_blank" rel="noopener noreferrer" class="ds-link text-xs">Live site</a>
                <span v-else-if="p.deployments?.length" class="text-xs text-slate-500 dark:text-slate-400">Homelab (private)</span>
                <span v-else class="text-xs text-slate-400">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
