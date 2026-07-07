// Backfill Purchase rows from Stripe checkout sessions that completed
// before the webhook was configured (or while it was down).
//
// Usage: node scripts/backfill-purchases.mjs
// Reads STRIPE_SECRET_KEY and DATABASE_URL from .env. Idempotent: rows
// are keyed on the checkout session id, so re-running never duplicates.

import * as dotenv from 'dotenv'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

dotenv.config()

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY not set in .env')
  process.exit(1)
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, null)
const prisma = new PrismaClient()

// Build priceId -> { slug, title } from the product content frontmatter,
// used as a fallback for sessions without our checkout metadata
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const productsByPriceId = {}
for (const file of readdirSync(join(root, 'content/products'))) {
  if (!file.endsWith('.md')) continue
  const text = readFileSync(join(root, 'content/products', file), 'utf8')
  const price = text.match(/^stripePriceId:\s*"([^"]+)"/m)?.[1]
  const slug = text.match(/^slug:\s*(\S+)/m)?.[1]
  const title = text.match(/^title:\s*"([^"]+)"/m)?.[1]
  if (price && slug && title) productsByPriceId[price] = { slug, title }
}

let recorded = 0
let skipped = 0

for await (const session of stripe.checkout.sessions.list({ limit: 100 })) {
  if (session.mode !== 'payment' || session.payment_status !== 'paid') {
    skipped++
    continue
  }

  const email = session.customer_details?.email
  if (!email) {
    console.warn(`Skipping ${session.id}: no customer email`)
    skipped++
    continue
  }

  // Prefer the metadata our checkout endpoint stamps; fall back to
  // looking the product up by the line item's price id
  let slug = session.metadata?.productSlug
  let title = session.metadata?.productTitle
  let priceId = session.metadata?.stripePriceId

  if (!slug || !title) {
    const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 })
    priceId = items.data[0]?.price?.id
    const product = priceId ? productsByPriceId[priceId] : undefined
    if (!product) {
      console.warn(`Skipping ${session.id}: cannot identify product (price ${priceId ?? 'unknown'})`)
      skipped++
      continue
    }
    slug = product.slug
    title = product.title
  }

  const user = await prisma.user.findFirst({ where: { email } })

  await prisma.purchase.upsert({
    where: { stripeSessionId: session.id },
    update: {},
    create: {
      email,
      userId: user?.id ?? null,
      productSlug: slug,
      productTitle: title,
      stripeSessionId: session.id,
      stripePriceId: priceId ?? null,
      amountTotal: session.amount_total ?? null,
      currency: session.currency ?? null,
      purchasedAt: new Date(session.created * 1000),
    },
  })

  console.log(`Recorded: ${title} for ${email} (${session.id})`)
  recorded++
}

console.log(`\nDone. ${recorded} recorded (or already present), ${skipped} skipped.`)
await prisma.$disconnect()
