import React, { useState } from 'react';
import { RouteStop, OptimizedRoute, RoutePlanner } 
from '../../tools/route-planner/planner';
import dynamic from 'next/dynamic';

const RouteMap = dynamic(
  () => import('../components/route-map'),
  { ssr: false }
);

interface RoutePlannerProps {
  sales: RouteStop[];
}

const RoutePlannerComponent: React.FC<RoutePlannerProps> = ({ sales }) => {
  const [startLocation, setStartLocation] = useState({ lat: 42.9634, lng: -85.6681 }); // Default to Grand Rapids
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);
  const [loading, setLoading] = useState(false);
  const [printMode, setPrintMode] = useState(false);

  const handleOptimizeRoute = async () => {
    setLoading(true);
    try {
      const route = await RoutePlanner.optimizeRoute(sales, startLocation);
      setOptimizedRoute(route);
    } catch (error) {
      console.error('Error optimizing route:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 100);
  };

  return (
    <div className={`route-planner-container ${printMode ? 'print-mode' : ''}`}>
      {!printMode && (
        <div className="route-planner-controls mb-6">
          <h2 className="text-xl font-bold mb-4">Weekend Route Planner</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Starting Latitude</label>
              <input
                type="number"
                step="any"
                value={startLocation.lat}
                onChange={(e) => setStartLocation({...startLocation, lat: parseFloat(e.target.value)})}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Starting Longitude</label>
              <input
                type="number"
                step="any"
                value={startLocation.lng}
                onChange={(e) => setStartLocation({...startLocation, lng: parseFloat(e.target.value)})}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <button
            onClick={handleOptimizeRoute}
            disabled={loading || sales.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Optimizing...' : 'Optimize Route'}
          </button>
        </div>
      )}

      {optimizedRoute && (
        <div className="route-results">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Your Optimized Route</h3>
            {!printMode && (
              <button
                onClick={handlePrint}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Print Plan
              </button>
            )}
          </div>

          <div className="route-summary bg-gray-50 p-4 rounded mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Distance</p>
                <p className="font-bold">{optimizedRoute.totalDistance} km</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Time</p>
                <p className="font-bold">{optimizedRoute.estimatedTime.toFixed(1)} hours</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <a 
              href={optimizedRoute.mapUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline block mb-2"
            >
              View Route on Google Maps
            </a>
          </div>

          <div className="route-stops">
            <h4 className="font-bold mb-2">Route Stops:</h4>
            <ol className="space-y-3">
              {optimizedRoute.stops.map((stop, index) => (
                <li key={stop.id} className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{stop.name}</p>
                    <p className="text-sm text-gray-600">{stop.address}</p>
                    <p className="text-sm">Hours: {stop.startTime} - {stop.endTime}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-6">
            <RouteMap sales={optimizedRoute ? optimizedRoute.stops : sales} />
          </div>
        </div>
      )}

      {printMode && (
        <div className="print-only-content">
          <h1>Estate Sales Weekend Route</h1>
          <p>Generated on {new Date().toLocaleDateString()}</p>
          
          {optimizedRoute && (
            <>
              <div>
                <h2>Route Summary</h2>
                <p>Total Distance: {optimizedRoute.totalDistance} km</p>
                <p>Estimated Time: {optimizedRoute.estimatedTime.toFixed(1)} hours</p>
              </div>
              
              <div>
                <h2>Stops</h2>
                <ol>
                  {optimizedRoute.stops.map((stop, index) => (
                    <li key={stop.id}>
                      <strong>{index + 1}. {stop.name}</strong><br/>
                      Address: {stop.address}<br/>
                      Hours: {stop.startTime} - {stop.endTime}
                    </li>
                  ))}
                </ol>
              </div>
              
              <div>
                <h2>Navigation</h2>
                <p>For turn-by-turn directions, visit:</p>
                <p>{optimizedRoute.mapUrl}</p>
              </div>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .route-planner-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 1rem;
        }
        
        .print-mode {
          max-width: 100%;
        }
        
        @media print {
          .route-planner-container {
            padding: 0;
          }
          
          button, .no-print {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default RoutePlannerComponent;
