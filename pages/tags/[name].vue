<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "#app";

// Capture the dynamic route parameter
const route = useRoute();
const articles = ref([]);
const pending = ref(true);

// Fetch data based on the dynamic `name` parameter
onMounted(async () => {
  const tagName = route.params.name; // Access the `name` parameter from the URL

  try {
    articles.value = await queryContent("portfolio")
      .where({ tags: { $contains: tagName } }) // Fetch articles based on the tag name
      .find();
  } catch (error) {
    console.error("Error fetching content:", error);
  } finally {
    pending.value = false;
  }
});

// Truncate description function
const truncateDescription = (text: string, length: number) => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};

// Get the previous route to handle back navigation
const previousRoute = ref<string | null>(null);

onMounted(() => {
  const queryFrom = route.query.from as string;
  if (queryFrom) {
    previousRoute.value = queryFrom;
  }
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <nuxt-link
      v-if="previousRoute"
      :to="previousRoute"
      class="block cursor-pointer mb-4 text-blue-500 hover:underline"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="inline h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M11 17l-5-5m0 0l5-5m-5 5h12"
        />
      </svg>
      Back
    </nuxt-link>

    <h1 class="text-2xl font-bold mb-4 uppercase">
      {{ route.params.name }} Projects
    </h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div v-if="pending" class="col-span-full text-center text-gray-500">
        Loading...
      </div>
      <div
        v-else-if="articles.length === 0"
        class="col-span-full text-center text-gray-500"
      >
        No projects found for {{ route.params.name }}.
      </div>
      <div
        v-for="(article, index) in articles"
        :key="index"
        class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        <NuxtImg
          v-if="article.excerptImage"
          :src="article.excerptImage"
          format="webp"
          :alt="article.title"
          class="w-full h-48 object-cover rounded-t-lg mb-4"
        />
        <h2 class="text-xl font-semibold mb-2">{{ article.title }}</h2>
        <!-- <p class="text-gray-700 dark:text-gray-300">
          {{ truncateDescription(article.description, 100) }}
        </p> -->
        <NuxtLink
          :to="{ path: article._path, query: { from: route.fullPath } }"
          class="text-blue-500 hover:underline mt-2 inline-block"
        >
          Read more
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
