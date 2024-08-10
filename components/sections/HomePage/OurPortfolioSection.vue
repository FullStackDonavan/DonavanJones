<template>
  <BasicSection
    ><ColumnAnimated animationClass="fade-in">
      <div class="p-4 sm:p-8">
        <ParagraphSubHeading>
          {{ IntroText.SubHeading }}
        </ParagraphSubHeading>
        <HeadlineTwo>
          {{ IntroText.Heading }}
        </HeadlineTwo>
        <ParagraphDescription>
          {{ IntroText.description }}
        </ParagraphDescription>
      </div></ColumnAnimated
    >
    <ColumnAnimated animationClass="fade-in"> <MagicCarousel /></ColumnAnimated>
  </BasicSection>
  <!-- <div class="p-4 sm:p-8">
    <CardDeckThreeColumns>
      <LaunchCard
        v-for="Item in Items"
        :key="Item.id"
        :title="Item.title"
        :image="Item.image"
      />
    </CardDeckThreeColumns>
  </div> -->
</template>

<script>
export default {
  name: "Our Portfolio",
  data() {
    return {
      IntroText: {
        SubHeading: "My Work",
        Heading: "Explore My Work",
        description:
          "Discover a curated selection of projects that showcase my expertise in both front-end and back-end development. From dynamic websites built with PHP and WordPress to interactive web applications using JavaScript frameworks like Vue, Nuxt, and React, each project highlights my commitment to delivering clean, efficient, and impactful solutions. Dive into my portfolio to see how I turn complex challenges into elegant solutions and drive digital success.",
      },
      Items: [
        {
          id: 1,
          title: "Custom Painting By Dale",
          image: "/img/custom-painting-by-dale-vercel-app.png",
        },
        {
          id: 2,
          title: "Absolute House Painters",
          image: "/img/absolutehousepainters.png",
        },
        {
          id: 3,
          title: "Annapolis Painting",
          image: "/img/annapolispainting.png",
        },
      ],
    };
  },
};
</script>
