<template>
  <div
    class="flex flex-row-reverse md:contents"
    v-if="flexDirection === 'reverse'"
  >
    <TimelineCard
      columnStart="true"
      :cardCompany="jobTitle"
      :cardDate="jobDate"
      :cardTitle="companyName"
      :cardDescription="jobDescription"
      :cardImage="jobImage"
    />
    <TimelineIntersection />
  </div>
  <div class="flex md:contents" v-else-if="flexDirection === 'forward'">
    <TimelineIntersection />
    <TimelineCard
      :cardCompany="jobTitle"
      :cardDate="jobDate"
      :cardTitle="companyName"
      :cardDescription="jobDescription"
      :cardImage="jobImage"
    />
  </div>
</template>

<script>
export default {
  props: {
    flexDirection: String,
    companyName: String,
    jobTitle: String,
    jobDate: String,
    jobImage: String,
    jobDescription: String,
  },
};
</script>