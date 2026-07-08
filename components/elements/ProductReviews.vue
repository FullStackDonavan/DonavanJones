<script setup lang="ts">
import type { IReview } from '~~/types/IReview'

const props = defineProps<{ productSlug: string }>()

const { data: reviews, pending } = await useFetch<IReview[]>(
  () => `/api/reviews/${props.productSlug}`
)

const average = computed(() => {
  if (!reviews.value?.length) return 0
  return reviews.value.reduce((sum, r) => sum + r.rating, 0) / reviews.value.length
})

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <div v-if="!pending && reviews?.length" class="max-w-7xl mx-auto px-6 py-14 border-t border-slate-200 dark:border-slate-800">
    <div class="flex items-center gap-4 mb-8">
      <h2 class="text-base font-bold text-slate-900 dark:text-white">Reviews</h2>
      <div class="flex items-center gap-2">
        <StarRating :model-value="average" readonly size="text-base" />
        <span class="text-sm text-slate-500 dark:text-slate-400">
          {{ average.toFixed(1) }} · {{ reviews.length }} review{{ reviews.length === 1 ? '' : 's' }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div
        v-for="review in reviews"
        :key="review.id"
        class="p-5 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60"
      >
        <div class="flex items-center justify-between mb-2">
          <StarRating :model-value="review.rating" readonly size="text-sm" />
          <span class="text-xs text-slate-400 dark:text-slate-500">{{ formatDate(review.createdAt) }}</span>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2">{{ review.body }}</p>
        <p class="text-xs font-medium text-slate-400 dark:text-slate-500">{{ review.authorName }}</p>
      </div>
    </div>
  </div>
</template>
