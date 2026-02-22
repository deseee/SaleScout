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

  if (!user || (user.role !== 'ORGANIZER' && user.role !== 'ADMIN')) {
    return <div>Access denied</div>;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your estate sales and track performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">12</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Revenue</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">$24,560</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.385-1.543 3 3 0 00-2.615.543A3 3 0 009 18v2h5m-7 0H4a2 2 0 01-2-2v-2a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2h-5m-7 0v-5a2 2 0 012-2h10a2 2 0 012 2v5" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Items Sold</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">1,842</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Your Sales</h3>
              <button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {showCreateForm ? 'Cancel' : 'Create New Sale'}
              </button>
            </div>
          </div>
          
          {showCreateForm && (
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Create New Sale</h3>
              
              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
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
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
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
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
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
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
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
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
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
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
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
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
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
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-1">
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
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
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-1">
                    <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
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
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                      <label htmlFor="isAuction" className="ml-2 block text-sm text-gray-900">
                        Is this an auction sale?
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={geocoding}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {geocoding ? 'Creating...' : 'Create Sale'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {loading ? (
            <div className="px-4 py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading your sales...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sale
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        <div className="text-sm text-gray-500">{sale.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${sale.status === 'published' ? 'bg-blue-100 text-blue-800' : 
                            sale.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'}`}>
                          {sale.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.items}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href={`/sales/${sale.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                          View
                        </a>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
