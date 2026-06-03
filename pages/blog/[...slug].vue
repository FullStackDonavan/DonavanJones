<template>
  <PatternSection>
    <div class="flex justify-center gap-x-12">
      <main
        class="container text-white lg:flex justify-center overflow-hidden dark:text-white py-16 px-4"
      >
        <div>
          <!-- Back Button -->
          <nuxt-link
            class="block cursor-pointer max-w-2xl mb-4"
            :to="backLink"
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

          <!-- Content -->
          <ContentDoc v-slot="{ doc: contentDoc }">
            <div>
              <!-- Title -->
              <h2 class="text-4xl font-semibold text-black dark:text-white">
                {{ contentDoc.title }}
              </h2>

              <p class="text-gray-500 dark:text-white">
                by {{ contentDoc.author }}, {{ contentDoc.date }}
              </p>

              <!-- Meta -->
              <div class="text-gray-500 dark:text-gray-400 mt-2 flex flex-wrap items-center">

                <span v-if="contentDoc.category" class="mr-4">
                  <strong>Category: </strong>
                  <NuxtLink
                    :to="{
                      path: `/categories/${contentDoc.category}`,
                      query: { from: route.fullPath },
                    }"
                    class="text-blue-500 hover:underline"
                  >
                    {{ contentDoc.category }}
                  </NuxtLink>
                </span>

                <span v-if="contentDoc.tags?.length" class="mr-4">
                  <strong>Tags: </strong>
                  <ul class="inline-flex gap-x-2">
                    <li v-for="(tag, index) in contentDoc.tags" :key="index">
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

                <span v-if="contentDoc.projectType" class="mr-4">
                  <strong>Project Type:</strong>

                  <span v-if="contentDoc.projectType === 'personal'">
                    Personal Project
                  </span>

                  <span v-else-if="contentDoc.projectType === 'freelance'">
                    Freelance
                  </span>

                  <span v-else-if="contentDoc.projectType === 'employment'">
                    <a
                      :href="contentDoc.employmentLink"
                      class="text-blue-500 hover:underline ml-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Employment
                    </a>
                  </span>
                </span>
              </div>

              <!-- Links -->
              <div class="text-gray-500 dark:text-gray-400 mt-4 flex gap-x-4 items-center">
                <a
                  v-if="contentDoc.github"
                  :href="contentDoc.github"
                  class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>

                <a
                  v-if="contentDoc.liveSite"
                  :href="contentDoc.liveSite"
                  class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Site
                </a>
              </div>

              <hr class="border-t-2 border-gray-300 my-4 shadow-md" />

              <div class="max-w-4xl">
                <ContentRenderer
                  class="mt-4 max-w-none prose lg:prose-xl dark:prose-invert"
                  :value="contentDoc"
                />
              </div>
            </div>
          </ContentDoc>
        </div>
      </main>
    </div>
  </PatternSection>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute, useRuntimeConfig } from "#app"

const route = useRoute()
const config = useRuntimeConfig()

const backLink = ref("/blog/overview")

/**
 * Safe back navigation
 */
onMounted(() => {
  const from = route.query.from
  if (typeof from === "string" && from.startsWith("/")) {
    backLink.value = from
  }
})
</script>