<template>
    <section class="mx-auto px-8 bg-gray-900">
      <div class="grid grid-cols-2 gap-4 flex items-center">
        <div>
          <p
            class="mb-4 font-extrabold tracking-tight leading-none text-white"
          >
           HELLO, MY NAME IS DONAVAN JONES
          </p>
          <h1
            class="mb-4 text-2xl font-extrabold tracking-tight leading-none text-white md:text-3xl lg:text-5xl"
          >
          Experienced Full Stack Developer Seeking Dynamic Team to Bring Web Visions to Life
          </h1>
          <p
            class="mb-8 text-lg font-normal text-gray-500 lg:text-xl"
          >
          Passionate and experienced Full Stack Developer seeking new opportunities to create stunning and functional web experiences. Proficient in HTML, CSS, JavaScript, Vue.js, Tailwind CSS, and Laravel with a strong focus on responsive design and user experience. Seeking to join a dynamic team that values creativity, collaboration, and innovation. Let's work together to bring your web vision to life!
          </p>

          

          <CardDeckThreeColumns>
            <Card 
              title="Vue.js"
              description="Experienced in Vue.js, a reactive and component-based framework for building scalable and dynamic user interfaces."
            />
            <Card 
              title="Tailwind CSS"
              description="Skilled in Tailwind CSS, a utility-first framework that allows for rapid UI development and easy customization."
            />
            <Card 
              title="Laravel"
              description="Experienced in Laravel, a PHP framework that provides an elegant syntax and tools for building scalable and robust web applications."
            />
          </CardDeckThreeColumns>
        
          <div
            class="flex flex-col space-y-4 sm:flex-row sm:justify-left sm:space-y-0 sm:space-x-4"
          >
            <button
              type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
                Get Started Now!
            </button>
          </div>
        </div>

        <div class="self-end">
          <img src="~/assets/images/temp-man.png" />
        </div>
      </div>
    </section>
</template>

<script>
export default {
  name: "HeroSection",
};
</script>

<style scoped>
</style>