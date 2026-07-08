import Stripe from 'stripe'
import { readBody } from 'h3'
import { requireAdmin } from '~~/server/app/services/adminService'
import { createInvoice } from '~~/server/database/repositories/invoiceRepository'
import { sendMail } from '~~/server/app/services/mailer'

interface IItemInput {
  description: string
  amountCents: number
  quantity: number
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export default defineEventHandler(async (event) => {
  const admin = await requireAdmin(event)

  const config = useRuntimeConfig()
  const siteUrl = (config.public.appDomain as string) || 'https://donavanjones.com'
  const stripe = new Stripe(config.private.stripeSecretKey, null)

  const body = await readBody(event)
  const clientName = (body.clientName as string || '').trim()
  const clientEmail = (body.clientEmail as string || '').trim()
  const notes = (body.notes as string || '').trim()
  const dueDate = body.dueDate ? new Date(body.dueDate) : null
  const items = (body.items as IItemInput[] || []).filter(i => i.description?.trim() && i.amountCents > 0)

  if (!clientName || !clientEmail) {
    throw createError({ statusCode: 400, message: 'Client name and email are required' })
  }

  if (!items.length) {
    throw createError({ statusCode: 400, message: 'At least one line item is required' })
  }

  const totalCents = items.reduce((sum, i) => sum + i.amountCents * i.quantity, 0)

  const daysUntilDue = dueDate
    ? Math.max(1, Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 14

  // Find or create the Stripe customer for this client email
  const existing = await stripe.customers.list({ email: clientEmail, limit: 1 })
  const customer = existing.data[0] ?? await stripe.customers.create({ email: clientEmail, name: clientName })

  const draftInvoice = await stripe.invoices.create({
    customer: customer.id,
    collection_method: 'send_invoice',
    days_until_due: daysUntilDue,
    auto_advance: false,
    description: notes || undefined,
  })

  for (const item of items) {
    await stripe.invoiceItems.create({
      customer: customer.id,
      invoice: draftInvoice.id,
      amount: item.amountCents * item.quantity,
      currency: 'usd',
      description: item.quantity > 1
        ? `${item.description} (x${item.quantity})`
        : item.description,
    })
  }

  const finalized = await stripe.invoices.finalizeInvoice(draftInvoice.id)

  const invoice = await createInvoice({
    createdByUserId: admin.id,
    clientName,
    clientEmail,
    notes: notes || undefined,
    totalCents,
    currency: 'usd',
    dueDate,
    stripeInvoiceId: finalized.id,
    stripeCustomerId: customer.id,
    hostedInvoiceUrl: finalized.hosted_invoice_url,
    invoicePdf: finalized.invoice_pdf,
    items,
  })

  if (finalized.hosted_invoice_url) {
    await sendMail({
      to: clientEmail,
      subject: `Invoice from Donavan Jones — ${formatCents(totalCents)}`,
      html: `
        <p>Hi ${clientName},</p>
        <p>Here's your invoice${notes ? ` for ${notes}` : ''}:</p>
        <ul>
          ${items.map(i => `<li>${i.description}${i.quantity > 1 ? ` (x${i.quantity})` : ''} — ${formatCents(i.amountCents * i.quantity)}</li>`).join('')}
        </ul>
        <p><strong>Total: ${formatCents(totalCents)}</strong>${dueDate ? ` · Due ${dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}</p>
        <p><a href="${finalized.hosted_invoice_url}">View &amp; Pay Invoice</a></p>
        <p>Thanks,<br>Donavan Jones<br><a href="${siteUrl}">${siteUrl}</a></p>
      `,
    })
  }

  return invoice
})
