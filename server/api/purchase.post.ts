import Stripe from 'stripe'
import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripe = new Stripe(config.private.stripeSecretKey, null)
  const siteUrl = (config.public.appDomain as string) || 'https://donavanjones.com'

  const body = await readBody(event)
  const priceId = body.price_id as string

  if (!priceId) {
    console.error('[purchase] Missing price_id in request body')
    return sendRedirect(event, '/?checkout_error=missing_price')
  }

  // Only allow prices that belong to a published product
  const product = await serverQueryContent(event, '/products')
    .where({ stripePriceId: priceId, draft: { $ne: true } })
    .findOne()
    .catch(() => null)

  if (!product) {
    console.error(`[purchase] No published product found for stripePriceId: ${priceId}`)
    return sendRedirect(event, '/?checkout_error=unknown_product')
  }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      metadata: {
        productSlug: product.slug ?? '',
        productTitle: product.title ?? '',
        guidePath: `${product._path}/guide`,
        stripePriceId: priceId,
      },
      success_url: `${siteUrl}/products/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${product._path}`,
    })

    await sendRedirect(event, session.url!)
  } catch (err) {
    console.error(`[purchase] Stripe checkout session creation failed for price ${priceId}:`, err)
    return sendRedirect(event, `${product._path}?checkout_error=stripe_failed`)
  }
})
