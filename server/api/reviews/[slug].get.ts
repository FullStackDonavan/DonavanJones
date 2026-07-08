import { getReviewsForProduct } from '~~/server/database/repositories/reviewRepository'

export default eventHandler(async (event) => {
  const slug = event.context.params.slug

  return await getReviewsForProduct(slug)
})
