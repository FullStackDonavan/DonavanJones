<script setup lang="ts">
import DashboardSidebar from "~~/components/elements/DashboardSidebar.vue";
import { useUser } from '~/composables/useAuth'

definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'Start Your Project — Donavan Jones',
  robots: 'noindex',
})

interface IPurchase {
  id: number
  productSlug: string
  productTitle: string
}

const user = await useUser()
const cookieHeaders = useRequestHeaders(['cookie'])

const { data: purchases } = await useFetch<IPurchase[]>('/api/profile/purchases', {
  headers: cookieHeaders as HeadersInit,
})

const goalOptions = [
  {
    value: 'customize',
    icon: 'mdi:package-variant-closed-check',
    title: 'Customize something I bought',
    description: 'Take one of your guides further — a custom build, extra integrations, or done-for-you setup.',
  },
  {
    value: 'new',
    icon: 'mdi:hammer-wrench',
    title: 'Build something new',
    description: "A tool, dashboard, or platform that doesn't exist yet.",
  },
  {
    value: 'automate',
    icon: 'mdi:robot-outline',
    title: 'Automate a workflow',
    description: 'AI lead capture, admin automation, or connecting the systems you already use.',
  },
  {
    value: 'unsure',
    icon: 'mdi:chat-question-outline',
    title: "Not sure yet — let's talk",
    description: 'Describe the problem and I\'ll help figure out the right approach.',
  },
]

const step = ref(1)
const totalSteps = 3

const form = reactive({
  goal: '',
  productSlug: '',
  project: '',
  budget: '',
  timeline: '',
  name: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
  email: user?.email ?? '',
  company: '',
})

const submitting = ref(false)
const submitted = ref(false)
const submitError = ref('')

const selectedGoal = computed(() => goalOptions.find(g => g.value === form.goal))

const projectPlaceholder = computed(() => {
  switch (form.goal) {
    case 'customize':
      return 'What would you like added, changed, or built out further?'
    case 'new':
      return 'What should it do, who uses it, and what problem does it solve?'
    case 'automate':
      return 'What\'s the manual process you want handled automatically?'
    default:
      return 'Describe what you\'re trying to do in plain English.'
  }
})

function selectGoal(value: string) {
  form.goal = value
  step.value = 2
}

function goBack() {
  if (step.value > 1) step.value -= 1
}

function goNext() {
  if (step.value < totalSteps) step.value += 1
}

async function submit() {
  submitting.value = true
  submitError.value = ''

  const selectedProduct = purchases.value?.find(p => p.productSlug === form.productSlug)

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        company: form.company,
        project: form.project,
        budget: form.budget,
        timeline: form.timeline,
        source: 'Dashboard - Start Your Project',
        product: selectedProduct?.productTitle,
      },
    })
    submitted.value = true
  } catch {
    submitError.value = 'Something went wrong. Please email me directly at donavanjones79@gmail.com.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <PatternSection>
    <div class="min-h-screen px-6 py-12">
      <div class="max-w-6xl mx-auto">

        <div class="mb-10">
          <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Start Your Project</h1>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            A few quick questions, then I'll follow up within one business day.
          </p>
        </div>

        <div class="md:flex md:gap-10 items-start">
          <DashboardSidebar />

          <div class="flex-1 min-w-0 max-w-2xl">

            <!-- Success -->
            <div
              v-if="submitted"
              class="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-10 text-center"
            >
              <Icon name="mdi:check-circle-outline" class="text-emerald-400 text-4xl mb-3" />
              <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Got it — thanks{{ user?.firstName ? `, ${user.firstName}` : '' }}.</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">I'll be in touch within one business day.</p>
              <NuxtLink
                to="/dashboard"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
                       bg-sky-500 hover:bg-sky-400 transition-colors"
              >
                <Icon name="mdi:arrow-left" class="text-base" />
                Back to Dashboard
              </NuxtLink>
            </div>

            <template v-else>
              <!-- Progress -->
              <div class="flex items-center gap-2 mb-8">
                <div
                  v-for="n in totalSteps"
                  :key="n"
                  class="h-1.5 flex-1 rounded-full"
                  :class="n <= step ? 'bg-sky-500' : 'bg-slate-200 dark:bg-slate-700'"
                />
              </div>

              <!-- Step 1: Goal -->
              <div v-if="step === 1">
                <h2 class="text-base font-bold text-slate-900 dark:text-white mb-5">What do you need?</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    v-for="goal in goalOptions"
                    :key="goal.value"
                    type="button"
                    class="text-left p-5 rounded-2xl border transition-colors
                           border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60
                           hover:border-sky-500/40 dark:hover:border-sky-500/30"
                    @click="selectGoal(goal.value)"
                  >
                    <div class="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center mb-3">
                      <Icon :name="goal.icon" class="text-xl text-sky-400" />
                    </div>
                    <p class="text-sm font-semibold text-slate-900 dark:text-white mb-1">{{ goal.title }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ goal.description }}</p>
                  </button>
                </div>
              </div>

              <!-- Step 2: Details -->
              <div v-else-if="step === 2" class="space-y-5">
                <div class="flex items-center gap-2 mb-1">
                  <Icon :name="selectedGoal?.icon" class="text-sky-400 text-lg" />
                  <h2 class="text-base font-bold text-slate-900 dark:text-white">{{ selectedGoal?.title }}</h2>
                </div>

                <div v-if="form.goal === 'customize' && purchases?.length">
                  <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                    Which product?
                  </label>
                  <select
                    v-model="form.productSlug"
                    class="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700
                           bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                           focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30"
                  >
                    <option value="">Select a product</option>
                    <option v-for="p in purchases" :key="p.id" :value="p.productSlug">{{ p.productTitle }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                    Tell me more
                  </label>
                  <textarea
                    v-model="form.project"
                    rows="4"
                    :placeholder="projectPlaceholder"
                    class="w-full px-4 py-2.5 rounded-xl text-sm resize-none border border-slate-200 dark:border-slate-700
                           bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                           placeholder-slate-400 dark:placeholder-slate-600
                           focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30"
                  />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                      Budget Range
                    </label>
                    <select
                      v-model="form.budget"
                      class="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700
                             bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                             focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30"
                    >
                      <option value="">Not sure yet</option>
                      <option value="Under $5,000">Under $5,000</option>
                      <option value="$5,000 – $15,000">$5,000 – $15,000</option>
                      <option value="$15,000 – $50,000">$15,000 – $50,000</option>
                      <option value="$50,000+">$50,000+</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                      Timeline
                    </label>
                    <select
                      v-model="form.timeline"
                      class="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700
                             bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                             focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30"
                    >
                      <option value="">Flexible</option>
                      <option value="ASAP">As soon as possible</option>
                      <option value="1–3 months">1–3 months</option>
                      <option value="3–6 months">3–6 months</option>
                      <option value="Just exploring">Just exploring for now</option>
                    </select>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    class="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    @click="goBack"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    :disabled="!form.project.trim()"
                    class="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-500 hover:bg-sky-400
                           disabled:opacity-50 transition-colors"
                    @click="goNext"
                  >
                    Continue
                  </button>
                </div>
              </div>

              <!-- Step 3: Contact -->
              <div v-else class="space-y-5">
                <h2 class="text-base font-bold text-slate-900 dark:text-white mb-1">Where should I reach you?</h2>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                      Name <span class="text-rose-400">*</span>
                    </label>
                    <input
                      v-model="form.name"
                      type="text"
                      required
                      class="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700
                             bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                             focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                      Email <span class="text-rose-400">*</span>
                    </label>
                    <input
                      v-model="form.email"
                      type="email"
                      required
                      class="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700
                             bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                             focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                    Company (optional)
                  </label>
                  <input
                    v-model="form.company"
                    type="text"
                    placeholder="Acme Corp"
                    class="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700
                           bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                           placeholder-slate-400 dark:placeholder-slate-600
                           focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30"
                  />
                </div>

                <p v-if="submitError" class="text-sm text-rose-500">{{ submitError }}</p>

                <div class="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    class="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    @click="goBack"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    :disabled="submitting || !form.name.trim() || !form.email.trim()"
                    class="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-500
                           hover:bg-sky-400 disabled:opacity-50 transition-colors"
                    @click="submit"
                  >
                    <Icon v-if="submitting" name="mdi:loading" class="animate-spin text-base" />
                    <Icon v-else name="mdi:send-outline" class="text-base" />
                    {{ submitting ? 'Sending…' : 'Send' }}
                  </button>
                </div>
              </div>
            </template>

          </div>
        </div>
      </div>
    </div>
  </PatternSection>
</template>
