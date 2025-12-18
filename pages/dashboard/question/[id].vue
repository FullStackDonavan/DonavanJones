<script setup lang="ts">
import DashboardSidebar from "~~/components/elements/DashboardSidebar.vue";
import AnswerForm from "~/components/elements/AnswerForm.vue";
import QuestionForm from "~~/components/elements/QuestionForm.vue";
import Tiptap from "~~/components/elements/Tiptap.vue";

const questionId = getParam("id");
const me = await useUser();
const router = useRouter();
const route = useRoute();
const showEditForm = ref(false);
const showDeleted = ref(false);
const showAnswerButton = ref(false);
let isAdmin: boolean = true;

const isLoggedIn = await useLoggedIn();

const { data: question } = await useFetch<IQuestion>(
  `/api/dashboard/question?id=${questionId}`,
  { key: route.fullPath }
);

const showAnswerForm = useState("showAnswerForm" + questionId, () => false);

const isMine = question?.value?.authorId == me?.id;

if (me?.id === 1) {
  isAdmin = true;
} else {
  isAdmin = false;
}

async function deleteQuestion() {
  const { data: deleted } = await useFetch("/api/dashboard/delete-question", {
    method: "POST",
    body: { questionId },
  });

  showDeleted.value = true;
  setTimeout(() => {
    router.push("/dashboard/search");
  });
}

const editEndpoint = "/api/dashboard/edit-question";

function addAnswer(answer: IAnswer) {
  console.log("&&&&&&&&& add answer");
  question.value?.answers.push(answer);
  showAnswerForm.value = false;
}
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
          Questions
        </h1>
      </div>
    </div>
    <div class="md:flex min-h-full">
      <DashboardSidebar />
      <div class="w-full z-1 justify-right relative">
        <div
          class="p-8 text-white bg-lime-600 dark:bg-black rounded shadow-md"
          v-if="showDeleted"
        >
          question deleted
        </div>
        <div
          v-if="question"
          class="flex w-full flex-column justify-center transition duration-500"
        >
          <div class="w-full p-4">
            <div class="p-8 bg-white dark:bg-gray-800 rounded shadow-md">
              <div class="flex justify-end dark:text-gray-300">
                {{ question.authName }}
              </div>

              <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-300">
                {{ question.title }}
              </h2>
              <!-- <p class="dark:text-gray-300">{{ question.description }}</p> -->

              <Tiptap
                v-if="!showEditForm"
                v-model="question.description"
                label=""
                :editable="false"
              />

              <div class="mt-5" v-if="isMine && showEditForm == false">
                <button
                  @click="showEditForm = true"
                  class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit
                </button>
                <button
                  @click="deleteQuestion"
                  class="bg-red-500 ml-3 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                >
                  delete
                </button>
              </div>

              <QuestionForm
                :endpoint="editEndpoint"
                :data="question"
                v-if="showEditForm"
              />
            </div>
          </div>
        </div>
        <div
          v-for="answer in question?.answers"
          :key="answer.id"
          class="flex flex-column justify-center transition duration-500"
        >
          <div class="max-w-xxl w-full p-4">
            <div class="p-8 bg-white dark:bg-slate-900 rounded shadow-md">
              <div class="flex justify-end dark:text-gray-300">
                {{ answer.authorName }}
              </div>
              <p class="dark:text-gray-300">{{ answer.text }}</p>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            v-if="!showAnswerForm && isLoggedIn && isAdmin"
            @click="showAnswerForm = !showAnswerForm"
            type="button"
            class="dark:focus:ring-amber-800 bg-blue-400 hover:bg-blue-800 dark:bg-amber-500 dark:hover:bg-amber-600 font-medium text-sm rounded-lg px-5 py-2.5 mr-2 mb-2"
          >
            Answer
          </button>
        </div>
        <div v-if="showAnswerForm">
          <AnswerForm :questionId="questionId" @addAnswer="addAnswer" />
        </div>
      </div>
    </div>
  </PatternSection>
</template>