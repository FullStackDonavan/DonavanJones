<template>
  <div>
    <div class="container mx-auto">
      <div class="flex items-stretch -mx-4">
        <div class="flex-1 p-4">
          <div
            class="block overflow-hidden rounded-t-lg rounded-b-lg h-full shadow-lg"
          >
            <NuxtLink :to="url">
              <div class="p-4 bg-blue-400 dark:bg-amber-400">
                <h2
                  class="mt-2 mb-2 font-bold text-2xl font-Heading text-center text-white"
                >
                  {{ title }}
                </h2>
                <p class="text-sm uppercase text-center text-white">
                  Learn More
                </p>
              </div>
              <!-- <p class="text-md text-justify">{{ description }}</p> -->
              <div>
                <img :src="image" />
              </div>
            </NuxtLink>
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