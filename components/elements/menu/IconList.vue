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

async function logout() {
  hideActions.value = true;
  await userLogout();
}
</script>

<template>
  <div class="hidden lg:flex justify-between space-x-6 items-center">
    <!-- Account: dropdown when logged in, login link when not -->
    <div v-if="isLoggedIn" ref="userActions" class="relative">
      <button
        type="button"
        class="flex items-center text-gray-500 dark:text-gray-200 hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-200"
        aria-label="Account menu"
        @click="hideActions = !hideActions"
      >
        <Icon name="mdi:account-circle-outline" class="text-[26px]" />
      </button>
      <div
        v-show="!hideActions"
        class="absolute right-0 top-full mt-4 w-52 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 z-50"
      >
        <div class="p-2 flex flex-col">
          <NuxtLink
            to="/profile"
            class="px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="hideActions = true"
          >
            <div class="font-medium text-gray-900 dark:text-gray-100">My Profile</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Account and purchased products</div>
          </NuxtLink>
          <button
            type="button"
            class="px-4 py-3 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="logout"
          >
            <div class="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Icon name="mdi:logout" class="text-base" />
              Log Out
            </div>
          </button>
        </div>
      </div>
    </div>
    <NuxtLink
      v-else
      to="/login"
      class="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-200
             hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-200"
    >
      <Icon name="mdi:account-circle-outline" class="text-xl" />
      Log In
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

    <NuxtLink
      to="/hire-me"
      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
             bg-sky-500 text-white hover:bg-sky-600 transition-colors duration-200
             shadow shadow-sky-500/20"
    >
      <Icon name="mdi:briefcase-outline" class="text-sm" />
      Work With Me
    </NuxtLink>
  </div>
</template>