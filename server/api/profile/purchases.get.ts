import { getCookie } from 'h3'
import { getUserBySessionToken } from '~~/server/app/services/sessionService'
import { getPurchasesForUser } from '~~/server/database/repositories/purchaseRepository'

export default defineEventHandler(async (event) => {
  const authToken = getCookie(event, 'auth_token')

  if (!authToken) {
    throw createError({ statusCode: 401, message: 'Unauthenticated' })
  }

  const user = await getUserBySessionToken(authToken)

  if (!user?.id) {
    throw createError({ statusCode: 401, message: 'Unauthenticated' })
  }

  return await getPurchasesForUser(user.id, user.email)
})
