import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { useAuth } from '../../components/AuthContext';

interface Purchase {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  item: {
    title: string;
    photoUrls: string[];
  } | null;
  sale: {
    title: string;
  } | null;
}

interface Favorite {
  id: string;
  sale: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    city: string;
    state: string;
    photoUrls: string[];
  } | null;
}

const ShopperDashboard = () => {
  const { user } = useAuth();

  // Fetch user's purchase history
  const { data: purchases = [] } = useQuery({
    queryKey: ['purchases'],
    queryFn: async () => {
      const response = await api.get('/users/purchases');
      return response.data as Purchase[];
    },
  });

  // Fetch user's favorite sales
  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const response = await api.get('/users/favorites');
      return response.data as Favorite[];
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Shopper Dashboard - SaleScout</title>
        <meta name="description" content="Your SaleScout profile" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopper Dashboard</h1>
        </div>

        {/* Profile Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="mt-2 flex items-center">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {user.points} Points
                </span>
                <span className="ml-2 bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {user.role === 'USER' ? 'Shopper' : user.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase History */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Purchase History</h2>
          
          {purchases.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You haven't made any purchases yet.</p>
              <Link 
                href="/" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              >
                Browse Sales
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sale
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchases.map((purchase) => (
                    <tr key={purchase.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {purchase.item?.photoUrls && purchase.item.photoUrls.length > 0 ? (
                            <img 
                              src={purchase.item.photoUrls[0]} 
                              alt={purchase.item.title} 
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          ) : (
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {purchase.item?.title || 'Unknown Item'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {purchase.sale?.title || 'Unknown Sale'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${purchase.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          purchase.status === 'PAID' ? 'bg-green-100 text-green-800' :
                          purchase.status === 'REFUNDED' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {purchase.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(purchase.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Favorite Sales */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Favorite Sales</h2>
          
          {favorites.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You haven't favorited any sales yet.</p>
              <Link 
                href="/" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              >
                Discover Sales
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites
                .filter(favorite => favorite.sale) // Filter out favorites with null sale
                .map((favorite) => (
                  <Link 
                    href={`/sales/${favorite.sale!.id}`} 
                    key={favorite.sale!.id}
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      {favorite.sale!.photoUrls.length > 0 ? (
                        <img 
                          src={favorite.sale!.photoUrls[0]} 
                          alt={favorite.sale!.title} 
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="bg-gray-200 h-48 flex items-center justify-center">
                          <span className="text-gray-500">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-2">{favorite.sale!.title}</h3>
                      <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>{new Date(favorite.sale!.startDate).toLocaleDateString()}</span>
                        <span>{favorite.sale!.city}, {favorite.sale!.state}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(favorite.sale!.endDate) > new Date() ? 'Ongoing' : 'Ended'}
                      </div>
                    </div>
                  </Link>
                ))
              }
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ShopperDashboard;
