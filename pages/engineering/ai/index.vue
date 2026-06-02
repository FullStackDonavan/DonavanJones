<template>
  <PatternSection>
    <AiHero />
    <Breadcrumbs
      parentTitle="Systems"
      parentUrl="/system-overview"
      currentPageTitle="AI"
    />
    <div class="mx-auto max-w-6xl px-6 py-14">

      <!-- HEADER -->
      <div class="mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full
                    bg-purple-500/10 text-purple-400 text-sm">
          <Icon name="mdi:brain" />
          AI Systems Engineering
        </div>

        <h1 class="mt-4 text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Building Production AI Systems
        </h1>

        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
          Practical patterns for designing scalable AI systems: RAG pipelines, agents, memory systems,
          evaluation, and real-world deployment architecture.
        </p>
      </div>

      <!-- SECTION 1 (2 COLS) -->
      <section class="mb-12 grid md:grid-cols-2 gap-8 items-center
                      rounded-2xl border border-gray-200 dark:border-gray-800
                      bg-white dark:bg-gray-900 p-6">

        <!-- TEXT -->
        <div>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
            Core Principles
          </h2>

          <ul class="mt-4 space-y-3 text-gray-700 dark:text-gray-300 list-disc pl-5">
            <li>Separate retrieval, reasoning, and generation layers</li>
            <li>Design for observability and evaluation first</li>
            <li>LLM outputs are intermediate, not final truth</li>
            <li>Prefer composable systems over monolithic prompts</li>
          </ul>
        </div>

        <!-- IMAGE -->
        <img
          src="https://placehold.co/600x400/png?text=AI+System+Architecture"
          class="rounded-xl border border-gray-200 dark:border-gray-800"
        />
      </section>

      <!-- SECTION 2 GRID CARDS -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          System Architecture Areas
        </h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

          <!-- CARD -->
          <div class="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <img src="https://placehold.co/400x200/png?text=Retrieval" />
            <div class="p-4">
              <div class="flex items-center gap-2 text-purple-400 font-semibold">
                <Icon name="mdi:database-search" />
                Retrieval
              </div>
              <p class="text-sm mt-2 text-gray-600 dark:text-gray-400">
                Vector search, embeddings, hybrid retrieval systems.
              </p>
            </div>
          </div>

          <div class="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <img src="https://placehold.co/400x200/png?text=Agents" />
            <div class="p-4">
              <div class="flex items-center gap-2 text-blue-400 font-semibold">
                <Icon name="mdi:robot" />
                Agents
              </div>
              <p class="text-sm mt-2 text-gray-600 dark:text-gray-400">
                Tool calling, planning loops, multi-agent workflows.
              </p>
            </div>
          </div>

          <div class="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <img src="https://placehold.co/400x200/png?text=Memory" />
            <div class="p-4">
              <div class="flex items-center gap-2 text-emerald-400 font-semibold">
                <Icon name="mdi:brain" />
                Memory
              </div>
              <p class="text-sm mt-2 text-gray-600 dark:text-gray-400">
                Long-term memory, summarization, context management.
              </p>
            </div>
          </div>

          <div class="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <img src="https://placehold.co/400x200/png?text=Evaluation" />
            <div class="p-4">
              <div class="flex items-center gap-2 text-amber-400 font-semibold">
                <Icon name="mdi:chart-box" />
                Evaluation
              </div>
              <p class="text-sm mt-2 text-gray-600 dark:text-gray-400">
                Metrics, tracing, hallucination detection, observability.
              </p>
            </div>
          </div>

        </div>
      </section>

      <!-- SECTION 3 (2 COLS) -->
      <section class="mb-12 grid md:grid-cols-2 gap-8 items-center
                      rounded-2xl border border-gray-200 dark:border-gray-800
                      bg-white dark:bg-gray-900 p-6">

        <!-- IMAGE -->
        <img
          src="https://placehold.co/600x400/png?text=Failure+Modes"
          class="rounded-xl border border-gray-200 dark:border-gray-800"
        />

        <!-- TEXT -->
        <div>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
            Common Failure Modes
          </h2>

          <ul class="mt-4 space-y-3 text-gray-700 dark:text-gray-300 list-disc pl-5">
            <li>Hallucinations due to weak retrieval grounding</li>
            <li>Agent loops without termination logic</li>
            <li>Context window overflow / memory drift</li>
            <li>Unstable tool execution ordering</li>
          </ul>
        </div>
      </section>

      <!-- STACK -->
      <section class="rounded-2xl border border-gray-200 dark:border-gray-800
                      bg-white dark:bg-gray-900 p-6">

        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Implementation Stack
        </h2>

        <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">RAG Pipelines</span>
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">Vector DBs</span>
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">FastAPI</span>
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">Redis</span>
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">PostgreSQL</span>
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">LLMs</span>
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">Agents</span>
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">Observability</span>
        </div>
      </section>

      <!-- FOOTER -->
      <div class="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        AI Engineering = Systems thinking + reliability + composability.
      </div>

      <ClusterArticles cluster="ai-engineering" />

    </div>
  </PatternSection>
</template>

<script>
export default {
  name: "EngineeringAiPage",
};
</script>