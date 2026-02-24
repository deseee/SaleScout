import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api'; // Use the local API client instead of raw axios
import { loadStripe } from '@stripe/stripe-js';

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
    bidIncrement: number;
    auctionEndTime: string;
    status: string;
    photoUrls: string[];
  }[];
  isAuctionSale: boolean;
}

interface Bid {
  id: string;
  amount: number;
  user: {
    name: string;
  };
  createdAt: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const SaleDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [bidAmounts, setBidAmounts] = useState<{[key: string]: string}>({});

  // Get token and user role from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
      
      // In a real app, you would decode the JWT to get the user role
      // For now, we'll simulate this by checking if a token exists
      if (storedToken) {
        // This is a simplified check - in reality, decode the JWT to get role
        setUserRole('ORGANIZER'); // Simulate organizer role when logged in
      }
    }
  }, []);

  // Poll for updates every 10 seconds for auction items
  useEffect(() => {
    if (!id) return;
    
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['sale', id] });
    }, 10000);
    
    return () => clearInterval(interval);
  }, [id, queryClient]);

  const { data: sale, isLoading, isError } = useQuery({
    queryKey: ['sale', id],
    queryFn: async () => {
      if (!id) throw new Error('No sale ID provided');
      const response = await api.get(`/sales/${id}`);
      return response.data as Sale;
    },
    enabled: !!id,
  });

  const handleBuyNow = async (itemId: string) => {
    try {
      // Create payment intent
      const response = await api.post('/stripe/create-payment-intent', { itemId });
      
      // Get Stripe.js instance
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }
      
      // Confirm the payment
      const { error } = await stripe.confirmCardPayment(response.data.clientSecret);
      
      if (error) {
        console.error('Payment failed:', error);
        alert('Payment failed: ' + error.message);
      } else {
        alert('Payment successful!');
        // Refresh the page to show updated item status
        window.location.reload();
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment failed. Please try again.');
    }
  };

  const handlePlaceBid = async (itemId: string) => {
    try {
      const amount = parseFloat(bidAmounts[itemId]);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid bid amount');
        return;
      }

      await api.post(`/items/${itemId}/bid`, { amount });
      alert('Bid placed successfully!');
      
      // Reset bid amount field
      setBidAmounts(prev => ({ ...prev, [itemId]: '' }));
      
      // Refresh the sale data
      queryClient.invalidateQueries({ queryKey: ['sale', id] });
    } catch (err: any) {
      console.error('Bid error:', err);
      alert(err.response?.data?.message || 'Failed to place bid. Please try again.');
    }
  };

  const handleBidAmountChange = (itemId: string, value: string) => {
    setBidAmounts(prev => ({ ...prev, [itemId]: value }));
  };

  const formatTimeRemaining = (endTime: string) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'Ended';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center">Error loading sale</div>;
  if (!sale) return <div className="min-h-screen flex items-center justify-center">Sale not found</div>;

  // Check if user is organizer or admin
  const isOrganizer = userRole === 'ORGANIZER' || userRole === 'ADMIN';

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

          {isOrganizer && (
            <div className="mt-6 flex flex-wrap gap-3">
              <Link 
                href={`/organizer/edit-sale/${sale.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Sale Details
              </Link>
              <Link 
                href={`/organizer/add-items/${sale.id}`}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Items
              </Link>
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {sale.isAuctionSale ? 'Auction Items' : 'Items for Sale'}
            </h2>
            {isOrganizer && sale.items.length > 0 && (
              <Link 
                href={`/organizer/add-items/${sale.id}`}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add More Items
              </Link>
            )}
          </div>

          {sale.items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No items listed for this sale yet.</p>
              {isOrganizer && (
                <Link 
                  href={`/organizer/add-items/${sale.id}`}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Your First Item
                </Link>
              )}
            </div>
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
                    
                    {/* Auction-specific UI */}
                    {sale.isAuctionSale && item.auctionStartPrice ? (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="text-sm text-gray-600">Current Bid:</span>
                            <span className="font-bold text-blue-600 ml-1">
                              ${item.currentBid ? item.currentBid.toFixed(2) : item.auctionStartPrice.toFixed(2)}
                            </span>
                          </div>
                          {item.auctionEndTime && (
                            <div className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              {formatTimeRemaining(item.auctionEndTime)} left
                            </div>
                          )}
                        </div>
                        
                        <div className="mb-2">
                          <span className="text-sm text-gray-600">
                            Minimum bid: ${(item.currentBid ? item.currentBid + (item.bidIncrement || 1) : item.auctionStartPrice).toFixed(2)}
                          </span>
                        </div>
                        
                        {!isOrganizer && item.status === 'AVAILABLE' && item.auctionEndTime && new Date() < new Date(item.auctionEndTime) && (
                          <div className="flex mb-2">
                            <input
                              type="number"
                              step="0.01"
                              min={item.currentBid ? item.currentBid + (item.bidIncrement || 1) : item.auctionStartPrice}
                              value={bidAmounts[item.id] || ''}
                              onChange={(e) => handleBidAmountChange(item.id, e.target.value)}
                              className="flex-grow px-2 py-1 border border-gray-300 rounded-l text-sm"
                              placeholder="Enter bid amount"
                            />
                            <button
                              onClick={() => handlePlaceBid(item.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-r"
                            >
                              Bid
                            </button>
                          </div>
                        )}
                        
                        {item.status === 'AUCTION_ENDED' && (
                          <div className="text-sm text-center py-2 bg-gray-100 rounded">
                            Auction ended
                          </div>
                        )}
                        
                        {item.status === 'SOLD' && (
                          <div className="text-sm text-center py-2 bg-green-100 text-green-800 rounded">
                            Item sold
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Regular sale item */
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-blue-600">
                          {item.price ? `$${item.price}` : 'Price not set'}
                        </span>
                        {item.currentBid && (
                          <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Current bid: ${item.currentBid}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-2 flex justify-between items-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                        item.status === 'SOLD' ? 'bg-red-100 text-red-800' :
                        item.status === 'AUCTION_ENDED' ? 'bg-gray-100 text-gray-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status.replace(/_/g, ' ')}
                      </span>
                      {isOrganizer && (
                        <Link 
                          href={`/organizer/edit-item/${item.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </Link>
                      )}
                      {!isOrganizer && !sale.isAuctionSale && item.status === 'AVAILABLE' && (
                        <button
                          onClick={() => handleBuyNow(item.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
                        >
                          Buy Now
                        </button>
                      )}
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
