<template>
  <NuxtLayout>
    <div class="dark:bg-gray-900 dark:text-slate-300">
      <!-- Overlay Component -->
      <Overlay />

      <!-- Main Content -->
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>

<script setup>
import Overlay from "~/components/Overlay.vue";
</script>
