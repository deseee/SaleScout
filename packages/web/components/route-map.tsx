import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { RouteStop } from '@salescout/tools/route-planner';

interface RouteMapProps {
  sales: RouteStop[];
}

const RouteMap: React.FC<RouteMapProps> = ({ sales }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      console.error("Missing Mapbox token");
      return;
    }

    if (!mapRef.current) {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-85.6681, 42.9634],
        zoom: 12,
      });

      mapRef.current.on('load', () => {
        mapRef.current?.resize();
      });
    }

    const map = mapRef.current;

    // Remove existing markers safely
    document.querySelectorAll('.mapbox-marker').forEach(el => el.remove());

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
      style={{
        width: '100%',
        height: '500px',
        borderRadius: '12px',
        marginTop: '1rem'
      }}
    />
  );
};

export default RouteMap;