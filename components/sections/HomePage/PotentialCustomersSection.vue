<template>
  <BasicSection class="container mx-auto mt-20">
    <GridTwoColumns>
      <div class="p-4 sm:p-8">
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
            to="/house-painting-marketing-program"
            class="text-slate-100 hover:text-slate-300 dark:hover:text-slate-100 dark:text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-amber-800 bg-blue-400 hover:bg-blue-800 dark:bg-amber-500 dark:hover:bg-amber-600 font-medium text-sm rounded-lg px-5 py-2.5 mr-2 mb-2"
          >
            Learn More About Our Program
          </NuxtLink>
        </div>
      </div>
      <div class="p-4 sm:p-8">
        <img src="/img/Services-Are-Being-Searched.jpg" v-show="isDark" />
        <img src="/img/Services-Are-Being-Searched.jpg" v-show="!isDark" />
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
          "Empower your business to new heights with our marketing blueprint. Let us make it effortless for your customers to find you!",
        Heading:
          "Your Services Are Being Searched For Online Daily By Potential Customers!",
        description:
          "Modern SEO has evolved beyond traditional practices to encompass a holistic approach. It goes beyond keyword optimization, focusing on user experience, content quality, and technical aspects. Content relevance, mobile optimization, and voice search are key considerations. Technical SEO, such as website speed and structured data, is crucial, alongside building authoritative backlinks and leveraging social signals. With the integration of AI and machine learning, search engines are becoming more sophisticated in understanding user intent. Successful modern SEO requires a multifaceted strategy that embraces these diverse elements for optimal visibility and rankings in search engine results.",
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