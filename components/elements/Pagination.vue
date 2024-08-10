<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 1,
  },
});

const { data: allArticles } = await useAsyncData("allArticles", () =>
  queryContent("/articles").count()
);

const totalPages = computed(() => Math.ceil(allArticles.value / props.limit));
</script>

<template>
  <div class="flex justify-center mt-4">
    <div class="flex items-center gap-2 md:gap-4">
      <!-- Previous Page Button -->
      <NuxtLink
        v-if="currentPage > 1"
        :to="`/articles/overview/?page=${currentPage - 1}`"
        class="flex items-center justify-center rounded-full p-2 md:p-4 bg-yellow-500 hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105"
      >
        <Icon
          name="heroicons-arrow-small-left-20-solid"
          class="text-white text-xl md:text-3xl"
        />
      </NuxtLink>

      <!-- Page Numbers -->
      <NuxtLink
        v-for="i in totalPages"
        :key="i"
        :to="`/articles/overview/?page=${i}`"
        class="text-sm md:text-2xl font-semibold px-2 md:px-4 py-1 md:py-2 rounded-md border border-yellow-400 transition duration-1000 ease-in-out transform hover:scale-105"
        :class="{ 'bg-yellow-500 text-white': currentPage === i }"
      >
        {{ i }}
      </NuxtLink>

      <!-- Next Page Button -->
      <NuxtLink
        v-if="currentPage < totalPages"
        :to="`/articles/overview/?page=${currentPage + 1}`"
        class="flex items-center justify-center rounded-full p-2 md:p-4 bg-yellow-500 hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105"
      >
        <Icon
          name="heroicons-arrow-small-right-20-solid"
          class="text-white text-xl md:text-3xl"
        />
      </NuxtLink>
    </div>
  </div>
</template>
