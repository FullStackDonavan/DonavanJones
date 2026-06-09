<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "#app";

const route = useRoute();
const _seoConfig = useRuntimeConfig();
const _SITE = (_seoConfig.public.appDomain as string) || "https://donavanjones.com";

const categoryName = computed(() => route.params.name as string);

// ── Hub content + featured articles (SSR via server API) ─────────────────────
const { data: categoryData } = await useFetch(
  () => `/api/category-hub/${categoryName.value}`,
  { key: `category-hub-${categoryName.value}` }
);

const hub = computed(() => categoryData.value?.hub ?? null);

const featuredWithData = computed(() => {
  if (!hub.value?.featuredArticles?.length) return [];
  const docs = categoryData.value?.featuredDocs ?? [];
  return hub.value.featuredArticles
    .map((f: any) => {
      const doc = docs.find((d: any) => d._path === f.path);
      return doc ? { ...f, title: doc.title, description: doc.description } : null;
    })
    .filter(Boolean);
});

// ── Article count ─────────────────────────────────────────────────────────────
const { data: totalArticlesCount } = await useAsyncData(
  `category-count-${categoryName.value}`,
  () =>
    queryContent("blog")
      .where({ category: { $contains: categoryName.value }, draft: { $ne: true } })
      .count()
);

// ── SEO ───────────────────────────────────────────────────────────────────────
useSeoMeta({
  title: () =>
    hub.value?.title
      ? `${hub.value.title} — Donavan Jones`
      : `${categoryName.value.charAt(0).toUpperCase() + categoryName.value.slice(1)} Articles — Donavan Jones`,
  description: () =>
    hub.value?.tagline ||
    `${totalArticlesCount.value ?? 0} articles in the ${categoryName.value} category — engineering breakdowns, architecture decisions, and real-world production lessons.`,
  ogTitle: () =>
    hub.value?.title
      ? `${hub.value.title} — Donavan Jones`
      : `${categoryName.value} Articles — Donavan Jones`,
  ogDescription: () =>
    hub.value?.tagline ||
    `Browse ${totalArticlesCount.value ?? 0} ${categoryName.value} articles on donavanjones.com.`,
  ogType: "website",
  ogImage: `${_SITE}/img/logo.png`,
  ogUrl: () => `${_SITE}${route.path}`,
  twitterCard: "summary_large_image",
  twitterTitle: () => hub.value?.title || `${categoryName.value} — Donavan Jones`,
  twitterDescription: () => hub.value?.tagline || `Browse ${categoryName.value} articles.`,
  canonical: () => `${_SITE}${route.path}`,
});

// ── FAQ JSON-LD ───────────────────────────────────────────────────────────────
useHead({
  script: computed(() => {
    if (!hub.value?.faqs?.length) return [];
    return [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: hub.value.faqs.map((faq: any) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }),
      },
    ];
  }) as any,
});

// ── Article grid (client-side paginated) ──────────────────────────────────────
const articles = ref<any[]>([]);
const pending = ref(true);
const limit = ref(9);

const currentPage = computed(() => parseInt(route.query.page as string) || 1);

const fetchArticles = async () => {
  pending.value = true;
  try {
    articles.value = await queryContent("blog")
      .where({ category: { $contains: categoryName.value }, draft: { $ne: true } })
      .skip((currentPage.value - 1) * limit.value)
      .limit(limit.value)
      .find();
  } catch {
    articles.value = [];
  } finally {
    pending.value = false;
  }
};

onMounted(fetchArticles);
watch([categoryName, currentPage], fetchArticles);

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

const phaseColors = [
  "bg-sky-500/10 border-sky-500/20 text-sky-500",
  "bg-purple-500/10 border-purple-500/20 text-purple-500",
  "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
  "bg-amber-500/10 border-amber-500/20 text-amber-500",
  "bg-rose-500/10 border-rose-500/20 text-rose-500",
];
</script>

<template>
  <PatternSection class="flex justify-center w-full">
    <div class="w-full">

      <!-- ── HERO ─────────────────────────────────────────────────────────── -->
      <div class="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div class="max-w-4xl mx-auto px-6 py-16 sm:py-20 text-center">

          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6
                       bg-sky-500/10 border border-sky-500/20 text-sky-500 dark:text-sky-400 text-xs font-medium">
            <Icon name="mdi:tag-outline" class="text-sm" />
            Category
          </div>

          <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            {{ hub?.title || categoryName }}
          </h1>

          <p v-if="hub?.tagline" class="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {{ hub.tagline }}
          </p>

          <p class="mt-3 text-sm text-slate-400 dark:text-slate-500">
            {{ totalArticlesCount ?? 0 }} article{{ (totalArticlesCount ?? 0) !== 1 ? "s" : "" }}
          </p>

          <!-- Jump links to featured articles -->
          <div v-if="featuredWithData.length" class="mt-6 flex flex-wrap gap-2 justify-center">
            <NuxtLink
              v-for="f in featuredWithData"
              :key="f.path"
              :to="f.path"
              class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full
                     border border-sky-500/30 bg-sky-500/5 text-sky-500 dark:text-sky-400
                     hover:bg-sky-500/15 transition-colors"
            >
              <Icon name="mdi:arrow-right" class="text-xs" />
              {{ f.label }}: {{ f.title }}
            </NuxtLink>
          </div>

        </div>
      </div>

      <!-- ── INTRO ─────────────────────────────────────────────────────────── -->
      <div v-if="hub?.description?.length"
           class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div class="max-w-3xl mx-auto px-6 py-12 space-y-4">
          <p
            v-for="(para, i) in hub.description"
            :key="i"
            class="text-base text-slate-600 dark:text-slate-400 leading-relaxed"
            :class="{ 'font-medium text-slate-800 dark:text-slate-200': i === 0 }"
          >
            {{ para }}
          </p>
        </div>
      </div>

      <!-- ── FEATURED ARTICLES ─────────────────────────────────────────────── -->
      <div v-if="featuredWithData.length"
           class="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div class="max-w-7xl mx-auto px-6 py-12">

          <div class="mb-8">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Start Here</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Three articles that give you the strongest foundation in this topic
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <NuxtLink
              v-for="(article, i) in featuredWithData"
              :key="article.path"
              :to="article.path"
              class="group flex flex-col rounded-2xl border p-6
                     bg-white dark:bg-slate-900/60
                     border-slate-200 dark:border-slate-700/50
                     hover:border-sky-500/40 dark:hover:border-sky-500/30
                     transition-all duration-200 hover:shadow-lg hover:shadow-sky-500/5"
            >
              <!-- Label badge -->
              <span :class="[
                'inline-flex self-start items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border mb-4',
                i === 0 ? 'bg-sky-500/10 border-sky-500/20 text-sky-500'
                        : i === 1 ? 'bg-purple-500/10 border-purple-500/20 text-purple-500'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
              ]">
                {{ article.label }}
              </span>

              <h3 class="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-sky-400 transition-colors mb-2">
                {{ article.title }}
              </h3>

              <p class="text-xs text-slate-500 dark:text-slate-400 italic mb-3">
                {{ article.reason }}
              </p>

              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                {{ truncate(article.description, 110) }}
              </p>

              <div class="mt-4 flex items-center gap-1 text-sm font-medium text-sky-500
                          group-hover:translate-x-1 transition-transform duration-200">
                Read article
                <Icon name="mdi:arrow-right" class="text-base" />
              </div>
            </NuxtLink>
          </div>

        </div>
      </div>

      <!-- ── LEARNING PATH ─────────────────────────────────────────────────── -->
      <div v-if="hub?.learningPath?.length"
           class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div class="max-w-4xl mx-auto px-6 py-12">

          <div class="mb-8">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Learning Path</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              A structured progression through the articles in this category
            </p>
          </div>

          <div class="space-y-5">
            <div
              v-for="(phase, i) in hub.learningPath"
              :key="i"
              class="flex gap-5"
            >
              <!-- Phase number -->
              <div class="flex-shrink-0 flex flex-col items-center">
                <div :class="[
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border',
                  phaseColors[i % phaseColors.length]
                ]">
                  {{ i + 1 }}
                </div>
                <div v-if="i < hub.learningPath.length - 1"
                     class="w-px flex-1 mt-2 bg-slate-200 dark:bg-slate-700/50" />
              </div>

              <!-- Phase content -->
              <div class="pb-8">
                <h3 class="text-base font-semibold text-slate-900 dark:text-white mb-1">
                  {{ phase.phase }}
                </h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                  {{ phase.description }}
                </p>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="article in phase.articles"
                    :key="article"
                    class="text-[11px] font-medium px-2.5 py-1 rounded-lg border
                           bg-slate-50 dark:bg-slate-800
                           text-slate-600 dark:text-slate-400
                           border-slate-200 dark:border-slate-700/50"
                  >
                    {{ article }}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- ── ALL ARTICLES GRID ─────────────────────────────────────────────── -->
      <div class="w-full bg-slate-50 dark:bg-slate-950 py-12">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div class="mb-8">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">All Articles</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {{ totalArticlesCount ?? 0 }} articles in this series
            </p>
          </div>

          <!-- Skeletons -->
          <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader v-for="i in limit" :key="i" />
          </div>

          <!-- Empty -->
          <div
            v-else-if="articles.length === 0"
            class="text-center py-20 text-slate-400 dark:text-slate-500"
          >
            No articles found for "{{ categoryName }}".
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
                    class="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400"
                  >
                    +{{ article.tags.length - 5 }}
                  </span>
                </div>

                <div class="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span class="text-xs font-medium text-slate-400 dark:text-slate-500">
                    {{ article.author || "Donavan Jones" }}
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

      <!-- ── Case Study ──────────────────────────────────────────────────────────── -->
       <div class="max-w-7xl mx-auto px-6 py-14">
        <BibleVerseCaseStudy />
       </div>
      

      <!-- ── FAQ ──────────────────────────────────────────────────────────── -->
      <div
        v-if="hub?.faqs?.length"
        class="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
      >
        <div class="max-w-3xl mx-auto px-6 py-14">

          <div class="mb-8">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Common questions about {{ hub.title || categoryName }}
            </p>
          </div>

          <div class="divide-y divide-slate-200 dark:divide-slate-700/50">
            <details
              v-for="(faq, i) in hub.faqs"
              :key="i"
              class="group py-5"
            >
              <summary
                class="flex items-center justify-between gap-4 cursor-pointer list-none
                       text-base font-semibold text-slate-900 dark:text-white
                       hover:text-sky-500 transition-colors"
              >
                {{ faq.question }}
                <Icon
                  name="mdi:chevron-down"
                  class="flex-shrink-0 text-xl text-slate-400 group-open:rotate-180 transition-transform duration-200"
                />
              </summary>
              <p class="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {{ faq.answer }}
              </p>
            </details>
          </div>

        </div>
      </div>

    </div>
  </PatternSection>
</template>
