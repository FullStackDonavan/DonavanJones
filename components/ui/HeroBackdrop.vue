<script setup lang="ts">
// Decorative hero art. Sits behind a hero's content (the parent needs
// `relative isolate overflow-hidden`) and is faded into the background with a
// scrim, so headings keep full contrast. Purely decorative: empty alt, hidden
// from assistive tech. The same file is the page's og:image.
//
// side="right"  for left-aligned heroes: art on the right, fading out under the copy
// side="full"   for centred heroes: art across the whole hero under an even scrim
// tone="dark"   for heroes that are dark in both themes (no light scrim)
// lazy        for art below the fold (CTAs, lower sections): lazy-load, normal priority
withDefaults(defineProps<{ src: string; side?: 'right' | 'full'; tone?: 'auto' | 'dark'; lazy?: boolean }>(), { side: 'right', tone: 'auto', lazy: false })

const RIGHT_MASK = 'mask-image: linear-gradient(to right, transparent, black 45%); -webkit-mask-image: linear-gradient(to right, transparent, black 45%);'
</script>

<template>
  <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <img
      :src="src"
      alt=""
      width="1200"
      height="630"
      :fetchpriority="lazy ? 'auto' : 'high'"
      :loading="lazy ? 'lazy' : 'eager'"
      decoding="async"
      class="absolute inset-y-0 right-0 h-full object-cover"
      :class="[
        side === 'full' ? 'w-full' : 'w-full md:w-[70%]',
        tone === 'dark' ? 'opacity-50' : 'opacity-40 dark:opacity-60',
      ]"
      :style="side === 'right' ? RIGHT_MASK : undefined"
    />
    <div
      v-if="side === 'right'"
      class="absolute inset-0 bg-gradient-to-r"
      :class="tone === 'dark'
        ? 'from-slate-900 via-slate-900/85 to-slate-900/20'
        : 'from-white via-white/85 to-white/30 dark:from-slate-950 dark:via-slate-950/85 dark:to-slate-950/20'"
    />
    <div
      v-else
      class="absolute inset-0"
      :class="tone === 'dark' ? 'bg-slate-900/75' : 'bg-white/80 dark:bg-slate-950/75'"
    />
  </div>
</template>
