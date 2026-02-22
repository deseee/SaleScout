// JSON-LD Event Markup Generator for SaleScout

export interface EventData {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  location: {
    name?: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: number;
    longitude: number;
  };
  organizer: {
    name: string;
    url?: string;
  };
  image?: string;
  categories?: string[];
  offers?: {
    category: string;
    price: number;
  }[];
  url: string;
}

/**
 * Generates schema.org Event markup for estate sales
 * 
 * Implements structured data according to:
 * https://developers.google.com/search/docs/appearance/structured-data/event
 * 
 * Benefits:
 * - Rich snippets in search results
 * - Improved click-through rates
 * - Better understanding by search engines
 * - Potential inclusion in Google Events carousel
 */
export class JSONLDGenerator {
  static generateEventMarkup(eventData: EventData): string {
    const event = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      '@id': eventData.url,
      'name': eventData.name,
      'description': eventData.description,
      'startDate': this.formatDateTime(eventData.startDate, eventData.startTime),
      'endDate': this.formatDateTime(eventData.endDate, eventData.endTime),
      'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
      'eventStatus': 'https://schema.org/EventScheduled',
      'location': {
        '@type': 'Place',
        'name': eventData.location.name || eventData.location.address,
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': eventData.location.address,
          'addressLocality': eventData.location.city,
          'addressRegion': eventData.location.state,
          'postalCode': eventData.location.zipCode,
          'addressCountry': 'US'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': eventData.location.latitude,
          'longitude': eventData.location.longitude
        }
      },
      'organizer': {
        '@type': 'Organization',
        'name': eventData.organizer.name,
        'url': eventData.organizer.url
      },
      'offers': eventData.offers?.map(offer => ({
        '@type': 'Offer',
        'category': offer.category,
        'price': offer.price,
        'priceCurrency': 'USD'
      })) || undefined,
      'about': eventData.categories,
      'image': eventData.image ? [eventData.image] : undefined,
      'url': eventData.url
    };

    // Remove undefined properties
    Object.keys(event).forEach(key => {
      if (event[key as keyof typeof event] === undefined) {
        delete event[key as keyof typeof event];
      }
    });

    return `<script type="application/ld+json">${JSON.stringify(event)}</script>`;
  }

  private static formatDateTime(date: Date, time: string): string {
    const [hours, minutes] = time.split(':');
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  }

  /**
   * Generates breadcrumbs JSON-LD markup
   */
  static generateBreadcrumbMarkup(items: Array<{ name: string; url: string }>): string {
    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': item.url
      }))
    };

    return `<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>`;
  }

  /**
   * Generates organization JSON-LD markup
   */
  static generateOrganizationMarkup(): string {
    const org = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'SaleScout',
      'url': 'https://SaleScout.com',
      'logo': 'https://SaleScout.com/logo.png',
      'sameAs': [
        'https://www.facebook.com/SaleScout',
        'https://twitter.com/estatesalesmw'
      ]
    };

    return `<script type="application/ld+json">${JSON.stringify(org)}</script>`;
  }
}
