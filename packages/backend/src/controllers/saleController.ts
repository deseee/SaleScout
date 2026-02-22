import { Request, Response } from 'express';
import { prisma } from '../index';
import { authenticate, AuthRequest } from '../middleware/auth';
import { body, validationResult, query, param } from 'express-validator';
import { Prisma } from '@prisma/client';

interface SaleQueryParams {
  city?: string;
  lat?: string;
  lng?: string;
  radius?: string;
  startDate?: string;
  endDate?: string;
  limit?: string;
  offset?: string;
}

class SaleController {
  // GET /api/sales - List sales with optional filters
  async listSales(req: Request, res: Response) {
    try {
      const {
        city,
        lat,
        lng,
        radius = '10',
        startDate,
        endDate,
        limit = '20',
        offset = '0'
      } = req.query as unknown as SaleQueryParams;

      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Build where conditions
      const where: Prisma.SaleWhereInput = {
        status: 'PUBLISHED'
      };

      // Filter by city
      if (city) {
        where.city = {
          contains: city,
          mode: 'insensitive'
        };
      }

      // Filter by date range
      if (startDate || endDate) {
        where.AND = [];
        
        if (startDate) {
          where.AND.push({
            endDate: {
              gte: new Date(startDate)
            }
          });
        }
        
        if (endDate) {
          where.AND.push({
            startDate: {
              lte: new Date(endDate)
            }
          });
        }
      }

      // Geospatial filtering
      if (lat && lng) {
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const radiusKm = parseFloat(radius);

        // Calculate bounding box
        const latDiff = (radiusKm / 111.2); // Approximate degrees per km
        const lngDiff = radiusKm / (111.2 * Math.cos(latitude * Math.PI / 180));

        where.lat = {
          gte: latitude - latDiff,
          lte: latitude + latDiff
        };

        where.lng = {
          gte: longitude - lngDiff,
          lte: longitude + lngDiff
        };
      }

      // Fetch sales
      const sales = await prisma.sale.findMany({
        where,
        orderBy: {
          startDate: 'asc'
        },
        skip: parseInt(offset),
        take: Math.min(parseInt(limit), 100), // Cap at 100
        include: {
          organizer: {
            select: {
              businessName: true,
              verified: true
            }
          }
        }
      });

      // Get total count for pagination
      const totalCount = await prisma.sale.count({ where });

      res.json({
        sales,
        pagination: {
          totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      console.error('Error fetching sales:', error);
      res.status(500).json({ error: 'Failed to fetch sales' });
    }
  }

  // GET /api/sales/:id - Get sale details
  async getSale(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const sale = await prisma.sale.findUnique({
        where: { id },
        include: {
          organizer: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          },
          items: {
            where: {
              deletedAt: null
            }
          },
          locations: true
        }
      });

      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }

      res.json(sale);
    } catch (error) {
      console.error('Error fetching sale:', error);
      res.status(500).json({ error: 'Failed to fetch sale' });
    }
  }

  // POST /api/sales - Create sale (organizer only)
  async createSale(req: AuthRequest, res: Response) {
    try {
      // Validate user is organizer
      if (!req.user || (req.user.role !== 'ORGANIZER' && req.user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Only organizers can create sales' });
      }

      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        title,
        description,
        startDate,
        endDate,
        startTime,
        endTime,
        address,
        city,
        state,
        zip,
        lat,
        lng,
        status = 'DRAFT'
      } = req.body;

      // Check if organizer exists
      const organizer = await prisma.organizer.findUnique({
        where: { userId: req.user.id }
      });

      if (!organizer) {
        return res.status(400).json({ error: 'Organizer profile not found' });
      }

      // Create sale
      const sale = await prisma.sale.create({
        data: {
          title,
          description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          startTime,
          endTime,
          address,
          city,
          state,
          zip,
          lat: lat ? parseFloat(lat) : null,
          lng: lng ? parseFloat(lng) : null,
          status,
          organizer: {
            connect: { id: organizer.id }
          }
        }
      });

      res.status(201).json(sale);
    } catch (error) {
      console.error('Error creating sale:', error);
      res.status(500).json({ error: 'Failed to create sale' });
    }
  }

  // PUT /api/sales/:id - Update sale (organizer only)
  async updateSale(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Validate user is organizer or admin
      if (!req.user || (req.user.role !== 'ORGANIZER' && req.user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Only organizers can update sales' });
      }

      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if sale exists and belongs to organizer
      const sale = await prisma.sale.findUnique({
        where: { id }
      });

      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }

      // For organizers, check ownership
      if (req.user.role === 'ORGANIZER') {
        const organizer = await prisma.organizer.findUnique({
          where: { userId: req.user.id }
        });

        if (!organizer || sale.organizerId !== organizer.id) {
          return res.status(403).json({ error: 'Not authorized to update this sale' });
        }
      }

      // Update sale
      const updatedSale = await prisma.sale.update({
        where: { id },
        data: req.body
      });

      res.json(updatedSale);
    } catch (error) {
      console.error('Error updating sale:', error);
      res.status(500).json({ error: 'Failed to update sale' });
    }
  }

  // DELETE /api/sales/:id - Delete sale (organizer/admin only)
  async deleteSale(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // Validate user is organizer or admin
      if (!req.user || (req.user.role !== 'ORGANIZER' && req.user.role !== 'ADMIN')) {
        return res.status(403).json({ error: 'Only organizers can delete sales' });
      }

      // Check if sale exists
      const sale = await prisma.sale.findUnique({
        where: { id }
      });

      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }

      // For organizers, check ownership
      if (req.user.role === 'ORGANIZER') {
        const organizer = await prisma.organizer.findUnique({
          where: { userId: req.user.id }
        });

        if (!organizer || sale.organizerId !== organizer.id) {
          return res.status(403).json({ error: 'Not authorized to delete this sale' });
        }
      }

      // Soft delete sale
      const deletedSale = await prisma.sale.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          status: 'CANCELLED'
        }
      });

      res.json({ message: 'Sale deleted successfully', sale: deletedSale });
    } catch (error) {
      console.error('Error deleting sale:', error);
      res.status(500).json({ error: 'Failed to delete sale' });
    }
  }

  // GET /api/sales/search - Search sales
  async searchSales(req: Request, res: Response) {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const sales = await prisma.sale.findMany({
        where: {
          AND: [
            { status: 'PUBLISHED' },
            {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { address: { contains: q, mode: 'insensitive' } },
                { city: { contains: q, mode: 'insensitive' } },
                { tags: { hasSome: [q] } }
              ]
            }
          ]
        },
        orderBy: {
          startDate: 'asc'
        },
        take: 20,
        include: {
          organizer: {
            select: {
              businessName: true,
              verified: true
            }
          }
        }
      });

      res.json(sales);
    } catch (error) {
      console.error('Error searching sales:', error);
      res.status(500).json({ error: 'Failed to search sales' });
    }
  }
}

export default new SaleController();
