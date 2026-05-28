<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const currentPage = computed(() => parseInt(route.query.page as string) || 1);

const limit = ref(8);

// Total projects count
const { data: totalProjectsCount } = await useAsyncData(
  "totalProjectsCount",
  () =>
    queryContent("projects")
      .where({ draft: { $ne: true } })
      .count()
);

const totalPages = computed(() =>
  Math.ceil((totalProjectsCount.value || 0) / limit.value)
);

// Projects fetch
const { data: projects, refresh } = await useAsyncData("projects", () =>
  queryContent("/projects")
    .where({ draft: { $ne: true } })
    .skip((currentPage.value - 1) * limit.value)
    .limit(limit.value)
    .find()
);

// Refresh on route change
watch(
  () => route.query,
  () => refresh()
);
</script>

<template>
  <PatternSection class="flex justify-center w-full pt-8">
    <div class="mt-8 w-full">

      <!-- Header -->
      <div class="px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
          Projects
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
          A collection of things I’ve built, experimented with, and deployed.
        </p>
      </div>

      <!-- Grid wrapper -->
      <div class="w-full bg-gray-50 dark:bg-slate-950 py-10">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <!-- Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div
              v-for="project in projects"
              :key="project._path"
              class="group bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden flex flex-col transition hover:shadow-2xl"
            >

              <NuxtLink :to="project._path" class="flex flex-col h-full">

                <!-- Image -->
                <div class="relative overflow-hidden h-44">
                  <img
                    :src="project.img"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                  <!-- Status badge -->
                  <div
                    v-if="project.status"
                    class="absolute top-3 left-3 text-xs px-3 py-1 rounded-full bg-black/60 text-white backdrop-blur"
                  >
                    {{ project.status }}
                  </div>
                </div>

                <!-- Content -->
                <div class="p-5 flex flex-col flex-1">

                  <h2
                    class="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-yellow-400 transition"
                  >
                    {{ project.title }}
                  </h2>

                  <p class="text-sm text-gray-600 dark:text-gray-300 mt-2 flex-1">
                    {{ project.description }}
                  </p>

                  <!-- Tech tags -->
                  <div class="mt-4 flex flex-wrap gap-2">
                    <span
                      v-for="tag in project.tags"
                      :key="tag"
                      class="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      {{ tag }}
                    </span>
                  </div>

                  <!-- CTA -->
                  <div class="mt-5">
                    <span
                      class="inline-flex items-center text-sm font-medium text-yellow-500 group-hover:translate-x-1 transition"
                    >
                      View Project →
                    </span>
                  </div>

                </div>
              </NuxtLink>
            </div>

          </div>
        </div>

        <!-- Pagination -->
        <div class="mt-10">
          <Pagination
            v-if="totalPages > 1"
            :currentPage="currentPage"
            :limit="limit"
            :totalPages="totalPages"
          />
        </div>
      </div>

    </div>
  </PatternSection>
</template>