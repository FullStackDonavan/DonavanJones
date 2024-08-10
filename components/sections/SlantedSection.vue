<template>
  <div :class="['relative']" :style="{ height }">
    <div
      :class="[
        'dark:bg-slate-700 absolute inset-0',
        clipClasses,
        'bg-slate-300',
      ]"
      style="bottom: -1px"
    ></div>
  </div>
</template>

<script>
export default {
  name: "SlantedSection",
  props: {
    height: {
      type: String,
      default: "200px",
    },
    reverse: {
      type: Boolean,
      default: false,
    },
    isTop: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      colorMode: useColorMode(),
    };
  },
  computed: {
    clipClasses() {
      return this.isTop
        ? this.reverse
          ? "clip-bottom-reverse"
          : "clip-bottom"
        : this.reverse
        ? "clip-top-reverse"
        : "clip-top";
    },
  },
};
</script>

<style scoped>
.clip-top {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 85%);
}

.clip-top-reverse {
  clip-path: polygon(0 0, 100% 0, 100% 0, 100% 100%);
}

.clip-bottom {
  clip-path: polygon(0 100%, 100% 0, 100% 100%, 0 100%);
}

.clip-bottom-reverse {
  clip-path: polygon(0 0, 100% 15%, 100% 100%, 0 100%);
}
</style>
