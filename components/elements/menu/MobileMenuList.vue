<script setup lang="ts">
import { ref } from "vue";

const initalCheck = await useLoggedIn();
const isLoggedIn = ref(initalCheck);
const user = useState("user");

async function checkIfLoggedIn() {
  const check = await useLoggedIn();
  isLoggedIn.value = check;
}

watch(
  user,
  async () => {
    await checkIfLoggedIn();
  },
  { deep: true }
);
</script>
<template>
  <div class="py-4 overflow-y-auto my-12">
    <ul class="space-y-2">
      <MenuIconList />

      <li>
        <NuxtLink
          to="/"
          class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Icon
            name="material-symbols:house"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            size="50"
          />
          <span class="ml-3">Home</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/house-painting-marketing-program"
          class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Icon
            name="material-symbols:location-on-rounded"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            size="50"
          />
          <span class="flex-1 ml-3 whitespace-nowrap"
            >Service Area Business</span
          >
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/about-us"
          class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Icon
            name="fluent:people-community-48-filled"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            size="50"
          />

          <span class="flex-1 ml-3 whitespace-nowrap">About Us</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/articles/overview"
          class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Icon
            name="zondicons:news-paper"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            size="50"
          />

          <span class="flex-1 ml-3 whitespace-nowrap">Markerting Tips</span>
        </NuxtLink>
      </li>
      <!-- <li>
        <NuxtLink
          to="/dashboard"
          class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Icon
            name="material-symbols:space-dashboard-rounded"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            size="50"
          />
          <span class="flex-1 ml-3 whitespace-nowrap">Dashboard</span>
        </NuxtLink>
      </li> -->
      <li v-if="!isLoggedIn">
        <NuxtLink
          to="/login"
          class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          <span class="flex-1 ml-3 whitespace-nowrap">Sign In</span>
        </NuxtLink>
      </li>
      <li v-if="!isLoggedIn">
        <NuxtLink
          to="/register"
          class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>

          <span class="flex-1 ml-3 whitespace-nowrap">Sign Up</span>
        </NuxtLink>
      </li>
      <li @click="logout" v-if="isLoggedIn">
        <span
          to="/register"
          class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Icon
            name="ooui:log-out-rtl"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            size="50"
          />
          <span class="flex-1 ml-3 whitespace-nowrap">logout</span>
        </span>
      </li>
    </ul>
  </div>
</template>