import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { RouteStop } from '@salescout/tools/route-planner/planner';
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
    startDate: sale.start_date,
    endDate: sale.end_date,
  }));
};

const RoutePlannerPage: React.FC = () => {
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    const day = today.getDay();
    const saturdayOffset = (6 - day + 7) % 7;
    const saturday = new Date(today);
    saturday.setDate(today.getDate() + saturdayOffset);
    return saturday;
  });
  const [filterMode, setFilterMode] = useState<'date' | 'saturday' | 'sunday' | 'thisWeekend'>('thisWeekend');

  /* -----------------------------
     Fetch Sales From API with Date Parameter
  ------------------------------ */
  const fetchSales = async (date: Date, mode: 'date' | 'saturday' | 'sunday' | 'thisWeekend') => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/sales';
      
      if (mode === 'saturday') {
        url += '?day=saturday';
      } else if (mode === 'sunday') {
        url += '?day=sunday';
      } else if (mode === 'thisWeekend') {
        // For this weekend, we'll show both Saturday and Sunday sales
        const saturday = new Date(date);
        const sunday = new Date(date);
        sunday.setDate(sunday.getDate() + 1);
        
        const saturdayFormatted = `${saturday.getFullYear()}-${String(
          saturday.getMonth() + 1
        ).padStart(2, "0")}-${String(saturday.getDate()).padStart(2, "0")}`;
        
        const sundayFormatted = `${sunday.getFullYear()}-${String(
          sunday.getMonth() + 1
        ).padStart(2, "0")}-${String(sunday.getDate()).padStart(2, "0")}`;
        
        // Fetch Saturday sales
        const saturdayResponse = await fetch(`/api/sales?date=${saturdayFormatted}`);
        if (!saturdayResponse.ok) {
          throw new Error(`HTTP error! status: ${saturdayResponse.status}`);
        }
        const saturdayData = await saturdayResponse.json();
        
        // Fetch Sunday sales
        const sundayResponse = await fetch(`/api/sales?date=${sundayFormatted}`);
        if (!sundayResponse.ok) {
          throw new Error(`HTTP error! status: ${sundayResponse.status}`);
        }
        const sundayData = await sundayResponse.json();
        
        // Combine and deduplicate sales
        const combinedData = [...saturdayData, ...sundayData];
        const uniqueSales = combinedData.filter((sale, index, self) => 
          index === self.findIndex((s) => s.id === sale.id)
        );
        
        setSalesData(uniqueSales);
        return;
      } else {
        // Format date as YYYY-MM-DD for API
        const formattedDate = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        url += `?date=${formattedDate}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Ensure data is an array and filter out any invalid entries
      if (Array.isArray(data)) {
        const validSales = data.filter(sale => 
          sale.id && 
          sale.title && 
          typeof sale.latitude === 'number' && 
          typeof sale.longitude === 'number'
        );
        setSalesData(validSales);
      } else {
        setSalesData([]);
      }
    } catch (error) {
      console.error("Failed to fetch sales:", error);
      setError("Failed to load sales data. Please try again later.");
      setSalesData([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch sales when date or filter mode changes
  useEffect(() => {
    fetchSales(selectedDate, filterMode);
  }, [selectedDate, filterMode]);

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
     Date Navigation Functions
  ------------------------------ */
  const goToPreviousWeekend = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const goToNextWeekend = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const goToThisWeekend = () => {
    const today = new Date();
    const day = today.getDay();
    const saturdayOffset = (6 - day + 7) % 7;
    const saturday = new Date(today);
    saturday.setDate(today.getDate() + saturdayOffset);
    setSelectedDate(saturday);
    setFilterMode('thisWeekend');
  };

  /* -----------------------------
     Saturday / Sunday Buttons
  ------------------------------ */
  const setToSaturday = () => {
    setFilterMode('saturday');
    const date = new Date();
    const offset = (6 - date.getDay() + 7) % 7;
    date.setDate(date.getDate() + offset);
    setSelectedDate(date);
  };

  const setToSunday = () => {
    setFilterMode('sunday');
    const date = new Date();
    const offset = (7 - date.getDay() + 7) % 7;
    date.setDate(date.getDate() + offset);
    setSelectedDate(date);
  };

  const setToDate = () => {
    setFilterMode('date');
  };

  const setToThisWeekend = () => {
    setFilterMode('thisWeekend');
    const today = new Date();
    const day = today.getDay();
    const saturdayOffset = (6 - day + 7) % 7;
    const saturday = new Date(today);
    saturday.setDate(today.getDate() + saturdayOffset);
    setSelectedDate(saturday);
  };

  const isSaturday = filterMode === 'saturday';
  const isSunday = filterMode === 'sunday';
  const isByDate = filterMode === 'date';
  const isThisWeekend = filterMode === 'thisWeekend';

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format weekend range for display
  const formatWeekendRange = (startDate: Date): string => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1); // Sunday
    
    const startStr = startDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    const endStr = endDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
    
    return `${startStr} - ${endStr}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Estate Sales Route Planner | SaleScout</title>
        <meta name="description" content="Plan your estate sale shopping route in Grand Rapids. Find the best sales this weekend and optimize your trip." />
      </Head>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Weekend Route Planner</h1>
        <p className="text-gray-600">
          Plan efficient routes for estate sales in Grand Rapids. 
          <a 
            href="mailto:organizers@salescout.app?subject=Grand Rapids Organizer Beta" 
            className="text-blue-600 hover:underline ml-1"
          >
            Organizers: Join our beta program
          </a>
        </p>
      </div>

      {/* Date Display and Controls */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <button
            onClick={goToPreviousWeekend}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            ← Previous
          </button>
          
          {isThisWeekend ? (
            <div className="text-lg font-medium">
              This Weekend ({formatWeekendRange(selectedDate)})
            </div>
          ) : !isByDate ? (
            <div className="text-lg font-medium">
              {formatDate(selectedDate)}
            </div>
          ) : null}
          
          <button
            onClick={goToNextWeekend}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Next →
          </button>
          
          <button
            onClick={goToThisWeekend}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            This Weekend
          </button>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={setToThisWeekend}
            className={`px-4 py-2 rounded-lg ${
              isThisWeekend
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            This Weekend
          </button>
          
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
          
          <button
            onClick={setToDate}
            className={`px-4 py-2 rounded-lg ${
              isByDate
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            By Date
          </button>
          
          {isByDate && (
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="border px-3 py-2 rounded"
            />
          )}
        </div>
        
        {loading && (
          <div className="text-gray-500 mt-2">Loading sales...</div>
        )}
        
        {error && (
          <div className="text-red-500 mt-2">{error}</div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Select Sales
              </h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {selectedSales.length} selected
              </span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {routeStops.length === 0 && !loading ? (
                <p className="text-gray-500 text-center py-4">
                  No sales available for this date
                </p>
              ) : (
                routeStops.map((sale) => (
                  <div
                    key={sale.id}
                    onClick={() =>
                      toggleSaleSelection(sale.id)
                    }
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedSales.some(
                        (s) => s.id === sale.id
                      )
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex items-center h-5 mt-0.5">
                        <input
                          type="checkbox"
                          checked={selectedSales.some(
                            (s) => s.id === sale.id
                          )}
                          readOnly
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {sale.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {sale.address}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="inline-flex items-center text-xs text-gray-500">
                            {sale.startTime} - {sale.endTime}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(sale.startDate).toLocaleDateString()} - {new Date(sale.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
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

      {/* Organizer CTA Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hosting an Estate Sale?</h3>
            <p className="text-gray-700 mb-4">
              List your sale on SaleScout to reach more buyers and sell items faster. 
              Get started with our exclusive beta program for Grand Rapids organizers.
            </p>
          </div>
          <div className="flex-shrink-0">
            <a 
              href="mailto:organizers@salescout.app?subject=Grand Rapids Organizer Beta" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 whitespace-nowrap"
            >
              Join Beta Program
            </a>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Zero commission for 6 months
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Premium placement in search results
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Free QR codes for all items
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutePlannerPage;
