<template>
  <PatternSection>
    <SkeletonDoor v-if="showDoor" @done="showDoor = false" />
    <MagicImageSlider :items="carouselItems" />
    <TimelineHistory />
    <InfiniteLogoCarousel />
    <OurPortfolioSection />
    <SalesGeneratingMachineSection />
  </PatternSection>
</template>

<script>
import { ref } from "vue";
import MagicImageSlider from "@/components/elements/sliders/MagicImageSlider.vue";
import SkeletonDoor from '@/components/SkeletonLoaders/SkeletonDoor.vue'

export default {
  components: {
    MagicImageSlider,
    SkeletonDoor,
  },
  data() {
    return {
      showDoor: true
    }
  },
  mounted() {
    // Fallback in case the component doesn't emit done (keeps overlay visible for a short time)
    // keep fallback long enough so it doesn't interrupt the full draw -> wait -> open sequence
    // the loader timeline + post-draw wait can be several seconds; use a generous fallback
    setTimeout(() => {
      this.showDoor = false
    }, 10000)
  },
  setup() {
    const carouselItems = ref([
      {
        img: "/img/code.jpg",
        author: "Donavan Jones",
        title: "View Projects",
        des: "Dive into a curated selection of my most recent and impactful projects. From innovative web applications to dynamic websites, each project showcases my skills and dedication to crafting exceptional digital experiences. Browse through to see how I bring concepts to life with clean, efficient code and modern design principles.",
        linkUrl: "/categories/",
        buttonText: "View Projects",
      },
      {
        img: "/img/workspace.jpg",
        author: "Donavan Jones",
        title: "About Me",
        des: "Experienced in PHP, with a specialization in WordPress and Laravel, I excel at building dynamic websites and robust applications that deliver seamless user experiences through clean, efficient code. In JavaScript, my skills extend to Vue, Nuxt, and React, where I create responsive and interactive web applications, focusing on performance, modern best practices, and cutting-edge technologies.",
        linkUrl: "/about-me",
        buttonText: "Learn More",
      },
      {
        img: "/img/contact-me.jpg",
        author: "Donavan Jones",
        title: "Contact Me",
        des: "I'm always excited to connect with new people and explore opportunities. Whether you have a project in mind, need advice, or just want to chat about tech, feel free to reach out. Let's discuss how we can collaborate to bring your ideas to life.",
        linkUrl: "/",
        buttonText: "Contact Me",
      },
    ]);

    return {
      carouselItems,
    };
  },
};
</script>






