import { Router } from 'express';
import { 
  createConnectAccount,
  createPaymentIntent,
  webhookHandler
} from '../controllers/stripeController';
import { getAccountStatus } from '../controllers/stripeStatusController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Organizer routes
router.post('/create-connect-account', authenticate, createConnectAccount);
router.get('/account-status', authenticate, getAccountStatus);

// Buyer routes
router.post('/create-payment-intent', authenticate, createPaymentIntent);

// Webhook
router.post('/webhook', webhookHandler);

export default router;
