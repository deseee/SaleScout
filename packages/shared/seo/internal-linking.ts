// Internal Linking Strategy for SaleScout

/**
 * Internal Linking Principles:
 * 
 * 1. Contextual Relevance:
 *    - Link to related sales based on category, location, or organizer
 *    - Cross-link neighborhood pages within same city
 *    - Connect sales to relevant category pages
 * 
 * 2. Hierarchical Structure:
 *    - Homepage -> City Pages -> Neighborhood Pages -> Sale Pages
 *    - Sale Pages -> Organizer Page -> Other Sales by Organizer
 *    - Category Pages -> Related Categories
 * 
 * 3. Navigation Enhancement:
 *    - Breadcrumbs on all pages
 *    - "Related Sales" section on sale detail pages
 *    - "Nearby Sales" based on geographic proximity
 *    - "Popular Searches" widget
 * 
 * 4. Content Siloing:
 *    - Group related content together
 *    - Use topic clusters for main categories
 *    - Create hub pages for major topics
 */

export const INTERNAL_LINKING_STRATEGY = {
  SALE_DETAIL_LINKS: [
    'organizer_other_sales',
    'similar_category_sales',
    'nearby_location_sales',
    'same_weekend_sales',
    'related_items'
  ],
  
  CITY_PAGE_LINKS: [
    'featured_neighborhoods',
    'top_organizers',
    'popular_categories',
    'recent_sales',
    'upcoming_weekend_sales'
  ],
  
  NEIGHBORHOOD_PAGE_LINKS: [
    'current_sales',
    'upcoming_sales',
    'nearby_neighborhoods',
    'same_city_neighborhoods'
  ],
  
  CATEGORY_PAGE_LINKS: [
    'subcategory_pages',
    'related_categories',
    'popular_items',
    'featured_sales_in_category'
  ],
  
  AUTOMATED_LINKS: {
    // Automatically link to 3-5 related sales based on:
    GEOGRAPHIC_PROXIMITY: true,
    CATEGORY_SIMILARITY: true,
    ORGANIZER_CONNECTION: true,
    TIME_PROXIMITY: true
  }
};

/**
 * Anchor Text Strategy:
 * 
 * 1. Branded Anchors:
 *    - "SaleScout"
 *    - "[City] Estate Sales"
 * 
 * 2. Geographic Anchors:
 *    - "Estate sales in [neighborhood]"
 *    - "[Neighborhood] estate sale"
 *    - "Estate sale near [landmark]"
 * 
 * 3. Descriptive Anchors:
 *    - "Vintage furniture estate sale"
 *    - "Jewelry estate sale"
 *    - "[Category] estate sale"
 * 
 * 4. Temporal Anchors:
 *    - "This weekend estate sales"
 *    - "Upcoming estate sale"
 *    - "Today's estate sales"
 */

export const ANCHOR_TEXT_STRATEGY = {
  BRANDED: [
    'SaleScout',
    '{city} Estate Sales',
    'Midwest Estate Sales'
  ],
  
  GEOGRAPHIC: [
    'Estate sales in {neighborhood}',
    '{neighborhood} estate sale',
    'Estate sale near {landmark}',
    '{city} estate sales this weekend'
  ],
  
  DESCRIPTIVE: [
    '{category} estate sale',
    'Vintage {category} estate sale',
    '{itemType} estate sale',
    'High-end estate sale'
  ],
  
  TEMPORAL: [
    'This weekend estate sales',
    'Upcoming estate sale',
    'Today\'s estate sales',
    '{date} estate sale'
  ]
};
