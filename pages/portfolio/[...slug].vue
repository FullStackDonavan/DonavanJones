<template>
  <PatternSection>
    <div class="flex justify-center gap-x-12">
      <main
        class="container text-white lg:flex justify-center overflow-hidden dark:text-white py-16 px-4"
      >
        <div>
          <nuxt-link
            class="block cursor-pointer max-w-2xl mb-4"
            :href="backLink"
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

          <ContentDoc v-slot="{ doc }">
            <h2 class="text-4xl font-semibold text-black dark:text-white">
              {{ doc.title }}
            </h2>
            <p class="text-gray-500 dark:text-white">
              by {{ doc.author }}, {{ doc.date }}
            </p>

            <!-- Category, Tags, and Project Info section -->
            <div
              class="text-gray-500 dark:text-gray-400 mt-2 flex flex-wrap items-center"
            >
              <span v-if="doc.category" class="mr-4">
                <strong>Category: </strong>
                <NuxtLink
                  :to="{
                    path: `/categories/${doc.category}`,
                    query: { from: route.fullPath },
                  }"
                  class="text-blue-500 hover:underline"
                >
                  {{ doc.category }}
                </NuxtLink>
              </span>

              <span v-if="doc.tags && doc.tags.length" class="mr-4">
                <strong>Tags: </strong>
                <ul class="inline-flex gap-x-2">
                  <li v-for="(tag, index) in doc.tags" :key="index">
                    <NuxtLink
                      :to="{
                        path: `/tags/${tag}`,
                        query: { from: route.fullPath },
                      }"
                      class="text-blue-500 hover:underline"
                    >
                      {{ tag }}
                    </NuxtLink>
                  </li>
                </ul>
              </span>

              <span v-if="doc.projectType" class="mr-4">
                <strong>Project Type:</strong>
                <span v-if="doc.projectType === 'personal'">
                  Personal Project
                </span>
                <span v-if="doc.projectType === 'freelance'"> Freelance </span>
                <span v-if="doc.projectType === 'employment'">
                  <a
                    :href="doc.employmentLink"
                    class="text-blue-500 hover:underline ml-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Employment</a
                  >
                </span>
              </span>
            </div>

            <!-- GitHub and Live Site Buttons -->
            <div
              class="text-gray-500 dark:text-gray-400 mt-4 flex gap-x-4 items-center"
            >
              <span v-if="doc.github">
                <a
                  :href="doc.github"
                  class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </span>

              <span v-if="doc.liveSite">
                <a
                  :href="doc.liveSite"
                  class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Site
                </a>
              </span>
            </div>
            <hr class="border-t-2 border-gray-300 my-4 shadow-md" />

            <div class="max-w-4xl">
              <ContentRenderer
                class="mt-4 max-w-none prose lg:prose-xl dark:prose-invert"
                :value="doc"
              />
            </div>
          </ContentDoc>
        </div>
      </main></div
  ></PatternSection>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "#app";

const route = useRoute();
const backLink = ref("/articles/overview");
const doc = ref<any>({});

// Set the back link based on the query parameter
onMounted(() => {
  if (route.query.from) {
    backLink.value = route.query.from as string;
  }
  // Load the doc data
  // Assume you load doc data here
});

const liveSiteHostname = computed(() => {
  if (doc.value.liveSite) {
    try {
      return new URL(doc.value.liveSite).hostname;
    } catch (e) {
      console.error("Invalid live site URL:", e);
      return "";
    }
  }
  return "";
});
</script>

<style scoped>
/* Optional: Add additional custom styles here */
</style>
