import { getInvoiceByReviewToken } from '~~/server/database/repositories/invoiceRepository'

export default eventHandler(async (event) => {
  const token = event.context.params.token
  const invoice = await getInvoiceByReviewToken(token)

  if (!invoice) {
    throw createError({ statusCode: 404, message: 'Invoice not found' })
  }

  if (invoice.status !== 'paid') {
    throw createError({ statusCode: 403, message: 'This invoice has not been paid yet' })
  }

  return {
    clientName: invoice.clientName,
    totalCents: invoice.totalCents,
    items: invoice.items.map(i => ({ description: i.description, amountCents: i.amountCents, quantity: i.quantity })),
    existingReview: invoice.review ? { rating: invoice.review.rating, body: invoice.review.body } : null,
  }
})
