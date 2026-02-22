import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { RouteStop } from '../../tools/route-planner/planner';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface RouteMapProps {
  sales: RouteStop[];
}

const RouteMap: React.FC<RouteMapProps> = ({ sales }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || sales.length === 0) return;

    // Create map
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [sales[0].lng, sales[0].lat],
      zoom: 11
    });

    mapRef.current = map;

    map.on('load', async () => {
      // ---------- 1️⃣ NUMBERED MARKERS ----------
      sales.forEach((stop, index) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.innerHTML = `<div class="marker-circle">${index + 1}</div>`;

        new mapboxgl.Marker(el)
          .setLngLat([stop.lng, stop.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<strong>${stop.name}</strong><br/>${stop.address}`
            )
          )
          .addTo(map);
      });

      // ---------- 2️⃣ AUTO-FIT BOUNDS ----------
      const bounds = new mapboxgl.LngLatBounds();
      sales.forEach(stop => {
        bounds.extend([stop.lng, stop.lat]);
      });
      map.fitBounds(bounds, { padding: 60 });

      // ---------- 3️⃣ REAL DRIVING ROUTE ----------
      const coordinates = sales
        .map(stop => `${stop.lng},${stop.lat}`)
        .join(';');

      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`
      );

      const data = await response.json();

      if (!data.routes || data.routes.length === 0) return;

      const routeGeoJSON = data.routes[0].geometry;

      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: routeGeoJSON
        }
      });

      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#2563eb',
          'line-width': 5
        }
      });
    });

    return () => {
      map.remove();
    };
  }, [sales]);

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '500px', borderRadius: '12px' }}
    />
  );
};

export default RouteMap;