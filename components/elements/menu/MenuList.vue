<template>
  <nav class="hidden md:flex justify-between space-x-10 align-bottom mt-14">
    <div class="hidden md:flex space-x-10 align-bottom">
      <nuxt-link to="/">
        <span
          class="text-base font-medium text-gray-500 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-300"
        >
          Home
        </span>
      </nuxt-link>

      <nuxt-link to="/about-me">
        <span
          class="text-base font-medium text-gray-500 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-300"
        >
          About
        </span>
      </nuxt-link>
      <!-- <nuxt-link to="/series/">
        <span
          class="text-base font-medium text-gray-500 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-300"
        >
          Portfolio
        </span>
      </nuxt-link>
      <nuxt-link to="/contact-me">
        <span
          class="text-base font-medium text-gray-500 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-300"
        >
          Contact
        </span>
      </nuxt-link> -->
    </div>
  </nav>
</template>