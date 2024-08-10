<template>
  <BasicSection class="container mx-auto mt-20">
    <GridTwoColumns>
      <div class="p-4 sm:p-8">
        <img src="/img/Beyond-The-Launch.jpg" v-show="isDark" />
        <img src="/img/Beyond-The-Launch.jpg" v-show="!isDark" />
      </div>
      <div class="p-4 sm:p-8">
        <ParagraphSubHeading>
          {{ IntroText.SubHeading }}
        </ParagraphSubHeading>
        <HeadlineTwo>{{ IntroText.Headline }}</HeadlineTwo>
        <ParagraphDescription>
          {{ IntroText.description }}
        </ParagraphDescription>
      </div>
    </GridTwoColumns>
  </BasicSection>
</template>

<script>
export default {
  name: "Ideal Customers Section",
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
          "Continuous Development for Lead Generation and Local Authority",
        Headline:
          "Beyond the Launch: Elevating Contractors' Online Presence with Expert Marketing Strategies",
        description:
          "Launching your website is just the starting point in your marketing strategy. Since our establishment, we've been assisting contractors in cultivating their own leads and solidifying their presence as local authorities. Through continuous development of online marketing strategies, we specialize in optimizing SEO, local search, review management, and website enhancements to elevate contractors' visibility in Google search results.",
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