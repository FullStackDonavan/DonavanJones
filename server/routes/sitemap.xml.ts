import { serverQueryContent } from '#content/server'

const SITE_URL = process.env.APP_DOMAIN || 'https://donavanjones.dev'

export default defineEventHandler(async (event) => {
  const docs = await serverQueryContent(event)
    .where({ draft: { $ne: true } })
    .find()

  const urls = docs.map((doc) => {
    const lastmod = doc.lastUpdated || doc.date
    const priority = doc._path?.startsWith('/projects') ? '0.9' : '0.7'
    const changefreq = doc._path?.startsWith('/projects') ? 'monthly' : 'weekly'
    return [
      '  <url>',
      `    <loc>${SITE_URL}${doc._path}</loc>`,
      lastmod ? `    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>` : '',
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].filter(Boolean).join('\n')
  })

  // Static pages
  const staticPages = ['/', '/projects/overview', '/blog/overview', '/system-overview', '/about-me']
  const staticUrls = staticPages.map((path) => [
    '  <url>',
    `    <loc>${SITE_URL}${path}</loc>`,
    '    <changefreq>weekly</changefreq>',
    '    <priority>1.0</priority>',
    '  </url>',
  ].join('\n'))

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticUrls,
    ...urls,
    '</urlset>',
  ].join('\n')

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return sitemap
})
