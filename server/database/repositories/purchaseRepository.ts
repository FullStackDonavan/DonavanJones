import { Purchase } from "@prisma/client";
import prisma from "~/server/database/client";

export interface IPurchaseCreate {
  email: string
  userId?: number | null
  productSlug: string
  productTitle: string
  stripeSessionId: string
  stripePriceId?: string | null
  amountTotal?: number | null
  currency?: string | null
}

// Upsert keyed on the checkout session id so Stripe webhook retries
// never create duplicate rows
export async function recordPurchase(data: IPurchaseCreate): Promise<Purchase> {
  return await prisma.purchase.upsert({
    where: { stripeSessionId: data.stripeSessionId },
    update: {},
    create: {
      email: data.email,
      userId: data.userId ?? null,
      productSlug: data.productSlug,
      productTitle: data.productTitle,
      stripeSessionId: data.stripeSessionId,
      stripePriceId: data.stripePriceId ?? null,
      amountTotal: data.amountTotal ?? null,
      currency: data.currency ?? null,
    },
  })
}

// Attach any guest purchases made with this user's email, then return
// everything the user owns, newest first
export async function getPurchasesForUser(userId: number, email?: string | null): Promise<Purchase[]> {
  if (email) {
    await prisma.purchase.updateMany({
      where: { email: email, userId: null },
      data: { userId: userId },
    })
  }

  return await prisma.purchase.findMany({
    where: { userId: userId },
    orderBy: { purchasedAt: 'desc' },
  })
}
