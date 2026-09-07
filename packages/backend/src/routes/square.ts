import { Router } from 'express';
import { handleSquareWebhook } from '../controllers/squareWebhookController';

const router = Router();

// Webhook (no auth -- signature verified in controller via Square's own WebhooksHelper)
// NOTE: Raw body middleware must be applied in index.ts BEFORE the JSON parser for this
// route (mirrors routes/billing.ts's /webhook and routes/stripe.ts's /webhook).
router.post('/webhook', handleSquareWebhook);

export default router;
