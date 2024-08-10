<template>
  <BasicSection class="container mx-auto mt-20">
    <GridTwoColumns>
      <div class="p-4 sm:p-8">
        <img src="/img/Your-Sites-Launch.jpg" />
      </div>
      <div class="p-4 sm:p-8">
        <ParagraphSubHeading>{{ IntroText.SubHeading }}</ParagraphSubHeading>
        <HeadlineTwo>{{ IntroText.Heading }}</HeadlineTwo>
        <ParagraphDescription
          v-for="Paragraph in Paragraphs"
          :key="Paragraph.id"
        >
          {{ Paragraph.text }}
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
        SubHeading: "What Takes Place Once",
        Heading: "Your Site's Launch",
      },
      Paragraphs: [
        {
          id: 1,
          text: "Launching your site is just the initial step. Sustaining a robust online presence requires consistent effort. Ongoing development ensures your website stays relevant and attractive to potential customers.",
        },
        {
          id: 2,
          text: "After development, we'll submit your site to all search engines and local directories, maximizing traffic potential for your company.",
        },
        {
          id: 3,
          text: "We will handle monthly updates, keeping your website current with articles, new projects, and news. Continuous optimization ensures optimal traffic. Once your site is live, we make any changes or additions to your marketing materials as needed.",
        },
      ],
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