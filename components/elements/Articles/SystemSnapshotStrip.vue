<template>
  <div
    class="grid grid-cols-2 gap-3 p-4
           rounded-2xl border
           border-slate-300 dark:border-slate-800/60
           bg-slate-50/70 dark:bg-slate-950/30
           backdrop-blur-md"
  >

    <div
      v-for="item in items"
      :key="item.title"
      class="flex items-center gap-3 p-3 rounded-xl
             bg-white/60 dark:bg-slate-900/40
             border border-slate-200 dark:border-slate-800
             hover:scale-[1.02] transition"
    >
      <Icon :name="item.icon" class="text-xl text-sky-400" />

      <div class="min-w-0">
        <div class="text-sm font-semibold text-slate-900 dark:text-white truncate">
          {{ item.title }}
        </div>
        <div class="text-xs text-slate-500 dark:text-slate-400 truncate">
          {{ item.subtitle }}
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [
      {
        title: "Scripture Engine",
        subtitle: "Bible + Quran Data",
        icon: "mdi:book-open-page-variant"
      },
      {
        title: "AI Reasoning",
        subtitle: "Bible Logic",
        icon: "mdi:brain"
      },
      {
        title: "Live System",
        subtitle: "Streaming + Chat",
        icon: "mdi:video-wireless"
      },
      {
        title: "Cloud Infra",
        subtitle: "AWS + Scalable Backend",
        icon: "mdi:cloud-outline"
      }
    ]
  }
})
</script>