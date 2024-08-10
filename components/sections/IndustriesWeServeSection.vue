<template>
  <SectionContainer>
    <ParagraphSubHeading>
      {{ IntroText.SubHeading }}
    </ParagraphSubHeading>
    <HeadlineTwo>
      {{ IntroText.Heading }}
    </HeadlineTwo>
    <ParagraphDescription>
      {{ IntroText.description }}
    </ParagraphDescription>
  </SectionContainer>
  <div class="bg-gray-100">
    <div class="max-w-full mx-auto flex flex-wrap">
      <!-- First Row -->
      <!-- Left Column -->
      <div class="w-full md:w-1/2 relative overflow-hidden mb-4 md:mb-0">
        <!-- Background Image -->
        <div
          class="bg-cover bg-center h-96 md:h-auto md:min-h-80 relative"
          :style="{ backgroundImage: `url(${leftBgImage})` }"
        >
          <!-- Overlay for hover effect -->
          <div
            class="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition-opacity flex flex-col items-center justify-center text-center"
          >
            <!-- Title -->
            <h2 class="text-white text-4xl font-bold mb-4">{{ leftTitle }}</h2>
            <!-- Button -->
            <nuxt-link to="/get-started" class="btn">
              {{ leftButton }}
            </nuxt-link>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="w-full md:w-1/2 relative overflow-hidden mb-4 md:mb-0">
        <!-- Background Image -->
        <div
          class="bg-cover bg-center h-96 md:h-auto md:min-h-80 relative"
          :style="{ backgroundImage: `url(${rightBgImage})` }"
        >
          <!-- Overlay for hover effect -->
          <div
            class="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition-opacity flex flex-col items-center justify-center text-center"
          >
            <!-- Title -->
            <h2 class="text-white text-4xl font-bold mb-4">{{ rightTitle }}</h2>
            <!-- Button -->
            <nuxt-link to="/get-started" class="btn">
              {{ rightButton }}
            </nuxt-link>
          </div>
        </div>
      </div>

      <!-- Second Row -->
      <!-- Left Column -->
      <div class="w-full md:w-1/2 relative overflow-hidden mb-4 md:mb-0">
        <!-- Background Image -->
        <div
          class="bg-cover bg-center h-96 md:h-auto md:min-h-80 relative"
          :style="{ backgroundImage: `url(${leftBgImage2})` }"
        >
          <!-- Overlay for hover effect -->
          <div
            class="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition-opacity flex flex-col items-center justify-center text-center"
          >
            <!-- Title -->
            <h2 class="text-white text-4xl font-bold mb-4">{{ leftTitle2 }}</h2>
            <!-- Button -->
            <nuxt-link to="/get-started" class="btn">
              {{ leftButton2 }}
            </nuxt-link>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="w-full md:w-1/2 relative overflow-hidden mb-4 md:mb-0">
        <!-- Background Image -->
        <div
          class="bg-cover bg-center h-96 md:h-auto md:min-h-80 relative"
          :style="{ backgroundImage: `url(${rightBgImage2})` }"
        >
          <!-- Overlay for hover effect -->
          <div
            class="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition-opacity flex flex-col items-center justify-center text-center"
          >
            <!-- Title -->
            <h2 class="text-white text-4xl font-bold mb-4">
              {{ rightTitle2 }}
            </h2>
            <!-- Button -->
            <nuxt-link to="/get-started" class="btn">
              {{ rightButton2 }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      IntroText: {
        SubHeading: "Residential And Commerical Painting Businesses We Serve",
        Heading:
          "Promotion Is Crucial For Residential Or Commercial Painting Businesses, Each Facing Unique Challenges And Hurdles",
        description:
          "Each Residential Or Commerical Painting Businesses possesses distinctive marketing requirements that necessitate the assistance of a strategic marketing partner to accomplish their objectives and goals. At True Coat Marketing LLC, we grasp the intricacies of these various industries and work closely with each business to integrate ourselves into their team.",
      },
      Industries: [
        {
          id: 1,
          title: "Flooring",
          image: "/img/contractor-marketing-program.jpg",
          description: "Satisifying Your Customers' Needs For Social Trust",
          url: "/",
        },
        {
          id: 2,
          title: "Cleaning Contractors",
          image: "/img/contractor-marketing-program.jpg",
          description: "Satisifying Your Customers' Needs For Social Trust",
          url: "/",
        },
        {
          id: 3,
          title: "Decking Contractors",
          image: "/img/contractor-marketing-program.jpg",
          description: "Satisifying Your Customers' Needs For Social Trust",
          url: "/",
        },
        {
          id: 4,
          title: "Electrical Contractors",
          image: "/img/contractor-marketing-program.jpg",
          description: "Satisifying Your Customers' Needs For Social Trust",
          url: "/",
        },
        {
          id: 5,
          title: "General Contractors",
          image: "/img/contractor-marketing-program.jpg",
          description: "Satisifying Your Customers' Needs For Social Trust",
          url: "/",
        },
      ],
      leftBgImage: "/img/Residental-Painting.jpg", // Replace with actual path
      rightBgImage: "/img/Commercial-Painting.jpg", // Replace with actual path
      leftTitle: "Residential Painting",
      rightTitle: "Commercial Painting",
      leftButton: "Get Started",
      rightButton: "Get Started",
      leftBgImage2: "/img/Contractor-Painting.jpg", // Replace with actual path
      rightBgImage2: "/img/Specialty-Painting.jpg", // Replace with actual path
      leftTitle2: "Contractor Painting",
      rightTitle2: "Specialty Painting",
      leftButton2: "Get Started",
      rightButton2: "Get Started",
    };
  },
};
</script>
  
  <style scoped>
.btn {
  background-color: #3182ce;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  transition: opacity 0.3s ease; /* Added transition for opacity */
}

.btn:hover {
  opacity: 1; /* Show the button on hover */
}
</style>
  