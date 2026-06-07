app: {
  pageTransition: { name: 'page', mode: 'out-in' },
  head: {
    charset: 'utf-8',
    viewport: 'width=device-width, initial-scale=1',
    titleTemplate: '%s — Donavan Jones',

    meta: [
      { name: 'author', content: 'Donavan Jones' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:site_name', content: 'Donavan Jones' },
      { property: 'og:locale', content: 'en_US' },
      { name: 'twitter:creator', content: '@donavanjones' },
      {
        name: 'google-site-verification',
        content: '7iUSMERZz_LsMNzstyp4-5uwlbeiPZYvmRoIZ3VDNyU'
      }
    ],

    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Person',
              '@id': `${process.env.APP_DOMAIN || 'https://donavanjones.dev'}/#person`,
              name: 'Donavan Jones',
              jobTitle: 'Full-Stack Engineer',
              url: process.env.APP_DOMAIN || 'https://donavanjones.dev',
              email: 'donavanjones79@gmail.com',
              knowsAbout: [
                'Vue.js', 'Nuxt.js', 'Node.js', 'TypeScript',
                'AI Systems', 'RAG Pipelines', 'Kubernetes', 'PostgreSQL', 'Redis'
              ],
              sameAs: []
            },
            {
              '@type': 'WebSite',
              '@id': `${process.env.APP_DOMAIN || 'https://donavanjones.dev'}/#website`,
              name: 'Donavan Jones',
              url: process.env.APP_DOMAIN || 'https://donavanjones.dev',
              description:
                'Full-stack engineer specializing in Nuxt 3, Vue 3, Node.js, AI systems, RAG pipelines, and self-hosted Kubernetes infrastructure.',
              author: {
                '@id': `${process.env.APP_DOMAIN || 'https://donavanjones.dev'}/#person`
              }
            }
          ]
        })
      }
    ]
  }
}