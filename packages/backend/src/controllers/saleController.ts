import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import QRCode from 'qrcode';
import { handleFavoriteBadge } from './userController';

const prisma = new PrismaClient();

// Extend Express Request type to include user property
interface AuthRequest extends Request {
  user?: any;
}

// Custom datetime validation to accept datetime-local format
const datetimeLocalSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Invalid datetime format');

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
  startDate: datetimeLocalSchema,
  endDate: datetimeLocalSchema,
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
  zip: z.string().min(5).max(10),
  lat: z.number(),
  lng: z.number(),
  photoUrls: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isAuctionSale: z.boolean().optional().default(false),
  earlyAccess: z.boolean().optional().default(false)
});

const saleUpdateSchema = saleCreateSchema.partial();

// Helper function to convert Decimal values to numbers recursively
const convertDecimalsToNumbers = (obj: any) => {
  if (!obj) return obj;
  
  const converted: any = {};
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === 'object' && 'toNumber' in obj[key]) {
      // Convert Decimal to number
      converted[key] = obj[key].toNumber();
    } else if (Array.isArray(obj[key])) {
      // Recursively process arrays
      converted[key] = obj[key].map((item: any) => 
        typeof item === 'object' ? convertDecimalsToNumbers(item) : item
      );
    } else if (obj[key] && typeof obj[key] === 'object') {
      // Recursively process nested objects
      converted[key] = convertDecimalsToNumbers(obj[key]);
    } else {
      converted[key] = obj[key];
    }
  }
  return converted;
};

export const listSales = async (req: Request, res: Response) => {
  try {
    // Validate query parameters
    const query = saleQuerySchema.parse(req.query);
    
    // Parse pagination
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const skip = (page - 1) *