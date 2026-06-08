<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const _seoConfig = useRuntimeConfig()
const _SITE = (_seoConfig.public.appDomain as string) || 'https://donavanjones.com'
useSeoMeta({
  title: 'Projects — Donavan Jones',
  description: 'A collection of full-stack projects spanning AI systems, Kubernetes infrastructure, SaaS platforms, and web applications — designed and built by Donavan Jones.',
  ogTitle: 'Projects — Donavan Jones',
  ogDescription: 'A collection of full-stack projects spanning AI systems, Kubernetes infrastructure, SaaS platforms, and web applications — designed and built by Donavan Jones.',
  ogType: 'website',
  ogImage: `${_SITE}/img/logo.png`,
  ogUrl: `${_SITE}/projects/overview`,
  twitterCard: 'summary_large_image',
  twitterTitle: 'Projects — Donavan Jones',
  twitterDescription: 'Full-stack projects spanning AI systems, Kubernetes infrastructure, SaaS platforms, and production engineering.',
  canonical: `${_SITE}/projects/overview`,
})

const currentPage = computed(() => parseInt(route.query.page as string) || 1);
const limit = ref(9);

const { data: totalProjectsCount } = await useAsyncData(
  "totalProjectsCount",
  () =>
    queryContent("projects")
      .where({ draft: { $ne: true } })
      .count()
);

const totalPages = computed(() =>
  Math.ceil((totalProjectsCount.value || 0) / limit.value)
);

const { data: projects, refresh } = await useAsyncData("projects", () =>
  queryContent("/projects")
    .where({ draft: { $ne: true } })
    .skip((currentPage.value - 1) * limit.value)
    .limit(limit.value)
    .find()
);

watch(
  () => route.query,
  () => refresh()
);

function truncate(text: string, max = 120): string {
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

const statusColor: Record<string, string> = {
  "In Progress": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "Completed":   "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Live":        "bg-sky-500/15 text-sky-400 border-sky-500/30",
  "Archived":    "bg-slate-500/15 text-slate-400 border-slate-500/30",
};
</script>

<template>
  <PatternSection class="flex justify-center w-full">
    <div class="w-full">

      <!-- ── HERO ───────────────────────────────────────────────────── -->
      <div class="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div class="max-w-4xl mx-auto px-6 py-20 sm:py-28 text-center">
          <!-- Label -->
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6
                   bg-sky-500/10 border border-sky-500/20 text-sky-500 dark:text-sky-400 text-xs font-medium"
          >
            <Icon name="mdi:folder-multiple-outline" class="text-sm" />
            Portfolio
          </div>

          <!-- Heading -->
          <h1 class="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
            Projects
          </h1>

          <!-- Subtext -->
          <p class="mt-5 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Full-stack systems, AI integrations, and engineering experiments —
            built with production architecture and real-world constraints in mind.
          </p>

          <!-- Stats row -->
          <div class="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <span class="flex items-center gap-1.5">
              <Icon name="mdi:code-braces" class="text-sky-400" />
              {{ totalProjectsCount ?? 0 }} projects
            </span>
            <span class="flex items-center gap-1.5">
              <Icon name="mdi:layers-outline" class="text-sky-400" />
              Full-stack · AI · Infrastructure
            </span>
            <span class="flex items-center gap-1.5">
              <Icon name="mdi:account-outline" class="text-sky-400" />
              Donavan Jones
            </span>
          </div>
        </div>
      </div>

      <!-- ── GRID ───────────────────────────────────────────────────── -->
      <div class="w-full bg-slate-50 dark:bg-slate-950 py-10">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink
              v-for="project in projects"
              :key="project._path"
              :to="project._path"
              class="group flex flex-col rounded-2xl overflow-hidden
                     border border-slate-200 dark:border-slate-700/50
                     bg-white dark:bg-slate-900/60
                     hover:border-sky-500/40 dark:hover:border-sky-500/30
                     transition-all duration-200 hover:shadow-lg hover:shadow-sky-500/5"
            >

              <!-- Image -->
              <div class="relative overflow-hidden h-44 bg-slate-100 dark:bg-slate-800">
                <img
                  v-if="project.excerptImage"
                  :src="project.excerptImage"
                  :alt="project.title"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center"
                >
                  <Icon name="mdi:code-braces" class="text-5xl text-slate-300 dark:text-slate-600" />
                </div>

                <!-- Status badge -->
                <div
                  v-if="project.status"
                  class="absolute top-3 left-3 text-[11px] font-medium px-2.5 py-1 rounded-full border backdrop-blur-sm"
                  :class="statusColor[project.status] ?? 'bg-slate-500/15 text-slate-400 border-slate-500/30'"
                >
                  {{ project.status }}
                </div>

                <!-- Category badge -->
                <div
                  v-if="project.category"
                  class="absolute top-3 right-3 text-[11px] font-medium px-2.5 py-1 rounded-full
                         bg-black/50 text-white backdrop-blur-sm border border-white/10"
                >
                  {{ project.category }}
                </div>
              </div>

              <!-- Body -->
              <div class="flex flex-col flex-1 p-5">

                <!-- Title + highlight -->
                <div class="mb-3">
                  <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100
                             group-hover:text-sky-400 transition-colors">
                    {{ project.title }}
                  </h2>
                  <p v-if="project.highlight" class="text-xs font-medium text-sky-500 dark:text-sky-400 mt-0.5">
                    {{ project.highlight }}
                  </p>
                </div>

                <!-- Description -->
                <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                  {{ truncate(project.description) }}
                </p>

                <!-- Tags -->
                <div v-if="project.tags?.length" class="mt-4 flex flex-wrap gap-1.5">
                  <span
                    v-for="tag in project.tags.slice(0, 5)"
                    :key="tag"
                    class="text-[11px] px-2 py-0.5 rounded-md
                           bg-slate-100 dark:bg-slate-800
                           text-slate-500 dark:text-slate-400
                           border border-slate-200 dark:border-slate-700/50"
                  >
                    {{ tag }}
                  </span>
                  <span
                    v-if="project.tags.length > 5"
                    class="text-[11px] px-2 py-0.5 rounded-md
                           bg-slate-100 dark:bg-slate-800 text-slate-400"
                  >
                    +{{ project.tags.length - 5 }}
                  </span>
                </div>

                <!-- CTA -->
                <div class="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span class="text-xs font-medium text-slate-400 dark:text-slate-500">
                    {{ project.projectType || 'Personal Project' }}
                  </span>
                  <span class="inline-flex items-center gap-1 text-sm font-medium text-sky-500
                               group-hover:translate-x-1 transition-transform duration-200">
                    View Project
                    <Icon name="mdi:arrow-right" class="text-base" />
                  </span>
                </div>

              </div>
            </NuxtLink>
          </div>

        </div>

        <!-- Pagination -->
        <div class="mt-10">
          <Pagination
            v-if="totalPages > 1"
            :currentPage="currentPage"
            :limit="limit"
            :totalPages="totalPages"
          />
        </div>
      </div>

    </div>
  </PatternSection>
</template>
