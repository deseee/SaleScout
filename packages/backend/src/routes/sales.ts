import { Router } from 'express';
import { 
  listSales, 
  getSale, 
  createSale, 
  updateSale, 
  deleteSale,
  searchSales
} from '../controllers/saleController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', listSales);
router.get('/search', searchSales);
router.get('/:id', getSale);

// Protected routes
router.post('/', authenticate, createSale);
router.put('/:id', authenticate, updateSale);
router.delete('/:id', authenticate, deleteSale);

export default router;
