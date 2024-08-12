<template>
  <div
    :class="{ fadeIn: TargetIsVisible }"
    class="startInvisible w-full lg:min-w-[500px] md:min-w-[300px] sm:min-w-[600px] col-start-1 col-end-5 items-center justify-center mx-auto lg:flex-row lg:flex-wrap lg:justify-evenly lg:px-10"
    ref="Target"
    v-if="columnStart === 'true'"
    @animationend="handleAnimationEnd"
  >
    <div
      class="flex flex-col w-full max-w-sm mx-4 my-6 shadow-lg min-w-[30px] relative"
    >
      <!-- Fixed width for card, responsive min width -->
      <div class="py-6 rounded-t-lg bg-gray-50 dark:bg-gray-700">
        <p class="text-lg font-bold text-center dark:text-gray-100">
          {{ cardCompany }}
        </p>

        <button
          @click="toggleExpand"
          class="flex items-center justify-center w-full my-2 text-blue-500 dark:text-amber-400"
        >
          <span>{{ expanded ? "Less" : "More" }}</span>
          <svg
            :class="{ 'rotate-180': expanded }"
            class="w-4 h-4 ml-2 transform transition-transform"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <transition
          name="expand"
          @before-enter="beforeEnter"
          @enter="enter"
          @leave="leave"
        >
          <div v-show="expanded" class="expand-content mt-4 px-4">
            <!-- Additional content goes here -->
            <p
              class="relative py-1 text-md italic text-center dark:text-gray-100"
            >
              {{ cardDescription }}
            </p>
          </div>
        </transition>
      </div>
      <div
        class="flex flex-col items-center justify-center p-8 rounded-b-lg text-gray-100 bg-blue-400 dark:bg-amber-400 dark:text-gray-900"
      >
        <img
          :src="cardImage"
          alt="Card Image"
          class="w-16 h-16 mb-2 -mt-16 bg-center bg-cover rounded-full"
        />
        <p class="text-xl font-semibold">{{ cardTitle }}</p>
        <p class="text-sm font-bold text-center dark:text-gray-100">
          {{ cardDate }}
        </p>
      </div>
    </div>
  </div>

  <div
    :class="{ fadeIn: TargetIsVisible }"
    class="startInvisible w-full col-start-6 col-end-10 items-center justify-center mx-auto lg:flex-row lg:flex-wrap lg:justify-evenly lg:px-10"
    ref="Target"
    v-else
    @animationend="handleAnimationEnd"
  >
    <div
      class="flex flex-col w-full max-w-sm mx-4 my-6 shadow-lg min-w-[30px] relative"
    >
      <!-- Fixed width for card, responsive min width -->
      <div class="py-6 rounded-t-lg bg-gray-50 dark:bg-gray-700">
        <p class="text-lg font-bold text-center dark:text-gray-100">
          {{ cardCompany }}
        </p>

        <button
          @click="toggleExpand"
          class="flex items-center justify-center w-full my-2 text-blue-500 dark:text-amber-400"
        >
          <span>{{ expanded ? "Less" : "More" }}</span>
          <svg
            :class="{ 'rotate-180': expanded }"
            class="w-4 h-4 ml-2 transform transition-transform"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <transition
          name="expand"
          @before-enter="beforeEnter"
          @enter="enter"
          @leave="leave"
        >
          <div v-show="expanded" class="expand-content mt-4 px-4">
            <!-- Additional content goes here -->
            <p
              class="relative py-1 text-md italic text-center dark:text-gray-100"
            >
              {{ cardDescription }}
            </p>
          </div>
        </transition>
      </div>
      <div
        class="flex flex-col items-center justify-center p-8 rounded-b-lg text-gray-100 bg-blue-400 dark:bg-amber-400 dark:text-gray-900"
      >
        <img
          :src="cardImage"
          alt="Card Image"
          class="w-16 h-16 mb-2 -mt-16 bg-center bg-cover rounded-full"
        />
        <p class="text-xl font-semibold">{{ cardTitle }}</p>
        <p class="text-sm font-bold text-center dark:text-gray-100">
          {{ cardDate }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    columnStart: String,
    cardTitle: String,
    cardDescription: String,
    cardImage: String,
    jobTitle: String,
    cardCompany: String,
    cardDate: String,
  },
  data() {
    return {
      expanded: false,
      TargetIsVisible: false,
    };
  },
  methods: {
    toggleExpand() {
      this.expanded = !this.expanded;
    },
    beforeEnter(el) {
      el.style.maxHeight = "0";
      el.style.opacity = "0";
      el.style.overflow = "hidden";
      el.style.transition = "none"; // Disable transition before starting
    },
    enter(el, done) {
      el.style.transition =
        "max-height 0.5s ease-in-out, opacity 0.3s ease-in-out";
      el.style.maxHeight = `${el.scrollHeight}px`;
      el.style.opacity = "1";
      done();
    },
    leave(el, done) {
      el.style.transition =
        "max-height 0.5s ease-in-out, opacity 0.3s ease-in-out";
      el.style.maxHeight = "0";
      el.style.opacity = "0";
      setTimeout(done, 500); // Ensure the transition ends before calling done
    },
    handleAnimationEnd() {
      // Reset the target element's state to be able to animate again
      this.TargetIsVisible = false;
      this.$nextTick(() => {
        this.TargetIsVisible = true;
      });
    },
  },
  mounted() {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.TargetIsVisible = true;
          observer.unobserve(this.$refs.Target);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(this.$refs.Target);
  },
};
</script>

<style scoped>
.startInvisible {
  opacity: 0;
  transform: translateY(20px);
  filter: blur(40px);
}

.fadeIn {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
  transition: opacity 0.7s ease-in-out, transform 0.7s ease-in-out,
    filter 0.7s ease-in-out;
}

.expand-content {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.5s ease-in-out, opacity 0.3s ease-in-out;
}

.expand-enter-active,
.expand-leave-active {
  transition: max-height 0.5s ease-in-out, opacity 0.3s ease-in-out;
}

.expand-enter,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
