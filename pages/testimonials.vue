<script setup lang="ts">
const config = useRuntimeConfig()
const SITE = (config.public.appDomain as string) || 'https://donavanjones.com'

useSeoMeta({
  title: 'Client Testimonials — Donavan Jones',
  description: 'What clients say after working with Donavan Jones on custom software, AI automation, and infrastructure projects.',
  ogTitle: 'Client Testimonials — Donavan Jones',
  ogType: 'website',
  ogUrl: `${SITE}/testimonials`,
  canonical: `${SITE}/testimonials`,
})

interface ITestimonial {
  id: number
  rating: number
  body: string
  createdAt: string
  clientName: string
}

const { data: testimonials, pending } = await useFetch<ITestimonial[]>('/api/reviews/testimonials')

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}
</script>

<template>
  <PatternSection>
    <div class="max-w-5xl mx-auto px-6 py-16 sm:py-24">

      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5
                    bg-sky-500/10 border border-sky-500/20 text-sky-500 dark:text-sky-400 text-xs font-medium">
          <Icon name="mdi:star" class="text-sm" />
          Client Testimonials
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-5">
          What clients say
        </h1>
        <p class="max-w-xl mx-auto text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          Real feedback from people I've built projects for.
        </p>
      </div>

      <div v-if="pending" class="text-center py-16 text-slate-400">
        <Icon name="mdi:loading" class="text-3xl animate-spin" />
      </div>

      <div v-else-if="testimonials?.length" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          v-for="t in testimonials"
          :key="t.id"
          class="p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60"
        >
          <StarRating :model-value="t.rating" readonly size="text-base" />
          <p class="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ t.body }}</p>
          <p class="mt-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
            {{ t.clientName }} · {{ formatDate(t.createdAt) }}
          </p>
        </div>
      </div>

      <div v-else class="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700/50">
        <Icon name="mdi:star-outline" class="text-4xl text-slate-300 dark:text-slate-600 mb-3" />
        <p class="text-sm font-medium text-slate-600 dark:text-slate-300">No testimonials yet</p>
      </div>

      <div class="text-center mt-16">
        <NuxtLink
          to="/hire-me"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
                 bg-sky-500 text-white hover:bg-sky-600 transition-colors duration-200 shadow-lg shadow-sky-500/20"
        >
          <Icon name="mdi:email-outline" class="text-base" />
          Start a Conversation
        </NuxtLink>
      </div>

    </div>
  </PatternSection>
</template>
