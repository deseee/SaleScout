export const APP_CONFIG = {
  NAME: 'SaleScout',
  DESCRIPTION: 'Hyperlocal estate sale marketplace',
  URL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
  IMAGE: '/og-image.jpg',
  THEME_COLOR: '#3b82f6',
};

export const STRIPE_CONFIG = {
  CONNECT_ENDPOINT: '/api/stripe/connect',
  WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
};

export const TWILIO_CONFIG = {
  PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
};
