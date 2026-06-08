<script setup lang="ts">
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'
useSeoMeta({
  title: 'About Me — Donavan Jones',
  description: 'Learn about Donavan Jones — full-stack engineer, builder, and the person behind the projects.',
  ogTitle: 'About Me — Donavan Jones',
  ogDescription: 'Learn about Donavan Jones — full-stack engineer, builder, and the person behind the projects.',
  ogType: 'website',
  ogImage: `${_SITE}/img/logo.png`,
  ogUrl: `${_SITE}/about-me`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'About Me — Donavan Jones',
  twitterDescription: 'Learn about Donavan Jones — full-stack engineer and builder.',
  canonical: `${_SITE}/about-me`,
})
</script>

<template>
  <PatternSection>
    <BasicSection
      class="flex flex-col items-center justify-center text-center space-y-4"
    >
      <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">A Game About Me</h1>
      <ParagraphDescription>
        Play my game to get to get to know me better!
      </ParagraphDescription>
      <Game
    /></BasicSection>
    <!-- Other sections -->
  </PatternSection>
</template>
