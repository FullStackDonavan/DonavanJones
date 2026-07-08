import { readBody } from 'h3'
import { getInvoiceByReviewToken } from '~~/server/database/repositories/invoiceRepository'
import { upsertInvoiceReview } from '~~/server/database/repositories/reviewRepository'

export default eventHandler(async (event) => {
  const token = event.context.params.token
  const invoice = await getInvoiceByReviewToken(token)

  if (!invoice) {
    throw createError({ statusCode: 404, message: 'Invoice not found' })
  }

  if (invoice.status !== 'paid') {
    throw createError({ statusCode: 403, message: 'This invoice has not been paid yet' })
  }

  const body = await readBody(event)
  const rating = Number(body.rating)
  const reviewBody = (body.body as string || '').trim()

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw createError({ statusCode: 400, message: 'Rating must be between 1 and 5' })
  }

  if (!reviewBody) {
    throw createError({ statusCode: 400, message: 'Review text is required' })
  }

  return await upsertInvoiceReview({ invoiceId: invoice.id, rating, body: reviewBody })
})
