<template>
  <BasicSection class="dark:bg-gray-800 dark:text-gray-100">
    <div
      class="container flex flex-col items-center mx-auto mb-12 p-4 sm:p-8 md:p-10 md:px-12"
    >
      <HeadlineTwo>
        {{ IntroText.Heading }}
      </HeadlineTwo>
    </div>
    <CustomerReviewCard />
  </BasicSection>
</template>

<script>
export default {
  name: "Customer Review Section ",
  data() {
    return {
      IntroText: {
        Heading: "Read trusted reviews from our customers",
      },
    };
  },
};
</script>

