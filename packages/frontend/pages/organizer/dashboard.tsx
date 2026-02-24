import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api'; // Use the api client with auth header support

interface Sale {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  city: string;
  state: string;
  status: string;
  items: {
    id: string;
  }[];
}

interface PaymentStatus {
  onboarded: boolean;
  needsSetup: boolean;
  chargesEnabled: boolean;
  detailsSubmitted: boolean;
}

const OrganizerDashboard = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [paymentStatusLoading, setPaymentStatusLoading] = useState(true);

  // Fetch organizer's sales
  const { data: sales, isLoading, isError } = useQuery({
    queryKey: ['organizer-sales'],
    queryFn: async () => {
      const response = await api.get('/sales');
      // In a real app, this would be filtered by organizer ID on the backend
      // For now, we're getting all sales but will filter by checking items array
      const allSales = response.data.sales || response.data;
      
      // Ensure each sale has an items array
      return Array.isArray(allSales) 
        ? allSales.map(sale => ({
            ...sale,
            items: Array.isArray(sale.items) ? sale.items : []
          }))
        : [];
    },
  });

  // Fetch payment status
  const fetchPaymentStatus = async () => {
    setPaymentStatusLoading(true);
    try {
      const response = await api.get('/stripe/account-status');
      setPaymentStatus(response.data);
      
      // Show success message if returned from Stripe onboarding
      if (router.query.success === 'true') {
        alert('Payment setup completed successfully!');
        // Remove query param from URL
        router.replace('/organizer/dashboard', undefined, { shallow: true });
      }
    } catch (error) {
      console.error('Error fetching payment status:', error);
      setPaymentStatus(null);
    } finally {
      setPaymentStatusLoading(false);
    }
  };

  // Fetch payment status on mount and when query params change
  useEffect(() => {
    fetchPaymentStatus();
  }, [router.query]);

  const handleSetupPayments = async () => {
    try {
      const response = await api.post('/stripe/create-connect-account');
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error setting up payments:', error);
      alert('Failed to set up payments. Please try again.');
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center">Error loading dashboard</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Organizer Dashboard - SaleScout</title>
        <meta name="description" content="Manage your estate sales" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
          <div className="flex space-x-4">
            {/* Payment Setup Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-bold mb-2">Payment Processing</h2>
              
              {paymentStatusLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm">Loading payment status...</span>
                </div>
              ) : paymentStatus?.onboarded ? (
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-green-600 font-medium text-sm">✓ Payments Enabled</p>
                    <p className="text-gray-600 text-xs mt-1">Customers can purchase items</p>
                  </div>
                  <button
                    onClick={handleSetupPayments}
                    className="ml-0 sm:ml-3 mt-2 sm:mt-0 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-1 px-3 rounded"
                  >
                    Manage Account
                  </button>
                </div>
              ) : paymentStatus?.needsSetup ? (
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-gray-700 font-medium text-sm">Payment Setup Required</p>
                    <p className="text-gray-600 text-xs mt-1">Enable payments to receive money</p>
                  </div>
                  <button
                    onClick={handleSetupPayments}
                    className="ml-0 sm:ml-3 mt-2 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-1 px-3 rounded"
                  >
                    Setup Payments
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-yellow-600 font-medium text-sm">⚠ Setup Incomplete</p>
                    <p className="text-gray-600 text-xs mt-1">Finish Stripe onboarding</p>
                  </div>
                  <button
                    onClick={handleSetupPayments}
                    className="ml-0 sm:ml-3 mt-2 sm:mt-0 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold py-1 px-3 rounded"
                  >
                    Continue Setup
                  </button>
                </div>
              )}
            </div>

            <Link 
              href="/organizer/create-sale" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center self-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Sale
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Sales</h3>
            <p className="text-3xl font-bold text-blue-600">{sales?.length || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Sales</h3>
            <p className="text-3xl font-bold text-green-600">
              {sales?.filter(sale => sale.status === 'PUBLISHED').length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Items</h3>
            <p className="text-3xl font-bold text-purple-600">
              {sales?.reduce((total, sale) => total + (sale.items?.length || 0), 0) || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Your Sales</h2>
          {sales?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You haven't created any sales yet.</p>
              <Link 
                href="/organizer/create-sale" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Your First Sale
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{sale.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(sale.startDate).toLocaleDateString()} - {new Date(sale.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.city}, {sale.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          sale.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                          sale.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {sale.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.items?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/sales/${sale.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                          View
                        </Link>
                        <Link href={`/organizer/edit-sale/${sale.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                          Edit
                        </Link>
                        <Link href={`/organizer/add-items/${sale.id}`} className="text-green-600 hover:text-green-900">
                          Add Items
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrganizerDashboard;
