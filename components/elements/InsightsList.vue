<script setup lang="ts">
const props = defineProps<{
  currentPath: string
}>()

const { data: articles } = await useAsyncData(
  `insights-list-${props.currentPath}`,
  () => queryContent('/insights')
    .where({
      _path: { $ne: props.currentPath },
      draft: { $ne: true },
    })
    .without(['body'])
    .sort({ date: -1 })
    .limit(3)
    .find(),
  { default: () => [] }
)

function formatDate(d: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function truncate(text: string, max = 100) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
}
</script>

<template>
  <div v-if="articles?.length" class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden mt-8">

    <!-- Chrome header -->
    <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <div class="flex gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
        </div>
        <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">insights.recent</span>
      </div>
      <NuxtLink
        to="/insights/overview"
        class="text-[10px] text-sky-500 hover:text-sky-400 transition-colors font-medium"
      >
        View All →
      </NuxtLink>
    </div>

    <!-- Article list -->
    <div class="divide-y divide-slate-200 dark:divide-slate-800">
      <NuxtLink
        v-for="article in articles"
        :key="article._path"
        :to="{ path: article._path, query: { from: currentPath } }"
        class="group flex items-start gap-4 p-4 transition-colors duration-150 hover:bg-sky-500/5"
      >
        <!-- Thumbnail -->
        <div class="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            v-if="article.excerptImage"
            :src="article.excerptImage"
            :alt="article.title"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <Icon name="mdi:lightbulb-outline" class="text-2xl text-slate-300 dark:text-slate-600" />
          </div>
        </div>

        <!-- Text -->
        <div class="flex-1 min-w-0">
          <p class="text-[11px] text-slate-400 dark:text-slate-500 mb-0.5">
            {{ formatDate(article.date) }}
          </p>
          <h4 class="text-sm font-semibold text-slate-900 dark:text-slate-100
                     group-hover:text-sky-400 transition-colors leading-snug line-clamp-2 mb-1">
            {{ article.title }}
          </h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
            {{ truncate(article.description) }}
          </p>
        </div>

        <!-- Arrow -->
        <Icon
          name="mdi:arrow-right"
          class="text-base text-slate-300 dark:text-slate-600 flex-shrink-0 self-center
                 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all duration-150"
        />
      </NuxtLink>
    </div>

  </div>
</template>
