<template>
  <div
    v-if="isVisible"
    class="overlay"
    :class="{ 'slide-down': hasStartedSliding }"
  >
    <div class="content">
      <PulsingLogo />
      <Spinner />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import PulsingLogo from "~/components/PulsingLogo.vue";
import Spinner from "~/components/Spinner.vue";

const isVisible = ref(true);
const hasStartedSliding = ref(false);

onMounted(() => {
  // Start the sliding down animation after 3 seconds
  setTimeout(() => {
    hasStartedSliding.value = true;
    // Remove the overlay from the DOM after the animation ends
    setTimeout(() => {
      isVisible.value = false;
    }, 1000); // Adjust this to match the animation duration
  }, 3000);
});
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: #030712; /* Dark background */
  z-index: 9999;
  transition: transform 1s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* Ensure no content is cut off */
}

.slide-down {
  transform: translateY(100%);
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
