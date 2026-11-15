<script setup lang="ts">
// Numeric input with label, unit suffix, hint and validation message.
// Emits only finite numbers inside [min, max]; anything else shows an error and
// leaves the model untouched, so calculations never see NaN.
const props = withDefaults(
  defineProps<{
    modelValue: number
    label: string
    min?: number
    max?: number
    step?: number | 'any'
    unit?: string
    hint?: string
    error?: string
    integer?: boolean
    id?: string
  }>(),
  { min: 0, max: Number.MAX_SAFE_INTEGER, step: 'any', integer: false },
)
const emit = defineEmits<{ 'update:modelValue': [number] }>()

// Stable across SSR and hydration (Nuxt 3.8 has no useId).
const id = computed(() => props.id || 'f-' + props.label.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
const text = ref(String(props.modelValue))
const localError = ref('')
watch(() => props.modelValue, (v) => { if (Number(text.value) !== v) text.value = String(v) })

function onInput(e: Event) {
  text.value = (e.target as HTMLInputElement).value
  const n = Number(text.value)
  if (text.value.trim() === '' || !Number.isFinite(n)) { localError.value = 'Enter a number.'; return }
  if (props.integer && !Number.isInteger(n)) { localError.value = 'Enter a whole number.'; return }
  if (n < props.min || n > props.max) { localError.value = `Enter ${props.min}–${props.max}.`; return }
  localError.value = ''
  emit('update:modelValue', n)
}
function onBlur() {
  if (localError.value) { text.value = String(props.modelValue); localError.value = '' }
}
const shownError = computed(() => localError.value || props.error || '')
</script>

<template>
  <div>
    <label :for="id" class="ds-label">{{ label }}</label>
    <div class="relative">
      <input
        :id="id"
        :value="text"
        type="number"
        inputmode="decimal"
        :min="min"
        :max="max"
        :step="step"
        :aria-invalid="shownError ? 'true' : 'false'"
        :aria-describedby="shownError || hint ? id + '-msg' : undefined"
        class="ds-input"
        :class="unit ? 'pr-12' : ''"
        @input="onInput"
        @blur="onBlur"
      />
      <span v-if="unit" class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400">{{ unit }}</span>
    </div>
    <p v-if="shownError" :id="id + '-msg'" class="mt-1 text-xs text-rose-600 dark:text-rose-400" role="alert">{{ shownError }}</p>
    <p v-else-if="hint" :id="id + '-msg'" class="mt-1 ds-muted">{{ hint }}</p>
  </div>
</template>
