<script setup lang="ts">
import { useUser, userLogout } from '~/composables/useAuth'

definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'My Profile — Donavan Jones',
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
const { data: purchases, pending } = await useFetch<IPurchase[]>('/api/profile/purchases', {
  headers: cookieHeaders as HeadersInit,
})

function formatAmount(p: IPurchase): string {
  if (p.amountTotal == null) return ''
  const amount = (p.amountTotal / 100).toFixed(2)
  const currency = (p.currency || 'usd').toUpperCase()
  return currency === 'USD' ? `$${amount}` : `${amount} ${currency}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <PatternSection>
    <div class="min-h-screen px-6 py-16">
      <div class="max-w-3xl mx-auto">

        <!-- Account header -->
        <div class="flex items-start justify-between gap-4 mb-10">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:account" class="text-2xl text-sky-400" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {{ user?.firstName || user?.username || 'My Profile' }}<template v-if="user?.lastName"> {{ user.lastName }}</template>
              </h1>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ user?.email }}</p>
            </div>
          </div>
          <button
            class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold
                   border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400
                   hover:border-red-400/50 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            @click="userLogout()"
          >
            <Icon name="mdi:logout" class="text-sm" />
            Log Out
          </button>
        </div>

        <!-- Purchases -->
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-base font-bold text-slate-900 dark:text-white">My Products</h2>
          <NuxtLink
            to="/products/overview"
            class="text-sm font-medium text-sky-500 hover:text-sky-400 flex items-center gap-1 transition-colors"
          >
            Browse Products
            <Icon name="mdi:arrow-right" class="text-base" />
          </NuxtLink>
        </div>

        <div v-if="pending" class="text-center py-16 text-slate-400">
          <Icon name="mdi:loading" class="text-3xl animate-spin" />
        </div>

        <div v-else-if="purchases?.length" class="space-y-4">
          <div
            v-for="p in purchases"
            :key="p.id"
            class="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl
                   border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60"
          >
            <div class="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Icon name="mdi:package-variant-closed-check" class="text-xl text-emerald-400" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ p.productTitle }}</p>
              <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Purchased {{ formatDate(p.purchasedAt) }}
                <template v-if="formatAmount(p)"> · {{ formatAmount(p) }}</template>
              </p>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <NuxtLink
                :to="`/products/${p.productSlug}`"
                class="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700
                       text-slate-600 dark:text-slate-300 hover:border-sky-500/40 hover:text-sky-500
                       dark:hover:text-sky-400 transition-colors"
              >
                Product Page
              </NuxtLink>
              <NuxtLink
                :to="`/products/${p.productSlug}/guide`"
                class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white
                       bg-sky-500 hover:bg-sky-400 transition-colors"
              >
                <Icon name="mdi:book-open-variant" class="text-sm" />
                Open Guide
              </NuxtLink>
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
            Products you buy with this email address will show up here automatically.
          </p>
          <NuxtLink
            to="/products/overview"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                   bg-sky-500 hover:bg-sky-400 transition-colors"
          >
            <Icon name="mdi:package-variant-closed" class="text-base" />
            Browse Products
          </NuxtLink>
        </div>

      </div>
    </div>
  </PatternSection>
</template>
