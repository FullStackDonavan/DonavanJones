<template>
  <div class="aspect-video pb-8">
    <iframe
      class="w-full h-full"
      :src="embedVideo"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    >
    </iframe>
  </div>
</template>

<script>
export default {
  name: "EmbedYoutube",
  props: {
    videoSrc: String,
  },
  data() {
    return {
      embedVideo: this.videoSrc,
    };
  },
};
</script>

<style scoped>
</style>