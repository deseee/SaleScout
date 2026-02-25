import { Router, Request, Response } from 'express';
import { 
  getPurchases, 
  getFavorites, 
  getUserProfile,
  getLeaderboard
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { prisma } from '../index';

// Extend Express Request type
interface AuthRequest extends Request {
  user?: any;
}

const router = Router();

router.get('/purchases', authenticate, getPurchases);
router.get('/favorites', authenticate, getFavorites);
router.get('/me', authenticate, getUserProfile);
router.get('/leaderboard', getLeaderboard);

// New endpoints for profile enhancements
router.get('/me/bids', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const bids = await prisma.bid.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        item: {
          select: {
            title: true,
            photoUrls: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Add bid status logic here (WINNING, LOSING, etc.)
    const bidsWithStatus = bids.map((bid: any) => {
      // Simplified status logic - in a real app, you'd compare with current highest bid
      return {
        ...bid,
        status: 'PARTICIPATING' // Would be determined by comparing with other bids
      };
    });

    res.json(bidsWithStatus);
  } catch (error) {
    console.error('Error fetching user bids:', error);
    res.status(500).json({ message: 'Server error while fetching bids' });
  }
});

router.get('/me/referrals', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const referrals = await prisma.referral.findMany({
      where: {
        referrerId: req.user.id
      },
      include: {
        referredUser: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(referrals);
  } catch (error) {
    console.error('Error fetching user referrals:', error);
    res.status(500).json({ message: 'Server error while fetching referrals' });
  }
});

router.get('/me/points', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        userBadges: { include: { badge: true } }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      points: user.points,
      badges: user.userBadges.map(ub => ub.badge)
    });
  } catch (error) {
    console.error('Error fetching user points:', error);
    res.status(500).json({ message: 'Server error while fetching points' });
  }
});

include: { UserBadge: { include: { badge: true } } }

export default router;
