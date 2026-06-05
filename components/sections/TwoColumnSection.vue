<template>
  <section class="container mx-auto mt-20">
    <GridTwoColumns>
      <div>
        <h2
          
        >
          {{ title }}
        </h2>
        <p
          class="mb-8 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400"
        >
          {{ description1 }}
        </p>

                <p
          class="mb-8 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400"
        >
          {{ description2 }}
        </p>

                <p
          class="mb-8 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400"
        >
          {{ description3 }}
        </p>

                <p
          class="mb-8 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400"
        >
          {{ description4 }}
        </p>
        <div
          class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-left sm:space-y-0 sm:space-x-4"
        >

        </div>
      </div>
      <div>
        <div class="flex justify-center items-center py-8">
  <Icon
    name="mdi:kubernetes"
    class="text-[24rem] text-sky-400/80"
  />
</div>
      </div>
    </GridTwoColumns>
  </section>
</template>

<script>
export default {
  name: "TwoColumnSection",
  props: {
    title: String,
    description1: String,
    description2: String,
    description3: String,
    mediaFirst: Boolean,
  },
  data() {
    return {
      colorMode: useColorMode(),
    };
  },
};
</script>

<style scoped>
</style>