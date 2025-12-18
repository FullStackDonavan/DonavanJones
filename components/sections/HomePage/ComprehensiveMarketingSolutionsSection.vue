<template>
  <BasicSection class="container mx-auto mt-20">
    <div class="p-4 sm:p-8">
      <ParagraphSubHeading>
        {{ IntroText.SubHeading }}
      </ParagraphSubHeading>
      <HeadlineTwo>{{ IntroText.Heading }}</HeadlineTwo>
      <ParagraphDescription>
        {{ IntroText.description }}
      </ParagraphDescription>
    </div>
  </BasicSection>
</template>

<script>
export default {
  name: "Industries We Serve",
  data() {
    return {
      IntroText: {
        SubHeading:
          "Relying Solely On Referrals And Word Of Mouth Is No Longer Enough For Businesses. Smart Business Owners Now Integrate Digital Marketing Into Their Marketing Plan",
        Heading: "Comprehensive Marketing Solutions",
        description:
          "Discover the power of our solutions as we guide you through transforming your website into a sales-generating machine. Engage with your ideal customers seamlessly and tap into the vast online market where your services are actively sought by potential customers every day. With our integrated approach, we ensure a dynamic online presence that not only attracts but captivates your target audience. Elevate your marketing strategy and witness the impact as your business thrives in the digital",
      },
    };
  },
};
</script>