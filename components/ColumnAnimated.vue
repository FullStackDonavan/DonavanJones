<template>
    <div :class="{ 'fadeIn': TargetIsVisible }" class=" col startInvisible" ref="Target">
        <slot/>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { useIntersectionObserver } from '@vueuse/core';
    const props = defineProps({
    animationClass: String,
  })
  const { animationClass } = toRefs(props)

    const Target = ref(null);
    const TargetIsVisible = ref(false);
    
    useIntersectionObserver(Target, ([{ isIntersecting }]) => {
        TargetIsVisible.value = isIntersecting
    });
</script>


<style>
.startInvisible{
    opacity: 0;
}
.fadeIn {
  opacity: 0;
  cursor: pointer;
  transition: 0.25s all ease-in-out;
}

.fadeIn {
  opacity: 1;
}
</style>