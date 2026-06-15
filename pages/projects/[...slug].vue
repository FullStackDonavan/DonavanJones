<template>
  <PatternSection>

    <!-- PAGE WRAPPER -->
    <div class="min-h-screen">

      <!-- BACK BUTTON -->
      <!-- <div class="mx-auto px-4 pt-10">
        <nuxt-link
          class="text-slate-400 hover:text-white flex items-center gap-2"
          :to="backLink"
        >
          ← Back
        </nuxt-link>
      </div> -->

      <div v-if="seoDoc">

        <!-- HERO (FULL WIDTH) -->
        <ArticleHero
          :title="seoDoc.title"
          :description="seoDoc.description"
          :highlight="seoDoc.highlight || ''"
          :badge="seoDoc.category"
          :badge-icon="seoDoc.badgeIcon || 'mdi:layers'"
          :live-site="seoDoc.liveSite"

          :frontend="seoDoc.frontend || []"
          :backend="seoDoc.backend || []"
          :cloud="seoDoc.cloud || []"
          :ai="seoDoc.ai || []"

          :project-scope="seoDoc.projectScope || []"

          :use-case="seoDoc.useCase || []"

          :overview-description="seoDoc.overviewDescription || ''"
          :overview-steps="seoDoc.overviewSteps || []"
          :overview-summary="seoDoc.overviewSummary || ''"
        >


            <!-- optional extra content inside hero -->
            <template #default>

              <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden">

                <!-- Chrome header -->
                <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <div class="flex gap-1.5">
                      <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                      <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                      <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    </div>
                    <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">project.meta</span>
                  </div>
                  <NuxtLink
                    v-if="seoDoc.category"
                    :to="{ path: `/categories/${seoDoc.category}`, query: { from: route.fullPath } }"
                    class="text-[10px] text-sky-500 hover:text-sky-400 transition-colors font-medium"
                  >
                    {{ seoDoc.category }} →
                  </NuxtLink>
                </div>

                <!-- Body -->
                <div class="px-6 py-5">

                  <!-- Author + date -->
                  <div class="text-sm text-slate-500 dark:text-slate-400 mb-3">
                    by {{ seoDoc.author }} · {{ seoDoc.date }}
                  </div>

                  <!-- Meta row: project type, links -->
                  <div class="flex flex-wrap items-center gap-1.5 mb-3">

                    <span
                      v-if="seoDoc.projectType"
                      class="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded border
                             bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300
                             border-slate-200 dark:border-slate-700/50"
                    >
                      <Icon name="mdi:briefcase-outline" class="text-xs" />
                      {{ seoDoc.projectType }}
                    </span>

                    <a
                      v-if="seoDoc.github"
                      :href="seoDoc.github"
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

                  </div>

                  <!-- Tags -->
                  <div v-if="seoDoc.tags?.length" class="flex flex-wrap gap-1.5">
                    <NuxtLink
                      v-for="tag in seoDoc.tags"
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

            </template>

            <!-- RIGHT SIDE CARDS -->
            <template #right>
              <div
                v-for="(stat, i) in seoDoc.heroStats"
                :key="i"
                class="hero-stat rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200"
                :class="{
                  'hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5':     i % 4 === 0,
                  'hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5': i % 4 === 1,
                  'hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5': i % 4 === 2,
                  'hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5':  i % 4 === 3,
                }"
              >
                <!-- Chrome header -->
                <div class="px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
                  <div class="flex gap-1">
                    <span class="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span class="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span class="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  </div>
                  <span class="text-[9px] text-slate-400 dark:text-slate-500 ml-0.5 truncate">
                    {{ stat.label.toLowerCase().replace(/\s+/g, '.') }}
                  </span>
                </div>
                <!-- Body -->
                <div class="px-3 py-3 text-center">
                  <Icon
                    :name="stat.icon"
                    class="text-3xl mb-2"
                    :class="{
                      'text-sky-400':     i % 4 === 0,
                      'text-purple-400':  i % 4 === 1,
                      'text-emerald-400': i % 4 === 2,
                      'text-amber-400':   i % 4 === 3,
                    }"
                  />
                  <div class="text-2xl font-bold text-slate-900 dark:text-white leading-none mb-1">{{ stat.value }}</div>
                  <p
                    class="text-[9px] uppercase tracking-widest font-semibold"
                    :class="{
                      'text-sky-500':     i % 4 === 0,
                      'text-purple-500':  i % 4 === 1,
                      'text-emerald-500': i % 4 === 2,
                      'text-amber-500':   i % 4 === 3,
                    }"
                  >{{ stat.label }}</p>
                </div>
              </div>
            </template>
          </ArticleHero>

        <!-- CONTENT WRAPPER (THIS IS THE FIX) -->
        <div class="max-w-7xl mx-auto px-4 py-12">

     

          <!-- CONTENT -->
          <ContentRenderer
            class="prose lg:prose-xl dark:prose-invert max-w-none"
            :value="seoDoc"
          />

          <!-- CATEGORY PILLARS -->
          <ProjectCategoryPillars
            v-if="seoDoc.pillars?.length"
            :pillars="seoDoc.pillars"
          />

        </div>

      </div>

    </div>

  </PatternSection>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from '#app'

const route = useRoute()
const config = useRuntimeConfig()
const SITE = (config.public.appDomain as string) || 'https://donavanjones.com'
const backLink = ref('/projects/overview')

// Fetch doc server-side for SEO head tags
const { data: seoDoc } = await useAsyncData(
  `project-doc-${route.path}`,
  () => queryContent(route.path).findOne()
)

const pageTitle = computed(() =>
  seoDoc.value?.title ? `${seoDoc.value.title} — Donavan Jones` : 'Donavan Jones'
)
const pageDescription = computed(() => seoDoc.value?.description || '')

useSeoMeta({
  title: pageTitle,
  ogTitle: pageTitle,
  description: pageDescription,
  ogDescription: pageDescription,
  ogType: 'website',
  ogImage: computed(() => seoDoc.value?.excerptImage || `${SITE}/img/logo.png`),
  ogUrl: () => `${SITE}${route.path}`,
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  twitterImage: computed(() => seoDoc.value?.excerptImage || `${SITE}/img/logo.png`),
  canonical: () => `${SITE}${route.path}`,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => {
        const doc = seoDoc.value
        if (!doc) return '{}'
        const pageUrl = `${SITE}${route.path}`
        const personId = `${SITE}/#person`
        const techStack = [
          ...(doc.frontend || []),
          ...(doc.backend || []),
          ...(doc.cloud || []),
          ...(doc.ai || []),
        ]
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          '@id': pageUrl,
          name: doc.title,
          description: doc.description,
          url: pageUrl,
          applicationCategory: 'WebApplication',
          keywords: Array.isArray(doc.tags) ? doc.tags.join(', ') : undefined,
          datePublished: doc.date ? new Date(doc.date).toISOString() : undefined,
          dateModified: doc.lastUpdated
            ? new Date(doc.lastUpdated).toISOString()
            : doc.date ? new Date(doc.date).toISOString() : undefined,
          author: { '@type': 'Person', '@id': personId, name: 'Donavan Jones' },
          creator: { '@type': 'Person', '@id': personId, name: 'Donavan Jones' },
          ...(techStack.length ? { runtimePlatform: techStack.join(', ') } : {}),
          ...(doc.liveSite ? { installUrl: doc.liveSite } : {}),
          ...(doc.github ? { codeRepository: doc.github } : {}),
          isPartOf: { '@id': `${SITE}/#website` },
          image: doc.excerptImage || undefined,
          mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
        })
      }),
    },
  ],
})

onMounted(() => {
  if (route.query.from) {
    backLink.value = route.query.from as string
  }
})
</script>
