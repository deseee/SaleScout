import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth } from '../../components/AuthContext';

interface AffiliateLink {
  id: string;
  saleId: string;
  clicks: number;
  createdAt: string;
  sale: {
    title: string;
    startDate: string;
    endDate: string;
  };
}

const CreatorDashboard = () => {
  const { user } = useAuth();

  // Fetch creator's affiliate links
  const { data: affiliateLinks = [] } = useQuery({
    queryKey: ['affiliate-links'],
    queryFn: async () => {
      const response = await api.get('/affiliate/links');
      return response.data as AffiliateLink[];
    },
  });

  // Fetch creator stats
  const { data: stats } = useQuery({
    queryKey: ['creator-stats'],
    queryFn: async () => {
      const response = await api.get('/affiliate/stats');
      return response.data;
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to view your creator dashboard</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Creator Dashboard - SaleScout</title>
        <meta name="description" content="Manage your affiliate links and track performance" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Creator Dashboard</h1>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Total Links</h3>
            <p className="text-3xl font-bold text-blue-600">{stats?.totalLinks || 0}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Total Clicks</h3>
            <p className="text-3xl font-bold text-green-600">{stats?.totalClicks || 0}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Avg. CTR</h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats?.totalLinks ? `${((stats.totalClicks || 0) / stats.totalLinks).toFixed(2)}%` : '0%'}
            </p>
          </div>
        </div>

        {/* Affiliate Links Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Affiliate Links</h2>
            <Link 
              href="/creator/generate-link" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a