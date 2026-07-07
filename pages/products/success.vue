<script setup lang="ts">
const route = useRoute()
const sessionId = computed(() => route.query.session_id as string | undefined)

useSeoMeta({
  title: 'Purchase Complete — Donavan Jones',
  robots: 'noindex',
})
</script>

<template>
  <PatternSection>
    <div class="min-h-screen flex items-center justify-center px-6 py-24">
      <div class="max-w-md w-full text-center">

        <div v-if="sessionId">
          <div class="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <Icon name="mdi:check" class="text-3xl text-emerald-400" />
          </div>

          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            You're all set!
          </h1>
          <p class="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
            Your purchase is confirmed and a confirmation email is on the way.
            Create an account with the same email you bought with (or log in if
            you already have one) and your guide unlocks automatically.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <NuxtLink
              to="/register"
              class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                     bg-sky-500 hover:bg-sky-600 text-white transition-colors duration-200"
            >
              <Icon name="mdi:account-plus" class="text-base" />
              Create Your Account
            </NuxtLink>
            <NuxtLink
              to="/login"
              class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                     border border-slate-200 dark:border-slate-700
                     text-slate-600 dark:text-slate-400
                     hover:border-sky-500/40 hover:text-sky-500 dark:hover:text-sky-400
                     transition-colors duration-200"
            >
              <Icon name="mdi:login" class="text-base" />
              Log In
            </NuxtLink>
            <NuxtLink
              to="/blog/overview"
              class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                     border border-slate-200 dark:border-slate-700
                     text-slate-600 dark:text-slate-400
                     hover:border-sky-500/40 hover:text-sky-500 dark:hover:text-sky-400
                     transition-colors duration-200"
            >
              <Icon name="mdi:book-open-outline" class="text-base" />
              Read the Blog
            </NuxtLink>
          </div>
        </div>

        <div v-else class="text-slate-400">
          <Icon name="mdi:loading" class="text-4xl animate-spin mb-4" />
          <p>Loading…</p>
        </div>

      </div>
    </div>
  </PatternSection>
</template>
