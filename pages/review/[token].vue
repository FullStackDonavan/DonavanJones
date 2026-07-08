<script setup lang="ts">
const route = useRoute()
const token = route.params.token as string

useSeoMeta({ title: 'Leave a Review — Donavan Jones', robots: 'noindex' })

interface IReviewData {
  clientName: string
  totalCents: number
  items: { description: string; amountCents: number; quantity: number }[]
  existingReview: { rating: number; body: string } | null
}

const { data, error } = await useFetch<IReviewData>(`/api/invoices/review/${token}`)

const rating = ref(data.value?.existingReview?.rating ?? 0)
const body = ref(data.value?.existingReview?.body ?? '')
const submitting = ref(false)
const submitted = ref(false)
const errorMessage = ref('')

async function submit() {
  if (rating.value < 1) {
    errorMessage.value = 'Pick a star rating first'
    return
  }
  if (!body.value.trim()) {
    errorMessage.value = 'Write a few words first'
    return
  }

  submitting.value = true
  errorMessage.value = ''

  try {
    await $fetch(`/api/invoices/review/${token}`, {
      method: 'POST',
      body: { rating: rating.value, body: body.value.trim() },
    })
    submitted.value = true
  } catch (err: any) {
    errorMessage.value = err?.data?.message || 'Could not submit your review'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <PatternSection>
    <div class="min-h-screen px-6 py-16 flex items-center justify-center">
      <div class="max-w-lg w-full">

        <!-- Not found / not paid -->
        <div
          v-if="error"
          class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-8 text-center"
        >
          <Icon name="mdi:alert-circle-outline" class="text-amber-400 text-4xl mb-3" />
          <h1 class="text-lg font-bold text-slate-900 dark:text-white mb-1">
            {{ error.statusCode === 404 ? 'Review link not found' : 'Not available yet' }}
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            {{ error.statusCode === 404
              ? "This link doesn't match an invoice."
              : "This invoice hasn't been marked as paid yet." }}
          </p>
        </div>

        <!-- Success -->
        <div
          v-else-if="submitted"
          class="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-10 text-center"
        >
          <Icon name="mdi:check-circle-outline" class="text-emerald-400 text-4xl mb-3" />
          <h1 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Thank you!</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">Your review means a lot — really appreciate it.</p>
        </div>

        <!-- Form -->
        <div v-else>
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              Hi {{ data?.clientName }}, how'd it go?
            </h1>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              A quick review helps other clients know what to expect working with me.
            </p>
          </div>

          <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-6 sm:p-8">
            <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Your rating</p>
            <StarRating v-model="rating" size="text-3xl" />

            <textarea
              v-model="body"
              rows="4"
              placeholder="What was the project, and how did it go?"
              class="mt-5 block w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700
                     bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100
                     placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500/30 focus:border-sky-500"
            />

            <p v-if="errorMessage" class="mt-2 text-sm text-rose-500">{{ errorMessage }}</p>

            <button
              type="button"
              :disabled="submitting"
              class="mt-5 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                     font-semibold text-sm text-white bg-sky-500 hover:bg-sky-400
                     disabled:opacity-50 transition-colors"
              @click="submit"
            >
              <Icon v-if="submitting" name="mdi:loading" class="animate-spin text-base" />
              {{ submitting ? 'Submitting…' : (data?.existingReview ? 'Update Review' : 'Submit Review') }}
            </button>
          </div>
        </div>

      </div>
    </div>
  </PatternSection>
</template>
