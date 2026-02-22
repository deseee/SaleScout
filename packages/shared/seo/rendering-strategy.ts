// Static Generation vs Dynamic Rendering Plan for SaleScout

/**
 * Rendering Strategy:
 * 
 * 1. Static Generation (SSG):
 *    - Homepage
 *    - City pages
 *    - Neighborhood pages
 *    - Category pages
 *    - About/contact pages
 *    - Blog posts (future)
 * 
 * 2. Incremental Static Regeneration (ISR):
 *    - Sale detail pages (regenerate every 60 seconds for active sales)
 *    - Organizer pages (regenerate every 24 hours)
 *    - Weekend sale lists (regenerate every 15 minutes)
 *    - Programmatic SEO pages (regenerate based on query frequency)
 * 
 * 3. Server-Side Rendering (SSR):
 *    - Search results pages
 *    - User-specific pages (dashboard, watchlists)
 *    - Real-time data displays (active bids, reservations)
 * 
 * 4. Client-Side Rendering (CSR):
 *    - Interactive map components
 *    - User preference settings
 *    - Live chat features
 *    - Real-time notifications
 */

export const RENDERING_STRATEGY = {
  STATIC_PAGES: [
    '/',
    '/about',
    '/contact',
    '/faq',
    '/privacy',
    '/terms'
  ],
  
  ISR_PAGES: {
    '/sales/:slug': {
      revalidate: 60, // Every minute for active sales
      staleWhileRevalidate: 30
    },
    '/organizers/:slug': {
      revalidate: 86400, // Daily
      staleWhileRevalidate: 3600
    },
    '/city/:slug': {
      revalidate: 86400, // Daily
      staleWhileRevalidate: 3600
    },
    '/weekend-sales/:city': {
      revalidate: 900, // Every 15 minutes
      staleWhileRevalidate: 300
    }
  },
  
  SSR_PAGES: [
    '/search',
    '/dashboard/:user',
    '/watchlist',
    '/reservations'
  ],
  
  CSR_COMPONENTS: [
    'InteractiveMap',
    'LiveAuctionTimer',
    'RealtimeNotifications',
    'UserPreferences',
    'ShoppingCart'
  ]
};

/**
 * ISR Strategy for Vercel:
 * 
 * 1. Background Regeneration:
 *    - Trigger regeneration when data changes
 *    - Use webhooks from CMS/database
 *    - Implement queue system for high-frequency updates
 * 
 * 2. On-Demand Revalidation:
 *    - When a new sale is published
 *    - When sale details change
 *    - When organizer information updates
 * 
 * 3. Cache Invalidation:
 *    - Set explicit cache headers
 *    - Use cache tags for granular invalidation
 *    - Implement cache warming for peak times
 * 
 * 4. Stale-While-Revalidate:
 *    - Serve stale content immediately
 *    - Update content in background
 *    - Reduce server load during traffic spikes
 */

export const ISR_STRATEGY = {
  REVALIDATION_TRIGGERS: {
    SALE_PUBLISHED: ['/sales/:slug', '/city/:citySlug', '/weekend-sales/:city'],
    SALE_UPDATED: ['/sales/:slug'],
    ORGANIZER_UPDATED: ['/organizers/:slug'],
    NEW_WEEKEND: ['/weekend-sales/:city']
  },
  
  CACHE_HEADERS: {
    STATIC: 'public, max-age=31536000, immutable', // 1 year for static assets
    ISR: 'public, s-maxage=3600, stale-while-revalidate=1800', // 1 hour on CDN, 30 min stale
    DYNAMIC: 'public, max-age=0, must-revalidate' // Always revalidate
  },
  
  EDGE_CACHING: {
    PROVIDER: 'Vercel Edge Network',
    REGIONS: ['iad1'], // Primary region for Midwest
    CACHE_TAGS: {
      SALE: 'sale-page',
      ORGANIZER: 'organizer-page',
      CITY: 'city-page',
      WEEKEND: 'weekend-sales'
    }
  }
};

/**
 * Edge Caching Plan:
 * 
 * 1. Vercel Edge Network:
 *    - Deploy to edge functions for low latency
 *    - Cache HTML at edge locations
 *    - Use regional caching for Midwest focus
 * 
 * 2. CDN Strategy:
 *    - Image assets cached for 1 year
 *    - CSS/JS cached for 1 month
 *    - HTML cached per page strategy
 *    - API responses cached appropriately
 * 
 * 3. Cache Invalidation:
 *    - Tag-based invalidation for related content
 *    - Automatic invalidation on content updates
 *    - Manual purging for emergency fixes
 * 
 * 4. Warm-up Strategy:
 *    - Pre-cache high-traffic pages
 *    - Schedule warming for peak usage times
 *    - Monitor cache hit ratios
 */

export const EDGE_CACHING_PLAN = {
  EDGE_FUNCTIONS: {
    REGIONS: ['iad1', 'ord1', 'dfw1'], // Focus on Midwest edge locations
    MEMORY: '1024MB',
    MAX_DURATION: 60
  },
  
  CDN_CACHING: {
    IMAGES: 'public, max-age=31536000, immutable',
    STYLES: 'public, max-age=2592000', // 30 days
    SCRIPTS: 'public, max-age=2592000', // 30 days
    HTML: 'public, s-maxage=3600, stale-while-revalidate=1800' // 1 hour, 30 min stale
  },
  
  CACHE_INVALIDATION: {
    TAG_BASED: true,
    AUTO_PURGE: true,
    MANUAL_PURGE_ENDPOINT: '/api/revalidate'
  }
};
