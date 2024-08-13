<template>
  <BasicSection class="container mx-auto mt-20">
    <GridTwoColumns>
      <ColumnAnimated animationClass="fade-in">
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
          <div
            class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-left sm:space-y-0 sm:space-x-4"
          >
            <NuxtLink
              to="/"
              class="text-slate-100 hover:text-slate-300 dark:hover:text-slate-100 dark:text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-amber-800 bg-blue-400 hover:bg-blue-800 dark:bg-amber-500 dark:hover:bg-amber-600 font-medium text-sm rounded-lg px-5 py-2.5 mr-2 mb-2"
            >
              Contact Me
            </NuxtLink>
          </div>
        </div>
      </ColumnAnimated>
      <ColumnAnimated animationClass="fade-in">
        <div class="p-4 sm:p-8">
          <img src="/img/Transform-Your-Website.jpg" v-show="isDark" />
          <img src="/img/Transform-Your-Website.jpg" v-show="!isDark" /></div
      ></ColumnAnimated>
    </GridTwoColumns>
  </BasicSection>
</template>

<script>
export default {
  name: "TwoColumnSection",
  data() {
    return {
      colorMode: useColorMode(),
      IntroText: {
        SubHeading: "I'm Here to Help",
        Heading: "Get in Touch",
        description:
          "Have a project in mind or just want to say hello? I'm always open to new opportunities and discussions. Whether you need assistance with a development challenge, want to collaborate on an exciting project, or simply have a question, don't hesitate to reach out. Fill out the contact form below, and I'll get back to you as soon as possible. Let's connect and explore how we can create something amazing together!",
      },
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

<style scoped>
.startInvisible {
  opacity: 0;
  transform: translateY(20px);
  filter: blur(40px);
}

.fadeIn {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
  transition: opacity 0.7s ease-in-out, transform 0.7s ease-in-out,
    filter 0.7s ease-in-out;
}
.header {
  white-space: nowrap;
  overflow: hidden;
  border-bottom: 5px solid greenyellow;
  animation: animate 2s linear forwards;
}
h1.header {
  color: green;
}
@keyframes animate {
  0% {
    width: 0px;
  }
  100% {
    width: 100%;
  }
}
</style>

