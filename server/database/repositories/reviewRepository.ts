import prisma from "~/server/database/client"

export interface IReviewUpsert {
  userId: number
  productSlug: string
  rating: number
  body: string
}

// One review per user per product — writing again edits the existing one
export async function upsertReview(data: IReviewUpsert) {
  return await prisma.review.upsert({
    where: { userId_productSlug: { userId: data.userId, productSlug: data.productSlug } },
    update: { rating: data.rating, body: data.body },
    create: {
      userId: data.userId,
      productSlug: data.productSlug,
      rating: data.rating,
      body: data.body,
    },
  })
}

export async function getReviewsForProduct(productSlug: string) {
  const reviews = await prisma.review.findMany({
    where: { productSlug },
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { firstName: true, username: true } } },
  })

  return reviews.map(r => ({
    id: r.id,
    userId: r.userId,
    productSlug: r.productSlug,
    rating: r.rating,
    body: r.body,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    authorName: r.user.firstName || r.user.username || 'Verified buyer',
  }))
}

export async function getReviewsForUser(userId: number) {
  return await prisma.review.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

// Average rating + count per product, keyed by slug. Only slugs with at
// least one review are present in the result map.
export async function getReviewSummaries(): Promise<Record<string, { average: number; count: number }>> {
  const groups = await prisma.review.groupBy({
    by: ['productSlug'],
    _avg: { rating: true },
    _count: { rating: true },
  })

  const summaries: Record<string, { average: number; count: number }> = {}
  for (const g of groups) {
    summaries[g.productSlug] = {
      average: Math.round((g._avg.rating ?? 0) * 10) / 10,
      count: g._count.rating,
    }
  }
  return summaries
}
