// Canonical site origin with no trailing slash (APP_DOMAIN may be set with one,
// which produced "https://site//path" canonicals and og:urls).
const SITE_URL = (process.env.APP_DOMAIN || 'https://donavanjones.com').replace(/\/+$/, '')

export default defineNuxtConfig({
  compatibilityDate: '2026-06-07',
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      // titleTemplate is set in app.vue (a function, so titles that already
      // end in "Donavan Jones" are not suffixed twice).
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'author', content: 'Donavan Jones' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:site_name', content: 'Donavan Jones' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:image', content: `${SITE_URL}/img/logo.png` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:creator', content: '@donavanjones' },
      ],
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-22YRGGHBGE',
          async: true,
        },
        {
          innerHTML: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-22YRGGHBGE');`,
        },
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Person',
                '@id': `${SITE_URL}/#person`,
                name: 'Donavan Jones',
                jobTitle: 'AI Systems Engineer & Platform Builder',
                description: 'Full-stack and AI systems engineer who builds and operates a self-hosted local AI cluster (K3s on Raspberry Pi and NVIDIA Jetson Orin Nano Super, plus an RTX 3090) running RAG, voice and agent workloads.',
                url: SITE_URL,
                email: 'donavanjones79@gmail.com',
                address: { '@type': 'PostalAddress', addressLocality: 'Lakeland', addressRegion: 'FL', addressCountry: 'US' },
                knowsAbout: [
                  'Local LLM inference', 'Edge AI', 'NVIDIA Jetson Orin', 'Ollama',
                  'AI agent orchestration', 'Temporal', 'Retrieval-augmented generation',
                  'LLM output verification', 'Kubernetes', 'K3s', 'Prometheus', 'Grafana', 'Loki',
                  'Nuxt 3', 'Vue 3', 'TypeScript', 'Node.js', 'Python', 'FastAPI',
                  'PostgreSQL', 'Redis', 'Weaviate', 'MinIO',
                ],
                sameAs: [
                  'https://github.com/FullStackDonavan',
                  'https://linkedin.com/in/donavanjones',
                ],
              },
              {
                '@type': 'WebSite',
                '@id': `${SITE_URL}/#website`,
                name: 'Donavan Jones',
                url: SITE_URL,
                description: 'Donavan Jones writes about running local AI in production: Jetson and RTX 3090 inference, K3s homelab infrastructure, agent orchestration, RAG, and full-stack engineering.',
                author: { '@id': `${SITE_URL}/#person` },
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
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      db: process.env.DATABASE_URL,
    },
    public: {
      GHL_API_KEY: process.env.GHL_API_KEY,
      appDomain: SITE_URL,
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
