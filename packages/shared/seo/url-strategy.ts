// URL Structure Strategy for SaleScout

/**
 * URL Structure Guidelines:
 * 
 * 1. Primary Domain Structure:
 *    - www.SaleScout.com (main domain)
 *    - gr.SaleScout.com (Grand Rapids subdomain for later expansion)
 * 
 * 2. Core Page Types:
 *    - Homepage: /
 *    - City Pages: /city/[city-slug]
 *    - Neighborhood Pages: /city/[city-slug]/neighborhood/[neighborhood-slug]
 *    - Sale Detail Pages: /sales/[sale-slug]
 *    - Organizer Pages: /organizers/[organizer-slug]
 *    - Category Pages: /categories/[category-slug]
 *    - Search Results: /search?q=[query]&location=[location]
 *    - Weekend Sale Lists: /weekend-sales/[city-slug]
 * 
 * 3. Dynamic Parameters:
 *    - date=YYYY-MM-DD for specific day filtering
 *    - category=[category-slug] for category filtering
 *    - sort=[relevance|date|distance] for sorting options
 *    - page=[number] for pagination
 */

export const URL_STRUCTURE = {
  HOMEPAGE: '/',
  CITY_PAGE: '/city/[citySlug]',
  NEIGHBORHOOD_PAGE: '/city/[citySlug]/neighborhood/[neighborhoodSlug]',
  SALE_DETAIL: '/sales/[saleSlug]',
  ORGANIZER_PAGE: '/organizers/[organizerSlug]',
  CATEGORY_PAGE: '/categories/[categorySlug]',
  SEARCH_RESULTS: '/search',
  WEEKEND_SALES: '/weekend-sales/[citySlug]',
  ITEM_DETAIL: '/items/[itemSlug]'
};

/**
 * Slug Rules:
 * 
 * 1. Sale Slugs:
 *    Format: [neighborhood]-[street-name]-estate-sale-[year]-[month]-[day]
 *    Example: eastown-main-street-estate-sale-2023-10-15
 * 
 * 2. City Slugs:
 *    Format: [city-name-lowercase]
 *    Example: grand-rapids
 * 
 * 3. Neighborhood Slugs:
 *    Format: [neighborhood-name-lowercase-with-hyphens]
 *    Example: east-grand-rapids
 * 
 * 4. Organizer Slugs:
 *    Format: [business-name-lowercase-with-hyphens]
 *    Example: johns-estate-sales-llc
 * 
 * 5. Category Slugs:
 *    Format: [category-name-lowercase-with-hyphens]
 *    Example: vintage-furniture
 * 
 * 6. Item Slugs:
 *    Format: [item-name-lowercase-with-hyphens]-[itemId]
 *    Example: antique-oak-dining-table-abc123
 */

export const SLUG_RULES = {
  SALE: (neighborhood: string, street: string, date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${neighborhood.toLowerCase().replace(/\s+/g, '-')}-${street.toLowerCase().replace(/\s+/g, '-')}-estate-sale-${year}-${month}-${day}`;
  },
  
  CITY: (cityName: string) => cityName.toLowerCase().replace(/\s+/g, '-'),
  
  NEIGHBORHOOD: (neighborhoodName: string) => neighborhoodName.toLowerCase().replace(/\s+/g, '-'),
  
  ORGANIZER: (businessName: string) => businessName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
  
  CATEGORY: (categoryName: string) => categoryName.toLowerCase().replace(/\s+/g, '-'),
  
  ITEM: (itemName: string, itemId: string) => `${itemName.toLowerCase().replace(/\s+/g, '-')}-${itemId}`
};

/**
 * City + Neighborhood Page Structure:
 * 
 * 1. City Landing Pages (/city/grand-rapids):
 *    - Featured sales carousel
 *    - Neighborhood selector map
 *    - Upcoming weekend sales highlight
 *    - Popular categories in this city
 *    - Top organizers in this city
 *    - SEO content about estate sales in city
 * 
 * 2. Neighborhood Pages (/city/grand-rapids/neighborhood/eastown):
 *    - Sales specifically in this neighborhood
 *    - Location context information
 *    - Nearby neighborhoods
 *    - Historical sale frequency data
 *    - Local points of interest
 */

export const PAGE_TEMPLATES = {
  CITY_PAGE: {
    title: (city: string) => `Estate Sales in ${city} | SaleScout`,
    description: (city: string) => `Find the best estate sales happening in ${city}. Browse listings, get directions, and discover unique finds in your area.`,
    h1: (city: string) => `Estate Sales in ${city}`,
    contentSections: [
      'featured_sales_carousel',
      'upcoming_weekend_sales',
      'popular_categories',
      'top_organizers',
      'neighborhood_map',
      'seo_content'
    ]
  },
  
  NEIGHBORHOOD_PAGE: {
    title: (neighborhood: string, city: string) => `Estate Sales in ${neighborhood}, ${city} | SaleScout`,
    description: (neighborhood: string, city: string) => `Discover estate sales happening in ${neighborhood}, ${city}. Find vintage treasures, furniture, and collectibles nearby.`,
    h1: (neighborhood: string, city: string) => `Estate Sales in ${neighborhood}, ${city}`,
    contentSections: [
      'current_sales_list',
      'upcoming_sales_calendar',
      'neighborhood_map',
      'nearby_neighborhoods',
      'local_points_of_interest'
    ]
  }
};
