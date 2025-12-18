<script setup lang="ts">
import {
  getGHLPipelines,
  getGHLOpportunities,
} from "~/server/database/repositories/crmServices";

const pipelines = await getGHLPipelines();
console.log(pipelines.pipelines[1].stages[0].id);
const newClientOpportunities = await getGHLOpportunities(
  pipelines.pipelines[1].id,
  pipelines.pipelines[1].stages[0].id
);

const newFrequentlyAskedQuestionsOpportunities = await getGHLOpportunities(
  pipelines.pipelines[0].id,
  pipelines.pipelines[0].stages[0].id
);
</script>
<template>
  <div class="p-2 m-2">
    <h3 class="text-3xl">{{ pipelines.pipelines[1].name }}</h3>
    <p class="text-2xl">{{ newClientOpportunities.meta.total }}</p>
    <p>{{ newClientOpportunities.opportunities[0].contact.name }}</p>
    <p>{{ newClientOpportunities.opportunities[0].contact.phone }}</p>
    <p>{{ newClientOpportunities.opportunities[0].contact.email }}</p>
    <p>{{ newClientOpportunities.opportunities[0].status }}</p>
    <p>{{ newClientOpportunities.opportunities[0].contact.tags[0] }}</p>
  </div>
  <div class="p-2 m-2">
    <h3 class="text-3xl">{{ pipelines.pipelines[0].name }}</h3>
    <p class="text-2xl">
      {{ newFrequentlyAskedQuestionsOpportunities.meta.total }}
    </p>
    <p>
      {{
        newFrequentlyAskedQuestionsOpportunities.opportunities[0].contact.name
      }}
    </p>
    <p>
      {{
        newFrequentlyAskedQuestionsOpportunities.opportunities[0].contact.phone
      }}
    </p>
    <p>
      {{
        newFrequentlyAskedQuestionsOpportunities.opportunities[0].contact.email
      }}
    </p>
    <p>
      {{ newFrequentlyAskedQuestionsOpportunities.opportunities[0].status }}
    </p>
    <p>
      {{
        newFrequentlyAskedQuestionsOpportunities.opportunities[0].contact
          .tags[0]
      }}
    </p>
  </div>
</template>