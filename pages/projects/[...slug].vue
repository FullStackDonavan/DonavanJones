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
          :badge-icon="'mdi:bible'"

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
              
              <div class="text-sm text-slate-500">
                by {{ seoDoc.author }}, {{ seoDoc.date }}
              </div>

               <!-- Category, Tags, and Project Info section -->
            <div
              class="text-gray-500 dark:text-gray-400 mt-2 flex flex-wrap items-center"
            >
              <span v-if="seoDoc.category" class="mr-4">
                <strong>Category: </strong>
                <NuxtLink
                  :to="{
                    path: `/categories/${seoDoc.category}`,
                    query: { from: route.fullPath },
                  }"
                  class="text-blue-500 hover:underline"
                >
                  {{ seoDoc.category }}
                </NuxtLink>
              </span>

              <span v-if="seoDoc.tags && seoDoc.tags.length" class="mr-4">
                <strong>Tags: </strong>
                <ul class="inline-flex gap-x-2">
                  <li v-for="(tag, index) in seoDoc.tags" :key="index">
                    <NuxtLink
                      :to="{
                        path: `/tags/${tag}`,
                        query: { from: route.fullPath },
                      }"
                      class="text-blue-500 hover:underline"
                    >
                      {{ tag }}
                    </NuxtLink>
                  </li>
                </ul>
              </span>

              <span v-if="seoDoc.projectType" class="mr-4">
                <strong>Project Type:</strong>
                  <span v-if="seoDoc.projectType">
                    {{ seoDoc.projectType }}
                  </span>
                <span v-if="seoDoc.projectType === 'freelance'"> Freelance </span>
                <span v-if="seoDoc.projectType === 'employment'">
                  <a
                    :href="seoDoc.employmentLink"
                    class="text-blue-500 hover:underline ml-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Employment</a
                  >
                </span>
              </span>
            </div>

              <div class="mt-4 flex gap-3 flex-wrap">
                <a
                  v-if="seoDoc.github"
                  :href="seoDoc.github"
                  target="_blank"
                  class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  GitHub
                </a>

                <a
                  v-if="seoDoc.liveSite"
                  :href="seoDoc.liveSite"
                  target="_blank"
                  class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  Live Site
                </a>
              </div>
            </template>

            <!-- RIGHT SIDE CARDS -->
            <template #right>
              <div class="hero-stat">
                <Icon name="mdi:book-open-page-variant" class="text-sky-400 text-4xl" />
                <div class="mt-2 text-xl font-bold">Bible</div>
                <div class="text-xs text-slate-400">Core Engine</div>
              </div>

              <div class="hero-stat">
                <Icon name="mdi:brain" class="text-purple-400 text-4xl" />
                <div class="mt-2 text-xl font-bold">AI</div>
                <div class="text-xs text-slate-400">Bible Logic</div>
              </div>

              <div class="hero-stat">
                <Icon name="mdi:video" class="text-emerald-400 text-4xl" />
                <div class="mt-2 text-xl font-bold">Live</div>
                <div class="text-xs text-slate-400">Streaming</div>
              </div>

              <div class="hero-stat">
                <Icon name="mdi:account-group" class="text-amber-400 text-4xl" />
                <div class="mt-2 text-xl font-bold">Social</div>
                <div class="text-xs text-slate-400">Community</div>
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
