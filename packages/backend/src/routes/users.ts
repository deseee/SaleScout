import { Router } from 'express';
import { getPurchases, getFavorites } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/purchases', authenticate, getPurchases);
router.get('/favorites', authenticate, getFavorites);

export default router;
