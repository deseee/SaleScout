import { Router } from 'express';
import {
  getSquareOrganizerStatus,
  initiateSquareOrganizerOnboarding,
  getConsignorSquarePayoutStatus,
  initiateConsignorSquareOnboarding,
  getHubOwnerSquareStatus,
  initiateHubOwnerSquareOnboarding,
  handleSquareConnectCallback,
} from '../controllers/squareConnectController';
import { authenticate } from '../middleware/auth';
import { paymentLimiter } from '../middleware/rateLimiter';

const router = Router();

// Mounted at /api/square-connect (index.ts). Mirrors routes/stripeConnect.ts's shape, plus
// the hub-owner routes that live in routes/organizers.ts for Stripe -- kept together here
// instead, since Square's shared OAuth callback (below) needs all four owner types in one
// place anyway and this avoids touching organizers.ts (a large, likely concurrently-edited
// file) for a purely-additive Square feature.

// Organizer's own onboarding (own sale-payout Square identity)
router.get('/organizer/status', authenticate, getSquareOrganizerStatus);
router.post('/organizer/onboard', authenticate, initiateSquareOrganizerOnboarding);

// Consignor onboarding
router.get('/consignor/:consignorId/status', authenticate, getConsignorSquarePayoutStatus);
router.post('/consignor/:consignorId/onboard', authenticate, initiateConsignorSquareOnboarding);

// Hub-owner onboarding (reuses the organizer's own Square identity -- ADR-090 SS1 equivalent)
router.get('/hub-owner/status', authenticate, getHubOwnerSquareStatus);
router.post('/hub-owner/onboard', authenticate, initiateHubOwnerSquareOnboarding);

// Shared OAuth callback for ALL owner types (organizer/consignor/hub-owner/vendor-booth --
// see squareConnectController.ts's module header for why this is centralized). Rate-limited
// the same class as a payment-adjacent action: it exchanges a real OAuth code and persists
// account identity, comparable in sensitivity to the existing payConsignor endpoint.
router.post('/callback', authenticate, paymentLimiter, handleSquareConnectCallback);

export default router;
