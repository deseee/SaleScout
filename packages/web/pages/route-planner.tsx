import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { RouteStop } from '@salescout/tools/route-planner';
import RoutePlannerComponent from '../components/route-planner';
import salesData from '../data/sales.json';

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

const convertToRouteStops = (sales: SaleData[]): RouteStop[] => {
  return sales.map((sale) => ({
    id: sale.id,
    name: sale.name,
    address: sale.address,
    lat: sale.latitude,
    lng: sale.longitude,
    startTime: sale.startTime,
    endTime: sale.endTime,
  }));
};

const RoutePlannerPage: React.FC<{ sales: RouteStop[] }> = ({ sales }) => {
  const [selectedDay, setSelectedDay] =
    useState<'Saturday' | 'Sunday'>('Saturday');

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const original = salesData.find((s) => s.id === sale.id);
      return original?.day === selectedDay;
    });
  }, [selectedDay, sales]);

  const [selectedSales, setSelectedSales] =
    useState<RouteStop[]>(filteredSales);

  // Reset selected sales when day changes
  useEffect(() => {
    setSelectedSales(filteredSales);
  }, [filteredSales]);

  const toggleSaleSelection = (saleId: string) => {
    setSelectedSales((prev) => {
      if (prev.some((sale) => sale.id === saleId)) {
        return prev.filter((sale) => sale.id !== saleId);
      }
      const saleToAdd = filteredSales.find((sale) => sale.id === saleId);
      return saleToAdd ? [...prev, saleToAdd] : prev;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Estate Sales Route Planner | SaleScout</title>
        <meta
          name="description"
          content="Plan your estate sales weekend route with our optimizer"
        />
      </Head>

      <h1 className="text-3xl font-bold mb-6">Weekend Route Planner</h1>

      {/* Day Selection */}
      <div className="flex space-x-4 mb-6">
        {['Saturday', 'Sunday'].map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day as 'Saturday' | 'Sunday')}
            className={`px-4 py-2 rounded-lg ${
              selectedDay === day
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-xl font-bold mb-4">Select Sales</h2>
            <p className="text-sm text-gray-600 mb-4">
              Choose which estate sales you want to include in your route
            </p>

            <div className="space-y-3">
              {filteredSales.map((sale) => (
                <div
                  key={sale.id}
                  onClick={() => toggleSaleSelection(sale.id)}
                  className={`border rounded p-3 cursor-pointer transition-colors ${
                    selectedSales.some((s) => s.id === sale.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{sale.name}</h3>
                    <input
                      type="checkbox"
                      checked={selectedSales.some(
                        (s) => s.id === sale.id
                      )}
                      readOnly
                      className="mt-1"
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    {sale.address}
                  </p>
                  <p className="text-xs text-gray-500">
                    {sale.startTime} - {sale.endTime}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-bold text-yellow-800 mb-2">
              Pro Tip
            </h3>
            <p className="text-sm text-yellow-700">
              Select sales that are geographically close to each other
              for the most efficient route.
            </p>
          </div>
        </div>

        {/* Route Planner */}
        <div className="lg:col-span-2">
          <RoutePlannerComponent sales={selectedSales} />
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const sales: RouteStop[] = convertToRouteStops(salesData);
  return { props: { sales } };
}

export default RoutePlannerPage;