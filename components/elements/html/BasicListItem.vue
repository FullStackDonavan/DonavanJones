<template>
  <li class="mb-4 text-lg font-normal text-gray-500 lg:text-xl">
    <strong class="text-gray-500 lg:text-xl dark:text-gray-400">{{
      strong
    }}</strong>
    {{ text }}
  </li>
</template>

<script>
export default {
  name: "Basic List Item",
  props: {
    strong: String,
    text: String,
  },
};
</script>

<style>
</style>