import { Request, Response } from 'express';
import { Parser } from 'csv-parse';
import { Readable } from 'stream';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: any;
}

// Helper function to convert string to number safely
const toNumber = (value: string | undefined | null): number | null => {
  if (!value) return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
};

// Bulk import items from CSV
export const importItemsFromCSV = async (req: AuthRequest, res: Response) => {
  try {
    const { saleId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!req.user || req.user.role !== 'ORGANIZER') {
      return res.status(403).json({ message: 'Access denied. Organizer access required.' });
    }

    // Check if sale exists and belongs to organizer
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: { organizer: true }
    });

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    if (sale.organizer.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. Not your sale.' });
    }

    // Parse CSV
    const records: any[] = [];
    const parser = Readable.from(file.buffer).pipe(
      Parser({
        columns: true,
        skip_empty_lines: true
      })
    );

    for await (const record of parser) {
      records.push(record);
    }

    // Validate and transform records
    const itemsToCreate = records.map(record => {
      // Validate required fields
      if (!record.title) {
        throw new Error('Missing required field: title');
      }

      return {
        saleId,
        title: record.title,
        description: record.description || '',
        price: toNumber(record.price),
        auctionStartPrice: toNumber(record.auctionStartPrice),
        bidIncrement: toNumber(record.bidIncrement),
        auctionEndTime: record.auctionEndTime ? new Date(record.auctionEndTime) : null,
        status: record.status || 'AVAILABLE',
        photoUrls: record.photoUrls ? record.photoUrls.split(',').map((url: string) => url.trim()) : []
      };
    });

    // Create items in database
    const createdItems = await prisma.item.createMany({
      data: itemsToCreate,
      skipDuplicates: false
    });

    res.json({
      message: `Successfully imported ${createdItems.count} items`,
      itemCount: createdItems.count
    });
  } catch (error: any) {
    console.error('CSV import error:', error);
    res.status(500).json({ 
      message: 'Failed to import items from CSV', 
      error: error.message 
    });
  }
};

// Other existing controller functions...
export const getItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        sale: {
          select: {
            title: true,
            id: true
          }
        }
      }
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ message: 'Server error while fetching item' });
  }
};

export const getItemsBySaleId = async (req: Request, res: Response) => {
  try {
    const { saleId } = req.query;
    const items = await prisma.item.findMany({
      where: { saleId: saleId as string },
      orderBy: { createdAt: 'desc' }
    });

    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Server error while fetching items' });
  }
};

export const createItem = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'ORGANIZER') {
      return res.status(403).json({ message: 'Access denied. Organizer access required.' });
    }

    const { saleId, title, description, price, auctionStartPrice, bidIncrement, auctionEndTime, status, photoUrls } = req.body;

    // Check if sale exists and belongs to organizer
    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
      include: { organizer: true }
    });

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    if (sale.organizer.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. Not your sale.' });
    }

    const item = await prisma.item.create({
      data: {
        saleId,
        title,
        description: description || '',
        price: price ? parseFloat(price) : null,
        auctionStartPrice: auctionStartPrice ? parseFloat(auctionStartPrice) : null,
        bidIncrement: bidIncrement ? parseFloat(bidIncrement) : null,
        auctionEndTime: auctionEndTime ? new Date(auctionEndTime) : null,
        status,
        photoUrls: photoUrls || []
      }
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Server error while creating item' });
  }
};

export const updateItem = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'ORGANIZER') {
      return res.status(403).json({ message: 'Access denied. Organizer access required.' });
    }

    const { id } = req.params;
    const { title, description, price, auctionStartPrice, bidIncrement, auctionEndTime, status, photoUrls } = req.body;

    // Check if item exists and belongs to organizer's sale
    const item = await prisma.item.findUnique({
      where: { id },
      include: { sale: { include: { organizer: true } } }
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.sale.organizer.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. Not your item.' });
    }

    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        title,
        description: description || '',
        price: price !== undefined ? (price ? parseFloat(price) : null) : undefined,
        auctionStartPrice: auctionStartPrice !== undefined ? (auctionStartPrice ? parseFloat(auctionStartPrice) : null) : undefined,
        bidIncrement: bidIncrement !== undefined ? (bidIncrement ? parseFloat(bidIncrement) : null) : undefined,
        auctionEndTime: auctionEndTime ? new Date(auctionEndTime) : null,
        status,
        photoUrls: photoUrls || undefined
      }
    });

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Server error while updating item' });
  }
};

export const deleteItem = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'ORGANIZER') {
      return res.status(403).json({ message: 'Access denied. Organizer access required.' });
    }

    const { id } = req.params;

    // Check if item exists and belongs to organizer's sale
    const item = await prisma.item.findUnique({
      where: { id },
      include: { sale: { include: { organizer: true } } }
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.sale.organizer.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. Not your item.' });
    }

    await prisma.item.delete({
      where: { id }
    });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Server error while deleting item' });
  }
};

export const placeBid = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { id } = req.params;
    const { amount } = req.body;

    // Validate bid amount
    const bidAmount = parseFloat(amount);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      return res.status(400).json({ message: 'Invalid bid amount' });
    }

    // Check if item exists and is part of an auction
    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (!item.auctionStartPrice) {
      return res.status(400).json({ message: 'Item is not part of an auction' });
    }

    // Check if auction has ended
    if (item.auctionEndTime && new Date() > item.auctionEndTime) {
      return res.status(400).json({ message: 'Auction has ended' });
    }

    // Check if bid meets minimum requirement
    const minBid = item.currentBid ? item.currentBid + (item.bidIncrement || 1) : item.auctionStartPrice;
    if (bidAmount < minBid) {
      return res.status(400).json({ 
        message: `Bid must be at least $${minBid.toFixed(2)}` 
      });
    }

    // Create bid record
    const bid = await prisma.bid.create({
      data: {
        itemId: id,
        userId: req.user.id,
        amount: bidAmount
      }
    });

    // Update item's current bid
    await prisma.item.update({
      where: { id },
      data: { currentBid: bidAmount }
    });

    res.status(201).json(bid);
  } catch (error) {
    console.error('Error placing bid:', error);
    res.status(500).json({ message: 'Server error while placing bid' });
  }
};
