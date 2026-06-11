<script setup lang="ts">
useSeoMeta({
  title: 'Newsletter — Donavan Jones',
  description: 'Short, practical posts on building software, SaaS, and tools for the web — delivered straight to your inbox.',
  ogTitle: 'Newsletter — Donavan Jones',
  ogDescription: 'Short, practical posts on building software, SaaS, and tools for the web — delivered straight to your inbox.',
  ogType: 'website',
})

const form = reactive({
  email: '',
  firstName: '',
})

const submitting = ref(false)
const submitted = ref(false)
const submitError = ref('')

async function submit() {
  submitting.value = true
  submitError.value = ''
  try {
    await $fetch('/api/newsletter', { method: 'POST', body: form })
    submitted.value = true
  } catch {
    submitError.value = 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}

const topics = [
  { icon: 'mdi:code-braces', color: 'sky', label: 'Web Development', description: 'Nuxt, Vue, TypeScript, APIs — how things actually get built.' },
  { icon: 'mdi:rocket-launch-outline', color: 'emerald', label: 'SaaS & Products', description: 'Shipping, pricing, scaling, and lessons from real products.' },
  { icon: 'mdi:wrench-outline', color: 'violet', label: 'Tools & Workflow', description: 'The dev tools, automations, and systems worth knowing about.' },
]
</script>

<template>
  <PatternSection>
    <div class="max-w-3xl mx-auto px-6 py-16 sm:py-24">

      <!-- ── HERO ─────────────────────────────────────────────────── -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5
                    bg-sky-500/10 border border-sky-500/20
                    text-sky-600 dark:text-sky-400 text-sm font-medium">
          <Icon name="mdi:email-newsletter" class="text-base" />
          No spam. Unsubscribe anytime.
        </div>

        <h1 class="text-4xl sm:text-5xl font-bold tracking-tight
                   text-slate-900 dark:text-white mb-5 leading-tight">
          The newsletter for<br class="hidden sm:block" />
          <span class="text-sky-500">builders who ship</span>
        </h1>

        <p class="max-w-xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          Short, practical writing on web development, SaaS, and the tools worth
          knowing about. Straight to your inbox — no filler.
        </p>
      </div>

      <!-- ── TOPICS ─────────────────────────────────────────────── -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
        <div
          v-for="topic in topics"
          :key="topic.label"
          class="rounded-2xl border border-slate-200 dark:border-slate-700/50
                 bg-slate-50 dark:bg-slate-900/60 p-5 text-center"
        >
          <div class="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
            :class="{
              'bg-sky-500/10 border border-sky-500/20': topic.color === 'sky',
              'bg-emerald-500/10 border border-emerald-500/20': topic.color === 'emerald',
              'bg-violet-500/10 border border-violet-500/20': topic.color === 'violet',
            }"
          >
            <Icon :name="topic.icon" class="text-xl"
              :class="{
                'text-sky-400': topic.color === 'sky',
                'text-emerald-400': topic.color === 'emerald',
                'text-violet-400': topic.color === 'violet',
              }"
            />
          </div>
          <h3 class="text-sm font-semibold text-slate-900 dark:text-white mb-1">{{ topic.label }}</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ topic.description }}</p>
        </div>
      </div>

      <!-- ── SIGN-UP FORM ───────────────────────────────────────── -->
      <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50
                  bg-slate-50 dark:bg-slate-900/60 overflow-hidden">

        <!-- Chrome header -->
        <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <div class="flex gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
          </div>
          <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">newsletter.subscribe</span>
        </div>

        <!-- Success -->
        <div v-if="submitted" class="p-8 text-center">
          <Icon name="mdi:check-circle-outline" class="text-emerald-400 text-4xl mb-3" />
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">You're in.</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">Thanks for subscribing. You'll hear from me soon.</p>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="submit" class="p-6 sm:p-8 space-y-5">

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <!-- First name -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                First Name
              </label>
              <input
                v-model="form.firstName"
                type="text"
                placeholder="Jane"
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
                placeholder="jane@example.com"
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
            <Icon v-else name="mdi:email-arrow-right-outline" class="text-base" />
            {{ submitting ? 'Subscribing…' : 'Subscribe' }}
          </button>

          <p class="text-xs text-slate-400 dark:text-slate-500">
            No spam. Unsubscribe at any time.
          </p>
        </form>
      </div>

    </div>
  </PatternSection>
</template>
