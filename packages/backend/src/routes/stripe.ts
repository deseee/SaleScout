import { Router } from 'express';
import { 
  createConnectAccount,
  createPaymentIntent,
  webhookHandler
} from '../controllers/stripeController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Organizer routes
router.post('/create-connect-account', authenticate, createConnectAccount);

// Buyer routes
router.post('/create-payment-intent', authenticate, createPaymentIntent);

// Webhook
router.post('/webhook', webhookHandler);

export default router;
