import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../../components/AuthContext';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface Item {
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
  sale: {
    id: string;
    title: string;
  };
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

// Helper function to safely format prices
const formatPrice = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return 'N/A';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 'N/A' : `$${num.toFixed(2)}`;
};

// Helper function to format time remaining
const formatTimeRemaining = (endTime: string | null | undefined): string => {
  if (!endTime) return 'No end time';
  
  try {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'Ended';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  } catch (error) {
    return 'No end time';
  }
};

const ItemDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [bidAmount, setBidAmount] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  const { data: item, isLoading, isError, refetch } = useQuery({
    queryKey: ['item', id],
    queryFn: async () => {
      if (!id) throw new Error('No item ID provided');
      const response = await api.get(`/items/${id}`);
      return response.data as Item;
    },
    enabled: !!id,
  });

  // Check if item is favorited
  const { data: favoriteStatus } = useQuery({
    queryKey: ['favorite', id],
    queryFn: async () => {
      if (!id || !user) return false;
      try {
        const response = await api.get(`/favorites/item/${id}`);
        return response.data.isFavorite;
      } catch {
        return false;
      }
    },
    enabled: !!id && !!user,
  });

  useEffect(() => {
    if (favoriteStatus !== undefined) {
      setIsFavorite(favoriteStatus);
    }
  }, [favoriteStatus]);

  // Timer effect for auction countdown
  useEffect(() => {
    if (!item?.auctionEndTime) return;

    const calculateTimeRemaining = () => {
      setTimeRemaining(formatTimeRemaining(item.auctionEndTime));
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, [item?.auctionEndTime]);

  const handleBuyNow = async () => {
    if (!item) return;
    
    try {
      // Create payment intent
      const response = await api.post('/stripe/create-payment-intent', { itemId: item.id });
      
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
        // Refresh the item data
        refetch();
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      alert('Payment failed. Please try again.');
    }
  };

  const handlePlaceBid = async () => {
    if (!item || !user) return;
    
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid bid amount');
      return;
    }

    try {
      await api.post(`/items/${item.id}/bid`, { amount });
      alert('Bid placed successfully!');
      setBidAmount('');
      // Refresh the item data
      refetch();
    } catch (err: any) {
      console.error('Bid error:', err);
      alert(err.response?.data?.message || 'Failed to place bid. Please try again.');
    }
  };

  const toggleFavorite = async () => {
    if (!item || !user) {
      alert('Please log in to favorite items');
      return;
    }

    try {
      await api.post(`/favorites/item/${item.id}`, { isFavorite: !isFavorite });
      setIsFavorite(!isFavorite);
      queryClient.invalidateQueries({ queryKey: ['favorite', id] });
    } catch (err: any) {
      console.error('Favorite error:', err);
      alert('Failed to update favorite status');
    }
  };

  const getMinimumBid = () => {
    if (!item) return 0;
    if (item.currentBid) {
      return item.currentBid + (item.bidIncrement || 1);
    }
    return item.auctionStartPrice || 0;
  };

  useEffect(() => {
    if (item && item.auctionStartPrice) {
      setBidAmount(getMinimumBid().toString());
    }
  }, [item]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Error loading item</div>;
  if (!item) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Item not found</div>;

  const isOrganizer = user?.role === 'ORGANIZER' || user?.role === 'ADMIN';
  const isAuctionItem = !!item.auctionStartPrice;
  const auctionEnded = item.auctionEndTime && new Date(item.auctionEndTime) < new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{item.title} - SaleScout</title>
        <meta name="description" content={item.description} />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href={`/sales/${item.sale.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to {item.sale.title}
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="p-6">
              {item.photoUrls.length > 0 ? (
                <div className="bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={item.photoUrls[0]} 
                    alt={item.title} 
                    className="w-full h-96 object-contain"
                  />
                </div>
              ) : (
                <div className="bg-gray-200 h-96 flex items-center justify-center rounded-lg">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
              
              {item.photoUrls.length > 1 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {item.photoUrls.slice(1, 4).map((url, index) => (
                    <div key={index} className="bg-gray-200 rounded overflow-hidden">
                      <img 
                        src={url} 
                        alt={`${item.title} ${index + 2}`} 
                        className="w-full h-24 object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
                <button 
                  onClick={toggleFavorite}
                  className="text-2xl focus:outline-none"
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  {isFavorite ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-gray-600 mb-6">{item.description}</p>
              
              <div className="mb-6">
                <Link href={`/sales/${item.sale.id}`} className="text-blue-600 hover:text-blue-800">
                  ← Back to {item.sale.title}
                </Link>
              </div>

              {isAuctionItem ? (
                /* Auction Item */
                <div className="border-t border-b border-gray-200 py-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-sm text-gray-600">Current Bid:</span>
                      <span className="font-bold text-blue-600 ml-1 text-xl">
                        {formatPrice(item.currentBid || item.auctionStartPrice)}
                      </span>
                    </div>
                    {item.auctionEndTime && (
                      <div className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded">
                        {timeRemaining} left
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-sm text-gray-600">
                      Minimum bid: {formatPrice(getMinimumBid())}
                    </span>
                  </div>
                  
                  {!isOrganizer && user && item.status === 'AVAILABLE' && !auctionEnded && (
                    <div className="flex flex-col space-y-3">
                      <div className="flex">
                        <input
                          type="number"
                          step="0.01"
                          min={getMinimumBid()}
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-l text-gray-900"
                          placeholder="Enter bid amount"
                        />
                        <button
                          onClick={handlePlaceBid}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r"
                        >
                          Place Bid
                        </button>
                      </div>
                      <button
                        onClick={() => setBidAmount(getMinimumBid().toString())}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Set to minimum bid
                      </button>
                    </div>
                  )}
                  
                  {auctionEnded && (
                    <div className="text-center py-2 bg-gray-100 rounded text-gray-600">
                      Auction ended
                    </div>
                  )}
                  
                  {!user && (
                    <div className="text-center py-2">
                      <Link href="/login" className="text-blue-600 hover:text-blue-800">
                        Log in to place a bid
                      </Link>
                    </div>
                  )}
                  
                  {item.status === 'SOLD' && (
                    <div className="text-center py-2 bg-green-100 text-green-800 rounded">
                      Item sold
                    </div>
                  )}
                </div>
              ) : (
                /* Fixed Price Item */
                <div className="border-t border-b border-gray-200 py-6 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">{formatPrice(item.price)}</span>
                    {!isOrganizer && user && item.status === 'AVAILABLE' && (
                      <button
                        onClick={handleBuyNow}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                      >
                        Buy Now
                      </button>
                    )}
                  </div>
                  
                  {!user && (
                    <div className="text-center mt-4">
                      <Link href="/login" className="text-blue-600 hover:text-blue-800">
                        Log in to buy this item
                      </Link>
                    </div>
                  )}
                  
                  {item.status === 'SOLD' && (
                    <div className="mt-4 text-center py-2 bg-red-100 text-red-800 rounded">
                      Item sold
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  item.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                  item.status === 'SOLD' ? 'bg-red-100 text-red-800' :
                  item.status === 'AUCTION_ENDED' ? 'bg-gray-100 text-gray-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ItemDetailPage;
