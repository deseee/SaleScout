import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

interface Sale {
  id: string;
  title: string;
}

interface ItemFormData {
  title: string;
  description: string;
  price: string;
  auctionStartPrice: string;
  bidIncrement: string;
  auctionEndTime: string;
  status: string;
  isAuctionItem: boolean;
}

const AddItemsPage = () => {
  const router = useRouter();
  const { saleId } = router.query;
  
  const [formData, setFormData] = useState<ItemFormData>({
    title: '',
    description: '',
    price: '',
    auctionStartPrice: '',
    bidIncrement: '',
    auctionEndTime: '',
    status: 'AVAILABLE',
    isAuctionItem: false,
  });
  
  const [photoUrls, setPhotoUrls] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch sale details
  const { data: sale, isLoading: saleLoading } = useQuery({
    queryKey: ['sale', saleId],
    queryFn: async () => {
      if (!saleId) throw new Error('No sale ID provided');
      const response = await api.get(`/sales/${saleId}`);
      return response.data as Sale;
    },
    enabled: !!saleId,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const handlePhotoUrlChange = (index: number, value: string) => {
    const newPhotoUrls = [...photoUrls];
    newPhotoUrls[index] = value;
    setPhotoUrls(newPhotoUrls);
  };

  const addPhotoUrlField = () => {
    setPhotoUrls([...photoUrls, '']);
  };

  const removePhotoUrlField = (index: number) => {
    if (photoUrls.length > 1) {
      const newPhotoUrls = photoUrls.filter((_, i) => i !== index);
      setPhotoUrls(newPhotoUrls);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Prepare item data
      const itemData: any = {
        saleId: saleId as string,
        title: formData.title,
        description: formData.description,
        status: formData.status,
        photoUrls: photoUrls.filter(url => url.trim() !== ''), // Filter out empty URLs
      };

      // Add price or auction info based on item type
      if (formData.isAuctionItem) {
        itemData.auctionStartPrice = parseFloat(formData.auctionStartPrice) || 0;
        itemData.bidIncrement = parseFloat(formData.bidIncrement) || 1;
        itemData.auctionEndTime = formData.auctionEndTime || null;
      } else {
        itemData.price = parseFloat(formData.price) || 0;
      }

      // Create item
      const response = await api.post('/items', itemData);
      
      setSuccess('Item added successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        auctionStartPrice: '',
        bidIncrement: '',
        auctionEndTime: '',
        status: 'AVAILABLE',
        isAuctionItem: false,
      });
      setPhotoUrls(['']);
    } catch (err: any) {
      console.error('Error creating item:', err);
      setError(err.response?.data?.message || 'Failed to create item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (saleLoading) return <div className="min-h-screen flex items-center justify-center">Loading sale details...</div>;
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
          <Link 
            href="/organizer/dashboard" 
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="text-sm text-red-700">
                {error}
              </div>
            </div>
          )}
          
          {success && (
            <div className="rounded-md bg-green-50 p-4 mb-6">
              <div className="text-sm text-green-700">
                {success}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Item Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="e.g. Victorian Wooden Secretary Desk"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="Describe the item, condition, special features, etc."
              />
            </div>

            <div className="flex items-center mb-4">
              <input
                id="isAuctionItem"
                name="isAuctionItem"
                type="checkbox"
                checked={formData.isAuctionItem}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isAuctionItem" className="ml-2 block text-sm text-gray-900">
                This is an auction item
              </label>
            </div>

            {!formData.isAuctionItem ? (
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  placeholder="0.00"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="auctionStartPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Starting Price ($)
                  </label>
                  <input
                    type="number"
                    id="auctionStartPrice"
                    name="auctionStartPrice"
                    value={formData.auctionStartPrice}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label htmlFor="bidIncrement" className="block text-sm font-medium text-gray-700 mb-1">
                    Bid Increment ($)
                  </label>
                  <input
                    type="number"
                    id="bidIncrement"
                    name="bidIncrement"
                    value={formData.bidIncrement}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="1.00"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="auctionEndTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Auction End Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    id="auctionEndTime"
                    name="auctionEndTime"
                    value={formData.auctionEndTime}
                    onChange={handleChange}
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
                name="status"
                value={formData.status}
                onChange={handleChange}
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
              {photoUrls.map((url, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => handlePhotoUrlChange(index, e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    placeholder="https://example.com/photo.jpg"
                  />
                  {photoUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePhotoUrlField(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 rounded-r-md"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addPhotoUrlField}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add another photo URL
              </button>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Link 
                href="/organizer/dashboard" 
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddItemsPage;
