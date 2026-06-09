import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const projects = await serverQueryContent(event, 'projects')
    .without(['body'])
    .find()
    .catch(() => [])

  return projects
})
