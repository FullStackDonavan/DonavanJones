<template>
  <SectionContainer>
    <GridTwoColumns>
      <div>
        <p
          class="mb-4 font-extrabold tracking-tight leading-none dark:text-slate-400"
        >
          Get Started On Your Contractor Marketing Journey
        </p>
        <h1
          class="mb-4 text-2xl font-extrabold tracking-tight leading-none dark:text-slate-400 md:text-3xl lg:text-5xl"
        >
          With Our Platform
        </h1>
        <p
          class="mb-8 text-lg font-normal text-slate-700 dark:text-slate-500 lg:text-xl"
        >
          Revolutionize your business growth with our cutting-edge contractor
          marketing program. Unlock a stream of new clients, slash marketing
          costs (both in time and money compared to in-house operations), and
          watch your profits soar to new heights.
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
            to="/subscribe"
            class="text-slate-100 hover:text-slate-300 dark:hover:text-slate-100 dark:text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-amber-800 bg-blue-400 hover:bg-blue-800 dark:bg-amber-500 dark:hover:bg-amber-600 font-medium text-sm rounded-lg px-5 py-2.5 mr-2 mb-2"
          >
            Sign Up and Subscribe
          </NuxtLink>
        </div>
      </div>

      <div class="w-full h-full">
        <img src="/img/Our-Platform.jpg" />
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