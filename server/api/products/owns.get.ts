import { getCookie, getQuery } from 'h3'
import { getUserBySessionToken } from '~~/server/app/services/sessionService'
import { getPurchasesForUser } from '~~/server/database/repositories/purchaseRepository'

export default defineEventHandler(async (event) => {
  const slug = getQuery(event).slug as string

  if (!slug) {
    throw createError({ statusCode: 400, message: 'Missing slug' })
  }

  const authToken = getCookie(event, 'auth_token')

  if (!authToken) {
    return { authenticated: false, owns: false }
  }

  const user = await getUserBySessionToken(authToken)

  if (!user?.id) {
    return { authenticated: false, owns: false }
  }

  const purchases = await getPurchasesForUser(user.id, user.email)

  return {
    authenticated: true,
    owns: purchases.some(p => p.productSlug === slug),
  }
})
