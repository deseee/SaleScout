import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import twilio from 'twilio';
import { 
  createLineEntries, 
  getNextInLine, 
  updateLineEntryStatus,
  getLineEntriesForSale
} from '../models/LineEntry';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: any;
}

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Start line for a sale
export const startLine = async (req: AuthRequest, res: Response) => {
  try {
    const { saleId } = req.params;
    const organizerId = req.user.organizerProfile?.id;

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

    // Create line entries for all subscribers
    const lineEntries = await createLineEntries(saleId);

    // Send SMS to each subscriber with their position
    const messages = [];
    for (const entry of lineEntries) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: entry.userId }
        });

        if (user?.phone) {
          const message = await twilioClient.messages.create({
            body: `You're in line for ${sale.title}. Your position is ${entry.position}. Reply STOP to unsubscribe.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: user.phone
          });
          messages.push({ userId: entry.userId, success: true, messageId: message.sid });
        }
      } catch (error) {
        console.error(`Failed to send SMS to user ${entry.userId}:`, error);
        messages.push({ userId: entry.userId, success: false, error: (error as Error).message });
      }
    }

    res.json({
      message: 'Line started successfully',
      lineEntries,
      messages
    });
  } catch (error) {
    console.error('Error starting line:', error);
    res.status(500).json({ message: 'Failed to start line' });
  }
};

// Call next person in line
export const callNext = async (req: AuthRequest, res: Response) => {
  try {
    const { saleId } = req.params;
    const organizerId = req.user.organizerProfile?.id;

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

    // Get next person in line
    const nextEntry = await getNextInLine(saleId);

    if (!nextEntry) {
      return res.status(404).json({ message: 'No one is waiting in line' });
    }

    // Update their status to CALLED
    const updatedEntry = await updateLineEntryStatus(nextEntry.id, 'CALLED');

    // Send SMS notification
    const user = await prisma.user.findUnique({
      where: { id: updatedEntry.userId }
    });

    if (user?.phone) {
      try {
        await twilioClient.messages.create({
          body: `You're next in line for ${sale.title}! Please proceed to the check-in desk.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: user.phone
        });
      } catch (error) {
        console.error(`Failed to send SMS to user ${updatedEntry.userId}:`, error);
      }
    }

    res.json({
      message: 'Next person called successfully',
      lineEntry: updatedEntry
    });
  } catch (error) {
    console.error('Error calling next person:', error);
    res.status(500).json({ message: 'Failed to call next person' });
  }
};

// Get line status
export const getLineStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { saleId } = req.params;
    const organizerId = req.user.organizerProfile?.id;

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
      return res.status(403).json({ message: 'Not authorized to view this sale' });
    }

    // Get all line entries for this sale
    const lineEntries = await getLineEntriesForSale(saleId);

    res.json(lineEntries);
  } catch (error) {
    console.error('Error getting line status:', error);
    res.status(500).json({ message: 'Failed to get line status' });
  }
};

// Mark person as served
export const markAsServed = async (req: AuthRequest, res: Response) => {
  try {
    const { lineEntryId } = req.params;
    const organizerId = req.user.organizerProfile?.id;

    if (!lineEntryId) {
      return res.status(400).json({ message: 'Line entry ID is required' });
    }

    // Get the line entry
    const lineEntry = await prisma.lineEntry.findUnique({
      where: { id: lineEntryId },
      include: { sale: true }
    });

    if (!lineEntry) {
      return res.status(404).json({ message: 'Line entry not found' });
    }

    // Verify user is organizer of this sale
    if (lineEntry.sale.organizerId !== organizerId) {
      return res.status(403).json({ message: 'Not authorized to manage this sale' });
    }

    // Update status to SERVED
    const updatedEntry = await updateLineEntryStatus(lineEntryId, 'SERVED');

    res.json({
      message: 'Person marked as served',
      lineEntry: updatedEntry
    });
  } catch (error) {
    console.error('Error marking as served:', error);
    res.status(500).json({ message: 'Failed to mark person as served' });
  }
};
