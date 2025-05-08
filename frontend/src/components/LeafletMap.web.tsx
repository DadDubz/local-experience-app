import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface Spot {
  latitude: number;
  longitude: number;
  name: string;
}

const LeafletMap = ({ spot }: { spot: Spot }) => (
  <div style={{ height: '300px', width: '100%' }}>
    <MapContainer
      center={[spot.latitude, spot.longitude]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[spot.latitude, spot.longitude]}>
        <Popup>{spot.name}</Popup>
      </Marker>
    </MapContainer>
  </div>
);

export default LeafletMap;
