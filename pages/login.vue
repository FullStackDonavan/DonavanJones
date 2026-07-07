<script setup lang="ts">
import { loginWithEmail } from '~/composables/useAuth'

definePageMeta({ middleware: 'guest' })

useSeoMeta({
  title: 'Log In — Donavan Jones',
  robots: 'noindex',
})

const route = useRoute()
// Only allow internal paths as post-login destinations
const redirectTo = computed(() => {
  const r = route.query.redirect as string | undefined
  return r && r.startsWith('/') && !r.startsWith('//') ? r : '/profile'
})

const usernameOrEmail = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function submit() {
  errorMessage.value = ''
  loading.value = true
  const result = await loginWithEmail(usernameOrEmail.value, password.value, redirectTo.value)
  loading.value = false

  if (result.hasErrors) {
    const messages: string[] = []
    result.errors?.forEach((v) => {
      const msg = (v.message as any)?.errorMessage || (typeof v.message === 'string' ? v.message : '')
      if (msg) messages.push(msg)
    })
    errorMessage.value = messages.join('. ') || 'Invalid credentials. Please try again.'
  }
}
</script>

<template>
  <PatternSection>
    <div class="min-h-screen flex items-center justify-center px-6 py-24">
      <div class="max-w-md w-full">

        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Log in to access your purchased products.
          </p>
        </div>

        <form
          class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-6 space-y-4"
          @submit.prevent="submit"
        >
          <div>
            <label for="usernameOrEmail" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
              Username or Email
            </label>
            <input
              id="usernameOrEmail"
              v-model="usernameOrEmail"
              type="text"
              required
              autocomplete="username"
              class="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                     text-slate-900 dark:text-white placeholder-slate-400
                     focus:outline-none focus:border-sky-500/60 transition-colors"
              placeholder="you@example.com"
            >
          </div>

          <div>
            <label for="password" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              class="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                     text-slate-900 dark:text-white placeholder-slate-400
                     focus:outline-none focus:border-sky-500/60 transition-colors"
              placeholder="••••••••"
            >
          </div>

          <p v-if="errorMessage" class="text-sm text-red-500 dark:text-red-400">
            {{ errorMessage }}
          </p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm text-white
                   bg-sky-500 hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed
                   transition-colors duration-150"
          >
            <Icon :name="loading ? 'mdi:loading' : 'mdi:login'" class="text-base" :class="{ 'animate-spin': loading }" />
            {{ loading ? 'Logging in...' : 'Log In' }}
          </button>
        </form>

        <p class="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          No account yet?
          <NuxtLink
            :to="{ path: '/register', query: route.query.redirect ? { redirect: route.query.redirect } : {} }"
            class="text-sky-500 hover:text-sky-400 font-medium transition-colors"
          >
            Create one
          </NuxtLink>
        </p>

      </div>
    </div>
  </PatternSection>
</template>
