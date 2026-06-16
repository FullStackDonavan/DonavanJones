<template>
  <nav class="hidden lg:flex justify-between items-center">
    <div class="hidden lg:flex space-x-1 xl:space-x-3 items-center">

      <!-- Home -->
      <NuxtLink to="/" class="relative group">
        <span :class="navClass(isActive('/'))">
          Home
        </span>
      </NuxtLink>

      <!-- Systems Dropdown -->
      <div class="relative group">

        <!-- CLICKABLE SYSTEMS LINK -->
        <NuxtLink
          to="/system-overview"
          :class="[
            'text-base font-medium relative transition-colors duration-300 px-3 py-1 rounded-md inline-flex items-center gap-1',
            isSystemsActive
              ? 'text-gray-900 dark:text-gray-300 bg-gray-200 dark:bg-gray-500'
              : 'text-gray-500 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-300'
          ]"
        >
          Systems
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </NuxtLink>

        <!-- Dropdown -->
        <div class="absolute left-0 top-full mt-4 w-64 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
          <div class="p-2 flex flex-col">
            <NuxtLink to="/systems/ai" class="px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div class="font-medium text-gray-900 dark:text-gray-100">AI Systems</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">RAG, agents, semantic retrieval, inference</div>
            </NuxtLink>
            <NuxtLink to="/systems/backend" class="px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div class="font-medium text-gray-900 dark:text-gray-100">Backend Systems</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">APIs, async systems, services, databases</div>
            </NuxtLink>
            <NuxtLink to="/systems/infrastructure" class="px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div class="font-medium text-gray-900 dark:text-gray-100">Infrastructure Systems</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Kubernetes, ARM64, homelab, GPU nodes</div>
            </NuxtLink>
          </div>
        </div>

      </div>

      <!-- Blog -->
      <NuxtLink to="/blog/overview" class="relative group">
        <span :class="navClass(isBlogActive)">
          Knowledge
        </span>
      </NuxtLink>

      <!-- Insights -->
      <NuxtLink to="/insights/overview" class="relative group">
        <span :class="navClass(isInsightsActive)">
          Insights
        </span>
      </NuxtLink>

      <!-- Projects -->
      <NuxtLink to="/projects/overview" class="relative group">
        <span :class="navClass(isProjectsActive)">
          Projects
        </span>
      </NuxtLink>

      <!-- Products -->
      <NuxtLink to="/products/overview" class="relative group">
        <span :class="navClass(isProductsActive)">
          Products
        </span>
      </NuxtLink>

      <!-- About Dropdown -->
      <div class="relative group">

        <NuxtLink
          to="/about"
          :class="[
            'text-base font-medium relative transition-colors duration-300 px-3 py-1 rounded-md inline-flex items-center gap-1',
            isAboutActive
              ? 'text-gray-900 dark:text-gray-300 bg-gray-200 dark:bg-gray-500'
              : 'text-gray-500 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-300'
          ]"
        >
          About
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </NuxtLink>

        <!-- Dropdown -->
        <div class="absolute right-0 top-full mt-4 w-52 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
          <div class="p-2 flex flex-col">
            <NuxtLink to="/resume" class="px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div class="font-medium text-gray-900 dark:text-gray-100">Resume</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Experience, skills, and tech stack</div>
            </NuxtLink>
            <NuxtLink to="/newsletter" class="px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div class="font-medium text-gray-900 dark:text-gray-100">Newsletter</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">Writing on software, SaaS, and tools</div>
            </NuxtLink>
          </div>
        </div>

      </div>

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

// Systems (was Systems)
const isSystemsActive = computed(() => {
  return (
    route.path.startsWith('/systems/ai') ||
    route.path.startsWith('/systems/backend') ||
    route.path.startsWith('/systems/infrastructure')
  )
})

// Projects
const isProjectsActive = computed(() => {
  return route.path.startsWith('/projects')
})

// Products
const isProductsActive = computed(() => {
  return route.path.startsWith('/products')
})

// Blog / Knowledge system
const isBlogActive = computed(() => {
  const fromInsights = route.query.from?.startsWith?.('/insights')
  return (
    route.path.startsWith('/blog') ||
    (route.path.startsWith('/categories') && !fromInsights) ||
    (route.path.startsWith('/tags') && !fromInsights)
  )
})

// About + Resume
const isAboutActive = computed(() => {
  return route.path === '/about' || route.path === '/resume' || route.path === '/newsletter'
})

// Insights
const isInsightsActive = computed(() => {
  const fromInsights = route.query.from?.startsWith?.('/insights')
  return (
    route.path.startsWith('/insights') ||
    ((route.path.startsWith('/tags') || route.path.startsWith('/categories')) && fromInsights)
  )
})
</script>