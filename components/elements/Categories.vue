<template>
  <div v-if="rows" class="py-6 w-full">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(category, index) in rows.flat()"
        :key="index"
        class="rounded-2xl border border-slate-200 dark:border-slate-700/50
               bg-white dark:bg-slate-900/60
               hover:border-sky-500/40 dark:hover:border-sky-500/30
               transition-all duration-200 hover:shadow-lg hover:shadow-sky-500/5
               overflow-hidden"
      >
        <CategoryCard :category="category" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CategoryCard from '~/components/elements/CategoryCard.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { data: rows } = await useFetch('/api/categories', { key: route.fullPath })

const props = defineProps({
  categories: {
    type: Array as () => string[],
    required: false,
  }
})

if (props.categories && rows.value) {
  const flat = rows.value.flat()
  const filtered = flat.filter((c: any) => {
    const slug = (c.link || '').split('/').pop()
    return props.categories.includes(slug) || (c.tags || []).some((t: any) => props.categories.includes(t.title))
  })
  rows.value = [filtered]
}
</script>
