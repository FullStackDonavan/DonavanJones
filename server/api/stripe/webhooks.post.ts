import Stripe from 'stripe';
import sendDefaultErrorResponse from '~~/server/app/errors/responses/DefaultErrorsResponse';
import { handleSubscriptionChange, handleSubscriptionCreate } from '~~/server/app/services/stripeService';

export default defineEventHandler(async (event) => {
  try {
    const stripeEvent = await readBody<Stripe.Event>(event);
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
      default:
        console.log(`Unhandled event type ${stripeEvent.type}`);
    }

    return `handled ${stripeEvent.type}.`;
  } catch (error) {
    console.error('Error in webhook handler:', error);
    return sendDefaultErrorResponse(event, 'Error in webhook handler', 500, error.message);
  }
});
