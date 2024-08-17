<template>
  <div
    :class="{ fadeIn: TargetIsVisible }"
    class="w-6 h-6 absolute top-1/2 -mt-3 border-2 bg-red-500 rounded-full shadow-none hover:shadow-glow startInvisible hover:scale-105 transition-all duration-500"
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
  opacity: 1;
  transition: opacity 0.5s ease-in-out, box-shadow 0.5s ease-in-out;
}

.shadow-none {
  box-shadow: none;
}

.shadow-glow {
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.4);
}

.hover\:shadow-glow:hover {
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.4);
}
</style>
