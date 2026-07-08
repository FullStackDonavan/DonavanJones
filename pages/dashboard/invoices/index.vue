<script setup lang="ts">
import DashboardSidebar from "~~/components/elements/DashboardSidebar.vue";

definePageMeta({ middleware: ['auth', 'admin'] })

useSeoMeta({
  title: 'Invoices — Donavan Jones',
  robots: 'noindex',
})

interface IInvoiceItem {
  id: number
  description: string
  amountCents: number
  quantity: number
}

interface IInvoice {
  id: number
  clientName: string
  clientEmail: string
  totalCents: number
  status: string
  dueDate: string | null
  hostedInvoiceUrl: string | null
  reviewToken: string
  review: { id: number } | null
  createdAt: string
  items: IInvoiceItem[]
}

const config = useRuntimeConfig()
const siteUrl = (config.public.appDomain as string) || 'https://donavanjones.com'

const cookieHeaders = useRequestHeaders(['cookie'])
const { data: invoices, pending } = await useFetch<IInvoice[]>('/api/invoices', {
  headers: cookieHeaders as HeadersInit,
})

const copiedId = ref<number | null>(null)
const copiedReviewId = ref<number | null>(null)

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function statusClasses(status: string): string {
  switch (status) {
    case 'paid': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
    case 'void': return 'bg-slate-500/10 text-slate-500 border-slate-500/30'
    case 'uncollectible': return 'bg-red-500/10 text-red-500 border-red-500/30'
    default: return 'bg-amber-500/10 text-amber-500 border-amber-500/30'
  }
}

async function copyLink(invoice: IInvoice) {
  if (!invoice.hostedInvoiceUrl) return
  await navigator.clipboard.writeText(invoice.hostedInvoiceUrl)
  copiedId.value = invoice.id
  setTimeout(() => { copiedId.value = null }, 1500)
}

async function copyReviewLink(invoice: IInvoice) {
  await navigator.clipboard.writeText(`${siteUrl}/review/${invoice.reviewToken}`)
  copiedReviewId.value = invoice.id
  setTimeout(() => { copiedReviewId.value = null }, 1500)
}
</script>

<template>
  <PatternSection>
    <div class="min-h-screen px-6 py-12">
      <div class="max-w-6xl mx-auto">

        <div class="mb-10 flex items-center justify-between">
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Invoices</h1>
            <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Bill clients and get paid through Stripe.</p>
          </div>
          <NuxtLink
            to="/dashboard/invoices/new"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                   bg-sky-500 hover:bg-sky-400 transition-colors"
          >
            <Icon name="mdi:plus" class="text-base" />
            New Invoice
          </NuxtLink>
        </div>

        <div class="md:flex md:gap-10 items-start">
          <DashboardSidebar />

          <div class="flex-1 min-w-0">
            <div v-if="pending" class="text-center py-16 text-slate-400">
              <Icon name="mdi:loading" class="text-3xl animate-spin" />
            </div>

            <div v-else-if="invoices?.length" class="space-y-4">
              <div
                v-for="invoice in invoices"
                :key="invoice.id"
                class="p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60"
              >
                <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ invoice.clientName }}</p>
                      <span
                        class="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border"
                        :class="statusClasses(invoice.status)"
                      >
                        {{ invoice.status }}
                      </span>
                    </div>
                    <p class="text-xs text-slate-400 dark:text-slate-500">
                      {{ invoice.clientEmail }} · Created {{ formatDate(invoice.createdAt) }}
                      <template v-if="invoice.dueDate"> · Due {{ formatDate(invoice.dueDate) }}</template>
                    </p>
                  </div>
                  <div class="flex items-center gap-3 flex-shrink-0">
                    <span class="text-base font-bold text-slate-900 dark:text-white">{{ formatCents(invoice.totalCents) }}</span>
                    <button
                      v-if="invoice.status === 'paid'"
                      type="button"
                      class="px-3 py-2 rounded-xl text-xs font-semibold border transition-colors"
                      :class="invoice.review
                        ? 'border-emerald-500/30 text-emerald-500'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-400/50 hover:text-amber-500'"
                      :title="invoice.review ? 'Client left a review' : 'Copy review link'"
                      @click="copyReviewLink(invoice)"
                    >
                      <Icon
                        :name="invoice.review ? 'mdi:star' : (copiedReviewId === invoice.id ? 'mdi:check' : 'mdi:star-outline')"
                        class="text-sm"
                      />
                    </button>
                    <button
                      v-if="invoice.hostedInvoiceUrl"
                      type="button"
                      class="px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700
                             text-slate-600 dark:text-slate-300 hover:border-sky-500/40 hover:text-sky-500 transition-colors"
                      @click="copyLink(invoice)"
                    >
                      <Icon :name="copiedId === invoice.id ? 'mdi:check' : 'mdi:link-variant'" class="text-sm" />
                    </button>
                    <a
                      v-if="invoice.hostedInvoiceUrl"
                      :href="invoice.hostedInvoiceUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white
                             bg-sky-500 hover:bg-sky-400 transition-colors"
                    >
                      View
                      <Icon name="mdi:open-in-new" class="text-sm" />
                    </a>
                  </div>
                </div>

                <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-x-4 gap-y-1">
                  <span v-for="item in invoice.items" :key="item.id" class="text-xs text-slate-400 dark:text-slate-500">
                    {{ item.description }}{{ item.quantity > 1 ? ` (x${item.quantity})` : '' }} — {{ formatCents(item.amountCents * item.quantity) }}
                  </span>
                </div>
              </div>
            </div>

            <div
              v-else
              class="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700/50"
            >
              <Icon name="mdi:receipt-text-outline" class="text-4xl text-slate-300 dark:text-slate-600 mb-3" />
              <p class="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">No invoices yet</p>
              <p class="text-xs text-slate-400 dark:text-slate-500 mb-6">Create your first invoice to bill a client.</p>
              <NuxtLink
                to="/dashboard/invoices/new"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                       bg-sky-500 hover:bg-sky-400 transition-colors"
              >
                <Icon name="mdi:plus" class="text-base" />
                New Invoice
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PatternSection>
</template>
