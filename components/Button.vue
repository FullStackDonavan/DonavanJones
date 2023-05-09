<template>
  <router-link class="bg-indigo-500" :to="location">
    <i class="mr-3" :class="icon"></i>{{ name }}</router-link
  >
</template>

<script>
export default {
  data() {
    return {
      href: "",
      buttonIcon: "",
    };
  },
  props: {
    location: String,
    name: String,
    icon: String,
  },
};
</script>

<style scoped>
.btn-primary {
  border-left: 0;
  border-right: 0;

  text-align: left;
}
</style>
