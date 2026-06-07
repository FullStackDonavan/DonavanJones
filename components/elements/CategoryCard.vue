<script setup lang="ts">
import { ref, computed } from "vue";
import type { ICategory } from "~/types/ICategory";

const props = defineProps<{
  category: ICategory;
}>();

const VISIBLE = 4;
const expanded = ref(false);

const visibleTags = computed(() =>
  expanded.value ? props.category.tags : props.category.tags?.slice(0, VISIBLE)
);

const hiddenCount = computed(() =>
  Math.max(0, (props.category.tags?.length ?? 0) - VISIBLE)
);
</script>

<template>
  <div v-if="category" class="flex flex-col p-5 h-full">

    <!-- Title -->
    <nuxt-link v-if="category.link" :to="category.link" class="group">
      <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100
                 group-hover:text-sky-400 transition-colors">
        {{ category.title }}
      </h3>
    </nuxt-link>
    <h3 v-else class="text-sm font-semibold text-slate-900 dark:text-slate-100">
      {{ category.title }}
    </h3>

    <!-- Message -->
    <p v-if="category.message" class="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
      {{ category.message }}
    </p>

    <!-- Tags -->
    <div v-if="category.tags?.length" class="mt-4">
      <div class="flex flex-wrap gap-1.5">
        <nuxt-link
          v-for="(tag, index) in visibleTags"
          :key="index"
          :to="tag.link"
          class="text-[11px] px-2 py-0.5 rounded-md
                 bg-slate-100 dark:bg-slate-800
                 text-slate-500 dark:text-slate-400
                 border border-slate-200 dark:border-slate-700/50
                 hover:border-sky-500/40 hover:text-sky-500 dark:hover:text-sky-400
                 transition-colors whitespace-nowrap"
        >
          #{{ tag.title }}
        </nuxt-link>
      </div>

      <button
        v-if="hiddenCount > 0 || expanded"
        @click="expanded = !expanded"
        class="mt-3 text-xs font-medium text-sky-500 hover:text-sky-400 transition-colors"
      >
        {{ expanded ? "Show less" : `+${hiddenCount} more` }}
      </button>
    </div>

  </div>
</template>
