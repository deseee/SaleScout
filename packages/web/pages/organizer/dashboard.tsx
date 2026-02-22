import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import { useAuth } from '../../lib/auth';
import apiClient from '../../lib/api';
import { geocodeAddress } from '../../lib/geocode';

// Mock data for sales
const mockSales = [
  {
    id: '1',
    title: 'Downtown Estate Sale',
    date: '2023-06-15',
    status: 'published',
    items: 142,
  },
  {
    id: '2',
    title: 'Heritage Hill Sale',
    date: '2023-06-22',
    status: 'draft',
    items: 87,
  },
  {
    id: '3',
    title: 'Eastown Moving Sale',
    date: '2023-07-05',
    status: 'live',
    items: 203,
  },
];

export default function Dashboard() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    address: '',
    city: '',
    state: 'MI',
    zip: '',
    isAuction: false,
  });
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState('');
  const [stripeOnboardingUrl, setStripeOnboardingUrl] = useState<string | null>(null);
  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not organizer or admin
    if (user && user.role !== 'ORGANIZER' && user.role !== 'ADMIN') {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSales(mockSales);
      setLoading(false);
    }, 1000);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData({
      ...formData,
      [name]: val
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setGeocoding(true);

    try {
      // Geocode address
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`;
      const geocodeResult = await geocodeAddress(fullAddress);
      
      if (!geocodeResult) {
        setError('Could not geocode address. Please check the address details.');
        setGeocoding(false);
        return;
      }

      // In a real implementation, you would call your API here
      // For now, we'll simulate a successful creation
      console.log('Creating sale with data:', {
        ...formData,
        latitude: geocodeResult.lat,
        longitude: geocodeResult.lng
      });

      // Reset form and hide it
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        address: '',
        city: '',
        state: 'MI',
        zip: '',
        isAuction: false,
      });
      setShowCreateForm(false);
      alert('Sale created successfully!');
    } catch (err) {
      setError('Failed to create sale. Please try again.');
    } finally {
      setGeocoding(false);
    }
  };

  const handleSetupPayments = async () => {
    setOnboardingLoading(true);
    try {
      // Call backend to create Stripe Connect account
      const response = await apiClient.post('/stripe/create-connect-account');
      setStripeOnboardingUrl(response.data.url);
      
      // Redirect to Stripe onboarding
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      setError('Failed to initiate Stripe onboarding. Please try again.');
    } finally {
      setOnboardingLoading(false);
    }
  };

  if (!user || (user.role !== 'ORGANIZER' && user.role !== 'ADMIN')) {
    return <div>Access denied</div>;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Organizer Dashboard</h1>
          <p className="mt-1 text-gray-600">Manage your estate sales and track performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-3 py-4 sm:p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-2">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-3 w-0 flex-1">
                  <dl>
                    <dt className="text-xs font-medium text-gray-500 truncate">Total Sales</dt>
                    <dd className="flex items-baseline">
                      <div className="text-lg font-semibold text-gray-900">12</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-3 py-4 sm:p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 w-0 flex-1">
                  <dl>
                    <dt className="text-xs font-medium text-gray-500 truncate">Revenue</dt>
                    <dd className="flex items-baseline">
                      <div className="text-lg font-semibold text-gray-900">$24,560</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-3 py-4 sm:p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-2">
                  <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.385-1.543 3 3 0 00-2.615.543A3 3 0 009 18v2h5m-7 0H4a2 2 0 01-2-2v-2a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2h-5m-7 0v-5a2 2 0 012-2h10a2 2 0 012 2v5" />
                  </svg>
                </div>
                <div className="ml-3 w-0 flex-1">
                  <dl>
                    <dt className="text-xs font-medium text-gray-500 truncate">Items Sold</dt>
                    <dd className="flex items-baseline">
                      <div className="text-lg font-semibold text-gray-900">1,842</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Your Sales</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={handleSetupPayments}
                  disabled={onboardingLoading}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {onboardingLoading ? 'Setting up...' : 'Setup Payments'}
                </button>
                <button 
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {showCreateForm ? 'Cancel' : 'Create New Sale'}
                </button>
              </div>
            </div>
          </div>
          
          {showCreateForm && (
            <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-3">Create New Sale</h3>
              
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="title" className="block text-xs font-medium text-gray-700">
                      Sale Title
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-sm border-gray-300 rounded-md py-1.5"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-xs font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={2}
                        value={formData.description}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-sm border border-gray-300 rounded-md py-1.5"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="startDate" className="block text-xs font-medium text-gray-700">
                      Start Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-sm border-gray-300 rounded-md py-1.5"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="startTime" className="block text-xs font-medium text-gray-700">
                      Start Time
                    </label>
                    <div className="mt-1">
                      <input
                        type="time"
                        name="startTime"
                        id="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-sm border-gray-300 rounded-md py-1.5"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="endDate" className="block text-xs font-medium text-gray-700">
                      End Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-sm border-gray-300 rounded-md py-1.5"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="endTime" className="block text-xs font-medium text-gray-700">
                      End Time
                    </label>
                    <div className="mt-1">
                      <input
                        type="time"
                        name="endTime"
                        id="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-sm border-gray-300 rounded-md py-1.5"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="address" className="block text-xs font-medium text-gray-700">
                      Street Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-sm border-gray-300 rounded-md py-1.5"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="city" className="block text-xs font-medium text-gray-700">
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-sm border-gray-300 rounded-md py-1.5"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-1">
                    <label htmlFor="state" className="block text-xs font-medium text-gray-700">
                      State
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="state"
                        id="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-sm border-gray-300 rounded-md py-1.5"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-1">
                    <label htmlFor="zip" className="block text-xs font-medium text-gray-700">
                      ZIP
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="zip"
                        id="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-sm border-gray-300 rounded-md py-1.5"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <div className="flex items-center">
                      <input
                        id="isAuction"
                        name="isAuction"
                        type="checkbox"
                        checked={formData.isAuction}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isAuction" className="ml-2 block text-xs text-gray-900">
                        This is an auction sale
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="bg-white py-1.5 px-3 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={geocoding}
                    className="ml-2 inline-flex justify-center py-1.5 px-3 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {geocoding ? 'Creating...' : 'Create Sale'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="px-4 py-4 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Sales</h3>
            <div className="mt-3">
              {loading ? (
                <div className="text-center py-3">
                  <p>Loading sales...</p>
                </div>
              ) : sales.length === 0 ? (
                <div className="text-center py-3">
                  <p className="text-gray-500">No sales yet. Create your first sale!</p>
                </div>
              ) : (
                <div className="overflow-hidden bg-white shadow sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {sales.map((sale) => (
                      <li key={sale.id}>
                        <div className="px-3 py-3 sm:px-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <p className="truncate text-sm font-medium text-blue-600">{sale.title}</p>
                              <div className="ml-2 flex-shrink-0 flex">
                                <p className="px-2 inline-flex text-xs leading-4 font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                                  {sale.status}
                                </p>
                              </div>
                            </div>
                            <div className="ml-2 flex flex-shrink-0">
                              <p className="text-xs text-gray-500">{sale.date}</p>
                            </div>
                          </div>
                          <div className="mt-1 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-xs text-gray-500">
                                {sale.items} items listed
                              </p>
                            </div>
                            <div className="mt-1 flex items-center text-xs text-gray-500 sm:mt-0">
                              <button className="font-medium text-blue-600 hover:text-blue-500">
                                View details
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
