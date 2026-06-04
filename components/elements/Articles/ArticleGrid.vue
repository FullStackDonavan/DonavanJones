<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
  >
    <ArticleCard
      v-for="article in articles"
      :key="article._path"
      :article="article"
    />
  </div>
</template>

<script setup>
defineProps({
  articles: {
    type: Array,
    default: () => [],
  },
})
</script>