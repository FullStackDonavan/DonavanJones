<script setup lang="ts">
// import TestingPhaseDialog from "~~/components/elements/TestingPhaseDialog.vue";

const router = useRouter();
const user = await useUser();

function goToRegister() {
  router.push("/register");
}
</script>

<template>
  <PatternSection>
    <!-- <TestingPhaseDialog class="z-30" /> -->
    <div class="min-h-screen">
      <div class="container m-auto px-6 py-20 md:px-12 lg:px-20">
        <div class="m-auto text-center lg:w-8/12 xl:w-7/12">
          <h2
            class="text-2xl text-gray-800 dark:text-gray-200 font-bold md:text-4xl"
          >
            Contractor Marketing That Generates Leads
          </h2>
        </div>
        <div class="flex gap-8">
          <!-- <div class="flex-auto">
            <div
              class="mt-12 m-auto -space-y-4 items-center justify-center md:space-y-0 md:-space-x-4 xl:w-10/12"
            >
              <div class="relative -mx-4 group md:w-100 md:mx-0 lg:w-100 z-20">
                <div
                  aria-hidden="true"
                  class="absolute top-0 w-full h-full dark:bg-gray-800 border-2 border-indigo-500/50 rounded-2xl bg-white shadow-xl transition duration-500 group-hover:scale-105 lg:group-hover:scale-110"
                ></div>
                <div class="relative p-6 space-y-6 lg:p-8">
                  <h3
                    class="text-3xl text-gray-900 dark:text-gray-100 font-semibold text-center"
                  >
                    Monthly Membership
                  </h3>
                  <div>
                    <div class="relative flex justify-around">
                      <div class="flex items-end">
                        <span
                          class="text-8xl text-gray-900 dark:text-gray-100 font-bold leading-0"
                          >$249.00</span
                        >
                      </div>
                    </div>
                  </div>
                  <ul
                    role="list"
                    class="w-max space-y-4 py-6 m-auto text-gray-900 dark:text-gray-100"
                  >
                    <li class="space-x-2">
                      <span
                        class="text-gray-900 dark:text-gray-100 font-semibold"
                        >&check;</span
                      >
                      <span>Professional Website Design</span>
                    </li>
                    <li class="space-x-2">
                      <span class="font-semibold">&check;</span>
                      <span>Search Engine Optimization</span>
                    </li>
                    <li class="space-x-2">
                      <span class="font-semibold">&check;</span>
                      <span>Local Optimization Management</span>
                    </li>
                    <li class="space-x-2">
                      <span class="font-semibold">&check;</span>
                      <span>Online Review Management System</span>
                    </li>
                    <li class="space-x-2">
                      <span class="font-semibold">&check;</span>
                      <span>Website Updates &amp; Improvements</span>
                    </li>
                    <li class="space-x-2">
                      <span class="font-semibold">&check;</span>
                      <span>Automated Marketing Campaigns</span>
                    </li>
                    <p class="text-gray-900 dark:text-gray-100">
                      Cancel anytime.
                    </p>
                  </ul>
                  <button
                    v-if="user == null"
                    @click="goToRegister"
                    class="block w-full py-3 px-6 text-center rounded-xl transition duration-500 hover:scale-110 hover:text-slate-300 dark:hover:text-slate-100 dark:text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-amber-800 bg-blue-400 hover:bg-blue-800 dark:bg-amber-500 dark:hover:bg-amber-600"
                  >
                    <span class="text-white font-semibold">
                      Sign Up and Subscribe
                    </span>
                  </button>
                  <form v-else action="/api/subscribe" method="POST">
                    <input
                      type="hidden"
                      name="lookup_key"
                      value="price_1OGc15Dwc3XMpCoMsZdE2vfS"
                    />
                    <input type="hidden" name="user_id" :value="user.id" />
                    <button
                      type="submit"
                      title="Submit"
                      class="block w-full py-3 px-6 text-center rounded-xl transition duration-500 hover:scale-110 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 focus:bg-indigo-600"
                    >
                      <span class="text-white font-semibold">
                        Subscribe Now
                      </span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div> -->

          <div class="flex-auto">
            <div
              class="mt-12 m-auto -space-y-4 items-center justify-center md:space-y-0 md:-space-x-4 xl:w-10/12"
            >
              <div class="relative -mx-4 group md:w-100 md:mx-0 lg:w-100 z-20">
                <div
                  aria-hidden="true"
                  class="absolute top-0 w-full h-full dark:bg-gray-800 border-2 border-indigo-500/50 rounded-2xl bg-white shadow-xl transition duration-500 group-hover:scale-105 lg:group-hover:scale-110"
                ></div>
                <div class="relative p-6 space-y-6 lg:p-8">
                  <h3
                    class="text-3xl dark:text-gray-100 font-semibold text-center"
                  >
                    Monthly Membership
                  </h3>
                  <div>
                    <div class="relative flex justify-around">
                      <div class="flex items-end">
                        <span
                          class="text-8xl text-gray-900 dark:text-gray-100 font-bold leading-0"
                          >$499.00</span
                        >
                      </div>
                    </div>
                  </div>
                  <ul
                    role="list"
                    class="w-max space-y-4 py-6 m-auto text-gray-900 dark:text-gray-100"
                  >
                    <li class="space-x-2">
                      <span class="font-semibold">&check;</span>
                      <span>Professional Website Design</span>
                    </li>
                    <li class="space-x-2">
                      <span class="font-semibold">&check;</span>
                      <span>Search Engine Optimization</span>
                    </li>
                    <li class="space-x-2">
                      <span class="font-semibold">&check;</span>
                      <span>Local Optimization Management</span>
                    </li>
                    <li class="space-x-2">
                      <span class="font-semibold">&check;</span>
                      <span>Online Review Management System</span>
                    </li>
                    <li class="space-x-2">
                      <span class="font-semibold">&check;</span>
                      <span>Website Updates &amp; Improvements</span>
                    </li>
                    <li class="space-x-2">
                      <span class="font-semibold">&check;</span>
                      <span>Automated Marketing Campaigns</span>
                    </li>
                    <p class="text-gray-900 dark:text-gray-100">
                      Cancel anytime.
                    </p>
                  </ul>
                  <button
                    v-if="user == null"
                    @click="goToRegister"
                    class="block w-full py-3 px-6 text-center rounded-xl transition duration-500 hover:scale-110 hover:text-slate-300 dark:hover:text-slate-100 dark:text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-amber-800 bg-blue-400 hover:bg-blue-800 dark:bg-amber-500 dark:hover:bg-amber-600"
                  >
                    <span class="text-white font-semibold">
                      Sign Up and Subscribe
                    </span>
                  </button>
                  <form v-else action="/api/subscribe" method="POST">
                    <input
                      type="hidden"
                      name="lookup_key"
                      value="price_1OPS3qDwc3XMpCoMJHhmxOM1"
                    />
                    <input type="hidden" name="user_id" :value="user.id" />
                    <button
                      type="submit"
                      title="Submit"
                      class="block w-full py-3 px-6 text-center rounded-xl transition duration-500 hover:scale-110 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 focus:bg-indigo-600"
                    >
                      <span class="text-white font-semibold">
                        Subscribe Now
                      </span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CustomerReviewSection />
  </PatternSection>
</template>
