<template>
  <div
    class="slider relative w-full max-w-full overflow-hidden mx-auto h-[400px] md:h-[800px]"
  >
    <div
      ref="slider"
      class="list absolute w-full h-full flex transition-all duration-1000 ease-in-out"
    >
      <div
        class="item w-full flex-shrink-0 relative"
        v-for="(slide, index) in slides"
        :key="index"
      >
        <img
          :src="slide.image"
          alt=""
          class="w-full h-full object-cover absolute inset-0"
        />
        <div
          class="absolute inset-0 flex flex-col justify-center items-center text-center text-white bg-black/50 rounded-md p-4"
        >
          <h2 class="text-4xl font-bold">{{ slide.title }}</h2>
          <p class="text-lg">{{ slide.description }}</p>
          <NuxtLink
            :to="slide.link"
            class="px-4 py-2 bg-blue-500 rounded mt-4 text-white"
          >
            {{ slide.buttonText }}
          </NuxtLink>
        </div>
      </div>
    </div>
    <div
      class="buttons absolute top-1/2 left-[5%] w-[90%] flex justify-between transform -translate-y-1/2"
    >
      <button
        id="prev"
        class="w-12 h-12 rounded-full bg-white/30 text-white border-none font-mono font-bold"
        @click="prevSlide"
      >
        &lt;
      </button>
      <button
        id="next"
        class="w-12 h-12 rounded-full bg-white/30 text-white border-none font-mono font-bold"
        @click="nextSlide"
      >
        &gt;
      </button>
    </div>
    <ul class="dots absolute bottom-2 left-0 w-full flex justify-center">
      <li
        v-for="(dot, index) in slides"
        :key="index"
        @click="goToSlide(index)"
        :class="{
          'w-2 h-2 bg-white mx-2 rounded-full transition-all duration-500': true,
          'w-7 h-2': index === activeIndex,
        }"
      ></li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  props: {
    slides: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const slider = ref(null);
    const activeIndex = ref(0);
    let refreshInterval = null;

    const nextSlide = () => {
      activeIndex.value =
        activeIndex.value + 1 < props.slides.length ? activeIndex.value + 1 : 0;
      reloadSlider();
    };

    const prevSlide = () => {
      activeIndex.value =
        activeIndex.value - 1 >= 0
          ? activeIndex.value - 1
          : props.slides.length - 1;
      reloadSlider();
    };

    const reloadSlider = () => {
      if (slider.value) {
        slider.value.style.transform = `translateX(-${
          activeIndex.value * 100
        }%)`;
      }

      clearInterval(refreshInterval);
      refreshInterval = setInterval(nextSlide, 5000);
    };

    const goToSlide = (index) => {
      activeIndex.value = index;
      reloadSlider();
    };

    onMounted(() => {
      refreshInterval = setInterval(nextSlide, 5000);
      reloadSlider();
    });

    return {
      slider,
      activeIndex,
      nextSlide,
      prevSlide,
      goToSlide,
    };
  },
};
</script>

<style scoped>
.slider .list {
  left: 0;
  top: 0;
}
.slider .item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Button styles */
.buttons button {
  transition: background-color 0.3s, transform 0.3s;
}

.buttons button:hover {
  background-color: rgba(
    255,
    255,
    255,
    0.6
  ); /* Slightly more opaque on hover */
  transform: scale(1.1); /* Slightly enlarge the button on hover */
}

.buttons #prev {
  background-color: rgba(
    255,
    255,
    255,
    0.3
  ); /* Default background for prev button */
}

.buttons #next {
  background-color: rgba(
    255,
    255,
    255,
    0.3
  ); /* Default background for next button */
}

.buttons #prev:hover {
  background-color: rgba(
    255,
    255,
    255,
    0.5
  ); /* Lighter background on hover for prev button */
}

.buttons #next:hover {
  background-color: rgba(
    255,
    255,
    255,
    0.5
  ); /* Lighter background on hover for next button */
}
</style>
