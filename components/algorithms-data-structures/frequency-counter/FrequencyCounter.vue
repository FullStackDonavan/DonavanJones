<template>
  <div class="frequency-counter p-4 border rounded max-w-md mx-auto">
    <h2 class="text-xl font-semibold mb-4">Frequency Counter - Anagram Checker</h2>

    <form @submit.prevent="checkAnagram" class="space-y-4">
      <div>
        <label for="stringA" class="block mb-1 font-medium">String A:</label>
        <input
          v-model="stringA"
          id="stringA"
          type="text"
          placeholder="Enter first string"
          class="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label for="stringB" class="block mb-1 font-medium">String B:</label>
        <input
          v-model="stringB"
          id="stringB"
          type="text"
          placeholder="Enter second string"
          class="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Check Anagram
      </button>
    </form>

    <div v-if="result !== null" class="mt-6 p-4 border rounded dark:text-gray-100">
      <p>
        <strong>Are the two strings anagrams? </strong>
        <span :class="result ? 'text-green-600' : 'text-red-600'">
          {{ result ? 'Yes' : 'No' }}
        </span>
      </p>

      <div class="mt-4 flex gap-8">
        <div>
          <h3 class="font-semibold mb-1">Frequency Count A:</h3>
          <pre class="bg-white dark:bg-gray-600 p-2 rounded max-h-48 overflow-auto">{{ frequencyA }}</pre>
        </div>
        <div>
          <h3 class="font-semibold mb-1">Frequency Count B:</h3>
          <pre class="bg-white dark:bg-gray-600 p-2 rounded max-h-48 overflow-auto">{{ frequencyB }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const stringA = ref('')
const stringB = ref('')
const frequencyA = ref<Record<string, number>>({})
const frequencyB = ref<Record<string, number>>({})
const result = ref<boolean | null>(null)

function buildFrequency(str: string) {
  const freq: Record<string, number> = {}
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1
  }
  return freq
}

function checkAnagram() {
  if (stringA.value.length !== stringB.value.length) {
    frequencyA.value = buildFrequency(stringA.value)
    frequencyB.value = buildFrequency(stringB.value)
    result.value = false
    return
  }

  frequencyA.value = buildFrequency(stringA.value)
  frequencyB.value = buildFrequency(stringB.value)

  // Compare frequencies
  for (const key in frequencyA.value) {
    if (frequencyA.value[key] !== frequencyB.value[key]) {
      result.value = false
      return
    }
  }
  result.value = true
}
</script>

<style scoped>
.frequency-counter {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
