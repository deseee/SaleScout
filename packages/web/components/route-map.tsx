import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { RouteStop } from '@salescout/tools/route-planner';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface RouteMapProps {
  sales: RouteStop[];
}

const RouteMap: React.FC<RouteMapProps> = ({ sales }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-85.668, 42.963], // Grand Rapids default
        zoom: 12,
      });
    }

    const map = mapRef.current;

    // Remove old markers
    const markers = document.getElementsByClassName('mapbox-marker');
    while (markers[0]) {
      markers[0].remove();
    }

    sales.forEach((sale) => {
      const el = document.createElement('div');
      el.className = 'mapbox-marker';
      el.style.width = '14px';
      el.style.height = '14px';
      el.style.backgroundColor = '#2563eb';
      el.style.borderRadius = '50%';

      new mapboxgl.Marker(el)
        .setLngLat([sale.lng, sale.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<strong>${sale.name}</strong><br/>${sale.address}`
          )
        )
        .addTo(map);
    });

  }, [sales]);

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '500px', borderRadius: '12px' }}
    />
  );
};

export default RouteMap;