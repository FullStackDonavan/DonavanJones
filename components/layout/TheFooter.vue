<template>
  <footer
    class="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800
           transition-colors duration-300"
  >
    <div class="max-w-6xl mx-auto px-6 py-12">

      <!-- Top grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">

        <!-- Brand -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Donavan Jones
          </h2>

          <p class="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Full-Stack Engineer &amp; Platform Builder — AI systems, SaaS platforms, and self-hosted infrastructure.
          </p>

          <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Based in Florida 🇺🇸
          </div>
        </div>

        <!-- Navigation -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
            Navigation
          </h3>

          <ul class="mt-4 space-y-2 text-sm">
            <li><NuxtLink to="/" class="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Home</NuxtLink></li>
            <li><NuxtLink to="/about" class="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">About</NuxtLink></li>
            <li><NuxtLink to="/projects/overview" class="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Projects</NuxtLink></li>
            <li><NuxtLink to="/blog/overview" class="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Blog</NuxtLink></li>
            <li><NuxtLink to="/insights/overview" class="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Insights</NuxtLink></li>
            <li><NuxtLink to="/resume" class="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">Resume</NuxtLink></li>
          </ul>
        </div>

          <!-- Social -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Connect
            </h3>

            <div class="mt-4 flex gap-5">

              <!-- GitHub -->
              <a
                href="https://github.com/FullStackDonavan"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.504.5.092.682-.217.682-.483
                    0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466
                    -.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832
                    .092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951
                    0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65
                    0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337
                    1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651
                    .64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943
                    .359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747
                    0 .268.18.58.688.482C19.138 20.162 22 16.418 22 12
                    22 6.477 17.523 2 12 2z"
                  />
                </svg>
              </a>

              <!-- Twitter -->
              <!-- <a
                href="https://twitter.com/"
                target="_blank"
                class="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53
                    A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646
                    4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996
                    4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287
                    4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052
                    a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07
                    4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407
                    a11.616 11.616 0 006.29 1.84"
                  />
                </svg>
              </a> -->

              <!-- LinkedIn -->
              <a
                href="https://www.linkedin.com/in/donavanjones/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14
                    c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268
                    c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764
                    1.75.79 1.75 1.764-.784 1.764-1.75 1.764zm13.5 11.268h-3v-5.604
                    c0-3.368-4-3.113-4 0v5.604h-3v-10h3v1.765
                    c1.396-2.586 7-2.777 7 2.476v5.759z"
                  />
                </svg>
              </a>

            </div>

            <p class="mt-4 text-xs text-gray-500 dark:text-gray-500">
              Open to freelance & full-time opportunities
            </p>
          </div>

      </div>

      <!-- Divider -->
      <div class="my-10 border-t border-gray-200 dark:border-gray-800"></div>

      <!-- Bottom bar -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">

        <p class="text-sm text-gray-500 dark:text-gray-400">
          © 2026 Donavan Jones. All rights reserved.
        </p>

        <div class="flex items-center gap-6 text-sm">
          <NuxtLink to="/privacy" class="text-gray-500 hover:text-black dark:hover:text-white">
            Privacy
          </NuxtLink>

          <NuxtLink to="/terms" class="text-gray-500 hover:text-black dark:hover:text-white">
            Terms
          </NuxtLink>

        <a href="#top" class="text-gray-500 hover:text-black dark:hover:text-white">
          Back to top ↑
        </a>
        </div>

      </div>

    </div>
  </footer>
</template>