import { Router } from 'express';
import { createSquarePayment, createSquareCartPayment } from '../controllers/squarePaymentController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import { paymentLimiter } from '../middleware/rateLimiter';

// Square migration Wave 1 #1 (Checkout, 2026-09-07) -- new route file, does NOT touch
// routes/stripe.ts. Mounted at /api/square-payment in index.ts (separate mount point from
// /api/stripe -- the two processors never share a route prefix).
const router = Router();

// Guest checkout (parity with Stripe's create-payment-intent): optionalAuthenticate lets
// an unauthenticated shopper pay for one item. Cart checkout stays auth-required, same
// parity as Stripe's create-cart-checkout-session ("guest cart checkout is out of scope").
router.post('/create-payment', optionalAuthenticate, paymentLimiter, createSquarePayment);
router.post('/create-cart-payment', authenticate, paymentLimiter, createSquareCartPayment);

export default router;
