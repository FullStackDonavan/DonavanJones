<template>
  <BasicSection class="container mx-auto mt-20">
    <GridTwoColumns>
      <div class="p-4 sm:p-8">
        <ParagraphSubHeading>{{ IntroText.SubHeading }}</ParagraphSubHeading>
        <HeadlineTwo>{{ IntroText.Heading }}</HeadlineTwo>
        <ParagraphDescription>
          {{ IntroText.description }}
        </ParagraphDescription>

        <OrderedList>
          <ListItems v-for="ListItem in ListItems" :key="ListItem.id">
            <ListItemHeading>
              {{ ListItem.ListHeading }}
            </ListItemHeading>
            <ListItemParagraph>
              {{ ListItem.ListParagraph }}
            </ListItemParagraph>
          </ListItems>
        </OrderedList>
      </div>
      <div class="p-4 sm:p-8">
        <img src="/img/When-You-Register.jpg" />
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
        SubHeading: "What Takes Place",
        Heading: "When You Register",
        description:
          "Within a single business day after enrolling in our program, we will reach out to guide you through our process and inquire about the specific website you desire.",
      },
      ListItems: [
        {
          id: 1,
          ListHeading: "You Fill Out Our Information Packet",
          ListParagraph:
            "We will send you a information packet once your order is processed to complete. Along with the completed information packet, we will need all of your logos, pictures, and content that you want to use on your site.",
        },
        {
          id: 2,
          ListHeading: "Consultation",
          ListParagraph:
            "We will contact you to go over your information packet and gather any other personalized company details for your website.",
        },
        {
          id: 3,
          ListHeading: "Website Layout",
          ListParagraph:
            "We will design a 1-page layout of your site within 72 hours of receiving your information packet and logo.",
        },
        {
          id: 4,
          ListHeading: "Completed Website",
          ListParagraph:
            "Once the layout is approved, we will move forward and complete the website. Generally, websites are built within a 3 to 4 week  timeframe, but are subject to change based on circumstances such as holidays.",
        },
        {
          id: 5,
          ListHeading: "Website Launch",
          ListParagraph:
            "Once your website is live, you can review and make any changes needed to the site.",
        },
      ],
    };
  },
};
</script>