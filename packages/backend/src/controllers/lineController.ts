import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import twilio from 'twilio';
import { AuthRequest } from '../middleware/auth';

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

    // Get all subscribers for this sale
    const subscribers = await prisma.saleSubscriber.findMany({
      where: { 
        saleId,
        phone: { not: null }
      },
      include: { user: true }
    });

    // Create line entries for each subscriber
    const lineEntries = [];
    for (let i = 0; i < subscribers.length; i++) {
      const subscriber = subscribers[i];
      
      // Skip if already in line
      const existingEntry = await prisma.lineEntry.findUnique({
        where: {
          saleId_userId: {
            saleId,
            userId: subscriber.userId || ''
          }
        }
      });
      
      if (existingEntry) continue;
      
      const entry = await prisma.lineEntry.create({
        data: {
          saleId,
          userId: subscriber.userId || '',
          position: i + 1,
          status: 'WAITING'
        }
      });
      
      lineEntries.push(entry);
      
      // Send SMS notification
      try {
        const phoneNumber = subscriber.phone || (subscriber.user?.phone ?? '');
        if (phoneNumber) {
          await twilioClient.messages.create({
            body: `You're in line for ${sale.title}. Your position is ${entry.position}. Reply STOP to unsubscribe.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
          });
        }
      } catch (error) {
        console.error(`Failed to send SMS to ${subscriber.phone}:`, error);
      }
    }

    res.json({
      message: 'Line started successfully',
      lineEntries
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

    // Get next person in line
    const nextEntry = await prisma.lineEntry.findFirst({
      where: {
        saleId,
        status: 'WAITING'
      },
      orderBy: {
        position: 'asc'
      },
      include: {
        user: true
      }
    });

    if (!nextEntry) {
      return res.status(404).json({ message: 'No one is waiting in line' });
    }

    // Update their status to NOTIFIED
    const updatedEntry = await prisma.lineEntry.update({
      where: { id: nextEntry.id },
      data: { 
        status: 'NOTIFIED',
        notifiedAt: new Date()
      }
    });

    // Send SMS notification
    try {
      const user = await prisma.user.findUnique({
        where: { id: updatedEntry.userId }
      });

      if (user?.phone) {
        await twilioClient.messages.create({
          body: `You're next in line for ${sale.title}! Please proceed to the check-in desk.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: user.phone
        });
      }
    } catch (error) {
      console.error(`Failed to send SMS to user ${updatedEntry.userId}:`, error);
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
      return res.status(403).json({ message: 'Not authorized to view this sale' });
    }

    // Get all line entries for this sale
    const lineEntries = await prisma.lineEntry.findMany({
      where: { saleId },
      include: { 
        user: {
          select: {
            name: true,
            phone: true
          }
        }
      },
      orderBy: { position: 'asc' }
    });

    res.json(lineEntries);
  } catch (error) {
    console.error('Error getting line status:', error);
    res.status(500).json({ message: 'Failed to get line status' });
  }
};

// Mark person as entered
export const markAsEntered = async (req: AuthRequest, res: Response) => {
  try {
    const { lineEntryId } = req.params;
    const organizerId = req.user?.organizerProfile?.id;

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

    // Update status to ENTERED
    const updatedEntry = await prisma.lineEntry.update({
      where: { id: lineEntryId },
      data: { 
        status: 'ENTERED',
        enteredAt: new Date()
      }
    });

    res.json({
      message: 'Person marked as entered',
      lineEntry: updatedEntry
    });
  } catch (error) {
    console.error('Error marking as entered:', error);
    res.status(500).json({ message: 'Failed to mark person as entered' });
  }
};
