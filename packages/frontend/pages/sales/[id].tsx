import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
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
    status: string;
    photoUrls: string[];
  }[];
  isAuctionSale: boolean;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const SaleDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

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
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5