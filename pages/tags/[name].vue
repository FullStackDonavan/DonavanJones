<template>
  <PatternSection>
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
        <!-- Skeleton Loader when content is loading -->
        <template v-if="pending">
          <SkeletonLoader v-for="i in limit" :key="i" />
        </template>

        <!-- Content when loaded -->
        <template v-else>
          <div
            v-if="articles.length === 0"
            class="col-span-full text-center text-gray-500"
          >
            No projects found for {{ route.params.name }}.
          </div>
          <div
            v-for="(article, index) in articles"
            :key="index"
            class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:scale-105 transition-transform duration-500"
          >
            <NuxtImg
              v-if="article.excerptImage"
              :src="article.excerptImage"
              quality="80"
              format="webp"
              :alt="article.title"
              class="w-full h-48 object-cover rounded-t-lg mb-4"
            />
            <h2 class="text-xl font-semibold mb-2">{{ article.title }}</h2>
            <NuxtLink
              :to="{ path: article._path, query: { from: route.fullPath } }"
              class="text-blue-500 hover:underline mt-2 inline-block"
            >
              Read more
            </NuxtLink>
          </div>
        </template>
      </div>

      <!-- Pagination -->
      <Pagination
        :currentPage="currentPage"
        :limit="limit"
        :totalPages="totalPages"
        v-if="totalPages > 1"
      />
    </div>
  </PatternSection>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "#app";
import SkeletonLoader from "~/components/SkeletonLoaders/SkeletonLoader.vue";

const route = useRoute();
const articles = ref([]);
const pending = ref(true);
const limit = ref(9);

const currentPage = computed(() => parseInt(route.query.page as string) || 1);

const fetchArticles = async () => {
  const tagName = route.params.name;

  pending.value = true;

  try {
    articles.value = await queryContent("portfolio")
      .where({ tags: { $contains: tagName } })
      .skip((currentPage.value - 1) * limit.value)
      .limit(limit.value)
      .find();
  } catch (error) {
    console.error("Error fetching content:", error);
  } finally {
    pending.value = false;
  }
};

onMounted(fetchArticles);

watch([() => route.params.name, currentPage], fetchArticles);

const truncateDescription = (text: string, length: number) => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};

const previousRoute = ref<string | null>(null);

onMounted(() => {
  const queryFrom = route.query.from as string;
  if (queryFrom) {
    previousRoute.value = queryFrom;
  }
});

const { data: totalArticlesCount } = await useAsyncData(
  "totalArticlesCount",
  () =>
    queryContent("portfolio")
      .where({ tags: { $contains: route.params.name } })
      .count()
);

const totalPages = computed(() =>
  Math.ceil(totalArticlesCount.value / limit.value)
);
</script>
