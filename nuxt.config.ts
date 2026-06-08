export default defineNuxtConfig({
  compatibilityDate: '2026-06-07',
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      titleTemplate: '%s — Donavan Jones',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'author', content: 'Donavan Jones' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:site_name', content: 'Donavan Jones' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:image', content: `${process.env.APP_DOMAIN || 'https://donavanjones.com'}/img/logo.png` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:creator', content: '@donavanjones' },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Person',
                '@id': `${process.env.APP_DOMAIN || 'https://donavanjones.com'}/#person`,
                name: 'Donavan Jones',
                jobTitle: 'Full-Stack Engineer',
                url: process.env.APP_DOMAIN || 'https://donavanjones.com',
                email: 'donavanjones79@gmail.com',
                knowsAbout: [
                  'Vue.js', 'Nuxt.js', 'Node.js', 'TypeScript',
                  'AI Systems', 'RAG Pipelines', 'Kubernetes', 'PostgreSQL', 'Redis',
                ],
                sameAs: [],
              },
              {
                '@type': 'WebSite',
                '@id': `${process.env.APP_DOMAIN || 'https://donavanjones.com'}/#website`,
                name: 'Donavan Jones',
                url: process.env.APP_DOMAIN || 'https://donavanjones.com',
                description: 'Full-stack engineer specializing in Nuxt 3, Vue 3, Node.js, AI systems, RAG pipelines, and self-hosted Kubernetes infrastructure.',
                author: { '@id': `${process.env.APP_DOMAIN || 'https://donavanjones.com'}/#person` },
              },
            ],
          }),
        },
      ],
    },
  },

  // ── Modules ──────────────────────────────────────────────────────────────
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/content',
    'nuxt-icon',
    '@nuxt/image',
  ],

  // ── Components ───────────────────────────────────────────────────────────
  components: {
    dirs: [
      {
        path: '~/components',
        global: true,
        pathPrefix: false,
        preload: true,
      },
    ],
  },

  // ── Tailwind ─────────────────────────────────────────────────────────────
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    injectPosition: 0,
    viewer: true,
  },

  // ── Color mode ───────────────────────────────────────────────────────────
  colorMode: {
    classSuffix: '',
  },

  // ── @nuxt/content ────────────────────────────────────────────────────────
  content: {
    highlight: {
      theme: 'github-dark',
      preload: ['vue'],
    },
    navigation: {
      fields: ['author', 'subject', 'position'],
    },
  },

  // ── Runtime config ───────────────────────────────────────────────────────
  runtimeConfig: {
    private: {
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
      db: process.env.DATABASE_URL,
    },
    public: {
      GHL_API_KEY: process.env.GHL_API_KEY,
      appDomain: process.env.APP_DOMAIN,
      gitHash: process.env.GITHUB_SHA,
      releaseVersion: process.env.RELEASE_VERSION,
    },
  },

  experimental: {
    writeEarlyHints: false,
  },

  vite: {
    base: './',
    build: {
      minify: 'terser',
    },
  },

  plugins: [
    '~/plugins/kaboom.js',
  ],
});
