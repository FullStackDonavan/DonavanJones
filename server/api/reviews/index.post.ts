import { getCookie, readBody } from 'h3'
import { getUserBySessionToken } from '~~/server/app/services/sessionService'
import { getPurchasesForUser } from '~~/server/database/repositories/purchaseRepository'
import { upsertReview } from '~~/server/database/repositories/reviewRepository'

export default defineEventHandler(async (event) => {
  const authToken = getCookie(event, 'auth_token')

  if (!authToken) {
    throw createError({ statusCode: 401, message: 'You must be logged in to leave a review' })
  }

  const user = await getUserBySessionToken(authToken)

  if (!user?.id) {
    throw createError({ statusCode: 401, message: 'You must be logged in to leave a review' })
  }

  const body = await readBody(event)
  const productSlug = body.productSlug as string
  const rating = Number(body.rating)
  const reviewBody = (body.body as string || '').trim()

  if (!productSlug) {
    throw createError({ statusCode: 400, message: 'Missing productSlug' })
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw createError({ statusCode: 400, message: 'Rating must be between 1 and 5' })
  }

  if (!reviewBody) {
    throw createError({ statusCode: 400, message: 'Review text is required' })
  }

  const purchases = await getPurchasesForUser(user.id, user.email)
  const owns = purchases.some(p => p.productSlug === productSlug)

  if (!owns) {
    throw createError({ statusCode: 403, message: 'You can only review products you have purchased' })
  }

  return await upsertReview({ userId: user.id, productSlug, rating, body: reviewBody })
})
