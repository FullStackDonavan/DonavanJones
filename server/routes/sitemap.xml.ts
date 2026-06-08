import { serverQueryContent } from '#content/server'

const SITE_URL = process.env.APP_DOMAIN || 'https://donavanjones.com'

function makeUrl(loc: string, lastmod?: string | null, changefreq = 'weekly', priority = '0.7'): string {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    lastmod ? `    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>` : '',
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].filter(Boolean).join('\n')
}

export default defineEventHandler(async (event) => {
  const docs = await serverQueryContent(event)
    .where({ draft: { $ne: true } })
    .find()

  // Collect unique categories, tags, and series from published content
  const categories = new Set<string>()
  const tags = new Set<string>()
  const series = new Set<string>()

  for (const doc of docs) {
    if (doc.category) {
      const cats = Array.isArray(doc.category) ? doc.category : [doc.category]
      cats.forEach((c: string) => categories.add(c))
    }
    if (doc.tags) {
      const docTags = Array.isArray(doc.tags) ? doc.tags : [doc.tags]
      docTags.forEach((t: string) => tags.add(t))
    }
    if (doc.series) {
      const s = Array.isArray(doc.series) ? doc.series : [doc.series]
      s.forEach((x: string) => series.add(x))
    }
  }

  // Content pages (blog posts, projects)
  const contentUrls = docs.map((doc) => {
    const lastmod = doc.lastUpdated || doc.date
    const priority = doc._path?.startsWith('/projects') ? '0.9' : '0.7'
    const changefreq = doc._path?.startsWith('/projects') ? 'monthly' : 'weekly'
    return makeUrl(`${SITE_URL}${doc._path}`, lastmod, changefreq, priority)
  })

  // Static pages
  const staticPages = [
    { path: '/',                      priority: '1.0', changefreq: 'weekly'  },
    { path: '/blog/overview',         priority: '1.0', changefreq: 'weekly'  },
    { path: '/projects/overview',     priority: '1.0', changefreq: 'weekly'  },
    { path: '/about',                 priority: '1.0', changefreq: 'weekly'  },
    { path: '/system-overview',       priority: '0.9', changefreq: 'monthly' },
    { path: '/resume',                priority: '0.9', changefreq: 'monthly' },
    { path: '/portfolio/overview',    priority: '0.8', changefreq: 'monthly' },
    { path: '/categories',            priority: '0.8', changefreq: 'weekly'  },
    { path: '/tags',                  priority: '0.8', changefreq: 'weekly'  },
    { path: '/series',                priority: '0.7', changefreq: 'weekly'  },
    { path: '/systems/backend',       priority: '0.8', changefreq: 'monthly' },
    { path: '/systems/ai',            priority: '0.8', changefreq: 'monthly' },
    { path: '/systems/infrastructure',priority: '0.8', changefreq: 'monthly' },
  ]
  const staticUrls = staticPages.map((p) => makeUrl(`${SITE_URL}${p.path}`, null, p.changefreq, p.priority))

  // Dynamic taxonomy pages
  const categoryUrls = Array.from(categories).map((cat) =>
    makeUrl(`${SITE_URL}/categories/${cat}`, null, 'weekly', '0.7')
  )
  const tagUrls = Array.from(tags).map((tag) =>
    makeUrl(`${SITE_URL}/tags/${tag}`, null, 'weekly', '0.6')
  )
  const seriesUrls = Array.from(series).map((s) =>
    makeUrl(`${SITE_URL}/series/${s}`, null, 'weekly', '0.7')
  )

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticUrls,
    ...contentUrls,
    ...categoryUrls,
    ...tagUrls,
    ...seriesUrls,
    '</urlset>',
  ].join('\n')

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return sitemap
})
