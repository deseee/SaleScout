import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  subscribeToSale,
  unsubscribeFromSale,
  getUserSubscriptions,
  sendSMSUpdate
} from '../controllers/notificationController';

const router = express.Router();

// Subscription management
router.post('/subscribe', authenticateToken, subscribeToSale);
router.delete('/unsubscribe/:saleId', authenticateToken, unsubscribeFromSale);
router.get('/subscriptions', authenticateToken, getUserSubscriptions);

// SMS updates
router.post('/send-sms', authenticateToken, sendSMSUpdate);

export default router;
