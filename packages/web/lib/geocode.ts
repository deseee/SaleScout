const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

interface GeocodeResult {
  lat: number;
  lng: number;
  formattedAddress: string;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  try {
    // Check cache first
    const cacheKey = `geocode_${encodeURIComponent(address)}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const params = new URLSearchParams({
      q: address,
      format: 'json',
      addressdetails: '1',
      limit: '1'
    });

    const response = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: {
        'User-Agent': 'SaleScout/1.0 (https://salescout.app)'
      }
    });

    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const data = await response.json();
    
    if (data.length === 0) {
      return null;
    }

    const result = {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      formattedAddress: data[0].display_name
    };

    // Cache for 30 days
    localStorage.setItem(cacheKey, JSON.stringify(result));
    return result;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
