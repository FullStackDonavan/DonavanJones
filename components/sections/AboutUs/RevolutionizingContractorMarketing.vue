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
      </div>
      <div class="p-4 sm:p-8">
        <img
          src="/img/Revolutionizing-Contractor-Marketing.jpg"
          v-show="isDark"
        />
        <img
          src="/img/Revolutionizing-Contractor-Marketing.jpg"
          v-show="!isDark"
        />
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
          "Elevating Your Marketing Experience with Cutting-Edge Solutions",
        Heading:
          "Revolutionizing Contractor Marketing: Donavan Jones' Expertise in Next.js SSR and Automation Integration",
        description:
          "Donavan Jones is dedicated to ensuring your satisfaction and endeavors to be your trusted marketing partner throughout your business journey. With a steadfast focus on nurturing client relationships, I bring a wealth of expertise in Nuxt.js SSR and seamless integration with automation software to enhance your overall marketing experience. Embracing the latest in technology, we've expanded our range of marketing services, always prioritizing your business needs. The fusion of Nuxt.js SSR and automation software integration underscores our commitment to staying at the forefront of industry innovation. Continual investments in infrastructure further demonstrate our dedication to providing robust support for both your online and offline ventures. I invite you to join me in envisioning a future where we emerge as the foremost Contractor Marketing Firm.",
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