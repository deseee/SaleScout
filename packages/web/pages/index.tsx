import Layout from '../components/layout';

export default function Home() {
  return (
    <Layout>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Welcome to SaleScout
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-gray-500 mx-auto">
            The smarter way to discover and host estate sales in Grand Rapids
          </p>
        </div>

        <div className="mt-16 bg-blue-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900">🎉 Grand Rapids Organizers: Join Our Beta!</h2>
          <p className="mt-4">
            Be among the first 50 organizers to join SaleScout and enjoy:
          </p>
          <ul className="mt-4 space-y-2">
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
              <span className="ml-2"><strong>Zero commission for 6 months</strong></span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
              <span className="ml-2">Premium placement in local search results</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
              <span className="ml-2">Free QR codes for all your items</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
              <span className="ml-2">Personalized support from our local team</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
              <span className="ml-2">Early access to our route planning tools</span>
            </li>
          </ul>
          <p className="mt-6">
            <a 
              href="mailto:organizers@salescout.app?subject=Grand Rapids Organizer Beta" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-700 transition duration-300"
            >
              Claim Your Spot
            </a>
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900">🔍 For Shoppers</h3>
            <p className="mt-2 text-gray-600">Discover estate sales near you with our powerful search and filtering tools.</p>
            <a href="/route-planner" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800">
              Plan Your Route 
              <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900">💼 For Organizers</h3>
            <p className="mt-2 text-gray-600">List your sales and reach more buyers with our optimized platform.</p>
            <a 
              href="mailto:organizers@salescout.app?subject=Organizer Inquiry" 
              className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              Learn More 
              <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-16 bg-yellow-50 p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-gray-900">Why Choose SaleScout Over estatesales.net?</h3>
          <p className="mt-4">
            <strong className="text-lg">We're 100% focused on Grand Rapids</strong> - while they're nationwide, 
            we put local organizers first.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium">📍 Local SEO Advantage</span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium">⚡ Faster Sales</span>
            <span className="px-4 py-2 bg-white rounded-full text-sm font-medium">🤝 Personal Support</span>
          </div>
        </div>
      </main>
    </Layout>
  );
}
