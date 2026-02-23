import { Router } from 'express';
import { 
  listItems, 
  getItem, 
  createItem, 
  updateItem, 
  deleteItem
} from '../controllers/itemController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', listItems);
router.get('/:id', getItem);

// Protected routes
router.post('/', authenticate, createItem);
router.put('/:id', authenticate, updateItem);
router.delete('/:id', authenticate, deleteItem);

export default router;
