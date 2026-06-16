<script setup lang="ts">
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'
useSeoMeta({
  title: 'Products — Donavan Jones',
  description: 'Paid guides and starter kits distilled from the engineering blog — Raspberry Pi clusters, self-hosted AI, and production API boilerplates.',
  ogTitle: 'Products — Donavan Jones',
  ogDescription: 'Paid guides and starter kits distilled from the engineering blog — Raspberry Pi clusters, self-hosted AI, and production API boilerplates.',
  ogType: 'website',
  ogImage: `${_SITE}/img/logo.png`,
  ogUrl: `${_SITE}/products/overview`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Products — Donavan Jones',
  twitterDescription: 'Paid guides and starter kits distilled from the engineering blog.',
  canonical: `${_SITE}/products/overview`,
})

const { data: products } = await useAsyncData('products', () =>
  queryContent('/products')
    .where({ draft: { $ne: true } })
    .find()
)

function truncate(text: string, max = 140): string {
  if (!text) return ''
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
}
</script>

<template>
  <PatternSection class="flex justify-center w-full">
    <div class="w-full">

      <!-- ── HERO ───────────────────────────────────────────────────── -->
      <div class="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div class="max-w-4xl mx-auto px-6 py-20 sm:py-28 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6
                      bg-sky-500/10 border border-sky-500/20 text-sky-500 dark:text-sky-400 text-xs font-medium">
            <Icon name="mdi:package-variant-closed" class="text-sm" />
            Products
          </div>
          <h1 class="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
            Products
          </h1>
          <p class="mt-5 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Guides and starter kits distilled from the blog — the hardware lists, manifests,
            pipelines, and boilerplate code, in one place instead of scattered across articles.
          </p>
          <div class="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <span class="flex items-center gap-1.5">
              <Icon name="mdi:package-variant-closed" class="text-sky-400" />
              {{ products?.length ?? 0 }} products
            </span>
            <span class="flex items-center gap-1.5">
              <Icon name="mdi:layers-outline" class="text-sky-400" />
              Infrastructure · AI · Backend
            </span>
            <span class="flex items-center gap-1.5">
              <Icon name="mdi:account-outline" class="text-sky-400" />
              Donavan Jones
            </span>
          </div>
        </div>
      </div>

      <!-- ── GRID ───────────────────────────────────────────────────── -->
      <div class="w-full bg-slate-50 dark:bg-slate-950 py-10">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink
              v-for="product in products"
              :key="product._path"
              :to="product._path"
              class="group flex flex-col rounded-2xl overflow-hidden
                     border border-slate-200 dark:border-slate-700/50
                     bg-white dark:bg-slate-900/60
                     hover:border-sky-500/40 dark:hover:border-sky-500/30
                     transition-all duration-200 hover:shadow-lg hover:shadow-sky-500/5"
            >

              <!-- Top banner -->
              <div class="relative h-32 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                <Icon :name="product.badgeIcon || 'mdi:package-variant-closed'" class="text-5xl text-slate-300 dark:text-slate-600" />

                <div
                  v-if="product.price"
                  class="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full
                         bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 backdrop-blur-sm"
                >
                  {{ product.price }}
                </div>

                <div
                  v-if="product.badge"
                  class="absolute top-3 left-3 text-[11px] font-medium px-2.5 py-1 rounded-full
                         bg-black/50 text-white backdrop-blur-sm border border-white/10"
                >
                  {{ product.badge }}
                </div>
              </div>

              <!-- Body -->
              <div class="flex flex-col flex-1 p-5">
                <div class="mb-3">
                  <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-sky-400 transition-colors">
                    {{ product.title }}
                  </h2>
                  <p v-if="product.tagline" class="text-xs font-medium text-sky-500 dark:text-sky-400 mt-0.5">
                    {{ product.tagline }}
                  </p>
                </div>

                <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                  {{ truncate(product.description) }}
                </p>

                <div v-if="product.features?.length" class="mt-4 text-xs text-slate-400 dark:text-slate-500">
                  {{ product.features.length }} included resources
                </div>

                <div class="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span class="text-xs font-medium text-slate-400 dark:text-slate-500">
                    {{ product.format || 'Digital Download' }}
                  </span>
                  <span class="inline-flex items-center gap-1 text-sm font-medium text-sky-500
                               group-hover:translate-x-1 transition-transform duration-200">
                    View Product
                    <Icon name="mdi:arrow-right" class="text-base" />
                  </span>
                </div>
              </div>
            </NuxtLink>
          </div>

        </div>
      </div>

    </div>
  </PatternSection>
</template>
