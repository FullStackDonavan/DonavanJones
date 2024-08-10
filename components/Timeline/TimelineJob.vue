<template>
  <div
    class="flex flex-row-reverse md:contents"
    v-if="flexDirection === 'reverse'"
  >
    <TimelineCard
      columnStart="true"
      :cardTitle="jobTitle"
      :cardDescription="jobDescription"
      :cardImage="jobImage"
    />
    <TimelineIntersection />
  </div>
  <div class="flex md:contents" v-else-if="flexDirection === 'forward'">
    <TimelineIntersection />
    <TimelineCard
      :cardTitle="jobTitle"
      :cardDescription="jobDescription"
      :cardImage="jobImage"
    />
  </div>
</template>

<script>
export default {
  props: {
    flexDirection: String,
    jobTitle: String,
    jobImage: String,
    jobDescription: String,
  },
};
</script>