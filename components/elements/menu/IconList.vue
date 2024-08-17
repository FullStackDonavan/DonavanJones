<script setup lang="ts">
import { userLogout } from "~/composables/useAuth";

import { ref } from "@vue/reactivity";

import { onClickOutside } from "@vueuse/core";

const hideActions = ref(true);
const userActions = ref(null);

defineProps({
  isLoggedIn: Boolean,
});

onClickOutside(userActions, () => (hideActions.value = true));

const colorMode = useColorMode();

const user = useState("user");
const initalCheck = await useLoggedIn();
const isLoggedIn = ref(initalCheck);

const setColorTheme = (newTheme: Theme) => {
  colorMode.preference = newTheme;
};

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
  <div class="hidden md:flex justify-between space-x-10 align-bottom mt-14">
    <NuxtLink to="tel:+1863-339-9964" class="">
      <svg
        class="dark:text-gray-50 h-6 w-6 lg:block transition-colors duration-300 ease-in-out hover:dark:text-blue-400 hover:text-blue-400"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M6 22v-7h1v3.5h10v-13H7V9H6V2h12v20zm4-6.692l-.708-.708l2.089-2.1H2.5v-1h8.88L9.293 9.4L10 8.692L13.308 12z"
        ></path>
      </svg>
    </NuxtLink>

    <span
      class="md:block"
      @click="setColorTheme($colorMode.preference == 'dark' ? 'light' : 'dark')"
    >
      <svg
        v-if="$colorMode.value == 'dark'"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-gray-50 lg:block hover:dark:text-yellow-400 hover:text-yellow-400 transition-colors duration-300 ease-in-out"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
        />
      </svg>
      <svg
        v-if="$colorMode.value == 'light'"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 lg:block hover:dark:text-yellow-400 hover:text-yellow-400 transition-colors duration-300 ease-in-out"
        viewBox="0 0 20 20"
        fill="currentColor "
      >
        <path
          fill-rule="evenodd"
          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
          clip-rule="evenodd"
        />
      </svg>
    </span>
  </div>
</template>