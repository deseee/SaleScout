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

  // Create 12 sample sales in February 2026 and beyond
  const sales = [];
  
  // Sale 1
  sales.push(await prisma.sale.create({
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
  }));

  // Sale 2
  sales.push(await prisma.sale.create({
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
  }));

  // Sale 3
  sales.push(await prisma.sale.create({
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
  }));

  // Sale 4
  sales.push(await prisma.sale.create({
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
  }));

  // Sale 5
  sales.push(await prisma.sale.create({
    data: {
      organizerId: organizer1.id,
      title: 'Spring Cleaning Garage Sale',
      description: 'Annual spring cleaning sale with tools, sports equipment, and household items',
      startDate: new Date('2026-04-05T07:00:00Z'),
      endDate: new Date('2026-04-06T15:00:00Z'),
      address: '101 Spring Dr',
      city: 'Grand Rapids',
      state: 'MI',
      zip: '49508',
      lat: 42.9234,
      lng: -85.6432,
      status: 'PUBLISHED',
      photoUrls: [
        'https://example.com/sale5_img1.jpg',
      ],
      tags: ['garage', 'tools', 'sports'],
    },
  }));

  // Sale 6
  sales.push(await prisma.sale.create({
    data: {
      organizerId: organizer2.id,
      title: 'Vintage Jewelry & Collectibles Auction',
      description: 'Rare vintage jewelry, coins, and collectible items auction',
      startDate: new Date('2026-04-18T12:00:00Z'),
      endDate: new Date('2026-04-18T20:00:00Z'),
      address: '202 Auction Way',
      city: 'Grand Rapids',
      state: 'MI',
      zip: '49509',
      lat: 42.9123,
      lng: -85.6321,
      status: 'PUBLISHED',
      photoUrls: [
        'https://example.com/sale6_img1.jpg',
        'https://example.com/sale6_img2.jpg',
      ],
      tags: ['jewelry', 'coins', 'auction'],
      isAuctionSale: true,
    },
  }));

  // Sale 7
  sales.push(await prisma.sale.create({
    data: {
      organizerId: organizer1.id,
      title: 'Family Estate Liquidation',
      description: 'Complete family estate liquidation including furniture, artwork, and decor',
      startDate: new Date('2026-05-02T09:00:00Z'),
      endDate: new Date('2026-05-03T17:00:00Z'),
      address: '303 Family Cir',
      city: 'Grand Rapids',
      state: 'MI',
      zip: '49510',
      lat: 42.9012,
      lng: -85.6210,
      status: 'PUBLISHED',
      photoUrls: [
        'https://example.com/sale7_img1.jpg',
      ],
      tags: ['estate', 'furniture', 'artwork'],
    },
  }));

  // Sale 8
  sales.push(await prisma.sale.create({
    data: {
      organizerId: organizer2.id,
      title: 'Tech & Gaming Equipment Sale',
      description: 'Professional gaming setup equipment and high-end tech items',
      startDate: new Date('2026-05-15T11:00:00Z'),
      endDate: new Date('2026-05-16T19:00:00Z'),
      address: '404 Tech Blvd',
      city: 'Grand Rapids',
      state: 'MI',
      zip: '49511',
      lat: 42.8901,
      lng: -85.6109,
      status: 'PUBLISHED',
      photoUrls: [
        'https://example.com/sale8_img1.jpg',
      ],
      tags: ['technology', 'gaming', 'electronics'],
    },
  }));

  // Sale 9
  sales.push(await prisma.sale.create({
    data: {
      organizerId: organizer1.id,
      title: 'Garden & Outdoor Living Auction',
      description: 'Garden tools, outdoor furniture, and patio items auction',
      startDate: new Date('2026-05-28T08:00:00Z'),
      endDate: new Date('2026-05-28T16:00:00Z'),
      address: '505 Garden Path',
      city: 'Grand Rapids',
      state: 'MI',
      zip: '49512',
      lat: 42.8790,
      lng: -85.5987,
      status: 'PUBLISHED',
      photoUrls: [
        'https://example.com/sale9_img1.jpg',
      ],
      tags: ['garden', 'outdoor', 'auction'],
      isAuctionSale: true,
    },
  }));

  // Sale 10
  sales.push(await prisma.sale.create({
    data: {
      organizerId: organizer2.id,
      title: 'Vintage Clothing & Memorabilia',
      description: '1960s-90s vintage clothing and pop culture memorabilia',
      startDate: new Date('2026-06-10T10:00:00Z'),
      endDate: new Date('2026-06-11T18:00:00Z'),
      address: '606 Vintage Ave',
      city: 'Grand Rapids',
      state: 'MI',
      zip: '49513',
      lat: 42.8678,
      lng: -85.5876,
      status: 'PUBLISHED',
      photoUrls: [
        'https://example.com/sale10_img1.jpg',
      ],
      tags: ['clothing', 'vintage', 'memorabilia'],
    },
  }));

  // Sale 11
  sales.push(await prisma.sale.create({
    data: {
      organizerId: organizer1.id,
      title: 'Musical Instruments & Studio Equipment',
      description: 'Professional audio equipment and musical instruments',
      startDate: new Date('2026-06-22T12:00:00Z'),
      endDate: new Date('2026-06-23T20:00:00Z'),
      address: '707 Music St',
      city: 'Grand Rapids',
      state: 'MI',
      zip: '49514',
      lat: 42.8567,
      lng: -85.5765,
      status: 'PUBLISHED',
      photoUrls: [
        'https://example.com/sale11_img1.jpg',
      ],
      tags: ['music', 'instruments', 'audio'],
    },
  }));

  // Sale 12
  sales.push(await prisma.sale.create({
    data: {
      organizerId: organizer2.id,
      title: 'Summer Moving Sale',
      description: 'Complete household moving sale - everything must go!',
      startDate: new Date('2026-07-05T07:00:00Z'),
      endDate: new Date('2026-07-06T15:00:00Z'),
      address: '808 Summer Rd',
      city: 'Grand Rapids',
      state: 'MI',
      zip: '49515',
      lat: 42.8456,
      lng: -85.5654,
      status: 'PUBLISHED',
      photoUrls: [
        'https://example.com/sale12_img1.jpg',
      ],
      tags: ['moving', 'household', 'everything'],
    },
  }));

  // Create items for sales
  const items = [];
  
  // Items for Sale 1
  items.push(await prisma.item.create({
    data: {
      saleId: sales[0].id,
      title: 'Victorian Wooden Secretary Desk',
      description: 'Beautiful handcrafted desk with intricate woodwork, circa 1890',
      price: 450.0,
      status: 'AVAILABLE',
      photoUrls: ['https://example.com/desk_front.jpg', 'https://example.com/desk_side.jpg'],
    },
  }));

  items.push(await prisma.item.create({
    data: {
      saleId: sales[0].id,
      title: 'Mid-Century Modern Lounge Chair',
      description: 'Original Eames style chair with leather upholstery',
      price: 275.0,
      status: 'AVAILABLE',
      photoUrls: ['https://example.com/chair.jpg'],
    },
  }));

  // Items for Sale 2
  items.push(await prisma.item.create({
    data: {
      saleId: sales[1].id,
      title: 'Oil Landscape Painting',
      description: 'Signed oil painting by local artist from the 1950s',
      auctionStartPrice: 50.0,
      currentBid: 75.0,
      bidIncrement: 10.0,
      auctionEndTime: new Date('2026-02-19T20:00:00Z'),
      status: 'AVAILABLE',
      photoUrls: ['https://example.com/painting.jpg'],
    },
  }));

  // Items for Sale 3
  items.push(await prisma.item.create({
    data: {
      saleId: sales[2].id,
      title: 'Vintage Record Collection',
      description: 'Over 200 classic rock and jazz vinyl records from the 60s-80s',
      price: 150.0,
      status: 'AVAILABLE',
      photoUrls: ['https://example.com/records.jpg'],
    },
  }));

  // Items for Sale 4
  items.push(await prisma.item.create({
    data: {
      saleId: sales[3].id,
      title: 'Antique Silver Tea Set',
      description: 'Solid silver tea set with ornate engravings, early 1900s',
      auctionStartPrice: 200.0,
      currentBid: 350.0,
      bidIncrement: 25.0,
      auctionEndTime: new Date('2026-03-12T17:00:00Z'),
      status: 'AVAILABLE',
      photoUrls: ['https://example.com/tea_set.jpg'],
    },
  }));

  // Items for Sale 5
  items.push(await prisma.item.create({
    data: {
      saleId: sales[4].id,
      title: 'Power Tool Collection',
      description: 'Complete set of professional power tools from知名品牌',
      price: 300.0,
      status: 'AVAILABLE',
      photoUrls: ['https://example.com/tools.jpg'],
    },
  }));

  // Items for Sale 6
  items.push(await prisma.item.create({
    data: {
      saleId: sales[5].id,
      title: 'Diamond Engagement Ring',
      description: '1 carat solitaire diamond ring, certified appraisal included',
      auctionStartPrice: 1500.0,
      currentBid: 2200.0,
      bidIncrement: 100.0,
      auctionEndTime: new Date('2026-04-18T19:00:00Z'),
      status: 'AVAILABLE',
      photoUrls: ['https://example.com/ring.jpg'],
    },
  }));

  // Items for Sale 7
  items.push(await prisma.item.create({
    data: {
      saleId: sales[6].id,
      title: 'Oil Portrait Painting',
      description: 'Hand-painted portrait of a gentleman, 1800s',
      price: 450.0,
      status: 'AVAILABLE',
      photoUrls: ['https://example.com/portrait.jpg'],
    },
  }));

  // Items for Sale 8
  items.push(await prisma.item.create({
    data: {
      saleId: sales[7].id,
      title: 'Gaming Computer Setup',
      description: 'High-end gaming PC with multiple monitors and accessories',
      price: 2500.0,
      status: 'AVAILABLE',
      photoUrls: ['https://example.com/gaming_setup.jpg'],
    },
  }));

  // Items for Sale 9
  items.push(await prisma.item.create({
    data: {
      saleId: sales[8].id,
      title: 'Patio Furniture Set',
      description: '5-piece aluminum patio furniture set with cushions',
      auctionStartPrice: 150.0,
      currentBid: 175.0,
      bidIncrement: 10.0,
      auctionEndTime: new Date('2026-05-28T15:00:00Z'),
      status: 'AVAILABLE',
      photoUrls: ['https://example.com/patio_furniture.jpg'],
    },
  }));

  // Items for Sale 10
  items.push(await prisma.item.create({
    data: {
      saleId: sales[9].id,
      title: '1980s Pop Culture Collection',
      description: 'Vintage action figures, posters, and memorabilia from the 80s',
      price: 200.0,
      status: 'AVAILABLE',
      photoUrls: ['https://example.com/pop_culture.jpg'],
    },
  }));

  // Items for Sale 11
  items.push(await prisma.item.create({
    data: {
      saleId: sales[10].id,
      title: 'Electric Guitar',
      description: 'Vintage electric guitar with case and accessories',
      price: 600.0,
      status: 'AVAILABLE',
      photoUrls: ['https://example.com/guitar.jpg'],
    },
  }));

  // Items for Sale 12
  items.push(await prisma.item.create({
    data: {
      saleId: sales[11].id,
      title: 'Kitchen Appliance Bundle',
      description: 'Complete set of kitchen appliances including refrigerator, stove, microwave',
      price: 800.0,
      status: 'AVAILABLE',
      photoUrls: ['https://example.com/appliances.jpg'],
    },
  }));

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
      saleId: sales[0].id,
    },
  });

  await prisma.favorite.create({
    data: {
      userId: user2.id,
      itemId: items[2].id,
    },
  });

  // Create bids
  await prisma.bid.create({
    data: {
      itemId: items[2].id,
      userId: user1.id,
      amount: 65.0,
    },
  });

  await prisma.bid.create({
    data: {
      itemId: items[2].id,
      userId: user2.id,
      amount: 75.0,
    },
  });

  // Create purchases
  await prisma.purchase.create({
    data: {
      userId: user1.id,
      itemId: items[0].id,
      amount: 450.0,
      status: 'PAID',
      stripePaymentIntentId: 'pi_123456789',
    },
  });

  // Create reviews
  await prisma.review.create({
    data: {
      userId: user1.id,
      saleId: sales[0].id,
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
