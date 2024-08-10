<template>
  <div class="container mx-auto px-4 lg:px-10">
    <div class="flex flex-wrap justify-center gap-6">
      <!-- Render cards -->
      <div
        v-for="guarantee in guarantees"
        :key="guarantee.id"
        class="flex flex-col max-w-sm mx-4 my-6 shadow-lg bg-white dark:bg-gray-800"
      >
        <!-- Flex container for number and description -->
        <div class="flex flex-col lg:flex-row flex-grow">
          <!-- Number -->
          <div
            class="flex items-center justify-center w-full lg:w-1/3 p-4 bg-gray-50 dark:bg-gray-800"
          >
            <div class="text-blue-500 dark:text-yellow-400 text-8xl font-bold">
              {{ guarantee.id }}
            </div>
          </div>
          <!-- Description -->
          <div class="flex-grow p-4 bg-gray-50 dark:bg-gray-800">
            <p class="text-base md:text-sm lg:text-base dark:text-gray-100">
              {{ guarantee.description }}
            </p>
          </div>
        </div>
        <!-- Title at the bottom -->
        <div
          class="flex flex-col items-center justify-center p-8 rounded-b-lg text-gray-100 bg-blue-400 dark:bg-amber-400 dark:text-gray-900"
        >
          <p class="text-xl lg:text-2xl font-semibold">{{ guarantee.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomerGuaranteesSection",
  data() {
    return {
      colorMode: useColorMode(),
      guarantees: [
        {
          id: 1,
          name: "3 Year Fixed Price",
          description:
            "Our 'fixed-price' promise ensures you receive continuous updates, features, and functionality with no price increases for at least three years.",
        },
        {
          id: 2,
          name: "3 Month Money Back",
          description:
            "Our Commitment to You: If within 90 days you're not entirely satisfied with our program, just give us a call to cancel.",
        },
        {
          id: 3,
          name: "Unlimited Improvements",
          description:
            "Every day, new technological advancements offer home and commercial painting companies innovative ways to attract new clients, maintain connections with current ones, and boost referrals from past customers.",
        },
      ],
    };
  },
};
</script>
