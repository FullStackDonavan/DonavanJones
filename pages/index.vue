<template>
  <div>
    <HeroSection />
      



      <TwoColumnSection>
            <ColumnAnimated animationClass="fade-in">
                <H2Heading>Fluent User Experience Designer</H2Heading>
                <SubHeading>Passionate Front-end Developer and Designer Committed to Crafting Fluid User Experiences with a Fashion-Forward Aesthetic</SubHeading>
                <Description>I'm probably not the typical designer positioned behind an Illustrator artboard adjusting pixels, but I design. Immersed in stylesheets tweaking font sizes and contemplating layouts is where you'll find me (~_^). I'm committed to creating fluent user experiences while staying fashionable.</Description>
            </ColumnAnimated>
        
            <ColumnAnimated>
              <img src="~/assets/images/contractor-marketing-program.jpg" />
            </ColumnAnimated>
          
      </TwoColumnSection>


      <TwoColumnSection>
          <ColumnStatic>
              <img src="~/assets/images/contractor-marketing-program.jpg" />
          </ColumnStatic>
          <ColumnStatic>
              <H2Heading>Expert JavaScript Developer</H2Heading>
              <SubHeading>Expert JavaScript Developer with a Focus on Performance and Scalability, Equipped with the Latest Tools and Capable of Delivering Robust Solutions</SubHeading>
              <Description>In building JavaScript applications, I'm equipped with just the right tools, and can absolutely function independently of them to deliver fast, resilient solutions optimized for scale — performance and scalabilty are priorities on my radar.</Description>
          </ColumnStatic>
      </TwoColumnSection>

      








      <section class="container mx-auto px-8 pb-8">
        <h2 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl text-center">Where I’ve Worked</h2>
        <div class="flex items-center justify-center">
          <div class="flex flex-col md:grid grid-cols-9 mx-auto p-2">
            <div class="flex flex-row-reverse md:contents">
              <div class="w-full col-start-1 col-end-5 p-4 rounded-xl my-4 ml-auto border border-gray-300">
                <h3 class="font-semibold text-xl mb-1 text-gray-900">Title 1</h3>
                <p class="text-gray-600">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugit blanditiis, dolore repellat dignissimos non sint architecto vel provident temporibus dolor cupiditate voluptatum ut doloribus nemo ipsa corporis ad. Earum, labore.</p>
              </div>

              <div class="col-start-5 col-end-6 md:mx-auto relative mr-10">
                <div class="h-full w-6 flex items-center justify-center">
                  <div class="h-full w-0.5 bg-gray-200 pointer-events-none"></div>
                </div>

                <div class="w-6 h-6 absolute top-1/2 -mt-3 border-2 border-blue-500 rounded-full bg-gray-100 shadow"></div>
              </div>
            </div>

            <div class="flex md:contents">
              <div class="col-start-5 col-end-6 mr-10 md:mx-auto relative">
                <div class="h-full w-6 flex items-center justify-center">
                  <div class="h-full w-0.5 bg-gray-200 pointer-events-none"></div>
                </div>

                <div class="w-6 h-6 absolute top-1/2 -mt-3 border-2 border-blue-500 rounded-full bg-gray-100 shadow"></div>
              </div>

              <div class="w-full col-start-6 col-end-10 my-4 mr-auto p-4 border border-gray-300 rounded-xl">
                <h3 class="font-semibold text-xl mb-1 text-gray-900">Title 2</h3>
                <p class="text-gray-600">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore nesciunt maiores ipsa molestiae magnam libero dolorem explicabo. Nobis veniam incidunt at, alias ipsam est suscipit maxime sunt quia. Consectetur, aut.</p>
              </div>
            </div>

            <div class="flex flex-row-reverse md:contents">
              <div class="w-full col-start-1 col-end-5 p-4 rounded-xl my-4 ml-auto border border-gray-300">
                <h3 class="font-semibold text-xl mb-1 text-gray-900">Title 3</h3>
                <p class="text-gray-600">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nesciunt ratione perspiciatis consectetur? Impedit inventore perferendis eligendi voluptatum facilis, consequatur provident facere ab quasi laudantium magni culpa porro tempora accusantium autem?</p>
              </div>

              <div class="col-start-5 col-end-6 md:mx-auto relative mr-10">
                <div class="h-full w-6 flex items-center justify-center">
                  <div class="h-full w-0.5 bg-gray-200 pointer-events-none"></div>
                </div>

                <div class="w-6 h-6 absolute top-1/2 -mt-3 border-2 border-blue-500 rounded-full bg-gray-100 shadow"></div>
              </div>
            </div>

            <div class="flex md:contents">
              <div class="col-start-5 col-end-6 mr-10 md:mx-auto relative">
                <div class="h-full w-6 flex items-center justify-center">
                  <div class="h-full w-0.5 bg-gray-200 pointer-events-none"></div>
                </div>

                <div class="w-6 h-6 absolute top-1/2 -mt-3 border-2 border-blue-500 rounded-full bg-gray-100 shadow"></div>
              </div>

              <div class="w-full col-start-6 col-end-10 my-4 mr-auto p-4 border border-gray-300 rounded-xl">
                <h3 class="font-semibold text-xl mb-1 text-gray-900">Title 4</h3>
                <p class="text-gray-600">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, dolores minima mollitia quidem omnis doloremque magni vitae, sint impedit alias corrupti commodi nesciunt consequatur eveniet nisi amet architecto expedita rerum.</p>
              </div>
            </div>
          </div>
        </div>
      </section>













      <section class="container mx-auto">
        <h2 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl text-center">
          Some Things I've Built
        </h2>
      </section>


      <CardDeckThreeColumns>
        <LaunchCard
          title="Epoxy Floor Solutions" 
          image=""
          description="Acquire New Clients, Lower Expenses and Increase Profits!"
          url=""
        />
        <LaunchCard
          title="Innovative Garage Flooring" 
          image=""
          description="Contractor SEO and Your Online Marketing Plan"
          url=""
        />
        <LaunchCard
          title="Lowcountry Powerwashing" 
          image=""
          description="Satisifying Your Customers' Needs For Social Trust"
          url=""
        />
      </CardDeckThreeColumns>







  </div>
</template>

<script setup>
const route = useRoute();
useHead({
  title: "Home Page | Company",
});
</script>