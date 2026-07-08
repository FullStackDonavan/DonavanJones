import { getReviewSummaries } from '~~/server/database/repositories/reviewRepository'

export default defineEventHandler(async () => {
  return await getReviewSummaries()
})
