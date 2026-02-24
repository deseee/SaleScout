import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../../lib/api';

// Zod schema for form validation
const itemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  price: z.string().optional(),
  auctionStartPrice: z.string().optional(),
  bidIncrement: z.string().optional(),
  auctionEndTime: z.string().optional(),
  status: z.enum(['AVAILABLE', 'SOLD', 'RESERVED', 'AUCTION_ENDED']),
  isAuctionItem: z.boolean(),
  photoUrls: z.array(z.string()).optional(),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface Sale {
  id: string;
  title: string;
  organizerId: string;
}

interface Item {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  auctionStartPrice: number | null;
  status: string;
  photoUrls: string[];
}

const AddItemsPage = () => {
  const router = useRouter();
  const { saleId } = router.query;
  const queryClient = useQueryClient();
  
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  // Fetch sale details
  const { data: sale, isLoading: saleLoading, isError: saleError } = useQuery({
    queryKey: ['sale', saleId],
    queryFn: async () => {
      if (!saleId) throw new Error('No sale ID provided');
      const response = await api.get(`/sales/${saleId}`);
      return response.data as Sale;
    },
    enabled: !!saleId,
  });

  // Fetch items for this sale
  const { data: items = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['items', saleId],
    queryFn: async () => {
      if (!saleId) return [];
      const response = await api.get(`/items?saleId=${saleId}`);
      return response.data as Item[];
    },
    enabled: !!saleId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      auctionStartPrice: '',
      bidIncrement: '1',
      auctionEndTime: '',
      status: 'AVAILABLE',
      isAuctionItem: false,
    },
  });

  const isAuctionItem = watch('isAuctionItem');

  const addPhotoUrl = () => {
    if (photoUrl.trim()) {
      setPhotoUrls([...photoUrls, photoUrl.trim()]);
      setPhotoUrl('');
    }
  };

  const removePhotoUrl = (index: number) => {
    setPhotoUrls(photoUrls.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ItemFormData) => {
    try {
      // Build base item data
      const itemData: Record<string, any> = {
        saleId: saleId as string,
        title: data.title,
        description: data.description || '',
        status: data.status,
        photoUrls: photoUrls,
      };

      // Handle auction vs fixed price
      if (data.isAuctionItem) {
        // Only send auction fields if they have values (backend may require them)
        if (data.auctionStartPrice) {
          itemData.auctionStartPrice = parseFloat(data.auctionStartPrice);
        }
        if (data.bidIncrement) {
          itemData.bidIncrement = parseFloat(data.bidIncrement);
        }
        // Convert datetime-local string to ISO string for Prisma, only if provided
        if (data.auctionEndTime) {
          itemData.auctionEndTime = new Date(data.auctionEndTime).toISOString();
        }
        // If auctionEndTime is empty, do NOT send the field at all (omit it)
      } else {
        if (data.price) {
          itemData.price = parseFloat(data.price);
        }
      }

      // Remove undefined or null values to avoid Prisma validation issues
      Object.keys(itemData).forEach(key => {
        if (itemData[key] === undefined || itemData[key] === null) {
          delete itemData[key];
        }
      });

      await api.post('/items', itemData);
      
      // Refresh items list
      queryClient.invalidateQueries({ queryKey: ['items', saleId] });
      
      // Reset form
      reset();
      setPhotoUrls([]);
    } catch (error: any) {
      console.error('Error creating item:', error);
      alert(error.response?.data?.message || 'Failed to create item');
    }
  };

  if (saleLoading) return <div className="min-h-screen flex items-center justify-center">Loading sale details...</div>;
  if (saleError) return <div className="min-h-screen flex items-center justify-center">Error loading sale</div>;
  if (!sale && saleId) return <div className="min-h-screen flex items-center justify-center">Sale not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Add Items - SaleScout</title>
        <meta name="description" content="Add items to your sale" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add Items to "{sale?.title}"</h1>
          <div className="flex space-x-4">
            <Link 
              href={`/sales/${saleId}`} 
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              View Sale
            </Link>
            <Link 
              href="/organizer/dashboard" 
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Item Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Add New Item</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Item Title *
                  </label>
                  <input
                    id="title"
                    {...register('title')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    {...register('description')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                </div>

                <div className="flex items-center mb-4">
                  <input
                    id="isAuctionItem"
                    type="checkbox"
                    {...register('isAuctionItem')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isAuctionItem" className="ml-2 block text-sm text-gray-900">
                    This is an auction item
                  </label>
                </div>

                {!isAuctionItem ? (
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      id="price"
                      type="number"
                      step="0.01"
                      {...register('price')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="auctionStartPrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Starting Price ($)
                      </label>
                      <input
                        id="auctionStartPrice"
                        type="number"
                        step="0.01"
                        {...register('auctionStartPrice')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="bidIncrement" className="block text-sm font-medium text-gray-700 mb-1">
                        Bid Increment ($)
                      </label>
                      <input
                        id="bidIncrement"
                        type="number"
                        step="0.01"
                        {...register('bidIncrement')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="auctionEndTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Auction End Time (Optional)
                      </label>
                      <input
                        id="auctionEndTime"
                        type="datetime-local"
                        {...register('auctionEndTime')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="SOLD">Sold</option>
                    <option value="RESERVED">Reserved</option>
                    <option value="AUCTION_ENDED">Auction Ended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo URLs
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      placeholder="https://example.com/photo.jpg"
                    />
                    <button
                      type="button"
                      onClick={addPhotoUrl}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 rounded-r-md"
                    >
                      Add
                    </button>
                  </div>
                  {photoUrls.length > 0 && (
                    <div className="mt-2">
                      {photoUrls.map((url, index) => (
                        <div key={index} className="flex items-center mb-1">
                          <span className="flex-grow text-sm text-gray-600 truncate">{url}</span>
                          <button
                            type="button"
                            onClick={() => removePhotoUrl(index)}
                            className="text-red-600 hover:text-red-800 ml-2"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Existing Items List */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Existing Items</h2>
              
              {itemsLoading ? (
                <p>Loading items...</p>
              ) : items.length === 0 ? (
                <p className="text-gray-600">No items added yet.</p>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {item.description?.substring(0, 100)}{item.description && item.description.length > 100 ? '...' : ''}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="font-bold text-blue-600">
                          {item.price ? `$${item.price}` : 
                           item.auctionStartPrice ? `Start: $${item.auctionStartPrice}` : 
                           'Price not set'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                          item.status === 'SOLD' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                      {item.photoUrls.length > 0 && (
                        <div className="mt-2">
                          <img 
                            src={item.photoUrls[0]} 
                            alt={item.title} 
                            className="w-full h-32 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddItemsPage;