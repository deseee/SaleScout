import React, { useState, useEffect } from 'react';
import { RouteStop, OptimizedRoute, RoutePlanner } from '../../tools/route-planner/planner';
import dynamic from 'next/dynamic';

const RouteMap = dynamic(() => import('../components/route-map'), { ssr: false });

interface RoutePlannerProps {
  sales: RouteStop[];
}

const RoutePlannerComponent: React.FC<RoutePlannerProps> = ({ sales }) => {
  const [startLocation, setStartLocation] = useState({ lat: 42.9634, lng: -85.6681 }); // Default to Grand Rapids
  const [address, setAddress] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);
  const [loading, setLoading] = useState(false);
  const [printMode, setPrintMode] = useState(false);

  // Get the user's current location (if available)
  useEffect(() => {
    if (navigator.geolocation && useCurrentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setStartLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          // Fallback to default location if geolocation fails
        }
      );
    }
  }, [useCurrentLocation]);

  const handleAddressChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleGeocodeAddress = async () => {
    if (!address) return;

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
    );

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const { center } = data.features[0];
      setStartLocation({ lat: center[1], lng: center[0] });
    } else {
      console.error('Address not found.');
    }
  };

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

  // Always show something on the map
  const mapStops = optimizedRoute ? optimizedRoute.stops : sales;

  return (
    <div className={`route-planner-container ${printMode ? 'print-mode' : ''}`}>
      {/* Route Controls */}
      {!printMode && (
        <div className="route-planner-controls mb-6">
          <h2 className="text-xl font-bold mb-4">Route Controls</h2>

          {/* Toggle for Current Location or Address */}
          <div className="flex mb-4">
            <button
              onClick={() => setUseCurrentLocation(true)}
              className={`px-4 py-2 rounded-lg ${
                useCurrentLocation ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Use Current Location
            </button>
            <button
              onClick={() => setUseCurrentLocation(false)}
              className={`px-4 py-2 rounded-lg ${
                !useCurrentLocation ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Use Address
            </button>
          </div>

          {/* Conditional Input for Address */}
          {!useCurrentLocation && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Enter Start Address</label>
              <input
                type="text"
                value={address}
                onChange={handleAddressChange}
                placeholder="Enter address or location"
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleGeocodeAddress}
                className="bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700"
              >
                Set Start Location
              </button>
            </div>
          )}

          {/* Starting Latitude and Longitude */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Starting Latitude</label>
              <input
                type="number"
                step="any"
                value={startLocation.lat}
                onChange={(e) => setStartLocation({ ...startLocation, lat: parseFloat(e.target.value) })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Starting Longitude</label>
              <input
                type="number"
                step="any"
                value={startLocation.lng}
                onChange={(e) => setStartLocation({ ...startLocation, lng: parseFloat(e.target.value) })}
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

      {/* MAP ALWAYS RENDERS */}
      <div className="mb-8">
        <div style={{ width: '100%', height: '500px' }}>
          <RouteMap key={mapStops.map((s) => s.id).join('-')} sales={mapStops} />
        </div>
      </div>

      {/* Optimized Route Results */}
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
        </div>
      )}

      <style jsx>{`
        .route-planner-container {
          max-width: 900px;
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

          button {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default RoutePlannerComponent;