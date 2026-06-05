<template>
  <PatternSection>

    <!-- PAGE WRAPPER -->
    <div class="min-h-screen">

      <!-- BACK BUTTON -->
      <div class="mx-auto px-4 pt-10">
        <nuxt-link
          class="text-slate-400 hover:text-white flex items-center gap-2"
          :to="backLink"
        >
          ← Back
        </nuxt-link>
      </div>

      <ContentDoc v-slot="{ doc }">

        <!-- HERO (FULL WIDTH) -->
        <ArticleHero
          :title="doc.title"
          :description="doc.description"
          :highlight="doc.highlight || ''"
          :badge="doc.category"
          :badge-icon="'mdi:bible'"

          :frontend="doc.frontend || []"
          :backend="doc.backend || []"
          :cloud="doc.cloud || []"
          :ai="doc.ai || []"

          :project-scope="doc.projectScope || []"

          :overview-description="doc.overviewDescription || ''"
          :overview-steps="doc.overviewSteps || []"
          :overview-summary="doc.overviewSummary || ''"
        >

          
            <!-- optional extra content inside hero -->
            <template #default>
              
              <div class="text-sm text-slate-500">
                by {{ doc.author }}, {{ doc.date }}
              </div>


               <!-- Category, Tags, and Project Info section -->
            <div
              class="text-gray-500 dark:text-gray-400 mt-2 flex flex-wrap items-center"
            >
              <span v-if="doc.category" class="mr-4">
                <strong>Category: </strong>
                <NuxtLink
                  :to="{
                    path: `/categories/${doc.category}`,
                    query: { from: route.fullPath },
                  }"
                  class="text-blue-500 hover:underline"
                >
                  {{ doc.category }}
                </NuxtLink>
              </span>

              <span v-if="doc.tags && doc.tags.length" class="mr-4">
                <strong>Tags: </strong>
                <ul class="inline-flex gap-x-2">
                  <li v-for="(tag, index) in doc.tags" :key="index">
                    <NuxtLink
                      :to="{
                        path: `/tags/${tag}`,
                        query: { from: route.fullPath },
                      }"
                      class="text-blue-500 hover:underline"
                    >
                      {{ tag }}
                    </NuxtLink>
                  </li>
                </ul>
              </span>

              <span v-if="doc.projectType" class="mr-4">
                <strong>Project Type:</strong>
                  <span v-if="doc.projectType">
                    {{ doc.projectType }}
                  </span> 
                <span v-if="doc.projectType === 'freelance'"> Freelance </span>
                <span v-if="doc.projectType === 'employment'">
                  <a
                    :href="doc.employmentLink"
                    class="text-blue-500 hover:underline ml-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Employment</a
                  >
                </span>
              </span>
            </div>



              <div class="mt-4 flex gap-3 flex-wrap">
                <a
                  v-if="doc.github"
                  :href="doc.github"
                  target="_blank"
                  class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  GitHub
                </a>

                <a
                  v-if="doc.liveSite"
                  :href="doc.liveSite"
                  target="_blank"
                  class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  Live Site
                </a>

                
              </div>
            </template>

            <!-- RIGHT SIDE CARDS -->
            <template #right>
              <div class="hero-stat">
                <Icon name="mdi:book-open-page-variant" class="text-sky-400 text-4xl" />
                <div class="mt-2 text-xl font-bold">Bible</div>
                <div class="text-xs text-slate-400">Core Engine</div>
              </div>

              <div class="hero-stat">
                <Icon name="mdi:brain" class="text-purple-400 text-4xl" />
                <div class="mt-2 text-xl font-bold">AI</div>
                <div class="text-xs text-slate-400">Bible Logic</div>
              </div>

              <div class="hero-stat">
                <Icon name="mdi:video" class="text-emerald-400 text-4xl" />
                <div class="mt-2 text-xl font-bold">Live</div>
                <div class="text-xs text-slate-400">Streaming</div>
              </div>

              <div class="hero-stat">
                <Icon name="mdi:account-group" class="text-amber-400 text-4xl" />
                <div class="mt-2 text-xl font-bold">Social</div>
                <div class="text-xs text-slate-400">Community</div>
              </div>

              
            </template>
          </ArticleHero>

        <!-- CONTENT WRAPPER (THIS IS THE FIX) -->
        <div class="max-w-7xl mx-auto px-4 py-12">

     

          <!-- CONTENT -->
          <ContentRenderer
            class="prose lg:prose-xl dark:prose-invert max-w-none"
            :value="doc"
          />

        </div>

      </ContentDoc>

    </div>

  </PatternSection>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "#app";

const route = useRoute();
const backLink = ref("/projects/overview");
const doc = ref<any>({});

// Set the back link based on the query parameter
onMounted(() => {
  if (route.query.from) {
    backLink.value = route.query.from as string;
  }
  // Load the doc data
  // Assume you load doc data here
});

const liveSiteHostname = computed(() => {
  if (doc.value.liveSite) {
    try {
      return new URL(doc.value.liveSite).hostname;
    } catch (e) {
      console.error("Invalid live site URL:", e);
      return "";
    }
  }
  return "";
});
</script>

<style scoped>
/* Optional: Add additional custom styles here */
</style>
