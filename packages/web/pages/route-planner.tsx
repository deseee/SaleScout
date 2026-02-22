import React, { useState } from 'react';
import Head from 'next/head';
import { RouteStop } from '@salescout/tools/route-planner';
import RoutePlannerComponent from '../components/route-planner';
import salesData from '../data/sales.json';

// Define the SaleData type
interface SaleData {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  startTime: string;
  endTime: string;
  day: string;
}

// Convert JSON data to RouteStop format
const convertToRouteStops = (sales: SaleData[]): RouteStop[] => {
  return sales.map(sale => ({
    id: sale.id,
    name: sale.name,
    address: sale.address,
    lat: sale.latitude,
    lng: sale.longitude,
    startTime: sale.startTime,
    endTime: sale.endTime
  }));
};

const RoutePlannerPage: React.FC<{ sales: RouteStop[] }> = ({ sales }) => {
  const [selectedDay, setSelectedDay] = useState<'Saturday' | 'Sunday'>('Saturday');
  const [selectedSales, setSelectedSales] = useState<RouteStop[]>(sales);

  // Filter sales by selected day
  const filteredSales = sales.filter(sale => {
    const saleData = salesData.find(s => s.id === sale.id);
    return saleData?.day === selectedDay;
  });

  const toggleSaleSelection = (saleId: string) => {
    if (selectedSales.some(sale => sale.id === saleId)) {
      setSelectedSales(selectedSales.filter(sale => sale.id !== saleId));
    } else {
      const saleToAdd = filteredSales.find(sale => sale.id === saleId);
      if (saleToAdd) {
        setSelectedSales([...selectedSales, saleToAdd]);
      }
    }
  };

  // Update selected sales when day changes
React.useEffect(() => {
  const newFiltered = sales.filter(sale => {
    const saleData = salesData.find(s => s.id === sale.id);
    return saleData?.day === selectedDay;
  });

  setSelectedSales(newFiltered);
}, [selectedDay, sales]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Estate Sales Route Planner | SaleScout</title>
        <meta name="description" content="Plan your estate sales weekend route with our optimizer" />
      </Head>

      <h1 className="text-3xl font-bold mb-6">Weekend Route Planner</h1>
      
      {/* Day Selection Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${
            selectedDay === 'Saturday'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setSelectedDay('Saturday')}
        >
          Saturday
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            selectedDay === 'Sunday'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setSelectedDay('Sunday')}
        >
          Sunday
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-xl font-bold mb-4">Select Sales</h2>
            <p className="text-sm text-gray-600 mb-4">
              Choose which estate sales you want to include in your route
            </p>
            
            <div className="space-y-3">
              {filteredSales.map(sale => (
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

export async function getStaticProps() {
  // Convert the imported JSON data to RouteStop format
  const sales: RouteStop[] = convertToRouteStops(salesData);
  
  return {
    props: {
      sales
    }
  };
}

export default RoutePlannerPage;
