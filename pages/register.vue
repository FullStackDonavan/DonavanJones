<script setup lang="ts">
import { registerWithEmail } from '~/composables/useAuth'

definePageMeta({ middleware: 'guest' })

useSeoMeta({
  title: 'Create Account — Donavan Jones',
  robots: 'noindex',
})

const route = useRoute()
// Only allow internal paths as post-registration destinations
const redirectTo = computed(() => {
  const r = route.query.redirect as string | undefined
  return r && r.startsWith('/') && !r.startsWith('//') ? r : '/profile'
})

const form = reactive({
  username: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  password: '',
})
const loading = ref(false)
const errorMessage = ref('')
const fieldErrors = ref<Record<string, string>>({})

async function submit() {
  errorMessage.value = ''
  fieldErrors.value = {}
  loading.value = true
  const result = await registerWithEmail(
    form.username, form.firstName, form.lastName, form.phone, form.email, form.password, redirectTo.value,
  )
  loading.value = false

  if (result.hasErrors) {
    const messages: string[] = []
    result.errors?.forEach((v, key) => {
      const msg = (v.message as any)?.errorMessage || (typeof v.message === 'string' ? v.message : '')
      if (msg) {
        fieldErrors.value[key] = msg
        messages.push(msg)
      }
    })
    errorMessage.value = messages.length ? '' : 'Something went wrong. Please check the form and try again.'
  }
}

const fields = [
  { key: 'username',  label: 'Username',   type: 'text',     autocomplete: 'username',    placeholder: 'yourhandle' },
  { key: 'firstName', label: 'First Name', type: 'text',     autocomplete: 'given-name',  placeholder: 'First name' },
  { key: 'lastName',  label: 'Last Name',  type: 'text',     autocomplete: 'family-name', placeholder: 'Last name' },
  { key: 'phone',     label: 'Phone',      type: 'tel',      autocomplete: 'tel',         placeholder: '555 123 4567' },
  { key: 'email',     label: 'Email',      type: 'email',    autocomplete: 'email',       placeholder: 'you@example.com' },
  { key: 'password',  label: 'Password',   type: 'password', autocomplete: 'new-password', placeholder: 'At least 8 characters' },
] as const
</script>

<template>
  <PatternSection>
    <div class="min-h-screen flex items-center justify-center px-6 py-24">
      <div class="max-w-md w-full">

        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create your account</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Use the same email you buy with and your purchases appear on your profile automatically.
          </p>
        </div>

        <form
          class="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 p-6 space-y-4"
          @submit.prevent="submit"
        >
          <div v-for="f in fields" :key="f.key">
            <label :for="f.key" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
              {{ f.label }}
            </label>
            <input
              :id="f.key"
              v-model="form[f.key]"
              :type="f.type"
              :autocomplete="f.autocomplete"
              :placeholder="f.placeholder"
              required
              class="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border
                     text-slate-900 dark:text-white placeholder-slate-400
                     focus:outline-none focus:border-sky-500/60 transition-colors"
              :class="fieldErrors[f.key]
                ? 'border-red-400 dark:border-red-500/60'
                : 'border-slate-200 dark:border-slate-700'"
            >
            <p v-if="fieldErrors[f.key]" class="mt-1 text-xs text-red-500 dark:text-red-400">
              {{ fieldErrors[f.key] }}
            </p>
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
            <Icon :name="loading ? 'mdi:loading' : 'mdi:account-plus'" class="text-base" :class="{ 'animate-spin': loading }" />
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <p class="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Already have an account?
          <NuxtLink
            :to="{ path: '/login', query: route.query.redirect ? { redirect: route.query.redirect } : {} }"
            class="text-sky-500 hover:text-sky-400 font-medium transition-colors"
          >
            Log in
          </NuxtLink>
        </p>

      </div>
    </div>
  </PatternSection>
</template>
