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

              <!-- Author + date -->
              <div class="text-sm text-slate-500 dark:text-slate-400">
                by {{ seoDoc.author }} · {{ seoDoc.date }}
              </div>

              <!-- Meta row: category, project type, links -->
              <div class="mt-3 flex flex-wrap items-center gap-2">

                <NuxtLink
                  v-if="seoDoc.category"
                  :to="{ path: `/categories/${seoDoc.category}`, query: { from: route.fullPath } }"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                         bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400
                         hover:bg-sky-500/20 transition-colors"
                >
                  <Icon name="mdi:tag-outline" class="text-xs" />
                  {{ seoDoc.category }}
                </NuxtLink>

                <span
                  v-if="seoDoc.projectType"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                         bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50
                         text-slate-600 dark:text-slate-400"
                >
                  <Icon name="mdi:briefcase-outline" class="text-xs" />
                  {{ seoDoc.projectType }}
                </span>

                <a
                  v-if="seoDoc.github"
                  :href="seoDoc.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                         bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50
                         text-slate-600 dark:text-slate-300 hover:border-sky-500/40 hover:text-sky-400 transition-colors"
                >
                  <Icon name="mdi:github" class="text-sm" />
                  GitHub
                </a>

                <a
                  v-if="seoDoc.liveSite"
                  :href="seoDoc.liveSite"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                         bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400
                         hover:bg-emerald-500/20 transition-colors"
                >
                  <Icon name="mdi:open-in-new" class="text-xs" />
                  Live Site
                </a>

              </div>

              <!-- Tags -->
              <div v-if="seoDoc.tags?.length" class="mt-3 flex flex-wrap gap-1.5">
                <NuxtLink
                  v-for="tag in seoDoc.tags"
                  :key="tag"
                  :to="{ path: `/tags/${tag}`, query: { from: route.fullPath } }"
                  class="text-[11px] px-2 py-0.5 rounded-md
                         bg-slate-100 dark:bg-slate-800
                         text-slate-500 dark:text-slate-400
                         border border-slate-200 dark:border-slate-700/50
                         hover:border-sky-500/40 hover:text-sky-400 transition-colors"
                >
                  #{{ tag }}
                </NuxtLink>
              </div>

            </template>

            <!-- RIGHT SIDE CARDS -->
            <template #right>
              <div
                v-for="(stat, i) in seoDoc.heroStats"
                :key="i"
                class="hero-stat"
              >
                <Icon
                  :name="stat.icon"
                  class="text-4xl"
                  :class="{
                    'text-sky-400':     i % 4 === 0,
                    'text-purple-400':  i % 4 === 1,
                    'text-emerald-400': i % 4 === 2,
                    'text-amber-400':   i % 4 === 3,
                  }"
                />
                <div class="mt-2 text-xl font-bold">{{ stat.value }}</div>
                <div class="text-xs text-slate-400">{{ stat.label }}</div>
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
