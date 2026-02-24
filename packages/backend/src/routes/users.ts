import { Router } from 'express';
import { getPurchases } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/purchases', authenticate, getPurchases);

export default router;
