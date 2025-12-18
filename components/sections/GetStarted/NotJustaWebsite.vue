<template>
  <BasicSection class="container mx-auto mt-20">
    <GridTwoColumns>
      <div class="p-4 sm:p-8">
        <ParagraphSubHeading>{{ IntroText.SubHeading }}</ParagraphSubHeading>
        <HeadlineTwo>{{ IntroText.Heading }}</HeadlineTwo>
        <ParagraphDescription>
          {{ IntroText.description }}
        </ParagraphDescription>
        <img src="/img/Not-Just-A-Website.jpg" />
      </div>
      <div class="p-4 sm:p-8">
        <div class="container mx-auto p-4">
          <BasicList>
            <BasicListItem
              v-for="Item in Items"
              :key="Item.id"
              :strong="Item.strong"
              :text="Item.text"
            />
          </BasicList>
        </div>
      </div>
    </GridTwoColumns>
  </BasicSection>
</template>

<script>
export default {
  name: "Industries We Serve",
  data() {
    return {
      IntroText: {
        SubHeading: "You get a Comprehensive Digital Solution",
        Heading: "Not Just a Website",
      },
      Items: [
        {
          id: 1,
          strong: "Satisfaction Assurance",
          text: "- Evaluate our website and online marketing program offerings, and if not entirely satisfied, we'll address your concerns promptly.",
        },
        {
          id: 2,
          strong: "Professional Graphic Design Services",
          text: "- Access our design department for print and online marketing needs, including business cards, brochures, door hangers, and more.",
        },
        {
          id: 3,
          strong: "Fixed Price Assurance",
          text: "- Benefit from a Fixed Price Guarantee, ensuring your online marketing program rates remain unchanged for at least three years.",
        },
        {
          id: 4,
          strong: "Timely Website Updates",
          text: "- Request updates for your website, and we'll ensure they're implemented promptly, typically within 2 business days for most requests.",
        },
        {
          id: 5,
          strong: "Effective Organic Search Engine Optimization",
          text: "- Utilize tailored content and preparation for organic SEO to enhance your online visibility for potential customers.",
        },
        {
          id: 6,
          strong: "Local Optimization &amp; Citations",
          text: "- Ensure search engines and potential customers locate your business with strategic citations and local SEO tactics",
        },
        {
          id: 7,
          strong: "Automated Review Management System",
          text: "- In today's digital landscape, online reviews are crucial. Our program enables you to automatically monitor and actively solicit new reviews.",
        },
        {
          id: 8,
          strong: "Transparent Billing",
          text: "- No Contracts, Build Fees, or Hidden Charges - We believe in earning your loyalty through satisfaction, and all our online marketing services operate on a month-to-month basis.",
        },
        {
          id: 9,
          strong: "Strategic Marketing Session",
          text: "- Engage in a comprehensive session with a marketing consultant to develop a 12-month marketing plan tailored to your company.",
        },
      ],
    };
  },
};
</script>