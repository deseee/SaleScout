// Sitemap Generation Strategy for SaleScout

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Sitemap Generation Strategy:
 * 
 * 1. Static Sitemaps:
 *    - Core pages (homepage, about, contact)
 *    - City pages (one per major city)
 *    - Category pages
 * 
 * 2. Dynamic Sitemaps:
 *    - Sale detail pages (updated daily)
 *    - Neighborhood pages (updated weekly)
 *    - Organizer pages (updated weekly)
 * 
 * 3. Index Sitemap:
 *    - References all other sitemaps
 *    - Updated whenever new sitemaps are added
 * 
 * 4. Priority System:
 *    - Homepage: 1.0
 *    - City pages: 0.9
 *    - Sale detail pages: 0.8
 *    - Neighborhood pages: 0.7
 *    - Category pages: 0.6
 *    - Organizer pages: 0.5
 *    - Other pages: 0.4
 * 
 * 5. Change Frequency:
 *    - Homepage: daily
 *    - Sale pages: daily (active sales)
 *    - City pages: weekly
 *    - Neighborhood pages: monthly
 *    - Category pages: monthly
 *    - Organizer pages: monthly
 */

export class SitemapGenerator {
  static generateIndexSitemap(sitemapUrls: string[]): string {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    const sitemapHeader = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    const sitemapFooter = '</sitemapindex>';
    
    const sitemapEntries = sitemapUrls.map(url => `
  <sitemap>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('');
    
    return `${xmlHeader}\n${sitemapHeader}${sitemapEntries}\n${sitemapFooter}`;
  }

  static generateSitemap(entries: SitemapEntry[]): string {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    const urlsetHeader = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    const urlsetFooter = '</urlset>';
    
    const urlEntries = entries.map(entry => `
  <url>
    <loc>${entry.loc}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority.toFixed(1)}</priority>` : ''}
  </url>`).join('');
    
    return `${xmlHeader}\n${urlsetHeader}${urlEntries}\n${urlsetFooter}`;
  }

  /**
   * Generate sitemap entries for sale pages
   * Prioritizes active/published sales higher
   */
  static generateSaleEntries(sales: Array<{
    slug: string;
    updatedAt: Date;
    status: 'draft' | 'published' | 'live' | 'ended';
  }>): SitemapEntry[] {
    return sales.map(sale => {
      let priority = 0.4;
      let changefreq: SitemapEntry['changefreq'] = 'monthly';
      
      // Higher priority for active sales
      if (sale.status === 'live') {
        priority = 0.8;
        changefreq = 'daily';
      } else if (sale.status === 'published') {
        priority = 0.7;
        changefreq = 'weekly';
      }
      
      return {
        loc: `https://SaleScout.com/sales/${sale.slug}`,
        lastmod: sale.updatedAt.toISOString(),
        changefreq,
        priority
      };
    });
  }

  /**
   * Generate sitemap entries for city pages
   */
  static generateCityEntries(cities: Array<{
    slug: string;
    updatedAt: Date;
  }>): SitemapEntry[] {
    return cities.map(city => ({
      loc: `https://SaleScout.com/city/${city.slug}`,
      lastmod: city.updatedAt.toISOString(),
      changefreq: 'weekly',
      priority: 0.9
    }));
  }

  /**
   * Generate sitemap entries for neighborhood pages
   */
  static generateNeighborhoodEntries(neighborhoods: Array<{
    citySlug: string;
    slug: string;
    updatedAt: Date;
  }>): SitemapEntry[] {
    return neighborhoods.map(neighborhood => ({
      loc: `https://SaleScout.com/city/${neighborhood.citySlug}/neighborhood/${neighborhood.slug}`,
      lastmod: neighborhood.updatedAt.toISOString(),
      changefreq: 'monthly',
      priority: 0.7
    }));
  }
}
