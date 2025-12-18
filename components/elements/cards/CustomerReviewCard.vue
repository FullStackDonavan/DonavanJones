<template>
  <div>
    <div
      class="container flex flex-col items-center justify-center mx-auto lg:flex-row lg:flex-wrap lg:justify-evenly lg:px-10"
    >
      <div
        class="flex flex-col max-w-sm mx-4 my-6 shadow-lg"
        v-for="review in reviews"
        :key="review.id"
      >
        <div
          class="px-4 py-12 rounded-t-lg sm:px-8 md:px-12 bg-gray-50 dark:bg-gray-900"
        >
          <p
            class="relative px-6 py-1 text-lg italic text-center dark:text-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="currentColor"
              class="w-8 h-8 text-blue-400 dark:text-amber-400"
            >
              <path
                d="M232,246.857V16H16V416H54.4ZM48,48H200V233.143L48,377.905Z"
              ></path>
              <path
                d="M280,416h38.4L496,246.857V16H280ZM312,48H464V233.143L312,377.905Z"
              ></path></svg
            >{{ review.testimonial }}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="currentColor"
              class="absolute right-0 w-8 h-8 text-blue-400 dark:text-amber-400"
            >
              <path
                d="M280,185.143V416H496V16H457.6ZM464,384H312V198.857L464,54.1Z"
              ></path>
              <path
                d="M232,16H193.6L16,185.143V416H232ZM200,384H48V198.857L200,54.1Z"
              ></path>
            </svg>
          </p>
        </div>
        <div
          class="flex flex-col items-center justify-center p-8 rounded-b-lg text-gray-100 bg-blue-400 dark:bg-amber-400 dark:text-gray-900"
        >
          <img
            src="https://source.unsplash.com/50x50/?portrait?1"
            alt=""
            class="w-16 h-16 mb-2 -mt-16 bg-center bg-cover rounded-full dark:bg-gray-500 dark:bg-gray-700"
          />
          <p class="text-xl font-semibold leadi">{{ review.name }}</p>
          <p class="text-sm uppercase">{{ review.company }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
  
  
<script>
export default {
  name: "Customer Review Card",
  data() {
    return {
      reviews: [
        {
          id: 1,
          name: "Tim Baggett",
          company: "Amerus Financial",
          testimonial:
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatibus quibusdam, eligendi exercitationem molestias possimus facere.",
        },
        {
          id: 1,
          name: "Vance Touchton",
          company: "Good Time Travel",
          testimonial:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ultrices dui sapien eget mi proin sed libero. Odio euismod lacinia at quis risus sed vulputate. At auctor urna nunc id cursus metus aliquam eleifend mi",
        },
        {
          id: 1,
          name: "Geno Yauchler",
          company: "Florida Water Analysis",
          testimonial:
            "Nunc eget lorem dolor sed. Id aliquet lectus proin nibh nisl condimentum id. Amet massa vitae tortor condimentum lacinia quis vel eros. Arcu risus quis varius quam quisque id diam. Scelerisque felis imperdiet proin fermentum leo.",
        },
      ],
    };
  },
};
</script>
  
  <style>
</style>