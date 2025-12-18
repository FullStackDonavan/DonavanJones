<template>
  <section class="container mx-auto mt-20">
    <GridTwoColumns v-if="mediaFirst">
      <div>
        <p
          class="mb-4 font-extrabold tracking-tight leading-none text-gray-900 dark:text-slate-300"
        >
          {{ subTitle }}
        </p>
        <h1
          class="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl dark:text-slate-300"
        >
          {{ title }}
        </h1>
        <p
          class="mb-8 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400"
        >
          {{ description }}
        </p>
        <div
          class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-left sm:space-y-0 sm:space-x-4"
        >
          <NuxtLink
            to="/get-started"
            class="text-slate-100 hover:text-slate-300 dark:hover:text-slate-100 dark:text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-amber-800 bg-blue-400 hover:bg-blue-800 dark:bg-amber-500 dark:hover:bg-amber-600 font-medium text-sm rounded-lg px-5 py-2.5 mr-2 mb-2"
          >
            Learn More About Our Program
          </NuxtLink>
        </div>
      </div>
      <div>
        <img src="/img/Sales-Generating-Machine.png" v-show="isDark" />
        <img src="/img/Sales-Generating-Machine-Light.png" v-show="!isDark" />
      </div>
    </GridTwoColumns>
    <GridTwoColumns v-else>
      <div>
        <img src="/img/Sales-Generating-Machine.png" v-show="isDark" />
        <img src="/img/Sales-Generating-Machine-Light.png" v-show="!isDark" />
      </div>
      <div>
        <p
          class="mb-4 font-extrabold tracking-tight leading-none text-gray-900 dark:text-slate-300"
        >
          {{ subTitle }}
        </p>
        <h1
          class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-slate-300"
        >
          {{ title }}
        </h1>
        <p
          class="mb-8 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400"
        >
          {{ description }}
        </p>
        <div
          class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-left sm:space-y-0 sm:space-x-4"
        >
          <NuxtLink
            to="/get-started"
            class="text-slate-100 hover:text-slate-300 dark:hover:text-slate-100 dark:text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-amber-800 bg-blue-400 hover:bg-blue-800 dark:bg-amber-500 dark:hover:bg-amber-600 font-medium text-sm rounded-lg px-5 py-2.5 mr-2 mb-2"
          >
            Learn More About Our Program
          </NuxtLink>
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
    description: String,
    mediaFirst: Boolean,
    subTitle: String,
  },
  data() {
    return {
      colorMode: useColorMode(),
    };
  },
  computed: {
    // const isDark = this.$colorMode.value === "dark";
    isDark() {
      if (this.colorMode.preference === "dark") {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style scoped>
</style>