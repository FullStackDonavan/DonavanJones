<template>
  <div>
    <h3 class="text-xl text-white">{{ title }}</h3>
    <p class="mb-8 text-md font-normal text-gray-500">{{ description }}</p>
  </div>
</template>


<script>
export default {
  name: "Card",
  props: {
    title: String,
    description: String,
  },
};
</script>

<style>
</style>