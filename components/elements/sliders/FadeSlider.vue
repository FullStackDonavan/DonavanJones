<template>
  <div class="sliderContainer">
    <div id="slide">
      <div
        class="item grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
        v-for="(slide, index) in slides"
        :key="index"
        :class="{
          'fade-out': index === prevIndex,
          'fade-in': index === currentIndex,
        }"
      >
        <!-- Left Section -->
        <div class="left">
          <h1>{{ slide.title }}</h1>
          <div class="des" v-html="slide.description"></div>
          <NuxtLink
            to="/house-painting-marketing-program/search-engine-optimization"
            class="text-slate-100 hover:text-slate-300 dark:hover:text-slate-100 dark:text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-amber-800 bg-blue-400 hover:bg-blue-800 dark:bg-amber-500 dark:hover:bg-amber-600 font-medium text-sm rounded-lg px-5 py-2.5 mr-2 mb-2"
          >
            Learn More About Our Program
          </NuxtLink>
        </div>
        <!-- Image Section -->
        <div class="image">
          <img :src="slide.image" alt="" />
        </div>
        <!-- Right Section -->
        <div class="right">
          <h2>Features</h2>
          <ul>
            <li v-for="(config, idx) in slide.configurations" :key="idx">
              <p>{{ config.label }}</p>
              <p>{{ config.value }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <ArrowButtons :disabled="isButtonsDisabled" @click="handleArrowClick" />
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import ArrowButtons from "@/components/elements/sliders/ArrowButtons.vue";

const slides = ref([
  {
    image: "/img/SpecialtyPainting.jpg",
    title: "SEO",
    description: "Tinh ru anh choi da <br /> Chua kip choi da ma em da da anh",
    configurations: [
      { label: "Năm sản xuất", value: "2022" },
      { label: "Năm sản xuất", value: "2022" },
      { label: "Năm sản xuất", value: "2022" },
    ],
  },
  {
    image: "/img/Our-Platform.jpg",
    title: "Platform",
    description: "Boost growth with our marketing program; save time and costs",
    configurations: [
      {
        label: "Revamp Your Lead Generation",
        value: "Revolutionize your lead generation process.",
      },
      {
        label: "Website Design Solutions",
        value: "Increase your chances of converting visitors into customers.",
      },
      {
        label: "Elevate Your Business",
        value: "Take your business to the next level with automation.",
      },
    ],
  },
  {
    image: "/img/Residental-Painting.jpg",
    title: "Web Design",
    description: "Tinh ru anh choi da <br /> Chua kip choi da ma em da da anh",
    configurations: [
      { label: "Năm sản xuất", value: "2022" },
      { label: "Năm sản xuất", value: "2022" },
      { label: "Năm sản xuất", value: "2022" },
    ],
  },
]);

const isButtonsDisabled = ref(false);
const currentIndex = ref(0);
const prevIndex = ref(null); // Initialize prevIndex to null

const nextSlide = () => {
  prevIndex.value = currentIndex.value;
  currentIndex.value = (currentIndex.value + 1) % slides.value.length;
};

const prevSlide = () => {
  prevIndex.value = currentIndex.value;
  currentIndex.value =
    (currentIndex.value - 1 + slides.value.length) % slides.value.length;
};

const handleArrowClick = (direction) => {
  if (direction === "prev") {
    prevSlide();
  } else if (direction === "next") {
    nextSlide();
  }
};

// Watch for changes to apply animation class
watch([currentIndex, prevIndex], () => {
  document.querySelectorAll(".item").forEach((item, index) => {
    item.classList.remove("fade-in", "fade-out");
    if (index === currentIndex.value) {
      item.classList.add("fade-in");
    }
    if (index === prevIndex.value) {
      item.classList.add("fade-out");
    }
  });
});

// Ensure the first slide is visible on mount
onMounted(() => {
  prevIndex.value = null; // No previous slide at the start
  document
    .querySelectorAll(".item")
    [currentIndex.value].classList.add("fade-in");
});
</script>


<style scoped>
.sliderContainer {
  background-image: radial-gradient(circle, #320643, #140534);
}

#slide {
  position: relative;
  width: 100%;
  height: 600px;
  overflow: hidden;
}

.item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  align-items: center;
  transition: opacity 1s, transform 1s;
  opacity: 0; /* Start hidden */
}

.item.fade-in {
  opacity: 1; /* Show the item */
  transition: opacity 1s ease-in;
}

.item.fade-out {
  opacity: 0; /* Hide the item */
  transition: opacity 1s ease-out;
}

.item .image {
  grid-column: 2 / span 1; /* Center the image in the middle column */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75%;
  transform: scale(0.8);
}

.item .image img {
  width: 100%;
  max-width: 100%;
  transition: 0.5s;
}

.item .image::before {
  position: absolute;
  bottom: -30px;
  height: 60px;
  width: 60%;
  background-color: #000;
  content: "";
  z-index: -1;
  border-radius: 50%;
  filter: blur(30px);
}

.item .image img:hover {
  transform: scale(1.1);
}

.left {
  grid-column: 1 / span 1; /* Place left section in the left column */
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.left h1 {
  font-size: xxx-large;
  font-weight: 500;
  margin-bottom: 10px;
}

.left .des {
  font-size: small;
  font-weight: 100;
  opacity: 0.6;
  margin-bottom: 20px;
}

.left button {
  font-size: small;
  background-color: transparent;
  border: none;
  color: #fff;
}

.left button i:nth-child(1) {
  margin-left: 10px;
}

.right {
  grid-column: 3 / span 1; /* Place right section in the right column */
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.right h2 {
  font-size: large;
  font-weight: 500;
  margin-bottom: 10px;
}

.right ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

.right li {
  font-size: small;
  position: relative;
  margin-top: 20px;
}

.right li::before {
  position: absolute;
  left: -40px;
  top: 50%;
  transform: translate(0, -50%);
  width: 8px;
  height: 8px;
  background-color: #8c0781;
  content: "";
  border-radius: 50%;
  box-shadow: 0 0 10px #8c0781;
}

.right li p:nth-child(1) {
  font-weight: 500;
  padding: 0;
  margin: 0;
}

.right li p:nth-child(2) {
  font-weight: 100;
  padding: 0;
  margin: 0;
  font-size: x-small;
}

.directional {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 10px 0;
  position: relative;
}

.directional button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ddd;
  border: none;
  color: #fff;
  font-family: monospace;
  font-weight: bold;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
}

.directional button:hover:enabled {
  background-color: #bbb;
}

.directional button:disabled {
  background-color: #aaa;
  color: #555;
  cursor: not-allowed;
}
</style>
