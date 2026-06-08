<script setup lang="ts">
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'

useSeoMeta({
  title: 'Terms of Service — Donavan Jones',
  description: 'Terms of service for donavanjones.com. Understand the terms governing your use of this site.',
  canonical: `${_SITE}/terms`,
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
          <Icon name="mdi:file-document-outline" class="text-sm" />
          Legal
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          Terms of Service
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
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">Agreement to Terms</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            By accessing and using <strong class="text-slate-800 dark:text-slate-200">donavanjones.com</strong>,
            you agree to be bound by these Terms of Service. If you do not agree to these terms,
            please do not use this site.
          </p>
        </div>

        <div
          class="rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">Use of the Site</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            This site is provided for informational and educational purposes. You may use it for lawful purposes only. You agree not to:
          </p>
          <ul class="space-y-2">
            <li
              v-for="item in [
                'Use the site in any way that violates applicable laws or regulations',
                'Attempt to gain unauthorized access to any part of the site or its infrastructure',
                'Scrape, harvest, or collect content in bulk using automated tools without permission',
                'Use the site to transmit spam or unsolicited communications',
                'Reproduce, redistribute, or sell content from this site without written permission',
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
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">Intellectual Property</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            All content on this site — including articles, code samples, diagrams, design, and written material —
            is the intellectual property of Donavan Jones unless otherwise noted.
            You are welcome to read, share, and reference content with proper attribution.
            Republishing or reproducing substantial portions without permission is not permitted.
          </p>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-3">
            Code snippets shared in blog posts are provided for educational purposes and may be used freely
            in personal or commercial projects unless a specific license is stated otherwise.
          </p>
        </div>

        <div
          class="rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">Disclaimer of Warranties</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            This site and its content are provided "as is" without warranty of any kind, express or implied.
            Donavan Jones makes no representations about the accuracy, completeness, or suitability of
            any content for any particular purpose. Technical articles reflect knowledge at the time of writing
            and may become outdated as technologies evolve.
          </p>
        </div>

        <div
          class="rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">Limitation of Liability</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            To the fullest extent permitted by law, Donavan Jones shall not be liable for any direct, indirect,
            incidental, special, or consequential damages arising from your use of this site or reliance
            on any content published here. This includes but is not limited to damages from errors,
            omissions, or technical inaccuracies in articles or code examples.
          </p>
        </div>

        <div
          class="rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">External Links</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            This site may contain links to external websites and resources.
            These links are provided for convenience and reference only.
            Donavan Jones has no control over the content or practices of external sites
            and accepts no responsibility for them. Linking to an external resource does not
            constitute endorsement of its content.
          </p>
        </div>

        <div
          class="rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">Availability</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            This site is a self-hosted personal project. No guarantee of uptime, availability,
            or uninterrupted access is made. The site may be taken offline for maintenance,
            updates, or infrastructure changes at any time without notice.
          </p>
        </div>

        <div
          class="rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">Governing Law</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            These terms are governed by the laws of the United States. Any disputes arising from
            your use of this site shall be subject to the exclusive jurisdiction of the applicable courts.
          </p>
        </div>

        <div
          class="rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50
                 bg-white dark:bg-slate-900/60"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">Contact</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            If you have any questions about these terms, you can reach out via email at
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
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-3">Changes to These Terms</h2>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            These terms may be updated at any time. Changes will be reflected on this page with an updated date.
            Continued use of the site after any changes constitutes acceptance of the updated terms.
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
            to="/privacy"
            class="inline-flex items-center gap-1.5 text-sm text-sky-500 hover:text-sky-400 transition-colors"
          >
            Privacy Policy
            <Icon name="mdi:arrow-right" class="text-base" />
          </NuxtLink>
        </div>

      </div>
    </div>
  </PatternSection>
</template>
