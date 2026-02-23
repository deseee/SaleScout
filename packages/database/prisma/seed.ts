import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@salescout.app',
      name: 'Admin User',
      role: 'ADMIN',
      points: 0,
    },
  });

  // Create organizers
  const organizer1User = await prisma.user.create({
    data: {
      email: 'organizer1@grsales.com',
      name: 'Grand Rapids Sales Inc',
      role: 'ORGANIZER',
      points: 0,
    },
  });

  const organizer1 = await prisma.organizer.create({
    data: {
      userId: organizer1User.id,
      businessName: 'Grand Rapids Sales Inc',
      phone: '(616) 555-0123',
      address: '123 Main St, Grand Rapids, MI 49503',
    },
  });

  const organizer2User = await prisma.user.create({
    data: {
      email: 'organizer2@miestatesales.com',
      name: 'Michigan Estate Pros',
      role: 'ORGANIZER',
      points: 0,
    },
  });

  const organizer2 = await prisma.organizer.create({
    data: {
      userId: organizer2User.id,
      businessName: 'Michigan Estate Pros',
      phone: '(616) 555-0198',
      address: '456 Lakeview Ave, Grand Rapids, MI 49504',
    },
  });

  // Create sample sales
  const sale1 = await prisma.sale.create({
    data: {
      organizerId: organizer1.id,
      title: 'Downtown Estate Sale',
      description: 'Complete household estate sale featuring antiques, furniture, and collectibles',
      startDate: new Date('2023-11-15T09:00:00Z'),
      endDate: new Date('2023-11-16T17:00:00Z'),
      address: '789 Market St',
      city: 'Grand Rapids',
      state: 'MI',
      zip: '49503',
      lat: 42.9634,
      lng: -85.6681,
      status: 'PUBLISHED',
      photoUrls: [
        'https://example.com/sale1_img1.jpg',
        'https://example.com/sale1_img2.jpg',
      ],
      tags: ['antiques', 'furniture', 'collectibles'],
    },
  });

  const sale2 = await prisma.sale.create({
    data: {
      organizerId: organizer2.id,
      title: 'Heritage Hill Estate Sale',
      description: 'Fine art and vintage collectibles from a distinguished estate',
      startDate: new Date('2023-11-20T10:00:00Z'),
      endDate: new Date('2023-11-22T18:00:00Z'),
      address: '321 Heritage Blvd',
      city: 'Grand Rapids',
      state: 'MI',
      zip: '49506',
      lat: 42.9556,
      lng: -85.6789,
      status: 'PUBLISHED',
      photoUrls: [
        'https://example.com/sale2_img1.jpg',
        'https://example.com/sale2_img2.jpg',
      ],
      tags: ['art', 'vintage', 'collectibles'],
      isAuctionSale: true,
    },
  });

  // Create items for sales
  const item1 = await prisma.item.create({
    data: {
      saleId: sale1.id,
      title: 'Victorian Wooden Secretary Desk',
      description: 'Beautiful handcrafted desk with intricate woodwork, circa 1890',
      price: 450.0,
      status: 'AVAILABLE',
      photoUrls: ['https://example.com/desk_front.jpg', 'https://example.com/desk_side.jpg'],
    },
  });

  const item2 = await prisma.item.create({
    data: {
      saleId: sale1.id,
      title: 'Mid-Century Modern Lounge Chair',
      description: 'Original Eames style chair with leather upholstery',
      price: 275.0,
      status: 'AVAILABLE',
      photoUrls: ['https://example.com/chair.jpg'],
    },
  });

  const item3 = await prisma.item.create({
    data: {
      saleId: sale2.id,
      title: 'Oil Landscape Painting',
      description: 'Signed oil painting by local artist from the 1950s',
      auctionStartPrice: 50.0,
      currentBid: 75.0,
      bidIncrement: 10.0,
      auctionEndTime: new Date('2023-11-19T20:00:00Z'),
      status: 'AVAILABLE',
      photoUrls: ['https://example.com/painting.jpg'],
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
      points: 320,
    },
  });

  // Create favorites
  await prisma.favorite.create({
    data: {
      userId: user1.id,
      saleId: sale1.id,
    },
  });

  await prisma.favorite.create({
    data: {
      userId: user2.id,
      itemId: item3.id,
    },
  });

  // Create bids
  await prisma.bid.create({
    data: {
      itemId: item3.id,
      userId: user1.id,
      amount: 65.0,
    },
  });

  await prisma.bid.create({
    data: {
      itemId: item3.id,
      userId: user2.id,
      amount: 75.0,
    },
  });

  // Create purchases
  await prisma.purchase.create({
    data: {
      userId: user1.id,
      itemId: item1.id,
      amount: 450.0,
      status: 'PAID',
      stripePaymentIntentId: 'pi_123456789',
    },
  });

  // Create reviews
  await prisma.review.create({
    data: {
      userId: user1.id,
      saleId: sale1.id,
      rating: 5,
      comment: 'Excellent organization and great finds!',
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
