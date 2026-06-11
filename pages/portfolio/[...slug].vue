<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from '#app'

const route = useRoute()
const config = useRuntimeConfig()
const SITE = (config.public.appDomain as string) || 'https://donavanjones.com'
const backLink = ref('/portfolio/overview')

const { data: doc } = await useAsyncData(
  `portfolio-doc-${route.path}`,
  () => queryContent(route.path).findOne()
)

const pageTitle = computed(() =>
  doc.value?.title ? `${doc.value.title} — Donavan Jones` : 'Donavan Jones'
)
const pageDescription = computed(() => doc.value?.description || '')

useSeoMeta({
  title: pageTitle,
  ogTitle: pageTitle,
  description: pageDescription,
  ogDescription: pageDescription,
  ogType: 'website',
  ogImage: computed(() => doc.value?.excerptImage || `${SITE}/img/logo.png`),
  ogUrl: () => `${SITE}${route.path}`,
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  canonical: () => `${SITE}${route.path}`,
})

function formatDate(d: string | undefined) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(() => {
  if (route.query.from) {
    backLink.value = route.query.from as string
  }
})
</script>

<template>
  <PatternSection>
    <div class="min-h-screen">
      <div v-if="doc">

        <!-- Header card -->
        <div class="max-w-7xl mx-auto px-4 pt-10 pb-4">
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden mb-8">

            <!-- Chrome header -->
            <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <div class="flex gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                </div>
                <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">portfolio.meta</span>
              </div>
              <NuxtLink
                v-if="doc.category"
                :to="{ path: `/categories/${doc.category}`, query: { from: route.fullPath } }"
                class="text-[10px] text-sky-500 hover:text-sky-400 transition-colors font-medium"
              >
                {{ doc.category }} →
              </NuxtLink>
            </div>

            <!-- Body -->
            <div class="px-6 py-5">
              <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
                {{ doc.title }}
              </h2>

              <!-- Author + date -->
              <div class="text-sm text-slate-500 dark:text-slate-400 mb-3">
                by {{ doc.author || 'Donavan Jones' }} · {{ formatDate(doc.date) }}
              </div>

              <!-- Meta row -->
              <div class="flex flex-wrap items-center gap-1.5 mb-3">
                <span
                  v-if="doc.projectType"
                  class="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded border
                         bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300
                         border-slate-200 dark:border-slate-700/50"
                >
                  <Icon name="mdi:briefcase-outline" class="text-xs" />
                  {{ doc.projectType }}
                </span>

                <a
                  v-if="doc.github"
                  :href="doc.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded border
                         bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300
                         border-slate-200 dark:border-slate-700/50
                         transition-all duration-150 hover:bg-sky-500/10 hover:border-sky-500/40 hover:text-sky-600 dark:hover:text-sky-400"
                >
                  <Icon name="mdi:github" class="text-sm" />
                  GitHub
                </a>

                <a
                  v-if="doc.liveSite"
                  :href="doc.liveSite"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded border
                         bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300
                         border-slate-200 dark:border-slate-700/50
                         transition-all duration-150 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <Icon name="mdi:open-in-new" class="text-xs" />
                  Live Site
                </a>
              </div>

              <!-- Tags -->
              <div v-if="doc.tags?.length" class="flex flex-wrap gap-1.5">
                <NuxtLink
                  v-for="tag in doc.tags"
                  :key="tag"
                  :to="{ path: `/tags/${tag}`, query: { from: route.fullPath } }"
                  class="text-[11px] px-2 py-0.5 rounded border
                         bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300
                         border-slate-200 dark:border-slate-700/50
                         transition-all duration-150 hover:bg-sky-500/10 hover:border-sky-500/40 hover:text-sky-600 dark:hover:text-sky-400"
                >
                  #{{ tag }}
                </NuxtLink>
              </div>
            </div>

          </div>
        </div>

        <!-- Content -->
        <div class="max-w-7xl mx-auto px-4 pb-16">
          <ContentRenderer
            class="prose lg:prose-xl dark:prose-invert max-w-none"
            :value="doc"
          />
        </div>

      </div>
    </div>
  </PatternSection>
</template>
