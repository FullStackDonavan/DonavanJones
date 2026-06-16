<script setup lang="ts">
const props = withDefaults(defineProps<{
  buttonText: string
  supportingCopy: string
  destinationUrl?: string
  heading?: string
}>(), {
  destinationUrl: '/newsletter',
  heading: 'Join the newsletter',
})

const email = ref('')
const submitting = ref(false)
const submitted = ref(false)
const submitError = ref('')

async function submit() {
  submitting.value = true
  submitError.value = ''
  try {
    await $fetch('/api/newsletter', { method: 'POST', body: { email: email.value } })
    submitted.value = true
  } catch {
    submitError.value = 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div
    class="flex flex-col h-full rounded-2xl border border-violet-500/20 dark:border-violet-500/20
           bg-violet-50/60 dark:bg-violet-500/5 p-5 sm:p-6"
  >
    <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4
                bg-violet-500/10 border border-violet-500/20">
      <Icon name="mdi:email-outline" class="text-xl text-violet-400" />
    </div>

    <p class="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400 mb-2">
      {{ heading }}
    </p>
    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1 mb-4">
      {{ supportingCopy }}
    </p>

    <div v-if="submitted" class="flex items-center gap-2 text-sm text-emerald-500 font-medium">
      <Icon name="mdi:check-circle-outline" class="text-base" />
      You're in — thanks for subscribing.
    </div>

    <form v-else @submit.prevent="submit" class="flex flex-col gap-2">
      <input
        v-model="email"
        type="email"
        required
        placeholder="you@example.com"
        class="w-full px-4 py-2.5 rounded-xl text-sm
               border border-slate-200 dark:border-slate-700
               bg-white dark:bg-slate-800
               text-slate-900 dark:text-slate-100
               placeholder-slate-400 dark:placeholder-slate-600
               focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30
               transition-colors duration-150"
      />
      <button
        type="submit"
        :disabled="submitting"
        class="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl
               text-sm font-semibold bg-violet-500 text-white
               hover:bg-violet-600 disabled:opacity-60 disabled:cursor-not-allowed
               transition-colors duration-200"
      >
        <Icon v-if="submitting" name="mdi:loading" class="text-base animate-spin" />
        {{ submitting ? 'Subscribing…' : buttonText }}
      </button>
    </form>
    <p v-if="submitError" class="mt-2 text-xs text-rose-500">{{ submitError }}</p>
  </div>
</template>
