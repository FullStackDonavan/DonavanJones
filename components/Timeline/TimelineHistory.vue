<template>
  <section class="container mx-auto px-8 pb-8">
    <HeadlineTwo class="text-center mt-8">Where I've Worked</HeadlineTwo>
    <div class="flex items-center justify-center">
      <div class="flex flex-col md:grid grid-cols-9 mx-auto p-2">
        <TimelineJob
          flexDirection="reverse"
          companyName="Amerus Financial"
          jobDate="December 2021 to June 2023"
          jobTitle="Software Engineer"
          jobImage="/img/Amerus-Logo.png"
          jobDescription="Developed an intuitive insurance agent reporting app with seamless data management. Created visually appealing websites for clients' unique needs. Implemented Go High Level for effective marketing funnels, enhancing conversions. Prioritized performance and UX, consistently exceeding expectations. Stayed updated on web trends, integrating innovation for better outcomes. Collaborated across teams, communicating complex ideas effectively. Showcased strong problem-solving, swiftly resolving challenges. Contributed to a dynamic work environment with a passion for outstanding digital experiences."
        />

        <TimelineJob
          flexDirection="forward"
          companyName="Florida Water Analysis"
          jobDate="September 2018 to March 2020"
          jobTitle="Web Developer"
          jobImage="/img/FWA.png"
          jobDescription="I played a key role in managing all aspects of their marketing initiatives. This included designing and developing their website, creating engaging content such as articles, and designing captivating graphics. Additionally, I took charge of producing their print materials. Furthermore, I handled the setup and maintenance of their PPC campaigns. Moreover, I developed both their website and their online water test app to enhance their online presence and user experience."
        />

        <TimelineJob
          flexDirection="reverse"
          companyName="Footbridge Media"
          jobDate="May 2013 to May 2018"
          jobTitle="Junior Web Developer"
          jobImage="/img/fbm.png"
          jobDescription="Work with senior designers to manage large, complex design projects for small businesses to large corporations. Joined development meetings to learn about the development of projects and scopes. Oversaw the in-house WordPress theme framework for client projects and coordinated with the Layout department to incorporate Front End Updates."
        />
      </div>
    </div>
  </section>
</template>