import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
  latitude: number;
  longitude: number;
  title?: string;
}

const MapViewComponent: React.FC<Props> = ({ latitude, longitude, title }) => {
  useEffect(() => {
    const map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.marker([latitude, longitude]).addTo(map).bindPopup(title ?? 'Marker').openPopup();

    return () => {
      map.remove();
    };
  }, [latitude, longitude, title]);

  return <div id="map" style={{ height: '100vh', width: '100%' }} />;
};

export default MapViewComponent;
