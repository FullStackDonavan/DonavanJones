<template>
    <section class="container mx-auto mb-8">
        <div class="grid grid-cols-3 gap-6 text-gray-500">
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