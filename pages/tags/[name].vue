<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "#app"; // Adjust the import if necessary

// Capture the dynamic route parameter
const route = useRoute();
const articles = ref([]);
const pending = ref(true);

// Fetch data based on the dynamic `name` parameter, focusing on tags
onMounted(async () => {
  const tagName = route.params.name; // Access the `name` parameter from the URL

  try {
    articles.value = await queryContent("portfolio")
      .sort({ title: 1 })
      .where({ tags: { $contains: tagName } }) // Fetch articles based on the tag name
      .find();
  } catch (error) {
    console.error("Error fetching content:", error);
  } finally {
    pending.value = false;
  }
});

const setColorTheme = (newTheme: Theme) => {
  useColorMode().preference = newTheme;
};
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-4">{{ route.params.name }} Projects</h1>
    <!-- Dynamic title based on the tag -->
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
        <h2 class="text-xl font-semibold mb-2">{{ article.title }}</h2>
        <p class="text-gray-700 dark:text-gray-300">
          {{ article.description }}
        </p>
        <NuxtLink
          :to="article._path"
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
