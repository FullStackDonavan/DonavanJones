<template>
  <SectionContainer>
    <GridTwoColumns>
      <div>
        <p
          class="mb-4 font-extrabold tracking-tight leading-none dark:text-slate-400"
        >
          Partner With An Expert To Help Build Your Service Area Business
        </p>
        <h1
          class="mb-4 text-2xl font-extrabold tracking-tight leading-none dark:text-slate-400 md:text-3xl lg:text-5xl"
        >
          Discover the Lead-Generating Magic of Donavan Jones' Marketing
          Program!
        </h1>
        <p
          class="mb-8 text-lg font-normal text-slate-700 dark:text-slate-500 lg:text-xl"
        >
          As Donavan Jones, my commitment lies in the success of your
          contracting or home services business. With specialized expertise in
          contractor marketing and a profound understanding of the construction
          and service industries, I'm dedicated to helping you thrive and expand
          your business. My goal is to address your marketing needs seamlessly,
          recognizing that your focus is on managing your business. Allow me to
          craft a website and online marketing strategy that not only looks
          impressive but also generates leads, ultimately contributing to the
          growth of your business.
        </p>

        <CardDeckThreeColumns>
          <Card
            title="Revamp Your Lead Generation"
            description="Revolutionize your lead generation process."
          />
          <Card
            title="Website Design Solutions"
            description="Increase your chances of converting visitors into customers."
          />
          <Card
            title="Elevate Your Business"
            description="Take your business to the next level with automation."
          />
        </CardDeckThreeColumns>

        <div
          class="flex flex-col space-y-4 sm:flex-row sm:justify-left sm:space-y-0 sm:space-x-4"
        >
          <NuxtLink
            to="/get-started"
            class="text-slate-100 hover:text-slate-300 dark:hover:text-slate-100 dark:text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-amber-800 bg-blue-400 hover:bg-blue-800 dark:bg-amber-500 dark:hover:bg-amber-600 font-medium text-sm rounded-lg px-5 py-2.5 mr-2 mb-2"
          >
            Get Started Now!
          </NuxtLink>
        </div>
      </div>

      <div class="w-full h-full">
        <!-- <img src="img/temp-man.png" /> -->
        <!-- <video className="h-full w-full rounded-lg" controls>
          <source
            src="https://docs.material-tailwind.com/demo.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video> -->
        <!-- <div className="aspect-w-16 aspect-h-9">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/oiFo2z8ILNo"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div> -->
        <EmbedYoutube
          videoSrc="https://www.youtube.com/embed/p02AIAoImzU?si=-fhOLle0HIOhOEvX"
        />
      </div>
    </GridTwoColumns>
  </SectionContainer>
</template>

<script>
export default {
  name: "HeroSection",
};
</script>

<style scoped>
</style>