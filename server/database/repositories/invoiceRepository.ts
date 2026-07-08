import prisma from "~/server/database/client"

export interface IInvoiceItemInput {
  description: string
  amountCents: number
  quantity: number
}

export interface IInvoiceCreate {
  createdByUserId: number
  clientName: string
  clientEmail: string
  notes?: string
  totalCents: number
  currency: string
  dueDate?: Date | null
  stripeInvoiceId: string
  stripeCustomerId: string
  hostedInvoiceUrl?: string | null
  invoicePdf?: string | null
  items: IInvoiceItemInput[]
}

export async function createInvoice(data: IInvoiceCreate) {
  return await prisma.invoice.create({
    data: {
      createdByUserId: data.createdByUserId,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      notes: data.notes,
      totalCents: data.totalCents,
      currency: data.currency,
      dueDate: data.dueDate ?? null,
      stripeInvoiceId: data.stripeInvoiceId,
      stripeCustomerId: data.stripeCustomerId,
      hostedInvoiceUrl: data.hostedInvoiceUrl,
      invoicePdf: data.invoicePdf,
      items: {
        create: data.items.map(item => ({
          description: item.description,
          amountCents: item.amountCents,
          quantity: item.quantity,
        })),
      },
    },
    include: { items: true },
  })
}

export async function getAllInvoices() {
  return await prisma.invoice.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  })
}

export async function markInvoiceStatus(stripeInvoiceId: string, status: string, paidAt?: Date) {
  return await prisma.invoice.updateMany({
    where: { stripeInvoiceId },
    data: { status, ...(paidAt ? { paidAt } : {}) },
  })
}

export async function getInvoiceByStripeId(stripeInvoiceId: string) {
  return await prisma.invoice.findUnique({ where: { stripeInvoiceId } })
}
