import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  RouteStop,
  OptimizedRoute,
  RoutePlanner,
} from "../../tools/route-planner/planner";

const RouteMap = dynamic(() => import("../components/route-map"), {
  ssr: false,
});

interface RoutePlannerProps {
  sales: RouteStop[];
}

// 🔥 Safe local date helper (no UTC shifting)
const getLocalToday = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

const RoutePlannerComponent: React.FC<RoutePlannerProps> = ({
  sales,
}) => {
  const [startLocation, setStartLocation] = useState({
    lat: 42.9634,
    lng: -85.6681,
  });

  const [addressInput, setAddressInput] = useState("");
  const [optimizedRoute, setOptimizedRoute] =
    useState<OptimizedRoute | null>(null);

  const [directions, setDirections] = useState<any[]>([]);

  const today = useMemo(() => getLocalToday(), []);

  // ✅ Use browser location safely
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStartLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  };

  // ✅ Geocode address safely
  const handleUseAddress = async () => {
    if (!addressInput) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          addressInput
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        setStartLocation({ lat, lng });
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
    }
  };

  // ✅ Optimize only when sales or start location changes
  useEffect(() => {
    if (!sales || sales.length === 0) {
      setOptimizedRoute(null);
      return;
    }

    const optimize = async () => {
      try {
        const route = await RoutePlanner.optimizeRoute(
          sales,
          startLocation
        );
        setOptimizedRoute(route);
      } catch (err) {
        console.error("Route optimization failed:", err);
      }
    };

    optimize();
  }, [sales, startLocation]);

  // ✅ Filter sales by the current day
  const filteredSales = useMemo(() => {
    return sales.filter(
      (sale) =>
        new Date(sale.startDate).toISOString().split("T")[0] === today
    );
  }, [sales, today]);

  const mapStops = optimizedRoute?.stops
    ? [
        {
          id: "start",
          name: "Start",
          address: "Starting Point",
          lat: startLocation.lat,
          lng: startLocation.lng,
          startTime: "",
          endTime: "",
        },
        ...optimizedRoute.stops,
      ]
    : filteredSales;

  return (
    <div>
      {/* Controls */}
      <div className="mb-4 flex flex-wrap gap-3 items-center">
        <button
          onClick={handleUseCurrentLocation}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          Use Current Location
        </button>

        <input
          type="text"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          placeholder="Enter start address"
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={handleUseAddress}
          className="px-3 py-2 bg-green-600 text-white rounded"
        >
          Use Address
        </button>
      </div>

      {/* Map */}
      <RouteMap
        sales={mapStops}
        onDirectionsLoaded={setDirections}
      />

      {/* Directions */}
      {directions.length > 0 && (
        <div className="mt-4 bg-white p-4 rounded shadow max-h-72 overflow-y-auto">
          <h3 className="font-semibold mb-3">
            Turn-by-Turn Directions
          </h3>

          {directions.map((step, index) => (
            <div key={index} className="mb-3 text-sm">
              <div
                dangerouslySetInnerHTML={{
                  __html: step.maneuver.instruction,
                }}
              />
              <div className="text-gray-500 text-xs">
                {(step.distance / 1000).toFixed(2)} km
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoutePlannerComponent;