export type SaleStatus = 'draft' | 'published' | 'live' | 'ended';

export interface Sale {
  id: string;
  slug: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  lat: number;
  lng: number;
  organizerId: string;
  status: SaleStatus;
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organizer {
  id: string;
  userId: string;
  businessName: string;
  description?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  stripeAccountId?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shopper {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Item {
  id: string;
  saleId: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrls: string[];
  isFeatured: boolean;
  isAuctionItem?: boolean;
  minBid?: number;
  bidIncrement?: number;
  finalBid?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reservation {
  id: string;
  itemId: string;
  userId: string;
  status: ReservationStatus;
  stripePaymentId?: string;
  amount: number;
  reservedAt: Date;
  expiresAt?: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'expired' | 'completed';

export interface Follower {
  id: string;
  followerId: string;
  organizerId: string;
  createdAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  criteria: string;
  type: BadgeType;
  createdAt: Date;
}

export type BadgeType = 'shopper' | 'organizer';

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  awardedAt: Date;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  code: string;
  redeemed: boolean;
  redeemedAt?: Date;
  createdAt: Date;
}

export interface PhotoBatch {
  id: string;
  saleId: string;
  imageUrl: string;
  processed: boolean;
  droppedAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Neighborhood {
  id: string;
  name: string;
  slug: string;
  cityId: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
}

// Gamification interfaces
export interface UserXP {
  id: string;
  userId: string;
  totalXP: number;
  level: number;
  streak: number;
  lastActivityDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStreak {
  id: string;
  userId: string;
  currentDate: Date;
  streakCount: number;
  createdAt: Date;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  totalXP: number;
  level: number;
  badgesCount: number;
}
