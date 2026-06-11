<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'
useSeoMeta({
  title: 'Portfolio — Donavan Jones',
  description: 'A collection of full-stack projects, AI systems, and engineering work by Donavan Jones.',
  ogTitle: 'Portfolio — Donavan Jones',
  ogDescription: 'A collection of full-stack projects, AI systems, and engineering work by Donavan Jones.',
  ogType: 'website',
  ogImage: `${_SITE}/img/logo.png`,
  ogUrl: `${_SITE}/portfolio/overview`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Portfolio — Donavan Jones',
  twitterDescription: 'Full-stack projects, AI systems, and engineering work by Donavan Jones.',
  canonical: `${_SITE}/portfolio/overview`,
})

const currentPage = computed(() => parseInt(route.query.page as string) || 1);
const limit = ref(9);

const { data: totalCount } = await useAsyncData(
  "totalPortfolioCount",
  () => queryContent("/portfolio").where({ draft: { $ne: true } }).count()
);

const totalPages = computed(() =>
  Math.ceil((totalCount.value || 0) / limit.value)
);

const { data: articles, refresh } = await useAsyncData("portfolio", () =>
  queryContent("/portfolio")
    .where({ draft: { $ne: true } })
    .skip((currentPage.value - 1) * limit.value)
    .limit(limit.value)
    .find()
);

watch(
  () => route.query,
  () => refresh()
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
        <div class="max-w-4xl mx-auto px-6 py-20 sm:py-28 text-center">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6
                   bg-sky-500/10 border border-sky-500/20 text-sky-500 dark:text-sky-400 text-xs font-medium"
          >
            <Icon name="mdi:briefcase-outline" class="text-sm" />
            Portfolio
          </div>
          <h1 class="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
            Portfolio
          </h1>
          <p class="mt-5 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Projects, experiments, and engineering work — built with production
            architecture and real-world constraints in mind.
          </p>
          <div class="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <span class="flex items-center gap-1.5">
              <Icon name="mdi:code-braces" class="text-sky-400" />
              {{ totalCount ?? 0 }} projects
            </span>
            <span class="flex items-center gap-1.5">
              <Icon name="mdi:account-outline" class="text-sky-400" />
              Donavan Jones
            </span>
          </div>
        </div>
      </div>

      <!-- ── GRID ───────────────────────────────────────────────────── -->
      <div class="w-full bg-slate-50 dark:bg-slate-950 py-10">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

              <!-- Image / placeholder -->
              <div class="relative overflow-hidden h-44 bg-slate-100 dark:bg-slate-800">
                <img
                  v-if="article.excerptImage"
                  :src="article.excerptImage"
                  :alt="article.title"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >
                  <Icon name="mdi:briefcase-outline" class="text-5xl text-slate-300 dark:text-slate-600" />
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
                    {{ article.projectType || 'Personal Project' }}
                  </span>
                  <span class="inline-flex items-center gap-1 text-sm font-medium text-sky-500
                               group-hover:translate-x-1 transition-transform duration-200">
                    View Project
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
