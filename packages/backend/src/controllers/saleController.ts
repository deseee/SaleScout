import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const saleQuerySchema = z.object({
  city: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  radius: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10')
});

const saleCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
  zip: z.string().min(5).max(10),
  lat: z.number(),
  lng: z.number(),
  photoUrls: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isAuctionSale: z.boolean().optional().default(false)
});

const saleUpdateSchema = saleCreateSchema.partial();

export const listSales = async (req: Request, res: Response) => {
  try {
    // Validate query parameters
    const query = saleQuerySchema.parse(req.query);
    
    // Parse pagination
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const skip = (page - 1) * limit;
    
    // Build where conditions
    const where: any = {};
    
    if (query.city) {
      where.city = {
        contains: query.city,
        mode: 'insensitive'
      };
    }
    
    if (query.startDate || query.endDate) {
      where.startDate = {};
      if (query.startDate) {
        where.startDate.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        where.startDate.lte = new Date(query.endDate);
      }
    }
    
    // Geospatial filtering (bounding box approach)
    if (query.lat && query.lng && query.radius) {
      const lat = parseFloat(query.lat);
      const lng = parseFloat(query.lng);
      const radius = parseFloat(query.radius); // in kilometers
      
      // Approximate degrees per kilometer
      const latDelta = radius / 111; // 1 degree latitude ≈ 111 km
      const lngDelta = radius / (111 * Math.cos(lat * Math.PI / 180)); // Adjust for longitude
      
      where.lat = {
        gte: lat - latDelta,
        lte: lat + latDelta
      };
      
      where.lng = {
        gte: lng - lngDelta,
        lte: lng + lngDelta
      };
    }
    
    // Fetch sales
    const sales = await prisma.sale.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        startDate: 'asc'
      },
      include: {
        organizer: {
          select: {
            businessName: true,
            phone: true
          }
        }
      }
    });
    
    // Get total count for pagination
    const total = await prisma.sale.count({ where });
    
    res.json({
      sales,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching sales' });
  }
};

export const getSale = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            businessName: true,
            phone: true,
            address: true
          }
        },
        items: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            auctionStartPrice: true,
            currentBid: true,
            status: true,
            photoUrls: true
          }
        }
      }
    });
    
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    res.json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching sale' });
  }
};

export const createSale = async (req: Request, res: Response) => {
  try {
    // Verify user is organizer or admin
    if (!req.user || (req.user.role !== 'ORGANIZER' && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ message: 'Access denied. Organizer access required.' });
    }
    
    // Validate request body
    const saleData = saleCreateSchema.parse(req.body);
    
    // For organizers, set organizerId to their profile
    let organizerId = req.user.organizerProfile?.id;
    if (!organizerId && req.user.role === 'ADMIN') {
      // Admin can create sale for any organizer (optional field)
      organizerId = req.body.organizerId;
    } else if (!organizerId && req.user.role === 'ORGANIZER') {
      // Get organizer profile for this user
      const organizerProfile = await prisma.organizer.findUnique({
        where: { userId: req.user.id }
      });
      
      if (!organizerProfile) {
        return res.status(400).json({ message: 'Organizer profile not found' });
      }
      
      organizerId = organizerProfile.id;
    }
    
    const sale = await prisma.sale.create({
      data: {
        ...saleData,
        organizerId,
        status: 'DRAFT' // Default to draft
      }
    });
    
    res.status(201).json(sale);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error while creating sale' });
  }
};

export const updateSale = async (req: Request, res: Response) => {
  try {
    // Verify user is organizer or admin
    if (!req.user || (req.user.role !== 'ORGANIZER' && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ message: 'Access denied. Organizer access required.' });
    }
    
    const { id } = req.params;
    
    // Validate request body
    const saleData = saleUpdateSchema.parse(req.body);
    
    // Check if sale exists and belongs to organizer (unless admin)
    const existingSale = await prisma.sale.findUnique({
      where: { id }
    });
    
    if (!existingSale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    if (req.user.role !== 'ADMIN') {
      const organizerProfile = await prisma.organizer.findUnique({
        where: { userId: req.user.id }
      });
      
      if (!organizerProfile || existingSale.organizerId !== organizerProfile.id) {
        return res.status(403).json({ message: 'Access denied. You can only update your own sales.' });
      }
    }
    
    const sale = await prisma.sale.update({
      where: { id },
      data: saleData
    });
    
    res.json(sale);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error while updating sale' });
  }
};

export const deleteSale = async (req: Request, res: Response) => {
  try {
    // Verify user is organizer or admin
    if (!req.user || (req.user.role !== 'ORGANIZER' && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ message: 'Access denied. Organizer/Admin access required.' });
    }
    
    const { id } = req.params;
    
    // Check if sale exists and belongs to organizer (unless admin)
    const existingSale = await prisma.sale.findUnique({
      where: { id }
    });
    
    if (!existingSale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    
    if (req.user.role !== 'ADMIN') {
      const organizerProfile = await prisma.organizer.findUnique({
        where: { userId: req.user.id }
      });
      
      if (!organizerProfile || existingSale.organizerId !== organizerProfile.id) {
        return res.status(403).json({ message: 'Access denied. You can only delete your own sales.' });
      }
    }
    
    // Delete related items first (cascade delete)
    await prisma.item.deleteMany({
      where: { saleId: id }
    });
    
    // Delete the sale
    await prisma.sale.delete({
      where: { id }
    });
    
    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting sale' });
  }
};

export const searchSales = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const sales = await prisma.sale.findMany({
      where: {
        OR: [
          {
            title: {
              contains: q,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: q,
              mode: 'insensitive'
            }
          },
          {
            tags: {
              hasSome: [q]
            }
          }
        ]
      },
      include: {
        organizer: {
          select: {
            businessName: true
          }
        }
      },
      take: 20
    });
    
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while searching sales' });
  }
};
