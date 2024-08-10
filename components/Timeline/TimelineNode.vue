<template>
  <div
    :class="{ fadeIn: TargetIsVisible }"
    class="w-6 h-6 absolute top-1/2 -mt-3 border-2 bg-red-500 rounded-full shadow startInvisible"
    ref="Target"
  ></div>
</template>

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
  /* box-shadow: 1px 1px #888888; */
  cursor: pointer;
  transition: 0.5s all ease-in-out;
}

.fadeIn {
  opacity: 1;
}
</style>