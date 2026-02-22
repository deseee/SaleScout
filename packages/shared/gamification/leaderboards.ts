// Leaderboards for SaleScout

/**
 * Leaderboard System
 * 
 * Tracks user rankings based on XP, badges, and other achievements
 */

export interface LeaderboardConfig {
  id: string;
  name: string;
  description: string;
  metric: 'xp' | 'badges' | 'sales_attended' | 'items_purchased' | 'referrals';
  timeframe: 'daily' | 'weekly' | 'monthly' | 'all_time';
  maxSize: number;
}

export const LEADERBOARD_CONFIGS: LeaderboardConfig[] = [
  {
    id: 'top_collectors_alltime',
    name: 'Top Collectors All-Time',
    description: 'Users with the most XP accumulated',
    metric: 'xp',
    timeframe: 'all_time',
    maxSize: 100
  },
  {
    id: 'top_collectors_monthly',
    name: 'Top Collectors This Month',
    description: 'Users with the most XP this month',
    metric: 'xp',
    timeframe: 'monthly',
    maxSize: 100
  },
  {
    id: 'badge_collectors',
    name: 'Badge Collectors',
    description: 'Users with the most badges earned',
    metric: 'badges',
    timeframe: 'all_time',
    maxSize: 100
  },
  {
    id: 'social_influencers',
    name: 'Social Influencers',
    description: 'Users with the most successful referrals',
    metric: 'referrals',
    timeframe: 'all_time',
    maxSize: 100
  },
  {
    id: 'top_organizers',
    name: 'Top Organizers',
    description: 'Highest rated organizers',
    metric: 'xp',
    timeframe: 'all_time',
    maxSize: 100
  }
];

/**
 * Leaderboard Entry
 */
export interface LeaderboardEntry {
  userId: string;
  userName: string;
  rank: number;
  value: number; // XP, badge count, etc.
  metadata?: Record<string, any>; // Additional info like level, badges count
}

/**
 * Leaderboard Manager
 */
export class LeaderboardManager {
  static async getLeaderboard(configId: string, limit: number = 100): Promise<LeaderboardEntry[]> {
    // This would query the database in a real implementation
    // For now, returning mock data
    
    const configs = LEADERBOARD_CONFIGS.find(c => c.id === configId);
    if (!configs) {
      throw new Error(`Leaderboard config not found: ${configId}`);
    }
    
    // Mock data - in reality this would come from database queries
    return [
      {
        userId: 'user1',
        userName: 'Alice Collector',
        rank: 1,
        value: 5000,
        metadata: { level: 10, badges: 25 }
      },
      {
        userId: 'user2',
        userName: 'Bob Bargain',
        rank: 2,
        value: 4200,
        metadata: { level: 9, badges: 22 }
      },
      {
        userId: 'user3',
        userName: 'Carol Curator',
        rank: 3,
        value: 3800,
        metadata: { level: 8, badges: 20 }
      }
    ];
  }
  
  static async getUserRank(configId: string, userId: string): Promise<LeaderboardEntry | null> {
    // This would query the database to find a user's position
    // Mock implementation for now
    return {
      userId: userId,
      userName: 'Current User',
      rank: 42,
      value: 1250,
      metadata: { level: 5, badges: 8 }
    };
  }
  
  static async updateLeaderboard(userId: string, metric: string, value: number): Promise<void> {
    // This would update the leaderboard in the database
    // Implementation would depend on specific database structure
    console.log(`Updating leaderboard for user ${userId}, metric: ${metric}, value: ${value}`);
  }
}
