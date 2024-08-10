<template>
  <div>
    <SlantedSection
      height="250px"
      backgroundColor="#CBD5E1"
      :reverse="false"
      :isTop="true"
    />
    <SectionContainer>
      <GridTwoColumns>
        <div class="p-4 sm:p-8">
          <img src="/img/Conversations-Tab.jpg" />
        </div>
        <div class="p-4 sm:p-8">
          <ParagraphSubHeading>
            {{ IntroText.SubHeading }}
          </ParagraphSubHeading>
          <HeadlineTwo>{{ IntroText.Headline }}</HeadlineTwo>
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
    </SectionContainer>
    <SlantedSection
      height="250px"
      backgroundColor="#CBD5E1"
      :reverse="true"
      :isTop="false"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      IntroText: {
        SubHeading:
          "To Expand Your Business, Increase Online Leads, Calls, And Revenue",
        Headline: "Engage With Your Ideal Customers",
        description:
          "Empower your small business with the Conversations Tab, a dynamic feature crafted to enhance communication and elevate customer engagement. Integrated seamlessly, it serves as a centralized hub for managing conversations, inquiries, and leads. Small businesses can efficiently track and respond to customer interactions, ensuring a personalized and timely approach. The Conversations Tab streamlines processes across various channels, from social media to website inquiries, fostering meaningful connections with clients. With its intuitive interface and powerful features, this software enriches customer relations, driving sustained growth and success.",
      },
    };
  },
};
</script>

<style scoped>
</style>
