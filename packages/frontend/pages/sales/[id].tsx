import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../../components/AuthContext';
import { format, parseISO } from 'date-fns';

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
  const { user }