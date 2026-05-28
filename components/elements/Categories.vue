<template>
  <div v-if="rows" class="py-4 px-4 sm:px-6 lg:px-8 w-full">
    <div v-for="(row, rIndex) in rows" :key="rIndex" class="lg:flex items-center justify-center w-full pb-8">
      <div
        v-for="(category, index) in row"
        :key="index"
        class="focus:outline-none lg:w-4/12 lg:m-7 lg:mb-0 mb-7 dark:bg-gray-800 bg-white p-6 shadow rounded transition duration-500 hover:scale-105"
      >
        <CategoryCard :category="category" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CategoryCard from '~/components/elements/CategoryCard.vue'
import { useRoute } from 'vue-router'
import { ref, watchEffect } from 'vue'

const route = useRoute()
const { data: rows } = await useFetch('/api/categories', { key: route.fullPath })

// If the parent passes a `categories` prop of slugs, filter rows to include only those
const props = defineProps({
  categories: {
    type: Array as () => string[],
    required: false,
  }
})

if (props.categories && rows.value) {
  // flatten rows, filter, then chunk back into rows of 2
  const flat = rows.value.flat()
  const filtered = flat.filter((c: any) => {
    const slug = (c.link || '').split('/').pop()
    return props.categories.includes(slug) || (c.tags || []).some((t: any) => props.categories.includes(t.title))
  })
  const chunked: any[] = []
  for (let i = 0; i < filtered.length; i += 2) chunked.push(filtered.slice(i, i + 2))
  // replace rows.value in-place where possible
  rows.value = chunked
}
</script>

<style scoped>
.categories-card {
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}
</style>
