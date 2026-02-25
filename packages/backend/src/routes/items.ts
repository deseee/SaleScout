import { Router } from 'express';
import multer from 'multer';
import { 
  getItemById, 
  getItemsBySaleId, 
  createItem, 
  updateItem, 
  deleteItem, 
  placeBid,
  importItemsFromCSV
} from '../controllers/itemController';
import { authenticate } from '../middleware/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/:id', getItemById);
router.get('/', getItemsBySaleId);
router.post('/', authenticate, createItem);
router.put('/:id', authenticate, updateItem);
router.delete('/:id', authenticate, deleteItem);
router.post('/:id/bid', authenticate, placeBid);

// CSV import endpoint
router.post('/:saleId/import-items', authenticate, upload.single('csv'), importItemsFromCSV);

export default router;
