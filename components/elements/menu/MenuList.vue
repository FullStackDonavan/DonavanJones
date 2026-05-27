<template>
  <nav class="hidden md:flex justify-between space-x-10 align-bottom mt-14">
    <div class="hidden md:flex space-x-10 align-bottom items-center">

      <!-- Home -->
      <NuxtLink to="/" class="relative group">
        <span :class="navClass(isActive('/'))">
          Home
        </span>
      </NuxtLink>

      <!-- About -->
      <NuxtLink to="/about-me" class="relative group">
        <span :class="navClass(isActive('/about-me'))">
          About
        </span>
      </NuxtLink>

      <!-- Engineering Dropdown -->
      <div class="relative group">

        <button
          type="button"
          :class="[
            'text-base font-medium relative transition-colors duration-300 px-3 py-1 rounded-md inline-flex items-center gap-1',
            isEngineeringActive
              ? 'text-gray-900 dark:text-gray-300 bg-gray-200 dark:bg-gray-500'
              : 'text-gray-500 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-300'
          ]"
        >
          Engineering

          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 transition-transform duration-300 group-hover:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <!-- Dropdown -->
        <div
          class="absolute left-0 top-full mt-4 w-64 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50"
        >
          <div class="p-2 flex flex-col">

            <!-- AI -->
            <NuxtLink
              to="/engineering/ai"
              class="px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div class="font-medium text-gray-900 dark:text-gray-100">
                AI Engineering
              </div>

              <div class="text-sm text-gray-500 dark:text-gray-400">
                RAG, agents, semantic retrieval
              </div>
            </NuxtLink>

            <!-- Backend -->
            <NuxtLink
              to="/engineering/backend"
              class="px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div class="font-medium text-gray-900 dark:text-gray-100">
                Backend Engineering
              </div>

              <div class="text-sm text-gray-500 dark:text-gray-400">
                APIs, async systems, inference
              </div>
            </NuxtLink>

            <!-- Infrastructure -->
            <NuxtLink
              to="/engineering/infrastructure"
              class="px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div class="font-medium text-gray-900 dark:text-gray-100">
                Infrastructure
              </div>

              <div class="text-sm text-gray-500 dark:text-gray-400">
                Kubernetes, ARM64, homelab
              </div>
            </NuxtLink>

          </div>
        </div>
      </div>

      <!-- Blog -->
      <NuxtLink to="/blog/overview" class="relative group">
        <span :class="navClass(isBlogActive)">
          Blog
        </span>
      </NuxtLink>

      <!-- Portfolio -->
      <NuxtLink to="/projects" class="relative group">
        <span :class="navClass(isPortfolioActive)">
          Projects
        </span>
      </NuxtLink>

    </div>
  </nav>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

// Exact route match
const isActive = (path) => route.path === path;

// Shared nav styling
const navClass = (active) => [
  'text-base font-medium relative transition-colors duration-300 px-3 py-1 rounded-md',
  active
    ? 'text-gray-900 dark:text-gray-300 bg-gray-200 dark:bg-gray-500'
    : 'text-gray-500 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-300',
]

// Engineering sections
const isEngineeringActive = computed(() => {
  return (
    route.path.startsWith('/ai') ||
    route.path.startsWith('/backend') ||
    route.path.startsWith('/infrastructure')
  )
})

// Projects / portfolio
const isPortfolioActive = computed(() => {
  return (
    route.path.startsWith('/projects') ||
    route.path.startsWith('/portfolio')
  )
})

// Blog
const isBlogActive = computed(() => {
  return (
    route.path.startsWith('/blog') ||
    route.path.startsWith('/categories') ||
    route.path.startsWith('/tags')
  )
})
</script>