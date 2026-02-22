import React, { useState } from 'react';
import Head from 'next/head';
import { RouteStop } from '@salescout/tools/route-planner';
import RoutePlannerComponent from '@/components/route-planner';

// Mock data for demonstration
const mockSales: RouteStop[] = [
  {
    id: '1',
    name: 'Eastown Estate Sale',
    address: '123 Eastown Ave, Grand Rapids, MI',
    lat: 42.9583,
    lng: -85.6572,
    startTime: '08:00',
    endTime: '17:00'
  },
  {
    id: '2',
    name: 'Heritage Hill Sale',
    address: '456 Heritage St, Grand Rapids, MI',
    lat: 42.9512,
    lng: -85.6531,
    startTime: '09:00',
    endTime: '16:00'
  },
  {
    id: '3',
    name: 'Downtown Vintage Finds',
    address: '789 Main St, Grand Rapids, MI',
    lat: 42.9634,
    lng: -85.6681,
    startTime: '10:00',
    endTime: '18:00'
  },
  {
    id: '4',
    name: 'North Park Treasures',
    address: '321 Oak Ln, Grand Rapids, MI',
    lat: 42.9812,
    lng: -85.6723,
    startTime: '08:30',
    endTime: '15:30'
  }
];

const RoutePlannerPage: React.FC = () => {
  const [selectedSales, setSelectedSales] = useState<RouteStop[]>(mockSales);

  const toggleSaleSelection = (saleId: string) => {
    if (selectedSales.some(sale => sale.id === saleId)) {
      setSelectedSales(selectedSales.filter(sale => sale.id !== saleId));
    } else {
      const saleToAdd = mockSales.find(sale => sale.id === saleId);
      if (saleToAdd) {
        setSelectedSales([...selectedSales, saleToAdd]);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Estate Sales Route Planner | SaleScout</title>
        <meta name="description" content="Plan your estate sales weekend route with our optimizer" />
      </Head>

      <h1 className="text-3xl font-bold mb-6">Weekend Route Planner</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-xl font-bold mb-4">Select Sales</h2>
            <p className="text-sm text-gray-600 mb-4">
              Choose which estate sales you want to include in your route
            </p>
            
            <div className="space-y-3">
              {mockSales.map(sale => (
                <div 
                  key={sale.id} 
                  className={`border rounded p-3 cursor-pointer transition-colors ${
                    selectedSales.some(s => s.id === sale.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => toggleSaleSelection(sale.id)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{sale.name}</h3>
                    <input
                      type="checkbox"
                      checked={selectedSales.some(s => s.id === sale.id)}
                      onChange={() => {}}
                      className="mt-1"
                    />
                  </div>
                  <p className="text-sm text-gray-600">{sale.address}</p>
                  <p className="text-xs text-gray-500">
                    {sale.startTime} - {sale.endTime}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-bold text-yellow-800 mb-2">Pro Tip</h3>
            <p className="text-sm text-yellow-700">
              Select sales that are geographically close to each other for the most efficient route.
            </p>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <RoutePlannerComponent sales={selectedSales} />
        </div>
      </div>
    </div>
  );
};

export default RoutePlannerPage;
