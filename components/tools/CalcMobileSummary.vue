<script setup lang="ts">
// Sticky results bar for phones and tablets (< lg), where the inputs stack
// above the results. Shows the headline numbers while you edit, and hides
// itself whenever the full results panel is on screen.
import type { FitStatus, MemoryEstimate } from '~/utils/llmMemory'

const props = defineProps<{
  /** id of the results element to watch and jump to */
  target: string
  label: string
  value: string
  detail?: string
  status?: FitStatus
  est?: MemoryEstimate
  capacity?: number
}>()

const resultsVisible = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  const el = document.getElementById(props.target)
  if (!el || !('IntersectionObserver' in window)) return
  observer = new IntersectionObserver(([entry]) => { resultsVisible.value = entry.isIntersecting }, { threshold: 0.15 })
  observer.observe(el)
})
onBeforeUnmount(() => observer?.disconnect())

function jump() {
  const el = document.getElementById(props.target)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  // move focus for keyboard / screen-reader users without a second scroll
  el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}
</script>

<template>
  <!-- spacer so the bar never covers the end of the page -->
  <div class="h-20 lg:hidden" aria-hidden="true" />
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="translate-y-full opacity-0"
    leave-active-class="transition duration-150 ease-in"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-show="!resultsVisible"
      class="fixed inset-x-0 bottom-0 z-40 lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
      role="region"
      aria-label="Results summary"
    >
      <div class="ds-container flex items-center gap-3 py-2.5">
        <div class="min-w-0 flex-1" aria-live="polite">
          <div class="flex items-baseline gap-2">
            <span class="ds-muted shrink-0">{{ label }}</span>
            <span class="text-lg font-semibold tabular-nums text-slate-900 dark:text-white">{{ value }}</span>
            <CalcFitBadge v-if="status" :status="status" class="shrink-0" />
          </div>
          <p v-if="detail" class="truncate text-xs text-slate-600 dark:text-slate-400">{{ detail }}</p>
          <CalcMemoryBar v-if="est && capacity !== undefined" :est="est" :capacity="capacity" compact :show-legend="false" class="mt-1.5" />
        </div>
        <button type="button" class="ds-btn-secondary shrink-0 h-8 px-2 min-[420px]:px-2.5 text-xs" aria-label="Jump to results" @click="jump">
          <span class="hidden min-[420px]:inline">Results</span> <Icon name="mdi:arrow-down" aria-hidden="true" />
        </button>
      </div>
    </div>
  </Transition>
</template>
