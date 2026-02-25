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

interface LineEntry {
  id: string;
  position: number;
  status: 'WAITING' | 'CALLED' | 'SERVED' | 'CANCELLED';
  user: {
    name: string;
    phone: string;
  };
}

const OrganizerDashboard = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [paymentStatusLoading, setPaymentStatusLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [activeTab, setActiveTab] = useState('sales');
  const [lineEntries, setLineEntries] = useState<LineEntry[]>([]);
  const [currentLineEntry, setCurrentLineEntry] = useState<LineEntry | null>(null);

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

  const handleGenerateQR = async (sale: Sale) => {
    try {
      setSelectedSale(sale);
      const response = await api.post(`/sales/${sale.id}/generate-qr`, {}, { responseType: 'blob' });
      const imageUrl = URL.createObjectURL(response.data);
      setQrCodeUrl(imageUrl);
      setShowQRModal(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code. Please try again.');
    }
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qr-code-${selectedSale?.title.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Start line for a sale
  const startLine = async (saleId: string) => {
    try {
      const response = await api.post(`/lines/${saleId}/start`);
      alert('Line started successfully! SMS notifications sent.');
      queryClient.invalidateQueries({ queryKey: ['line-status', saleId] });
    } catch (error) {
      console.error('Error starting line:', error);
      alert('Failed to start line. Please try again.');
    }
  };

  // Call next person in line
  const callNext = async (saleId: string) => {
    try {
      const response = await api.post(`/lines/${saleId}/next`);
      alert('Next person called successfully!');
      queryClient.invalidateQueries({ queryKey: ['line-status', saleId] });
    } catch (error) {
      console.error('Error calling next person:', error);
      alert('Failed to call next person. Please try again.');
    }
  };

  // Mark person as served
  const markAsServed = async (lineEntryId: string) => {
    try {
      await api.post(`/lines/entry/${lineEntryId}/served`);
      alert('Person marked as served!');
      queryClient.invalidateQueries({ queryKey: ['line-status', selectedSale?.id] });
    } catch (error) {
      console.error('Error marking as served:', error);
      alert('Failed to mark person as served. Please try again.');
    }
  };

  // Fetch line status
  const fetchLineStatus = async (saleId: string) => {
    try {
      const response = await api.get(`/lines/${saleId}/status`);
      setLineEntries(response.data);
      const calledEntry = response.data.find((entry: LineEntry) => entry.status === 'CALLED');
      setCurrentLineEntry(calledEntry || null);
    } catch (error) {
      console.error('Error fetching line status:', error);
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

      {/* QR Code Modal */}
      {showQRModal && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">QR Code Sign</h3>
              <button 
                onClick={() => setShowQRModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-center mb-6">
              <p className="mb-4">Scan this QR code to access the sale page directly</p>
              <div className="border-2 border-gray-300 rounded-lg p-4 inline-block">
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
              </div>
              <p className="mt-4 text-sm text-gray-600">Sale: {selectedSale.title}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownloadQR}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Download PNG
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Print
              </button>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>Instructions:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Print this QR code and place it at your sale location</li>
                <li>Visitors can scan it with their phone camera to access the sale page</li>
                <li>You can track scan activity in your analytics</li>
              </ul>
            </div>
          </div>
        </div>
      )}

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

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('sales')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sales'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sales
            </button>
            <button
              onClick={() => setActiveTab('line')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'line'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Line Management
            </button>
          </nav>
        </div>

        {/* Line Management Tab */}
        {activeTab === 'line' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Line Management</h2>
            
            {sales && sales.length > 0 ? (
              <div className="mb-6">
                <label htmlFor="sale-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Sale
                </label>
                <select
                  id="sale-select"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  onChange={(e) => {
                    const sale = sales.find(s => s.id === e.target.value);
                    if (sale) {
                      setSelectedSale(sale);
                      fetchLineStatus(sale.id);
                    }
                  }}
                  value={selectedSale?.id || ''}
                >
                  <option value="">Choose a sale</option>
                  {sales.map(sale => (
                    <option key={sale.id} value={sale.id}>
                      {sale.title} ({new Date(sale.startDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {selectedSale ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Current Line for {selectedSale.title}</h3>
                  <div className="space-x-2">
                    <button
                      onClick={() => startLine(selectedSale.id)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Start Line
                    </button>
                    <button
                      onClick={() => callNext(selectedSale.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Call Next
                    </button>
                    <button
                      onClick={() => fetchLineStatus(selectedSale.id)}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                {currentLineEntry && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          <span className="font-bold">Currently Called:</span> {currentLineEntry.user.name} (Position #{currentLineEntry.position})
                          <button
                            onClick={() => markAsServed(currentLineEntry.id)}
                            className="ml-4 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-2 rounded"
                          >
                            Mark as Served
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {lineEntries.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Position
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {lineEntries.map((entry) => (
                          <tr key={entry.id} className={entry.status === 'CALLED' ? 'bg-yellow-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{entry.position}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {entry.user.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {entry.user.phone}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                entry.status === 'WAITING' ? 'bg-blue-100 text-blue-800' :
                                entry.status === 'CALLED' ? 'bg-yellow-100 text-yellow-800' :
                                entry.status === 'SERVED' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {entry.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No line entries yet. Start the line to begin managing visitors.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Select a sale to manage its line</p>
              </div>
            )}
          </div>
        )}

        {/* Sales Tab */}
        {activeTab === 'sales' && (
          <div>
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
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"