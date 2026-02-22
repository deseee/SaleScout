import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { RouteStop } from '../../tools/route-planner/planner';
import RoutePlannerComponent from '../components/route-planner';

interface SaleData {
  id: string;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
}

/* -----------------------------
   Convert DB Sales → RouteStops
------------------------------ */
const convertToRouteStops = (sales: SaleData[]): RouteStop[] => {
  return sales.map((sale) => ({
    id: sale.id,
    name: sale.title,
    address: sale.address,
    lat: sale.latitude,
    lng: sale.longitude,
    startTime: sale.start_time || '',
    endTime: sale.end_time || '',
  }));
};

const RoutePlannerPage: React.FC = () => {
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    const day = today.getDay();
    const saturdayOffset = (6 - day + 7) % 7;
    const saturday = new Date(today);
    saturday.setDate(today.getDate() + saturdayOffset);
    return saturday;
  });

  /* -----------------------------
     Fetch Sales From API with Date Parameter
  ------------------------------ */
  const fetchSales = async (date: Date) => {
    setLoading(true);
    try {
      // Format date as YYYY-MM-DD for API
      const formattedDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      
      const response = await fetch(`/api/sales?date=${formattedDate}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSalesData(data);
    } catch (error) {
      console.error("Failed to fetch sales:", error);
      setSalesData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch sales when date changes
  useEffect(() => {
    fetchSales(selectedDate);
  }, [selectedDate]);

  const routeStops = useMemo(
    () => convertToRouteStops(salesData),
    [salesData]
  );

  const [selectedSales, setSelectedSales] =
    useState<RouteStop[]>([]);

  useEffect(() => {
    setSelectedSales(routeStops);
  }, [routeStops]);

  const toggleSaleSelection = (saleId: string) => {
    setSelectedSales((prev) => {
      if (prev.some((sale) => sale.id === saleId)) {
        return prev.filter((sale) => sale.id !== saleId);
      }
      const saleToAdd = routeStops.find(
        (sale) => sale.id === saleId
      );
      return saleToAdd ? [...prev, saleToAdd] : prev;
    });
  };

  /* -----------------------------
     Saturday / Sunday Buttons
  ------------------------------ */
  const setToSaturday = () => {
    const date = new Date();
    const offset = (6 - date.getDay() + 7) % 7;
    date.setDate(date.getDate() + offset);
    setSelectedDate(date);
  };

  const setToSunday = () => {
    const date = new Date();
    const offset = (7 - date.getDay() + 7) % 7;
    date.setDate(date.getDate() + offset);
    setSelectedDate(date);
  };

  const isSaturday = selectedDate.getDay() === 6;
  const isSunday = selectedDate.getDay() === 0;

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Estate Sales Route Planner | SaleScout</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">
        Weekend Route Planner
      </h1>

      {/* Date Display and Controls */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={setToSaturday}
            className={`px-4 py-2 rounded-lg ${
              isSaturday
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Saturday
          </button>

          <button
            onClick={setToSunday}
            className={`px-4 py-2 rounded-lg ${
              isSunday
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Sunday
          </button>
          
          <div className="text-lg font-medium">
            {formatDate(selectedDate)}
          </div>
        </div>
        
        {loading && (
          <div className="text-gray-500">Loading sales...</div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-xl font-bold mb-4">
              Select Sales
            </h2>

            <div className="space-y-3">
              {routeStops.map((sale) => (
                <div
                  key={sale.id}
                  onClick={() =>
                    toggleSaleSelection(sale.id)
                  }
                  className={`border rounded p-3 cursor-pointer ${
                    selectedSales.some(
                      (s) => s.id === sale.id
                    )
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <h3 className="font-medium">
                    {sale.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {sale.address}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Route Planner */}
        <div className="lg:col-span-2">
          <RoutePlannerComponent
            sales={selectedSales}
          />
        </div>
      </div>
    </div>
  );
};

export default RoutePlannerPage;
