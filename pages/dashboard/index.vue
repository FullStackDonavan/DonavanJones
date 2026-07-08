<script setup lang="ts">
import QuestionBoard from "~/components/elements/QuestionBoard.vue";
import DashboardSidebar from "~~/components/elements/DashboardSidebar.vue";
import { useUser } from '~/composables/useAuth'
import type { IReview } from '~~/types/IReview'

definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'Dashboard — Donavan Jones',
  robots: 'noindex',
})

interface IPurchase {
  id: number
  productSlug: string
  productTitle: string
  amountTotal: number | null
  currency: string | null
  purchasedAt: string
}

const user = await useUser()
const cookieHeaders = useRequestHeaders(['cookie'])

const { data: purchases } = await useFetch<IPurchase[]>('/api/profile/purchases', {
  headers: cookieHeaders as HeadersInit,
})

const { data: myReviews, refresh: refreshMyReviews } = await useFetch<IReview[]>('/api/reviews/mine', {
  headers: cookieHeaders as HeadersInit,
})

const { data: allProducts } = await useAsyncData('dashboard-products', () =>
  queryContent('/products').where({ draft: { $ne: true } }).find()
)

const { data: reviewSummaries } = await useFetch<Record<string, { average: number; count: number }>>('/api/reviews/summary')

const ownedSlugs = computed(() => new Set((purchases.value ?? []).map(p => p.productSlug)))

const ownedProducts = computed(() =>
  (purchases.value ?? []).map(p => ({
    purchase: p,
    content: allProducts.value?.find(prod => prod.slug === p.productSlug),
    review: myReviews.value?.find(r => r.productSlug === p.productSlug) ?? null,
  }))
)

const exploreProducts = computed(() =>
  (allProducts.value ?? []).filter(p => !ownedSlugs.value.has(p.slug))
)

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatAmount(p: IPurchase): string {
  if (p.amountTotal == null) return ''
  const amount = (p.amountTotal / 100).toFixed(2)
  const currency = (p.currency || 'usd').toUpperCase()
  return currency === 'USD' ? `$${amount}` : `${amount} ${currency}`
}
</script>

<template>
  <PatternSection>
    <div class="min-h-screen px-6 py-12">
      <div class="max-w-6xl mx-auto">

        <!-- Header -->
        <div class="mb-10">
          <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Welcome back{{ user?.firstName ? `, ${user.firstName}` : '' }}
          </h1>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Your products, questions, and reviews — all in one place.
          </p>
        </div>

        <div class="md:flex md:gap-10 items-start">
          <DashboardSidebar />

          <div class="flex-1 min-w-0 space-y-14">

            <!-- Stats -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60">
                <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ purchases?.length ?? 0 }}</p>
                <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Products Owned</p>
              </div>
              <div class="p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60">
                <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ myReviews?.length ?? 0 }}</p>
                <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Reviews Written</p>
              </div>
              <NuxtLink
                to="/dashboard/ask"
                class="p-5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700/50
                       flex flex-col justify-center items-center text-center gap-1
                       hover:border-sky-500/40 hover:bg-sky-500/5 transition-colors"
              >
                <Icon name="ic:sharp-live-help" class="text-xl text-sky-400" />
                <p class="text-xs font-semibold text-sky-500">Ask a Question</p>
              </NuxtLink>
            </div>

            <!-- Your Products -->
            <div id="your-products">
              <div class="mb-5 flex items-center justify-between">
                <h2 class="text-base font-bold text-slate-900 dark:text-white">Your Products</h2>
                <NuxtLink
                  to="/products/overview"
                  class="text-sm font-medium text-sky-500 hover:text-sky-400 flex items-center gap-1 transition-colors"
                >
                  Browse All
                  <Icon name="mdi:arrow-right" class="text-base" />
                </NuxtLink>
              </div>

              <div v-if="ownedProducts.length" class="space-y-4">
                <div
                  v-for="p in ownedProducts"
                  :key="p.purchase.id"
                  class="p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60"
                >
                  <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div class="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Icon
                        :name="p.content?.badgeIcon || 'mdi:package-variant-closed-check'"
                        class="text-xl text-emerald-400"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ p.purchase.productTitle }}</p>
                      <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        Purchased {{ formatDate(p.purchase.purchasedAt) }}
                        <template v-if="formatAmount(p.purchase)"> · {{ formatAmount(p.purchase) }}</template>
                      </p>
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0">
                      <NuxtLink
                        :to="`/products/${p.purchase.productSlug}`"
                        class="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700
                               text-slate-600 dark:text-slate-300 hover:border-sky-500/40 hover:text-sky-500
                               dark:hover:text-sky-400 transition-colors"
                      >
                        Product Page
                      </NuxtLink>
                      <NuxtLink
                        :to="`/products/${p.purchase.productSlug}/guide`"
                        class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white
                               bg-sky-500 hover:bg-sky-400 transition-colors"
                      >
                        <Icon name="mdi:book-open-variant" class="text-sm" />
                        Open Guide
                      </NuxtLink>
                    </div>
                  </div>

                  <!-- Existing review -->
                  <div
                    v-if="p.review"
                    class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4"
                  >
                    <div class="flex-1 min-w-0">
                      <StarRating :model-value="p.review.rating" readonly size="text-sm" />
                      <p class="text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">{{ p.review.body }}</p>
                    </div>
                    <ReviewForm
                      :product-slug="p.purchase.productSlug"
                      :existing-review="p.review"
                      @saved="() => refreshMyReviews()"
                    />
                  </div>
                  <div v-else class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <ReviewForm :product-slug="p.purchase.productSlug" @saved="() => refreshMyReviews()" />
                  </div>
                </div>
              </div>

              <div
                v-else
                class="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700/50"
              >
                <Icon name="mdi:package-variant" class="text-4xl text-slate-300 dark:text-slate-600 mb-3" />
                <p class="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">No products yet</p>
                <p class="text-xs text-slate-400 dark:text-slate-500 mb-6 max-w-sm mx-auto">
                  Grab a guide below and it'll show up here, ready to review once you've put it to use.
                </p>
              </div>
            </div>

            <!-- Explore more products -->
            <div v-if="exploreProducts.length">
              <div class="mb-5 flex items-center justify-between">
                <h2 class="text-base font-bold text-slate-900 dark:text-white">
                  {{ ownedProducts.length ? 'More Ways to Level Up' : 'Explore Products' }}
                </h2>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div
                  v-for="product in exploreProducts"
                  :key="product._path"
                  class="flex flex-col p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50
                         bg-white dark:bg-slate-900/60"
                >
                  <NuxtLink :to="product._path" class="group flex items-start gap-4 mb-3">
                    <div class="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                      <Icon :name="product.badgeIcon || 'mdi:package-variant-closed'" class="text-xl text-slate-400 dark:text-slate-500" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-sky-400 transition-colors mb-0.5">
                        {{ product.title }}
                      </p>
                      <p class="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">{{ product.tagline }}</p>
                    </div>
                  </NuxtLink>

                  <div v-if="reviewSummaries?.[product.slug]" class="flex items-center gap-2 mb-3">
                    <StarRating :model-value="reviewSummaries[product.slug].average" readonly size="text-xs" />
                    <span class="text-xs text-slate-400 dark:text-slate-500">
                      {{ reviewSummaries[product.slug].average.toFixed(1) }} · {{ reviewSummaries[product.slug].count }}
                    </span>
                  </div>

                  <div class="mt-auto pt-3 flex items-center justify-between gap-3">
                    <span class="text-sm font-semibold text-slate-900 dark:text-white">{{ product.price }}</span>
                    <form v-if="product.stripePriceId" method="post" action="/api/purchase">
                      <input type="hidden" name="price_id" :value="product.stripePriceId" />
                      <button
                        type="submit"
                        class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white
                               bg-sky-500 hover:bg-sky-400 transition-colors"
                      >
                        <Icon name="mdi:lock-outline" class="text-sm" />
                        Buy Now
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <!-- Hire me CTA -->
            <div
              class="p-8 rounded-2xl border border-sky-500/20 bg-sky-500/5 flex flex-col sm:flex-row
                     sm:items-center justify-between gap-5"
            >
              <div>
                <p class="text-base font-bold text-slate-900 dark:text-white mb-1">
                  Want it built or customized for your team?
                </p>
                <p class="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                  If a guide gets you 80% of the way there, I can build the rest — custom infrastructure,
                  integrations, or a fully managed setup.
                </p>
              </div>
              <NuxtLink
                to="/hire-me"
                class="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                       font-semibold text-sm text-white bg-sky-500 hover:bg-sky-400 transition-colors"
              >
                Let's Talk
                <Icon name="mdi:arrow-right" class="text-base" />
              </NuxtLink>
            </div>

            <!-- Community Q&A -->
            <div>
              <div class="mb-5 flex items-center justify-between">
                <h2 class="text-base font-bold text-slate-900 dark:text-white">Community Questions</h2>
                <NuxtLink
                  to="/dashboard/ask"
                  class="text-sm font-medium text-sky-500 hover:text-sky-400 flex items-center gap-1 transition-colors"
                >
                  Ask a Question
                  <Icon name="mdi:arrow-right" class="text-base" />
                </NuxtLink>
              </div>
              <QuestionBoard />
            </div>

          </div>
        </div>
      </div>
    </div>
  </PatternSection>
</template>
