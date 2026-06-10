<script setup lang="ts">
const props = defineProps(["showSideDrawer"]);
const emits = defineEmits(["closeDrawer"]);

function emitCloseEvent() {
  emits("closeDrawer");
}
</script>

<template>
  <!-- Backdrop -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="props.showSideDrawer"
      class="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
      @click="emitCloseEvent"
      aria-hidden="true"
    />
  </Transition>

  <!-- Slide-in panel -->
  <Transition
    enter-active-class="transition-transform duration-300 ease-out"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-200 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <div
      v-show="props.showSideDrawer"
      id="drawer-navigation"
      class="fixed z-40 top-0 left-0 h-screen w-72 sm:w-80 overflow-y-auto
             bg-white dark:bg-gray-900 shadow-2xl"
      tabindex="-1"
      aria-labelledby="drawer-navigation-label"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-800">
        <h5
          id="drawer-navigation-label"
          class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest"
        >
          Menu
        </h5>
        <button
          @click="emitCloseEvent"
          type="button"
          aria-controls="drawer-navigation"
          class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-200
                 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-1.5 inline-flex items-center
                 transition-colors duration-150"
        >
          <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          <span class="sr-only">Close menu</span>
        </button>
      </div>

      <MobileMenuList />
    </div>
  </Transition>
</template>
