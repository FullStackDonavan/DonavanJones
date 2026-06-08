<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const SITE = (config.public.appDomain as string) || 'https://donavanjones.com'

// Fetch frontmatter only (no body) for SSR SEO head tags
const { data: seoDoc } = await useAsyncData(
  `blog-seo-${route.path}`,
  () => queryContent(route.path).without(['body']).findOne()
)

const pageImage = computed(() => seoDoc.value?.excerptImage || `${SITE}/img/logo.png`)
const pageUrl   = computed(() => `${SITE}${route.path}`)
const personId  = `${SITE}/#person`
const siteId    = `${SITE}/#website`

useSeoMeta({
  title:            () => seoDoc.value?.title ? `${seoDoc.value.title} — Donavan Jones` : 'Donavan Jones',
  ogTitle:          () => seoDoc.value?.title ? `${seoDoc.value.title} — Donavan Jones` : 'Donavan Jones',
  description:      () => seoDoc.value?.description || '',
  ogDescription:    () => seoDoc.value?.description || '',
  ogType:           'article',
  ogImage:          pageImage,
  ogUrl:            pageUrl,
  twitterCard:      'summary_large_image',
  twitterTitle:     () => seoDoc.value?.title || 'Donavan Jones',
  twitterDescription: () => seoDoc.value?.description || '',
  twitterImage:     pageImage,
  canonical:        pageUrl,
  // Article-specific Open Graph
  articlePublishedTime: () => seoDoc.value?.date
    ? new Date(seoDoc.value.date).toISOString() : undefined,
  articleModifiedTime: () => seoDoc.value?.lastUpdated
    ? new Date(seoDoc.value.lastUpdated).toISOString()
    : seoDoc.value?.date ? new Date(seoDoc.value.date).toISOString() : undefined,
  articleAuthor:  `${SITE}/about-me`,
  articleSection: () => seoDoc.value?.category || undefined,
})

useHead({
  script: [
    // ── BlogPosting ───────────────────────────────────────────────────────────
    {
      type: 'application/ld+json',
      innerHTML: computed(() => {
        const doc = seoDoc.value
        if (!doc) return '{}'
        const url = pageUrl.value
        const iso = (d?: string) => d ? new Date(d).toISOString() : undefined
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          '@id': url,
          headline: doc.title,
          description: doc.description,
          url,
          inLanguage: 'en-US',
          image: pageImage.value,
          datePublished: iso(doc.date),
          dateModified: iso(doc.lastUpdated) ?? iso(doc.date),
          articleSection: doc.category || undefined,
          keywords: Array.isArray(doc.tags) ? doc.tags.join(', ') : undefined,
          author: {
            '@type': 'Person',
            '@id': personId,
            name: 'Donavan Jones',
            url: SITE,
            sameAs: [
              'https://github.com/FullStackDonavan',
              'https://linkedin.com/in/donavanjones',
              `${SITE}/resume`,
            ],
          },
          publisher: {
            '@type': 'Person',
            '@id': personId,
            name: 'Donavan Jones',
            url: SITE,
          },
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
          isPartOf: { '@id': siteId },
        })
      }),
    },
    // ── BreadcrumbList ────────────────────────────────────────────────────────
    {
      type: 'application/ld+json',
      innerHTML: computed(() => {
        const doc = seoDoc.value
        if (!doc) return '{}'
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home',  item: SITE },
            { '@type': 'ListItem', position: 2, name: 'Blog',  item: `${SITE}/blog/overview` },
            { '@type': 'ListItem', position: 3, name: doc.title, item: pageUrl.value },
          ],
        })
      }),
    },
    // ── Person (author entity) ────────────────────────────────────────────────
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': personId,
        name: 'Donavan Jones',
        url: SITE,
        jobTitle: 'Full-Stack Engineer & Systems Architect',
        knowsAbout: [
          'Nuxt 3', 'Vue 3', 'TypeScript', 'Node.js', 'PostgreSQL',
          'Redis', 'Kubernetes', 'RAG Pipelines', 'LLM Integration',
          'WebRTC', 'BullMQ', 'Weaviate',
        ],
        sameAs: [
          'https://github.com/FullStackDonavan',
          'https://linkedin.com/in/donavanjones',
        ],
      }),
    },
    // ── WebSite ───────────────────────────────────────────────────────────────
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': siteId,
        name: 'Donavan Jones',
        url: SITE,
        description: 'Full-Stack Engineer & Systems Architect — writing about Nuxt, AI systems, infrastructure, and production engineering.',
        inLanguage: 'en-US',
        publisher: { '@id': personId },
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
                  class="mt-4 max-w-none prose prose-xl dark:prose-invert
                         [&_h1]:text-5xl [&_h1]:font-extrabold [&_h1]:tracking-tight
                         [&_h2]:text-4xl [&_h2]:font-bold [&_h2]:tracking-tight
                         [&_h3]:text-3xl [&_h3]:font-bold
                         [&_h4]:text-2xl [&_h4]:font-semibold
                         [&_h5]:text-xl  [&_h5]:font-semibold"
                  :value="contentDoc"
                />
              </div>

              <!-- RELATED ARTICLES -->
              <RelatedArticles
                v-if="contentDoc.category"
                :category="contentDoc.category"
                :current-path="route.path"
              />

              <!-- CASE STUDY -->
              <BibleVerseCaseStudy />

              <!-- AUTHOR BOX -->
              <div class="mt-12 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-6 sm:p-8"
                   itemscope itemtype="https://schema.org/Person">
                <p class="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">Written by</p>

                <div class="flex flex-col sm:flex-row gap-5">

                  <!-- Avatar -->
                  <div class="flex-shrink-0">
                    <a href="/about-me" rel="author" aria-label="About Donavan Jones — author bio">
                      <img
                        src="/images/donavan.jpg"
                        alt="Donavan Jones — Full-Stack Engineer & Systems Architect"
                        width="72"
                        height="72"
                        itemprop="image"
                        class="w-[72px] h-[72px] rounded-full border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                      />
                    </a>
                  </div>

                  <!-- Details -->
                  <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                      <a
                        href="/about-me"
                        rel="author"
                        itemprop="name"
                        class="text-lg font-bold text-slate-900 dark:text-white hover:text-sky-500 transition-colors"
                      >
                        Donavan Jones
                      </a>
                      <span class="text-xs px-2 py-0.5 rounded-full border bg-sky-500/10 border-sky-500/20 text-sky-500 font-medium"
                            itemprop="jobTitle">
                        Full-Stack Engineer &amp; Systems Architect
                      </span>
                    </div>

                    <p class="text-xs text-slate-500 dark:text-slate-400 mb-3" itemprop="description">
                      5+ years building production systems · AI, Backend &amp; Infrastructure · Founder of Bible Logic
                    </p>

                    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      Full-stack engineer with 5+ years of hands-on experience designing and shipping production systems — from
                      Nuxt 3 frontends and Nitro APIs to self-hosted Kubernetes clusters, RAG pipelines, and real-time AI applications.
                      Everything I write comes from systems I've designed, deployed, and operated in production.
                    </p>

                    <!-- Credentials row -->
                    <div class="flex flex-wrap gap-2 mb-4">
                      <span class="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium">
                        <Icon name="mdi:check-decagram" class="text-sm" />
                        5+ Years Experience
                      </span>
                      <span class="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border bg-purple-500/5 border-purple-500/20 text-purple-500 dark:text-purple-400 font-medium">
                        <Icon name="mdi:brain" class="text-sm" />
                        AI Systems Specialist
                      </span>
                      <span class="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border bg-sky-500/5 border-sky-500/20 text-sky-500 dark:text-sky-400 font-medium">
                        <Icon name="mdi:server-network" class="text-sm" />
                        Kubernetes &amp; Infrastructure
                      </span>
                    </div>

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
                        href="/about-me"
                        rel="author"
                        class="inline-flex items-center gap-1.5 text-xs font-medium text-sky-500 hover:text-sky-400 transition-colors"
                      >
                        <Icon name="mdi:account-circle-outline" class="text-base" />
                        Full Author Bio
                      </a>
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
