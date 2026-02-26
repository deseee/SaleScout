import Stripe from 'stripe';

let stripe: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (!stripe) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    console.log('Initializing Stripe with key:', stripeKey ? '✅ Key present' : '❌ Key missing');
    
    if (!stripeKey) {
      console.warn('STRIPE_SECRET_KEY is not defined in environment variables');
      // Use a mock/test key for development
      stripe = new Stripe('sk_test_PLACEHOLDER_KEY_FOR_DEV');
      return stripe;
    }
    
    stripe = new Stripe(stripeKey);
  }
  return stripe;
};

export default getStripe;
