<template>
  <BasicSection class="mt-12">
    <div class="carousel">

      <!-- list items -->
      <GridTwoColumns>
        <div class="list">
          <div class="item" v-for="(item, index) in items" :key="index">
<div class="image-wrapper">
  <NuxtImg
    :src="item.img"
    quality="80"
    format="webp"
    class="carousel-image"
  />

  <!-- dark overlay -->
  <div class="image-overlay"></div>

  <!-- gradient overlay -->
  <div class="image-gradient"></div>
</div>
            <div class="content">
              <div class="author">{{ item.author }}</div>
              <div class="title">{{ item.title }}</div>
              <div class="des">{{ item.des }}</div>

              <div class="buttons">
                <NuxtLink
                  :to="item.linkUrl || '/projects'"
                  class="carouselButton center hover:scale-105 transition-transform duration-500"
                >
                  {{ item.buttonText || "View Project" }}
                </NuxtLink>
              </div>
            </div>

          </div>
        </div>

        <!-- list thumbnail -->
        <div>
          <div class="thumbnail">
            <div
              class="item hover:scale-110 transition-transform duration-500"
              v-for="(item, index) in items"
              :key="index"
            >
              <NuxtImg
                :src="item.img"
                quality="80"
                format="webp"
              />

              <div class="content">
                <div class="title">{{ item.title }}</div>
              </div>
            </div>
          </div>

          <!-- next prev -->
          <div class="arrows">
            <button
              id="prev"
              @click="showSlider('prev')"
              :disabled="disableArrows"
              class="hover:scale-125 transition-transform duration-500"
            >
              &lt;
            </button>

            <button
              id="next"
              @click="showSlider('next')"
              :disabled="disableArrows"
              class="hover:scale-125 transition-transform duration-500"
            >
              &gt;
            </button>
          </div>
        </div>
      </GridTwoColumns>

      <!-- time running -->
      <div class="time"></div>
    </div>
  </BasicSection>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";

export default {
  name: "MagicImageSlider",

  props: {
    disableArrows: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {

    const timeRunning = 5000;
    const timeAutoNext = 10000;

    let runTimeOut;
    let runNextAuto;

    // 📦 Fetch projects
    const { data: projects } = useAsyncData("projects-carousel", () =>
      queryContent("/projects")
        .where({ draft: { $ne: true } })
        .find()
    );

    // 🧠 PRIORITY 1: In Progress (HERO)
    const inProgress = computed(() => {
      if (!projects.value) return [];
      return projects.value.filter(
        (p) => p.status?.toLowerCase() === "in progress"
      );
    });

    // ⭐ PRIORITY 2: Featured projects
    const featured = computed(() => {
      if (!projects.value) return [];
      return projects.value.filter(
        (p) => p.featured === true
      );
    });

    // 📅 PRIORITY 3: Latest completed
    const latestCompleted = computed(() => {
      if (!projects.value) return [];

      return projects.value
        .filter((p) => {
          const status = (p.status || "").toLowerCase();
          return status === "completed" || status === "done";
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    });

    // 🧠 FINAL SMART ORDER MERGE
    const orderedProjects = computed(() => {
      const map = new Map();

      // 1. In progress FIRST
      inProgress.value.forEach(p => map.set(p._path, p));

      // 2. Featured NEXT
      featured.value.forEach(p => {
        if (!map.has(p._path)) map.set(p._path, p);
      });

      // 3. Latest completed LAST
      latestCompleted.value.forEach(p => {
        if (!map.has(p._path)) map.set(p._path, p);
      });

      return Array.from(map.values());
    });

    // 🎯 Convert to carousel format
    const items = computed(() => {
      if (!orderedProjects.value) return [];

      return orderedProjects.value.map((p) => ({
        img: p.excerptImage || p.img || "/img/placeholder.png",
        title: p.title,
        author: p.author || "Donavan Jones",
        des: p.description || "",
        linkUrl: p.projectPage || `/projects/${p.slug}`,
        buttonText:
          p.status?.toLowerCase() === "in progress"
            ? "Continue Building"
            : p.featured
            ? "Featured Project"
            : "View Project",
      }));
    });

    // carousel logic (unchanged)
    const showSlider = (type) => {
      if (props.disableArrows) return;

      const sliderDom = document.querySelector(".carousel .list");
      const sliderItemsDom = sliderDom.querySelectorAll(".carousel .list .item");
      const thumbnailBorderDom = document.querySelector(".carousel .thumbnail");
      const thumbnailItemsDom = thumbnailBorderDom.querySelectorAll(".item");
      const carouselDom = document.querySelector(".carousel");

      if (type === "next") {
        sliderDom.appendChild(sliderItemsDom[0]);
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
        carouselDom.classList.add("next");
      } else {
        sliderDom.prepend(sliderItemsDom[sliderItemsDom.length - 1]);
        thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
        carouselDom.classList.add("prev");
      }

      clearTimeout(runTimeOut);
      runTimeOut = setTimeout(() => {
        carouselDom.classList.remove("next");
        carouselDom.classList.remove("prev");
      }, timeRunning);

      clearTimeout(runNextAuto);
      runNextAuto = setTimeout(() => {
        showSlider("next");
      }, timeAutoNext);
    };

    onMounted(() => {
      const thumbnailBorderDom = document.querySelector(".carousel .thumbnail");
      const thumbnailItemsDom = thumbnailBorderDom.querySelectorAll(".item");

      if (thumbnailItemsDom.length > 0) {
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
      }

      runNextAuto = setTimeout(() => {
        showSlider("next");
      }, timeAutoNext);
    });

    onBeforeUnmount(() => {
      clearTimeout(runTimeOut);
      clearTimeout(runNextAuto);
    });

    watch(
      () => props.disableArrows,
      (newVal) => {
        const arrows = document.querySelectorAll(".carousel .arrows button");
        arrows.forEach((arrow) => {
          arrow.disabled = newVal;
        });
      }
    );

    return {
      items,
      showSlider,
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
body {
  margin: 0;
  background-color: #000;
  color: #eee;
  font-family: Poppins;
  font-size: 12px;
}
a {
  text-decoration: none;
}
header {
  width: 1140px;
  max-width: 80%;
  margin: auto;
  height: 50px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 100;
}
header a {
  color: #eee;
  margin-right: 40px;
}
/* carousel */
.carousel {
  height: 90vh;
  margin-top: -50px;
  overflow: hidden;
  position: relative;
}
.carousel .list .item {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0 0 0 0;
}
.carousel .list .item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.carousel .list .item .content {
  position: absolute;
  top: 20%;
  width: 1140px;
  max-width: 80%;
  left: 50%;
  transform: translateX(-50%);
  padding-right: 30%;
  box-sizing: border-box;
  color: #fff;
  text-shadow: 0 5px 10px #0004;
}
.carousel .list .item .author {
  font-weight: bold;
  letter-spacing: 10px;
}
.carousel .list .item .title,
.carousel .list .item .topic {
  font-size: 5em;
  font-weight: bold;
  line-height: 1.3em;
}

.carousel .list .item .topic {
  color: #f1683a;
}
.carousel .list .item .buttons {
  display: grid;
  grid-template-columns: repeat(2, 130px);
  grid-template-rows: 40px;
  gap: 5px;
  margin-top: 20px;
}
.carousel .list .item .buttons .carouselButton {
  border: none;
  background-color: transparent;
  border: 1px solid #fff;
  color: #eee;
  letter-spacing: 3px;
  font-family: Poppins;
  font-weight: 500;
}
.carousel .list .item .buttons {
  display: flex;
  align-items: center; /* Centers items vertically */
  height: 100%; /* Ensures the buttons container takes full height */
}

.carouselButton {
  border: none;
  background-color: transparent;
  border: 1px solid #fff;
  color: #eee;
  letter-spacing: 3px;
  font-family: Poppins;
  font-weight: 500;
  padding: 10px 20px; /* Adjust padding as needed */
  transition: all 0.3s ease;
}

.carouselButton:hover {
  background-color: #fff;
  color: #000;
}
/* thumbail */
.thumbnail {
  position: absolute;
  bottom: 50px;
  left: 50%;
  width: max-content;
  z-index: 100;
  display: flex;
  gap: 20px;
}
.thumbnail .item {
  width: 150px;
  height: 220px;
  flex-shrink: 0;
  position: relative;
  border: 2px solid rgb(138, 138, 138);
  box-shadow: 0px 10px 10px -3px rgba(0, 0, 0, 0.8);
  border-radius: 20px; /* Adjust the radius value as needed */
}

.thumbnail .item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}
.thumbnail .item .content {
  color: #fff;
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
}
.thumbnail .item .content .title {
  font-weight: 500;
}
.thumbnail .item .content .description {
  font-weight: 300;
}
/* arrows */
.arrows {
  position: absolute;
  top: 80%;
  right: 52%;
  z-index: 100;
  width: 300px;
  max-width: 30%;
  display: flex;
  gap: 10px;
  align-items: center;
}
.arrows button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #eee4;
  border: none;
  color: #fff;
  font-family: monospace;
  font-weight: bold;
  transition: 0.5s;
}
.arrows button:hover {
  background-color: #fff;
  color: #000;
}

/* animation */
.carousel .list .item:nth-child(1) {
  z-index: 1;
}

/* animation text in first item */

.carousel .list .item:nth-child(1) .content .author,
.carousel .list .item:nth-child(1) .content .title,
.carousel .list .item:nth-child(1) .content .topic,
.carousel .list .item:nth-child(1) .content .des,
.carousel .list .item:nth-child(1) .content .buttons {
  transform: translateY(50px);
  filter: blur(20px);
  opacity: 0;
  animation: showContent 0.5s 1s linear 1 forwards;
}
@keyframes showContent {
  to {
    transform: translateY(0px);
    filter: blur(0px);
    opacity: 1;
  }
}
.carousel .list .item:nth-child(1) .content .title {
  animation-delay: 1.2s !important;
}
.carousel .list .item:nth-child(1) .content .topic {
  animation-delay: 1.4s !important;
}
.carousel .list .item:nth-child(1) .content .des {
  animation-delay: 1.6s !important;
}
.carousel .list .item:nth-child(1) .content .buttons {
  animation-delay: 1.8s !important;
}
/* create animation when next click */
.carousel.next .list .item:nth-child(1) img {
  width: 150px;
  height: 220px;
  position: absolute;
  bottom: 50px;
  left: 50%;
  border-radius: 30px;
  animation: showImage 0.5s linear 1 forwards;
}
@keyframes showImage {
  to {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
}

.carousel.next .thumbnail .item:nth-last-child(1) {
  overflow: hidden;
  animation: showThumbnail 0.5s linear 1 forwards;
}
.carousel.prev .list .item img {
  z-index: 100;
}
@keyframes showThumbnail {
  from {
    width: 0;
    opacity: 0;
  }
}
.carousel.next .thumbnail {
  animation: effectNext 0.5s linear 1 forwards;
}

@keyframes effectNext {
  from {
    transform: translateX(150px);
  }
}

/* running time */

.carousel .time {
  position: absolute;
  z-index: 1000;
  width: 0%;
  height: 3px;
  background-color: #f1683a;
  left: 0;
  top: 0;
}

.carousel.next .time,
.carousel.prev .time {
  animation: runningTime 5s linear 1 forwards;
}
@keyframes runningTime {
  from {
    width: 100%;
  }
  to {
    width: 0;
  }
}

/* prev click */

.carousel.prev .list .item:nth-child(2) {
  z-index: 2;
}

.carousel.prev .list .item:nth-child(2) img {
  animation: outFrame 0.5s linear 1 forwards;
  position: absolute;
  bottom: 0;
  left: 0;
}
@keyframes outFrame {
  to {
    width: 150px;
    height: 220px;
    bottom: 50px;
    left: 50%;
    border-radius: 20px;
  }
}

.carousel.prev .thumbnail .item:nth-child(1) {
  overflow: hidden;
  opacity: 0;
  animation: showThumbnail 0.5s linear 1 forwards;
}
.carousel.next .arrows button,
.carousel.prev .arrows button {
  pointer-events: none;
}
.carousel.prev .list .item:nth-child(2) .content .author,
.carousel.prev .list .item:nth-child(2) .content .title,
.carousel.prev .list .item:nth-child(2) .content .topic,
.carousel.prev .list .item:nth-child(2) .content .des,
.carousel.prev .list .item:nth-child(2) .content .buttons {
  animation: contentOut 1.5s linear 1 forwards !important;
}

@keyframes contentOut {
  to {
    transform: translateY(-150px);
    filter: blur(20px);
    opacity: 0;
  }
}
@media screen and (max-width: 678px) {
  .carousel .list .item .content {
    padding-right: 0;
  }
  .carousel .list .item .content .title {
    font-size: 30px;
  }
}
/* IMAGE WRAPPER */
.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

/* IMAGE */
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* DARK OVERLAY */
.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1;
}

/* GRADIENT FOR TEXT AREA (BOTTOM FADE) */
.image-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0.2) 40%,
    rgba(0, 0, 0, 0) 70%
  );
  z-index: 2;
}

/* KEEP CONTENT ABOVE OVERLAY */
.carousel .list .item .content {
  z-index: 5;
}
.carousel .list .item {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.6s ease;
}

/* ONLY FIRST ITEM IS ACTIVE */
.carousel .list .item:nth-child(1) {
  opacity: 1;
  pointer-events: auto;
  z-index: 10;
}
</style>
