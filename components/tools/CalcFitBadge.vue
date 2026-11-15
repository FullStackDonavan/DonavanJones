<script setup lang="ts">
import type { FitStatus } from '~/utils/llmMemory'

defineProps<{ status: FitStatus }>()
const MAP: Record<FitStatus, { tone: 'success' | 'warning' | 'danger'; label: string }> = {
  fits: { tone: 'success', label: 'Fits in VRAM' },
  tight: { tone: 'warning', label: 'Tight fit' },
  offload: { tone: 'danger', label: 'Needs CPU offload' },
}
</script>

<template>
  <UiBadge :tone="MAP[status].tone" dot>{{ MAP[status].label }}</UiBadge>
</template>
