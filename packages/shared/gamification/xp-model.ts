// XP Model for SaleScout

/**
 * XP (Experience Points) Model
 * 
 * Users earn XP through various activities which contribute to their level progression
 */

export interface XPReward {
  id: string;
  name: string;
  description: string;
  xp: number;
  cooldownPeriod?: number; // in minutes
  dailyLimit?: number;
  weeklyLimit?: number;
}

export const XP_REWARDS: XPReward[] = [
  // Shopper XP Rewards
  {
    id: 'attend_sale',
    name: 'Sale Attendance',
    description: 'Attend an estate sale',
    xp: 50
  },
  {
    id: 'purchase_item',
    name: 'Item Purchase',
    description: 'Purchase an item at an estate sale',
    xp: 25
  },
  {
    id: 'first_daily_visit',
    name: 'Daily Visit',
    description: 'Visit your first sale of the day',
    xp: 10,
    cooldownPeriod: 1440 // 24 hours
  },
  {
    id: 'follow_organizer',
    name: 'Follow Organizer',
    description: 'Follow an organizer',
    xp: 5
  },
  {
    id: 'refer_friend',
    name: 'Refer Friend',
    description: 'Refer a friend who attends a sale',
    xp: 100
  },
  {
    id: 'daily_streak',
    name: 'Daily Streak',
    description: 'Visit sales for consecutive days',
    xp: 20 // Per day in streak
  },
  {
    id: 'review_sale',
    name: 'Review Sale',
    description: 'Leave a review for a sale',
    xp: 15
  },
  {
    id: 'share_sale',
    name: 'Share Sale',
    description: 'Share a sale on social media',
    xp: 5,
    dailyLimit: 5
  },
  {
    id: 'explore_neighborhood',
    name: 'Explore Neighborhood',
    description: 'Visit a sale in a new neighborhood',
    xp: 30
  },
  
  // Organizer XP Rewards
  {
    id: 'host_sale',
    name: 'Host Sale',
    description: 'Host an estate sale',
    xp: 200
  },
  {
    id: 'sale_success',
    name: 'Successful Sale',
    description: 'Successfully complete a sale with positive feedback',
    xp: 150
  },
  {
    id: 'respond_inquiry',
    name: 'Respond to Inquiry',
    description: 'Respond to a customer inquiry',
    xp: 5
  },
  {
    id: 'positive_review',
    name: 'Positive Review',
    description: 'Receive a positive review',
    xp: 20
  },
  {
    id: 'quick_response',
    name: 'Quick Response',
    description: 'Respond to inquiry within 1 hour',
    xp: 10
  }
];

/**
 * Level Progression System
 * 
 * Users level up as they accumulate XP
 */
export interface Level {
  level: number;
  minXp: number;
  maxXp: number;
  title: string;
  benefits: string[];
}

export const LEVELS: Level[] = [
  { level: 1, minXp: 0, maxXp: 99, title: 'Newcomer', benefits: ['Basic access'] },
  { level: 2, minXp: 100, maxXp: 299, title: 'Regular', benefits: ['Early access to some drops'] },
  { level: 3, minXp: 300, maxXp: 599, title: 'Enthusiast', benefits: ['Priority notifications'] },
  { level: 4, minXp: 600, maxXp: 999, title: 'Collector', benefits: ['Exclusive previews'] },
  { level: 5, minXp: 1000, maxXp: 1499, title: 'Connoisseur', benefits: ['Early access to all drops'] },
  { level: 6, minXp: 1500, maxXp: 2099, title: 'Expert', benefits: ['VIP sale invitations'] },
  { level: 7, minXp: 2100, maxXp: 2799, title: 'Master', benefits: ['Personal shopping assistance'] },
  { level: 8, minXp: 2800, maxXp: 3599, title: 'Legend', benefits: ['Special discounts'] },
  { level: 9, minXp: 3600, maxXp: 4499, title: 'Grand Master', benefits: ['Exclusive events access'] },
  { level: 10, minXp: 4500, maxXp: Infinity, title: 'Ultimate', benefits: ['All benefits + special recognition'] }
];

/**
 * XP Calculation Utilities
 */
export class XPSystem {
  static calculateLevel(totalXP: number): number {
    const level = LEVELS.find(l => totalXP >= l.minXp && totalXP <= l.maxXp);
    return level ? level.level : 1;
  }
  
  static getLevelInfo(level: number): Level | undefined {
    return LEVELS.find(l => l.level === level);
  }
  
  static getNextLevelXP(currentLevel: number): number {
    const nextLevel = LEVELS.find(l => l.level === currentLevel + 1);
    return nextLevel ? nextLevel.minXp : Infinity;
  }
  
  static getCurrentLevelXP(currentLevel: number): number {
    const level = LEVELS.find(l => l.level === currentLevel);
    return level ? level.minXp : 0;
  }
  
  static getXpProgress(currentXP: number, currentLevel: number): { current: number, next: number } {
    const currentLevelXP = this.getCurrentLevelXP(currentLevel);
    const nextLevelXP = this.getNextLevelXP(currentLevel);
    
    if (nextLevelXP === Infinity) {
      return { current: currentXP - currentLevelXP, next: 0 };
    }
    
    return { 
      current: currentXP - currentLevelXP, 
      next: nextLevelXP - currentLevelXP 
    };
  }
}
