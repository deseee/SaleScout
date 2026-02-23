import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-blue-600">
          SaleScout
        </h1>
        <p className="mt-3 text-2xl">
          Disrupting the estate sale industry
        </p>
        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <div className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">For Organizers</h3>
            <p className="mt-4 text-xl">
              Create amazing estate sales with our powerful tools
            </p>
          </div>
          <div className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">For Shoppers</h3>
            <p className="mt-4 text-xl">
              Find incredible deals at estate sales near you
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
