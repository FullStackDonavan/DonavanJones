<template>
  <div class="mt-12">

    <!-- HEADER -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full
                 bg-sky-500/10 border border-sky-500/20 text-sky-500 dark:text-sky-400 text-xs font-medium"
        >
          <Icon name="mdi:text-box-multiple-outline" class="text-sm" />
          Related Articles
        </div>
      </div>

      <span
        class="text-[11px] px-2.5 py-1 rounded-full font-medium
               bg-slate-100 dark:bg-slate-800
               text-slate-500 dark:text-slate-400
               border border-slate-200 dark:border-slate-700/50"
      >
        {{ articles?.length || 0 }} articles
      </span>
    </div>

    <!-- EMPTY -->
    <div
      v-if="!articles?.length"
      class="p-8 rounded-2xl border
             border-slate-200 dark:border-slate-800
             bg-white dark:bg-slate-900
             text-center"
    >
      <Icon
        name="mdi:file-document-outline"
        class="text-5xl text-slate-400 mx-auto"
      />

      <h4 class="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
        No Articles Found
      </h4>

      <p class="mt-2 text-sm text-slate-500">
        This cluster doesn't have any published articles yet.
      </p>
    </div>

    <!-- GRID -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
    >
      <NuxtLink
        v-for="article in articles"
        :key="article._path"
        :to="article._path"
        class="group flex flex-col rounded-2xl overflow-hidden
               border border-slate-200 dark:border-slate-700/50
               bg-white dark:bg-slate-900/60
               hover:border-sky-500/40 dark:hover:border-sky-500/30
               transition-all duration-200 hover:shadow-lg hover:shadow-sky-500/5"
      >

        <!-- IMAGE -->
        <div class="relative overflow-hidden h-44 bg-slate-100 dark:bg-slate-800">
          <img
            v-if="article.excerptImage"
            :src="article.excerptImage"
            :alt="article.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <Icon name="mdi:text-box-outline" class="text-5xl text-slate-300 dark:text-slate-600" />
          </div>

          <!-- Category badge -->
          <div
            v-if="article.category"
            class="absolute top-3 right-3 text-[11px] font-medium px-2.5 py-1 rounded-full
                   bg-black/50 text-white backdrop-blur-sm border border-white/10"
          >
            {{ article.category }}
          </div>
        </div>

        <!-- CONTENT -->
        <div class="flex flex-col flex-1 p-5">

          <!-- TITLE + DATE -->
          <div class="mb-3">
            <h4 class="text-base font-semibold text-slate-900 dark:text-slate-100
                       group-hover:text-sky-400 transition-colors">
              {{ article.title }}
            </h4>
            <p v-if="article.date" class="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
              {{ formatDate(article.date) }}
            </p>
          </div>

          <!-- DESCRIPTION -->
          <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
            {{ truncate(article.description) }}
          </p>

          <!-- TAGS -->
          <div v-if="article.tags?.length" class="mt-4 flex flex-wrap gap-1.5">
            <span
              v-for="tag in article.tags.slice(0, 5)"
              :key="tag"
              class="text-[11px] px-2 py-0.5 rounded-md
                     bg-slate-100 dark:bg-slate-800
                     text-slate-500 dark:text-slate-400
                     border border-slate-200 dark:border-slate-700/50"
            >
              {{ tag }}
            </span>
            <span
              v-if="article.tags.length > 5"
              class="text-[11px] px-2 py-0.5 rounded-md
                     bg-slate-100 dark:bg-slate-800 text-slate-400"
            >
              +{{ article.tags.length - 5 }}
            </span>
          </div>

          <!-- FOOTER -->
          <div class="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span class="text-xs font-medium text-slate-400 dark:text-slate-500">
              {{ article.author || 'Donavan Jones' }}
            </span>
            <span class="inline-flex items-center gap-1 text-sm font-medium text-sky-500
                         group-hover:translate-x-1 transition-transform duration-200">
              Read Article
              <Icon name="mdi:arrow-right" class="text-base" />
            </span>
          </div>

        </div>
      </NuxtLink>
    </div>

  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  cluster: string
}>()

const { data: articles } = await useAsyncData(
  `cluster-${props.cluster}`,
  () =>
    queryContent()
      .where({
        cluster: props.cluster,
        draft: { $ne: true }
      })
      .sort({ date: -1 })
      .find()
)

function formatDate(date?: string) {
  if (!date) return ""
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function truncate(text: string, max = 120): string {
  if (!text) return ""
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text
}
</script>