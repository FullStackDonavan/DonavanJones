<template>
  <div
    :class="{ fadeIn: TargetIsVisible }"
    class="col startInvisible"
    ref="Target"
  >
    <slot />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

const props = defineProps({
  animationClass: String,
});

const { animationClass } = toRefs(props);

const Target = ref(null);
const TargetIsVisible = ref(false);

useIntersectionObserver(Target, ([{ isIntersecting }]) => {
  TargetIsVisible.value = isIntersecting;
});
</script>

<style>
.startInvisible {
  opacity: 0;
  filter: blur(20px);
  transition: opacity 0.5s ease-in-out, filter 0.5s ease-in-out;
}

.fadeIn {
  opacity: 1;
  filter: blur(0);
}
</style>
