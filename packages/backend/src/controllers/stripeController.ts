import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import stripe from '../utils/stripe';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: any;
}

// Create a Stripe Connect account for an organizer
export const createConnectAccount = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'ORGANIZER') {
      return res.status(403).json({ message: 'Access denied. Organizer access required.' });
    }

    // Check if organizer already has a Stripe account
    const organizer = await prisma.organizer.findUnique({
      where: { userId: req.user.id }
    });

    if (!organizer) {
      return res.status(404).json({ message: 'Organizer profile not found' });
    }

    if (organizer.stripeConnectId) {
      // If they already have an account, return a new login link
      const loginLink = await stripe.accounts.createLoginLink(organizer.stripeConnectId);
      return res.json({ url: loginLink.url });
    }

    // Create a new Stripe Connect Express account
    const account = await stripe.accounts.create({
      type: 'express',
      email: req.user.email,
      business_type: 'individual',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Save the account ID to the organizer profile
    await prisma.organizer.update({
      where: { userId: req.user.id },
      data: { stripeConnectId: account.id }
    });

    // Create an account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.FRONTEND_URL}/organizer/dashboard`,
      return_url: `${process.env.FRONTEND_URL}/organizer/dashboard`,
      type: 'account_onboarding',
    });

    res.json({ url: accountLink.url });
  } catch (error) {
    console.error('Stripe Connect account creation error:', error);
    res.status(500).json({ message: 'Failed to create Stripe Connect account' });
  }
};

// Create a payment intent for purchasing an item
export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: 'Item ID is required' });
    }

    // Fetch the item and its sale/organizer details
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: {
        sale: {
          include: {
            organizer: true
          }
        }
      }
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (!item.sale.organizer.stripeConnectId) {
      return res.status(400).json({ message: 'Organizer has not set up payment processing' });
    }

    // Create a PaymentIntent with automatic confirmation
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round((item.price || item.auctionStartPrice || 0) * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        itemId: item.id,
        saleId: item.sale.id,
        userId: req.user.id
      },
      transfer_data: {
        destination: item.sale.organizer.stripeConnectId,
      },
    });

    // Create a pending purchase record
    const purchase = await prisma.purchase.create({
      data: {
        userId: req.user.id,
        itemId: item.id,
        saleId: item.sale.id,
        amount: item.price || item.auctionStartPrice || 0,
        stripePaymentIntentId: paymentIntent.id,
        status: 'PENDING'
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      purchaseId: purchase.id
    });
  } catch (error) {
    console.error('Payment Intent creation error:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
};

// Webhook handler for Stripe events
export const webhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret!);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Update purchase status to PAID
      await prisma.purchase.update({
        where: { stripePaymentIntentId: paymentIntent.id },
        data: { status: 'PAID' }
      });
      
      // Update item status to SOLD
      const metadata = paymentIntent.metadata;
      if (metadata.itemId) {
        await prisma.item.update({
          where: { id: metadata.itemId },
          data: { status: 'SOLD' }
        });
      }
      break;
    case 'payment_intent.payment_failed':
      const paymentFailedIntent = event.data.object;
      // Update purchase status to FAILED
      await prisma.purchase.update({
        where: { stripePaymentIntentId: paymentFailedIntent.id },
        data: { status: 'REFUNDED' }
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
