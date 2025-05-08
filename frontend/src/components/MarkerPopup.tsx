// src/components/MarkerPopup.native.tsx
import ReactNative from 'react';
import { Marker, Callout } from 'react-native-maps';
import { View, Text } from 'react-native';

interface MarkerPopupProps {
  coordinate: { latitude: number; longitude: number };
  title: string;
  description?: string;
}

const MarkerPopup: ReactNative.FC<MarkerPopupProps> = ({ coordinate, title, description }) => (
  <Marker coordinate={coordinate}>
    <Callout>
      <View>
        <Text style={{ fontWeight: 'bold' }}>{title}</Text>
        {description && <Text>{description}</Text>}
      </View>
    </Callout>
  </Marker>
);

export default MarkerPopup;


// src/components/MarkerPopup.web.tsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MarkerPopupProps {
  coordinate: { latitude: number; longitude: number };
  title: string;
  description?: string;
}

const MarkerPopup: React.FC<MarkerPopupProps> = ({ coordinate, title, description }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([coordinate.latitude, coordinate.longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.marker([coordinate.latitude, coordinate.longitude])
      .addTo(map)
      .bindPopup(`<b>${title}</b><br>${description || ''}`)
      .openPopup();

    return () => {
      map.remove();
    };
  }, [coordinate.latitude, coordinate.longitude, title, description]);

  return <div ref={mapRef} style={{ height: '300px', width: '100%' }} />;
};

export default MarkerPopup;