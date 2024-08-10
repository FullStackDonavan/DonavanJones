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
          "Nurturing Business Synergy Through Personalized Strategies and Unparalleled Dedication",
        Headline:
          "Donavan Jones: Crafting Value-Driven Marketing Partnerships with Next.js SSR and Automation Integration",
        description:
          "As Donavan Jones, I underscore the intrinsic value we bring to the table, acknowledging the commonality of discussing value while emphasizing its pivotal role in our approach. Leveraging my expertise in Next.js SSR and integration with automation software, we transcend the ordinary by cultivating robust relationships with each client, investing time to genuinely understand the unique intricacies of their business. This collaborative effort yields substantial payoffs. Once familiar with your operational nuances, we customize your marketing strategy to seamlessly align with your business objectives. Our commitment extends beyond initial engagements, persisting for all clients, including future ones like you. We recognize that our success contributes to the growth of small businesses, benefiting employees and communities. Our reliance on referrals for the majority of new clients is a testament to our effective approach, a commitment we steadfastly uphold.",
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