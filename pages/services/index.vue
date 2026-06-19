<script setup lang="ts">
const config = useRuntimeConfig()
const SITE = (config.public.appDomain as string) || 'https://donavanjones.com'

useSeoMeta({
  title: 'Services — AI Automation & Custom Software',
  description:
    'AI automation, custom web applications, and business software for small businesses and startups. Built, deployed, and handed over — no platform lock-in.',
  ogTitle: 'Services — AI Automation & Custom Software | Donavan Jones',
  ogDescription:
    'AI lead capture, workflow automation, and custom SaaS development for small businesses. Production systems delivered end-to-end.',
  ogType: 'website',
  ogImage: `${SITE}/img/logo.png`,
  ogUrl: `${SITE}/services`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Services — Donavan Jones',
  twitterDescription: 'AI automation and custom software for small businesses.',
  canonical: `${SITE}/services`,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        '@id': `${SITE}/services`,
        name: 'Donavan Jones — AI & Software Services',
        url: `${SITE}/services`,
        description: 'AI automation, custom web applications, and business software for small businesses.',
        provider: { '@id': `${SITE}/#person` },
        areaServed: [
          { '@type': 'State', name: 'Florida' },
          { '@type': 'Country', name: 'United States' },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Services',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Automation for Business', url: `${SITE}/services/ai-automation` } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Custom Web & SaaS Development', url: `${SITE}/services/web-development` } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Local Business AI Tools', url: `${SITE}/services/local-business-ai` } },
          ],
        },
      }),
    },
  ],
})

const services = [
  {
    icon: 'mdi:robot-outline',
    color: 'sky',
    title: 'AI Automation for Business',
    desc: 'AI lead capture, after-hours agents, and workflow automation. Stop losing leads — let AI handle calls, bookings, and follow-ups 24/7.',
    to: '/services/ai-automation',
    tags: ['Lead Capture', 'AI Agents', 'Workflow Automation'],
  },
  {
    icon: 'mdi:code-braces',
    color: 'purple',
    title: 'Custom Web & SaaS Development',
    desc: 'Full-stack web applications, multi-role dashboards, SaaS platforms with billing and auth — built from scratch and handed over.',
    to: '/services/web-development',
    tags: ['SaaS', 'Dashboards', 'APIs', 'Payments'],
  },
  {
    icon: 'mdi:store-outline',
    color: 'amber',
    title: 'Local Business AI Tools',
    desc: 'AI-powered systems built specifically for service businesses in Central Florida — roofing, HVAC, law firms, med spas, and more.',
    to: '/services/local-business-ai',
    tags: ['Central Florida', 'Local SEO', 'AI Chatbots'],
  },
]
</script>

<template>
  <PatternSection>

    <!-- Hero -->
    <section class="w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">

        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium">
          <span class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
          Available for new projects
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
          AI automation &amp; custom software<br class="hidden sm:block" />
          <span class="text-sky-500">built for your business</span>
        </h1>

        <p class="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
          I build production systems that save you time and generate revenue — AI lead capture,
          workflow automation, custom web apps, and SaaS platforms. Built, deployed, and handed over.
          No platform lock-in.
        </p>

        <div class="flex flex-wrap justify-center gap-3">
          <NuxtLink
            to="/hire-me#contact"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-sky-500 text-white hover:bg-sky-600 transition-colors duration-200 shadow-lg shadow-sky-500/20"
          >
            <Icon name="mdi:email-outline" class="text-base" />
            Request a Quote
          </NuxtLink>
          <NuxtLink
            to="/projects/overview"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-500/40 hover:text-sky-500 transition-colors duration-200"
          >
            <Icon name="mdi:briefcase-outline" class="text-base" />
            View Case Studies
          </NuxtLink>
        </div>

      </div>
    </section>

    <!-- Service Cards -->
    <section class="bg-slate-50 dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">

        <div class="grid md:grid-cols-3 gap-5">
          <NuxtLink
            v-for="s in services"
            :key="s.title"
            :to="s.to"
            class="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 overflow-hidden hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-200"
          >
            <!-- Chrome header -->
            <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <div class="flex gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
              </div>
              <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">service.details</span>
            </div>

            <div class="p-5 flex flex-col flex-1">
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center border mb-4"
                :class="{
                  'bg-sky-500/10 border-sky-500/20':     s.color === 'sky',
                  'bg-purple-500/10 border-purple-500/20': s.color === 'purple',
                  'bg-amber-500/10 border-amber-500/20': s.color === 'amber',
                }"
              >
                <Icon :name="s.icon" class="text-xl"
                  :class="{
                    'text-sky-400':    s.color === 'sky',
                    'text-purple-400': s.color === 'purple',
                    'text-amber-400':  s.color === 'amber',
                  }"
                />
              </div>

              <h2 class="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-sky-400 transition-colors">
                {{ s.title }}
              </h2>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1 mb-4">
                {{ s.desc }}
              </p>

              <div class="flex flex-wrap gap-1.5 mb-4">
                <span
                  v-for="tag in s.tags"
                  :key="tag"
                  class="text-[10px] px-2 py-0.5 rounded border bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/50"
                >{{ tag }}</span>
              </div>

              <div class="flex items-center gap-1 text-xs font-medium text-sky-500 group-hover:gap-2 transition-all">
                Learn more <Icon name="mdi:arrow-right" class="text-sm" />
              </div>
            </div>
          </NuxtLink>
        </div>

      </div>
    </section>

    <!-- Trust Block (compact) -->
    <TrustBlock variant="full" />

    <!-- Pricing Hints -->
    <section class="bg-slate-50 dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-5xl mx-auto px-6">

        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Typical Investment</h2>
          <p class="text-slate-500 dark:text-slate-400">Transparent pricing — you'll get a firm number before any work starts.</p>
        </div>

        <div class="grid sm:grid-cols-3 gap-4">
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-6 text-center">
            <p class="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">Focused Tool</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">$3K–$8K</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Single workflow, AI chatbot, or lead capture system</p>
          </div>
          <div class="rounded-2xl border border-sky-500/30 bg-sky-500/5 p-6 text-center">
            <p class="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">Full System</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">$10K–$20K</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Multi-workflow automation with CRM, dashboards, and integrations</p>
          </div>
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-6 text-center">
            <p class="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">Enterprise Platform</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">$20K+</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Full SaaS with billing, multi-role access, and custom AI pipeline</p>
          </div>
        </div>

      </div>
    </section>

    <!-- CTA -->
    <section class="bg-white dark:bg-slate-950 py-16">
      <div class="max-w-7xl mx-auto px-6">
        <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-8 sm:p-12 text-center">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Ready to talk about your project?
          </h2>
          <p class="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed mb-8">
            Tell me what you're trying to build. I'll follow up within one business day with a plain-English proposal.
          </p>
          <NuxtLink
            to="/hire-me#contact"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-sky-500 text-white hover:bg-sky-600 transition-colors duration-200 shadow-lg shadow-sky-500/20"
          >
            <Icon name="mdi:email-outline" class="text-base" />
            Request a Quote
          </NuxtLink>
        </div>
      </div>
    </section>

  </PatternSection>
</template>
