import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { RouteStop } from "../../tools/route-planner/planner";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface RouteMapProps {
  sales: RouteStop[];
  onDirectionsLoaded?: (steps: any[]) => void;
}

const RouteMap: React.FC<RouteMapProps> = ({
  sales,
  onDirectionsLoaded,
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Initialize map once
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-98, 39],
      zoom: 3,
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Draw route when sales change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || sales.length === 0) return;

    if (!map.isStyleLoaded()) {
      map.once("load", () => drawRoute());
    } else {
      drawRoute();
    }

    async function drawRoute() {
      // Remove old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Add markers
      sales.forEach((stop, index) => {
        const el = document.createElement("div");
        el.className = "marker";

        if (index === 0) {
          el.innerHTML = `<div style="
              background:#2563eb;
              color:white;
              width:32px;
              height:32px;
              border-radius:50%;
              display:flex;
              align-items:center;
              justify-content:center;
              font-size:16px;
              font-weight:bold;
            ">🏠</div>`;
        } else {
          el.innerHTML = `<div style="
              background:#ef4444;
              color:white;
              width:28px;
              height:28px;
              border-radius:50%;
              display:flex;
              align-items:center;
              justify-content:center;
              font-size:14px;
              font-weight:bold;
            ">${index}</div>`;
        }

        const marker = new mapboxgl.Marker(el)
          .setLngLat([stop.lng, stop.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });

      // Fit bounds
      const bounds = new mapboxgl.LngLatBounds();
      sales.forEach((stop) => bounds.extend([stop.lng, stop.lat]));
      map.fitBounds(bounds, { padding: 80, duration: 800 });

      // Build coordinates string
      const coordinates = sales
        .map((s) => `${s.lng},${s.lat}`)
        .join(";");

      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&overview=full&steps=true&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
      );

      if (!response.ok) return;

      const data = await response.json();
      if (!data.routes || data.routes.length === 0) return;

      const route = data.routes[0];

      // Send turn-by-turn steps upward
      if (onDirectionsLoaded) {
        const steps = route.legs.flatMap((leg: any) => leg.steps);
        onDirectionsLoaded(steps);
      }

      const routeFeature = {
        type: "Feature" as const,
        properties: {},
        geometry: route.geometry,
      };

      const existingSource = map.getSource(
        "route"
      ) as mapboxgl.GeoJSONSource | null;

      if (existingSource) {
        existingSource.setData(routeFeature);
      } else {
        map.addSource("route", {
          type: "geojson",
          data: routeFeature,
        });

        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#2563eb",
            "line-width": 5,
          },
        });
      }
    }
  }, [sales]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "12px",
      }}
    />
  );
};

export default RouteMap;