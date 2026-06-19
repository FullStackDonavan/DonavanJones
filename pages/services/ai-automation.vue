<script setup lang="ts">
const config = useRuntimeConfig()
const SITE = (config.public.appDomain as string) || 'https://donavanjones.com'

useSeoMeta({
  title: 'AI Automation for Small Businesses',
  description:
    'AI lead capture, after-hours agents, and workflow automation for small businesses. Stop losing leads — get a system built, connected, and handed over. No platform lock-in.',
  ogTitle: 'AI Automation for Small Businesses | Donavan Jones',
  ogDescription:
    'AI lead capture systems, after-hours agents, and workflow automation. Built for local service businesses — roofing, HVAC, law firms, med spas, and more.',
  ogType: 'website',
  ogImage: `${SITE}/img/logo.png`,
  ogUrl: `${SITE}/services/ai-automation`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'AI Automation for Small Businesses | Donavan Jones',
  twitterDescription: 'AI lead capture, after-hours agents, and workflow automation. Built and handed over.',
  canonical: `${SITE}/services/ai-automation`,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${SITE}/services/ai-automation`,
        name: 'AI Automation for Small Businesses',
        description: 'AI lead capture, after-hours agents, and workflow automation for small businesses.',
        provider: { '@id': `${SITE}/#person` },
        areaServed: [
          { '@type': 'City', name: 'Lakeland', containedInPlace: { '@type': 'State', name: 'Florida' } },
          { '@type': 'State', name: 'Florida' },
          { '@type': 'Country', name: 'United States' },
        ],
        serviceType: 'AI Automation',
      }),
    },
  ],
})

const services = [
  {
    icon: 'mdi:phone-missed',
    color: 'sky',
    title: 'AI Lead Capture & After-Hours Agent',
    description: 'Stop losing leads when you\'re unavailable. AI answers missed calls, collects the caller\'s name, number, and what they need — then books the appointment and texts you a summary automatically.',
    examples: ['Missed call AI response', 'Automated appointment booking', 'Lead info collection', 'SMS summary to owner'],
  },
  {
    icon: 'mdi:chat-processing-outline',
    color: 'emerald',
    title: 'AI Website Chat That Converts',
    description: 'Replace your dead contact form with a 24/7 AI sales assistant. It answers pricing questions, qualifies leads, and pushes visitors toward booking — integrated with your email, calendar, or CRM.',
    examples: ['Pricing & FAQ answers', 'Lead qualification', 'Booking & scheduling', 'Email / CRM integration'],
  },
  {
    icon: 'mdi:cog-sync-outline',
    color: 'violet',
    title: 'Admin & Workflow Automation',
    description: 'Automate the back-office tasks eating your team\'s time — quote generation, intake form processing, follow-up emails, review requests — all running without manual input.',
    examples: ['Quote & invoice generation', 'Intake form → CRM pipeline', 'Automated follow-up emails', 'Google review requests'],
  },
]

const niches = [
  { icon: 'mdi:home-roof', label: 'Roofing & Contractors' },
  { icon: 'mdi:air-conditioner', label: 'HVAC & Plumbing' },
  { icon: 'mdi:scale-balance', label: 'Law Firms' },
  { icon: 'mdi:spa-outline', label: 'Med Spas & Dental' },
  { icon: 'mdi:shield-account', label: 'Insurance Brokers' },
  { icon: 'mdi:home-city-outline', label: 'Real Estate' },
]

const beforeAfter = [
  { before: 'Missed calls go to voicemail', after: 'AI captures every lead 24/7' },
  { before: 'Contact forms sit unread', after: 'AI qualifies and books automatically' },
  { before: 'Follow-ups depend on memory', after: 'Automated sequences run on schedule' },
  { before: 'Admin tasks eat your day', after: 'Quotes, intake, reviews — all automated' },
]

const faqs = [
  {
    q: 'What does an AI automation project typically cost?',
    a: 'Small tools and single-workflow automations usually start around $3,000–$8,000. More complex systems with multiple integrations, custom dashboards, or CRM connections typically run $10,000–$20,000+. I\'ll give you a firm number before any work starts.',
  },
  {
    q: 'How long does it take to build?',
    a: 'A focused AI lead capture or chatbot system takes 3–6 weeks. More complex automation with multiple workflows and integrations typically takes 2–3 months. Timeline depends on scope — I\'ll be specific in the proposal.',
  },
  {
    q: 'Do I need to be technical to use it?',
    a: 'Not at all. I build it, deploy it, connect it to your existing phone number, website, or calendar, and hand it over working. I\'ll walk you through how it works and stay available after launch.',
  },
  {
    q: 'Will I own the system?',
    a: 'Yes. Everything built for your project is yours. You get the source code, the hosting setup, and complete control. I\'m not a rental — I hand it over.',
  },
  {
    q: 'What if I already have a CRM or website?',
    a: 'I integrate with what you already use — GoHighLevel, HubSpot, Calendly, Google Calendar, your existing website, whatever you\'ve got. No need to switch platforms.',
  },
]
</script>

<template>
  <PatternSection>

    <!-- Hero -->
    <section class="w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">

        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium">
          <Icon name="mdi:robot-outline" class="text-sm" />
          AI Automation
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
          Stop losing leads.<br class="hidden sm:block" />
          <span class="text-sky-500">Start closing them with AI.</span>
        </h1>

        <p class="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
          I build AI lead capture systems, after-hours agents, and workflow automation for local businesses.
          You get the system — built, connected to your business, and handed over. No platform lock-in.
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
            See Case Studies
          </NuxtLink>
        </div>

      </div>
    </section>

    <!-- Before / After -->
    <section class="bg-slate-50 dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-5xl mx-auto px-6">

        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">What changes when you add AI</h2>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div
            v-for="item in beforeAfter"
            :key="item.before"
            class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-5"
          >
            <div class="flex items-start gap-3 mb-3">
              <Icon name="mdi:close-circle" class="text-rose-400 text-lg flex-shrink-0 mt-0.5" />
              <p class="text-sm text-slate-500 dark:text-slate-400 line-through">{{ item.before }}</p>
            </div>
            <div class="flex items-start gap-3">
              <Icon name="mdi:check-circle" class="text-emerald-400 text-lg flex-shrink-0 mt-0.5" />
              <p class="text-sm font-medium text-slate-900 dark:text-white">{{ item.after }}</p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Services Detail -->
    <section class="bg-white dark:bg-slate-900/30 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">

        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">AI Services for Local Businesses</h2>
          <p class="text-slate-500 dark:text-slate-400">Outcome-focused systems. Built once, connected to your business, handed over to you.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-5 mb-10">
          <div
            v-for="service in services"
            :key="service.title"
            class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden"
          >
            <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <div class="flex gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
              </div>
              <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">
                {{ service.title.toLowerCase().replace(/\s+/g, '.') }}.md
              </span>
            </div>

            <div class="p-5">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                :class="{
                  'bg-sky-500/10 border border-sky-500/20': service.color === 'sky',
                  'bg-emerald-500/10 border border-emerald-500/20': service.color === 'emerald',
                  'bg-violet-500/10 border border-violet-500/20': service.color === 'violet',
                }"
              >
                <Icon :name="service.icon" class="text-xl"
                  :class="{
                    'text-sky-400': service.color === 'sky',
                    'text-emerald-400': service.color === 'emerald',
                    'text-violet-400': service.color === 'violet',
                  }"
                />
              </div>

              <h3 class="font-bold text-slate-900 dark:text-white mb-2">{{ service.title }}</h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{{ service.description }}</p>

              <ul class="space-y-1.5">
                <li v-for="ex in service.examples" :key="ex"
                  class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Icon name="mdi:check" class="text-emerald-400 text-sm flex-shrink-0" />
                  {{ ex }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Niche strip -->
        <div>
          <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Best for</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="niche in niches"
              :key="niche.label"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-400"
            >
              <Icon :name="niche.icon" class="text-sm text-sky-400 flex-shrink-0" />
              {{ niche.label }}
            </span>
          </div>
        </div>

      </div>
    </section>

    <!-- Case Study -->
    <section class="bg-slate-50 dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-5xl mx-auto px-6">
        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Real Results</h2>
          <p class="text-slate-500 dark:text-slate-400">Production systems I've built and delivered.</p>
        </div>
        <BusinessBenefitCaseStudy />
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
            <p class="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">Focused Tool</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">$3K–$8K</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Single workflow, AI chatbot, or lead capture system</p>
          </div>
          <div class="rounded-2xl border border-sky-500/30 bg-sky-500/5 p-6 text-center">
            <p class="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">Full System</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">$10K–$20K</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Multi-workflow automation with CRM, dashboards, and integrations</p>
          </div>
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 p-6 text-center">
            <p class="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">Enterprise Platform</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">$20K+</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Full SaaS with billing, multi-role access, and custom AI pipeline</p>
          </div>
        </div>

      </div>
    </section>

    <!-- Trust Block (compact) -->
    <TrustBlock variant="compact" />

    <!-- FAQ -->
    <section class="bg-slate-50 dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-5xl mx-auto px-6">

        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Common Questions</h2>
        </div>

        <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 overflow-hidden">
          <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <div class="flex gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
            </div>
            <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">faq.md</span>
          </div>

          <div class="divide-y divide-slate-200 dark:divide-slate-800">
            <div v-for="faq in faqs" :key="faq.q" class="px-6 py-5">
              <h4 class="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">{{ faq.q }}</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{{ faq.a }}</p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- CTA -->
    <section class="bg-white dark:bg-slate-950 py-16">
      <div class="max-w-7xl mx-auto px-6">
        <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 p-8 sm:p-12 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            Available for new projects
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Let's automate your business
          </h2>
          <p class="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed mb-8">
            Tell me what you're trying to build. I'll follow up within one business day.
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
