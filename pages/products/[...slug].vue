<template>
  <PatternSection>
    <div class="min-h-screen">
      <div v-if="seoDoc">

        <ProductHero
          :title="seoDoc.title"
          :tagline="seoDoc.tagline || ''"
          :description="seoDoc.description"
          :badge="seoDoc.badge"
          :badge-icon="seoDoc.badgeIcon || 'mdi:package-variant-closed'"
          :price="seoDoc.price"
          :format="seoDoc.format"
          :cta-button-text="seoDoc.ctaButtonText"
          :cta-url="seoDoc.ctaUrl"
          :related-category-label="seoDoc.relatedCategoryLabel"
          :related-category-url="seoDoc.relatedCategoryUrl"
          :features="seoDoc.features || []"
          :stripe-price-id="seoDoc.stripePriceId"
        >
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
        </ProductHero>

        <div class="max-w-7xl mx-auto px-4 py-12">
          <ContentRenderer
            class="prose lg:prose-xl dark:prose-invert max-w-none"
            :value="seoDoc"
          />
        </div>

        <!-- More Products -->
        <div v-if="otherProducts.length" class="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div class="max-w-7xl mx-auto px-4 py-14">
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">More Products</h2>
              <NuxtLink
                to="/products/overview"
                class="text-sm font-medium text-sky-500 hover:text-sky-400 flex items-center gap-1 transition-colors"
              >
                All Products
                <Icon name="mdi:arrow-right" class="text-base" />
              </NuxtLink>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <NuxtLink
                v-for="p in otherProducts"
                :key="p._path"
                :to="p._path"
                class="group flex items-start gap-5 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50
                       bg-white dark:bg-slate-900/60
                       hover:border-sky-500/40 dark:hover:border-sky-500/30
                       transition-all duration-200 hover:shadow-lg hover:shadow-sky-500/5"
              >
                <div class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                  <Icon :name="p.badgeIcon || 'mdi:package-variant-closed'" class="text-2xl text-slate-400 dark:text-slate-500" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-semibold text-emerald-500">{{ p.price }}</span>
                    <span class="text-xs text-slate-400 dark:text-slate-500">·</span>
                    <span class="text-xs text-slate-400 dark:text-slate-500">{{ p.format }}</span>
                  </div>
                  <p class="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-sky-400 transition-colors truncate">
                    {{ p.title }}
                  </p>
                  <p class="text-xs text-sky-500 dark:text-sky-400 mt-0.5">{{ p.tagline }}</p>
                </div>
                <Icon name="mdi:arrow-right" class="flex-shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all duration-200 text-lg mt-0.5" />
              </NuxtLink>
            </div>
          </div>
        </div>

      </div>
    </div>
  </PatternSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#app'

const route = useRoute()
const config = useRuntimeConfig()
const SITE = (config.public.appDomain as string) || 'https://donavanjones.com'

const { data: seoDoc } = await useAsyncData(
  `product-doc-${route.path}`,
  () => queryContent(route.path).findOne()
)

const { data: allProducts } = await useAsyncData(
  'all-products',
  () => queryContent('/products').where({ draft: { $ne: true } }).find()
)

const otherProducts = computed(() =>
  (allProducts.value ?? []).filter(p => p._path !== route.path)
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
  ogImage: `${SITE}/img/logo.png`,
  ogUrl: () => `${SITE}${route.path}`,
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  twitterImage: `${SITE}/img/logo.png`,
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
        const priceValue = typeof doc.price === 'string' ? doc.price.replace(/[^0-9.]/g, '') : undefined
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          '@id': pageUrl,
          name: doc.title,
          description: doc.description,
          url: pageUrl,
          ...(priceValue ? {
            offers: {
              '@type': 'Offer',
              price: priceValue,
              priceCurrency: 'USD',
              url: pageUrl,
              availability: 'https://schema.org/InStock',
            },
          } : {}),
          brand: { '@type': 'Person', name: 'Donavan Jones' },
          isPartOf: { '@id': `${SITE}/#website` },
          mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
        })
      }),
    },
  ],
})
</script>
