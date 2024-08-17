<template>
  <div
    class="flex flex-col w-full max-w-sm mx-4 my-6 shadow-lg min-w-[30px] relative animate-pulse"
  >
    <!-- Skeleton for the card content -->
    <div class="py-6 rounded-t-lg bg-gray-50 dark:bg-gray-700">
      <!-- Skeleton for the card company name -->
      <div class="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto"></div>

      <!-- Skeleton for the expand/collapse button -->
      <div class="flex items-center justify-center w-full my-2">
        <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
      </div>
    </div>

    <!-- Skeleton for the card image, title, and date -->
    <div
      class="flex flex-col items-center justify-center p-8 rounded-b-lg text-gray-100 bg-blue-400 dark:bg-amber-400 dark:text-gray-900"
    >
      <!-- Skeleton for the card image -->
      <div
        class="w-16 h-16 mb-2 bg-gray-300 dark:bg-gray-600 rounded-full"
      ></div>
      <!-- Skeleton for the card title -->
      <div class="h-6 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-2"></div>
      <!-- Skeleton for the card date -->
      <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
    </div>
  </div>
</template>

<script>
export default {
  // Add any props if needed for conditional rendering
};
</script>

<style scoped>
/* Pulse animation for the skeleton loader */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
