<script setup lang="ts">
useSeoMeta({
  title: 'Hire Me — Donavan Jones | AI Systems Engineer',
  description: 'AI Systems Engineer open to senior IC and staff roles in AI engineering, platform engineering, and full-stack development. Also available for contract projects.',
  ogTitle: 'Hire Me — Donavan Jones | AI Systems Engineer',
  ogDescription: 'AI Systems Engineer open to senior roles in AI engineering and platform development. Also available for contract projects and freelance builds.',
  ogType: 'website',
})

const form = reactive({
  name: '',
  email: '',
  company: '',
  project: '',
  budget: '',
  timeline: '',
})

const submitting = ref(false)
const submitted = ref(false)
const submitError = ref('')

async function submit() {
  submitting.value = true
  submitError.value = ''
  try {
    await $fetch('/api/contact', { method: 'POST', body: form })
    submitted.value = true
  } catch {
    submitError.value = 'Something went wrong. Please email me directly at donavanjones79@gmail.com.'
  } finally {
    submitting.value = false
  }
}

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

const steps = [
  {
    icon: 'mdi:phone-outline',
    color: 'sky',
    step: '01',
    title: 'Discovery Call',
    body: 'We talk through what you\'re trying to build, what problem it solves, and what success looks like. No commitment, no sales pitch — just figuring out if we\'re a good fit.',
  },
  {
    icon: 'mdi:file-document-outline',
    color: 'emerald',
    step: '02',
    title: 'Proposal',
    body: 'I send you a plain-English proposal: what I\'ll build, how long it\'ll take, and what it costs. No surprises. If something changes mid-project, I tell you before I act.',
  },
  {
    icon: 'mdi:hammer-wrench',
    color: 'violet',
    step: '03',
    title: 'Build',
    body: 'I build your project and keep you updated throughout. You\'ll see real progress — not status meetings. I ask questions early so we don\'t rebuild things at the end.',
  },
  {
    icon: 'mdi:rocket-launch-outline',
    color: 'amber',
    step: '04',
    title: 'Launch & Handoff',
    body: 'You get a working product you own completely. I handle deployment, walk you through how it works, and stay available for questions after launch.',
  },
]

const faqs = [
  {
    q: 'What does a project typically cost?',
    a: 'Small tools and internal apps usually start around $3,000–$8,000. Full platforms with user accounts, billing, and multiple roles typically run $10,000–$30,000+. I\'ll give you a firm number before any work starts.',
  },
  {
    q: 'How long does a project take?',
    a: 'A focused internal tool takes 3–6 weeks. A full SaaS platform with dashboards and billing typically takes 2–4 months. Timeline depends on scope — I\'ll be specific in the proposal.',
  },
  {
    q: 'Do I need to be technical to work with you?',
    a: 'Not at all. I translate between business problems and technical solutions. You describe what you need in plain English — I figure out how to build it.',
  },
  {
    q: 'Will I own the code?',
    a: 'Yes. Everything built for your project is yours. You get the source code, the hosting setup, and complete control. I\'m not a rental — I hand it over.',
  },
  {
    q: 'What kinds of businesses do you work with?',
    a: 'Local service businesses — roofing, HVAC, law firms, med spas, insurance brokers, real estate agencies, dental offices. Anywhere that relies on inbound calls, appointments, or repetitive admin work is a good fit.',
  },
  {
    q: 'Do I need to manage or maintain the AI system myself?',
    a: 'No. I build it, deploy it, connect it to your existing phone number, website, or calendar, and hand it over working. I\'ll walk you through how it works and stay available after launch.',
  },
]
</script>

<template>
  <PatternSection>
    <div class="max-w-5xl mx-auto px-6 py-16 sm:py-24">

      <!-- ── FOR RECRUITERS ───────────────────────────────────────── -->
      <div class="mb-20 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/60 overflow-hidden">

        <!-- Chrome header -->
        <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="flex gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
            </div>
            <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">opportunities.config</span>
          </div>
          <div class="inline-flex items-center gap-1.5 text-xs text-green-500 font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            Available
          </div>
        </div>

        <div class="p-6 sm:p-8">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-1">Open to New Opportunities</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-2">
            Available for senior IC roles and contract work. Remote preferred.
            Roles where AI engineering, infrastructure, and full-stack development intersect.
          </p>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
            I work best when I'm brought in early — before the architecture is decided. I'll gather requirements,
            make opinionated technical recommendations, build it, deploy it, and own it in production.
            I've done this end-to-end at Amerus Financial Group (92 businesses, automated enrollment workflows
            from hours to minutes) and I'm applying the same ownership model to my own AI platform.
          </p>

          <!-- Role types -->
          <div class="grid sm:grid-cols-2 gap-3 mb-8">
            <div v-for="role in [
              { icon: 'mdi:brain', color: 'purple', label: 'AI Systems Engineer', desc: 'RAG pipelines, LLM inference, agent workflows, vector search' },
              { icon: 'mdi:server-network', color: 'emerald', label: 'Platform Engineering', desc: 'Kubernetes, CI/CD, observability, distributed infrastructure' },
              { icon: 'mdi:layers-triple', color: 'sky', label: 'Senior Full-Stack Engineer', desc: 'Nuxt/Vue, Node.js, TypeScript, PostgreSQL, production SaaS' },
              { icon: 'mdi:briefcase-outline', color: 'amber', label: 'Contract / Freelance', desc: 'AI integration, SaaS builds, platform architecture' },
            ]" :key="role.label"
              class="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/40"
            >
              <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border"
                :class="{
                  'bg-purple-500/10 border-purple-500/20': role.color === 'purple',
                  'bg-emerald-500/10 border-emerald-500/20': role.color === 'emerald',
                  'bg-sky-500/10 border-sky-500/20': role.color === 'sky',
                  'bg-amber-500/10 border-amber-500/20': role.color === 'amber',
                }"
              >
                <Icon :name="role.icon" class="text-sm"
                  :class="{
                    'text-purple-400': role.color === 'purple',
                    'text-emerald-400': role.color === 'emerald',
                    'text-sky-400': role.color === 'sky',
                    'text-amber-400': role.color === 'amber',
                  }"
                />
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ role.label }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{{ role.desc }}</p>
              </div>
            </div>
          </div>

          <!-- How I Work -->
          <div class="mb-8 grid sm:grid-cols-3 gap-3">
            <div v-for="item in [
              { icon: 'mdi:account-voice', label: 'Stakeholder to Spec', desc: 'I gather requirements, ask the right questions, and translate business needs into technical architecture — before a line of code is written.' },
              { icon: 'mdi:hammer-wrench', label: 'Build & Own', desc: 'I implement what I spec and own it through deployment — including infrastructure, observability, CI/CD, and post-launch operations.' },
              { icon: 'mdi:school-outline', label: 'Train & Hand Off', desc: 'I document decisions, train end users and administrators, and leave systems that others can operate — not black boxes.' },
            ]" :key="item.label"
              class="flex flex-col gap-2 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/40"
            >
              <div class="flex items-center gap-2">
                <Icon :name="item.icon" class="text-sky-400 text-lg" />
                <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ item.label }}</p>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ item.desc }}</p>
            </div>
          </div>

          <!-- Contact links -->
          <div class="flex flex-wrap gap-3">
            <a
              href="mailto:donavanjones79@gmail.com"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                     bg-sky-500 hover:bg-sky-600 text-white transition-colors duration-200 shadow-lg shadow-sky-500/20"
            >
              <Icon name="mdi:email-outline" class="text-base" />
              donavanjones79@gmail.com
            </a>
            <a
              href="https://linkedin.com/in/donavanjones"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                     border border-slate-200 dark:border-slate-700/50
                     bg-white dark:bg-slate-900/60
                     text-slate-600 dark:text-slate-300
                     hover:border-sky-500/40 hover:text-sky-400
                     transition-all duration-200"
            >
              <Icon name="mdi:linkedin" class="text-base" />
              LinkedIn
            </a>
            <a
              href="https://github.com/FullStackDonavan"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                     border border-slate-200 dark:border-slate-700/50
                     bg-white dark:bg-slate-900/60
                     text-slate-600 dark:text-slate-300
                     hover:border-sky-500/40 hover:text-sky-400
                     transition-all duration-200"
            >
              <Icon name="mdi:github" class="text-base" />
              GitHub
            </a>
            <NuxtLink
              to="/resume"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                     border border-slate-200 dark:border-slate-700/50
                     bg-white dark:bg-slate-900/60
                     text-slate-600 dark:text-slate-300
                     hover:border-sky-500/40 hover:text-sky-400
                     transition-all duration-200"
            >
              <Icon name="mdi:file-account-outline" class="text-base" />
              View Resume
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- ── DIVIDER ───────────────────────────────────────────────── -->
      <div class="flex items-center gap-4 mb-20">
        <div class="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
        <span class="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-medium">Also available for client projects</span>
        <div class="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
      </div>

      <!-- ── HERO ─────────────────────────────────────────────────── -->
      <div class="text-center mb-20">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5
                    bg-sky-500/10 border border-sky-500/20
                    text-sky-600 dark:text-sky-400 text-sm font-medium">
          <span class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
          Available for new projects
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight
                   text-slate-900 dark:text-white mb-6 leading-tight">
          AI that gets your business<br class="hidden sm:block" />
          <span class="text-sky-500">more leads &amp; less admin</span>
        </h1>

        <p class="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
          I build AI lead capture systems, after-hours agents, and workflow automation for local businesses.
          You get the system — built, connected to your business, and handed over. No platform lock-in.
        </p>

        <div class="flex flex-wrap justify-center gap-3">
          <a
            href="#contact"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
                   bg-sky-500 text-white hover:bg-sky-600 transition-colors duration-200 shadow-lg shadow-sky-500/20"
          >
            <Icon name="mdi:email-outline" class="text-base" />
            Start a Conversation
          </a>
          <NuxtLink
            to="/projects/overview"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
                   border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300
                   hover:border-sky-500/40 hover:text-sky-500 transition-colors duration-200"
          >
            <Icon name="mdi:briefcase-outline" class="text-base" />
            See My Work
          </NuxtLink>
        </div>
      </div>

      <!-- ── SERVICES ────────────────────────────────────────────── -->
      <div class="mb-20">
        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">AI Services for Local Businesses</h2>
          <p class="text-slate-500 dark:text-slate-400">Outcome-focused systems. Built once, connected to your business, handed over to you.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div
            v-for="service in services"
            :key="service.title"
            class="rounded-2xl border border-slate-200 dark:border-slate-700/50
                   bg-slate-50 dark:bg-slate-900/60 overflow-hidden"
          >
            <!-- Chrome header -->
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

        <!-- Best for niches -->
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

      <!-- ── CASE STUDY ──────────────────────────────────────────── -->
      <div class="mb-20">
        <BusinessBenefitCaseStudy />
      </div>

      <!-- ── HOW IT WORKS ────────────────────────────────────────── -->
      <div class="mb-20">
        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">How It Works</h2>
          <p class="text-slate-500 dark:text-slate-400">From first conversation to working software — here's the process.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="step in steps"
            :key="step.step"
            class="rounded-2xl border border-slate-200 dark:border-slate-700/50
                   bg-slate-50 dark:bg-slate-900/60 p-5"
          >
            <div class="flex items-center gap-3 mb-3">
              <span class="text-[11px] font-bold tabular-nums text-slate-400 dark:text-slate-600">{{ step.step }}</span>
              <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                :class="{
                  'bg-sky-500/10 border border-sky-500/20': step.color === 'sky',
                  'bg-emerald-500/10 border border-emerald-500/20': step.color === 'emerald',
                  'bg-violet-500/10 border border-violet-500/20': step.color === 'violet',
                  'bg-amber-500/10 border border-amber-500/20': step.color === 'amber',
                }"
              >
                <Icon :name="step.icon" class="text-base"
                  :class="{
                    'text-sky-400': step.color === 'sky',
                    'text-emerald-400': step.color === 'emerald',
                    'text-violet-400': step.color === 'violet',
                    'text-amber-400': step.color === 'amber',
                  }"
                />
              </div>
            </div>
            <h4 class="font-semibold text-slate-900 dark:text-white mb-2 text-sm">{{ step.title }}</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ step.body }}</p>
          </div>
        </div>
      </div>

      <!-- ── CONTACT FORM ────────────────────────────────────────── -->
      <div id="contact" class="mb-20">
        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Let's Talk About Your Project</h2>
          <p class="text-slate-500 dark:text-slate-400">Tell me what you're trying to build. I'll follow up within one business day.</p>
        </div>

        <!-- Success state -->
        <div v-if="submitted"
          class="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
          <Icon name="mdi:check-circle-outline" class="text-emerald-400 text-4xl mb-3" />
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Message received.</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">I'll be in touch within one business day.</p>
        </div>

        <!-- Form -->
        <form v-else
          @submit.prevent="submit"
          class="rounded-2xl border border-slate-200 dark:border-slate-700/50
                 bg-slate-50 dark:bg-slate-900/60 overflow-hidden"
        >
          <!-- Chrome header -->
          <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <div class="flex gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
            </div>
            <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">new.project.inquiry</span>
          </div>

          <div class="p-6 sm:p-8 space-y-5">

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <!-- Name -->
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  Your Name <span class="text-rose-400">*</span>
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="Jane Smith"
                  class="w-full px-4 py-2.5 rounded-xl text-sm
                         border border-slate-200 dark:border-slate-700
                         bg-white dark:bg-slate-800
                         text-slate-900 dark:text-slate-100
                         placeholder-slate-400 dark:placeholder-slate-600
                         focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30
                         transition-colors duration-150"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  Email Address <span class="text-rose-400">*</span>
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="jane@company.com"
                  class="w-full px-4 py-2.5 rounded-xl text-sm
                         border border-slate-200 dark:border-slate-700
                         bg-white dark:bg-slate-800
                         text-slate-900 dark:text-slate-100
                         placeholder-slate-400 dark:placeholder-slate-600
                         focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30
                         transition-colors duration-150"
                />
              </div>
            </div>

            <!-- Company -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                Company or Project Name
              </label>
              <input
                v-model="form.company"
                type="text"
                placeholder="Acme Corp"
                class="w-full px-4 py-2.5 rounded-xl text-sm
                       border border-slate-200 dark:border-slate-700
                       bg-white dark:bg-slate-800
                       text-slate-900 dark:text-slate-100
                       placeholder-slate-400 dark:placeholder-slate-600
                       focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30
                       transition-colors duration-150"
              />
            </div>

            <!-- Project -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                What are you trying to build?
              </label>
              <textarea
                v-model="form.project"
                rows="4"
                placeholder="Describe your project in plain English — what it needs to do, who uses it, what problem it solves."
                class="w-full px-4 py-2.5 rounded-xl text-sm resize-none
                       border border-slate-200 dark:border-slate-700
                       bg-white dark:bg-slate-800
                       text-slate-900 dark:text-slate-100
                       placeholder-slate-400 dark:placeholder-slate-600
                       focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30
                       transition-colors duration-150"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <!-- Budget -->
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  Budget Range
                </label>
                <select
                  v-model="form.budget"
                  class="w-full px-4 py-2.5 rounded-xl text-sm
                         border border-slate-200 dark:border-slate-700
                         bg-white dark:bg-slate-800
                         text-slate-900 dark:text-slate-100
                         focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30
                         transition-colors duration-150"
                >
                  <option value="">Not sure yet</option>
                  <option value="Under $5,000">Under $5,000</option>
                  <option value="$5,000 – $15,000">$5,000 – $15,000</option>
                  <option value="$15,000 – $50,000">$15,000 – $50,000</option>
                  <option value="$50,000+">$50,000+</option>
                </select>
              </div>

              <!-- Timeline -->
              <div>
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  Timeline
                </label>
                <select
                  v-model="form.timeline"
                  class="w-full px-4 py-2.5 rounded-xl text-sm
                         border border-slate-200 dark:border-slate-700
                         bg-white dark:bg-slate-800
                         text-slate-900 dark:text-slate-100
                         focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30
                         transition-colors duration-150"
                >
                  <option value="">Flexible</option>
                  <option value="ASAP">As soon as possible</option>
                  <option value="1–3 months">1–3 months</option>
                  <option value="3–6 months">3–6 months</option>
                  <option value="Just exploring">Just exploring for now</option>
                </select>
              </div>
            </div>

            <!-- Error -->
            <p v-if="submitError" class="text-sm text-rose-500">{{ submitError }}</p>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="submitting"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl
                     text-sm font-semibold bg-sky-500 text-white
                     hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed
                     transition-colors duration-200 shadow-lg shadow-sky-500/20"
            >
              <Icon v-if="submitting" name="mdi:loading" class="text-base animate-spin" />
              <Icon v-else name="mdi:send-outline" class="text-base" />
              {{ submitting ? 'Sending…' : 'Send Message' }}
            </button>

          </div>
        </form>
      </div>

      <!-- ── FAQ ────────────────────────────────────────────────── -->
      <div>
        <div class="text-center mb-10">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Common Questions</h2>
        </div>

        <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50
                    bg-slate-50 dark:bg-slate-900/60 overflow-hidden">

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

        <!-- Direct contact -->
        <p class="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
          Prefer email?
          <a href="mailto:donavanjones79@gmail.com"
            class="text-sky-500 hover:text-sky-400 font-medium transition-colors">
            donavanjones79@gmail.com
          </a>
        </p>
      </div>

    </div>
  </PatternSection>
</template>
