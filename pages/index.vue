<script setup lang="ts">
const config = useRuntimeConfig()
const SITE = (config.public.appDomain as string) || 'https://donavanjones.com'

useSeoMeta({
  title: 'Donavan Jones — Full-Stack Engineer',
  description:
    'Full-stack engineer specializing in Nuxt 3, Vue 3, Node.js, AI systems, RAG pipelines, and self-hosted Kubernetes infrastructure.',
  ogTitle: 'Donavan Jones — Full-Stack Engineer',
  ogDescription:
    'Full-stack engineer specializing in Nuxt 3, Vue 3, Node.js, AI systems, RAG pipelines, and self-hosted Kubernetes infrastructure.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Donavan Jones — Full-Stack Engineer',
  twitterDescription:
    'Full-stack engineer specializing in Nuxt 3, Vue 3, Node.js, AI systems, RAG pipelines, and self-hosted Kubernetes infrastructure.',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        '@id': `${SITE}/`,
        url: `${SITE}/`,
        name: 'Donavan Jones — Full-Stack Engineer',
        description:
          'Full-stack engineer specializing in Nuxt 3, Vue 3, Node.js, AI systems, RAG pipelines, and self-hosted Kubernetes infrastructure.',
        mainEntity: { '@id': `${SITE}/#person` },
        isPartOf: { '@id': `${SITE}/#website` },
      }),
    },
  ],
})
</script>

<template>
  <PatternSection>

  <section
    class="relative w-full py-24 md:py-32 overflow-hidden
           bg-white dark:bg-gray-900 transition-colors duration-300"
  >
    <!-- Background decorative glow (light/dark aware) -->
    <div class="absolute inset-0 -z-10">
      <div
        class="absolute top-[-120px] left-1/2 -translate-x-1/2
               w-[500px] h-[500px] rounded-full blur-3xl opacity-30
               bg-blue-200 dark:bg-blue-900"
      />
      <div
        class="absolute bottom-[-120px] right-[-80px]
               w-[400px] h-[400px] rounded-full blur-3xl opacity-20
               bg-purple-200 dark:bg-purple-900"
      />
    </div>

    <div class="max-w-5xl mx-auto px-6 relative">

      <!-- Main headline -->
      <h1
        class="text-4xl md:text-6xl font-bold leading-tight tracking-tight
               text-gray-900 dark:text-white"
      >
        I build modern web apps that are
        <span class="text-blue-600 dark:text-blue-400">fast</span>,
        <span class="text-blue-600 dark:text-blue-400">scalable</span>,
        and
        <span class="text-blue-600 dark:text-blue-400">user-focused</span>.
      </h1>

      <!-- Subheading -->
      <p
        class="mt-6 text-lg md:text-xl max-w-2xl
               text-gray-600 dark:text-gray-300"
      >
        Full-stack web developer specializing in Vue, Nuxt, Node.js, and AI-powered applications.
        I turn ideas into production-ready products.
      </p>

      <!-- CTA buttons -->
      <div class="mt-8 flex flex-wrap gap-4">
        <a
          href="/projects/overview"
          class="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium
                 hover:bg-blue-700 transition"
        >
          View Projects
        </a>

        <a
          href="/resume.pdf"
          class="px-6 py-3 rounded-xl border
                 border-gray-300 dark:border-gray-700
                 text-gray-800 dark:text-gray-200
                 hover:border-gray-500 dark:hover:border-gray-500
                 transition"
        >
          Download Resume
        </a>

        <a
          href="#contact"
          class="px-6 py-3 rounded-xl text-gray-700 dark:text-gray-300
                 hover:text-black dark:hover:text-white transition"
        >
          Contact Me
        </a>
      </div>

      <!-- Credibility line -->
      <div
        class="mt-10 text-sm
               text-gray-500 dark:text-gray-400"
      >
        Focused on SaaS, dashboards, AI tools, and real-time web systems.
      </div>

      <!-- Currently building -->
      <div class="mt-4 inline-flex items-center gap-2 text-sm">
        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        <span class="text-gray-600 dark:text-gray-300">
          Currently building: AI-powered Bible study platform & dev tools
        </span>
      </div>

    </div>
  </section>

  </PatternSection>
</template>
