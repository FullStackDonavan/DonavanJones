<script setup lang="ts">
const config = useRuntimeConfig()
const SITE = (config.public.appDomain as string) || 'https://donavanjones.com'

useSeoMeta({
  title: 'Custom Web & SaaS Development',
  description:
    'Custom web applications, SaaS platforms, dashboards, and APIs — built from scratch and handed over. Full-stack development with Nuxt, Node.js, PostgreSQL, and modern tooling.',
  ogTitle: 'Custom Web & SaaS Development | Donavan Jones',
  ogDescription:
    'Full-stack web application development. SaaS platforms, multi-role dashboards, APIs, and payments — production systems delivered end-to-end.',
  ogType: 'website',
  ogImage: `${SITE}/img/logo.png`,
  ogUrl: `${SITE}/services/web-development`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Custom Web & SaaS Development | Donavan Jones',
  twitterDescription: 'Full-stack web applications and SaaS platforms built from scratch.',
  canonical: `${SITE}/services/web-development`,
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${SITE}/services/web-development`,
        name: 'Custom Web & SaaS Development',
        description: 'Full-stack web applications, SaaS platforms, dashboards, and APIs built from scratch.',
        provider: { '@id': `${SITE}/#person` },
        areaServed: { '@type': 'Country', name: 'United States' },
        serviceType: 'Web Application Development',
      }),
    },
  ],
})

const capabilities = [
  {
    icon: 'mdi:view-dashboard-outline',
    title: 'SaaS Platforms',
    desc: 'Multi-role applications with user management, billing, dashboards, and admin controls. Built to support real users from day one.',
  },
  {
    icon: 'mdi:api',
    title: 'APIs & Backend Systems',
    desc: 'RESTful and real-time APIs, async job queues, background workers, and typed data pipelines. PostgreSQL, Redis, BullMQ.',
  },
  {
    icon: 'mdi:credit-card-outline',
    title: 'Payments & Billing',
    desc: 'Stripe integration, subscription management, invoicing, and payment authorization flows — tested and production-ready.',
  },
  {
    icon: 'mdi:shield-lock-outline',
    title: 'Auth & Access Control',
    desc: 'Role-based access control, invite-based onboarding, session management, and multi-tenant data isolation.',
  },
  {
    icon: 'mdi:file-pdf-box',
    title: 'Document Generation',
    desc: 'Automated PDF generation with digital signatures, S3 storage, audit trails, and role-scoped downloads.',
  },
  {
    icon: 'mdi:brain',
    title: 'AI Integration',
    desc: 'RAG pipelines, LLM-powered features, vector search, and AI agent workflows wired into your application.',
  },
]

const caseStudies = [
  {
    title: 'Business Benefit Alliance',
    highlight: '92 businesses onboarded',
    desc: 'Full-stack group insurance enrollment platform with multi-role dashboards, digital signature capture, automated PDF generation, and audit trails. Enrollment workflows reduced from hours to minutes.',
    tags: ['Nuxt 3', 'PostgreSQL', 'AWS S3', 'Prisma', 'PDF Generation'],
    to: '/projects/business-benefit-alliance',
    result: 'Hours → Minutes enrollment',
  },
  {
    title: 'Bible Logic',
    highlight: '37,000+ verses indexed',
    desc: 'AI-powered scripture study platform with RAG retrieval under 200ms, local LLM inference on self-hosted GPU nodes, real-time chat via WebRTC, and async job pipelines.',
    tags: ['Weaviate', 'Llama 3.2', 'BullMQ', 'WebRTC', 'Kubernetes'],
    to: '/projects/bible-verse',
    result: '70% inference cost reduction',
  },
]
</script>

<template>
  <PatternSection>

    <!-- Hero -->
    <section class="w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">

        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
          <Icon name="mdi:code-braces" class="text-sm" />
          Web Development
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
          Custom software that<br class="hidden sm:block" />
          <span class="text-purple-500">runs your business</span>
        </h1>

        <p class="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
          I build full-stack web applications, SaaS platforms, and internal tools from scratch.
          You describe the problem — I design the architecture, write the code, deploy it, and hand it over.
          You own everything.
        </p>

        <div class="flex flex-wrap justify-center gap-3">
          <NuxtLink
            to="/hire-me#contact"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-purple-500 text-white hover:bg-purple-600 transition-colors duration-200 shadow-lg shadow-purple-500/20"
          >
            <Icon name="mdi:email-outline" class="text-base" />
            Request a Quote
          </NuxtLink>
          <NuxtLink
            to="/projects/overview"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-500/40 hover:text-purple-500 transition-colors duration-200"
          >
            <Icon name="mdi:briefcase-outline" class="text-base" />
            See Case Studies
          </NuxtLink>
        </div>

      </div>
    </section>

    <!-- Capabilities -->
    <section class="bg-slate-50 dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6">

        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">What I Build</h2>
          <p class="text-slate-500 dark:text-slate-400">Production-grade systems — not prototypes.</p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="cap in capabilities"
            :key="cap.title"
            class="rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 flex flex-col gap-3 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-200"
          >
            <div class="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Icon :name="cap.icon" class="text-purple-400 text-xl" />
            </div>
            <div>
              <h3 class="text-sm font-semibold text-slate-900 dark:text-white">{{ cap.title }}</h3>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ cap.desc }}</p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Case Studies -->
    <section class="bg-white dark:bg-slate-900/30 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-5xl mx-auto px-6">

        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Case Studies</h2>
          <p class="text-slate-500 dark:text-slate-400">Production systems shipped from concept to deployment.</p>
        </div>

        <div class="space-y-5">
          <NuxtLink
            v-for="cs in caseStudies"
            :key="cs.title"
            :to="cs.to"
            class="group block rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 p-6 sm:p-8 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-200"
          >
            <div class="flex flex-col sm:flex-row sm:items-start gap-5">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-[11px] px-2 py-0.5 rounded-md font-medium bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    {{ cs.highlight }}
                  </span>
                </div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-500 transition-colors">
                  {{ cs.title }}
                </h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{{ cs.desc }}</p>
                <div class="flex flex-wrap gap-1.5 mb-4">
                  <span
                    v-for="tag in cs.tags"
                    :key="tag"
                    class="text-[10px] px-2 py-0.5 rounded border bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/50"
                  >{{ tag }}</span>
                </div>
              </div>
              <div class="sm:text-right flex-shrink-0">
                <p class="text-xs text-slate-400 dark:text-slate-500 mb-1">Key Result</p>
                <p class="text-sm font-bold text-purple-500">{{ cs.result }}</p>
              </div>
            </div>
            <div class="flex items-center gap-1 text-xs font-medium text-purple-500 group-hover:gap-2 transition-all mt-2">
              View full case study <Icon name="mdi:arrow-right" class="text-sm" />
            </div>
          </NuxtLink>
        </div>

      </div>
    </section>

    <!-- Pricing Hints -->
    <section class="bg-slate-50 dark:bg-slate-950 py-16 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-5xl mx-auto px-6">

        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Typical Investment</h2>
          <p class="text-slate-500 dark:text-slate-400">Transparent pricing — you'll get a firm number before any work starts.</p>
        </div>

        <div class="grid sm:grid-cols-3 gap-4">
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-6 text-center">
            <p class="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">Internal Tool</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">$3K–$8K</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Focused app, admin panel, or single-purpose tool</p>
          </div>
          <div class="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-6 text-center">
            <p class="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">Full Platform</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">$10K–$30K</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">SaaS with dashboards, billing, auth, and multi-role access</p>
          </div>
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-6 text-center">
            <p class="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">Enterprise</p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white mb-1">$30K+</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Complex platform with AI integration, custom pipelines, and infrastructure</p>
          </div>
        </div>

      </div>
    </section>

    <!-- CTA -->
    <section class="bg-slate-50 dark:bg-slate-950 py-16">
      <div class="max-w-7xl mx-auto px-6">
        <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-8 sm:p-12 text-center">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Have a project in mind?
          </h2>
          <p class="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed mb-8">
            Describe what you need in plain English. I'll follow up with a proposal — what I'll build, how long it takes, and what it costs.
          </p>
          <NuxtLink
            to="/hire-me#contact"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-purple-500 text-white hover:bg-purple-600 transition-colors duration-200 shadow-lg shadow-purple-500/20"
          >
            <Icon name="mdi:email-outline" class="text-base" />
            Request a Quote
          </NuxtLink>
        </div>
      </div>
    </section>

  </PatternSection>
</template>
