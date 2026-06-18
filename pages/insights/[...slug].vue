<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const SITE = (config.public.appDomain as string) || 'https://donavanjones.com'

const { data: doc } = await useAsyncData(
  `insights-doc-${route.path}`,
  () => queryContent(route.path).findOne()
)

const pageImage = computed(() => doc.value?.excerptImage || `${SITE}/img/logo.png`)
const pageUrl   = computed(() => `${SITE}${route.path}`)

useSeoMeta({
  title:            () => doc.value?.title ? `${doc.value.title} — Donavan Jones` : 'Insights — Donavan Jones',
  ogTitle:          () => doc.value?.title ? `${doc.value.title} — Donavan Jones` : 'Insights — Donavan Jones',
  description:      () => doc.value?.description || '',
  ogDescription:    () => doc.value?.description || '',
  ogType:           'article',
  ogImage:          pageImage,
  ogUrl:            pageUrl,
  twitterCard:      'summary_large_image',
  twitterTitle:     () => doc.value?.title || 'Donavan Jones',
  twitterDescription: () => doc.value?.description || '',
  canonical:        pageUrl,
  articlePublishedTime: () => doc.value?.date ? new Date(doc.value.date).toISOString() : undefined,
  articleModifiedTime:  () => doc.value?.lastUpdated ? new Date(doc.value.lastUpdated).toISOString() : undefined,
  articleAuthor:    `${SITE}/about`,
  articleSection:   'Insights',
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
      <main class="max-w-7xl text-white justify-center overflow-hidden dark:text-white py-16 px-4">
        <div>

          <div v-if="doc">

            <Breadcrumbs
              parentTitle="Insights"
              parentUrl="/insights/overview"
              :currentPageTitle="doc.title"
            />

            <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden mb-8">

              <!-- Chrome header -->
              <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <div class="flex gap-1.5">
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  </div>
                  <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">insights.post</span>
                </div>
                <NuxtLink
                  v-if="doc.category"
                  :to="`/categories/${doc.category}`"
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

                <!-- Meta: author + date -->
                <div class="flex flex-wrap items-center gap-1.5 mb-3">
                  <NuxtLink
                    to="/about"
                    rel="author"
                    class="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded border
                           bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300
                           border-slate-200 dark:border-slate-700/50
                           transition-all duration-150 hover:bg-sky-500/10 hover:border-sky-500/40 hover:text-sky-600 dark:hover:text-sky-400"
                  >
                    <Icon name="mdi:account-circle-outline" class="text-xs" />
                    {{ doc.author || 'Donavan Jones' }}
                  </NuxtLink>
                  <time
                    v-if="doc.date"
                    :datetime="isoDate(doc.date)"
                    class="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded border
                           bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300
                           border-slate-200 dark:border-slate-700/50"
                  >
                    <Icon name="mdi:calendar-outline" class="text-xs" />
                    {{ formatDate(doc.date) }}
                  </time>
                </div>

                <!-- Tags -->
                <div v-if="doc.tags?.length" class="flex flex-wrap gap-1.5">
                  <NuxtLink
                    v-for="(tag, i) in doc.tags"
                    :key="i"
                    :to="`/tags/${tag}`"
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

          <!-- Body -->
          <div v-if="doc">
            <div class="max-w-8xl">
              <ContentRenderer
                class="mt-4 max-w-none prose prose-xl dark:prose-invert
                       [&_h1]:text-5xl [&_h1]:font-extrabold [&_h1]:tracking-tight
                       [&_h2]:text-4xl [&_h2]:font-bold [&_h2]:tracking-tight
                       [&_h3]:text-3xl [&_h3]:font-bold
                       [&_h4]:text-2xl [&_h4]:font-semibold
                       [&_h5]:text-xl  [&_h5]:font-semibold"
                :value="doc"
              />
            </div>

            <!-- Recent Insights -->
            <RecentInsights :current-path="route.path" />

            <!-- CASE STUDY -->
            <BusinessBenefitCaseStudy />

            <!-- Author box -->
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
                      v-for="tag in ['Nuxt 3', 'TypeScript', 'PostgreSQL', 'Kubernetes', 'RAG / LLM', 'WebRTC', 'Redis', 'System Design']"
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



            <!-- Back to insights -->
            <div class="mt-8">
              <NuxtLink
                to="/insights/overview"
                class="inline-flex items-center gap-2 text-sm font-medium text-sky-500 hover:text-sky-400 transition-colors"
              >
                <Icon name="mdi:arrow-left" class="text-base" />
                Back to Insights
              </NuxtLink>
            </div>

          </div>
        </div>
      </main>
    </div>
  </PatternSection>
</template>
