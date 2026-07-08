import { H3Event, getCookie } from 'h3'
import { User } from '@prisma/client'
import { getUserBySessionToken } from '~~/server/app/services/sessionService'

export async function requireAdmin(event: H3Event): Promise<User> {
  const authToken = getCookie(event, 'auth_token')

  if (!authToken) {
    throw createError({ statusCode: 401, message: 'Unauthenticated' })
  }

  const user = await getUserBySessionToken(authToken)

  if (!user?.isAdmin) {
    throw createError({ statusCode: 403, message: 'Admin access required' })
  }

  return user
}
