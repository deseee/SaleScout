// Badge Logic Formulas for SaleScout

export interface BadgeCriteria {
  id: string;
  name: string;
  description: string;
  formula: string;
  threshold: number;
  type: 'shopper' | 'organizer';
}

/**
 * Badge Logic Formulas
 * 
 * These formulas determine when badges are awarded based on user activity
 */

export const BADGE_CRITERIA: BadgeCriteria[] = [
  // Shopper Badges
  {
    id: 'collector_1',
    name: 'First Collection',
    description: 'Attend your first estate sale',
    formula: 'attendedSales >= 1',
    threshold: 1,
    type: 'shopper'
  },
  {
    id: 'collector_10',
    name: 'Estate Enthusiast',
    description: 'Attend 10 estate sales',
    formula: 'attendedSales >= 10',
    threshold: 10,
    type: 'shopper'
  },
  {
    id: 'collector_50',
    name: 'Vintage Virtuoso',
    description: 'Attend 50 estate sales',
    formula: 'attendedSales >= 50',
    threshold: 50,
    type: 'shopper'
  },
  {
    id: 'neighborhood_explorer',
    name: 'Neighborhood Explorer',
    description: 'Visit sales in 5 different neighborhoods',
    formula: 'uniqueNeighborhoods >= 5',
    threshold: 5,
    type: 'shopper'
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Be among the first 10 visitors to 5 sales',
    formula: 'earlyArrivals >= 5',
    threshold: 5,
    type: 'shopper'
  },
  {
    id: 'treasure_hunter',
    name: 'Treasure Hunter',
    description: 'Find 20 items under $20',
    formula: 'bargainItems >= 20',
    threshold: 20,
    type: 'shopper'
  },
  {
    id: 'streak_7',
    name: 'Weekly Visitor',
    description: 'Visit sales for 7 consecutive days',
    formula: 'consecutiveDays >= 7',
    threshold: 7,
    type: 'shopper'
  },
  {
    id: 'streak_30',
    name: 'Monthly Regular',
    description: 'Visit sales for 30 consecutive days',
    formula: 'consecutiveDays >= 30',
    threshold: 30,
    type: 'shopper'
  },
  {
    id: 'social_shopper',
    name: 'Social Shopper',
    description: 'Refer 10 friends who attend sales',
    formula: 'successfulReferrals >= 10',
    threshold: 10,
    type: 'shopper'
  },
  
  // Organizer Badges
  {
    id: 'top_rated',
    name: 'Top Rated Organizer',
    description: 'Maintain 4.5+ star rating with 10+ reviews',
    formula: 'averageRating >= 4.5 AND reviewCount >= 10',
    threshold: 4.5,
    type: 'organizer'
  },
  {
    id: 'featured_organizer',
    name: 'Featured Organizer',
    description: 'Host 5 sales with 4.0+ average rating',
    formula: 'highRatedSales >= 5',
    threshold: 5,
    type: 'organizer'
  },
  {
    id: 'fast_responder',
    name: 'Fast Responder',
    description: 'Respond to 90% of inquiries within 2 hours',
    formula: 'responseRate >= 0.9 AND avgResponseTime <= 120',
    threshold: 0.9,
    type: 'organizer'
  },
  {
    id: 'super_host',
    name: 'Super Host',
    description: 'Host 20 successful sales',
    formula: 'successfulSales >= 20',
    threshold: 20,
    type: 'organizer'
  },
  {
    id: 'community_champion',
    name: 'Community Champion',
    description: 'Host sales in 5 different neighborhoods',
    formula: 'uniqueNeighborhoods >= 5',
    threshold: 5,
    type: 'organizer'
  }
];

/**
 * Badge Awarding Logic
 * 
 * Evaluates whether a user qualifies for a badge based on their activity
 */
export class BadgeEvaluator {
  static evaluate(criteria: BadgeCriteria, userData: Record<string, any>): boolean {
    // This is a simplified evaluation - in practice, you'd parse and evaluate the formula
    switch (criteria.id) {
      case 'collector_1':
        return userData.attendedSales >= 1;
      case 'collector_10':
        return userData.attendedSales >= 10;
      case 'collector_50':
        return userData.attendedSales >= 50;
      case 'neighborhood_explorer':
        return userData.uniqueNeighborhoods >= 5;
      case 'early_bird':
        return userData.earlyArrivals >= 5;
      case 'treasure_hunter':
        return userData.bargainItems >= 20;
      case 'streak_7':
        return userData.consecutiveDays >= 7;
      case 'streak_30':
        return userData.consecutiveDays >= 30;
      case 'social_shopper':
        return userData.successfulReferrals >= 10;
      case 'top_rated':
        return userData.averageRating >= 4.5 && userData.reviewCount >= 10;
      case 'featured_organizer':
        return userData.highRatedSales >= 5;
      case 'fast_responder':
        return userData.responseRate >= 0.9 && userData.avgResponseTime <= 120;
      case 'super_host':
        return userData.successfulSales >= 20;
      case 'community_champion':
        return userData.uniqueNeighborhoods >= 5;
      default:
        return false;
    }
  }
}
