<script setup lang="ts">
// import QuestionBoard from "~/components/elements/QuestionBoard.vue";
import DashboardSidebar from "~~/components/elements/DashboardSidebar.vue";
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
          Website Build
        </h1>
      </div>
    </div>
    <div class="md:flex min-h-full">
      <DashboardSidebar />
      <div class="w-full z-1 flex justify-right relative"><GptChat /></div>
    </div>
  </PatternSection>
</template>