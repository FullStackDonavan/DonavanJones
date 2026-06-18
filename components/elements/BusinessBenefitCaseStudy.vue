<template>
  <div class="mt-12 rounded-2xl border border-sky-500/20 bg-white dark:bg-slate-900/60 overflow-hidden">

    <!-- Header bar -->
    <div class="px-6 py-3 bg-sky-500/10 border-b border-sky-500/20 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Icon name="mdi:shield-account" class="text-sky-400 text-sm" />
        <h3 class="text-xs font-semibold text-sky-400 uppercase tracking-wider">Case Study</h3>
      </div>
      <span class="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        Completed
      </span>
    </div>

    <div class="p-6 sm:p-8">

      <!-- Title row -->
      <div class="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
        <div class="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
          <Icon name="mdi:briefcase-account" class="text-sky-400 text-2xl" />
        </div>
        <div>
          <p class="text-xl font-bold text-slate-900 dark:text-white mb-0.5">Business Benefit Alliance</p>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Production SaaS · Group Insurance Enrollment · Sole Developer &amp; Architect
          </p>
        </div>
      </div>

      <!-- Description -->
      <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
        A full-stack group insurance enrollment platform that automated a previously manual process for 92 businesses —
        eliminating paper applications, email chains, and manual PDF assembly through invite-based onboarding,
        server-side document generation, and a state-machine-enforced workflow with three role-scoped dashboards.
      </p>

      <!-- Business Impact stats -->
      <div class="mb-6">
        <h4 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Business Impact</h4>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 p-3 text-center"
          >
            <div class="text-lg font-bold text-slate-900 dark:text-white">{{ stat.value }}</div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- Efficiency Outcomes -->
      <div class="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <h4 class="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
          <Icon name="mdi:trending-up" class="text-base" />
          Efficiency Outcomes
        </h4>
        <ul class="space-y-2">
          <li v-for="outcome in outcomes" :key="outcome" class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Icon name="mdi:check-circle" class="text-emerald-400 text-base flex-shrink-0 mt-0.5" />
            {{ outcome }}
          </li>
        </ul>
      </div>

      <!-- How We Built It -->
      <div class="mb-6">
        <h4 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">How We Built It</h4>
        <ul class="space-y-2">
          <li
            v-for="challenge in challenges"
            :key="challenge.text"
            class="flex items-start gap-2.5"
          >
            <div
              class="mt-0.5 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border"
              :class="challenge.colorClasses"
            >
              <Icon :name="challenge.icon" class="text-[10px]" />
            </div>
            <span class="text-sm text-slate-600 dark:text-slate-400 leading-snug">{{ challenge.text }}</span>
          </li>
        </ul>
      </div>

      <!-- Lessons Learned -->
      <div class="mb-6 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/40 p-4">
        <h4 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Lessons Learned</h4>
        <ul class="space-y-1.5">
          <li
            v-for="lesson in lessons"
            :key="lesson"
            class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
          >
            <Icon name="mdi:lightbulb-outline" class="text-amber-400 text-base flex-shrink-0 mt-0.5" />
            {{ lesson }}
          </li>
        </ul>
      </div>

      <!-- Tech stack -->
      <div class="mb-6">
        <h4 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Stack</h4>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="tag in stack"
            :key="tag"
            class="text-[11px] px-2 py-0.5 rounded-md border bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/50"
          >{{ tag }}</span>
        </div>
      </div>

      <!-- CTA -->
      <NuxtLink
        to="/projects/business-benefit-alliance"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
               bg-sky-500/10 border border-sky-500/20 text-sky-400
               hover:bg-sky-500/20 hover:border-sky-500/40 transition-all duration-200"
      >
        <Icon name="mdi:arrow-right-circle-outline" class="text-base" />
        View Full Case Study
      </NuxtLink>

    </div>
  </div>
</template>

<script setup lang="ts">
const stats = [
  { value: '92',    label: 'Businesses Automated' },
  { value: '100s',  label: 'Employees Enrolled' },
  { value: '0',     label: 'Manual Assignment Steps' },
  { value: '100%',  label: 'Audit Covered' },
]

const outcomes = [
  'Automated end-to-end enrollment for 92 businesses — invite codes auto-link employees to the correct company on sign-up, eliminating manual admin assignment.',
  'Eliminated manual PDF assembly: signed documents generated server-side on every form submission with digital signatures composited in — one coherent file stored to S3.',
  'Insurance cards delivered directly from the admin dashboard — no email attachments, no manual forwarding per employee.',
  'Append-only audit trail covers every enrollment action, replacing informal tracking for a workflow that requires legal traceability.',
  'State machine enforces the full 5-step enrollment sequence across multiple actors — no employee can submit out of order, no owner can authorize payment before all applications are complete.',
]

const challenges = [
  {
    icon: 'mdi:email-fast',
    text: 'Invite-based employee onboarding — unique business codes auto-link employees to the correct company on sign-up',
    colorClasses: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
  },
  {
    icon: 'mdi:file-sign',
    text: 'Digital signature composited server-side directly into generated PDFs — one coherent document stored to S3',
    colorClasses: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
  },
  {
    icon: 'mdi:state-machine',
    text: 'Enrollment state machine enforces sequential workflow — no actor can advance out of order, transitions are atomic',
    colorClasses: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  },
  {
    icon: 'mdi:shield-lock',
    text: 'Role-scoped API enforcement at the Nitro service layer — UI guards are UX, not the security boundary',
    colorClasses: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  },
]

const lessons = [
  'State machine design keeps multi-actor workflows auditable without reconstructing history from events.',
  'Server-side document generation ensures legally significant PDFs are tamper-resistant from the moment they are created.',
  'Soft delete over hard delete preserves enrollment record integrity across all workflow phases — data is never unrecoverable.',
]

const stack = [
  'Nuxt 3', 'Vue 3', 'TypeScript', 'Tailwind CSS',
  'Nitro Server', 'Prisma ORM', 'PostgreSQL',
  'AWS S3', 'Nodemailer', 'PDF Generation', 'Digital Signatures', 'Zod', 'Pinia',
]
</script>
