import { Request, Response } from 'express';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';
import { validationResult, query, param } from 'express-validator';
import { Prisma } from '@prisma/client';

interface ItemQueryParams {
  saleId?: string;
  limit?: string;
  offset?: string;
}

class ItemController {
  // GET /api/items - List items for a sale
  async listItems(req: Request, res: Response) {
    try {
      const { saleId, limit = '50', offset = '0' } = req.query as unknown as ItemQueryParams;

      if (!saleId) {
        return res.status(400).json({ error: 'saleId is required' });
      }

      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const items = await prisma.item.findMany({
        where: {
          saleId,
          deletedAt: null
        },
        orderBy: {
          createdAt: 'asc'
        },
        skip: parseInt(offset),
        take: Math.min(parseInt(limit), 100),
        include: {
          category: true
        }
      });

      res.json(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ error: 'Failed to fetch items' });
    }
  }

  // GET /api/items/:id - Get item details
  async getItem(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const item = await prisma.item.findUnique({
        where: {
          id,
          deletedAt: null
        },
        include: {
          sale: {
            select: {
              title: true,
              organizer: {
                select: {
                  businessName: true
                }
              }
            }
          },
          category: true
        }
      });

      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }

      res.json(item);
    } catch (error) {
      console.error('Error fetching item:', error);
      res.status(500).json({ error: 'Failed to fetch item' });
    }
  }

  // POST /api/items - Create item (organizer only)
  async createItem(req: AuthRequest, res: Response) {
    try {
      // Validate user is organizer
      if (!req.user || (req.user.role !== 'ORGANIZER' && req.user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Only organizers can create items' });
      }

      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        saleId,
        name,
        description,
        price,
        estimatedValue,
        isFeatured,
        isAuctionItem,
        minBid,
        bidIncrement,
        categoryId,
        condition,
        brand,
        imageUrls
      } = req.body;

      // Check if sale exists and belongs to organizer
      const sale = await prisma.sale.findUnique({
        where: { id: saleId }
      });

      if (!sale) {
        return res.status(400).json({ error: 'Sale not found' });
      }

      if (req.user.role === 'ORGANIZER') {
        const organizer = await prisma.organizer.findUnique({
          where: { userId: req.user.id }
        });

        if (!organizer || sale.organizerId !== organizer.id) {
          return res.status(403).json({ error: 'Not authorized to add items to this sale' });
        }
      }

      // Create item
      const item = await prisma.item.create({
        data: {
          saleId,
          name,
          description,
          price: price ? parseFloat(price) : null,
          estimatedValue: estimatedValue ? parseFloat(estimatedValue) : null,
          isFeatured: Boolean(isFeatured),
          isAuctionItem: Boolean(isAuctionItem),
          minBid: minBid ? parseFloat(minBid) : null,
          bidIncrement: bidIncrement ? parseFloat(bidIncrement) : null,
          categoryId,
          condition,
          brand,
          imageUrls: imageUrls || []
        }
      });

      res.status(201).json(item);
    } catch (error) {
      console.error('Error creating item:', error);
      res.status(500).json({ error: 'Failed to create item' });
    }
  }

  // PUT /api/items/:id - Update item (organizer only)
  async updateItem(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Validate user is organizer or admin
      if (!req.user || (req.user.role !== 'ORGANIZER' && req.user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Only organizers can update items' });
      }

      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if item exists
      const item = await prisma.item.findUnique({
        where: { id }
      });

      if (!item) {
        return res.status(404).