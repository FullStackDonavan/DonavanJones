import Stripe from 'stripe'
import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripe = new Stripe(config.private.stripeSecretKey, null)

  const body = await readBody(event)
  const priceId = body.price_id as string

  if (!priceId) {
    throw createError({ statusCode: 400, message: 'Missing price_id' })
  }

  // Only allow prices that belong to a published product
  const product = await serverQueryContent(event, '/products')
    .where({ stripePriceId: priceId, draft: { $ne: true } })
    .findOne()
    .catch(() => null)

  if (!product) {
    throw createError({ statusCode: 400, message: 'Unknown product' })
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'payment',
    metadata: {
      productSlug: product.slug ?? '',
      productTitle: product.title ?? '',
      guidePath: `${product._path}/guide`,
      stripePriceId: priceId,
    },
    success_url: `${config.public.appDomain}/products/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.public.appDomain}${product._path}`,
  })

  await sendRedirect(event, session.url!)
})
