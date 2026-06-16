import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripe = new Stripe(config.private.stripeSecretKey, null)

  const body = await readBody(event)
  const priceId = body.price_id as string

  if (!priceId) {
    throw createError({ statusCode: 400, message: 'Missing price_id' })
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'payment',
    success_url: `${config.public.appDomain}/products/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.public.appDomain}/products/overview`,
  })

  await sendRedirect(event, session.url!)
})
