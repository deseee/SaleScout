/**
 * POS Auth — shared organizer-or-team-member resolution for non-venue POS surfaces
 * (2026-08-01, Fix 1 of 2 dispatched this session).
 *
 * The venue-mode booth register already has a real TEAM_MEMBER auth surface
 * (middleware/requireBoothAuth.ts's requireBoothTokenOrTeamMember). The OLDER,
 * non-venue POS surface (terminalController.ts, posController.ts,
 * posPaymentController.ts, posTiersController.ts) never got the equivalent: each of
 * those files independently hand-rolled its own `resolveOrganizer` that required the
 * caller to personally hold the ORGANIZER role and have their own Organizer profile —
 * a TEAM_MEMBER with register access granted on their organizer's workspace (the exact
 * same grant staffService.grantRegisterAccess / requireBoothAuth.ts already recognize
 * for venue mode) got a flat 403 on every one of these endpoints instead.
 *
 * This file is the single source of truth those four duplicated resolvers now delegate
 * to. Resolution order:
 *   1. ORGANIZER role (unchanged logic — this is exactly what each of the three
 *      duplicated `resolveOrganizer` functions already did).
 *   2. TEAM_MEMBER fallback, mirroring requireBoothAuth.ts's TEAM_MEMBER branch: an
 *      accepted WorkspaceMember row with a linked TeamMember row resolves to that
 *      workspace's owning Organizer's data/Stripe account. Multiple accepted
 *      memberships resolve to the most-recently-accepted one — an acceptable default,
 *      not a real picker (Patrick flagged, not blocking).
 */

import { Response, RequestHandler } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../lib/prisma';
import { WorkspaceRole } from '@prisma/client';

export type ResolvedPosActor = {
  id: string; // Organizer.id — the RESOLVED organizer, not the caller
  // Organizer.userId — the User.id that OWNS the resolved Organizer. P0 fix (2026-08-16):
  // this used to be absent, and three separate HoldInvoice.create call sites papered over
  // the gap by writing `organizer.id` (an Organizer.id) into `HoldInvoice.organizerUserId`,
  // a column with a live FK to User(id) -- Postgres rejected every one with P2003 and the
  // HoldInvoice table stayed empty platform-wide. NEVER interchangeable with `id` above,
  // and NOT the same as `actingUserId` below: under the TEAM_MEMBER branch the caller
  // standing at the register is a different User from the organizer who owns the workspace.
  ownerUserId: string;
  stripeConnectId: string | null;
  subscriptionTier: string | null;
  referralDiscountExpiry: Date | null;
  // Square migration Wave 1 #3 (2026-09-07): additive fields so POS call sites can branch
  // on processor without a second round-trip. requireStripe below now means "require at
  // least one connected payment processor" -- see that check's own comment.
  squareOnboarded: boolean;
  squareMerchantId: string | null;
  squareLocationId: string | null;
  actorKind: 'ORGANIZER' | 'TEAM_MEMBER';
  actingUserId: string; // req.user.id — who is actually standing at the register
  teamMemberId?: string; // set only when actorKind === 'TEAM_MEMBER'
  // POS discount permission (2026-08-28): only set when actorKind === 'TEAM_MEMBER'.
  // ORGANIZER actors are never permission-gated on discounting their own sale, so these
  // are deliberately left undefined on that branch rather than populated with a
  // meaningless "owner always allowed" value -- callers should branch on actorKind first.
  workspaceId?: string;
  workspaceRole?: WorkspaceRole;
};

const NO_ACCESS_MESSAGE = 'Organizer access required';
// Square migration Wave 1 #3 (2026-09-07): message text is now processor-neutral since the
// gate below accepts EITHER a connected Stripe account OR a connected Square account, not
// Stripe specifically. Constant name kept as-is (STRIPE_NOT_CONNECTED_MESSAGE) to minimize
// diff noise across this file's few internal call sites -- content is what matters.
const STRIPE_NOT_CONNECTED_MESSAGE =
  'No payment account connected. Complete Stripe or Square onboarding in Settings before using POS.';

export async function resolveOrganizerOrTeamMember(
  req: AuthRequest,
  res: Response,
  opts: { requireStripe?: boolean } = {}
): Promise<ResolvedPosActor | null> {
  const { requireStripe = true } = opts;

  if (!req.user?.id) {
    res.status(403).json({ message: NO_ACCESS_MESSAGE });
    return null;
  }
  const actingUserId: string = req.user.id;

  // ── Branch 1: ORGANIZER role — the caller has their own Organizer profile. ────────
  const hasOrganizerRole = req.user.roles?.includes('ORGANIZER') || req.user.role === 'ORGANIZER';
  if (hasOrganizerRole) {
    const organizer = await prisma.organizer.findUnique({
      where: { userId: actingUserId },
      select: {
        id: true,
        userId: true,
        stripeConnectId: true,
        referralDiscountExpiry: true,
        subscriptionTier: true,
        squareOnboarded: true,
        squareMerchantId: true,
        squareLocationId: true,
      },
    });

    if (!organizer) {
      res.status(404).json({ message: 'Organizer profile not found' });
      return null;
    }

    // Square migration Wave 1 #3 (2026-09-07): a Square-onboarded-only organizer (no
    // Stripe account) must not be turned away here -- this check now requires EITHER
    // processor to be connected, never Stripe specifically. Individual money-moving call
    // sites (e.g. posPaymentController.createPaymentRequest) still enforce the SPECIFIC
    // processor the request actually asked for via stripePosPaymentAdapter/
    // squarePosPaymentAdapter's own live preflight checks further downstream.
    if (requireStripe && !organizer.stripeConnectId && !organizer.squareOnboarded) {
      res.status(400).json({ message: STRIPE_NOT_CONNECTED_MESSAGE });
      return null;
    }

    return {
      id: organizer.id,
      ownerUserId: organizer.userId,
      stripeConnectId: organizer.stripeConnectId,
      subscriptionTier: organizer.subscriptionTier,
      referralDiscountExpiry: organizer.referralDiscountExpiry,
      squareOnboarded: organizer.squareOnboarded,
      squareMerchantId: organizer.squareMerchantId,
      squareLocationId: organizer.squareLocationId,
      actorKind: 'ORGANIZER',
      actingUserId,
    };
  }

  // ── Branch 2: TEAM_MEMBER fallback, mirroring requireBoothAuth.ts's TEAM_MEMBER
  // branch pattern — an accepted WorkspaceMember with a linked TeamMember row resolves
  // to the workspace-owning Organizer.
  //
  // Deliberately queried by `userId` ONLY, NOT also by `organizerId`: an
  // `organizerId`-keyed WorkspaceMember row only ever exists for a caller who already
  // has their own Organizer profile (workspaceController.ts's owner-row creation and
  // its accepted-invite path each pick EXACTLY ONE of { organizerId } or { userId },
  // never both — see requireBoothAuth.ts's own comment on this identical fork). A
  // caller with an organizerId-keyed row would therefore already have matched the
  // ORGANIZER branch above and never reach here. Adding an `organizerId` arm to this
  // query would never match anything the ORGANIZER branch didn't already catch — this
  // omission is deliberate, not an oversight. Do not "fix" it back in.
  const member = await prisma.workspaceMember.findFirst({
    where: { userId: actingUserId, acceptedAt: { not: null }, teamMember: { isNot: null } },
    select: {
      workspaceId: true,
      role: true,
      workspace: {
        select: {
          owner: {
            select: {
              id: true,
              userId: true,
              stripeConnectId: true,
              referralDiscountExpiry: true,
              subscriptionTier: true,
              squareOnboarded: true,
              squareMerchantId: true,
              squareLocationId: true,
            },
          },
        },
      },
      teamMember: { select: { id: true } },
    },
    orderBy: { acceptedAt: 'desc' },
  });

  const organizer = member?.workspace?.owner;
  if (!member || !member.teamMember || !organizer) {
    res.status(403).json({ message: NO_ACCESS_MESSAGE });
    return null;
  }

  if (requireStripe && !organizer.stripeConnectId && !organizer.squareOnboarded) {
    res.status(400).json({ message: STRIPE_NOT_CONNECTED_MESSAGE });
    return null;
  }

  return {
    id: organizer.id,
    ownerUserId: organizer.userId,
    stripeConnectId: organizer.stripeConnectId,
    subscriptionTier: organizer.subscriptionTier,
    referralDiscountExpiry: organizer.referralDiscountExpiry,
    squareOnboarded: organizer.squareOnboarded,
    squareMerchantId: organizer.squareMerchantId,
    squareLocationId: organizer.squareLocationId,
    actorKind: 'TEAM_MEMBER',
    actingUserId,
    teamMemberId: member.teamMember.id,
    workspaceId: member.workspaceId,
    workspaceRole: member.role,
  };
}

/**
 * Express middleware for route-level gating — replaces `requireOrganizer` in
 * routes/pos.ts wherever that route also needs the TEAM_MEMBER fallback. Does not
 * require Stripe (requireStripe: false) — the individual controller call sites that
 * need Stripe already enforce that themselves via their own
 * resolveOrganizerOrTeamMember call.
 */
export const requireOrganizerOrTeamMember: RequestHandler = async (req, res, next) => {
  const actor = await resolveOrganizerOrTeamMember(req as AuthRequest, res, { requireStripe: false });
  if (!actor) return; // response already sent by resolveOrganizerOrTeamMember
  next();
};
