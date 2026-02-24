import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const endAuctions = async () => {
  try {
    console.log('Running auction end job...');
    
    // Find auction items that have ended but haven't been processed yet
    const endedAuctions = await prisma.item.findMany({
      where: {
        AND: [
          { auctionEndTime: { not: null } },
          { auctionEndTime: { lt: new Date() } },
          { status: 'AVAILABLE' } // Only process items that are still available
        ]
      }
    });

    console.log(`Found ${endedAuctions.length} auctions to process`);

    for (const item of endedAuctions) {
      // Get the highest bid for this item
      const highestBid = await prisma.bid.findFirst({
        where: { itemId: item.id },
        orderBy: { amount: 'desc' }
      });

      if (highestBid) {
        // Mark item as sold to the highest bidder
        await prisma.item.update({
          where: { id: item.id },
          data: {
            status: 'SOLD',
            currentBid: highestBid.amount
          }
        });

        // Create a purchase record for the winning bid
        await prisma.purchase.create({
          data: {
            userId: highestBid.userId,
            itemId: item.id,
            amount: highestBid.amount,
            status: 'PAID'
          }
        });

        console.log(`Auction ended for item ${item.id}. Sold to user ${highestBid.userId} for $${highestBid.amount}`);
      } else {
        // No bids, mark auction as ended
        await prisma.item.update({
          where: { id: item.id },
          data: { status: 'AUCTION_ENDED' }
        });

        console.log(`Auction ended for item ${item.id} with no bids`);
      }
    }
  } catch (error) {
    console.error('Error in auction end job:', error);
  }
};
