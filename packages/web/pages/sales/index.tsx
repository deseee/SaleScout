import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Sale } from '@salescout/shared/types';
import { SaleCard } from '../../components/sale-card';

const SalesPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'upcoming' | 'current' | 'past'>('current');

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/sales?mode=${filter}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSales(data);
      } catch (error) {
        console.error("Failed to fetch sales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [filter]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Estate Sales | SaleScout</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Estate Sales</h1>

      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('current')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'current'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Current Sales
          </button>

          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Upcoming Sales
          </button>

          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'past'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Past Sales
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Loading sales...</p>
        </div>
      ) : (
        <div>
          {sales.length === 0 ? (
            <div className="text-center py-8">
              <p>No {filter} sales found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sales.map((sale) => (
                <SaleCard key={sale.id} sale={sale} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SalesPage;
