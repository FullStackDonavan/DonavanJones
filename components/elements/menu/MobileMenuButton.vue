<script setup lang="ts">
import { ref } from "@vue/reactivity";

const router = useRouter();
const showSideDrawer = ref(false);

function handleClose() {
  showSideDrawer.value = !showSideDrawer.value;
}

router.afterEach(() => {
  showSideDrawer.value = false;
});
</script>
<template>
  <div class="md:hidden mt-4">
    <button
      @click="showSideDrawer = true"
      type="button"
      class="bg-white rounded-md p-2 inline-flex text-gray-400 hover:text-gray-500 dark:bg-black dark:text-gray-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      aria-expanded="false"
    >
      <span class="sr-only dark:bg-black">Open menu</span>
      <svg
        class="h-6 w-6 dark:bg-black"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  </div>
  <!-- drawer component -->
  <MobileMenuDrawer
    :showSideDrawer="showSideDrawer"
    @closeDrawer="handleClose"
  />
</template>