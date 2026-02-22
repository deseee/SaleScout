import { NextApiRequest, NextApiResponse } from 'next';
import { Sale } from '@salescout/shared/types';

// Mock data for demonstration
const mockSales: Sale[] = [
  {
    id: '1',
    title: 'Grand Rapids Estate Sale',
    description: 'Large estate sale with furniture, collectibles, and antiques',
    startDate: new Date('2023-10-15'),
    endDate: new Date('2023-10-15'),
    startTime: '08:00',
    endTime: '17:00',
    address: '123 Main St',
    city: 'Grand Rapids',
    state: 'MI',
    zipCode: '49503',
    lat: 42.9634,
    lng: -85.6681,
    organizerId: 'org1',
    status: 'published',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // In a real implementation, this would query the database
    res.status(200).json(mockSales);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
