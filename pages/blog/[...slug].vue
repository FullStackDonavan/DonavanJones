<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const SITE = (config.public.appDomain as string) || 'https://donavanjones.com'

// Fetch full document (body included) — used for both SEO meta and ContentRenderer
const { data: seoDoc } = await useAsyncData(
  `blog-doc-${route.path}`,
  () => queryContent(route.path).findOne()
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
  articleAuthor:  `${SITE}/about`,
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
        const items: object[] = [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog/overview` },
        ]
        if (doc.category) {
          items.push({ '@type': 'ListItem', position: 3, name: doc.category, item: `${SITE}/categories/${doc.category}` })
          items.push({ '@type': 'ListItem', position: 4, name: doc.title, item: pageUrl.value })
        } else {
          items.push({ '@type': 'ListItem', position: 3, name: doc.title, item: pageUrl.value })
        }
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items,
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
        jobTitle: 'AI Systems Engineer & Platform Builder',
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
        description: 'AI Systems Engineer & Platform Builder — writing about production AI systems, Kubernetes infrastructure, and full-stack engineering.',
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

function formatDate(d: string | undefined) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function isoDate(d: string | undefined) {
  if (!d) return ''
  return new Date(d).toISOString()
}
</script>

<template>
  <PatternSection>
    <div class="flex justify-center gap-x-12">
      <main
        class="max-w-7xl text-white justify-center overflow-hidden dark:text-white py-16 px-4"
      >
        <div>
          <!-- Back Button -->
          <!-- <nuxt-link class="block cursor-pointer max-w-2xl mb-4" :to="backLink">
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
          </nuxt-link> -->

          <!-- Header (driven by seoDoc — available immediately, no slot dependency) -->
          <div v-if="seoDoc">
            <Breadcrumbs
              parentTitle="Blog"
              parentUrl="/blog/overview"
              :midTitle="seoDoc.category ? seoDoc.category.charAt(0).toUpperCase() + seoDoc.category.slice(1) : undefined"
              :midUrl="seoDoc.category ? `/categories/${seoDoc.category}` : undefined"
              :currentPageTitle="seoDoc.title"
            />

            <!-- Article header card -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden mb-8">

              <!-- Chrome header -->
              <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <div class="flex gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  </div>
                  <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">blog.post</span>
                </div>
                <NuxtLink
                  v-if="seoDoc.category"
                  :to="`/categories/${seoDoc.category}`"
                  class="text-[10px] text-sky-500 hover:text-sky-400 transition-colors font-medium"
                >
                  {{ seoDoc.category }} →
                </NuxtLink>
              </div>

              <!-- Content -->
              <div class="px-6 py-5">

                <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                  {{ seoDoc.title }}
                </h2>

                <!-- Publication meta -->
                <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <NuxtLink
                    to="/about"
                    rel="author"
                    class="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-sky-500 transition-colors"
                  >
                    <Icon name="mdi:account-circle-outline" class="text-base" />
                    {{ seoDoc.author || 'Donavan Jones' }}
                  </NuxtLink>
                  <time
                    v-if="seoDoc.date"
                    :datetime="isoDate(seoDoc.date)"
                    class="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400"
                  >
                    <Icon name="mdi:calendar-outline" class="text-base" />
                    {{ formatDate(seoDoc.date) }}
                  </time>
                  <time
                    v-if="seoDoc.lastUpdated"
                    :datetime="isoDate(seoDoc.lastUpdated)"
                    class="inline-flex items-center gap-1.5 text-sm text-sky-500 dark:text-sky-400"
                  >
                    <Icon name="mdi:update" class="text-base" />
                    Updated {{ formatDate(seoDoc.lastUpdated) }}
                  </time>
                </div>

                <!-- Tags -->
                <div v-if="seoDoc.tags?.length" class="mt-4 flex flex-wrap gap-1.5">
                  <NuxtLink
                    v-for="(tag, index) in seoDoc.tags"
                    :key="index"
                    :to="`/tags/${tag}`"
                    class="text-[11px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 transition-all duration-150 hover:bg-sky-500/10 hover:border-sky-500/40 hover:text-sky-600 dark:hover:text-sky-400"
                  >
                    #{{ tag }}
                  </NuxtLink>
                </div>

                <!-- GitHub / Live Site -->
                <div v-if="seoDoc.github || seoDoc.liveSite" class="mt-4 flex flex-wrap gap-2">
                  <a
                    v-if="seoDoc.github"
                    :href="seoDoc.github"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 text-[11px] px-3 py-1 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 transition-all duration-150 hover:bg-slate-900 hover:border-slate-700 hover:text-white"
                  >
                    <Icon name="mdi:github" class="text-sm" /> GitHub
                  </a>
                  <a
                    v-if="seoDoc.liveSite"
                    :href="seoDoc.liveSite"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 text-[11px] px-3 py-1 rounded border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/50 transition-all duration-150 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    <Icon name="mdi:open-in-new" class="text-sm" /> Live Site
                  </a>
                </div>

              </div>
            </div>
          </div>

          <!-- Article body -->
          <div v-if="seoDoc">
            <div>
              <div class="max-w-8xl">
                <ContentRenderer
                  class="mt-4 max-w-none prose prose-xl dark:prose-invert
                         [&_h1]:text-5xl [&_h1]:font-extrabold [&_h1]:tracking-tight
                         [&_h2]:text-4xl [&_h2]:font-bold [&_h2]:tracking-tight
                         [&_h3]:text-3xl [&_h3]:font-bold
                         [&_h4]:text-2xl [&_h4]:font-semibold
                         [&_h5]:text-xl  [&_h5]:font-semibold"
                  :value="seoDoc"
                />
              </div>

              <!-- RELATED ARTICLES -->
              <RelatedArticles
                v-if="seoDoc?.category"
                :category="seoDoc.category"
                :current-path="route.path"
              />

              <!-- CASE STUDY -->
              <BibleVerseCaseStudy />


<!-- AUTHOR BOX -->
<div class="mt-12 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-6 sm:p-8">
  <p class="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">
    Written by
  </p>

  <div class="flex flex-col sm:flex-row gap-5">

    <!-- Avatar -->
    <div class="flex-shrink-0">
      <NuxtLink
        to="/about/"
        rel="author"
        aria-label="Donavan Jones — AI Systems Engineer & Platform Builder"
      >
        <img
          src="/images/donavan.jpg"
          alt="Donavan Jones — AI Systems Engineer & Platform Builder"
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
          to="/about/"
          rel="author"
          class="text-lg font-bold text-slate-900 dark:text-white hover:text-sky-500 transition-colors"
        >
          Donavan Jones
        </NuxtLink>

        <NuxtLink
          to="/"
          class="text-xs px-2 py-0.5 rounded-full border bg-sky-500/10 border-sky-500/20 text-sky-500 font-medium hover:bg-sky-500/20 transition-colors"
        >
          AI Systems Engineer &amp; Platform Builder
        </NuxtLink>

      </div>

      <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">
        5+ years building production systems · AI Engineering · Backend Infrastructure · Founder of Bible Logic
      </p>

      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
        Donavan Jones is an AI Systems Engineer with 20+ years building production systems
        end-to-end — RAG pipelines, local LLM inference on self-hosted Kubernetes, async job queues,
        and full-stack SaaS platforms. He owns the full stack from bare-metal to browser.
      </p>

      <!-- Homepage Internal Link -->
      <p class="text-sm mb-4">
        <NuxtLink
          to="/"
          class="font-medium text-sky-500 hover:text-sky-400 transition-colors"
        >
          Explore more engineering articles, AI systems, and production case studies →
        </NuxtLink>
      </p>

      <!-- Credentials -->
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

      <!-- Expertise -->
      <div class="flex flex-wrap gap-1.5 mb-4">
        <span
          v-for="tag in [
            'Nuxt 3',
            'TypeScript',
            'PostgreSQL',
            'Kubernetes',
            'RAG / LLM',
            'WebRTC',
            'Redis',
            'System Design'
          ]"
          :key="tag"
          class="text-[11px] px-2 py-0.5 rounded-md border bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/50"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Authority Links -->
      <div class="flex flex-wrap gap-3">

        <NuxtLink
          to="/about"
          class="inline-flex items-center gap-1.5 text-xs font-medium text-sky-500 hover:text-sky-400 transition-colors"
        >
          <Icon name="mdi:account-circle-outline" class="text-base" />
          Full Author Bio
        </NuxtLink>

        <NuxtLink
          to="/"
          class="inline-flex items-center gap-1.5 text-xs font-medium text-sky-500 hover:text-sky-400 transition-colors"
        >
          <Icon name="mdi:home-outline" class="text-base" />
          Homepage
        </NuxtLink>

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
          </div>
        </div>
      </main>
    </div>
  </PatternSection>
</template>
