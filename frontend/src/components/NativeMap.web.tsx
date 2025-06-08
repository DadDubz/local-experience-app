// src/components/NativeMap.web.tsx

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// These imports require the image type declaration fix mentioned above
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const icon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Spot {
  latitude: number;
  longitude: number;
  name: string;
}

const NativeMap = ({ spot }: { spot: Spot }) => {
  useEffect(() => {
    // Fix for default marker icon path
    L.Marker.prototype.options.icon = icon;
  }, []);

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <MapContainer
        center={[spot.latitude, spot.longitude]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[spot.latitude, spot.longitude]}>
          <Popup>{spot.name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default NativeMap;
