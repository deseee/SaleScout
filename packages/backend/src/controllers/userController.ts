import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: any;
}

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

export const getPurchases = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const purchases = await prisma.purchase.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        item: {
          select: {
            title: true,
            photoUrls: true,
          },
        },
        sale: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convert Decimal values to numbers
    const convertedPurchases = purchases.map(purchase => convertDecimalsToNumbers(purchase));
    
    res.json(convertedPurchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ message: 'Server error while fetching purchases' });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        sale: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
            city: true,
            state: true,
            photoUrls: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Server error while fetching favorites' });
  }
};
