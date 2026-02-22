// Programmatic SEO Templates for SaleScout

/**
 * Programmatic SEO Strategy:
 * 
 * Targeting long-tail keywords through dynamically generated pages:
 * 
 * 1. Temporal Queries:
 *    - "Estate sales in [city] this weekend"
 *    - "Estate sales near [neighborhood] today"
 *    - "[Day] estate sales in [city]"
 * 
 * 2. Geographic + Category Queries:
 *    - "Vintage estate sale [neighborhood]"
 *    - "Estate sale with jewelry near me"
 *    - "[Category] estate sales in [city]"
 * 
 * 3. Proximity-Based Queries:
 *    - "Estate sales near [landmark]"
 *    - "Estate sale closest to me"
 *    - "Walking distance estate sales"
 * 
 * Implementation:
 * - Create dedicated landing pages for each template variation
 * - Use dynamic parameters to populate content
 * - Implement proper canonicalization to avoid duplicate content issues
 * - Optimize for featured snippets where possible
 */

export const PROGRAMMATIC_SEO_TEMPLATES = {
  WEEKEND_SALES: {
    path: '/weekend-sales/[city]',
    title: (city: string) => `Estate Sales in ${city} This Weekend | SaleScout`,
    description: (city: string) => `Find all estate sales happening in ${city} this weekend. Browse listings, get directions, and discover unique finds.`,
    h1: (city: string) => `Estate Sales in ${city} This Weekend`,
    contentStructure: [
      'weekend_overview',
      'featured_sales',
      'map_view',
      'category_highlights',
      'organizer_spotlight'
    ]
  },
  
  NEIGHBORHOOD_CATEGORY: {
    path: '/[neighborhood]/[category]-estate-sales',
    title: (neighborhood: string, category: string) => 
      `${category.charAt(0).toUpperCase() + category.slice(1)} Estate Sales in ${neighborhood} | SaleScout`,
    description: (neighborhood: string, category: string) => 
      `Discover ${category} estate sales happening in ${neighborhood}. Find unique ${category} items at great prices.`,
    h1: (neighborhood: string, category: string) => 
      `${category.charAt(0).toUpperCase() + category.slice(1)} Estate Sales in ${neighborhood}`,
    contentStructure: [
      'category_introduction',
      'current_listings',
      'popular_items',
      'shopping_tips',
      'related_categories'
    ]
  },
  
  PROXIMITY_BASED: {
    path: '/near-[landmark]',
    title: (landmark: string) => `Estate Sales Near ${landmark} | SaleScout`,
    description: (landmark: string) => 
      `Find estate sales happening near ${landmark}. Browse listings, get directions, and discover unique finds close to you.`,
    h1: (landmark: string) => `Estate Sales Near ${landmark}`,
    contentStructure: [
      'proximity_introduction',
      'nearby_sales',
      'directions_guide',
      'landmark_context',
      'related_areas'
    ]
  },
  
  ITEM_BASED: {
    path: '/[itemType]-estate-sales',
    title: (itemType: string) => `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Estate Sales | SaleScout`,
    description: (itemType: string) => 
      `Find estate sales featuring ${itemType}. Browse listings with ${itemType} items and discover unique finds at great prices.`,
    h1: (itemType: string) => `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Estate Sales`,
    contentStructure: [
      'item_type_introduction',
      'featured_listings',
      'value_proposition',
      'shopping_guide',
      'related_item_types'
    ]
  }
};

/**
 * Dynamic Parameter Mapping:
 * 
 * For each template, define how parameters map to content:
 * 
 * 1. City Parameter:
 *    - Populates city-specific content
 *    - Filters sales by city
 *    - Shows city-level statistics
 * 
 * 2. Neighborhood Parameter:
 *    - Focuses on specific geographic area
 *    - Shows neighborhood-level insights
 *    - Links to adjacent neighborhoods
 * 
 * 3. Category Parameter:
 *    - Filters by item category
 *    - Shows category-specific tips
 *    - Highlights popular items in category
 * 
 * 4. Landmark Parameter:
 *    - Calculates proximity to landmark
 *    - Shows directions from landmark
 *    - Provides contextual information
 * 
 * 5. Date Parameter:
 *    - Filters by specific date range
 *    - Shows upcoming vs past sales
 *    - Adjusts content tone accordingly
 */

export const PARAMETER_MAPPING = {
  CITY: {
    contentFilters: ['city_sales', 'city_organizers', 'city_statistics'],
    urlParam: 'city',
    canonicalTag: true
  },
  
  NEIGHBORHOOD: {
    contentFilters: ['neighborhood_sales', 'geographic_proximity', 'local_context'],
    urlParam: 'neighborhood',
    canonicalTag: true
  },
  
  CATEGORY: {
    contentFilters: ['category_items', 'category_popularity', 'related_categories'],
    urlParam: 'category',
    canonicalTag: true
  },
  
  LANDMARK: {
    contentFilters: ['landmark_proximity', 'directions_content', 'landmark_context'],
    urlParam: 'landmark',
    canonicalTag: false // Multiple landmarks could refer to same sales
  },
  
  DATE: {
    contentFilters: ['temporal_filtering', 'date_specific_content', 'seasonal_context'],
    urlParam: 'date',
    canonicalTag: false // Date variations should canonicalize to main sale page
  }
};
