<script setup lang="ts">
import QuestionBoard from "~/components/elements/QuestionBoard.vue";
import DashboardSidebar from "~~/components/elements/DashboardSidebar.vue";
// import PipelineHeader from "~~/components/dashboard/PipelineHeader.vue";
import Tiptap from "~~/components/elements/Tiptap.vue";
</script>
 
 <template>
  <PatternSection>
    <div class="h-32 flex justify-center">
      <div class="flex m-5">
        <!-- <img
          class="mx-auto h-24 w-auto"
          src="/img/logo.png"
          alt="full stack jack logo"
        /> -->
        <h1
          class="py-9 text-center text-5xl font-extrabold text-gray-900 dark:text-gray-400 ml-4"
        >
          Dashboard
        </h1>
      </div>
    </div>
    <div class="md:flex min-h-full">
      <DashboardSidebar />
      <div class="md:w-1/3 z-1 flex justify-right relative">
        <!-- <PipelineHeader /> -->
      </div>
    </div>
  </PatternSection>
</template>