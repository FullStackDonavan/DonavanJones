<template>
  <nav class="hidden md:flex justify-between space-x-10 align-bottom mt-14">
    <div class="hidden md:flex space-x-10 align-bottom">
      <nuxt-link to="/" class="relative group" exact-active-class="active">
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
          class="absolute left-0 bottom-[0] h-0.5 transition-all duration-300 group-hover:w-full"
          :class="{
            'w-0 bg-blue-500 dark:bg-blue-300': !isActive('/'),
          }"
        ></span>
      </nuxt-link>

      <nuxt-link
        to="/about-me"
        class="relative group"
        exact-active-class="active"
      >
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
          class="absolute left-0 bottom-[0] h-0.5 transition-all duration-300 group-hover:w-full"
          :class="{
            'w-0 bg-blue-500 dark:bg-blue-300': !isActive('/about-me'),
          }"
        ></span>
      </nuxt-link>

      <nuxt-link
        to="/categories/"
        class="relative group"
        exact-active-class="active"
      >
        <span
          :class="[
            'text-base font-medium relative transition-colors duration-300',
            isActive('/categories/')
              ? 'text-gray-900 dark:text-gray-300 bg-gray-200 dark:bg-gray-500 px-3 py-1 rounded-md'
              : 'text-gray-500 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-300',
          ]"
        >
          Portfolio
        </span>
        <span
          class="absolute left-0 bottom-[0] h-0.5 transition-all duration-300 group-hover:w-full"
          :class="{
            'w-0 bg-blue-500 dark:bg-blue-300': !isActive('/categories/'),
          }"
        ></span>
      </nuxt-link>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();

const isActive = (path) => {
  return route.path === path;
};
</script>
