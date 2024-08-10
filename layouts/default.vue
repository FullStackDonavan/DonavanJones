<script setup lang="ts">
import Navbar from "~/components/layout/navbar.vue";
import TheFooter from "~~/components/layout/TheFooter.vue";
</script>

<template>
  <div class="">
    <Navbar />
    <slot />
    <TheFooter />
  </div>
</template>