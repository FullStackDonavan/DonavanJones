<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "#app";

const route = useRoute();
const articles = ref<any[]>([]);
const pending = ref(true);
const limit = ref(9);

const currentPage = computed(() => parseInt(route.query.page as string) || 1);

const tagName = computed(() => route.params.name as string);

const fetchArticles = async () => {
  pending.value = true;
  try {
    articles.value = await queryContent("blog")
      .where({ tags: { $contains: tagName.value }, draft: { $ne: true } })
      .skip((currentPage.value - 1) * limit.value)
      .limit(limit.value)
      .find();
  } catch (e) {
    articles.value = [];
  } finally {
    pending.value = false;
  }
};

onMounted(fetchArticles);
watch([tagName, currentPage], fetchArticles);

const previousRoute = ref("/blog/overview");
onMounted(() => {
  const from = route.query.from as string;
  if (from?.startsWith("/")) previousRoute.value = from;
});

const { data: totalArticlesCount } = await useAsyncData(
  `tag-count-${tagName.value}`,
  () =>
    queryContent("blog")
      .where({ tags: { $contains: tagName.value }, draft: { $ne: true } })
      .count()
);

const totalPages = computed(() =>
  Math.ceil((totalArticlesCount.value || 0) / limit.value)
);

function truncate(text: string, max = 120): string {
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>

<template>
  <PatternSection class="flex justify-center w-full">
    <div class="w-full">

      <!-- ── HERO ───────────────────────────────────────────────────── -->
      <div class="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div class="max-w-4xl mx-auto px-6 py-16 sm:py-24 text-center">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6
                   bg-sky-500/10 border border-sky-500/20 text-sky-500 dark:text-sky-400 text-xs font-medium"
          >
            <Icon name="mdi:tag-outline" class="text-sm" />
            Tag
          </div>
          <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            #{{ tagName }}
          </h1>
          <p class="mt-4 text-base text-slate-500 dark:text-slate-400">
            {{ totalArticlesCount ?? 0 }} article{{ (totalArticlesCount ?? 0) !== 1 ? 's' : '' }} tagged with this
          </p>
        </div>
      </div>

      <!-- ── GRID ───────────────────────────────────────────────────── -->
      <div class="w-full bg-slate-50 dark:bg-slate-950 py-10">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <!-- Back -->
          <NuxtLink
            :to="previousRoute"
            class="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors mb-8"
          >
            <Icon name="mdi:arrow-left" class="text-base" />
            Back
          </NuxtLink>

          <!-- Skeletons -->
          <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader v-for="i in limit" :key="i" />
          </div>

          <!-- Empty -->
          <div
            v-else-if="articles.length === 0"
            class="text-center py-20 text-slate-400 dark:text-slate-500"
          >
            No articles found for "#{{ tagName }}".
          </div>

          <!-- Cards -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink
              v-for="(article, index) in articles"
              :key="index"
              :to="{ path: article._path, query: { from: route.fullPath } }"
              class="group flex flex-col rounded-2xl overflow-hidden
                     border border-slate-200 dark:border-slate-700/50
                     bg-white dark:bg-slate-900/60
                     hover:border-sky-500/40 dark:hover:border-sky-500/30
                     transition-all duration-200 hover:shadow-lg hover:shadow-sky-500/5"
            >
              <!-- Image / placeholder -->
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

              <!-- Body -->
              <div class="flex flex-col flex-1 p-5">
                <div class="mb-3">
                  <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100
                             group-hover:text-sky-400 transition-colors">
                    {{ article.title }}
                  </h2>
                  <p v-if="article.date" class="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                    {{ formatDate(article.date) }}
                  </p>
                </div>

                <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                  {{ truncate(article.description) }}
                </p>

                <!-- Tags -->
                <div v-if="article.tags?.length" class="mt-4 flex flex-wrap gap-1.5">
                  <span
                    v-for="tag in article.tags.slice(0, 5)"
                    :key="tag"
                    class="text-[11px] px-2 py-0.5 rounded-md
                           bg-slate-100 dark:bg-slate-800
                           text-slate-500 dark:text-slate-400
                           border border-slate-200 dark:border-slate-700/50"
                    :class="tag === tagName ? 'border-sky-500/40 text-sky-500 dark:text-sky-400' : ''"
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

                <!-- CTA -->
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

        <!-- Pagination -->
        <div class="mt-10">
          <Pagination
            v-if="totalPages > 1"
            :currentPage="currentPage"
            :limit="limit"
            :totalPages="totalPages"
          />
        </div>
      </div>

    </div>
  </PatternSection>
</template>
