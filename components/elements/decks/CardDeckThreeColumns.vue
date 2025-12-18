<template>
  <section class="container mx-auto">
    <div
      class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 text-gray-500"
    >
      <slot />
    </div>
  </section>
</template>

<script>
export default {
  name: "CardDeck",
  props: {
    title: String,
  },
};
</script>