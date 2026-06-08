<script setup lang="ts">
const config = useRuntimeConfig()
const SITE = (config.public.appDomain as string) || 'https://donavanjones.com'

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${SITE}/#organization`,
            name: 'Donavan Jones',
            url: SITE,
            logo: {
              '@type': 'ImageObject',
              '@id': `${SITE}/#logo`,
              url: `${SITE}/img/logo.png`,
              contentUrl: `${SITE}/img/logo.png`,
              caption: 'Donavan Jones',
            },
            description: 'Full-stack engineering practice specializing in production AI systems, SaaS platforms, backend architecture, and self-hosted Kubernetes infrastructure.',
            founder: { '@id': `${SITE}/#person` },
            foundingDate: '2020',
            sameAs: [
              'https://github.com/FullStackDonavan',
              'https://linkedin.com/in/donavanjones',
              'https://twitter.com/jack_fullstack',
            ],
          },
          {
            '@type': 'WebSite',
            '@id': `${SITE}/#website`,
            url: SITE,
            name: 'Donavan Jones',
            inLanguage: 'en-US',
            publisher: { '@id': `${SITE}/#organization` },
          },
          {
            '@type': 'Person',
            '@id': `${SITE}/#person`,
            name: 'Donavan Jones',
            url: SITE,
            jobTitle: 'Full-Stack Engineer & Systems Architect',
            worksFor: { '@id': `${SITE}/#organization` },
            sameAs: [
              'https://github.com/FullStackDonavan',
              'https://linkedin.com/in/donavanjones',
              'https://twitter.com/jack_fullstack',
            ],
          },
        ],
      }),
    },
  ],
})
</script>

<template>
  <div class="">
    <Navbar />
    <slot />
    <TheFooter />
  </div>
</template>
