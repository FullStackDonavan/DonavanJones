<template>
  <div>
    <div class="container mx-auto">
  <div class="flex items-stretch -mx-4">
    <div class="flex-1 p-4">
      <div class="block bg-white overflow-hidden border-2 h-full">
        <div class="p-4 bg-sky-700">
          <h2 class="mt-2 mb-2 font-bold text-2xl font-Heading text-center text-white">
            {{ title }}
          </h2>
          </div>
          <p class="text-md text-justify">{{ description }}</p>
        <div class="p-4 flex flex-wrap items-center">
          <p class="px-1 py-2 tracking-wide text-xs mr-2 mb-2">Tag #1</p>
          <p class="px-1 py-2 tracking-wide text-xs mr-2 mb-2">Tag #2</p>
        </div>
      </div>
    </div>
    
 
  </div>
</div>
  </div>
</template>


<script>
export default {
  name: "IndustryCard",
  props: {
    title: String,
    image: String,
    description: String,
    url: String,
  },
};
</script>

<style>

</style>