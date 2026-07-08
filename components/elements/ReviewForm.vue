<script setup lang="ts">
import type { IReview } from '~~/types/IReview'

interface Props {
  productSlug: string
  existingReview?: IReview | null
}

const props = defineProps<Props>()
const emit = defineEmits<{ saved: [review: IReview] }>()

const expanded = ref(false)
const rating = ref(props.existingReview?.rating ?? 0)
const body = ref(props.existingReview?.body ?? '')
const saving = ref(false)
const errorMessage = ref('')

async function submit() {
  if (rating.value < 1) {
    errorMessage.value = 'Pick a star rating first'
    return
  }
  if (!body.value.trim()) {
    errorMessage.value = 'Write a few words about it'
    return
  }

  saving.value = true
  errorMessage.value = ''

  try {
    const review = await $fetch<IReview>('/api/reviews', {
      method: 'POST',
      body: { productSlug: props.productSlug, rating: rating.value, body: body.value.trim() },
    })
    emit('saved', review)
    expanded.value = false
  } catch (err: any) {
    errorMessage.value = err?.data?.message || 'Could not save your review'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <button
      v-if="!expanded"
      type="button"
      class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border
             border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300
             hover:border-amber-400/50 hover:text-amber-500 transition-colors"
      @click="expanded = true"
    >
      <Icon name="mdi:star-outline" class="text-sm" />
      {{ existingReview ? 'Edit your review' : 'Write a review' }}
    </button>

    <div
      v-else
      class="mt-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60"
    >
      <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Your rating</p>
      <StarRating v-model="rating" size="text-2xl" />

      <textarea
        v-model="body"
        rows="3"
        placeholder="What did you use it for? What worked, what didn't?"
        class="mt-3 block w-full p-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700
               bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100
               placeholder:text-slate-400 focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
      />

      <p v-if="errorMessage" class="mt-2 text-xs text-red-500">{{ errorMessage }}</p>

      <div class="mt-3 flex items-center gap-2">
        <button
          type="button"
          :disabled="saving"
          class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-400
                 disabled:opacity-50 transition-colors"
          @click="submit"
        >
          {{ saving ? 'Saving…' : 'Submit review' }}
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400
                 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          @click="expanded = false"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
