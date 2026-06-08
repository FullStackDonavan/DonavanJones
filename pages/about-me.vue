<script setup lang="ts">
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'
useSeoMeta({ canonical: `${_SITE}/about-me` })
</script>

<template>
  <PatternSection>
    <BasicSection
      class="flex flex-col items-center justify-center text-center space-y-4"
    >
      <HeadlineTwo>A Game About Me</HeadlineTwo>
      <ParagraphDescription>
        Play my game to get to get to know me better!
      </ParagraphDescription>
      <Game
    /></BasicSection>
    <!-- Other sections -->
  </PatternSection>
</template>
