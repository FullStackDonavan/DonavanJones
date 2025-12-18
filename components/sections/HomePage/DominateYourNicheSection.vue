<template>
  <BasicSection class="container mx-auto mt-20">
    <GridTwoColumns>
      <div class="p-4 sm:p-8">
        <img src="/img/Sales-Generating-Machine.png" v-show="isDark" />
        <img src="/img/Sales-Generating-Machine-Light.png" v-show="!isDark" />
      </div>
      <div class="p-4 sm:p-8">
        <ParagraphSubHeading>
          {{ IntroText.SubHeading }}
        </ParagraphSubHeading>
        <HeadlineTwo>
          {{ IntroText.Headline }}
        </HeadlineTwo>
        <ParagraphDescription>
          {{ IntroText.description }}
        </ParagraphDescription>
        <div
          class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-left sm:space-y-0 sm:space-x-4"
        >
          <NuxtLink
            to="/house-painting-marketing-program"
            class="text-slate-100 hover:text-slate-300 dark:hover:text-slate-100 dark:text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-amber-800 bg-blue-400 hover:bg-blue-800 dark:bg-amber-500 dark:hover:bg-amber-600 font-medium text-sm rounded-lg px-5 py-2.5 mr-2 mb-2"
          >
            Learn More About Our Program
          </NuxtLink>
        </div>
      </div>
    </GridTwoColumns>
  </BasicSection>
</template>

<script>
export default {
  name: "TwoColumnSection",
  props: {
    title: String,
    description: String,
    mediaFirst: Boolean,
    subTitle: String,
  },
  data() {
    return {
      colorMode: useColorMode(),
      IntroText: {
        SubHeading:
          "Comprehensive Marketing Solutions To Elevate Your Business Beyond Just A Website",
        Headline:
          "Establish Your Dominance In Your Niche With Our Web Marketing Solutions",
        description:
          "Our team of marketing experts has extensive experience in designing and executing successful campaigns for businesses that aim to boost leads, phone calls, transactions, and web traffic. We will apply this expertise to your marketing strategy, too. While your website is an essential component of your online presence, it is just one of the tools in your marketing toolbox. It is not a comprehensive marketing plan in itself. Thats why our core program comprises all the vital components for maintaining your organic marketing presence. However, this is only the beginning. Our objective is to collaborate with you to develop a marketing plan that is customized to suit your companys specific requirements and advertising budget.",
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