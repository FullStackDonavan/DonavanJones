<template>
  <section class="technical-challenges">

    <div
      class="relative overflow-hidden rounded-2xl
             border border-slate-200 dark:border-amber-500/20
             bg-white/80 dark:bg-slate-900/60"
    >

      <!-- Glow -->
      <div
        class="absolute inset-0
               bg-gradient-to-r
               from-amber-500/5
               via-red-500/5
               to-purple-500/5"
      />

      <div class="relative p-8 lg:p-10">

        <div class="grid lg:grid-cols-[1.5fr_1fr] gap-10">

          <!-- LEFT -->
          <div>

            <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full
                     bg-amber-500/10 text-amber-400 text-sm"
            >
              <Icon name="mdi:cog-outline" />
              Technical Challenges
            </div>

            <h2
              class="mt-4 text-5xl font-bold
                     text-slate-900 dark:text-white"
            >
              Engineering
              <span class="block text-amber-400">
                Solutions
              </span>
            </h2>

            <p class="mt-6 text-lg text-slate-600 dark:text-slate-300">
              Building Bible Verse required solving challenges in
              livestreaming, AI integration, large-scale content
              rendering, and cloud infrastructure.
            </p>

            <!-- FLOW -->
            <!-- <div class="mt-10">
              ...
            </div> -->

          </div>

          <!-- RIGHT -->
          <div class="grid grid-cols-2 gap-4">

            <!-- Challenge Card -->
            <div class="challenge-card">
              <Icon
                name="mdi:video-wireless"
                class="text-6xl text-emerald-400"
              />

              <div class="mt-4">
                <div class="text-2xl font-bold">
                  Live
                </div>

                <div class="text-xs text-slate-400">
                  WebRTC + AWS IVS
                </div>
              </div>
            </div>

            <div class="challenge-card">
              <Icon
                name="mdi:brain"
                class="text-6xl text-purple-400"
              />

              <div class="mt-4">
                <div class="text-2xl font-bold">
                  AI
                </div>

                <div class="text-xs text-slate-400">
                  Bible Logic
                </div>
              </div>
            </div>

            <div class="challenge-card">
              <Icon
                name="mdi:database"
                class="text-6xl text-sky-400"
              />

              <div class="mt-4">
                <div class="text-2xl font-bold">
                  Data
                </div>

                <div class="text-xs text-slate-400">
                  Bible + Quran
                </div>
              </div>
            </div>

            <div class="challenge-card">
              <Icon
                name="mdi:cloud"
                class="text-6xl text-amber-400"
              />

              <div class="mt-4">
                <div class="text-2xl font-bold">
                  Cloud
                </div>

                <div class="text-xs text-slate-400">
                  AWS + S3
                </div>
              </div>
            </div>

          </div>

        </div>

                    <div class="grid grid-cols-2 gap-4">
            <slot />
            </div>

        <!-- STACK -->
        <div class="mt-10 pt-8 border-t border-slate-800">

          <div class="text-xs uppercase tracking-widest text-slate-500 mb-4">
            Technologies Involved
          </div>

          <div class="flex flex-wrap gap-2">
            <span class="tech-badge">WebRTC</span>
            <span class="tech-badge">AWS IVS</span>
            <span class="tech-badge">OpenAI</span>
            <span class="tech-badge">Prisma</span>
            <span class="tech-badge">MySQL</span>
            <span class="tech-badge">S3</span>
          </div>

        </div>

      </div>

    </div>

  </section>
</template>