// src/components/NativeMap.web.tsx
import * as React from 'react';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 👇 THIS IS THE ICON FIX SECTION — insert this right after the imports
// It ensures the correct icons load instead of broken default URLs.
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// 👇 Your component code follows as usual
interface Spot {
  latitude: number;
  longitude: number;
  name: string;
}

const NativeMap = ({ spot }: { spot: Spot }) => {
  useEffect(() => {
    // Any map cleanup logic if needed
  }, []);

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <MapContainer
        center={[spot.latitude, spot.longitude]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
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
