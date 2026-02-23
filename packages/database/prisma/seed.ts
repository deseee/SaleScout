import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash password function
  const saltRounds = 10;
  const defaultPassword = await bcrypt.hash('password123', saltRounds);

  // Clear existing data in the correct order to avoid foreign key constraints
  await prisma.$transaction([
    prisma.bid.deleteMany(),
    prisma.purchase.deleteMany(),
    prisma.favorite.deleteMany(),
    prisma.review.deleteMany(),
    prisma.item.deleteMany(),
    prisma.sale.deleteMany(),
    prisma.organizer.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@salescout.app',
      name: 'Admin User',
      role: 'ADMIN',
      points: 0,
      password: defaultPassword,
    },
  });

  // Create organizers
  const organizer1User = await prisma.user.create({
    data: {
      email: 'organizer1@grsales.com',
      name: 'Grand Rapids Sales Inc',
      role: 'ORGANIZER',
      points: 0,
      password: defaultPassword,
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
      password: defaultPassword,
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

  // Create sample sales in February 2026 and beyond
  const sale1 = await prisma.sale.create({
    data: {
      organizerId: organizer1.id,
      title: 'Downtown Estate Sale',
      description: 'Complete household estate sale featuring antiques, furniture, and collectibles',
      startDate: new Date('2026-02-15T09:00:00Z'),
      endDate: new Date('2026-02-16T17:00:00Z'),
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
      startDate: new Date('2026-02-20T10:00:00Z'),
      endDate: new Date('2026-02-22T18:00:00Z'),
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

  const sale3 = await prisma.sale.create({
    data: {
      organizerId: organizer1.id,
      title: 'West Side Moving Sale',
      description: 'Entire household moving sale - furniture, electronics, kitchenware and more',
      startDate: new Date('2026-03-05T08:00:00Z'),
      endDate: new Date('2026-03-06T16:00:00Z'),
      address: '456 West Ln',
      city: 'Grand Rapids',
      state: 'MI',
      zip: '49505',
      lat: 42.9456,
      lng: -85.6789,
      status: 'PUBLISHED',
      photoUrls: [
        'https://example.com/sale3_img1.jpg',
      ],
      tags: ['moving', 'household', 'kitchen'],
    },
  });

  const sale4 = await prisma.sale.create({
    data: {
      organizerId: organizer2.id,
      title: 'Antique Collector\'s Final Sale',
      description: 'Lifetime collection of antiques, books, and curiosities',
      startDate: new Date('2026-03-12T10:00:00Z'),
      endDate: new Date('2026-03-13T18:00:00Z'),
      address: '789 Oak St',
      city: 'Grand Rapids',
      state: 'MI',
      zip: '49507',
      lat: 42.9345,
      lng: -85.6543,
      status: 'PUBLISHED',
      photoUrls: [
        'https://example.com/sale4_img1.jpg',
        'https://example.com/sale4_img2.jpg',
      ],
      tags: ['antiques', 'books', 'collectibles'],
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
      auctionEndTime: new Date('2026-02-19T20:00:00Z'),
      status: 'AVAILABLE',
      photoUrls: ['https://example.com/painting.jpg'],
    },
  });

  const item4 = await prisma.item.create({
    data: {
      saleId: sale3.id,
      title: 'Vintage Record Collection',
      description: 'Over 200 classic rock and jazz vinyl records from the 60s-80s',
      price: 150.0,
      status: 'AVAILABLE',
      photoUrls: ['https://example.com/records.jpg'],
    },
  });

  const item5 = await prisma.item.create({
    data: {
      saleId: sale4.id,
      title: 'Antique Silver Tea Set',
      description: 'Solid silver tea set with ornate engravings, early 1900s',
      auctionStartPrice: 200.0,
      currentBid: 350.0,
      bidIncrement: 25.0,
      auctionEndTime: new Date('2026-03-12T17:00:00Z'),
      status: 'AVAILABLE',
      photoUrls: ['https://example.com/tea_set.jpg'],
    },
  });

  // Create regular users
  const user1 = await prisma.user.create({
    data: {
      email: 'shopper1@example.com',
      name: 'Alex Johnson',
      role: 'USER',
      points: 150,
      password: defaultPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'shopper2@example.com',
      name: 'Taylor Smith',
      role: 'USER',
      points: 320,
      password: defaultPassword,
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
