import Stripe from 'stripe';

console.log('Initializing Stripe with key:', process.env.STRIPE_SECRET_KEY ? '✅ Key present' : '❌ Key missing');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export default stripe;
