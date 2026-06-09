import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')
  if (!name) return null

  const hub = await serverQueryContent(event, `/categories/${name}`)
    .without(['body'])
    .findOne()
    .catch(() => null)

  if (!hub) return null

  const paths: string[] = (hub.featuredArticles ?? []).map((f: any) => f.path)

  const featuredDocs = paths.length
    ? await serverQueryContent(event, 'blog')
        .where({ _path: { $in: paths } })
        .without(['body'])
        .find()
        .catch(() => [])
    : []

  return { hub, featuredDocs }
})
