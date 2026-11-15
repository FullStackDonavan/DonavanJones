<script setup lang="ts">
const { state, allGpus, gpu } = useLlmCalculator()
const countOptions = [1, 2, 3, 4].map((n) => ({ value: n, label: `×${n}` }))
</script>

<template>
  <section class="ds-surface p-4 sm:p-5 space-y-4" aria-labelledby="gpu-panel-h">
    <h2 id="gpu-panel-h" class="ds-h3">Target GPU</h2>
    <div>
      <label for="gpu-select" class="ds-label">GPU</label>
      <select id="gpu-select" v-model="state.gpuId" class="ds-input">
        <option v-for="g in allGpus" :key="g.id" :value="g.id">{{ g.name }}{{ g.custom ? ' (custom)' : '' }}</option>
      </select>
      <p class="mt-2 ds-muted">
        {{ gpu.vramGiB }} GB · {{ gpu.bandwidthGBs }} GB/s · {{ gpu.reservedGiB }} GB held by {{ gpu.unified ? 'the OS (unified memory)' : 'driver/display' }}
      </p>
    </div>
    <div>
      <p class="ds-label">Number of GPUs</p>
      <UiSegmented v-model="state.gpuCount" :options="countOptions" label="Number of GPUs" size="sm" />
      <p v-if="state.gpuCount > 1" class="mt-2 ds-muted">Assumes the model is split across cards (tensor or layer split); each card keeps its own reserve.</p>
    </div>
    <NuxtLink :to="{ path: '/tools/gpu-comparison', query: $route.query }" class="ds-link text-xs inline-flex items-center gap-1">
      Compare GPUs or add a custom one <Icon name="mdi:arrow-right" aria-hidden="true" />
    </NuxtLink>
  </section>
</template>
