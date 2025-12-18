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
  <div class="flex justify-between p-4">
    <!-- <NuxtLink to="/get-started">
      <svg
        class="dark:text-gray-50 h-6 w-6 lg:block hover:dark:text-blue-400 hover:text-blue-400"
        fill="currentColor"
        width="1.5em"
        height="1.5em"
        viewBox="0 0 14 14"
        aria-hidden="true"
      >
        <path
          class="dark:text-gray-50 h-6 w-6 lg:block hover:dark:text-blue-400 hover:text-blue-400"
          fillRule="evenodd"
          d="m6.547 10.263l-2.81-2.81c.309-.517.617-1.052.922-1.584c1.016-1.766 2.008-3.49 2.938-4.387c2.524-2.524 5.981-1.06 5.981-1.06s1.463 3.457-1.06 5.981c-.89.922-2.587 1.9-4.34 2.908c-.546.315-1.097.632-1.631.952m2.14-6.532a1.582 1.582 0 1 1 3.164 0a1.582 1.582 0 0 1-3.163 0Zm-4.09-.232c-1.418-.377-2.749.321-3.93 1.404a.48.48 0 0 0 .089.765l1.905 1.148l.002-.004c.275-.46.582-.993.894-1.533c.355-.617.716-1.243 1.04-1.78m2.587 7.84l1.148 1.905a.48.48 0 0 0 .765.088c1.083-1.18 1.782-2.512 1.404-3.93c-.522.314-1.07.63-1.613.943l-.083.048c-.548.316-1.091.628-1.616.943zM2.622 9.343a2 2 0 0 1 1.402 3.46c-.222.212-.569.378-.89.506a10.47 10.47 0 0 1-1.1.358c-.367.1-.717.18-.982.233a5.991 5.991 0 0 1-.336.059a2.99 2.99 0 0 1-.133.013a.54.54 0 0 1-.198-.022a.509.509 0 0 1-.241-.156a.508.508 0 0 1-.11-.22a.547.547 0 0 1-.012-.176c.003-.04.009-.086.015-.128c.013-.088.033-.203.06-.334c.053-.264.135-.612.235-.977c.1-.364.222-.754.359-1.095c.128-.321.294-.667.506-.888a2 2 0 0 1 1.425-.633"
          clipRule="evenodd"
        ></path>
      </svg>
    </NuxtLink> -->

    <NuxtLink to="tel:+1863-339-9964">
      <svg
        class="dark:text-gray-50 h-6 w-6 lg:block hover:dark:text-blue-400 hover:text-blue-400"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M6 22v-7h1v3.5h10v-13H7V9H6V2h12v20zm4-6.692l-.708-.708l2.089-2.1H2.5v-1h8.88L9.293 9.4L10 8.692L13.308 12z"
        ></path>
      </svg>
    </NuxtLink>

    <NuxtLink to="/dashboard" v-if="isLoggedIn">
      <svg
        class="dark:text-gray-50 h-6 w-6 lg:block hover:dark:text-blue-400 hover:text-blue-400"
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M9 21H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2m6 0h4c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2m6-13V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2"
        />
      </svg>
    </NuxtLink>

    <span
      class="md:block"
      @click="setColorTheme($colorMode.preference == 'dark' ? 'light' : 'dark')"
    >
      <svg
        v-if="$colorMode.value == 'dark'"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-gray-50 lg:block hover:dark:text-yellow-400 hover:text-yellow-400"
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
        class="h-6 w-6 lg:block hover:dark:text-yellow-400 hover:text-yellow-400"
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
    <!-- <User :isLoggedIn="isLoggedIn" class="md:block" /> -->
  </div>
</template>