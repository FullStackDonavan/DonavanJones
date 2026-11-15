<script setup lang="ts">
import { CONTEXT_SIZES, KV_PRECISIONS, formatTokens } from '~/utils/llmMemory'

const { state, preset } = useLlmCalculator()
const ctxOptions = CONTEXT_SIZES.map((c) => ({ value: c, label: formatTokens(c) }))
const kvOptions = KV_PRECISIONS.map((p) => ({ value: p, label: p, title: p === 'Q4' ? 'llama.cpp q4_0 KV cache, 4.5 bits/element' : undefined }))
const overNative = computed(() => preset.value && state.value.contextTokens > preset.value.maxContext)
</script>

<template>
  <section class="ds-surface p-4 sm:p-5 space-y-5" aria-labelledby="ctx-panel-h">
    <h2 id="ctx-panel-h" class="ds-h3">Context &amp; batch</h2>
    <div>
      <p class="ds-label">Context length (tokens per sequence)</p>
      <UiSegmented v-model="state.contextTokens" :options="ctxOptions" label="Context length" size="sm" />
      <p v-if="overNative" class="mt-2 text-xs text-amber-700 dark:text-amber-400">
        Above {{ preset!.name }}’s native {{ formatTokens(preset!.maxContext) }} window: needs rope scaling, and quality may drop.
      </p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <p class="ds-label">KV cache precision</p>
        <UiSegmented v-model="state.kvPrecision" :options="kvOptions" label="KV cache precision" size="sm" />
      </div>
      <UiNumberField
        v-model="state.sequences"
        label="Concurrent sequences"
        integer
        :min="1"
        :max="256"
        hint="Batch size / parallel requests"
      />
    </div>
  </section>
</template>
