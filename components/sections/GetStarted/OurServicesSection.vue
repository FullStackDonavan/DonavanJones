<template>
  <BasicSection class="container mx-auto mt-20">
    <div class="p-4 sm:p-8">
      <ParagraphSubHeading>{{ IntroText.SubHeading }}</ParagraphSubHeading>
      <HeadlineTwo>{{ IntroText.Heading }}</HeadlineTwo>
    </div>
    <div class="p-4 sm:p-8">
      <CardDeckFourColumns>
        <ServiceCard
          v-for="Service in Services"
          :key="Service.id"
          :title="Service.title"
          :image="Service.image"
          :description="Service.description"
        />
      </CardDeckFourColumns>
    </div>
  </BasicSection>
</template>

<script>
export default {
  name: "Our Services",
  data() {
    return {
      IntroText: {
        SubHeading: "Unlock the Value of",
        Heading: "Our Contractor Marketing Program",
      },
      Services: [
        {
          id: 1,
          title: "Professional Website Design",
          image: "/img/contractor-marketing-program.jpg",
          description:
            "Our in-house design and development team will create a striking website that meets current design and optimization specifications.",
        },
        {
          id: 2,
          title: "Website Hosting",
          image: "/img/contractor-marketing-program.jpg",
          description:
            "We use the latest technologies to host your website with respectable uptime and consistently strong performance - that's one less bill for you to worry about.",
        },
        {
          id: 3,
          title: "Search Engine Optimization",
          image: "/img/contractor-marketing-program.jpg",
          description:
            "Search engine optimization (SEO) is built right into your website to maximize organic and local search rankings to keep your company visible to potential clients.",
        },
        {
          id: 4,
          title: "Local Optimization Management",
          image: "/img/contractor-marketing-program.jpg",
          description:
            "Your Google Map and Local Optimization presence doesn't happen by accident. Using Yext, we take care of managing your local SEO for better local presence.",
        },
        {
          id: 5,
          title: "Online Review Management System",
          image: "/img/contractor-marketing-program.jpg",
          description:
            "Online reviews can make or break a companies business. Our system, powered by Birdeye, allows you to monitor your business' reviews across the web as well as encouraging positive reviews from your clients.",
        },
        {
          id: 6,
          title: "Website Updates & Improvements",
          image: "/img/contractor-marketing-program.jpg",
          description:
            "The right content is essential to your overall online presence. Our in-house writing team develops the material needed to turn website visitors into leads.",
        },
        {
          id: 7,
          title: "Marketing Planning",
          image: "/img/contractor-marketing-program.jpg",
          description:
            "With your business goals and budget in mind, we will create a custom marketing plan that will help you capture the leads you need to keep your calendar full.",
        },
        {
          id: 8,
          title: "So Much More",
          image: "/img/contractor-marketing-program.jpg",
          description:
            "From our guarantees to our graphic design services, there are so many different services that we provide under our contractor marketing program.",
        },
      ],
    };
  },
};
</script>