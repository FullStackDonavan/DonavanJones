<script setup lang="ts">
const props = defineProps<{
  category: string
  currentPath: string
}>()

const { data: articles } = await useAsyncData(
  `related-${props.category}-${props.currentPath}`,
  () => queryContent('/blog')
    .where({
      category: props.category,
      _path: { $ne: props.currentPath },
      draft: { $ne: true },
    })
    .without(['body'])
    .limit(3)
    .find(),
  { default: () => [] }
)

function formatDate(d: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function truncate(text: string, max = 110) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
}
</script>

<template>
  <div v-if="articles?.length" class="mt-12">

    <!-- Section header -->
    <div class="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3
                    bg-sky-500/10 border border-sky-500/20 text-sky-500 dark:text-sky-400 text-xs font-medium">
          <Icon name="mdi:text-box-multiple-outline" class="text-sm" />
          Keep Reading
        </div>
        <h3 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          More in <span class="text-sky-500 capitalize">{{ category }}</span>
        </h3>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Continue exploring articles in this category.
        </p>
      </div>
      <NuxtLink
        :to="`/categories/${category}`"
        class="inline-flex items-center gap-1.5 text-sm font-medium text-sky-500
               hover:text-sky-400 transition-colors flex-shrink-0"
      >
        View all
        <Icon name="mdi:arrow-right" class="text-base" />
      </NuxtLink>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        v-for="article in articles"
        :key="article._path"
        :to="article._path"
        class="group flex flex-col rounded-2xl overflow-hidden
               border border-slate-200 dark:border-slate-700/50
               bg-white dark:bg-slate-900/60
               hover:border-sky-500/40 dark:hover:border-sky-500/30
               hover:shadow-lg hover:shadow-sky-500/5
               transition-all duration-200"
      >
        <!-- Image / placeholder -->
        <div class="relative overflow-hidden h-36 bg-slate-100 dark:bg-slate-800 flex-shrink-0">
          <img
            v-if="article.excerptImage"
            :src="article.excerptImage"
            :alt="article.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <Icon name="mdi:text-box-outline" class="text-4xl text-slate-300 dark:text-slate-600" />
          </div>

          <!-- Category badge -->
          <div
            class="absolute top-2 right-2 text-[11px] font-medium px-2 py-0.5 rounded-full
                   bg-black/50 text-white backdrop-blur-sm border border-white/10"
          >
            {{ article.category }}
          </div>
        </div>

        <!-- Body -->
        <div class="flex flex-col flex-1 p-4">
          <p v-if="article.date" class="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-1">
            {{ formatDate(article.date) }}
          </p>

          <h4 class="text-sm font-semibold text-slate-900 dark:text-slate-100
                     group-hover:text-sky-400 transition-colors leading-snug mb-2">
            {{ article.title }}
          </h4>

          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
            {{ truncate(article.description) }}
          </p>

          <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
            <span class="inline-flex items-center gap-1 text-xs font-medium text-sky-500
                         group-hover:translate-x-0.5 transition-transform duration-200">
              Read Article
              <Icon name="mdi:arrow-right" class="text-sm" />
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

  </div>
</template>
