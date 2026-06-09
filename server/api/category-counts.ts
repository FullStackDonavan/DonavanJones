import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const slugs = ['ai-engineering', 'backend-engineering', 'infrastructure-engineering', 'algorithms']

  const counts = await Promise.all(
    slugs.map(slug =>
      serverQueryContent(event, 'blog')
        .where({ category: { $contains: slug }, draft: { $ne: true } })
        .count()
        .catch(() => 0)
    )
  )

  return Object.fromEntries(slugs.map((slug, i) => [slug, counts[i]]))
})
