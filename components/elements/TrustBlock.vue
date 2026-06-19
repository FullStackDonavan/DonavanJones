<script setup lang="ts">
const config = useRuntimeConfig()
const SITE = (config.public.appDomain as string) || 'https://donavanjones.com'

const props = withDefaults(defineProps<{
  variant?: 'full' | 'compact'
}>(), {
  variant: 'full',
})

const testimonials = [
  {
    id: 1,
    quote: 'Donavan built our entire enrollment platform from scratch. A process that used to take hours of back-and-forth emails now takes minutes. He handled everything — the database, the dashboards, deployment — and trained our team to use it.',
    name: 'Tim Baggett',
    company: 'Amerus Financial Group',
    role: 'Director of Operations',
    avatar: null as string | null,
    rating: 5,
  },
  {
    id: 2,
    quote: 'We needed someone who could take a vague business idea and turn it into working software. Donavan asked the right questions, translated what we needed into a real plan, and delivered exactly what he said he would.',
    name: 'Vance Touchton',
    company: 'Good Time Travel',
    role: 'Owner',
    avatar: null as string | null,
    rating: 5,
  },
  {
    id: 3,
    quote: 'What impressed me most was how he explained complex technical decisions in plain English. We\'re not a tech company — we needed someone who could bridge that gap without talking over our heads.',
    name: 'Geno Yauchler',
    company: 'Florida Water Analysis',
    role: 'President',
    avatar: null as string | null,
    rating: 5,
  },
]

const markers = [
  { icon: 'mdi:calendar-clock', text: '20+ Years Building Software' },
  { icon: 'mdi:account-group-outline', text: 'Worked with Non-Technical Teams' },
  { icon: 'mdi:domain', text: '92 Businesses Automated' },
  { icon: 'mdi:kubernetes', text: 'Production AI Systems on Kubernetes' },
]

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase()
}

useHead({
  script: [
    ...(props.variant === 'full'
      ? [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              '@id': `${SITE}/#organization`,
              name: 'Donavan Jones',
              url: SITE,
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '5',
                reviewCount: '3',
                bestRating: '5',
                worstRating: '1',
              },
              review: testimonials.map((t) => ({
                '@type': 'Review',
                author: {
                  '@type': 'Person',
                  name: t.name,
                },
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: t.rating,
                  bestRating: 5,
                  worstRating: 1,
                },
                reviewBody: t.quote,
                publisher: {
                  '@type': 'Organization',
                  name: t.company,
                },
              })),
            }),
          },
        ]
      : []),
  ],
})
</script>

<template>
  <section class="bg-white dark:bg-slate-900/30 py-14 border-b border-slate-200 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-6">

      <!-- Section header -->
      <div class="mb-10 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <Icon name="mdi:shield-check-outline" class="text-sm" />
          Trusted by Real Businesses
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          What clients say
        </h2>
        <div class="flex items-center justify-center gap-1 mt-3">
          <Icon v-for="i in 5" :key="i" name="mdi:star" class="text-amber-400 text-lg" />
          <span class="text-sm text-slate-500 dark:text-slate-400 ml-2">5.0 from {{ testimonials.length }} reviews</span>
        </div>
      </div>

      <!-- Review cards (full variant) -->
      <div v-if="props.variant === 'full'" class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        <div
          v-for="review in testimonials"
          :key="review.id"
          class="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden"
        >
          <!-- Chrome header -->
          <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="flex gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
              </div>
              <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">review.md</span>
            </div>
            <div class="flex items-center gap-0.5">
              <Icon v-for="i in review.rating" :key="i" name="mdi:star" class="text-amber-400 text-xs" />
            </div>
          </div>

          <!-- Quote -->
          <div class="p-5 flex-1 flex flex-col">
            <Icon name="mdi:format-quote-open" class="text-sky-400/20 dark:text-sky-400/10 text-3xl mb-2" />
            <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
              "{{ review.quote }}"
            </p>
          </div>

          <!-- Reviewer -->
          <div class="px-5 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <img
              v-if="review.avatar"
              :src="review.avatar"
              :alt="review.name"
              class="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
            />
            <div
              v-else
              class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold bg-sky-500/10 text-sky-500 border border-sky-500/20 flex-shrink-0"
            >
              {{ initials(review.name) }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-slate-900 dark:text-white truncate">{{ review.name }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ review.role }}, {{ review.company }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Credibility markers -->
      <div class="flex flex-wrap justify-center gap-3">
        <span
          v-for="marker in markers"
          :key="marker.text"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 text-xs font-medium text-slate-600 dark:text-slate-400"
        >
          <Icon :name="marker.icon" class="text-sky-400 text-sm" />
          {{ marker.text }}
        </span>
      </div>

    </div>
  </section>
</template>
