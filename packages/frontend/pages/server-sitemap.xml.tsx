import { getServerSideSitemap } from 'next-sitemap';
import api from '../lib/api';

export async function getServerSideProps(ctx: any) {
  try {
    // Fetch all sales to generate URLs
    const salesResponse = await api.get('/sales');
    const sales = salesResponse.data.sales || salesResponse.data;
    
    // Extract unique cities for city pages
    const cities = [...new Set(sales.map((sale: any) => 
      sale.city.toLowerCase().replace(/\s+/g, '-')
    ))];

    // Generate static URLs
    const staticUrls = [
      '/',
      '/about',
      '/contact',
      '/terms',
      '/privacy',
    ].map((url) => ({
      loc: `${process.env.SITE_URL || 'https://salescout.app'}${url}`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.7,
    }));

    // Generate sale URLs
    const saleUrls = Array.isArray(sales) 
      ? sales.map((sale: any) => ({
          loc: `${process.env.SITE_URL || 'https://salescout.app'}/sales/${sale.id}`,
          lastmod: new Date(sale.updatedAt || sale.createdAt || new Date()).toISOString(),
          changefreq: 'hourly',
          priority: 0.8,
        }))
      : [];

    // Generate city URLs
    const cityUrls = cities.map((city: string) => ({
      loc: `${process.env.SITE_URL || 'https://salescout.app'}/city/${city}`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.6,
    }));

    const fields = [...staticUrls, ...saleUrls, ...cityUrls];

    return getServerSideSitemap(ctx, fields);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return empty sitemap if there's an error
    return getServerSideSitemap(ctx, []);
  }
}

// Default export to prevent next.js errors
export default function Sitemap() {}
