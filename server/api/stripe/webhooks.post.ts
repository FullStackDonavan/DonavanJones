import Stripe from 'stripe';
import sendDefaultErrorResponse from '~~/server/app/errors/responses/DefaultErrorsResponse';
import { handleSubscriptionChange, handleSubscriptionCreate, handleProductPurchase, handleInvoicePaid, handleInvoiceStatusChange } from '~~/server/app/services/stripeService';

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const webhookSecret = config.private.stripeWebhookSecret;
    let stripeEvent: Stripe.Event;

    if (webhookSecret) {
      const stripe = new Stripe(config.private.stripeSecretKey, null);
      const signature = getHeader(event, 'stripe-signature');
      const rawBody = await readRawBody(event);
      if (!signature || !rawBody) {
        throw createError({ statusCode: 400, message: 'Missing webhook signature' });
      }
      try {
        stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch {
        throw createError({ statusCode: 400, message: 'Invalid webhook signature' });
      }
    } else {
      console.warn('STRIPE_WEBHOOK_SECRET not set — accepting webhook without signature verification');
      stripeEvent = await readBody<Stripe.Event>(event);
    }

    let subscription: Stripe.Subscription | undefined;

    // Handle the stripe event
    switch (stripeEvent.type) {
      case 'customer.subscription.created':
        subscription = stripeEvent.data.object as Stripe.Subscription;
        await handleSubscriptionCreate(subscription, stripeEvent.created);
        break;
      case 'customer.subscription.deleted':
        // Handle subscription deleted event
        break;
      case 'customer.subscription.updated':
        subscription = stripeEvent.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription, stripeEvent.created);
        break;
      case 'checkout.session.completed':
        await handleProductPurchase(stripeEvent.data.object as Stripe.Checkout.Session);
        break;
      case 'invoice.paid':
        await handleInvoicePaid(stripeEvent.data.object as Stripe.Invoice);
        break;
      case 'invoice.voided':
        await handleInvoiceStatusChange(stripeEvent.data.object as Stripe.Invoice, 'void');
        break;
      case 'invoice.marked_uncollectible':
        await handleInvoiceStatusChange(stripeEvent.data.object as Stripe.Invoice, 'uncollectible');
        break;
      default:
        console.log(`Unhandled event type ${stripeEvent.type}`);
    }

    return `handled ${stripeEvent.type}.`;
  } catch (error) {
    console.error('Error in webhook handler:', error);
    if (error.statusCode) throw error;
    return sendDefaultErrorResponse(event, 'Error in webhook handler', 500, error.message);
  }
});
