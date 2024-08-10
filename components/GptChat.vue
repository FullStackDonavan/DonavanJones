<template>
  <div class="w-full p-4 mx-auto my-8">
    <div class="bg-gray-300 dark:bg-gray-600 p-8 my-8">
      <div v-for="message in messages" :key="message.id" class="mb-4">
        <div v-if="message.sender === 'user'" class="text-right">
          <span class="bg-blue-500 text-white p-2 rounded-lg">{{
            message.text
          }}</span>
        </div>
        <div v-else>
          <span class="bg-gray-300 text-white p-2 rounded-lg">{{
            message.text
          }}</span>
        </div>
      </div>
    </div>
    <div class="flex">
      <input
        v-model="newMessage"
        @keydown.enter.prevent="sendMessage"
        type="text"
        class="flex-1 p-2 bg-gray-300 dark:bg-gray-600"
        placeholder="Type your response..."
      />
      <button
        @click="sendMessage"
        class="ml-2 p-2 bg-blue-500 text-white rounded"
      >
        Send
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [
        { id: 1, text: "Hello!", sender: "user" },
        { id: 2, text: "Hi there!", sender: "system" },
      ],
      newMessage: "",
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() === "") return;

      this.messages.push({
        id: this.messages.length + 1,
        text: this.newMessage,
        sender: "user",
      });

      this.newMessage = "";
    },
  },
};
</script>

<style scoped>
/* Add any additional styling here */
</style>