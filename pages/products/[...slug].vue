<template>
  <div v-if="seoDoc" class="min-h-screen bg-white dark:bg-slate-950">

    <!-- Hero -->
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
      :stripe-price-id="seoDoc.stripePriceId"
    >
      <template #right>
        <div
          v-for="(stat, i) in seoDoc.heroStats"
          :key="i"
          class="rounded-2xl border border-slate-200 dark:border-slate-700/50
                 bg-slate-50 dark:bg-slate-900/60 overflow-hidden transition-all duration-200"
          :class="{
            'hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5':       i % 4 === 0,
            'hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5': i % 4 === 1,
            'hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5': i % 4 === 2,
            'hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5':   i % 4 === 3,
          }"
        >
          <div class="px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
            <div class="flex gap-1">
              <span class="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
              <span class="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
              <span class="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
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

    <!-- What's Inside cards -->
    <div class="bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6 py-10">
        <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-6">What's Inside</p>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink
            v-for="(feat, i) in parsedFeatures"
            :key="i"
            :to="guideUrl"
            class="group block p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60
                   hover:border-sky-500/40 dark:hover:border-sky-500/30
                   hover:shadow-lg hover:shadow-sky-500/5
                   transition-all duration-200"
          >
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
              :class="{
                'bg-sky-500/10':     i % 4 === 0,
                'bg-purple-500/10':  i % 4 === 1,
                'bg-emerald-500/10': i % 4 === 2,
                'bg-amber-500/10':   i % 4 === 3,
              }"
            >
              <Icon
                :name="feat.icon"
                class="text-base"
                :class="{
                  'text-sky-400':     i % 4 === 0,
                  'text-purple-400':  i % 4 === 1,
                  'text-emerald-400': i % 4 === 2,
                  'text-amber-400':   i % 4 === 3,
                }"
              />
            </div>
            <p
              v-if="feat.title"
              class="text-sm font-semibold text-slate-800 dark:text-slate-200
                     group-hover:text-sky-400 transition-colors leading-snug mb-1"
            >
              {{ feat.title }}
            </p>
            <p class="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              {{ feat.description }}
            </p>
            <p class="mt-3 text-[10px] font-semibold text-sky-500 uppercase tracking-wide flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Read section <Icon name="mdi:arrow-right" class="text-xs" />
            </p>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Prose body -->
    <div class="max-w-7xl mx-auto px-6 py-16 lg:flex lg:gap-14 lg:items-start">

      <!-- Article -->
      <div class="flex-1 min-w-0 max-w-3xl">
        <ContentRenderer
          class="prose prose-slate dark:prose-invert max-w-none
                 prose-headings:font-bold
                 prose-h2:text-xl prose-h2:text-slate-900 dark:prose-h2:text-white
                 prose-h2:mt-0 prose-h2:mb-4 prose-h2:pb-3
                 prose-h2:border-b prose-h2:border-slate-200 dark:prose-h2:border-slate-800
                 prose-p:text-slate-500 dark:prose-p:text-slate-400 prose-p:leading-relaxed
                 prose-a:text-sky-500 prose-a:no-underline hover:prose-a:text-sky-400
                 prose-strong:text-slate-700 dark:prose-strong:text-slate-300
                 prose-li:text-slate-500 dark:prose-li:text-slate-400
                 prose-code:text-sky-500 dark:prose-code:text-sky-400
                 prose-code:bg-slate-100 dark:prose-code:bg-slate-800
                 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-xs"
          :value="seoDoc"
        />
      </div>

      <!-- Sidebar -->
      <aside class="hidden lg:block w-64 flex-shrink-0 pt-1">
        <div class="sticky top-6 space-y-4">

          <!-- Quick access -->
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden">
            <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Quick Access</p>
            </div>
            <nav class="p-2 space-y-0.5">
              <NuxtLink
                v-for="(feat, i) in parsedFeatures"
                :key="i"
                :to="guideUrl"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 dark:text-slate-400
                       hover:text-sky-400 hover:bg-sky-500/5 transition-colors"
              >
                <Icon :name="feat.icon" class="text-sm flex-shrink-0 opacity-60" />
                <span class="truncate">{{ feat.title || feat.description }}</span>
              </NuxtLink>
            </nav>
          </div>

          <!-- CTA -->
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 p-5">
            <p class="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Ready to dive in?</p>
            <p class="text-xs text-slate-400 dark:text-slate-500 mb-4 leading-relaxed">
              All the diagrams, code, and references in one place.
            </p>
            <NuxtLink
              :to="guideUrl"
              class="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl
                     font-semibold text-xs text-white bg-sky-500 hover:bg-sky-400
                     transition-colors duration-150"
            >
              <Icon name="mdi:arrow-right" class="text-sm" />
              View the Guide
            </NuxtLink>
          </div>

        </div>
      </aside>
    </div>

    <!-- More Products -->
    <div v-if="otherProducts.length" class="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
      <div class="max-w-7xl mx-auto px-6 py-14">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-base font-bold text-slate-900 dark:text-white">More Products</h2>
          <NuxtLink
            to="/products/overview"
            class="text-sm font-medium text-sky-500 hover:text-sky-400 flex items-center gap-1 transition-colors"
          >
            All Products
            <Icon name="mdi:arrow-right" class="text-base" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <NuxtLink
            v-for="p in otherProducts"
            :key="p._path"
            :to="p._path"
            class="group flex items-start gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50
                   bg-white dark:bg-slate-900/60
                   hover:border-sky-500/40 dark:hover:border-sky-500/30
                   hover:shadow-lg hover:shadow-sky-500/5
                   transition-all duration-200"
          >
            <div class="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800">
              <Icon :name="p.badgeIcon || 'mdi:package-variant-closed'" class="text-xl text-slate-400 dark:text-slate-500" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-sky-400 transition-colors mb-0.5">
                {{ p.title }}
              </p>
              <p class="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">{{ p.tagline }}</p>
            </div>
            <Icon
              name="mdi:arrow-right"
              class="flex-shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-sky-400
                     group-hover:translate-x-1 transition-all duration-200 text-lg mt-0.5"
            />
          </NuxtLink>
        </div>
      </div>
    </div>

  </div>
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

const guideUrl = computed(() => `${route.path}/guide`)

const parsedFeatures = computed(() => {
  const features: string[] = seoDoc.value?.features ?? []
  const icons: string[] = seoDoc.value?.featureIcons ?? []
  return features.map((f, i) => {
    const sep = f.indexOf(' — ')
    return {
      icon: icons[i] ?? 'mdi:check-circle-outline',
      title: sep !== -1 ? f.slice(0, sep) : null,
      description: sep !== -1 ? f.slice(sep + 3) : f,
    }
  })
})

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
