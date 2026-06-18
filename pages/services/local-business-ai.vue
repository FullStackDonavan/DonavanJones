<script setup lang="ts">
const config = useRuntimeConfig()
const SITE = (config.public.appDomain as string) || 'https://donavanjones.com'

useSeoMeta({
  title: 'AI Tools for Local Businesses in Central Florida',
  description:
    'AI-powered lead capture, chatbots, and workflow automation built for local service businesses in Lakeland, Tampa, and Central Florida. Custom systems — no platform lock-in.',
  ogTitle: 'AI Tools for Local Businesses | Donavan Jones — Lakeland, FL',
  ogDescription:
    'AI automation for roofing, HVAC, law firms, med spas, and more. Custom-built systems for local businesses in Central Florida.',
  ogType: 'website',
  ogImage: `${SITE}/img/logo.png`,
  ogUrl: `${SITE}/services/local-business-ai`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'AI for Local Businesses — Central Florida | Donavan Jones',
  twitterDescription: 'AI lead capture and automation for local service businesses in Lakeland and Central Florida.',
  canonical: `${SITE}/services/local-business-ai`,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${SITE}/services/local-business-ai`,
        name: 'AI Tools for Local Businesses',
        description: 'AI-powered lead capture, chatbots, and workflow automation for local service businesses in Central Florida.',
        provider: { '@id': `${SITE}/#person` },
        areaServed: [
          { '@type': 'City', name: 'Lakeland', containedInPlace: { '@type': 'State', name: 'Florida' } },
          { '@type': 'City', name: 'Tampa', containedInPlace: { '@type': 'State', name: 'Florida' } },
          { '@type': 'City', name: 'Orlando', containedInPlace: { '@type': 'State', name: 'Florida' } },
          { '@type': 'State', name: 'Florida' },
        ],
        serviceType: 'AI Automation for Local Businesses',
      }),
    },
  ],
})

const industries = [
  {
    icon: 'mdi:home-roof',
    title: 'Roofing & Contractors',
    desc: 'AI answers after-hours calls, captures storm damage leads, and auto-sends follow-up quotes. No more lost callbacks.',
  },
  {
    icon: 'mdi:air-conditioner',
    title: 'HVAC & Plumbing',
    desc: 'Emergency call routing, automated service reminders, and review request sequences that run without your team lifting a finger.',
  },
  {
    icon: 'mdi:scale-balance',
    title: 'Law Firms',
    desc: 'AI intake assistant that collects case details, qualifies leads, and books consultations — 24/7, even when your office is closed.',
  },
  {
    icon: 'mdi:spa-outline',
    title: 'Med Spas & Dental',
    desc: 'Website chatbot that answers treatment questions, pushes visitors to book, and syncs with your scheduling system automatically.',
  },
  {
    icon: 'mdi:shield-account',
    title: 'Insurance Brokers',
    desc: 'Enrollment automation, document generation with digital signatures, and multi-role dashboards that replace spreadsheet chaos.',
  },
  {
    icon: 'mdi:home-city-outline',
    title: 'Real Estate',
    desc: 'AI lead capture from property listings, automated showing scheduling, and follow-up email sequences that keep buyers engaged.',
  },
]

const insights = [
  { title: 'Why Lakeland Startups Should Consider AI Automation', to: '/insights/01-why-lakeland-startups-should-consider-ai-automation' },
  { title: 'AI Opportunities for Small Businesses in Lakeland', to: '/insights/04-ai-opportunities-for-small-businesses-in-lakeland' },
  { title: 'Building Custom Business Software in Central Florida', to: '/insights/03-building-custom-business-software-in-central-florida' },
  { title: 'Hiring a Software Developer in Lakeland', to: '/insights/02-hiring-a-software-developer-in-lakeland' },
  { title: 'When Your Lakeland Business Has Outgrown Its Software', to: '/insights/05-when-your-lakeland-business-has-outgrown-its-software' },
]

const outcomes = [
  { icon: 'mdi:phone-missed', text: 'Stop losing leads after hours' },
  { icon: 'mdi:chat-processing-outline', text: '24/7 AI sales assistant' },
  { icon: 'mdi:cog-sync-outline', text: 'Admin & follow-ups automated' },
  { icon: 'mdi:account-off-outline', text: 'No extra staff needed' },
]
</script>

<template>
  <PatternSection>

    <!-- Hero -->
    <section class="w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">

        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-medium">
          <Icon name="mdi:map-marker-outline" class="text-sm" />
          Central Florida
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
          AI-powered systems for<br class="hidden sm:block" />
          <span class="text-amber-500">Central Florida businesses</span>
        </h1>

        <p class="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
          I build AI lead capture systems, after-hours agents, and workflow automation for service businesses
          in Lakeland, Tampa, Orlando, and across Central Florida. You get the system built and handed over —
          no platform subscriptions.
        </p>

        <div class="flex flex-wrap justify-center gap-3">
          <NuxtLink
            to="/hire-me#contact"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors duration-200 shadow-lg shadow-amber-500/20"
          >
            <Icon name="mdi:email-outline" class="text-base" />
            Request a Quote
          </NuxtLink>
          <NuxtLink
            to="/services/ai-automation"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-500/40 hover:text-amber-500 transition-colors duration-200"
          >
            <Icon name="mdi:robot-outline" class="text-base" />
            See AI Services
          </NuxtLink>
        </div>

      </div>
    </section>

    <!-- Outcomes grid -->
    <section class="bg-slate-50 dark:bg-slate-950 py-12 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-5xl mx-auto px-6">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            v-for="outcome in outcomes"
            :key="outcome.text"
            class="flex items-start gap-3 p-4 rounded-xl border border-amber-500/15 bg-white dark:bg-slate-900/60"
          >
            <Icon :name="outcome.icon" class="text-amber-400 text-lg flex-shrink-0 mt-0.5" />
            <span class="text-sm text-slate-600 dark:text-slate-400 leading-snug">{{ outcome.text }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Industry sections -->
    <section class="bg-white dark:bg-slate-900/30 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">

        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Built for your industry</h2>
          <p class="text-slate-500 dark:text-slate-400">AI systems tailored to how your specific business works.</p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="ind in industries"
            :key="ind.title"
            class="rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 flex flex-col gap-3 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-200"
          >
            <div class="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Icon :name="ind.icon" class="text-amber-400 text-xl" />
            </div>
            <div>
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white">{{ ind.title }}</h3>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ ind.desc }}</p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Local proof -->
    <section class="bg-slate-50 dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-5xl mx-auto px-6">

        <div class="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-7 sm:p-10">
          <div class="flex flex-col lg:flex-row lg:items-center gap-8">
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Based in Florida. Building for Florida businesses.
              </h2>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                I'm not an agency pitching from across the country. I'm a local engineer who built a production
                enrollment platform for Amerus Financial Group (92 businesses, Lakeland-based), and I'm applying
                the same approach to AI automation for local service businesses.
              </p>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                You get someone who understands your business model, builds the system from scratch, and
                hands it over — with training and support after launch.
              </p>
            </div>
            <div class="flex-shrink-0">
              <img
                src="/img/Amerus-Logo.png"
                alt="Amerus Financial Group"
                class="h-16 object-contain opacity-70"
              />
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Related Insights -->
    <section class="bg-white dark:bg-slate-900/30 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-5xl mx-auto px-6">

        <div class="mb-8">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Local Business Insights</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">Articles on AI, automation, and software for Central Florida businesses.</p>
        </div>

        <div class="space-y-2">
          <NuxtLink
            v-for="insight in insights"
            :key="insight.to"
            :to="insight.to"
            class="group flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 hover:border-amber-500/40 transition-all duration-200"
          >
            <Icon name="mdi:text-box-outline" class="text-amber-400 text-lg flex-shrink-0" />
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-amber-500 transition-colors flex-1">
              {{ insight.title }}
            </span>
            <Icon name="mdi:arrow-right" class="text-slate-300 dark:text-slate-600 group-hover:text-amber-500 text-sm transition-colors" />
          </NuxtLink>
        </div>

      </div>
    </section>

    <!-- Pricing Hints -->
    <section class="bg-white dark:bg-slate-900/30 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-5xl mx-auto px-6">

        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Typical Investment</h2>
          <p class="text-slate-500 dark:text-slate-400">Transparent pricing — you'll get a firm number before any work starts.</p>
        </div>

        <div class="grid sm:grid-cols-3 gap-4">
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 p-6 text-center">
            <p class="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Focused Tool</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">$3K–$8K</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Single AI chatbot, lead capture, or automation workflow</p>
          </div>
          <div class="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 text-center">
            <p class="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Full System</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">$10K–$20K</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Multi-workflow automation with CRM, dashboards, and integrations</p>
          </div>
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 p-6 text-center">
            <p class="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Custom Platform</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">$20K+</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Full SaaS with billing, multi-role access, and AI pipeline</p>
          </div>
        </div>

      </div>
    </section>

    <!-- CTA -->
    <section class="bg-slate-50 dark:bg-slate-950 py-16">
      <div class="max-w-7xl mx-auto px-6">
        <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-8 sm:p-12 text-center">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Let's build your AI system
          </h2>
          <p class="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed mb-8">
            Describe your business and what you're trying to automate. I'll follow up within one business day.
          </p>
          <NuxtLink
            to="/hire-me#contact"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors duration-200 shadow-lg shadow-amber-500/20"
          >
            <Icon name="mdi:email-outline" class="text-base" />
            Request a Quote
          </NuxtLink>
        </div>
      </div>
    </section>

  </PatternSection>
</template>
