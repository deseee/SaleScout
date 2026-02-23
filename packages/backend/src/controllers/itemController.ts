import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Extend Express Request type to include user property
interface AuthRequest extends Request {
  user?: any;
}

// Validation schemas
const itemQuerySchema = z.object({
  saleId: z.string().optional()
});

const itemCreateSchema = z.object({
  saleId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().optional(),
  auctionStartPrice: z.number().optional(),
  bidIncrement: z.number().optional(),
  auctionEndTime: z.string().datetime().optional(),
  photoUrls: z.array(z.string()).optional(),
  status: z.enum(['AVAILABLE', 'SOLD', 'RESERVED', 'AUCTION_ENDED']).optional().default('AVAILABLE')
});

const itemUpdateSchema = itemCreateSchema.partial();

export const listItems = async (req: Request, res: Response) => {
  try {
    const query = itemQuerySchema.parse(req.query);
    
    const items = await prisma.item.findMany({
      where: {
        saleId: query.saleId
      },
      include: {
        sale: {
          select: {
            title: true
          }
        }
      }
    });
    
    res.json(items);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching items' });
  }
};

export const getItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        sale: {
          select: {
            title: true,
            address: true,
            city: true,
            state: true,
            zip: true
          }
        },
        bids: {
          select: {
            amount: true,
            user: {
              select: {
                name: true
              }
            },
            createdAt: true
          },
          orderBy: {
            amount: 'desc'
          }
        }
      }
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching item' });
  }
};

export const createItem = async (req: AuthRequest, res: Response) => {
  try {
    // Verify user is organizer or admin
    if (!req.user || (req.user.role !== 'ORGANIZER' && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ message: 'Access denied. Organizer access required.' });
    }
    
    // Validate request body
    const itemData = itemCreateSchema.parse(req.body);
    
    // Check if sale exists and belongs to organizer (unless admin)
    const sale = await prisma.sale.findUnique({
      where: { id: itemData.saleId }
    });
    
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    if (req.user.role !== 'ADMIN') {
      const organizerProfile = await prisma.organizer.findUnique({
        where: { userId: req.user.id }
      });
      
      if (!organizerProfile || sale.organizerId !== organizerProfile.id) {
        return res.status(403).json({ message: 'Access denied. You can only create items for your own sales.' });
      }
    }
    
    const item = await prisma.item.create({
      data: itemData
    });
    
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error while creating item' });
  }
};

export const updateItem = async (req: AuthRequest, res: Response) => {
  try {
    // Verify user is organizer or admin
    if (!req.user || (req.user.role !== 'ORGANIZER' && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ message: 'Access denied. Organizer access required.' });
    }
    
    const { id } = req.params;
    
    // Validate request body
    const itemData = itemUpdateSchema.parse(req.body);
    
    // Check if item exists and belongs to organizer (unless admin)
    const existingItem = await prisma.item.findUnique({
      where: { id },
      include: {
        sale: true
      }
    });
    
    if (!existingItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (req.user.role !== 'ADMIN') {
      const organizerProfile = await prisma.organizer.findUnique({
        where: { userId: req.user.id }
      });
      
      if (!organizerProfile || existingItem.sale.organizerId !== organizerProfile.id) {
        return res.status(403).json({ message: 'Access denied. You can only update items from your own sales.' });
      }
    }
    
    const item = await prisma.item.update({
      where: { id },
      data: itemData
    });
    
    res.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error while updating item' });
  }
};

export const deleteItem = async (req: AuthRequest, res: Response) => {
  try {
    // Verify user is organizer or admin
    if (!req.user || (req.user.role !== 'ORGANIZER' && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ message: 'Access denied. Organizer/Admin access required.' });
    }
    
    const { id } = req.params;
    
    // Check if item exists and belongs to organizer (unless admin)
    const existingItem = await prisma.item.findUnique({
      where: { id },
      include: {
        sale: true
      }
    });
    
    if (!existingItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (req.user.role !== 'ADMIN') {
      const organizerProfile = await prisma.organizer.findUnique({
        where: { userId: req.user.id }
      });
      
      if (!organizerProfile || existingItem.sale.organizerId !== organizerProfile.id) {
        return res.status(403).json({ message: 'Access denied. You can only delete items from your own sales.' });
      }
    }
    
    // Delete related bids first (cascade delete)
    await prisma.bid.deleteMany({
      where: { itemId: id }
    });
    
    // Delete the item
    await prisma.item.delete({
      where: { id }
    });
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting item' });
  }
};
