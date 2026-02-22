import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@salescout.app',
      name: 'Admin User',
      role: 'ADMIN',
      points: 1000,
    },
  });

  // Create organizer 1
  const organizer1User = await prisma.user.create({
    data: {
      email: 'organizer1@example.com',
      name: 'Grand Rapids Estate Sales',
      role: 'ORGANIZER',
      points: 500,
    },
  });

  const organizer1 = await prisma.organizer.create({
    data: {
      userId: organizer1User.id,
      businessName: 'Grand Rapids Estate Sales',
      phone: '(616) 555-0123',
      address: '123 Main St, Grand Rapids, MI 49503',
    },
  });

  // Create organizer 2
  const organizer2User = await prisma.user.create({
    data: {
      email: 'organizer2@example.com',
      name: 'Michigan Vintage Finds',
      role: 'ORGANIZER',
      points: 300,
    },
  });

  const organizer2 = await prisma.organizer.create({
    data: {
      userId: organizer2User.id,
      businessName: 'Michigan Vintage Finds',
      phone: '(616) 555-0156',
      address: '456 Lake Ave, Grand Rapids, MI 49504',
    },
  });

  // Create sample sales for organizer 1
  const sale1 = await prisma.sale.create({
    data: {
      organizerId: organizer1.id,
      title: 'Downtown Furniture & Collectibles Estate Sale',
      description: 'Complete household liquidation including vintage furniture, collectibles, tools, and more.',
      startDate: new Date('2023-08-12T08:00:00'),
      endDate: new Date('2023-08-12T17:00:00'),
      address: '789 Market St',
      city: 'Grand Rapids',
      state: 'MI',
      zip: '49503',
      lat: 42.9634,
      lng: -85.6681,
      status: 'PUBLISHED',
      photoUrls: [
        'https://images.unsplash.com/photo-1526159200504-05c56c0794d5',
        'https://images.unsplash.com/photo-1505693350532-0fb32fba046d',
      ],
      tags: ['vintage', 'furniture', 'collectibles'],
    },
  });

  const item1 = await prisma.item.create({
    data: {
      saleId: sale1.id,
      title: 'Mid-Century Modern Dining Table',
      description: 'Beautiful teak dining table from the 1960s, seats 6',
      price: 450.00,
      status: 'AVAILABLE',
      photoUrls: ['https://images.unsplash.com/photo-1526159200504-05c56c0794d5'],
    },
  });

  const item2 = await prisma.item.create({
    data: {
      saleId: sale1.id,
      title: 'Antique Oak Secretary Desk',
      description: 'Handcrafted oak desk with intricate detailing, circa 1890s',
      price: 325.00,
      status: 'AVAILABLE',
      photoUrls: ['https://images.unsplash.com/photo-1505693350532-0fb32fba046d'],
    },
  });

  // Create sample sales for organizer 2
  const sale2 = await prisma.sale.create({
    data: {
      organizerId: organizer2.id,
      title: 'Vintage Tools & Garden Equipment',
      description: 'Collection of vintage tools, garden equipment, and workshop items',
      startDate: new Date('2023-08-19T09:00:00'),
      endDate: new Date('2023-08-19T16:00:00'),
      address: '101 Bridge St',
      city: 'Grand Rapids',
      state: 'MI',
      zip: '49504',
      lat: 42.9572,
      lng: -85.6681,
      status: 'PUBLISHED',
      photoUrls: [
        'https://images.unsplash.com/photo-1590086390144-f60d5437a0f3',
        'https://images.unsplash.com/photo-1590086390144-f60d5437a0f3',
      ],
      tags: ['tools', 'vintage', 'garden'],
      isAuctionSale: true,
    },
  });

  const item3 = await prisma.item.create({
    data: {
      saleId: sale2.id,
      title: 'Vintage Stanley Plane Set',
      description: 'Complete set of 5 Stanley hand planes, excellent condition',
      auctionStartPrice: 75.00,
      currentBid: 85.00,
      bidIncrement: 5.00,
      auctionEndTime: new Date('2023-08-19T15:00:00'),
      status: 'AVAILABLE',
      photoUrls: ['https://images.unsplash.com/photo-1590086390144-f60d5437a0f3'],
    },
  });

  // Create regular users
  const user1 = await prisma.user.create({
    data: {
      email: 'shopper1@example.com',
      name: 'Alex Johnson',
      role: 'USER',
      points: 150,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'shopper2@example.com',
      name: 'Taylor Smith',
      role: 'USER',
      points: 75,
    },
  });

  // Create some bids
  await prisma.bid.create({
    data: {
      itemId: item3.id,
      userId: user1.id,
      amount: 85.00,
    },
  });

  // Create some purchases
  await prisma.purchase.create({
    data: {
      userId: user2.id,
      itemId: item1.id,
      amount: 450.00,
      status: 'PAID',
      stripePaymentIntentId: 'pi_123456789',
    },
  });

  // Create some favorites
  await prisma.favorite.create({
    data: {
      userId: user1.id,
      saleId: sale1.id,
    },
  });

  await prisma.favorite.create({
    data: {
      userId: user2.id,
      itemId: item2.id,
    },
  });

  // Create some reviews
  await prisma.review.create({
    data: {
      userId: user1.id,
      saleId: sale1.id,
      rating: 5,
      comment: 'Amazing selection of vintage furniture! Highly recommend.',
    },
  });

  await prisma.review.create({
    data: {
      userId: user2.id,
      saleId: sale2.id,
      rating: 4,
      comment: 'Great tools sale, good organization. Will come back!',
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
