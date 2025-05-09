// src/components/NativeMap.web.tsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Spot {
  latitude: number;
  longitude: number;
  name: string;
}

const NativeMap = ({ spot }: { spot: Spot }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([spot.latitude, spot.longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.marker([spot.latitude, spot.longitude])
      .addTo(map)
      .bindPopup(`<b>${spot.name}</b>`)
      .openPopup();

    return () => {
      map.remove();
    };
  }, [spot.latitude, spot.longitude, spot.name]);

  return <div ref={mapRef} style={{ height: '300px', width: '100%' }} />;
};

export default NativeMap;
