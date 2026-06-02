<template>
  <div class="mt-12">

    <!-- HEADER -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-2xl font-bold text-slate-900 dark:text-white">
          Related Articles
        </h3>

        <!-- <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Related articles from this learning cluster
        </p> -->
      </div>

      <span
        class="px-3 py-1 rounded-full text-xs font-medium
               bg-slate-100 dark:bg-slate-800
               text-slate-600 dark:text-slate-300"
      >
        {{ articles?.length || 0 }} Articles
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
        class="group overflow-hidden rounded-2xl
               border border-slate-200 dark:border-slate-800
               bg-white dark:bg-slate-900
               hover:border-sky-400 dark:hover:border-sky-500/40
               hover:-translate-y-1
               transition-all duration-300"
      >

        <!-- IMAGE -->
        <div class="overflow-hidden">
          <img
            :src="`https://placehold.co/600x400/png?text=${encodeURIComponent(article.title)}`"
            :alt="article.title"
            class="w-full h-48 object-cover
                   transition-transform duration-500
                   group-hover:scale-105"
          />
        </div>

        <!-- CONTENT -->
        <div class="p-5">

          <!-- CATEGORY -->
          <div
            class="inline-flex items-center px-2 py-1 rounded-md
                   text-[10px] uppercase tracking-wider
                   bg-sky-500/10 text-sky-500"
          >
            {{ article.category }}
          </div>

          <!-- TITLE -->
          <h4
            class="mt-3 text-lg font-semibold
                   text-slate-900 dark:text-white
                   group-hover:text-sky-400
                   transition-colors
                   line-clamp-2"
          >
            {{ article.title }}
          </h4>

          <!-- DESCRIPTION -->
          <p
            class="mt-2 text-sm
                   text-slate-600 dark:text-slate-400
                   line-clamp-3"
          >
            {{ article.description }}
          </p>

          <!-- TAGS -->
          <div
            v-if="article.tags?.length"
            class="mt-4 flex flex-wrap gap-2"
          >
            <span
              v-for="tag in article.tags.slice(0, 3)"
              :key="tag"
              class="px-2 py-1 rounded-md text-xs
                     bg-slate-100 dark:bg-slate-800
                     text-slate-600 dark:text-slate-300"
            >
              #{{ tag }}
            </span>
          </div>

          <!-- FOOTER -->
          <div
            class="mt-5 pt-4 border-t
                   border-slate-200 dark:border-slate-800
                   flex items-center justify-between"
          >
            <span class="text-xs text-slate-500">
              {{ formatDate(article.date) }}
            </span>

            <span
              class="flex items-center gap-1 text-xs
                     text-sky-500 font-medium"
            >
              Read
              <Icon
                name="mdi:arrow-right"
                class="group-hover:translate-x-1 transition-transform"
              />
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
    day: "numeric"
  })
}
</script>