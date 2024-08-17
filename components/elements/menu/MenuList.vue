<template>
  <nav class="hidden md:flex justify-between space-x-10 align-bottom mt-14">
    <div class="hidden md:flex space-x-10 align-bottom">
      <!-- Home Link -->
      <nuxt-link to="/" class="relative group">
        <span
          :class="[
            'text-base font-medium relative transition-colors duration-300',
            isActive('/')
              ? 'text-gray-900 dark:text-gray-300 bg-gray-200 dark:bg-gray-500 px-3 py-1 rounded-md'
              : 'text-gray-500 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-300',
          ]"
        >
          Home
        </span>
        <span
          class="absolute left-0 bottom-0 h-0.5 transition-all duration-300 group-hover:w-full"
          :class="{
            'w-0 bg-blue-500 dark:bg-blue-300': !isActive('/'),
            'w-full': isActive('/'),
          }"
        ></span>
      </nuxt-link>

      <!-- About Link -->
      <nuxt-link to="/about-me" class="relative group">
        <span
          :class="[
            'text-base font-medium relative transition-colors duration-300',
            isActive('/about-me')
              ? 'text-gray-900 dark:text-gray-300 bg-gray-200 dark:bg-gray-500 px-3 py-1 rounded-md'
              : 'text-gray-500 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-300',
          ]"
        >
          About
        </span>
        <span
          class="absolute left-0 bottom-0 h-0.5 transition-all duration-300 group-hover:w-full"
          :class="{
            'w-0 bg-blue-500 dark:bg-blue-300': !isActive('/about-me'),
            'w-full': isActive('/about-me'),
          }"
        ></span>
      </nuxt-link>

      <!-- Portfolio Link -->
      <nuxt-link to="/categories/" class="relative group">
        <span
          :class="[
            'text-base font-medium relative transition-colors duration-300',
            isPortfolioActive
              ? 'text-gray-900 dark:text-gray-300 bg-gray-200 dark:bg-gray-500 px-3 py-1 rounded-md'
              : 'text-gray-500 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-300',
          ]"
        >
          Portfolio
        </span>
        <span
          class="absolute left-0 bottom-0 h-0.5 transition-all duration-300 group-hover:w-full"
          :class="{
            'w-0 bg-blue-500 dark:bg-blue-300': !isPortfolioActive,
            'w-full': isPortfolioActive,
          }"
        ></span>
      </nuxt-link>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

// Function to check if the current route is active or a sub-route
const isActive = (path) => {
  return route.path === path;
};

// Check if the route is '/categories' or '/tags' or their sub-routes
const isPortfolioActive = computed(() => {
  return route.path.startsWith("/categories") || route.path.startsWith("/tags");
});
</script>
