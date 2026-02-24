import { Router } from 'express';
import { 
  listItems, 
  getItem, 
  createItem, 
  updateItem, 
  deleteItem,
  placeBid,
  getItemBids
} from '../controllers/itemController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', listItems);
router.get('/:id', getItem);
router.get('/:id/bids', getItemBids);

// Protected routes
router.post('/', authenticate, createItem);
router.put('/:id', authenticate, updateItem);
router.delete('/:id', authenticate, deleteItem);
router.post('/:id/bid', authenticate, placeBid);

export default router;
