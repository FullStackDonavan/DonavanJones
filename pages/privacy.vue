<script setup lang="ts">
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'

useSeoMeta({
  title: 'Privacy Policy — Donavan Jones',
  description: 'Privacy policy for donavanjones.com. Learn how data is collected, used, and protected.',
  canonical: `${_SITE}/privacy`,
})
</script>

<template>
  <PatternSection>
    <div class="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-3xl mx-auto px-6 py-16 sm:py-24 text-center">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6
                 bg-sky-500/10 border border-sky-500/20 text-sky-500 dark:text-sky-400 text-xs font-medium"
        >
          <Icon name="mdi:shield-lock-outline" class="text-sm" />
          Legal
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p class="mt-4 text-base text-slate-500 dark:text-slate-400">
          Last updated: June 7, 2025
        </p>
      </div>
    </div>

    <div class="bg-slate-50 dark:bg-slate-950 py-14">
      <div class="max-w-3xl mx-auto px-6 space-y-8">

        <div
          class="rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">Overview</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            This website (<strong class="text-slate-800 dark:text-slate-200">donavanjones.com</strong>) is a personal portfolio and blog operated by Donavan Jones.
            Your privacy matters. This policy explains what information is collected when you visit this site,
            how it is used, and what choices you have.
          </p>
        </div>

        <div
          class="rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">Information Collected</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            This site does not require you to create an account or submit personal information to browse content.
            The following data may be collected automatically:
          </p>
          <ul class="space-y-2">
            <li
              v-for="item in [
                'Page views and navigation paths',
                'Browser type and version',
                'Operating system',
                'Referring URL',
                'Approximate geographic location (country/region level)',
                'Date and time of visits',
              ]"
              :key="item"
              class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
            >
              <Icon name="mdi:circle-small" class="text-sky-400 text-lg flex-shrink-0 mt-0.5" />
              {{ item }}
            </li>
          </ul>
        </div>

        <div
          class="rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">How Information Is Used</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Any data collected is used solely to understand how visitors interact with the site and to improve the user experience. Specifically:
          </p>
          <ul class="space-y-2">
            <li
              v-for="item in [
                'Analyzing which content is most useful to readers',
                'Identifying and fixing technical issues',
                'Understanding general traffic patterns',
              ]"
              :key="item"
              class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
            >
              <Icon name="mdi:circle-small" class="text-sky-400 text-lg flex-shrink-0 mt-0.5" />
              {{ item }}
            </li>
          </ul>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
            Your data is never sold, rented, or shared with third parties for advertising purposes.
          </p>
        </div>

        <div
          class="rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">Cookies</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            This site may use essential cookies to support core functionality such as theme preferences (light/dark mode).
            No tracking cookies or third-party advertising cookies are used.
            You can disable cookies in your browser settings at any time without affecting your ability to read content.
          </p>
        </div>

        <div
          class="rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">Third-Party Services</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            This site may use third-party services for analytics or hosting infrastructure.
            These services operate under their own privacy policies and may collect usage data as described in their respective terms.
            No personal data is knowingly transmitted to third parties beyond what is required for site operation.
          </p>
        </div>

        <div
          class="rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">External Links</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            This site contains links to external websites including GitHub, LinkedIn, and other platforms.
            These sites are not operated by Donavan Jones and are subject to their own privacy policies.
            This privacy policy applies only to <strong class="text-slate-800 dark:text-slate-200">donavanjones.com</strong>.
          </p>
        </div>

        <div
          class="rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">Data Retention</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Aggregate analytics data is retained only as long as needed to understand site usage trends.
            No personally identifiable information is stored on this site's servers.
          </p>
        </div>

        <div
          class="rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">Your Rights</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            You have the right to request information about any data collected about you and to request its deletion.
            Since this site does not collect personally identifiable information, there is typically nothing to retrieve or delete.
            If you have concerns, please reach out directly.
          </p>
        </div>

        <div
          class="rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">Contact</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            If you have any questions about this privacy policy, you can reach out via email at
            <a
              href="mailto:donavanjones79@gmail.com"
              class="text-sky-500 hover:text-sky-400 transition-colors"
            >donavanjones79@gmail.com</a>.
          </p>
        </div>

        <div
          class="rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">Changes to This Policy</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            This policy may be updated from time to time. Any changes will be reflected on this page with an updated date.
            Continued use of the site after changes constitutes acceptance of the updated policy.
          </p>
        </div>

        <div class="pt-2 flex gap-4">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <Icon name="mdi:arrow-left" class="text-base" />
            Back to Home
          </NuxtLink>
          <NuxtLink
            to="/terms"
            class="inline-flex items-center gap-1.5 text-sm text-sky-500 hover:text-sky-400 transition-colors"
          >
            Terms of Service
            <Icon name="mdi:arrow-right" class="text-base" />
          </NuxtLink>
        </div>

      </div>
    </div>
  </PatternSection>
</template>
