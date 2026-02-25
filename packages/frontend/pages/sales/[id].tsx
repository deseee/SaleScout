import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../../components/AuthContext';
import { format, parseISO } from 'date-fns';
import SaleSubscription from '../../components/SaleSubscription';
import CSVImportModal from '../../components/CSVImportModal';
import SaleShareButton from '../../components/SaleShareButton';

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
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  } catch (error) {
    return 'No end time';
  }
};

const SaleDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [bidAmounts, setBidAmounts] = useState<{[key: string]: string}>({});
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

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
    } catch (err: any) {
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

  const handleImportComplete = () => {
    // Close the modal and refresh the sale data
    setIsImportModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ['sale', id] });
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Error loading sale</div>;
  if (!sale) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Sale not found</div>;

  // Check if user is organizer or admin
  const isOrganizer = user?.role === 'ORGANIZER' || user?.role === 'ADMIN';

  // Format dates safely
  const formatSaleDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'TBA';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return format(date, 'MMMM d, yyyy h:mm a');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Generate JSON-LD for schema.org structured data
  const generateJsonLd = () => {
    if (!sale) return null;

    const eventData = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": sale.title,
      "startDate": sale.startDate,
      "endDate": sale.endDate,
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "eventStatus": "https://schema.org/EventScheduled",
      "location": {
        "@type": "Place",
        "name": sale.title,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": sale.address,
          "addressLocality": sale.city,
          "addressRegion": sale.state,
          "postalCode": sale.zip,
          "addressCountry": "US"
        }
      },
      "description": sale.description,
      "organizer": {
        "@type": "Organization",
        "name": sale.organizer.businessName,
        "telephone": sale.organizer.phone
      },
      "offers": sale.items.map(item => ({
        "@type": "Offer",
        "name": item.title,
        "price": item.price || item.auctionStartPrice || 0,
        "priceCurrency": "USD",
        "availability": item.status === "AVAILABLE" 
          ? "https://schema.org/InStock" 
          : item.status === "SOLD" 
            ? "https://schema.org/SoldOut" 
            : "https://schema.org/PreOrder"
      }))
    };

    return JSON.stringify(eventData);
  };

  const jsonLd = generateJsonLd();

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{sale.title} - SaleScout</title>
        <meta name="description" content={sale.description} />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={sale.title} />
        <meta property="og:description" content={sale.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://salescout.app/sales/${sale.id}`} />
        {sale.photoUrls && sale.photoUrls.length > 0 && (
          <meta property="og:image" content={sale.photoUrls[0]} />
        )}
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={sale.title} />
        <meta name="twitter:description" content={sale.description} />
        {sale.photoUrls && sale.photoUrls.length > 0 && (
          <meta name="twitter:image" content={sale.photoUrls[0]} />
        )}
        
        {/* Dynamic OG Image */}
        <meta 
          property="og:image" 
          content={`/api/og?title=${encodeURIComponent(sale.title)}&date=${encodeURIComponent(
            `${format(new Date(sale.startDate), 'MMM d')} - ${format(new Date(sale.endDate), 'MMM d, yyyy')}`
          )}&location=${encodeURIComponent(`${sale.city}, ${sale.state}`)}`} 
        />
        
        {/* JSON-LD Structured Data */}
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd }}
          />
        )}
      </Head>

      {/* CSV Import Modal */}
      <CSVImportModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        saleId={sale.id}
        onImportComplete={handleImportComplete}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">{sale.address}, {sale.city}, {sale.state} {sale.zip}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">
                  {formatSaleDate(sale.startDate)} - {formatSaleDate(sale.endDate)}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-end">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg mb-3">
                Organized by: {sale.organizer.businessName}
              </div>
              <div className="flex space-x-2">
                {/* Share Button */}
                <SaleShareButton 
                  saleId={sale.id}
                  saleTitle={sale.title}
                  saleDate={`${format(new Date(sale.startDate), 'MMM d')} - ${format(new Date(sale.endDate), 'MMM d, yyyy')}`}
                  saleLocation={`${sale.city}, ${sale.state}`}
                  userId={user?.id}
                />
                
                {/* Post to Nextdoor Button */}
                <button 
                  onClick={() => {
                    const postText = `Check out this estate sale on SaleScout!\n\n${sale.title}\n${sale.address}, ${sale.city}, ${sale.state}\n${format(new Date(sale.startDate), 'MMM d, yyyy h:mm a')} - ${format(new Date(sale.endDate), 'MMM d, yyyy h:mm a')}\n\n${window.location.origin}/sales/${sale.id}`;
                    navigator.clipboard.writeText(postText);
                    alert('Post text copied to clipboard! Paste it into Nextdoor.');
                  }}
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 3 3 0 004.242 0l3-3a3 3 0 00-4.242-4.242l-3 3a3 3 0 000 4.242 1 1 0 101.414-1.414 1 1 0 010-1.414l3-3z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M14.586 10.586a2 2 0 012.828 0 3 3 0 010 4.242l-3 3a3 3 0 01-4.242 0 1 1 0 101.414 1.414 1 1 0 001.414 0l3-3a1 1 0 000-1.414 1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414 3 3 0 010-4.242 1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  Post to Nextdoor
                </button>
              </div>
            </div>
          </div>

          {sale.description && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-900">Description</h2>
              <p className="text-gray-700">{sale.description}</p>
            </div>
          )}

          {/* Subscription section for shoppers */}
          {!isOrganizer && user && (
            <SaleSubscription 
              saleId={sale.id} 
              userEmail={user.email}