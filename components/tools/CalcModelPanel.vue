<script setup lang="ts">
// Model inputs shared by every calculator: preset / size shortcut, precision,
// architecture (layers, heads, KV heads, head dim) and runtime overhead.
import { MODEL_PRESETS, QUANT_FORMATS, formatParams, formatTokens } from '~/utils/llmMemory'

const props = withDefaults(defineProps<{ archOpen?: boolean; showOverhead?: boolean; showQuant?: boolean }>(), {
  archOpen: false,
  showOverhead: true,
  showQuant: true,
})

const { state, preset, validation, attention, quant, selectModel, editArch } = useLlmCalculator()

// Size shortcuts map to the preset of that size, so the KV estimate keeps a real architecture.
const SIZE_SHORTCUTS = [
  { label: '270M', id: 'gemma-3-270m' },
  { label: '1B', id: 'llama-3.2-1b' },
  { label: '3B', id: 'llama-3.2-3b' },
  { label: '7B', id: 'mistral-7b' },
  { label: '8B', id: 'llama-3.1-8b' },
  { label: '9B', id: 'gemma-2-9b' },
  { label: '14B', id: 'qwen2.5-14b' },
  { label: '32B', id: 'qwen2.5-32b' },
  { label: '70B', id: 'llama-3.3-70b' },
  { label: '72B', id: 'qwen2.5-72b' },
]

// v-model (not :value) so SSR marks the right <option> selected.
const modelChoice = computed({
  get: () => state.value.modelId,
  set: (id: string) => (id === 'custom' ? (state.value.modelId = 'custom') : selectModel(id)),
})

const archExpanded = ref(props.archOpen || state.value.modelId === 'custom')
watch(() => state.value.modelId, (id) => { if (id === 'custom') archExpanded.value = true })

const quantOptions = QUANT_FORMATS.map((q) => ({ value: q.id, label: q.label.split(' ')[0], title: `${q.label}: ${q.effectiveBits} bits/weight` }))
</script>

<template>
  <section class="ds-surface p-4 sm:p-5 space-y-5" aria-labelledby="model-panel-h">
    <div class="flex items-center justify-between gap-2">
      <h2 id="model-panel-h" class="ds-h3">Model</h2>
      <UiBadge :tone="attention === 'MHA' ? 'neutral' : 'info'" :title="`${state.heads} query heads, ${state.kvHeads} KV heads`">{{ attention }}</UiBadge>
    </div>

    <div>
      <label for="model-preset" class="ds-label">Model preset</label>
      <select
        id="model-preset"
        class="ds-input"
        v-model="modelChoice"
      >
        <option v-for="m in MODEL_PRESETS" :key="m.id" :value="m.id">{{ m.name }} · {{ formatParams(m.paramsB) }}</option>
        <option value="custom">Custom architecture</option>
      </select>
      <div class="mt-2 flex flex-wrap gap-1" role="group" aria-label="Quick pick by size">
        <button
          v-for="s in SIZE_SHORTCUTS"
          :key="s.id"
          type="button"
          class="rounded px-2 py-0.5 text-xs font-medium tabular-nums border transition-colors ds-focus"
          :class="state.modelId === s.id
            ? 'border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-300'
            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'"
          :aria-pressed="state.modelId === s.id"
          @click="selectModel(s.id)"
        >{{ s.label }}</button>
      </div>
      <p v-if="preset" class="mt-2 ds-muted">
        {{ preset.layers }} layers · {{ preset.heads }} heads / {{ preset.kvHeads }} KV · head dim {{ preset.headDim }} · native context {{ formatTokens(preset.maxContext) }}
      </p>
    </div>

    <div v-if="showQuant">
      <p id="quant-label" class="ds-label">Weight precision</p>
      <UiSegmented v-model="state.quantId" :options="quantOptions" label="Weight precision" size="sm" />
      <p class="mt-2 ds-muted">
        <span class="font-medium text-slate-700 dark:text-slate-300">{{ quant.label }}</span>
        — {{ quant.effectiveBits }} effective bits/weight
        <template v-if="quant.effectiveBits !== quant.nominalBits">(nominal {{ quant.nominalBits }})</template>. {{ quant.note }}
      </p>
    </div>

    <div>
      <button
        type="button"
        class="flex w-full items-center justify-between text-left text-sm font-medium text-slate-700 dark:text-slate-300 ds-focus rounded"
        :aria-expanded="archExpanded"
        aria-controls="arch-fields"
        @click="archExpanded = !archExpanded"
      >
        Architecture
        <Icon name="mdi:chevron-down" class="text-lg transition-transform" :class="archExpanded ? 'rotate-180' : ''" aria-hidden="true" />
      </button>
      <div v-show="archExpanded" id="arch-fields" class="mt-3 grid grid-cols-2 gap-3">
        <UiNumberField
          class="col-span-2"
          label="Parameters"
          unit="B"
          :min="0.01"
          :max="2000"
          :model-value="state.paramsB"
          :error="validation.errors.paramsB"
          hint="Billions of parameters (0.27 = 270M)."
          @update:model-value="editArch('paramsB', $event)"
        />
        <UiNumberField label="Layers" integer :min="1" :max="512" :model-value="state.layers" :error="validation.errors.layers" @update:model-value="editArch('layers', $event)" />
        <UiNumberField label="Head dimension" integer :min="1" :max="1024" :model-value="state.headDim" :error="validation.errors.headDim" @update:model-value="editArch('headDim', $event)" />
        <UiNumberField label="Attention heads" integer :min="1" :max="512" :model-value="state.heads" :error="validation.errors.heads" @update:model-value="editArch('heads', $event)" />
        <UiNumberField
          label="KV heads"
          integer
          :min="1"
          :max="512"
          :model-value="state.kvHeads"
          :error="validation.errors.kvHeads"
          hint="= heads for MHA, 1 for MQA"
          @update:model-value="editArch('kvHeads', $event)"
        />
      </div>
    </div>

    <div v-if="showOverhead" class="grid grid-cols-2 gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
      <UiNumberField v-model="state.overheadPct" label="Compute overhead" unit="%" :min="0" :max="100" hint="Activations, buffers (% of weights)" />
      <UiNumberField v-model="state.runtimeGiB" label="Runtime context" unit="GB" :min="0" :max="8" step="0.1" hint="CUDA context, allocator" />
    </div>
  </section>
</template>
