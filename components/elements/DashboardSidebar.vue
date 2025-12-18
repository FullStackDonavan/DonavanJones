<script setup lang="ts">
// import DialogBox from "./DialogBox.vue";
const router = useRouter();
const route = useRoute();
const isLoggedIn = await useLoggedIn();
const hideDialog = ref(true);

console.log(route.path);

function goToAskForm() {
  if (isLoggedIn) {
    router.push("/dashboard/ask");
  }

  hideDialog.value = false;
}

function rehide() {
  hideDialog.value = true;
}
</script>

<template>
  <div>
    <div class="pt-5 z-10 boarder justify-right">
      <div class="w-100" aria-label="Sidebar">
        <div
          class="overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-900"
        >
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/dashboard"
                class="flex items-center text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Icon
                  name="material-symbols:space-dashboard-rounded"
                  class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  size="45"
                />
                <span class="">Dashboard</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/dashboard/WebsiteBuild"
                class="flex items-center text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Icon
                  name="file-icons:robots"
                  class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  size="45"
                />
                <span class="flex-1 whitespace-nowrap">AI Agent</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/dashboard/ask"
                class="flex items-center text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="goToAskForm"
              >
                <Icon
                  name="ic:sharp-live-help"
                  class="flex items-center pr-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  size="45"
                />
                <span class="flex-1 whitespace-nowrap">Ask Question</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/dashboard/search"
                class="flex items-center text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Icon
                  name="ic:outline-find-in-page"
                  class="flex items-center text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  size="40"
                />
                <span class="flex-1 whitespace-nowrap">Search Questions</span>
              </NuxtLink>
            </li>
            <li>
              <a
                href="#"
                class="flex items-center text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Icon
                  name="material-symbols:reviews-rounded"
                  class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  size="50"
                />
                <span class="flex-1 whitespace-nowrap">Leave A Review</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
