<script setup lang="ts">
const props = defineProps<{
  title: string
  tagline?: string
  description: string
  badge?: string
  badgeIcon?: string
  price?: string
  format?: string
  ctaButtonText?: string
  ctaUrl?: string
  relatedCategoryLabel?: string
  relatedCategoryUrl?: string
  features?: string[]
  stripePriceId?: string
}>()

const form = reactive({ firstName: '', email: '' })
const submitting = ref(false)
const submitted = ref(false)
const submitError = ref('')

async function submit() {
  submitting.value = true
  submitError.value = ''
  try {
    await $fetch('/api/product-lead', {
      method: 'POST',
      body: {
        firstName: form.firstName,
        email: form.email,
        productTitle: props.title,
        productSlug: props.ctaUrl?.split('/').pop() ?? '',
      },
    })
    submitted.value = true
  } catch {
    submitError.value = 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-6 py-16 sm:py-24">

      <!-- Breadcrumb -->
      <nav class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500 mb-8">
        <NuxtLink to="/products/overview" class="hover:text-sky-400 transition-colors">Products</NuxtLink>
        <Icon name="mdi:chevron-right" class="text-slate-400 dark:text-slate-600" />
        <span class="text-slate-700 dark:text-slate-300 truncate max-w-xs">{{ title }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

        <!-- ── Left: product info ──────────────────────────────────── -->
        <div>
          <div
            v-if="badge"
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5
                   bg-sky-500/10 border border-sky-500/20 text-sky-500 dark:text-sky-400 text-xs font-medium"
          >
            <Icon :name="badgeIcon || 'mdi:package-variant-closed'" class="text-sm" />
            {{ badge }}
          </div>

          <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            {{ title }}
          </h1>

          <p v-if="tagline" class="mt-3 text-lg font-medium text-sky-500 dark:text-sky-400">
            {{ tagline }}
          </p>

          <p class="mt-4 text-slate-500 dark:text-slate-400 leading-relaxed text-base">
            {{ description }}
          </p>

          <!-- Features -->
          <ul v-if="features && features.length" class="mt-7 space-y-2.5">
            <li
              v-for="feature in features"
              :key="feature"
              class="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300"
            >
              <Icon name="mdi:check-circle-outline" class="text-emerald-400 shrink-0 mt-0.5 text-base" />
              {{ feature }}
            </li>
          </ul>
        </div>

        <!-- ── Right: lead magnet form + stat cards ────────────────── -->
        <div class="space-y-4">

          <!-- Lead capture card -->
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700/50
                      bg-slate-50 dark:bg-slate-900/60 overflow-hidden">

            <!-- Terminal chrome header -->
            <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <div class="flex gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                <span class="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
              <span class="text-[10px] text-slate-400 dark:text-slate-500 ml-1">
                {{ title.toLowerCase().replace(/\s+/g, '.') }}.download
              </span>
            </div>

            <!-- Success state -->
            <div v-if="submitted" class="p-8 text-center">
              <Icon name="mdi:check-circle-outline" class="text-emerald-400 text-4xl mb-3" />
              <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">You're all set!</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Check your inbox — the download link is on its way.
              </p>
            </div>

            <!-- Form -->
            <form v-else @submit.prevent="submit" class="p-6 space-y-5">

              <div>
                <p class="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">
                  Get free access
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  Enter your name and email and I'll send it straight to your inbox.
                </p>
              </div>

              <!-- First Name -->
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

              <!-- Error -->
              <p v-if="submitError" class="text-sm text-rose-500">{{ submitError }}</p>

              <!-- Submit -->
              <button
                type="submit"
                :disabled="submitting"
                class="block w-full py-3 px-6 text-center rounded-xl font-semibold text-sm text-white
                       transition duration-500 hover:scale-105
                       bg-purple-600 hover:bg-purple-700 active:bg-purple-800
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                       flex items-center justify-center gap-2"
              >
                <Icon v-if="submitting" name="mdi:loading" class="text-base animate-spin" />
                <Icon v-else name="mdi:download-outline" class="text-base" />
                {{ submitting ? 'Sending…' : 'Get Instant Access' }}
              </button>

              <p class="text-xs text-slate-400 dark:text-slate-500 text-center">
                No spam. Unsubscribe at any time.
              </p>

            </form>
          </div>

          <!-- Hero stat cards from slot -->
          <div class="grid grid-cols-2 gap-3">
            <slot name="right" />
          </div>

        </div>

      </div>
    </div>
  </div>
</template>
