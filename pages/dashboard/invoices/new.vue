<script setup lang="ts">
import DashboardSidebar from "~~/components/elements/DashboardSidebar.vue";

definePageMeta({ middleware: ['auth', 'admin'] })

useSeoMeta({
  title: 'New Invoice — Donavan Jones',
  robots: 'noindex',
})

const router = useRouter()

const clientName = ref('')
const clientEmail = ref('')
const notes = ref('')
const dueDate = ref('')
const items = reactive([{ description: '', amount: '', quantity: 1 }])

const submitting = ref(false)
const errorMessage = ref('')

const totalCents = computed(() =>
  items.reduce((sum, i) => {
    const amount = Math.round(parseFloat(i.amount || '0') * 100)
    return sum + (isNaN(amount) ? 0 : amount) * (i.quantity || 1)
  }, 0)
)

function addItem() {
  items.push({ description: '', amount: '', quantity: 1 })
}

function removeItem(index: number) {
  if (items.length > 1) items.splice(index, 1)
}

async function submit() {
  errorMessage.value = ''

  if (!clientName.value.trim() || !clientEmail.value.trim()) {
    errorMessage.value = 'Client name and email are required'
    return
  }

  const cleanItems = items
    .filter(i => i.description.trim() && parseFloat(i.amount || '0') > 0)
    .map(i => ({
      description: i.description.trim(),
      amountCents: Math.round(parseFloat(i.amount) * 100),
      quantity: i.quantity || 1,
    }))

  if (!cleanItems.length) {
    errorMessage.value = 'Add at least one line item with a description and amount'
    return
  }

  submitting.value = true
  try {
    const invoice = await $fetch<{ id: number }>('/api/invoices', {
      method: 'POST',
      body: {
        clientName: clientName.value.trim(),
        clientEmail: clientEmail.value.trim(),
        notes: notes.value.trim(),
        dueDate: dueDate.value || null,
        items: cleanItems,
      },
    })
    router.push('/dashboard/invoices')
  } catch (err: any) {
    errorMessage.value = err?.data?.message || 'Could not create the invoice. Please try again.'
  } finally {
    submitting.value = false
  }
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}
</script>

<template>
  <PatternSection>
    <div class="min-h-screen px-6 py-12">
      <div class="max-w-6xl mx-auto">

        <div class="mb-10">
          <NuxtLink to="/dashboard/invoices" class="text-sm font-medium text-sky-500 hover:text-sky-400 flex items-center gap-1 mb-3">
            <Icon name="mdi:arrow-left" class="text-base" />
            Invoices
          </NuxtLink>
          <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">New Invoice</h1>
        </div>

        <div class="md:flex md:gap-10 items-start">
          <DashboardSidebar />

          <div class="flex-1 min-w-0 max-w-2xl space-y-6">

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  Client Name <span class="text-rose-400">*</span>
                </label>
                <input
                  v-model="clientName"
                  type="text"
                  placeholder="Jane Smith"
                  class="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700
                         bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                         placeholder-slate-400 dark:placeholder-slate-600
                         focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  Client Email <span class="text-rose-400">*</span>
                </label>
                <input
                  v-model="clientEmail"
                  type="email"
                  placeholder="jane@company.com"
                  class="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700
                         bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                         placeholder-slate-400 dark:placeholder-slate-600
                         focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30"
                />
              </div>
            </div>

            <!-- Line items -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide">
                Line Items
              </label>
              <div class="space-y-3">
                <div v-for="(item, i) in items" :key="i" class="flex items-start gap-2">
                  <input
                    v-model="item.description"
                    type="text"
                    placeholder="Description"
                    class="flex-1 px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700
                           bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                           placeholder-slate-400 dark:placeholder-slate-600
                           focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30"
                  />
                  <input
                    v-model.number="item.quantity"
                    type="number"
                    min="1"
                    placeholder="Qty"
                    class="w-16 px-3 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700
                           bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                           focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30"
                  />
                  <input
                    v-model="item.amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    class="w-28 px-3 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700
                           bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                           placeholder-slate-400 dark:placeholder-slate-600
                           focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30"
                  />
                  <button
                    type="button"
                    :disabled="items.length === 1"
                    class="p-2.5 rounded-xl text-slate-400 hover:text-rose-500 disabled:opacity-30 transition-colors"
                    @click="removeItem(i)"
                  >
                    <Icon name="mdi:trash-can-outline" class="text-base" />
                  </button>
                </div>
              </div>
              <button
                type="button"
                class="mt-3 flex items-center gap-1.5 text-sm font-medium text-sky-500 hover:text-sky-400"
                @click="addItem"
              >
                <Icon name="mdi:plus" class="text-base" />
                Add Line Item
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  Due Date
                </label>
                <input
                  v-model="dueDate"
                  type="date"
                  class="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700
                         bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                         focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30"
                />
                <p class="mt-1 text-xs text-slate-400 dark:text-slate-500">Defaults to 14 days if left blank.</p>
              </div>
              <div class="flex flex-col justify-end">
                <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Total</p>
                <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ formatCents(totalCents) }}</p>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                Notes (optional)
              </label>
              <textarea
                v-model="notes"
                rows="3"
                placeholder="Anything you want to appear on the invoice"
                class="w-full px-4 py-2.5 rounded-xl text-sm resize-none border border-slate-200 dark:border-slate-700
                       bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                       placeholder-slate-400 dark:placeholder-slate-600
                       focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30"
              />
            </div>

            <p v-if="errorMessage" class="text-sm text-rose-500">{{ errorMessage }}</p>

            <button
              type="button"
              :disabled="submitting"
              class="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-sky-500
                     hover:bg-sky-400 disabled:opacity-50 transition-colors"
              @click="submit"
            >
              <Icon v-if="submitting" name="mdi:loading" class="animate-spin text-base" />
              <Icon v-else name="mdi:send-outline" class="text-base" />
              {{ submitting ? 'Creating…' : 'Create & Send Invoice' }}
            </button>

          </div>
        </div>
      </div>
    </div>
  </PatternSection>
</template>
