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
        <img src="/img/Your-Contractor-Marketing-Experts.jpg" v-show="isDark" />
        <img
          src="/img/Your-Contractor-Marketing-Experts.jpg"
          v-show="!isDark"
        />
      </div>
    </GridTwoColumns>
  </BasicSection>
</template>

<script>
export default {
  name: "TwoColumnSection",
  data() {
    return {
      colorMode: useColorMode(),
      IntroText: {
        SubHeading:
          "Nuxt.js SSR Magic for Contractor Marketing by Donavan Jones",
        Heading:
          "Empowering Contractors: Donavan Jones Unveils Cost-Effective Online Presence with Nuxt.js SSR Integration",
        description:
          "Donavan Jones brings a wealth of experience to the challenges faced by businesses in the home improvement industry, drawing from over a decade of expertise in both the home improvement sector and direct marketing. Recognizing the critical importance of cost-effective marketing, Donavan has established a reputation for providing innovative solutions. A standout feature of Donavan's portfolio is his proficiency in building Nuxt.js SSR (Server-Side Rendered) applications seamlessly integrated with his cutting-edge marketing platform. Leveraging this expertise, the Contractor Marketing Program not only offers contractors a polished online presence but also does so at a fraction of the cost typically associated with custom website design. Donavan's commitment to delivering affordable and tailored solutions ensures that contractors can elevate their online presence with professionalism and efficiency.",
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