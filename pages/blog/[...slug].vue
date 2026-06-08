<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const SITE = (config.public.appDomain as string) || 'https://donavanjones.com'

// Fetch frontmatter only (no body) for SSR SEO head tags
const { data: seoDoc } = await useAsyncData(
  `blog-seo-${route.path}`,
  () => queryContent(route.path).without(['body']).findOne()
)

useSeoMeta({
  title: () => seoDoc.value?.title ? `${seoDoc.value.title} — Donavan Jones` : 'Donavan Jones',
  ogTitle: () => seoDoc.value?.title ? `${seoDoc.value.title} — Donavan Jones` : 'Donavan Jones',
  description: () => seoDoc.value?.description || '',
  ogDescription: () => seoDoc.value?.description || '',
  ogType: 'article',
  ogImage: () => seoDoc.value?.excerptImage || `${SITE}/img/logo.png`,
  ogUrl: () => `${SITE}${route.path}`,
  twitterCard: 'summary_large_image',
  twitterTitle: () => seoDoc.value?.title || 'Donavan Jones',
  twitterDescription: () => seoDoc.value?.description || '',
  twitterImage: () => seoDoc.value?.excerptImage || `${SITE}/img/logo.png`,
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
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          '@id': pageUrl,
          headline: doc.title,
          description: doc.description,
          url: pageUrl,
          datePublished: doc.date ? new Date(doc.date).toISOString() : undefined,
          dateModified: doc.lastUpdated
            ? new Date(doc.lastUpdated).toISOString()
            : doc.date ? new Date(doc.date).toISOString() : undefined,
          author: { '@type': 'Person', '@id': personId, name: 'Donavan Jones' },
          publisher: { '@type': 'Person', '@id': personId, name: 'Donavan Jones' },
          keywords: Array.isArray(doc.tags) ? doc.tags.join(', ') : undefined,
          mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
          isPartOf: { '@id': `${SITE}/#website` },
        })
      }),
    },
  ],
})

const backLink = ref('/blog/overview')

onMounted(() => {
  const from = route.query.from
  if (typeof from === 'string' && from.startsWith('/')) {
    backLink.value = from
  }
})
</script>

<template>
  <PatternSection>
    <div class="flex justify-center gap-x-12">
      <main
        class="max-w-7xl text-white lg:flex justify-center overflow-hidden dark:text-white py-16 px-4"
      >
        <div>
          <!-- Back Button -->
          <nuxt-link class="block cursor-pointer max-w-2xl mb-4" :to="backLink">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="inline h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back
          </nuxt-link>

          <!-- Content -->
          <ContentDoc v-slot="{ doc: contentDoc }">
            <div>
              <h2 class="text-4xl font-semibold text-black dark:text-white">
                {{ contentDoc.title }}
              </h2>

              <p class="text-gray-500 dark:text-white">
                by {{ contentDoc.author }}, {{ contentDoc.date }}
              </p>

              <div class="text-gray-500 dark:text-gray-400 mt-2 flex flex-wrap items-center">
                <span v-if="contentDoc.category" class="mr-4">
                  <strong>Category: </strong>
                  <NuxtLink
                    :to="{ path: `/categories/${contentDoc.category}`, query: { from: route.fullPath } }"
                    class="text-blue-500 hover:underline"
                  >
                    {{ contentDoc.category }}
                  </NuxtLink>
                </span>

                <span v-if="contentDoc.tags?.length" class="mr-4">
                  <strong>Tags: </strong>
                  <ul class="inline-flex gap-x-2">
                    <li v-for="(tag, index) in contentDoc.tags" :key="index">
                      <NuxtLink
                        :to="{ path: `/tags/${tag}`, query: { from: route.fullPath } }"
                        class="text-blue-500 hover:underline"
                      >
                        {{ tag }}
                      </NuxtLink>
                    </li>
                  </ul>
                </span>
              </div>

              <div class="text-gray-500 dark:text-gray-400 mt-4 flex gap-x-4 items-center">
                <a
                  v-if="contentDoc.github"
                  :href="contentDoc.github"
                  class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a
                  v-if="contentDoc.liveSite"
                  :href="contentDoc.liveSite"
                  class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Site
                </a>
              </div>

              <hr class="border-t-2 border-gray-300 my-4 shadow-md" />

              <div class="max-w-8xl">
                <ContentRenderer
                  class="mt-4 max-w-none prose lg:prose-xl dark:prose-invert"
                  :value="contentDoc"
                />
              </div>

              <!-- AUTHOR BOX -->
              <div class="mt-12 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-6 sm:p-8">
                <p class="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">Written by</p>

                <div class="flex flex-col sm:flex-row gap-5">

                  <!-- Avatar -->
                  <div class="flex-shrink-0">
                    <NuxtLink to="/about-me" aria-label="About Donavan Jones">
                      <img
                        src="/images/donavan.jpg"
                        alt="Donavan Jones"
                        width="72"
                        height="72"
                        class="w-[72px] h-[72px] rounded-full border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                      />
                    </NuxtLink>
                  </div>

                  <!-- Details -->
                  <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                      <NuxtLink
                        to="/about-me"
                        class="text-lg font-bold text-slate-900 dark:text-white hover:text-sky-500 transition-colors"
                      >
                        Donavan Jones
                      </NuxtLink>
                      <span class="text-xs px-2 py-0.5 rounded-full border bg-sky-500/10 border-sky-500/20 text-sky-500 font-medium">
                        Full-Stack Engineer
                      </span>
                    </div>

                    <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">
                      Systems Architect · AI &amp; Infrastructure · Founder of Bible Logic
                    </p>

                    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      I build production-grade systems end-to-end — from Nuxt 3 frontends and Nitro APIs to
                      self-hosted Kubernetes clusters, RAG pipelines, and real-time AI applications.
                      Everything I write comes from systems I've designed, deployed, and operated in production.
                    </p>

                    <!-- Expertise pills -->
                    <div class="flex flex-wrap gap-1.5 mb-4">
                      <span
                        v-for="tag in ['Nuxt 3', 'TypeScript', 'PostgreSQL', 'Kubernetes', 'RAG / LLM', 'WebRTC', 'AWS IVS', 'Redis']"
                        :key="tag"
                        class="text-[11px] px-2 py-0.5 rounded-md border bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/50"
                      >{{ tag }}</span>
                    </div>

                    <!-- Authority links -->
                    <div class="flex flex-wrap gap-3">
                      <a
                        href="https://github.com/FullStackDonavan"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                      >
                        <Icon name="mdi:github" class="text-base" />
                        GitHub
                      </a>
                      <a
                        href="https://linkedin.com/in/donavanjones"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-sky-500 transition-colors"
                      >
                        <Icon name="mdi:linkedin" class="text-base" />
                        LinkedIn
                      </a>
                      <NuxtLink
                        to="/resume"
                        class="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                      >
                        <Icon name="mdi:file-account-outline" class="text-base" />
                        Resume
                      </NuxtLink>
                      <NuxtLink
                        to="/system-overview"
                        class="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                      >
                        <Icon name="mdi:server-network" class="text-base" />
                        Systems
                      </NuxtLink>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </ContentDoc>
        </div>
      </main>
    </div>
  </PatternSection>
</template>
