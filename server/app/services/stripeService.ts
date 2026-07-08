import { SubPostRes } from '~/types/SubPostRes';
import { updateSubscription, createSubscription, getSubscriptionById, getUserByStripeCustomerId, getUserByEmail} from "~/server/database/repositories/userRespository"
import { createGHLContact} from "~/server/database/repositories/crmServices"
import { IUser } from '~/types/IUser';
import Stripe from 'stripe';
import { ISubscription } from '~~/types/ISubscription';
import { sendMail } from './mailer';
import { recordPurchase } from '~~/server/database/repositories/purchaseRepository';
import { markInvoiceStatus, getInvoiceByStripeId } from '~~/server/database/repositories/invoiceRepository';

const config = useRuntimeConfig()
const stripe = new Stripe(config.private.stripeSecretKey, null);
const siteUrl = (config.public.appDomain as string) || 'https://donavanjones.com'

export async function getSubscribeUrl(lookupKey: string, user: IUser): Promise<SubPostRes> {
  const customerEmail = user.email;

  try {
    const price = await stripe.prices.retrieve(lookupKey);

    let shouldUpdateUser = false;

    if (!user.stripeCustomerId) {
      shouldUpdateUser = true;
      const customer = await stripe.customers.create({ email: customerEmail });
      user.stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${siteUrl}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/subscribe/cancel`,
      customer: user.stripeCustomerId
    });

    return { url: session.url, user, shouldUpdateUser };
  } catch (error) {
    console.error('Error in getSubscribeUrl:', error);
    throw error; // Propagate the error to handle it at the caller's level
  }
}

export async function handleSubscriptionChange(subscription: Stripe.Subscription, lastEventDate: number): Promise<boolean> {
  try {
    const localSubscription = await getSubscriptionById(subscription.id);

    if (localSubscription?.lastEventDate > lastEventDate) {
      return true;
    }

    const stripeCustomerId = subscription.customer as string;
    const user = await getUserByStripeCustomerId(stripeCustomerId);

    const data = {
      userId: user.id,
      name: subscription.id,
      stripeId: subscription.id,
      stripeStatus: subscription.status,
      stripePriceId: subscription.items.data[0].price.id,
      quantity: subscription.description,
      trialEndsAt: subscription.trial_end,
      endsAt: subscription.ended_at,
      startDate: subscription.start_date,
      lastEventDate: lastEventDate
    } as unknown as ISubscription;

    await updateSubscription(data);
    await createGHLContact(user);
    return true;
  } catch (error) {
    console.error('Error in handleSubscriptionChange:', error);
    throw error; // Propagate the error to handle it at the caller's level!
  }
}

export async function handleProductPurchase(session: Stripe.Checkout.Session): Promise<boolean> {
  try {
    // Subscription checkouts are fulfilled by the customer.subscription.* events
    if (session.mode !== 'payment' || session.payment_status !== 'paid') {
      return true;
    }

    const email = session.customer_details?.email;
    if (!email) {
      console.error(`Product purchase session ${session.id} has no customer email`);
      return false;
    }

    const title = session.metadata?.productTitle || 'your purchase';
    const guidePath = session.metadata?.guidePath;
    const guideUrl = guidePath
      ? `${siteUrl}${guidePath}`
      : `${siteUrl}/products/overview`;

    // Record the purchase so it shows on the buyer's profile. Attached to
    // an account when the email matches one; otherwise claimed at login.
    // A DB failure should not block the fulfillment email.
    try {
      const user = await getUserByEmail(email);
      await recordPurchase({
        email: email,
        userId: user?.id ?? null,
        productSlug: session.metadata?.productSlug || 'unknown',
        productTitle: title,
        stripeSessionId: session.id,
        stripePriceId: session.metadata?.stripePriceId ?? null,
        amountTotal: session.amount_total ?? null,
        currency: session.currency ?? null,
      });
    } catch (error) {
      console.error(`Failed to record purchase for session ${session.id}:`, error);
    }

    const sent = await sendMail({
      to: email,
      subject: `${title}: here is your access link`,
      html: `
        <p>Thanks for buying <strong>${title}</strong>!</p>
        <p>Your complete guide lives here:</p>
        <p><a href="${guideUrl}">${guideUrl}</a></p>
        <p>Access is tied to this email address (${email}). Create an account with it,
        or log in if you already have one, and the guide unlocks automatically:</p>
        <p><a href="${siteUrl}/register">Create your account</a> ·
        <a href="${siteUrl}/login">Log in</a></p>
        <p>Keep this email so you can always find your way back. If you have any
        questions or run into trouble, just reply and I will help you out.</p>
        <p>Donavan Jones<br><a href="${siteUrl}">${siteUrl}</a></p>
      `,
    });

    if (!sent) {
      console.error(`Fulfillment email failed for session ${session.id} (${email})`);
    }
    return sent;
  } catch (error) {
    console.error('Error in handleProductPurchase:', error);
    throw error; // Propagate the error to handle it at the caller's level
  }
}

export async function handleSubscriptionCreate(subscription: Stripe.Subscription, lastEventDate: number): Promise<boolean> {
  try {
    const localSubscription = await getSubscriptionById(subscription.id);

    if (localSubscription?.lastEventDate > lastEventDate) {
      return true;
    }

    const stripeCustomerId = subscription.customer as string;
    const user = await getUserByStripeCustomerId(stripeCustomerId);

    const data = {
      userId: user.id,
      name: subscription.id,
      stripeId: subscription.id,
      stripeStatus: subscription.status,
      stripePriceId: subscription.items.data[0].price.id,
      quantity: subscription.description,
      trialEndsAt: subscription.trial_end,
      endsAt: subscription.ended_at,
      startDate: subscription.start_date,
      lastEventDate: lastEventDate
    } as unknown as ISubscription;

    await createSubscription(data);
    return true;
  } catch (error) {
    console.error('Error in handleSubscriptionCreate:', error);
    throw error; // Propagate the error to handle it at the caller's level
  }
}

export async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<boolean> {
  try {
    await markInvoiceStatus(invoice.id, 'paid', new Date())

    const localInvoice = await getInvoiceByStripeId(invoice.id)
    if (!localInvoice) return true

    const amount = `$${(invoice.amount_paid / 100).toFixed(2)}`
    await sendMail({
      to: 'donavanjones79@gmail.com',
      subject: `Invoice paid: ${localInvoice.clientName} — ${amount}`,
      html: `
        <p><strong>${localInvoice.clientName}</strong> (${localInvoice.clientEmail}) just paid invoice #${localInvoice.id} — ${amount}.</p>
        <p><a href="${localInvoice.hostedInvoiceUrl}">View on Stripe</a></p>
      `,
    })

    await sendMail({
      to: localInvoice.clientEmail,
      subject: `Thanks, ${localInvoice.clientName}! Got a minute for a quick review?`,
      html: `
        <p>Hi ${localInvoice.clientName},</p>
        <p>Thanks for the payment — it's much appreciated. If you have a minute, I'd love to hear
        how the project went. It really helps other clients know what to expect.</p>
        <p><a href="${siteUrl}/review/${localInvoice.reviewToken}">Leave a quick review</a></p>
        <p>Thanks,<br>Donavan Jones</p>
      `,
    })
    return true
  } catch (error) {
    console.error('Error in handleInvoicePaid:', error)
    throw error
  }
}

export async function handleInvoiceStatusChange(invoice: Stripe.Invoice, status: string): Promise<boolean> {
  try {
    await markInvoiceStatus(invoice.id, status)
    return true
  } catch (error) {
    console.error('Error in handleInvoiceStatusChange:', error)
    throw error
  }
}
