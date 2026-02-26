import Stripe from 'stripe';

let stripe: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (!stripe) {
    console.log('Initializing Stripe with key:', process.env.STRIPE_SECRET_KEY ? '✅ Key present' : '❌ Key missing');
    
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn('STRIPE_SECRET_KEY is not defined in environment variables');
      // Use a mock/test key for development
      stripe = new Stripe('sk_test_PLACEHOLDER_KEY_FOR_DEV');
      return stripe;
    }
    
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

export default getStripe;
