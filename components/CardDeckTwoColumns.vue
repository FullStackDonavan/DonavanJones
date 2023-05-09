<template>
    <section class="container mx-auto">
        <div class="grid grid-cols-2 gap-4 text-gray-500">
            <slot />
        </div>
    </section>
</template>

<script>
export default {
  name: "CardDecktwoColumns",
  props: {
    title: String,
  },
};
</script>