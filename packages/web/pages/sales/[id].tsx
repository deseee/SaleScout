import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../components/layout';
import { useAuth } from '../../lib/auth';
import apiClient from '../../lib/api';

// Mock data for a single sale
const mockSale = {
  id: '1',
  title: 'Downtown Estate Sale',
  description: 'A fantastic estate sale featuring furniture, antiques, collectibles, and household items.',
  date: 'June 15, 2023',
  time: '9:00 AM - 4:00 PM',
  address: '123 Main Street, Grand Rapids, MI 49503',
  organizer: 'John Smith',
  items: [
    { 
      id: '1', 
      name: 'Antique Wooden Desk', 
      price: 25000, // in cents
      category: 'Furniture',
      isAuctionItem: false
    },
    { 
      id: '2', 
      name: 'Vintage China Set', 
      price: 18000, // in cents
      category: 'Kitchen',
      isAuctionItem: false
    },
    { 
      id: '3', 
      name: 'Oil Paintings Collection', 
      price: 45000, // in cents
      category: 'Art',
      isAuctionItem: true,
      auctionEndTime: '2023-06-20T18:00:00Z',
      bidIncrement: 500 // in cents
    },
    { 
      id: '4', 
      name: 'Silver Flatware Set', 
      price: 12000, // in cents
      category: 'Kitchen',
      isAuctionItem: false
    },
    { 
      id: '5', 
      name: 'Leather Armchair', 
      price: 9500, // in cents
      category: 'Furniture',
      isAuctionItem: false
    },
  ],
};

export default function SaleDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [showItemForm, setShowItemForm] = useState(false);
  const [itemFormData, setItemFormData] = useState({
    title: '',
    description: '',
    price: '',
    isAuctionItem: false,
    auctionEndTime: '',
    bidIncrement: '',
  });
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // In a real implementation, you would fetch the sale data based on the ID
  const sale = mockSale;

  useEffect(() => {
    // Load Stripe.js dynamically
    if (typeof window !== 'undefined') {
      const loadStripe = async () => {
        const stripeModule = await import('@stripe/stripe-js');
        const stripeInstance = await stripeModule.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        setStripe(stripeInstance);
      };
      loadStripe();
    }
  }, []);

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setItemFormData({
      ...itemFormData,
      [name]: val
    });
  };

  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would submit the item data to your API
    console.log('Creating item:', itemFormData);
    setShowItemForm(false);
    setItemFormData({
      title: '',
      description: '',
      price: '',
      isAuctionItem: false,
      auctionEndTime: '',
      bidIncrement: '',
    });
    alert('Item added successfully!');
  };

  const handleReserveClick = async (item: any) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setSelectedItem(item);
    setPaymentLoading(true);
    setPaymentError(null);

    try {
      // Create payment intent
      const response = await apiClient.post('/stripe/create-payment-intent', {
        itemId: item.id,
        amount: item.price,
        currency: 'usd'
      });

      setClientSecret(response.data.clientSecret);
    } catch (error) {
      setPaymentError('Failed to initiate payment. Please try again.');
      console.error('Payment initiation error:', error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) return;

    const result = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/sales/${id}`,
      },
    });

    if (result.error) {
      setPaymentError(result.error.message || 'Payment failed');
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to sales
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl leading-6 font-bold text-gray-900">{sale.title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{sale.description}</p>
              </div>
              {user && (user.role === 'ORGANIZER' || user.role === 'ADMIN') && (
                <button 
                  onClick={() => setShowItemForm(!showItemForm)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {showItemForm ? 'Cancel' : 'Add Items'}
                </button>
              )}
            </div>
          </div>
          
          {showItemForm && (
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Item</h3>
              
              <form onSubmit={handleItemSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Item Title
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={itemFormData.title}
                        onChange={handleItemChange}
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
                        value={itemFormData.description}
                        onChange={handleItemChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price (in USD)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="price"
                        id="price"
                        value={itemFormData.price}
                        onChange={handleItemChange}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <div className="flex items-center">
                      <input
                        id="isAuctionItem"
                        name="isAuctionItem"
                        type="checkbox"
                        checked={itemFormData.isAuctionItem}
                        onChange={handleItemChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isAuctionItem" className="ml-2 block text-sm text-gray-900">
                        Is this an auction item?
                      </label>
                    </div>
                  </div>

                  {itemFormData.isAuctionItem && (
                    <>
                      <div className="sm:col-span-3">
                        <label htmlFor="auctionEndTime" className="block text-sm font-medium text-gray-700">
                          Auction End Time
                        </label>
                        <div className="mt-1">
                          <input
                            type="datetime-local"
                            name="auctionEndTime"
                            id="auctionEndTime"
                            value={itemFormData.auctionEndTime}
                            onChange={handleItemChange}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="bidIncrement" className="block text-sm font-medium text-gray-700">
                          Bid Increment (in USD)
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="bidIncrement"
                            id="bidIncrement"
                            value={itemFormData.bidIncrement}
                            onChange={handleItemChange}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowItemForm(false)}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Date & Time</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{sale.date} from {sale.time}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{sale.address}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Organizer</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{sale.organizer}</dd>
              </div>
              
              {/* Map placeholder */}
              <div className="bg-white px-4 py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 mb-2">Location Map</dt>
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
                  <span className="text-gray-500">Map would appear here</span>
                </div>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Featured Items</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Preview of items available at this sale</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {sale.items.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-40 flex items-center justify-center">
                  <span className="text-gray-500">Item image</span>
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-medium text-gray-900">{item.name}</h4>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-500">{item.category}</span>
                    <span className="text-lg font-bold text-blue-600">${(item.price / 100).toFixed(2)}</span>
                  </div>
                  {!item.isAuctionItem && (
                    <button
                      onClick={() => handleReserveClick(item)}
                      disabled={paymentLoading}
                      className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {paymentLoading && selectedItem?.id === item.id ? 'Processing...' : 'Reserve / Buy Now'}
                    </button>
                  )}
                  {item.isAuctionItem && (
                    <div className="mt-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Auction Item
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Bidding ends: {new Date(item.auctionEndTime).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Modal */}
        {selectedItem && clientSecret && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Complete Payment</h3>
              <p className="text-gray-600 mb-2">Item: {selectedItem.name}</p>
              <p className="text-gray-600 mb-4">Amount: ${(selectedItem.price / 100).toFixed(2)}</p>
              
              {paymentError && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
                  {paymentError}
                </div>
              )}
              
              <div className="mt-4">
                <button
                  onClick={handlePayment}
                  disabled={!stripe}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Pay Now
                </button>
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    setClientSecret(null);
                    setPaymentError(null);
                  }}
                  className="mt-2 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
