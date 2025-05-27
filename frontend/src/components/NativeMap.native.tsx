// src/components/NativeMap.web.tsx
import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Spot {
  latitude: number;
  longitude: number;
  name: string;
}

const NativeMap = ({ spot }: { spot: Spot }) => {
  useEffect(() => {
    const map = L.map('leaflet-map').setView([spot.latitude, spot.longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker([spot.latitude, spot.longitude]).addTo(map).bindPopup(spot.name).openPopup();

    return () => {
      map.remove(); // Clean up
    };
  }, [spot]);

  return <div id="leaflet-map" style={{ height: '300px', width: '100%' }} />;
};

export default NativeMap;
