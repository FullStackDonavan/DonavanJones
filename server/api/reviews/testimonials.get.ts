import { getTestimonials } from '~~/server/database/repositories/reviewRepository'

export default defineEventHandler(async () => {
  return await getTestimonials()
})
