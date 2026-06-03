<script setup lang="ts">
interface FAQItem {
  question: string
  answer: string
}

const props = defineProps<{
  title?: string
  faqs: FAQItem[]
}>()

const openItems = ref<number[]>([])

const toggleItem = (index: number) => {
  if (openItems.value.includes(index)) {
    openItems.value = openItems.value.filter(i => i !== index)
  } else {
    openItems.value.push(index)
  }
}

/**
 * JSON-LD structured data (SEO)
 */
const jsonLd = computed(() => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: props.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
}))

useHead(() => ({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify(jsonLd.value)
    }
  ]
}))
</script>

<template>
  <section class="max-w-4xl mx-auto py-12">
    <div class="text-center mb-10">
      <h2 class="text-3xl font-bold">
        {{ title || 'Frequently Asked Questions' }}
      </h2>
    </div>

    <div class="space-y-4">
      <div
        v-for="(faq, index) in faqs"
        :key="index"
        class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm"
      >
        <button
          class="w-full flex items-center justify-between p-5 text-left font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          @click="toggleItem(index)"
        >
          <span>{{ faq.question }}</span>

          <svg
            class="w-5 h-5 transition-transform duration-300"
            :class="{ 'rotate-180': openItems.includes(index) }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="max-h-0 opacity-0"
          enter-to-class="max-h-96 opacity-100"
          leave-from-class="max-h-96 opacity-100"
          leave-to-class="max-h-0 opacity-0"
        >
          <div v-show="openItems.includes(index)" class="overflow-hidden">
            <div class="p-5 pt-0 text-gray-600 dark:text-gray-300">
              {{ faq.answer }}
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>