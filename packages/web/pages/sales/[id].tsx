import { useRouter } from 'next/router';
import Layout from '../../components/layout';

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
    { id: '1', name: 'Antique Wooden Desk', price: '$250', category: 'Furniture' },
    { id: '2', name: 'Vintage China Set', price: '$180', category: 'Kitchen' },
    { id: '3', name: 'Oil Paintings Collection', price: '$450', category: 'Art' },
    { id: '4', name: 'Silver Flatware Set', price: '$120', category: 'Kitchen' },
    { id: '5', name: 'Leather Armchair', price: '$95', category: 'Furniture' },
  ],
};

export default function SaleDetail() {
  const router = useRouter();
  const { id } = router.query;

  // In a real implementation, you would fetch the sale data based on the ID
  const sale = mockSale;

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
            <h3 className="text-2xl leading-6 font-bold text-gray-900">{sale.title}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{sale.description}</p>
          </div>
          
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
                    <span className="text-lg font-bold text-blue-600">{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
