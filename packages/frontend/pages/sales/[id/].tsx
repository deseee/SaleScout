import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

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
    phone: string;
    address: string;
  };
  items: {
    id: string;
    title: string;
    description: string;
    price: number;
    auctionStartPrice: number;
    currentBid: number;
    status: string;
    photoUrls: string[];
  }[];
}

const SaleDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: sale, isLoading, isError } = useQuery({
    queryKey: ['sale', id],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/sales/${id}`);
      return response.data as Sale;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center">Error loading sale</div>;
  if (!sale) return <div className="min-h-screen flex items-center justify-center">Sale not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{sale.title} - SaleScout</title>
        <meta name="description" content={sale.description} />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>

        {/* Sale Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{sale.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{sale.address}, {sale.city}, {sale.state} {sale.zip}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>{new Date(sale.startDate).toLocaleDateString()} - {new Date(sale.endDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
                Organized by: {sale.organizer.businessName}
              </div>
            </div>
          </div>

          {sale.description && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{sale.description}</p>
            </div>
          )}
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Location</h2>
          <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">
              Map showing location at ({sale.lat}, {sale.lng})
            </p>
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Items for Sale</h2>
          {sale.items.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No items listed for this sale yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sale.items.map((item) => (
                <div key={item.id} className="border rounded-lg overflow-hidden">
                  {item.photoUrls.length > 0 ? (
                    <img 
                      src={item.photoUrls[0]} 
                      alt={item.title} 
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="bg-gray-200 h-48 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-600">
                        {item.price ? `$${item.price}` : 
                         item.auctionStartPrice ? `Starting at $${item.auctionStartPrice}` : 
                         'Price not set'}
                      </span>
                      {item.currentBid && (
                        <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Current bid: ${item.currentBid}
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                        item.status === 'SOLD' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SaleDetailPage;
