<template>
  <SlantedSection
    height="250px"
    backgroundColor="#CBD5E1"
    :reverse="false"
    :isTop="true"
  />
  <SectionContainer>
    <GridTwoColumns>
      <div>
        <ParagraphSubHeading>
          {{ IntroText.SubHeading }}
        </ParagraphSubHeading>
        <HeadlineTwo>
          {{ IntroText.Heading }}
        </HeadlineTwo>
        <ParagraphDescription>
          {{ IntroText.description }}
        </ParagraphDescription>
        <div
          class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-left sm:space-y-0 sm:space-x-4"
        >
          <NuxtLink
            to="/house-painting-marketing-program/website-updates-and-improvements"
            class="text-slate-100 hover:text-slate-300 dark:hover:text-slate-100 dark:text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-amber-800 bg-blue-400 hover:bg-blue-800 dark:bg-amber-500 dark:hover:bg-amber-600 font-medium text-sm rounded-lg px-5 py-2.5 mr-2 mb-2"
          >
            Learn More About Our Program
          </NuxtLink>
        </div>
      </div>
      <div>
        <img src="/img/Transform-Your-Website.jpg" v-show="isDark" />
        <img src="/img/Transform-Your-Website.jpg" v-show="!isDark" />
      </div>
    </GridTwoColumns>
  </SectionContainer>
  <SlantedSection
    height="250px"
    backgroundColor="#CBD5E1"
    :reverse="true"
    :isTop="false"
  />
</template>

<script>
export default {
  name: "TwoColumnSection",
  data() {
    return {
      colorMode: useColorMode(),
      IntroText: {
        SubHeading:
          "Enhancing User Experience: The Latest Website Updates and Improvements",
        Heading: "Website Updates & Improvements",
        description:
          "Integrating our advanced automation system directly into your website is a game-changer. With seamless API integration, your platform takes the lead in delivering powerful automated marketing campaigns, smooth client communications, and precise data tracking. Elevate your business by offering a tailored, state-of-the-art solution that enhances your online presence and gives you a competitive edge in the digital landscape. Explore the full potential of our API integration and transform your website into a dynamic, high-performing platform.",
      },
    };
  },
  computed: {
    // const isDark = this.$colorMode.value === "dark";
    isDark() {
      if (this.colorMode.preference === "dark") {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style scoped>
</style>