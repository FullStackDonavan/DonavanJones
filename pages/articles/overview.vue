<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const currentPage = computed(() => parseInt(route.query.page) || 1);
const limit = ref(9);

const { data: articles, refresh } = await useAsyncData("articles", () =>
  queryContent("/articles")
    .skip((currentPage.value - 1) * limit.value)
    .limit(limit.value)
    .find()
);

const truncateDescription = (description) => {
  const words = description.split(" ");
  return words.length > 25 ? words.slice(0, 25).join(" ") + "..." : description;
};

watch(
  () => route.query,
  () => refresh()
);
</script>

<template>
  <PatternSection class="flex justify-center w-full">
    <div class="mt-8">
      <!-- Grid container -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Render articles -->
        <div
          v-for="article in articles"
          :key="article._path"
          class="flex flex-col max-w-sm rounded overflow-hidden shadow-xl bg-white dark:bg-gray-800 relative group"
        >
          <NuxtLink :to="article._path" class="flex flex-col h-full">
            <div class="relative flex flex-col flex-1">
              <!-- Image with zoom effect -->
              <img
                :src="article.img"
                alt="Article Image"
                class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <!-- Article content -->
              <div class="p-6 flex flex-col flex-1">
                <!-- Title with hover effect -->
                <div
                  class="font-bold text-xl mb-2 text-gray-900 dark:text-gray-100 transition-transform duration-300 group-hover:font-extrabold"
                >
                  {{ article.title }}
                </div>
                <!-- Truncated Description -->
                <p
                  class="text-gray-700 dark:text-gray-300 text-base mb-4 flex-1"
                >
                  {{ truncateDescription(article.description) }}
                </p>
                <!-- Read More Button -->
                <button
                  class="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 hover:scale-105 transition-transform duration-300 ease-in-out"
                >
                  Read More
                </button>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
      <!-- Pagination -->
      <Pagination :currentPage="currentPage" :limit="9" />
    </div>
  </PatternSection>
</template>

<style scoped>
/* Image zoom effect */
img {
  transition: transform 0.3s ease;
}

.group:hover img {
  transform: scale(1.1);
}

.group:hover button {
  transform: scale(1.05);
}
</style>
