import { Request, Response } from 'express';
import { PrismaClient, Bid } from '@prisma/client';
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

// Custom datetime validation to accept datetime-local format
const datetimeLocalSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Invalid datetime format');

const itemCreateSchema = z.object({
  saleId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().optional(),
  auctionStartPrice: z.number().optional(),
  bidIncrement: z.number().optional(),
  auctionEndTime: datetimeLocalSchema.optional(),
  photoUrls: z.array(z.string()).optional(),
  status: z.enum(['AVAILABLE', 'SOLD', 'RESERVED', 'AUCTION_ENDED']).optional().default('AVAILABLE')
});

const itemUpdateSchema = itemCreateSchema.partial();

const bidCreateSchema = z.object({
  itemId: z.string(),
  amount: z.number().positive()
});

// Helper function to convert Decimal values to numbers recursively
const convertDecimalsToNumbers = (obj: any) => {
  if (!obj) return obj;
  
  const converted: any = {};
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === 'object' && 'toNumber' in obj[key]) {
      converted[key] = obj[key].toNumber();
    } else if (Array.isArray(obj[key])) {
      converted[key] = obj[key].map((item: any) => 
        typeof item === 'object' ? convertDecimalsToNumbers(item) : item
      );
    } else if (obj[key] && typeof obj[key] === 'object') {
      converted[key] = convertDecimalsToNumbers(obj[key]);
    } else {
      converted[key] = obj[key];
    }
  }
  return converted;
};

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
    
    // Convert Decimal values to numbers
    const convertedItems = items.map(item => convertDecimalsToNumbers(item));
    
    res.json(convertedItems);
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
            id: true,
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
    
    // Convert Decimal values to numbers (recursively handles nested objects)
    const convertedItem = convertDecimalsToNumbers(item);
    
    res.json(convertedItem);
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
    
    // Convert Decimal values to numbers
    const convertedItem = convertDecimalsToNumbers(item);
    
    res.status(201).json(convertedItem);
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
    
    // Convert Decimal values to numbers
    const convertedItem = convertDecimalsToNumbers(item);
    
    res.json(convertedItem);
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

// Place a bid on an item
export const placeBid = async (req: AuthRequest, res: Response) => {
  try {
    // Verify user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { id } = req.params;
    const { amount } = req.body;

    // Validate request body
    const bidData = bidCreateSchema.parse({ itemId: id, amount });

    // Check if item exists and is an auction item
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        bids: {
          orderBy: {
            amount: 'desc'
          },
          take: 1
        }
      }
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (!item.auctionStartPrice) {
      return res.status(400).json({ message: 'This item is not an auction item' });
    }

    if (item.status === 'AUCTION_ENDED' || item.status === 'SOLD') {
      return res.status(400).json({ message: 'Auction has ended for this item' });
    }

    // Check if auction has ended
    if (item.auctionEndTime && new Date() > new Date(item.auctionEndTime)) {
      return res.status(400).json({ message: 'Auction has already ended' });
    }

    // Calculate minimum bid amount using Decimal's plus method
    let minBidAmount;
    if (item.bids.length > 0) {
      // item.bids[0].amount is Decimal, use .plus() instead of +
      minBidAmount = item.bids[0].amount.plus(item.bidIncrement || 1);
    } else {
      minBidAmount = item.auctionStartPrice;
    }

    // Convert amount to number for comparison (minBidAmount is Decimal)
    const amountNumber = Number(amount);
    const minBidNumber = minBidAmount.toNumber();

    if (amountNumber < minBidNumber) {
      return res.status(400).json({ 
        message: `Bid amount must be at least $${minBidNumber.toFixed(2)}`,
        minBidAmount: minBidNumber
      });
    }

    // Create the bid
    const bid = await prisma.bid.create({
      data: {
        itemId: id,
        userId: req.user.id,
        amount: bidData.amount
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });

    // Convert Decimal values to numbers
    const convertedBid = convertDecimalsToNumbers(bid);
    
    res.status(201).json(convertedBid);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error while placing bid' });
  }
};

// Get bids for an item
export const getItemBids = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if item exists
    const item = await prisma.item.findUnique({
      where: { id }
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Get all bids for this item ordered by amount descending
    const bids = await prisma.bid.findMany({
      where: { itemId: id },
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        amount: 'desc'
      }
    });

    // Convert Decimal values to numbers
    const convertedBids = bids.map((bid: Bid) => convertDecimalsToNumbers(bid));
    
    res.json(convertedBids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching bids' });
  }
};
