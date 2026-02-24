import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

interface Sale {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  photoUrls: string[];
  organizer: {
    businessName: string;
  };
}

const HomePage = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  // Fetch sales data with better error handling
  const { data: sales, isLoading, isError, error } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      try {
        const response = await api.get('/sales');
        return response.data.sales as Sale[];
      } catch (err: any) {
        console.error('Error fetching sales:', err);
        throw new Error('Failed to load sales. Please try again later.');
      }
    },
    retry: 1, // Reduce retry attempts to prevent excessive retries
  });

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Sales</h2>
          <p className="text-gray-700 mb-4">There was a problem loading the sales data.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>SaleScout - Find Estate Sales Near You</title>
        <meta name="description" content="Find estate sales and auctions near you" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">Discover Amazing Deals</h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Find estate sales, garage sales, and auctions near you with SaleScout
          </p>
        </section>

        {/* Map Section */}
        <section className="mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Sales Map</h2>
            <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              {userLocation ? (
                <p className="text-gray-600">Map would be displayed here with your location</p>
              ) : (
                <p className="text-gray-600">Enable location to see nearby sales</p>
              )}
            </div>
          </div>
        </section>

        {/* Featured Sales Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Featured Sales</h2>
          {sales && sales.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sales.map((sale) => (
                <Link href={`/sales/${sale.id}`} key={sale.id} className="block">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {sale.photoUrls && sale.photoUrls.length > 0 ? (
                      <img 
                        src={sale.photoUrls[0]} 
                        alt={sale.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 h-48 flex items-center justify-center">
                        <span className="text-gray-500">No image available</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">{sale.title}</h3>
                      <p className="text-gray-600 mb-2">{sale.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-500">
                          {new Date(sale.startDate).toLocaleDateString()} - {new Date(sale.endDate).toLocaleDateString()}
                        </span>
                        <span className="text-sm font-medium text-blue-600">
                          {sale.organizer.businessName}
                        </span>
                      </div>
                      <div className="mt-3 text-sm text-gray-500">
                        {sale.city}, {sale.state}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No sales available at the moment. Check back later!</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;
