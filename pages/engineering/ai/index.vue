<template>
  <PatternSection>
    <div class="mx-auto max-w-5xl px-6 py-12">
      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          AI Engineering
        </h1>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Practical guidance for building reliable AI systems, from retrieval pipelines and agent orchestration to memory management and hallucination reduction.
        </p>
      </div>

      <!-- Section 1 -->
      <section class="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
          What this page covers
        </h2>
        <ul class="mt-4 list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
          <li>Foundations of production-ready AI engineering workflows.</li>
          <li>Design patterns for agent orchestration, tooling, and state management.</li>
          <li>How to take AI research ideas into real-world implementation.</li>
        </ul>
      </section>

      <!-- Section 2 -->
      <section class="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Blog ideas and reference content
        </h2>
        <p class="mt-3 text-gray-600 dark:text-gray-300">
          The AI Engineering category holds in-progress ideas and published notes for building safe, scalable, and maintainable AI systems.
        </p>

        <ul class="mt-4 list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
          <li>Persistent memory systems</li>
          <li>Vector database architectures</li>
          <li>Retrieval-augmented generation</li>
          <li>Tool-based reasoning and agent orchestration</li>
          <li>Prompt engineering, grounding, and hallucination reduction</li>
        </ul>
      </section>

      <!-- Section 3 -->
      <section class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Next steps
        </h2>
        <p class="mt-3 text-gray-600 dark:text-gray-300">
          Keep developing AI engineering concepts into full posts, implementation guides, and example architectures.
        </p>
      </section>
    </div>
  </PatternSection>
</template>

<script>
export default {
  name: 'EngineeringAiPage',
};
</script>