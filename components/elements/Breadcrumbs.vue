<template>
  <BasicSection class="mx-auto px-8 pt-12 pb-12">
    <nav class="flex" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <NuxtLink
            to="/"
            class="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            <svg
              class="w-3 h-3 mr-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"
              />
            </svg>
            Home
          </NuxtLink>
        </li>
        <li v-if="parentTitle">
          <div class="flex items-center">
            <svg
              class="w-3 h-3 text-indigo-400 mx-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <NuxtLink
              :to="parentUrl"
              class="ml-1 text-sm font-medium text-indigo-600 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
              >{{ parentTitle }}</NuxtLink
            >
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg
              class="w-3 h-3 text-indigo-400 mx-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span
              class="ml-1 text-sm font-medium text-indigo-400 md:ml-2 dark:text-gray-400"
              >{{ currentPageTitle }}</span
            >
          </div>
        </li>
      </ol>
    </nav>
  </BasicSection>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  parentTitle: String,
  parentUrl: String,
  currentPageTitle: {
    type: String,
    required: true,
  },
});

const route = useRoute();
const config = useRuntimeConfig();

const siteUrl =
  config.public.siteUrl || "https://donavanjones.com";

const breadcrumbSchema = computed(() => {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl,
    },
  ];

  if (props.parentTitle && props.parentUrl) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: props.parentTitle,
      item: `${siteUrl}${props.parentUrl}`,
    });

    items.push({
      "@type": "ListItem",
      position: 3,
      name: props.currentPageTitle,
      item: `${siteUrl}${route.path}`,
    });
  } else {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: props.currentPageTitle,
      item: `${siteUrl}${route.path}`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
});

useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: computed(() => JSON.stringify(breadcrumbSchema.value)),
    },
  ],
});
</script>