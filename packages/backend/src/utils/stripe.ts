import Stripe from 'stripe';

let stripe: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (!stripe) {
    console.log('Initializing Stripe with key:', process.env.STRIPE_SECRET_KEY ? '✅ Key present' : '❌ Key missing');
    
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn('STRIPE_SECRET_KEY is not defined in environment variables');
    }
    
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_missing_key');
  }
  return stripe;
};

export default getStripe;
