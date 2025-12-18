<template>
  <nav class="hidden md:flex justify-between space-x-10 align-bottom mt-14">
    <div class="hidden md:flex space-x-10 align-bottom">
      <!-- Home Link -->
      <nuxt-link to="/" class="relative group">
        <span
          :class="[
            'text-base font-medium relative transition-colors duration-300 px-3 py-1 rounded-md',
            isActive('/')
              ? 'text-gray-900 dark:text-gray-300 bg-gray-200 dark:bg-gray-500'
              : 'text-gray-500 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-300',
          ]"
        >
          Home
        </span>
      </nuxt-link>

      <!-- About Link -->
      <nuxt-link to="/about-me" class="relative group">
        <span
          :class="[
            'text-base font-medium relative transition-colors duration-300 px-3 py-1 rounded-md',
            isActive('/about-me')
              ? 'text-gray-900 dark:text-gray-300 bg-gray-200 dark:bg-gray-500'
              : 'text-gray-500 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-300',
          ]"
        >
          About
        </span>
      </nuxt-link>

      <!-- Blog Link -->
      <nuxt-link to="/blog/overview" class="relative group">
        <span
          :class="[
            'text-base font-medium relative transition-colors duration-300 px-3 py-1 rounded-md',
            isBlogActive
              ? 'text-gray-900 dark:text-gray-300 bg-gray-200 dark:bg-gray-500'
              : 'text-gray-500 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-300',
          ]"
        >
          Blog
        </span>
      </nuxt-link>

      <!-- Portfolio Link -->
      <nuxt-link to="/categories/" class="relative group">
        <span
          :class="[
            'text-base font-medium relative transition-colors duration-300 px-3 py-1 rounded-md',
            isPortfolioActive
              ? 'text-gray-900 dark:text-gray-300 bg-gray-200 dark:bg-gray-500'
              : 'text-gray-500 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-300',
          ]"
        >
          Portfolio
        </span>
      </nuxt-link>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

// Checks if the current route is exactly the given path
const isActive = (path) => route.path === path;

// Check if user is in a portfolio-related route or linked from one
const isPortfolioActive = computed(() => {
  return (
    (route.path.startsWith("/categories") ||
     route.path.startsWith("/portfolio/") ||
     route.path.startsWith("/tags/")) &&
    !route.query?.from?.includes("/blog/")
  );
});


// Check if user is in a blog-related route or linked from one
const isBlogActive = computed(() => {
  return (
    route.path.startsWith("/blog/") ||
    (route.path.startsWith("/tags/") && route.query?.from?.includes("/blog/"))
  );
});




</script>
