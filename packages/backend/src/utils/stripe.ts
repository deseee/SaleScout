import Stripe from 'stripe';

console.log('Initializing Stripe with key:', process.env.STRIPE_SECRET_KEY ? '✅ Key present' : '❌ Key missing');

// Check if STRIPE_SECRET_KEY is defined
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not defined in environment variables');
  // In production, you might want to throw an error instead:
  // throw new Error('STRIPE_SECRET_KEY must be defined in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_missing_key');

export default stripe;
