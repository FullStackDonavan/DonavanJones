<template>
  <PatternSection>
    <BackendHero />
    <Breadcrumbs
      parentTitle="Systems"
      parentUrl="/system-overview"
      currentPageTitle="Backend"
    />

    <div class="mx-auto max-w-6xl px-6 py-14">

      <!-- HEADER -->
      <div class="mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full
                    bg-blue-500/10 text-blue-400 text-sm">
          <Icon name="mdi:server" />
          Backend Systems Engineering
        </div>

        <h1 class="mt-4 text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Building Scalable Backend Systems
        </h1>

        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
          Practical backend architecture for APIs, distributed services, async systems, databases,
          and production-grade infrastructure design.
        </p>
      </div>

      <!-- SECTION 1 (2 COLS) -->
      <section class="mb-12 grid md:grid-cols-2 gap-8 items-center
                      rounded-2xl border border-gray-200 dark:border-gray-800
                      bg-white dark:bg-gray-900 p-6">

        <!-- TEXT -->
        <div>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
            Core Backend Principles
          </h2>

          <ul class="mt-4 space-y-3 text-gray-700 dark:text-gray-300 list-disc pl-5">
            <li>Design stateless APIs wherever possible</li>
            <li>Separate compute, storage, and messaging layers</li>
            <li>Prefer async processing for heavy workloads</li>
            <li>Make systems observable and failure-tolerant</li>
          </ul>
        </div>

        <!-- IMAGE -->
        <img
          src="https://placehold.co/600x400/png?text=Backend+Architecture"
          class="rounded-xl border border-gray-200 dark:border-gray-800"
        />
      </section>

      <!-- SECTION 2 GRID CARDS -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Backend Architecture Areas
        </h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

          <!-- APIs -->
          <div class="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <img src="https://placehold.co/400x200/png?text=APIs" />
            <div class="p-4">
              <div class="flex items-center gap-2 text-blue-400 font-semibold">
                <Icon name="mdi:api" />
                APIs
              </div>
              <p class="text-sm mt-2 text-gray-600 dark:text-gray-400">
                REST, GraphQL, authentication, and service contracts.
              </p>
            </div>
          </div>

          <!-- Services -->
          <div class="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <img src="https://placehold.co/400x200/png?text=Services" />
            <div class="p-4">
              <div class="flex items-center gap-2 text-purple-400 font-semibold">
                <Icon name="mdi:cog" />
                Services
              </div>
              <p class="text-sm mt-2 text-gray-600 dark:text-gray-400">
                Microservices, modular monoliths, domain-driven design.
              </p>
            </div>
          </div>

          <!-- Databases -->
          <div class="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <img src="https://placehold.co/400x200/png?text=Databases" />
            <div class="p-4">
              <div class="flex items-center gap-2 text-emerald-400 font-semibold">
                <Icon name="mdi:database" />
                Databases
              </div>
              <p class="text-sm mt-2 text-gray-600 dark:text-gray-400">
                PostgreSQL, Redis, indexing, replication strategies.
              </p>
            </div>
          </div>

          <!-- Async -->
          <div class="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <img src="https://placehold.co/400x200/png?text=Async+Systems" />
            <div class="p-4">
              <div class="flex items-center gap-2 text-amber-400 font-semibold">
                <Icon name="mdi:swap-horizontal" />
                Async Systems
              </div>
              <p class="text-sm mt-2 text-gray-600 dark:text-gray-400">
                Queues, workers, event-driven architecture, streaming.
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
            Common Backend Failure Modes
          </h2>

          <ul class="mt-4 space-y-3 text-gray-700 dark:text-gray-300 list-disc pl-5">
            <li>N+1 query problems and DB overload</li>
            <li>Race conditions in distributed services</li>
            <li>Queue backlog and worker starvation</li>
            <li>Uncached hot endpoints causing latency spikes</li>
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
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">FastAPI</span>
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">Node.js</span>
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">PostgreSQL</span>
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">Redis</span>
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">Kafka / Queues</span>
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">Docker</span>
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">Kubernetes</span>
          <span class="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">Observability</span>
        </div>
      </section>

      <!-- FOOTER -->
      <div class="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
        Backend systems are about reliability, scale, and predictable failure handling.
      </div>

    </div>
  </PatternSection>
</template>

<script>
export default {
  name: "EngineeringBackendPage",
};
</script>