import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import twilio from 'twilio';
import { AuthRequest } from '../middleware/auth';
import { handleEarlyBirdBadge, handleExplorerBadge } from './userController';

const prisma = new PrismaClient();

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Start line for a sale
export const startLine = async (req: AuthRequest, res: Response) => {
  try {
    const { saleId } = req.params;
    const organizerId = req.user?.organizerProfile?.id;

    if (!saleId) {
      return res.status(400).json({ message: 'Sale ID is required' });
    }

    // Verify user is organizer of this sale
    const sale = await prisma.sale.findUnique({
      where: { id: saleId }
    });

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    if (sale.organizerId !== organizerId) {
      return res.status(403).json({ message: 'Not authorized to manage this sale' });
    }

    // Get all subscribers for this