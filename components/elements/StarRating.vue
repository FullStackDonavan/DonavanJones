<script setup lang="ts">
interface Props {
  modelValue: number
  readonly?: boolean
  size?: string
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  size: 'text-lg',
})

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const hovered = ref(0)

function starIcon(i: number): string {
  const active = props.readonly ? props.modelValue : (hovered.value || props.modelValue)
  return i <= Math.round(active) ? 'mdi:star' : 'mdi:star-outline'
}

function select(i: number) {
  if (!props.readonly) emit('update:modelValue', i)
}
</script>

<template>
  <div class="inline-flex items-center gap-0.5" :class="{ 'cursor-pointer': !readonly }">
    <Icon
      v-for="i in 5"
      :key="i"
      :name="starIcon(i)"
      :class="[size, i <= Math.round(readonly ? modelValue : (hovered || modelValue)) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600']"
      @click="select(i)"
      @mouseenter="!readonly && (hovered = i)"
      @mouseleave="!readonly && (hovered = 0)"
    />
  </div>
</template>
