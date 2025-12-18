<template>
  <PatternSection>
    <!-- <HousePainterCompanyMarketingHeroSection /> -->
    <BasicImageSlider :slides="imageSlides" />
    <WhatsCoveredInOurProgramSection />
    <ProfessionalWebAppDesignSection />
    <SearchEngineOptimizationSection />
    <LocalOptimizationSection />
    <WeProvideThePlanCTA />
    <OptimizingYourReviewsSection />
    <WebsiteUpdatesAndImprovementsSection />
    <MarketingPlanningSection />
    <Ribbon />
  </PatternSection>
</template>

<script>
import BasicImageSlider from "@/components/elements/sliders/BasicImageSlider.vue"; // Adjust the path as needed

export default {
  components: {
    BasicImageSlider,
  },
  data() {
    return {
      imageSlides: [
        {
          image: "/img/interior-painting.jpg",
          title: "Interior Painting",
          description:
            "Transform your home with our professional interior painting services.",
          buttonText: "Get Started",
          link: "/get-started",
        },
        {
          image: "/img/ExteriorPainting.jpg",
          title: "Exterior Painting",
          description:
            "Enhance your curb appeal with our expert exterior painting solutions.",
          buttonText: "Get Started",
          link: "/get-started",
        },
        {
          image: "/img/SpecialtyPainting.jpg",
          title: "Specialty Painting",
          description:
            "Custom painting services for unique and creative projects.",
          buttonText: "Get Started",
          link: "/get-started",
        },
        {
          image: "/img/ContractorPainters.jpg",
          title: "Contractor Painters",
          description:
            "Reliable and efficient painting contractors for your projects.",
          buttonText: "Get Started",
          link: "/get-started",
        },
      ],
    };
  },
};
</script>