<script setup>
import { computed } from "vue";
import { useRoute } from "#app";

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  limit: {
    type: Number,
    default: 10,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const route = useRoute();
const basePath = computed(() => {
  if (route.path.startsWith("/categories/")) return `/categories/${route.params.name}`;
  if (route.path.startsWith("/tags/")) return `/tags/${route.params.name}`;
  if (route.path.startsWith("/blog/overview")) return "/blog/overview";
  if (route.path.startsWith("/projects/overview")) return "/projects/overview";
  return route.path;
});
</script>

<template>
  <div class="flex justify-center py-6">
    <div class="flex items-center gap-1.5">

      <!-- Previous -->
      <NuxtLink
        v-if="currentPage > 1"
        :to="{ path: basePath, query: { page: currentPage - 1 } }"
        class="inline-flex items-center justify-center w-9 h-9 rounded-lg
               border border-slate-200 dark:border-slate-700/50
               bg-white dark:bg-slate-900
               text-slate-500 dark:text-slate-400
               hover:border-sky-500/40 hover:text-sky-500
               transition-all duration-200"
      >
        <Icon name="mdi:chevron-left" class="text-lg" />
      </NuxtLink>
      <span
        v-else
        class="inline-flex items-center justify-center w-9 h-9 rounded-lg
               border border-slate-100 dark:border-slate-800
               text-slate-300 dark:text-slate-600 cursor-not-allowed"
      >
        <Icon name="mdi:chevron-left" class="text-lg" />
      </span>

      <!-- Page numbers -->
      <NuxtLink
        v-for="i in totalPages"
        :key="i"
        :to="{ path: basePath, query: { page: i } }"
        class="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium
               border transition-all duration-200"
        :class="currentPage === i
          ? 'bg-sky-500 border-sky-500 text-white'
          : 'border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-sky-500/40 hover:text-sky-500'"
      >
        {{ i }}
      </NuxtLink>

      <!-- Next -->
      <NuxtLink
        v-if="currentPage < totalPages"
        :to="{ path: basePath, query: { page: currentPage + 1 } }"
        class="inline-flex items-center justify-center w-9 h-9 rounded-lg
               border border-slate-200 dark:border-slate-700/50
               bg-white dark:bg-slate-900
               text-slate-500 dark:text-slate-400
               hover:border-sky-500/40 hover:text-sky-500
               transition-all duration-200"
      >
        <Icon name="mdi:chevron-right" class="text-lg" />
      </NuxtLink>
      <span
        v-else
        class="inline-flex items-center justify-center w-9 h-9 rounded-lg
               border border-slate-100 dark:border-slate-800
               text-slate-300 dark:text-slate-600 cursor-not-allowed"
      >
        <Icon name="mdi:chevron-right" class="text-lg" />
      </span>

    </div>
  </div>
</template>
