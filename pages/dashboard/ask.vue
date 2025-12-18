<script setup lang="ts">
import QuestionForm from "~/components/elements/QuestionForm.vue";
import DashboardSidebar from "~~/components/elements/DashboardSidebar.vue";

definePageMeta({
  middleware: "auth",
});

const data: IQuestionPost = reactive({
  title: "",
  description: "",
});

const endpoint = "/api/dashboard/ask";
</script>
 
 <template>
  <PatternSection>
    <div class="h-32 flex justify-center">
      <div class="flex m-5">
        <!-- <img
          class="mx-auto h-24 w-auto"
          src="/img/logo_clear_fsj.png"
          alt="full stack jack logo"
        /> -->
        <h1
          class="py-9 text-center text-5xl font-extrabold text-gray-900 dark:text-gray-400 ml-4"
        >
          Ask A Question
        </h1>
      </div>
    </div>
    <div class="md:flex">
      <DashboardSidebar />
      <div v-if="true" class="w-full">
        <QuestionForm :data="data" :endpoint="endpoint" />
      </div>
    </div>
  </PatternSection>
</template>
 