<script setup lang="ts" generic="T extends string | number">
// Accessible segmented control (radio group). Arrow keys move the selection,
// as in a native radio group; options can wrap on narrow screens.
const props = defineProps<{
  modelValue: T
  options: { value: T; label: string; title?: string }[]
  label: string
  size?: 'sm' | 'md'
}>()
const emit = defineEmits<{ 'update:modelValue': [T] }>()

const buttons = ref<HTMLButtonElement[]>([])

function onKey(e: KeyboardEvent, i: number) {
  const n = props.options.length
  let next = -1
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + n) % n
  else if (e.key === 'Home') next = 0
  else if (e.key === 'End') next = n - 1
  if (next < 0) return
  e.preventDefault()
  emit('update:modelValue', props.options[next].value)
  buttons.value[next]?.focus()
}
</script>

<template>
  <div
    role="radiogroup"
    :aria-label="label"
    class="inline-flex flex-wrap gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900 p-1"
  >
    <button
      v-for="(o, i) in options"
      :key="String(o.value)"
      ref="buttons"
      type="button"
      role="radio"
      :aria-checked="o.value === modelValue"
      :tabindex="o.value === modelValue ? 0 : -1"
      :title="o.title"
      class="rounded-md font-medium tabular-nums transition-colors ds-focus"
      :class="[
        size === 'sm' ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-xs sm:text-sm',
        o.value === modelValue
          ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
      ]"
      @click="emit('update:modelValue', o.value)"
      @keydown="onKey($event, i)"
    >
      {{ o.label }}
    </button>
  </div>
</template>
