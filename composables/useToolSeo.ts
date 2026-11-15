// SEO for the /tools pages: title/description/OG/Twitter plus JSON-LD
// (WebApplication, BreadcrumbList and, when given, FAQPage). Canonical comes
// from layouts/default.vue and deliberately ignores the query string, so shared
// calculator links (?m=…&q=…) all canonicalise to the clean URL.
export function useToolSeo(opts: {
  title: string
  description: string
  path: string
  name: string
  crumb: string
  faq?: { q: string; a: string }[]
  /** site path of the og image; defaults to the tools hero */
  image?: string
}) {
  const config = useRuntimeConfig()
  const SITE = (config.public.appDomain as string) || 'https://donavanjones.com'
  const url = `${SITE}${opts.path}`

  useSeoMeta({
    title: opts.title,
    description: opts.description,
    ogTitle: opts.title,
    ogDescription: opts.description,
    ogType: 'website',
    ogUrl: url,
    ogImage: `${SITE}${opts.image || '/img/heroes/tools.jpg'}`,
    twitterImage: `${SITE}${opts.image || '/img/heroes/tools.jpg'}`,
    twitterCard: 'summary_large_image',
    twitterTitle: opts.title,
    twitterDescription: opts.description,
  })

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebApplication',
      '@id': `${url}#app`,
      name: opts.name,
      url,
      description: opts.description,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any (runs in the browser)',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      isAccessibleForFree: true,
      author: { '@id': `${SITE}/#person` },
      isPartOf: { '@id': `${SITE}/#website` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'AI Tools', item: `${SITE}/tools` },
        ...(opts.path !== '/tools' ? [{ '@type': 'ListItem', position: 3, name: opts.crumb, item: url }] : []),
      ],
    },
  ]
  if (opts.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: opts.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    })
  }

  useHead({
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }],
  })
}
