import { getCookie } from 'h3'
import { getUserBySessionToken } from '~~/server/app/services/sessionService'
import { getReviewsForUser } from '~~/server/database/repositories/reviewRepository'

export default defineEventHandler(async (event) => {
  const authToken = getCookie(event, 'auth_token')

  if (!authToken) {
    throw createError({ statusCode: 401, message: 'Unauthenticated' })
  }

  const user = await getUserBySessionToken(authToken)

  if (!user?.id) {
    throw createError({ statusCode: 401, message: 'Unauthenticated' })
  }

  return await getReviewsForUser(user.id)
})
