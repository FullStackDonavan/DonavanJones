<template>
  <div
    :class="{ fadeIn: TargetIsVisible }"
    class="startInvisible w-full col-start-1 col-end-5 items-center justify-center mx-auto lg:flex-row lg:flex-wrap lg:justify-evenly lg:px-10"
    ref="Target"
    v-if="columnStart === 'true'"
  >
    <div class="flex flex-col max-w-sm mx-4 my-6 shadow-lg">
      <div class="py-12 rounded-t-lg bg-gray-50 dark:bg-gray-700">
        <p class="relative py-1 text-md italic text-center dark:text-gray-100">
          {{ cardDescription }}
        </p>
      </div>
      <div
        class="flex flex-col items-center justify-center p-8 rounded-b-lg text-gray-100 bg-blue-400 dark:bg-amber-400 dark:text-gray-900"
      >
        <img
          :src="cardImage"
          alt="Card Image"
          class="w-16 h-16 mb-2 -mt-16 bg-center bg-cover rounded-full"
        />
        <p class="text-xl font-semibold leadi">{{ cardTitle }}</p>
      </div>
    </div>
  </div>

  <div
    :class="{ fadeIn: TargetIsVisible }"
    class="startInvisible w-full col-start-6 col-end-10 items-center justify-center mx-auto lg:flex-row lg:flex-wrap lg:justify-evenly lg:px-10"
    ref="Target"
    v-else
  >
    <div class="flex flex-col max-w-sm mx-4 my-6 shadow-lg">
      <div
        class="py-12 rounded-t-lg sm:px-4 md:px-6 bg-gray-50 dark:bg-gray-700"
      >
        <p class="relative py-1 text-lg italic text-center dark:text-gray-100">
          {{ cardDescription }}
        </p>
      </div>
      <div
        class="flex flex-col items-center justify-center p-8 rounded-b-lg text-gray-100 bg-blue-400 dark:bg-amber-400 dark:text-gray-900"
      >
        <img
          :src="cardImage"
          alt="Card Image"
          class="w-16 h-16 mb-2 -mt-16 bg-center bg-cover rounded-full"
        />
        <p class="text-xl font-semibold leadi">{{ cardTitle }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    columnStart: String,
    cardTitle: String,
    cardDescription: String,
    cardImage: String,
  },
};
</script>

<script setup>
import { ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

const Target = ref(null);
const TargetIsVisible = ref(false);

useIntersectionObserver(Target, ([{ isIntersecting }]) => {
  TargetIsVisible.value = isIntersecting;
});
</script>

<style scoped>
.startInvisible {
  opacity: 0;
}
.fadeIn {
  opacity: 0;
  cursor: pointer;
  transition: 0.5s all ease-in-out;
}

.fadeIn {
  opacity: 1;
}
</style>
